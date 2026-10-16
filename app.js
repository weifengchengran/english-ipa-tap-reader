// 音标点读 - 前端逻辑（Neo-Brutalist）
// 元音按嘴部形状（舌位前后）分组；辅音按发音部位 × 清浊分组。
// 支持中英双语，切换后写入 localStorage 记忆。

const VOWEL_ORDER = ["Front vowel", "Central vowel", "Back vowel", "Diphthong", "R-colored vowel"];
const PLACE_KEYS = ["双唇音", "唇齿音", "齿间音", "齿龈音", "龈后音", "硬腭音", "软腭音", "声门音"];

const LANGS = {
  zh: {
    appTitle: "音标点读",
    subtitle: "点击音标听发音 · 点击示例词听单词",
    statSounds: "音标",
    statWords: "例词",
    navAria: "分类导航",
    loading: "加载中…",
    vowelsTitle: "元音 Vowels",
    consonantsTitle: "辅音 Consonants",
    hintMouth: "按嘴部形状",
    hintPlace: "按发音部位 × 清浊",
    voiceless: "清音",
    voiced: "浊音",
    playSound: "播放音标",
    playWord: "播放示例词",
    clearToVoice: "清→浊",
    footer: "音标发音 & 示例词发音：Sounds American（美音真人朗读）",
    vowels: {
      "Front vowel": "前元音 · 不圆唇",
      "Central vowel": "中元音 · 不圆唇",
      "Back vowel": "后元音 · 圆唇",
      "Diphthong": "双元音 · 口型滑动",
      "R-colored vowel": "卷舌元音",
    },
    places: {
      "双唇音": "双唇音",
      "唇齿音": "唇齿音",
      "齿间音": "齿间音",
      "齿龈音": "齿龈音",
      "龈后音": "龈后音",
      "硬腭音": "硬腭音",
      "软腭音": "软腭音",
      "声门音": "声门音",
    },
  },
  en: {
    appTitle: "IPA Tap-to-Read",
    subtitle: "Tap a symbol to hear it · Tap a word to hear it",
    statSounds: "sounds",
    statWords: "words",
    navAria: "Categories",
    loading: "Loading…",
    vowelsTitle: "Vowels",
    consonantsTitle: "Consonants",
    hintMouth: "by mouth shape",
    hintPlace: "by place × voicing",
    voiceless: "voiceless",
    voiced: "voiced",
    playSound: "Play sound",
    playWord: "Play word",
    clearToVoice: "voiceless → voiced",
    footer: "Sounds & words: Sounds American (American English)",
    vowels: {
      "Front vowel": "Front · unrounded",
      "Central vowel": "Central · unrounded",
      "Back vowel": "Back · rounded",
      "Diphthong": "Diphthong · glide",
      "R-colored vowel": "R-colored",
    },
    places: {
      "双唇音": "Bilabial",
      "唇齿音": "Labiodental",
      "齿间音": "Interdental",
      "齿龈音": "Alveolar",
      "龈后音": "Post-alveolar",
      "硬腭音": "Palatal",
      "软腭音": "Velar",
      "声门音": "Glottal",
    },
  },
  ja: {
    appTitle: "発音記号タップ",
    subtitle: "記号をタップして発音 · 単語をタップして発音",
    statSounds: "記号",
    statWords: "単語",
    navAria: "カテゴリ",
    loading: "読み込み中…",
    vowelsTitle: "母音 Vowels",
    consonantsTitle: "子音 Consonants",
    hintMouth: "口の形で分類",
    hintPlace: "調音位置 × 清濁",
    voiceless: "清音",
    voiced: "濁音",
    playSound: "音を再生",
    playWord: "単語を再生",
    clearToVoice: "清→濁",
    footer: "音声：Sounds American（アメリカ英語・実声）",
    vowels: {
      "Front vowel": "前舌母音 · 非円唇",
      "Central vowel": "中舌母音 · 非円唇",
      "Back vowel": "後舌母音 · 円唇",
      "Diphthong": "二重母音 · 口の動き",
      "R-colored vowel": "そり舌母音",
    },
    places: {
      "双唇音": "両唇音",
      "唇齿音": "唇歯音",
      "齿间音": "歯間音",
      "齿龈音": "歯茎音",
      "龈后音": "後部歯茎音",
      "硬腭音": "硬口蓋音",
      "软腭音": "軟口蓋音",
      "声门音": "声門音",
    },
  },
};

let lang = localStorage.getItem("ipa-lang");
if (!lang || !LANGS[lang]) {
  const nav = (navigator.language || "").toLowerCase();
  lang = nav.startsWith("en") ? "en" : nav.startsWith("ja") ? "ja" : "zh";
}

function t() {
  return LANGS[lang] || LANGS.zh;
}

const player = new Audio();
let activeBtn = null;

function setActive(btn) {
  if (activeBtn) activeBtn.classList.remove("playing");
  activeBtn = btn;
  if (btn) btn.classList.add("playing");
}

function togglePlay(btn) {
  if (activeBtn === btn && !player.paused) {
    player.pause();
    player.currentTime = 0;
    setActive(null);
    return;
  }
  player.src = btn.dataset.audio;
  player.play().catch((e) => console.warn(e));
  setActive(btn);
}

player.addEventListener("ended", () => setActive(null));

function makeCard(p) {
  const card = document.createElement("div");
  card.className = "card";

  if (p.type === "consonant") {
    const badge = document.createElement("span");
    badge.className = "badge " + (p.voicing === "清" ? "qing" : "zhuo");
    badge.textContent = p.voicing === "清" ? t().voiceless : t().voiced;
    card.append(badge);
  }

  const ipaBtn = document.createElement("button");
  ipaBtn.className = "ipa-btn";
  ipaBtn.textContent = p.ipa;
  ipaBtn.dataset.audio = p.phoneme_audio;
  ipaBtn.title = `${t().playSound} /${p.ipa}/`;
  ipaBtn.addEventListener("click", () => togglePlay(ipaBtn));

  const wordBtn = document.createElement("button");
  wordBtn.className = "word-btn";
  wordBtn.dataset.audio = p.word_audio;
  wordBtn.title = t().playWord;
  const wordText = document.createElement("span");
  wordText.className = "word-text";
  wordText.textContent = p.example;
  const wordIpa = document.createElement("span");
  wordIpa.className = "word-ipa";
  wordIpa.textContent = `/${p.example_ipa}/`;
  wordBtn.append(wordText, wordIpa);
  wordBtn.addEventListener("click", () => togglePlay(wordBtn));

  card.append(ipaBtn, wordBtn);
  return card;
}

function makeGrid(items) {
  const grid = document.createElement("div");
  grid.className = "grid";
  items.forEach((p) => grid.append(makeCard(p)));
  return grid;
}

function makeSection(id, title, count, items, tone) {
  const section = document.createElement("section");
  section.className = "section";
  section.id = id;

  const head = document.createElement("div");
  head.className = "section-head";
  const dot = document.createElement("span");
  dot.className = "section-dot " + tone;
  const h = document.createElement("h3");
  h.className = "section-title";
  h.textContent = title;
  const countEl = document.createElement("span");
  countEl.className = "section-count";
  countEl.textContent = count;
  head.append(dot, h, countEl);

  section.append(head, makeGrid(items));
  return section;
}

function render() {
  const app = document.getElementById("app");
  app.innerHTML = "";

  const vowels = PHONEMES.filter((p) => p.type === "vowel");
  const consonants = PHONEMES.filter((p) => p.type === "consonant");

  const navItems = [];

  // ---- 元音块 ----
  const vBlock = document.createElement("div");
  vBlock.className = "block";
  const vTitle = document.createElement("h2");
  vTitle.className = "block-title";
  vTitle.innerHTML = `<span class="block-emoji">👄</span>${t().vowelsTitle}<span class="block-hint">${t().hintMouth}</span>`;
  vBlock.append(vTitle);

  VOWEL_ORDER.forEach((cat, ci) => {
    const items = vowels.filter((p) => p.category === cat);
    if (!items.length) return;
    const label = t().vowels[cat];
    const id = `sec-vowel-${ci}`;
    navItems.push({ id, label: label.split(" · ")[0], tone: "vowel" });
    vBlock.append(makeSection(id, label, items.length, items, "vowel"));
  });
  app.append(vBlock);

  // ---- 辅音块 ----
  const cBlock = document.createElement("div");
  cBlock.className = "block";
  const cTitle = document.createElement("h2");
  cTitle.className = "block-title";
  cTitle.innerHTML = `<span class="block-emoji">🗣️</span>${t().consonantsTitle}<span class="block-hint">${t().hintPlace}</span>`;
  cBlock.append(cTitle);

  PLACE_KEYS.forEach((place, pi) => {
    const items = consonants
      .filter((p) => p.place === place)
      .sort((a, b) => (a.voicing === b.voicing ? a.index - b.index : a.voicing === "清" ? -1 : 1));
    if (!items.length) return;
    const label = t().places[place];
    const id = `sec-cons-${pi}`;
    navItems.push({ id, label, tone: "consonant" });
    cBlock.append(makeSection(id, `${label} · ${t().clearToVoice}`, items.length, items, "consonant"));
  });
  app.append(cBlock);

  renderNav(navItems);
}

function renderNav(items) {
  const nav = document.getElementById("nav");
  nav.innerHTML = "";
  items.forEach((it) => {
    const a = document.createElement("a");
    a.className = "nav-chip " + it.tone;
    a.href = "#" + it.id;
    a.textContent = it.label;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const el = document.getElementById(it.id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    nav.append(a);
  });
}

function applyStatic() {
  document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
  document.title = lang === "en" ? "IPA Tap-to-Read" : lang === "ja" ? "発音記号タップ · English IPA" : "音标点读 · English IPA";
  document.getElementById("app-title").textContent = t().appTitle;
  document.getElementById("app-subtitle").textContent = t().subtitle;
  document.getElementById("stat-sounds").textContent = t().statSounds;
  document.getElementById("stat-words").textContent = t().statWords;
  document.getElementById("loading").textContent = t().loading;
  document.getElementById("app-footer").textContent = t().footer;
  document.getElementById("nav").setAttribute("aria-label", t().navAria);
  document.querySelectorAll(".lang-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.lang === lang);
  });
}

document.querySelectorAll(".lang-btn").forEach((b) => {
  b.addEventListener("click", () => {
    lang = b.dataset.lang;
    localStorage.setItem("ipa-lang", lang);
    applyStatic();
    render();
  });
});

applyStatic();
render();
