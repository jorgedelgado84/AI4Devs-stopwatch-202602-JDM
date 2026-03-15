const timeEl   = document.getElementById('time');
const msEl      = document.getElementById('ms');
const btnStart  = document.getElementById('btn-start');
const btnClear  = document.getElementById('btn-clear');
const btnLangEs = document.getElementById('btn-lang-es');
const btnLangEn = document.getElementById('btn-lang-en');

// ── Traducciones ──────────────────────────────────────────────
const i18n = {
  es: {
    start:       'Iniciar',
    pause:       'Pausar',
    clear:       'Limpiar',
    ariaTimer:   'Cronómetro',
    ariaStart:   'Iniciar cronómetro',
    ariaPause:   'Pausar cronómetro',
    ariaClear:   'Reiniciar cronómetro',
    title:       'Cronómetro / Stopwatch',
    langLabel:   'Seleccionar idioma',
  },
  en: {
    start:       'Start',
    pause:       'Pause',
    clear:       'Clear',
    ariaTimer:   'Stopwatch',
    ariaStart:   'Start stopwatch',
    ariaPause:   'Pause stopwatch',
    ariaClear:   'Reset stopwatch',
    title:       'Stopwatch / Cronómetro',
    langLabel:   'Select language',
  },
};

// ── Estado ────────────────────────────────────────────────────
const state = {
  startTime: 0,
  elapsed:   0,
  rafId:     null,
  running:   false,
  lang:      'es',
};

// ── Helpers ───────────────────────────────────────────────────
function pad(n, digits) {
  return String(n).padStart(digits, '0');
}

function t(key) {
  return i18n[state.lang][key];
}

// ── Render ────────────────────────────────────────────────────
function render(ms) {
  const totalSeconds  = Math.floor(ms / 1000);
  const hours         = Math.floor(totalSeconds / 3600);
  const minutes       = Math.floor((totalSeconds % 3600) / 60);
  const seconds       = totalSeconds % 60;
  const milliseconds  = ms % 1000;

  timeEl.textContent = `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)}`;
  msEl.textContent   = pad(milliseconds, 3);
}

// ── Cronómetro ────────────────────────────────────────────────
function tick() {
  state.elapsed = Date.now() - state.startTime;
  render(state.elapsed);
  state.rafId = requestAnimationFrame(tick);
}

function start() {
  state.startTime = Date.now() - state.elapsed;
  state.rafId     = requestAnimationFrame(tick);
  state.running   = true;
  btnStart.textContent = t('pause');
  btnStart.classList.add('paused');
  btnStart.setAttribute('aria-label', t('ariaPause'));
}

function pause() {
  cancelAnimationFrame(state.rafId);
  state.rafId   = null;
  state.running = false;
  btnStart.textContent = t('start');
  btnStart.classList.remove('paused');
  btnStart.setAttribute('aria-label', t('ariaStart'));
}

function reset() {
  pause();
  state.elapsed = 0;
  render(0);
}

// ── Idioma ────────────────────────────────────────────────────
function applyLang(lang) {
  state.lang = lang;
  document.documentElement.lang = lang;
  document.title = t('title');

  const display = document.querySelector('.display');
  display.setAttribute('aria-label', t('ariaTimer'));

  btnStart.textContent = state.running ? t('pause') : t('start');
  btnStart.setAttribute('aria-label', state.running ? t('ariaPause') : t('ariaStart'));

  btnClear.textContent = t('clear');
  btnClear.setAttribute('aria-label', t('ariaClear'));

  const langGroup = document.querySelector('.lang-switcher');
  langGroup.setAttribute('aria-label', t('langLabel'));

  btnLangEs.classList.toggle('active', lang === 'es');
  btnLangEn.classList.toggle('active', lang === 'en');
  btnLangEs.setAttribute('aria-pressed', String(lang === 'es'));
  btnLangEn.setAttribute('aria-pressed', String(lang === 'en'));
}

// ── Eventos ───────────────────────────────────────────────────
btnStart.addEventListener('click', () => {
  if (state.running) {
    pause();
  } else {
    start();
  }
});

btnClear.addEventListener('click', reset);

btnLangEs.addEventListener('click', () => applyLang('es'));
btnLangEn.addEventListener('click', () => applyLang('en'));

// ── Inicialización ────────────────────────────────────────────
applyLang('es');
