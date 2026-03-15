const timeEl = document.getElementById('time');
const msEl = document.getElementById('ms');
const btnStart = document.getElementById('btn-start');
const btnClear = document.getElementById('btn-clear');

const state = {
  startTime: 0,
  elapsed: 0,
  rafId: null,
  running: false,
};

function pad(n, digits) {
  return String(n).padStart(digits, '0');
}

function render(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = ms % 1000;

  timeEl.textContent = `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)}`;
  msEl.textContent = pad(milliseconds, 3);
}

function tick() {
  state.elapsed = Date.now() - state.startTime;
  render(state.elapsed);
  state.rafId = requestAnimationFrame(tick);
}

function start() {
  state.startTime = Date.now() - state.elapsed;
  state.rafId = requestAnimationFrame(tick);
  state.running = true;
  btnStart.textContent = 'Pause';
  btnStart.classList.add('paused');
  btnStart.setAttribute('aria-label', 'Pausar cronómetro');
}

function pause() {
  cancelAnimationFrame(state.rafId);
  state.rafId = null;
  state.running = false;
  btnStart.textContent = 'Start';
  btnStart.classList.remove('paused');
  btnStart.setAttribute('aria-label', 'Iniciar cronómetro');
}

function reset() {
  pause();
  state.elapsed = 0;
  render(0);
}

btnStart.addEventListener('click', () => {
  if (state.running) {
    pause();
  } else {
    start();
  }
});

btnClear.addEventListener('click', reset);
