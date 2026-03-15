/**
 * Cronómetro Digital
 * Aplicación de cronómetro con interfaz responsiva
 * Tecnologías: JavaScript puro (vanilla JS)
 */

// ==================== ESTADO GLOBAL ====================
const StopwatchApp = {
    startTime: 0,
    elapsedTime: 0,
    isRunning: false,
    timerInterval: null,

    // Elementos del DOM
    elements: {
        display: null,
        millisecondDisplay: null,
        startBtn: null,
        clearBtn: null
    },

    /**
     * Inicializa la aplicación
     */
    init() {
        this.cacheDOM();
        if (!this.validateDOM()) {
            console.error('Error: no se encontraron elementos requeridos en el DOM');
            return false;
        }
        this.setupEventListeners();
        this.updateDisplay();
        return true;
    },

    /**
     * Almacena referencias a elementos del DOM
     */
    cacheDOM() {
        this.elements.display = document.getElementById('display');
        this.elements.millisecondDisplay = document.getElementById('milliseconds');
        this.elements.startBtn = document.getElementById('startBtn');
        this.elements.clearBtn = document.getElementById('clearBtn');
    },

    /**
     * Valida que todos los elementos requeridos existan en el DOM
     * @returns {boolean} true si todos los elementos existen
     */
    validateDOM() {
        return Object.values(this.elements).every(el => el !== null);
    },

    /**
     * Configura los event listeners
     */
    setupEventListeners() {
        this.elements.startBtn.addEventListener('click', () => this.toggleStartPause());
        this.elements.clearBtn.addEventListener('click', () => this.clearStopwatch());
    },

    /**
     * Formatea el tiempo en milisegundos a formato HH:MM:SS
     * @param {number} milliseconds - Tiempo en milisegundos
     * @returns {Object} Objeto con time y ms formateados
     */
    formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const ms = Math.floor(milliseconds % 1000);

        const padStart = (value, length) => String(value).padStart(length, '0');

        return {
            time: `${padStart(hours, 2)}:${padStart(minutes, 2)}:${padStart(seconds, 2)}`,
            ms: padStart(ms, 3)
        };
    },

    /**
     * Actualiza la pantalla del cronómetro
     */
    updateDisplay() {
        const formatted = this.formatTime(this.elapsedTime);
        this.elements.display.textContent = formatted.time;
        this.elements.millisecondDisplay.textContent = formatted.ms;
    },

    /**
     * Inicia o pausa el cronómetro
     */
    toggleStartPause() {
        if (!this.isRunning) {
            this.start();
        } else {
            this.pause();
        }
    },

    /**
     * Inicia el cronómetro
     */
    start() {
        this.startTime = Date.now() - this.elapsedTime;
        this.isRunning = true;
        this.elements.startBtn.textContent = 'Pausar';
        this.elements.startBtn.classList.add('paused');

        this.timerInterval = setInterval(() => {
            this.elapsedTime = Date.now() - this.startTime;
            this.updateDisplay();
        }, 10);
    },

    /**
     * Pausa el cronómetro
     */
    pause() {
        this.isRunning = false;
        this.elements.startBtn.textContent = 'Iniciar';
        this.elements.startBtn.classList.remove('paused');
        this.clearInterval();
    },

    /**
     * Reinicia el cronómetro
     */
    clearStopwatch() {
        this.isRunning = false;
        this.elapsedTime = 0;
        this.startTime = 0;
        this.clearInterval();
        this.elements.startBtn.textContent = 'Iniciar';
        this.elements.startBtn.classList.remove('paused');
        this.updateDisplay();
    },

    /**
     * Limpia el intervalo del timer
     */
    clearInterval() {
        if (this.timerInterval !== null) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
};

// ==================== INICIALIZACIÓN ====================
// Espera a que el DOM esté completamente cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        StopwatchApp.init();
    });
} else {
    StopwatchApp.init();
}
