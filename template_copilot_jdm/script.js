/**
 * Cronómetro Digital - Stopwatch Application
 * Aplicación de cronómetro con interfaz responsiva y soporte multilingüe
 * Tecnologías: JavaScript puro (vanilla JS)
 * 
 * Características:
 * - Control de cronómetro con inicio y pausa
 * - Diseño responsivo para móviles y desktop
 * - Soporte para español e inglés
 * - Accesibilidad mejorada (ARIA labels)
 * - Buenas prácticas de código (JSDoc, validación de DOM, manejo de errores)
 */

// ==================== CONFIGURACIÓN DE IDIOMAS ====================
const LANGUAGES = {
    es: {
        start: 'Iniciar',
        pause: 'Pausar',
        clear: 'Limpiar',
        ariaStart: 'Iniciar o pausar cronómetro',
        ariaClear: 'Reiniciar cronómetro',
        ariaTime: 'Tiempo transcurrido',
        ariaMs: 'Milisegundos'
    },
    en: {
        start: 'Start',
        pause: 'Pause',
        clear: 'Clear',
        ariaStart: 'Start or pause stopwatch',
        ariaClear: 'Reset stopwatch',
        ariaTime: 'Elapsed time',
        ariaMs: 'Milliseconds'
    }
};

// ==================== ESTADO GLOBAL ====================
/**
 * Objeto principal de la aplicación Stopwatch
 * Mantiene el estado y controla toda la lógica del cronómetro
 */
const StopwatchApp = {
    // Estado interno
    startTime: 0,
    elapsedTime: 0,
    isRunning: false,
    timerInterval: null,
    currentLanguage: 'es',

    // Elementos del DOM
    elements: {
        display: null,
        millisecondDisplay: null,
        startBtn: null,
        clearBtn: null,
        langButtons: []
    },

    /**
     * Inicializa la aplicación
     * @returns {boolean} true si la inicialización fue exitosa
     */
    init() {
        this.cacheDOM();
        if (!this.validateDOM()) {
            console.error('Error: no se encontraron elementos requeridos en el DOM');
            return false;
        }
        this.setupEventListeners();
        this.loadSavedLanguage();
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
        this.elements.langButtons = document.querySelectorAll('.lang-btn');
    },

    /**
     * Valida que todos los elementos requeridos existan en el DOM
     * @returns {boolean} true si todos los elementos existen
     */
    validateDOM() {
        const required = [
            this.elements.display,
            this.elements.millisecondDisplay,
            this.elements.startBtn,
            this.elements.clearBtn
        ];
        return required.every(el => el !== null);
    },

    /**
     * Configura los event listeners para botones e interacciones
     */
    setupEventListeners() {
        // Listeners para el cronómetro
        this.elements.startBtn.addEventListener('click', () => this.toggleStartPause());
        this.elements.clearBtn.addEventListener('click', () => this.clearStopwatch());

        // Listeners para cambio de idioma
        this.elements.langButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.changeLanguage(e.target.dataset.lang));
        });
    },

    /**
     * Carga el idioma guardado en localStorage o usa el predeterminado
     */
    loadSavedLanguage() {
        const saved = localStorage.getItem('stopwatchLanguage');
        if (saved && LANGUAGES[saved]) {
            this.setLanguage(saved);
        }
    },

    /**
     * Cambia el idioma actual
     * @param {string} lang - Código del idioma ('es' o 'en')
     */
    changeLanguage(lang) {
        if (lang === this.currentLanguage) return;
        this.setLanguage(lang);
        localStorage.setItem('stopwatchLanguage', lang);
    },

    /**
     * Establece el idioma actual y actualiza la UI
     * @param {string} lang - Código del idioma ('es' o 'en')
     */
    setLanguage(lang) {
        if (!LANGUAGES[lang]) return;
        
        this.currentLanguage = lang;
        const texts = LANGUAGES[lang];

        // Actualiza botón Start/Pause
        const btnText = this.isRunning ? texts.pause : texts.start;
        this.elements.startBtn.textContent = btnText;
        this.elements.startBtn.setAttribute('aria-label', texts.ariaStart);

        // Actualiza botón Clear
        this.elements.clearBtn.textContent = texts.clear;
        this.elements.clearBtn.setAttribute('aria-label', texts.ariaClear);

        // Actualiza ARIA labels
        this.elements.display.setAttribute('aria-label', texts.ariaTime);
        this.elements.millisecondDisplay.setAttribute('aria-label', texts.ariaMs);

        // Actualiza estado activo de botones de idioma
        this.elements.langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Actualiza atributo lang del documento
        document.documentElement.lang = lang;
    },

    /**
     * Formatea el tiempo en milisegundos a formato HH:MM:SS.ms
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
     * Actualiza la pantalla del cronómetro con el tiempo actual
     */
    updateDisplay() {
        const formatted = this.formatTime(this.elapsedTime);
        this.elements.display.textContent = formatted.time;
        this.elements.millisecondDisplay.textContent = formatted.ms;
    },

    /**
     * Alterna entre iniciar y pausar el cronómetro
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

        const texts = LANGUAGES[this.currentLanguage];
        this.elements.startBtn.textContent = texts.pause;
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

        const texts = LANGUAGES[this.currentLanguage];
        this.elements.startBtn.textContent = texts.start;
        this.elements.startBtn.classList.remove('paused');

        this.clearTimerInterval();
    },

    /**
     * Reinicia el cronómetro a valores iniciales
     */
    clearStopwatch() {
        this.isRunning = false;
        this.elapsedTime = 0;
        this.startTime = 0;
        this.clearTimerInterval();

        const texts = LANGUAGES[this.currentLanguage];
        this.elements.startBtn.textContent = texts.start;
        this.elements.startBtn.classList.remove('paused');

        this.updateDisplay();
    },

    /**
     * Limpia el intervalo del timer de manera segura
     */
    clearTimerInterval() {
        if (this.timerInterval !== null) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
};

// ==================== INICIALIZACIÓN ====================
/**
 * Espera a que el DOM esté completamente cargado antes de inicializar
 * Maneja ambos casos: si el script se ejecuta antes o después de DOMContentLoaded
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        StopwatchApp.init();
    });
} else {
    StopwatchApp.init();
}
