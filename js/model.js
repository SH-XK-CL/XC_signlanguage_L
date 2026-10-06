/**
 * model.js — 无依赖手势识别神经网络（浏览器 / Node 通用）
 * 特征：最多双手 × 21 landmarks(x,y,z)，以手腕为原点、手掌尺寸归一化 → 126 维向量
 * 结构：输入(126) -> 隐藏层(relu) -> 输出层(softmax, 类别=标签数)
 * 训练：mini-batch SGD + 动量，交叉熵损失
 * 持久化：浏览器 localStorage；Node 文件
 */
(function (global) {
  'use strict';

  const FEAT_DIM = 126; // 2 手 × 21 点 × 3
  const HIDDEN = 64;

  function dist3(a, b) {
    const dx = a.x - b.x, dy = a.y - b.y, dz = (a.z || 0) - (b.z || 0);
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  // 从 MediaPipe 的 hands（每只 21 点）提取 126 维特征
  function extractFeatures(hands) {
    const out = new Array(FEAT_DIM).fill(0);
    if (!hands) return out;
    for (let h = 0; h < 2; h++) {
      const lm = hands[h];
      if (!lm || lm.length < 21) continue;
      const base = h * 63;
      const w = lm[0];
      const scale = dist3(w, lm[9]) || 1e-6;
      for (let i = 0; i < 21; i++) {
        out[base + i * 3] = (lm[i].x - w.x) / scale;
        out[base + i * 3 + 1] = (lm[i].y - w.y) / scale;
        out[base + i * 3 + 2] = ((lm[i].z || 0) - (w.z || 0)) / scale;
      }
    }
    return out;
  }

  function randn() {
    // Box-Muller
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  class GestureModel {
    constructor(labels, hidden = HIDDEN) {
      this.labels = labels.slice();
      this.n = FEAT_DIM;
      this.h = hidden;
      this.c = labels.length;
      this._initWeights();
    }

    _initWeights() {
      const xav = (fan) => Math.sqrt(2 / fan); // He/Xavier 近似
      const W1 = [];
      for (let i = 0; i < this.h; i++) { const r = xav(this.n); const row = []; for (let j = 0; j < this.n; j++) row.push(randn() * r); W1.push(row); }
      const b1 = new Array(this.h).fill(0);
      const W2 = [];
      for (let k = 0; k < this.c; k++) { const r = xav(this.h); const row = []; for (let i = 0; i < this.h; i++) row.push(randn() * r); W2.push(row); }
      const b2 = new Array(this.c).fill(0);
      this.W1 = W1; this.b1 = b1; this.W2 = W2; this.b2 = b2;
    }

    _forward(x) {
      const z1 = new Array(this.h).fill(0);
      for (let i = 0; i < this.h; i++) {
        let s = this.b1[i];
        const row = this.W1[i];
        for (let j = 0; j < this.n; j++) s += row[j] * x[j];
        z1[i] = s;
      }
      const a1 = z1.map((v) => (v > 0 ? v : 0));
      const z2 = new Array(this.c).fill(0);
      for (let k = 0; k < this.c; k++) {
        let s = this.b2[k];
        const row = this.W2[k];
        for (let i = 0; i < this.h; i++) s += row[i] * a1[i];
        z2[k] = s;
      }
      // softmax
      let max = -Infinity; for (let k = 0; k < this.c; k++) if (z2[k] > max) max = z2[k];
      const exps = z2.map((v) => Math.exp(v - max));
      let sum = 0; for (let k = 0; k < this.c; k++) sum += exps[k];
      const a2 = exps.map((v) => v / sum);
      return { z1, a1, a2 };
    }

    predict(x) {
      const { a2 } = this._forward(x);
      let best = 0; for (let k = 1; k < this.c; k++) if (a2[k] > a2[best]) best = k;
      return { label: this.labels[best], index: best, confidence: a2[best], probs: a2 };
    }

    /**
     * 训练
     * @param {{x:number[], y:number}[]} samples
     * @param {object} opts {epochs, lr, batch, momentum}
     * @param {(epoch:number, loss:number)=>void} onEpoch
     */
    train(samples, opts = {}, onEpoch) {
      const epochs = opts.epochs || 60;
      const lr = opts.lr || 0.05;
      const batch = opts.batch || 32;
      const momentum = opts.momentum || 0.9;
      const n = samples.length;
      // 动量缓存
      const vW1 = this.W1.map((r) => r.map(() => 0));
      const vb1 = new Array(this.h).fill(0);
      const vW2 = this.W2.map((r) => r.map(() => 0));
      const vb2 = new Array(this.c).fill(0);

      for (let ep = 0; ep < epochs; ep++) {
        // 洗牌
        for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [samples[i], samples[j]] = [samples[j], samples[i]]; }
        let totalLoss = 0, steps = 0;
        for (let s = 0; s < n; s += batch) {
          const end = Math.min(s + batch, n);
          const m = end - s;
          // 梯度累加器
          const gW1 = this.W1.map((r) => r.map(() => 0));
          const gb1 = new Array(this.h).fill(0);
          const gW2 = this.W2.map((r) => r.map(() => 0));
          const gb2 = new Array(this.c).fill(0);

          for (let t = s; t < end; t++) {
            const { a1, a2 } = this._forward(samples[t].x);
            const y = samples[t].y;
            // 输出层梯度
            const dz2 = a2.slice(); dz2[y] -= 1; // softmax + CE
            for (let k = 0; k < this.c; k++) {
              gb2[k] += dz2[k];
              const w2row = this.W2[k];
              const g2row = gW2[k];
              for (let i = 0; i < this.h; i++) g2row[i] += dz2[k] * a1[i];
            }
            // 隐藏层梯度
            const da1 = new Array(this.h).fill(0);
            for (let k = 0; k < this.c; k++) for (let i = 0; i < this.h; i++) da1[i] += this.W2[k][i] * dz2[k];
            for (let i = 0; i < this.h; i++) {
              const act = a1[i] > 0 ? 1 : 0;
              const dzi = da1[i] * act;
              gb1[i] += dzi;
              const g1row = gW1[i];
              const w1row = this.W1[i];
              for (let j = 0; j < this.n; j++) g1row[j] += dzi * samples[t].x[j];
            }
            totalLoss += -Math.log(Math.max(a2[y], 1e-12));
            steps++;
          }
          // 更新（带动量）
          for (let i = 0; i < this.h; i++) {
            const g1row = gW1[i]; const v1row = vW1[i]; const w1row = this.W1[i];
            for (let j = 0; j < this.n; j++) { const g = g1row[j] / m; v1row[j] = momentum * v1row[j] - lr * g; w1row[j] += v1row[j]; }
            const gb = gb1[i] / m; vb1[i] = momentum * vb1[i] - lr * gb; this.b1[i] += vb1[i];
          }
          for (let k = 0; k < this.c; k++) {
            const g2row = gW2[k]; const v2row = vW2[k]; const w2row = this.W2[k];
            for (let i = 0; i < this.h; i++) { const g = g2row[i] / m; v2row[i] = momentum * v2row[i] - lr * g; w2row[i] += v2row[i]; }
            const gb = gb2[k] / m; vb2[k] = momentum * vb2[k] - lr * gb; this.b2[k] += vb2[k];
          }
        }
        if (onEpoch) onEpoch(ep + 1, totalLoss / Math.max(steps, 1));
      }
    }

    toJSON() {
      return { v: 1, n: this.n, h: this.h, c: this.c, labels: this.labels, W1: this.W1, b1: this.b1, W2: this.W2, b2: this.b2 };
    }

    static fromJSON(obj) {
      const m = new GestureModel(obj.labels, obj.h);
      m.W1 = obj.W1; m.b1 = obj.b1; m.W2 = obj.W2; m.b2 = obj.b2; m.n = obj.n; m.c = obj.c;
      return m;
    }

    // 持久化：浏览器 -> localStorage；Node -> 文件
    save(key = 'sl_gesture_model') {
      const json = JSON.stringify(this.toJSON());
      if (typeof window !== 'undefined' && window.localStorage) { window.localStorage.setItem(key, json); return true; }
      return json; // Node 下由调用方写文件
    }

    static load(key = 'sl_gesture_model', jsonStr) {
      let json = jsonStr;
      if (!json && typeof window !== 'undefined' && window.localStorage) json = window.localStorage.getItem(key);
      if (!json) return null;
      try { return GestureModel.fromJSON(JSON.parse(json)); } catch (e) { return null; }
    }
  }

  const API = { GestureModel, extractFeatures, FEAT_DIM, randn, dist3 };
  if (typeof window !== 'undefined') window.GestureModel = GestureModel, window.extractFeatures = extractFeatures;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
