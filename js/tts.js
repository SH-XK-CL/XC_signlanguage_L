/**
 * tts.js — 语音输出模块（Web Speech API）
 * 选用 zh-CN 中文语音，朗读翻译结果/手语词条，弥补听障沟通中的语音反馈。
 */

(function (global) {
  let zhVoice = null;
  let supported = ('speechSynthesis' in global) && ('SpeechSynthesisUtterance' in global);

  function loadVoices() {
    if (!supported) return;
    const voices = global.speechSynthesis.getVoices();
    // 优先选择中文语音
    zhVoice = voices.find((v) => /zh|cmn|Chinese/i.test(v.lang)) || null;
  }

  if (supported) {
    loadVoices();
    global.speechSynthesis.onvoiceschanged = loadVoices;
  }

  function speak(text, opts = {}) {
    if (!supported || !text) return false;
    global.speechSynthesis.cancel();
    const u = new global.SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN';
    if (zhVoice) u.voice = zhVoice;
    u.rate = opts.rate ?? 1.0;
    u.pitch = opts.pitch ?? 1.0;
    global.speechSynthesis.speak(u);
    return true;
  }

  function stop() { if (supported) global.speechSynthesis.cancel(); }

  const API = { speak, stop, isSupported: () => supported, loadVoices };
  if (typeof window !== 'undefined') window.TTS = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
