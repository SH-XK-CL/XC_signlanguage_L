/**
 * tools/train.js — 用合成 landmarks 训练初始手势识别模型
 * 运行：node tools/train.js  （在项目根目录）
 * 产物：model.json（含权重、标签），可直接被浏览器 App 加载
 *
 * 说明：真实使用请在 App「训练」页用摄像头采集本人样本并重新训练。
 *       此处合成数据用于验证模型管线可端到端工作。
 */
const path = require('path');
const fs = require('fs');
const { SIGN_DICTIONARY } = require(path.join(__dirname, '..', 'js', 'dictionary.js'));
const { GestureModel, extractFeatures } = require(path.join(__dirname, '..', 'js', 'model.js'));

function randn() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// 依据手指伸展状态构造 21 点手部 landmarks
function buildLandmarks(states, opts = {}) {
  const lm = new Array(21);
  lm[0] = { x: 0, y: 0, z: 0 };
  const groups = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16],[17,18,19,20]];
  for (let f = 0; f < 5; f++) {
    const [a,b,c,d] = groups[f];
    const ext = states[f] === 1;
    const ang = (f - 2) * 0.35;
    const dx = Math.sin(ang), dy = -Math.cos(ang);
    const len = ext ? 0.5 : 0.15;
    lm[a] = { x: 0.2 * dx, y: 0.2 * dy, z: 0 };
    lm[b] = { x: 0.35 * dx, y: 0.35 * dy, z: 0 };
    lm[c] = { x: 0.45 * dx, y: 0.45 * dy, z: 0 };
    lm[d] = { x: len * dx, y: len * dy, z: 0 };
  }
  if (states[0] === 1) {
    if (opts.thumbUp) lm[4] = { x: 0, y: -0.5, z: 0 };       // 拇指向上（好/是）
    else lm[4] = { x: 0, y: 0, z: 0.5 };                       // 拇指朝前（我）
  }
  return lm;
}

function makeSample(states, opts, noise = 0.02) {
  const lm = buildLandmarks(states, opts);
  for (let i = 0; i < 21; i++) {
    lm[i].x += randn() * noise; lm[i].y += randn() * noise; lm[i].z += randn() * noise * 0.5;
  }
  return extractFeatures([lm]);
}

// 从可识别词条中提取「唯一手形」类别（避免同手形多标签导致不可分）
const classes = []; // {key, label, states, thumbUp}
const seen = {};
SIGN_DICTIONARY.forEach((g) => {
  if (!g.rec || !g.sig) return;
  const key = g.sig.f.join('') + (g.sig.thumbUp ? '-U' : '');
  if (seen[key]) return;
  seen[key] = true;
  classes.push({ key, label: g.word, states: g.sig.f, thumbUp: !!g.sig.thumbUp });
});

console.log('合成类别数:', classes.length, '→', classes.map((c) => c.label).join(', '));

const labels = classes.map((c) => c.label);
const train = [], test = [];
classes.forEach((c, idx) => {
  for (let i = 0; i < 220; i++) train.push({ x: makeSample(c.states, { thumbUp: c.thumbUp }, 0.02), y: idx });
  for (let i = 0; i < 50; i++) test.push({ x: makeSample(c.states, { thumbUp: c.thumbUp }, 0.02), y: idx });
});

const model = new GestureModel(labels);
console.log('开始训练…');
model.train(train, { epochs: 80, lr: 0.05, batch: 32, momentum: 0.9 }, (ep, loss) => {
  if (ep % 20 === 0 || ep === 1) console.log(`  epoch ${ep}, loss=${loss.toFixed(4)}`);
});

// 评估
let correct = 0;
test.forEach((s) => { const p = model.predict(s.x); if (p.index === s.y) correct++; });
const acc = correct / test.length;
console.log(`测试集准确率: ${(acc * 100).toFixed(2)}%  (${correct}/${test.length})`);

// 保存
const outPath = path.join(__dirname, '..', 'model.json');
fs.writeFileSync(outPath, JSON.stringify(model.toJSON()));
console.log('模型已保存:', outPath, `(${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
