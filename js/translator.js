/**
 * translator.js — 中文 <-> 手语 翻译核心
 * 重点补强原项目"翻译"短板：把输入句子分段映射到词典手势序列。
 *
 * 算法：基于词典词条做「最长匹配」分词（含多字词与单字回退），
 *       无法匹配的字标记为 unknown 以提示用户。
 */

(function (global) {
  function getDict() {
    return global.SIGN_DICTIONARY || (typeof SIGN_DICTIONARY !== 'undefined' ? SIGN_DICTIONARY : []);
  }

  // 构造按长度降序排列的词表，便于最长匹配
  let WORD_LIST = null;
  function buildWordList() {
    if (WORD_LIST) return WORD_LIST;
    const dic = getDict();
    WORD_LIST = dic
      .map((g) => ({ word: g.word, g }))
      .sort((a, b) => b.word.length - a.word.length);
    return WORD_LIST;
  }

  const PUNCT = /[\s，。、！？；：""''（）().,!?;:]/g;

  /**
   * 中文句子 -> 手语序列
   * @param {string} text
   * @returns {{sequence:Array<{entry:object,raw:string}>, unknown:string[]}}
   */
  function textToSigns(text) {
    const dic = getDict();
    const list = buildWordList();
    const clean = (text || '').replace(PUNCT, '');
    const sequence = [];
    const unknown = [];
    let i = 0;
    while (i < clean.length) {
      let matched = null;
      for (const item of list) {
        const w = item.word;
        if (clean.substr(i, w.length) === w) { matched = item; break; }
      }
      if (matched) {
        sequence.push({ entry: matched.g, raw: matched.word });
        i += matched.word.length;
      } else {
        const ch = clean[i];
        // 单字回退：尝试找同字词条
        const single = dic.find((g) => g.word === ch);
        if (single) {
          sequence.push({ entry: single, raw: ch });
        } else {
          unknown.push(ch);
          sequence.push({ entry: null, raw: ch });
        }
        i += 1;
      }
    }
    return { sequence, unknown: Array.from(new Set(unknown)) };
  }

  // 手语 -> 文本（反向查询）
  function signToText(id) {
    const dic = getDict();
    const g = dic.find((x) => x.id === id);
    return g ? g.word : '';
  }

  // 分类统计（用于词典浏览）
  function groupByCategory() {
    const dic = getDict();
    const map = {};
    dic.forEach((g) => { (map[g.category] = map[g.category] || []).push(g); });
    return map;
  }

  function count() { return getDict().length; }

  const API = { textToSigns, signToText, groupByCategory, count, buildWordList };

  if (typeof window !== 'undefined') window.Translator = API;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
