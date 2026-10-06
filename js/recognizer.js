/**
 * recognizer.js — 基于 MediaPipe Hands 21点 landmarks 的规则化手势识别
 * 兼容浏览器全局(window.Recognizer)与 Node(module) 以便单测。
 *
 * 设计要点：
 *  - 计算每根手指伸展状态 (拇指/食指/中指/无名指/小指) -> [0,0,0,0,0]
 *  - 依据手形签名 sig.f 在词典可识别子集(rec:true)中做精确匹配
 *  - 通过 thumbUp / point / palm 等方向标志消解歧义
 *  - 支持双手(handCount)计数；双手同时识别为后续增强预留接口
 */

(function (global) {
  // MediaPipe Hands 21 个关键点的索引分组
  const TIP = [4, 8, 12, 16, 20];      // 各指指尖
  const MCP = [2, 5, 9, 13, 17];       // 各指掌指关节
  const PIP = [3, 6, 10, 14, 18];      // 各指近端指间关节

  function dist3(a, b) {
    const dx = a.x - b.x, dy = a.y - b.y, dz = (a.z || 0) - (b.z || 0);
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  // 计算单只手的手指伸展状态。landmarks: 21 个点 {x,y,z}
  function fingerStates(lm) {
    const wrist = lm[0];
    const states = [0, 0, 0, 0, 0];
    for (let i = 1; i < 5; i++) {
      // 指尖到手腕距离 > 掌指关节到手腕距离 => 该指伸展
      const tipToWrist = dist3(lm[TIP[i]], wrist);
      const mcpToWrist = dist3(lm[MCP[i]], wrist);
      states[i] = tipToWrist > mcpToWrist * 1.02 ? 1 : 0;
    }
    // 拇指：指尖到手腕 > 掌指关节到手腕 即视为伸展（含方向修正）
    states[0] = dist3(lm[TIP[0]], wrist) > dist3(lm[MCP[0]], wrist) * 1.02 ? 1 : 0;
    return states;
  }

  // 拇指是否朝上（tip 明显高于 mcp，屏幕坐标 y 越小越高）
  function isThumbUp(lm) {
    return lm[TIP[0]].y < lm[MCP[0]].y - 0.04;
  }

  // 掌心是否朝前（手腕在手指下方，整体竖直展开）粗略判定
  function isPalmForward(lm) {
    const mid = lm[9]; // 中指掌指关节，代表手掌中心高度
    const tip = lm[12];
    return tip.y < mid.y; // 手指朝上竖起
  }

  // 将计算出的手指状态与词典签名比较（带容差，默认精确）
  function matchSignatures(states, flags) {
    const dic = (global.SIGN_DICTIONARY || (typeof SIGN_DICTIONARY !== 'undefined' ? SIGN_DICTIONARY : []));
    const out = [];
    for (const g of dic) {
      if (!g.rec || !g.sig) continue;
      const sig = g.sig;
      let ok = true;
      for (let i = 0; i < 5; i++) {
        if (sig.f[i] !== states[i]) { ok = false; break; }
      }
      if (!ok) continue;
      // 方向标志校验
      if (sig.thumbUp !== undefined && !!flags.thumbUp !== !!sig.thumbUp) continue;
      if (sig.palm !== undefined && !!flags.palm !== !!sig.palm) continue;
      if (sig.point !== undefined && !!flags.point !== !!sig.point) continue;
      out.push(g);
    }
    return out;
  }

  /**
   * 识别入口
   * @param {Array} hands  MediaPipe 返回的多个手，每个为 21 点数组
   * @returns {{handCount:number, best:object|null, candidates:object[]}}
   */
  function recognize(hands) {
    if (!hands || hands.length === 0) return { handCount: 0, best: null, candidates: [] };
    const handCount = hands.length;
    const allCandidates = [];

    hands.forEach((lm) => {
      const states = fingerStates(lm);
      const flags = {
        thumbUp: isThumbUp(lm),
        palm: isPalmForward(lm),
        point: states[1] === 1 && states[2] === 0 && states[3] === 0 && states[4] === 0 && states[0] === 0
      };
      const matched = matchSignatures(states, flags);
      matched.forEach((g) => allCandidates.push({ g, states, flags }));
    });

    if (allCandidates.length === 0) return { handCount, best: null, candidates: [] };

    // 排序：匹配标志越多的越优先；再按非伸展手指数量
    allCandidates.sort((a, b) => {
      const sa = (a.g.sig.thumbUp ? 1 : 0) + (a.g.sig.palm ? 1 : 0) + (a.g.sig.point ? 1 : 0);
      const sb = (b.g.sig.thumbUp ? 1 : 0) + (b.g.sig.palm ? 1 : 0) + (b.g.sig.point ? 1 : 0);
      if (sb !== sa) return sb - sa;
      const ca = a.states.reduce((s, v) => s + v, 0);
      const cb = b.states.reduce((s, v) => s + v, 0);
      return ca - cb;
    });

    return {
      handCount,
      best: allCandidates[0].g,
      candidates: allCandidates.map((c) => c.g)
    };
  }

  const API = { fingerStates, isThumbUp, isPalmForward, matchSignatures, recognize, dist3 };

  if (typeof window !== 'undefined') window.Recognizer = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
