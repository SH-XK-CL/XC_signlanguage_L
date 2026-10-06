/**
 * app.js — 主交互逻辑（识别 / 词典 / 翻译 / 训练 四大模块）
 * 依赖全局：SIGN_DICTIONARY, Recognizer, Translator, TTS, CameraController
 */
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const dic = window.SIGN_DICTIONARY;

  /* ---------------- Tab 切换 ---------------- */
  function initTabs() {
    document.querySelectorAll('.nav-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const t = btn.dataset.tab;
        document.querySelectorAll('.nav-btn').forEach((b) => b.classList.toggle('active', b === btn));
        document.querySelectorAll('.tab').forEach((s) => s.classList.toggle('active', s.id === 'tab-' + t));
      });
    });
  }

  /* ---------------- 识别模块 ---------------- */
  let cam = null;
  let recStreaming = false;
  let stableId = null;
  let stableCount = 0;
  const STABLE_THRESHOLD = 8;

  async function startCamera() {
    const video = $('video');
    const canvas = $('overlay');
    if (!window.CameraController) { $('rec-status').textContent = '摄像头模块未加载'; return; }
    cam = new window.CameraController(video, canvas, onFrame);
    try {
      await cam.start();
      recStreaming = true;
      $('btn-cam-start').textContent = '停止摄像头';
      $('rec-status').textContent = '已开启，请比出手势…';
    } catch (e) {
      $('rec-status').textContent = '无法访问摄像头：' + e.message;
    }
  }

  function stopCamera() {
    if (cam) cam.stop();
    recStreaming = false;
    stableId = null; stableCount = 0;
    $('btn-cam-start').textContent = '开启摄像头';
    $('rec-status').textContent = '已停止';
  }

  function findEntryByWord(word) {
    return (dic || []).find((g) => g.word === word) || null;
  }

  function onFrame({ hands }) {
    window.__lastHands = hands || []; // 供训练模块读取实时手状态
    if (!hands || hands.length === 0) {
      stableId = null; stableCount = 0;
      $('rec-result').textContent = '未检测到手';
      $('rec-candidates').textContent = '';
      return;
    }
    // 优先使用训练好的神经网络模型
    const model = window.__gestureModel;
    if (model) {
      const p = model.predict(window.extractFeatures(hands));
      if (stableId === p.label) stableCount++; else { stableId = p.label; stableCount = 1; }
      const entry = findEntryByWord(p.label);
      const conf = (p.confidence * 100).toFixed(0);
      $('rec-result').textContent = p.label + (entry ? '（' + entry.pinyin + '）' : '') + ' · 置信度 ' + conf + '%';
      $('rec-candidates').textContent = '手数: ' + hands.length + ' · 模型识别';
      if (stableCount === STABLE_THRESHOLD) window.TTS.speak(p.label);
      return;
    }
    // 回退：规则化识别
    const r = window.Recognizer.recognize(hands);
    $('rec-candidates').textContent = '手数: ' + r.handCount + ' · 规则识别';
    if (!r.best) {
      $('rec-result').textContent = '手形未知';
      return;
    }
    if (stableId === r.best.id) stableCount++; else { stableId = r.best.id; stableCount = 1; }
    $('rec-result').textContent = r.best.word + '（' + r.best.pinyin + '）— ' + r.best.meaning;
    if (stableCount === STABLE_THRESHOLD) window.TTS.speak(r.best.word);
  }

  /* ---------------- 词典模块 ---------------- */
  function renderDictionary(cat, kw) {
    const list = $('dict-list');
    const cats = window.Translator.groupByCategory();
    const catKeys = Object.keys(cats);
    // 分类按钮（仅首次）
    if (!$('dict-cats').dataset.built) {
      const all = document.createElement('button');
      all.className = 'chip active'; all.textContent = '全部';
      all.onclick = () => { setCat('全部'); };
      $('dict-cats').appendChild(all);
      catKeys.forEach((c) => {
        const b = document.createElement('button');
        b.className = 'chip'; b.textContent = c;
        b.onclick = () => setCat(c);
        $('dict-cats').appendChild(b);
      });
      $('dict-cats').dataset.built = '1';
    }
    let items = dic;
    if (cat && cat !== '全部') items = items.filter((g) => g.category === cat);
    if (kw) { kw = kw.trim(); items = items.filter((g) => g.word.includes(kw) || g.pinyin.includes(kw) || g.meaning.includes(kw)); }
    list.innerHTML = '';
    items.forEach((g) => {
      const card = document.createElement('div');
      card.className = 'dict-card';
      card.innerHTML = `<div class="dc-word">${g.word}</div>
        <div class="dc-meta">${g.pinyin} · ${g.category} · ${g.hands === 'double' ? '双手' : '单手'}${g.dynamic ? ' · 动态' : ''}${g.rec ? ' · 可识别' : ''}</div>
        <div class="dc-shape"><b>手形：</b>${g.handshape}</div>
        <div class="dc-move"><b>动作：</b>${g.movement}</div>
        <div class="dc-mean"><b>含义：</b>${g.meaning}</div>
        <button class="dc-speak" data-w="${g.word}">🔊 朗读</button>`;
      list.appendChild(card);
    });
    list.querySelectorAll('.dc-speak').forEach((b) => {
      b.onclick = () => window.TTS.speak(b.dataset.w);
    });
  }

  function setCat(c) {
    document.querySelectorAll('#dict-cats .chip').forEach((b) => b.classList.toggle('active', b.textContent === c));
    renderDictionary(c, $('dict-search').value);
  }

  /* ---------------- 翻译模块 ---------------- */
  function doTranslate() {
    const text = $('trans-input').value;
    const { sequence, unknown } = window.Translator.textToSigns(text);
    const out = $('trans-output');
    out.innerHTML = '';
    if (!sequence.length) { out.innerHTML = '<p class="hint">请输入中文…</p>'; return; }
    sequence.forEach((s) => {
      const card = document.createElement('div');
      card.className = 'sign-step' + (s.entry ? '' : ' unknown');
      card.innerHTML = s.entry
        ? `<span class="ss-word">${s.raw}</span><span class="ss-mean">${s.entry.word} · ${s.entry.meaning}</span>`
        : `<span class="ss-word">${s.raw}</span><span class="ss-mean">无对应手语</span>`;
      out.appendChild(card);
    });
    const tip = unknown.length ? `<p class="hint">以下字暂无数词：${unknown.join(' ')}</p>` : '';
    out.insertAdjacentHTML('beforeend', tip);
    out.dataset.text = text;
  }

  /* ---------------- 训练模块（采集样本 -> 训练神经网络 -> 本地保存） ---------------- */
  // trainSamples: { 标签: [ 特征向量(126), ... ] }
  let trainSamples = loadTrain();

  function loadTrain() {
    try { return JSON.parse(localStorage.getItem('sl_train_samples')) || {}; }
    catch (e) { return {}; }
  }
  function saveTrain() { localStorage.setItem('sl_train_samples', JSON.stringify(trainSamples)); }

  function renderTrain() {
    const list = $('train-samples');
    list.innerHTML = '';
    const labels = Object.keys(trainSamples);
    const total = labels.reduce((s, k) => s + trainSamples[k].length, 0);
    $('train-count').textContent = '已采集手势：' + labels.length + ' 个，样本：' + total + ' 条' + (window.__gestureModel ? '（当前已加载模型）' : '');
    labels.forEach((k) => {
      const row = document.createElement('div');
      row.className = 'train-row';
      row.innerHTML = `<span>${k}（${trainSamples[k].length}）</span>`;
      const del = document.createElement('button');
      del.textContent = '删除';
      del.onclick = () => { delete trainSamples[k]; saveTrain(); renderTrain(); };
      row.appendChild(del);
      list.appendChild(row);
    });
  }

  // 采集 10 帧当前手部特征
  function trainCapture() {
    const label = $('train-word').value.trim();
    if (!label) { $('train-status').textContent = '请先输入手势名称'; return; }
    if (!cam || !recStreaming) { $('train-status').textContent = '请先在「识别」页开启摄像头'; return; }
    const hands = window.__lastHands || [];
    if (!hands.length) { $('train-status').textContent = '未检测到手部，请比出手势'; return; }
    trainSamples[label] = trainSamples[label] || [];
    for (let i = 0; i < 10; i++) {
      const h = window.__lastHands;
      if (h && h.length) trainSamples[label].push(window.extractFeatures(h));
    }
    saveTrain(); renderTrain();
    $('train-status').textContent = `已为「${label}」采集 10 帧（共 ${trainSamples[label].length}）`;
  }

  // 用已采集样本训练神经网络
  function trainRun() {
    const labels = Object.keys(trainSamples);
    const total = labels.reduce((s, k) => s + trainSamples[k].length, 0);
    if (labels.length < 2) { $('train-status').textContent = '至少需要 2 个不同手势的样本才能训练'; return; }
    if (total < 20) { $('train-status').textContent = '样本偏少，建议每类 ≥20 帧再训练'; }
    const samples = [];
    labels.forEach((lab, idx) => {
      trainSamples[lab].forEach((x) => samples.push({ x, y: idx }));
    });
    $('train-status').textContent = '训练中…';
    // 让 UI 先刷新再计算
    setTimeout(() => {
      const model = new window.GestureModel(labels);
      model.train(samples, { epochs: 80, lr: 0.05, batch: 32, momentum: 0.9 });
      window.__gestureModel = model;
      // 快速自检
      let ok = 0; samples.forEach((s) => { if (model.predict(s.x).index === s.y) ok++; });
      const trainAcc = (ok / samples.length * 100).toFixed(1);
      $('train-status').textContent = `训练完成！训练集准确率 ${trainAcc}%（${labels.length} 类）。识别页已切换为模型识别。`;
      renderTrain();
    }, 30);
  }

  function trainSave() {
    if (!window.__gestureModel) { $('train-status').textContent = '暂无模型可保存，请先训练'; return; }
    window.__gestureModel.save('sl_gesture_model');
    // 同时提供下载
    try {
      const blob = new Blob([JSON.stringify(window.__gestureModel.toJSON())], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = 'gesture_model.json'; a.click();
      URL.revokeObjectURL(a.href);
    } catch (e) {}
    $('train-status').textContent = '模型已保存到本机(localStorage)并触发下载';
  }

  function trainLoad() {
    const m = window.GestureModel.load('sl_gesture_model');
    if (m) { window.__gestureModel = m; $('train-status').textContent = '已加载保存的模型（' + m.labels.length + ' 类）'; renderTrain(); }
    else { $('train-status').textContent = '未找到已保存的模型'; }
  }

  function trainClear() {
    trainSamples = {}; saveTrain(); renderTrain();
    $('train-status').textContent = '已清空采集样本';
  }

  /* ---------------- 初始化 ---------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initTabs();

    $('btn-cam-start').addEventListener('click', () => {
      if (recStreaming) stopCamera(); else startCamera();
    });

    // 词典
    $('dict-search').addEventListener('input', () => renderDictionary(getActiveCat(), $('dict-search').value));
    renderDictionary('全部', '');

    // 翻译
    $('btn-trans').addEventListener('click', doTranslate);
    $('btn-speak').addEventListener('click', () => {
      const t = $('trans-output').dataset.text;
      if (t) window.TTS.speak(t);
    });

    // 训练
    $('btn-train-capture').addEventListener('click', trainCapture);
    $('btn-train-run').addEventListener('click', trainRun);
    $('btn-train-save').addEventListener('click', trainSave);
    $('btn-train-load').addEventListener('click', trainLoad);
    $('btn-train-clear').addEventListener('click', trainClear);
    renderTrain();

    // 启动加载内置预训练模型（仅 http(s) 环境；file:// 打开时跳过）
    if (location.protocol.startsWith('http')) {
      fetch('model.json').then((r) => r.json()).then((j) => {
        window.__gestureModel = window.GestureModel.fromJSON(j);
        $('rec-status').textContent = '已加载内置模型（' + window.__gestureModel.labels.length + ' 类），开启摄像头即可识别';
      }).catch(() => {});
    }
  });

  function getActiveCat() {
    const a = document.querySelector('#dict-cats .chip.active');
    return a ? a.textContent : '全部';
  }
})();
