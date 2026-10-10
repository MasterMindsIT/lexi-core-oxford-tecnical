/**
 * LexiCore 80/20 - Main Application Logic & Controller
 * Implementa Web Speech API (TTS), lógica SRS, Flashcards, Chunks, Quiz,
 * Explorador reactivo, atajos de teclado y renderizado de la UI.
 */

// ============================================================================
// 1. TOAST NOTIFICATION SYSTEM
// ============================================================================
const Toast = {
  show: (message, type = 'info') => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const bgColors = {
      success: 'bg-emerald-600 text-white',
      error: 'bg-rose-600 text-white',
      warning: 'bg-amber-600 text-white',
      info: 'bg-indigo-600 text-white'
    };

    toast.className = `px-4 py-3 rounded-2xl shadow-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transform transition-all duration-300 pointer-events-auto ${bgColors[type] || bgColors.info} animate-pop`;
    toast.innerHTML = `<span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }
};

// ============================================================================
// 2. TTS ENGINE (NATIVE WEB SPEECH API)
// ============================================================================
const TTSEngine = (() => {
  let synth = window.speechSynthesis;
  let availableVoices = [];
  let settings = StorageEngine.getSettings();

  const initVoices = () => {
    if (!synth) return;
    availableVoices = synth.getVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = () => {
        availableVoices = synth.getVoices();
      };
    }
  };

  const getBestVoice = (langCode) => {
    if (!availableVoices.length && synth) {
      availableVoices = synth.getVoices();
    }
    // Intentar buscar voz natural o de alta calidad para el código de idioma
    const matches = availableVoices.filter(v => v.lang.replace('_', '-').startsWith(langCode));
    // Preferir voces no locales o de Google/Microsoft si están disponibles
    const premiumVoice = matches.find(v => v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Online'));
    return premiumVoice || matches[0] || null;
  };

  const speak = (text, customRate = null, targetElement = null) => {
    if (!synth) {
      Toast.show('La síntesis de voz no está disponible en este navegador.', 'warning');
      return;
    }

    // Cancelar cualquier lectura anterior para evitar solapamientos
    synth.cancel();

    if (!text || text.trim() === '') return;

    const utterance = new SpeechSynthesisUtterance(text);
    const currentSettings = StorageEngine.getSettings();
    const voiceLang = currentSettings.voiceAccent || 'en-US';
    
    utterance.lang = voiceLang;
    utterance.rate = customRate || currentSettings.speechRate || 1.0;
    utterance.pitch = 1.0;

    const voice = getBestVoice(voiceLang);
    if (voice) {
      utterance.voice = voice;
    }

    if (targetElement) {
      targetElement.classList.add('audio-playing');
      utterance.onend = () => targetElement.classList.remove('audio-playing');
      utterance.onerror = () => targetElement.classList.remove('audio-playing');
    }

    synth.speak(utterance);
  };

  const setRate = (rate) => {
    const s = StorageEngine.getSettings();
    s.speechRate = Number(rate);
    StorageEngine.saveSettings(s);

    // Actualizar botones de UI
    const slowBtn = document.getElementById('fc-speed-slow');
    const normBtn = document.getElementById('fc-speed-normal');
    if (slowBtn && normBtn) {
      if (rate < 1.0) {
        slowBtn.className = 'px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm';
        normBtn.className = 'px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-400';
      } else {
        normBtn.className = 'px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm';
        slowBtn.className = 'px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-400';
      }
    }
  };

  const setAccent = (accentCode) => {
    const s = StorageEngine.getSettings();
    s.voiceAccent = accentCode;
    StorageEngine.saveSettings(s);
    Toast.show(`Acento cambiado a: ${accentCode === 'en-US' ? 'Inglés US 🇺🇸' : 'Inglés UK 🇬🇧'}`, 'info');
  };

  return {
    init: initVoices,
    speak,
    setRate,
    setAccent
  };
})();

// ============================================================================
// 3. NAVIGATION CONTROLLER (SPA ROUTING)
// ============================================================================
const NavigationController = (() => {
  let currentView = 'dashboard';

  const navigateTo = (viewId) => {
    currentView = viewId;

    // Ocultar todas las vistas
    document.querySelectorAll('.view-panel').forEach(panel => {
      panel.classList.add('hidden');
    });

    // Mostrar vista seleccionada
    const activePanel = document.getElementById(`view-${viewId}`);
    if (activePanel) {
      activePanel.classList.remove('hidden');
    }

    // Actualizar estilos de tabs de navegación de escritorio
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.classList.remove('active', 'text-indigo-600', 'dark:text-indigo-400', 'bg-indigo-50', 'dark:bg-indigo-950/60');
      tab.classList.add('text-slate-600', 'dark:text-slate-400');
    });
    const currentNavBtn = document.getElementById(`nav-btn-${viewId}`);
    if (currentNavBtn) {
      currentNavBtn.classList.add('active', 'text-indigo-600', 'dark:text-indigo-400', 'bg-indigo-50', 'dark:bg-indigo-950/60');
      currentNavBtn.classList.remove('text-slate-600', 'dark:text-slate-400');
    }

    // Inicializaciones específicas por vista
    if (viewId === 'dashboard') {
      DashboardController.refresh();
    } else if (viewId === 'flashcards') {
      FlashcardController.initSession();
    } else if (viewId === 'chunks') {
      ChunksController.init();
    } else if (viewId === 'quiz') {
      QuizController.startQuiz();
    } else if (viewId === 'explorer') {
      ExplorerController.init();
    } else if (viewId === 'tech') {
      TechHubController.init();
    } else if (viewId === 'settings') {
      SettingsController.init();
    } else if (viewId === 'resources') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Re-renderizar iconos de Lucide
    if (window.lucide) {
      lucide.createIcons();
    }
  };

  const toggleMobileMenu = (forceState = null) => {
    const drawer = document.getElementById('mobile-menu-drawer');
    if (!drawer) return;
    if (forceState !== null) {
      drawer.classList.toggle('hidden', !forceState);
    } else {
      drawer.classList.toggle('hidden');
    }
  };

  return {
    navigateTo,
    toggleMobileMenu,
    getCurrentView: () => currentView
  };
})();

// ============================================================================
// 4. THEME CONTROLLER (DARK / LIGHT)
// ============================================================================
const ThemeController = (() => {
  const init = () => {
    const settings = StorageEngine.getSettings();
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleTheme);
    }
  };

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    const settings = StorageEngine.getSettings();
    settings.theme = isDark ? 'dark' : 'light';
    StorageEngine.saveSettings(settings);
    if (window.lucide) lucide.createIcons();
  };

  return { init, toggleTheme };
})();

// ============================================================================
// 5. DASHBOARD CONTROLLER
// ============================================================================
const DashboardController = (() => {
  const refresh = () => {
    const allWords = VocabularyData.getAll();
    const metrics = StorageEngine.getMetricsSummary(allWords);

    // Actualizar Racha y Cobertura en la Barra Superior
    const headerStreak = document.getElementById('header-streak-count');
    if (headerStreak) headerStreak.textContent = metrics.streak;

    const headerCoverage = document.getElementById('header-coverage-pct');
    if (headerCoverage) headerCoverage.textContent = `${metrics.coveragePercentage}%`;

    const headerDaily = document.getElementById('header-daily-count');
    if (headerDaily) headerDaily.textContent = `${metrics.todayReviewedCount}/${metrics.dailyGoal}`;

    // Actualizar Badge de tarjetas pendientes en Sidebar
    const navDueBadge = document.getElementById('nav-due-badge');
    if (navDueBadge) {
      if (metrics.dueTodayCount > 0) {
        navDueBadge.textContent = metrics.dueTodayCount;
        navDueBadge.classList.remove('hidden');
      } else {
        navDueBadge.classList.add('hidden');
      }
    }

    // Actualizar Bloque Principal de Cobertura 80/20
    const dashCoveragePct = document.getElementById('dash-coverage-percent');
    if (dashCoveragePct) dashCoveragePct.textContent = `${metrics.coveragePercentage}%`;

    const dashCoverageBar = document.getElementById('dash-coverage-bar');
    if (dashCoverageBar) {
      // Escalado sobre meta del 80%
      const fillPct = Math.min(100, Math.round((metrics.coveragePercentage / 80) * 100));
      dashCoverageBar.style.width = `${fillPct}%`;
    }

    // Actualizar 4 Métricas de Tarjetas
    const statMastered = document.getElementById('dash-stat-mastered');
    if (statMastered) statMastered.textContent = metrics.masteredCount;

    const statLearning = document.getElementById('dash-stat-learning');
    if (statLearning) statLearning.textContent = metrics.learningCount;

    const statDue = document.getElementById('dash-stat-due');
    if (statDue) statDue.textContent = metrics.dueTodayCount;

    const statTotal = document.getElementById('dash-stat-total');
    if (statTotal) statTotal.textContent = metrics.totalWords;

    // Texto dinámico del botón de Repaso Hero
    const studyBtnText = document.getElementById('dash-btn-study-text');
    if (studyBtnText) {
      if (metrics.dueTodayCount > 0) {
        studyBtnText.textContent = `Repasar ${metrics.dueTodayCount} tarjetas hoy`;
      } else {
        studyBtnText.textContent = 'Aprender nuevo lote';
      }
    }

    // Renderizar Cuadrícula de Niveles CEFR
    renderCEFRGrid(metrics.levelStats);
  };

  const renderCEFRGrid = (levelStats) => {
    const container = document.getElementById('dash-cefr-grid');
    if (!container) return;

    container.innerHTML = '';
    const levels = ['A1', 'A2', 'B1', 'B2'];
    const badgeColors = {
      A1: 'badge-level-a1',
      A2: 'badge-level-a2',
      B1: 'badge-level-b1',
      B2: 'badge-level-b2'
    };

    levels.forEach(lvl => {
      const data = levelStats[lvl] || { total: 0, mastered: 0, learning: 0 };
      const masteredPercent = data.total > 0 ? Math.round((data.mastered / data.total) * 100) : 0;

      const card = document.createElement('div');
      card.className = 'p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2';
      card.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="px-2.5 py-0.5 rounded-md text-xs font-bold ${badgeColors[lvl]}">${lvl}</span>
          <span class="text-xs font-bold text-slate-500">${masteredPercent}%</span>
        </div>
        <div class="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
          <div class="bg-indigo-600 h-full rounded-full transition-all duration-500" style="width: ${masteredPercent}%"></div>
        </div>
        <div class="flex justify-between text-[11px] text-slate-500">
          <span>Dominadas: <strong>${data.mastered}</strong></span>
          <span>Total: <strong>${data.total}</strong></span>
        </div>
      `;
      container.appendChild(card);
    });
  };

  return { refresh };
})();

// ============================================================================
// 6. FLASHCARDS CONTROLLER (SMART SRS STUDY MODULE)
// ============================================================================
const FlashcardController = (() => {
  let queue = [];
  let currentIndex = 0;
  let isFlipped = false;

  const initSession = () => {
    const allWords = VocabularyData.getAll();
    queue = StorageEngine.getStudyQueue(allWords, 15);
    currentIndex = 0;
    isFlipped = false;

    const cardEl = document.getElementById('flashcard-element');
    const finishedCard = document.getElementById('fc-finished-card');
    
    if (finishedCard) finishedCard.classList.add('hidden');

    if (!queue.length) {
      if (cardEl) cardEl.classList.add('hidden');
      if (finishedCard) finishedCard.classList.remove('hidden');
      return;
    }

    if (cardEl) cardEl.classList.remove('hidden');
    renderCurrentCard();
  };

  const renderCurrentCard = () => {
    if (currentIndex >= queue.length) {
      // Fin de la sesión de repaso
      const cardEl = document.getElementById('flashcard-element');
      const finishedCard = document.getElementById('fc-finished-card');
      if (cardEl) cardEl.classList.add('hidden');
      if (finishedCard) {
        finishedCard.classList.remove('hidden');
        if (window.lucide) lucide.createIcons();
      }
      DashboardController.refresh();
      return;
    }

    const word = queue[currentIndex];
    isFlipped = false;

    const cardEl = document.getElementById('flashcard-element');
    if (cardEl) cardEl.classList.remove('flipped');

    // Contador de progreso
    const counterEl = document.getElementById('fc-progress-counter');
    if (counterEl) {
      counterEl.textContent = `Tarjeta ${currentIndex + 1} de ${queue.length}`;
    }

    // Frente de la Tarjeta
    const frontWord = document.getElementById('fc-front-word');
    const frontPhonetic = document.getElementById('fc-front-phonetic');
    const frontPos = document.getElementById('fc-front-pos');
    const frontLevel = document.getElementById('fc-front-level');
    const frontRank = document.getElementById('fc-front-rank');

    if (frontWord) frontWord.textContent = word.word;
    if (frontPhonetic) frontPhonetic.textContent = word.phonetic || '';
    if (frontPos) frontPos.textContent = word.partOfSpeech || '';
    if (frontRank) frontRank.textContent = `#${word.frequencyRank || ''} Oxford 3000`;

    if (frontLevel) {
      frontLevel.textContent = word.level || 'A1';
      frontLevel.className = `px-2.5 py-1 rounded-lg text-xs font-bold badge-level-${(word.level || 'a1').toLowerCase()}`;
    }

    // Reverso de la Tarjeta
    const backMeaning = document.getElementById('fc-back-meaning');
    const backCollocation = document.getElementById('fc-back-collocation');
    const backCategory = document.getElementById('fc-back-category');

    if (backMeaning) backMeaning.textContent = word.meaningEs;
    if (backCollocation) backCollocation.textContent = word.collocation || 'Uso común en conversaciones';
    if (backCategory) backCategory.textContent = word.category || 'General';

    // Oraciones de Ejemplo (1 y 2)
    const s1 = word.sentences && word.sentences[0] ? word.sentences[0] : null;
    const s2 = word.sentences && word.sentences[1] ? word.sentences[1] : null;

    const s1En = document.getElementById('fc-sentence-1-en');
    const s1Es = document.getElementById('fc-sentence-1-es');
    if (s1En && s1) s1En.textContent = s1.en;
    if (s1Es && s1) s1Es.textContent = s1.es;

    const s2En = document.getElementById('fc-sentence-2-en');
    const s2Es = document.getElementById('fc-sentence-2-es');
    if (s2En && s2) s2En.textContent = s2.en;
    if (s2Es && s2) s2Es.textContent = s2.es;

    if (window.lucide) lucide.createIcons();
  };

  const flipCurrentCard = () => {
    const cardEl = document.getElementById('flashcard-element');
    if (!cardEl) return;
    isFlipped = !isFlipped;
    cardEl.classList.toggle('flipped', isFlipped);
  };

  const handleCardClick = (event) => {
    // Si el clic fue en un botón de audio, no voltear la tarjeta
    if (event.target.closest('button')) return;
    flipCurrentCard();
  };

  const playCurrentWordAudio = (event) => {
    if (event) event.stopPropagation();
    const word = queue[currentIndex];
    if (!word) return;
    const btn = document.getElementById('fc-front-audio-btn');
    TTSEngine.speak(word.word, null, btn);
  };

  const playSentenceAudio = (sentenceIndex, event) => {
    if (event) event.stopPropagation();
    const word = queue[currentIndex];
    if (!word || !word.sentences) return;
    const sentence = word.sentences[sentenceIndex - 1];
    if (sentence) {
      const btn = document.getElementById(`fc-sentence-${sentenceIndex}-audio`);
      TTSEngine.speak(sentence.en, null, btn);
    }
  };

  const submitRating = (rating) => {
    const word = queue[currentIndex];
    if (!word) return;

    // Aplicar calificación en el motor de repetición espaciada
    StorageEngine.applySRSRating(word.id, rating);

    // Feedback visual y avanzar a la siguiente tarjeta
    currentIndex += 1;
    renderCurrentCard();
  };

  const startNewSession = () => {
    initSession();
  };

  return {
    initSession,
    flipCurrentCard,
    handleCardClick,
    playCurrentWordAudio,
    playSentenceAudio,
    submitRating,
    startNewSession
  };
})();

// ============================================================================
// 7. CHUNKS CONTROLLER (REAL CONTEXT & CLOZE MODE)
// ============================================================================
const ChunksController = (() => {
  let mode = 'reader'; // 'reader' | 'cloze'
  let sentencesList = [];
  let currentIndex = 0;
  let isTranslationVisible = true;

  const init = () => {
    const allWords = VocabularyData.getAll();
    sentencesList = [];

    // Desglosar oraciones con referencia a su palabra clave
    allWords.forEach(word => {
      if (word.sentences && word.sentences.length) {
        word.sentences.forEach(s => {
          sentencesList.push({
            wordId: word.id,
            targetWord: word.word,
            level: word.level,
            collocation: word.collocation,
            en: s.en,
            es: s.es
          });
        });
      }
    });

    // Mezclar aleatoriamente para dinamismo
    sentencesList.sort(() => Math.random() - 0.5);
    currentIndex = 0;
    isTranslationVisible = true;
    renderSentence();
  };

  const setMode = (newMode) => {
    mode = newMode;
    const readerTab = document.getElementById('chunk-tab-reader');
    const clozeTab = document.getElementById('chunk-tab-cloze');
    const clozeArea = document.getElementById('chunk-cloze-area');

    if (mode === 'reader') {
      readerTab.className = 'px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm';
      clozeTab.className = 'px-3.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400';
      if (clozeArea) clozeArea.classList.add('hidden');
    } else {
      clozeTab.className = 'px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm';
      readerTab.className = 'px-3.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400';
      if (clozeArea) clozeArea.classList.remove('hidden');
    }

    renderSentence();
  };

  const renderSentence = () => {
    if (!sentencesList.length) return;
    const item = sentencesList[currentIndex];

    // Nivel y Colocación
    const lvlBadge = document.getElementById('chunk-level-badge');
    if (lvlBadge) {
      lvlBadge.textContent = item.level;
      lvlBadge.className = `px-2.5 py-0.5 rounded-md text-xs font-bold badge-level-${item.level.toLowerCase()}`;
    }

    const colocTag = document.getElementById('chunk-collocation-tag');
    if (colocTag) {
      colocTag.textContent = item.collocation ? `Colocación: ${item.collocation}` : 'Contexto natural';
    }

    // Traducción
    const transText = document.getElementById('chunk-display-es');
    if (transText) {
      transText.textContent = item.es;
    }
    updateTranslationDisplay();

    // Texto en inglés
    const displayEn = document.getElementById('chunk-display-en');
    if (!displayEn) return;

    if (mode === 'reader') {
      // Resaltar la palabra clave en negrita / subrayado
      const regex = new RegExp(`\\b(${escapeRegExp(item.targetWord)}(\\w*)?)\\b`, 'gi');
      const highlighted = item.en.replace(regex, `<span class="text-indigo-600 dark:text-indigo-400 underline decoration-indigo-400 underline-offset-8 font-black">$1</span>`);
      displayEn.innerHTML = highlighted;
    } else {
      // Modo Cloze: Ocultar la palabra clave con una línea en blanco
      const regex = new RegExp(`\\b(${escapeRegExp(item.targetWord)}(\\w*)?)\\b`, 'gi');
      const blanked = item.en.replace(regex, `<span id="cloze-blank" class="px-4 py-0.5 border-b-4 border-indigo-500 font-black text-indigo-500">______</span>`);
      displayEn.innerHTML = blanked;
      renderClozeOptions(item);
    }

    if (window.lucide) lucide.createIcons();
  };

  const renderClozeOptions = (currentItem) => {
    const grid = document.getElementById('chunk-options-grid');
    const feedback = document.getElementById('chunk-feedback-message');
    if (!grid) return;

    grid.innerHTML = '';
    if (feedback) feedback.textContent = '';

    // Obtener 3 distractores aleatorios
    const allWords = VocabularyData.getAll();
    const distractors = allWords
      .filter(w => w.id !== currentItem.wordId)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.word);

    const options = [currentItem.targetWord, ...distractors].sort(() => Math.random() - 0.5);

    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'cloze-opt-btn p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm transition-all';
      btn.textContent = opt;
      btn.onclick = () => handleClozeSelection(opt, currentItem.targetWord, btn);
      grid.appendChild(btn);
    });
  };

  const handleClozeSelection = (selected, correct, buttonElement) => {
    const isCorrect = selected.toLowerCase() === correct.toLowerCase();
    const feedback = document.getElementById('chunk-feedback-message');
    const blank = document.getElementById('cloze-blank');

    // Desactivar todos los botones para evitar doble clic
    document.querySelectorAll('.cloze-opt-btn').forEach(b => b.disabled = true);

    if (isCorrect) {
      buttonElement.className = 'cloze-opt-btn p-3 rounded-xl bg-emerald-500 text-white font-bold text-sm shadow-md';
      if (feedback) {
        feedback.innerHTML = '<span class="text-emerald-500">¡Excelente! Colocación correcta.</span>';
      }
      if (blank) {
        blank.textContent = correct;
        blank.className = 'px-2 py-0.5 text-emerald-500 font-black border-b-4 border-emerald-500';
      }
      playCurrentSentenceAudio();
      StorageEngine.recordStudySession();
    } else {
      buttonElement.className = 'cloze-opt-btn p-3 rounded-xl bg-rose-500 text-white font-bold text-sm animate-shake';
      if (feedback) {
        feedback.innerHTML = `<span class="text-rose-500">Incorrecto. La palabra correcta es: <strong>${correct}</strong></span>`;
      }
      if (blank) {
        blank.textContent = correct;
        blank.className = 'px-2 py-0.5 text-rose-500 font-black border-b-4 border-rose-500';
      }
    }
  };

  const toggleTranslationVisibility = () => {
    isTranslationVisible = !isTranslationVisible;
    updateTranslationDisplay();
  };

  const updateTranslationDisplay = () => {
    const transText = document.getElementById('chunk-display-es');
    const btnLabel = document.getElementById('chunk-trans-btn-label');
    if (!transText || !btnLabel) return;

    if (isTranslationVisible) {
      transText.classList.remove('opacity-0', 'blur-sm');
      btnLabel.textContent = 'Ocultar Traducción';
    } else {
      transText.classList.add('opacity-0', 'blur-sm');
      btnLabel.textContent = 'Ver Traducción';
    }
  };

  const nextSentence = () => {
    currentIndex = (currentIndex + 1) % sentencesList.length;
    renderSentence();
  };

  const prevSentence = () => {
    currentIndex = (currentIndex - 1 + sentencesList.length) % sentencesList.length;
    renderSentence();
  };

  const playCurrentSentenceAudio = () => {
    const item = sentencesList[currentIndex];
    if (item) {
      TTSEngine.speak(item.en);
    }
  };

  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  return {
    init,
    setMode,
    toggleTranslationVisibility,
    nextSentence,
    prevSentence,
    playCurrentSentenceAudio
  };
})();

// ============================================================================
// 8. QUIZ CONTROLLER (INTERACTIVE 10-QUESTION SPEED DRILL)
// ============================================================================
const QuizController = (() => {
  let questions = [];
  let currentQIndex = 0;
  let score = 0;
  let correctCount = 0;

  const startQuiz = () => {
    const allWords = VocabularyData.getAll();
    const shuffled = [...allWords].sort(() => Math.random() - 0.5).slice(0, 10);

    questions = shuffled.map(target => {
      // 3 distractores aleatorios
      const distractors = allWords
        .filter(w => w.id !== target.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => w.meaningEs);

      const options = [target.meaningEs, ...distractors].sort(() => Math.random() - 0.5);

      return {
        word: target.word,
        correctMeaning: target.meaningEs,
        options
      };
    });

    currentQIndex = 0;
    score = 0;
    correctCount = 0;

    const activeCard = document.getElementById('quiz-active-card');
    const resultsCard = document.getElementById('quiz-results-card');
    if (activeCard) activeCard.classList.remove('hidden');
    if (resultsCard) resultsCard.classList.add('hidden');

    renderQuestion();
  };

  const renderQuestion = () => {
    if (currentQIndex >= questions.length) {
      finishQuiz();
      return;
    }

    const q = questions[currentQIndex];

    const currentQEl = document.getElementById('quiz-current-q');
    if (currentQEl) currentQEl.textContent = currentQIndex + 1;

    const scoreEl = document.getElementById('quiz-score-display');
    if (scoreEl) scoreEl.textContent = `Puntos: ${score}`;

    const progressBar = document.getElementById('quiz-progress-bar');
    if (progressBar) {
      progressBar.style.width = `${((currentQIndex + 1) / questions.length) * 100}%`;
    }

    const wordEl = document.getElementById('quiz-question-word');
    if (wordEl) wordEl.textContent = q.word;

    const optionsContainer = document.getElementById('quiz-options-container');
    if (!optionsContainer) return;
    optionsContainer.innerHTML = '';

    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-sm text-left transition-all';
      btn.textContent = opt;
      btn.onclick = () => handleAnswer(opt, q.correctMeaning, btn);
      optionsContainer.appendChild(btn);
    });

    if (window.lucide) lucide.createIcons();
  };

  const handleAnswer = (selected, correct, buttonElement) => {
    // Desactivar botones temporalmente
    document.querySelectorAll('.quiz-option-btn').forEach(b => b.disabled = true);

    const isCorrect = selected === correct;

    if (isCorrect) {
      buttonElement.classList.remove('bg-slate-50', 'dark:bg-slate-800/80', 'border-slate-200');
      buttonElement.classList.add('bg-emerald-500', 'border-emerald-500', 'text-white');
      score += 100;
      correctCount += 1;
    } else {
      buttonElement.classList.remove('bg-slate-50', 'dark:bg-slate-800/80', 'border-slate-200');
      buttonElement.classList.add('bg-rose-500', 'border-rose-500', 'text-white', 'animate-shake');

      // Resaltar también la respuesta correcta
      document.querySelectorAll('.quiz-option-btn').forEach(b => {
        if (b.textContent === correct) {
          b.classList.add('bg-emerald-500', 'border-emerald-500', 'text-white');
        }
      });
    }

    setTimeout(() => {
      currentQIndex += 1;
      renderQuestion();
    }, 1100);
  };

  const finishQuiz = () => {
    const activeCard = document.getElementById('quiz-active-card');
    const resultsCard = document.getElementById('quiz-results-card');
    if (activeCard) activeCard.classList.add('hidden');
    if (resultsCard) resultsCard.classList.remove('hidden');

    const finalCorrect = document.getElementById('quiz-final-correct');
    if (finalCorrect) finalCorrect.textContent = `${correctCount} / 10`;

    const finalPct = document.getElementById('quiz-final-pct');
    if (finalPct) finalPct.textContent = `${Math.round((correctCount / 10) * 100)}%`;

    // Registrar sesión en racha
    StorageEngine.recordStudySession();
    DashboardController.refresh();
    if (window.lucide) lucide.createIcons();
  };

  const restartQuiz = () => {
    startQuiz();
  };

  const playQuestionAudio = () => {
    const q = questions[currentQIndex];
    if (q) {
      TTSEngine.speak(q.word);
    }
  };

  return {
    startQuiz,
    restartQuiz,
    playQuestionAudio
  };
})();

// ============================================================================
// 9. EXPLORER CONTROLLER (VOCABULARY 80/20 DICTIONARY)
// ============================================================================
const ExplorerController = (() => {
  let searchQuery = '';
  let selectedLevel = 'ALL';
  let selectedStatus = 'ALL';

  const init = () => {
    renderWords();
  };

  const handleSearch = (value) => {
    searchQuery = value;
    renderWords();
  };

  const setLevelFilter = (level) => {
    selectedLevel = level;
    document.querySelectorAll('.exp-lvl-btn').forEach(btn => {
      if (btn.textContent.trim().toUpperCase() === level.toUpperCase() || (level === 'ALL' && btn.textContent.trim() === 'Todos')) {
        btn.className = 'exp-lvl-btn active px-3 py-1 rounded-lg text-xs font-bold bg-indigo-600 text-white';
      } else {
        btn.className = 'exp-lvl-btn px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300';
      }
    });
    renderWords();
  };

  const setStatusFilter = (status) => {
    selectedStatus = status;
    renderWords();
  };

  const renderWords = () => {
    const allWords = VocabularyData.getAll();
    const progressMap = StorageEngine.getProgressMap();

    // Filtrado reactivo
    const filtered = allWords.filter(word => {
      // 1. Filtro de búsqueda
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesWord = word.word.toLowerCase().includes(q);
        const matchesMeaning = word.meaningEs.toLowerCase().includes(q);
        const matchesCollocation = word.collocation.toLowerCase().includes(q);
        if (!matchesWord && !matchesMeaning && !matchesCollocation) return false;
      }

      // 2. Filtro de nivel
      if (selectedLevel !== 'ALL' && word.level.toUpperCase() !== selectedLevel.toUpperCase()) {
        return false;
      }

      // 3. Filtro de estado
      if (selectedStatus !== 'ALL') {
        const p = progressMap[word.id];
        const status = p ? p.status : 'new';
        if (status !== selectedStatus) return false;
      }

      return true;
    });

    const grid = document.getElementById('explorer-words-grid');
    const emptyMsg = document.getElementById('explorer-empty-msg');
    const counter = document.getElementById('explorer-counter');

    if (counter) counter.textContent = filtered.length;

    if (!filtered.length) {
      if (grid) grid.innerHTML = '';
      if (emptyMsg) emptyMsg.classList.remove('hidden');
      return;
    }

    if (emptyMsg) emptyMsg.classList.add('hidden');
    if (!grid) return;
    grid.innerHTML = '';

    const statusLabels = {
      new: { label: 'Por aprender', class: 'status-pill-new' },
      learning: { label: 'En progreso', class: 'status-pill-learning' },
      mastered: { label: 'Dominada', class: 'status-pill-mastered' }
    };

    filtered.forEach(word => {
      const p = progressMap[word.id];
      const statusKey = p ? p.status : 'new';
      const statusInfo = statusLabels[statusKey] || statusLabels.new;

      const card = document.createElement('div');
      card.className = 'p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3';
      
      card.innerHTML = `
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded-md text-xs font-bold badge-level-${word.level.toLowerCase()}">${word.level}</span>
              <span class="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500">${word.partOfSpeech}</span>
            </div>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusInfo.class}">${statusInfo.label}</span>
          </div>

          <div class="flex items-baseline justify-between pt-1">
            <h4 class="text-xl font-extrabold text-slate-900 dark:text-slate-100">${word.word}</h4>
            <span class="text-xs font-mono text-indigo-500">${word.phonetic}</span>
          </div>

          <p class="text-xs font-medium text-slate-600 dark:text-slate-300 line-clamp-2">${word.meaningEs}</p>
        </div>

        <div class="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <button onclick="TTSEngine.speak('${word.word}')" class="p-2 rounded-xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors" title="Escuchar pronunciación">
            <i data-lucide="volume-2" class="w-4 h-4"></i>
          </button>
          <button onclick="ExplorerController.openDetailModal(${word.id})" class="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
            Ver detalles →
          </button>
        </div>
      `;

      grid.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();
  };

  const openDetailModal = (wordId) => {
    const word = VocabularyData.getById(wordId);
    if (!word) return;

    const modal = document.getElementById('word-detail-modal');
    if (!modal) return;

    const title = document.getElementById('modal-word-title');
    const phonetic = document.getElementById('modal-word-phonetic');
    const meaning = document.getElementById('modal-meaning');
    const collocation = document.getElementById('modal-collocation');
    const lvlBadge = document.getElementById('modal-level-badge');
    const posBadge = document.getElementById('modal-pos-badge');
    const rankBadge = document.getElementById('modal-rank-badge');
    const sentencesContainer = document.getElementById('modal-sentences-container');
    const audioBtn = document.getElementById('modal-audio-btn');

    if (title) title.textContent = word.word;
    if (phonetic) phonetic.textContent = word.phonetic;
    if (meaning) meaning.textContent = word.meaningEs;
    if (collocation) collocation.textContent = word.collocation || 'No especificada';
    if (lvlBadge) {
      lvlBadge.textContent = word.level;
      lvlBadge.className = `px-2.5 py-0.5 rounded-md text-xs font-bold badge-level-${word.level.toLowerCase()}`;
    }
    if (posBadge) posBadge.textContent = word.partOfSpeech;
    if (rankBadge) rankBadge.textContent = `#${word.frequencyRank} Oxford 3000`;

    if (sentencesContainer && word.sentences) {
      sentencesContainer.innerHTML = '';
      word.sentences.forEach(s => {
        const item = document.createElement('div');
        item.className = 'p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1';
        item.innerHTML = `
          <p class="font-semibold text-slate-800 dark:text-slate-100">${s.en}</p>
          <p class="text-slate-500 dark:text-slate-400 italic">${s.es}</p>
        `;
        sentencesContainer.appendChild(item);
      });
    }

    if (audioBtn) {
      audioBtn.onclick = () => TTSEngine.speak(word.word);
    }

    modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  };

  const closeDetailModal = () => {
    const modal = document.getElementById('word-detail-modal');
    if (modal) modal.classList.add('hidden');
  };

  return {
    init,
    handleSearch,
    setLevelFilter,
    setStatusFilter,
    openDetailModal,
    closeDetailModal
  };
})();

// ============================================================================
// 10. SETTINGS CONTROLLER (CONFIGURACIÓN & IMPORT/EXPORT)
// ============================================================================
const SettingsController = (() => {
  const init = () => {
    const s = StorageEngine.getSettings();
    const stats = StorageEngine.getStats();

    const voiceSelect = document.getElementById('settings-voice-select');
    if (voiceSelect) voiceSelect.value = s.voiceAccent || 'en-US';

    const rateSlider = document.getElementById('settings-rate-slider');
    const rateDisplay = document.getElementById('settings-rate-display');
    if (rateSlider && rateDisplay) {
      rateSlider.value = s.speechRate || 1.0;
      rateDisplay.textContent = `${s.speechRate || 1.0}x`;
    }

    const goalSelect = document.getElementById('settings-goal-select');
    if (goalSelect) goalSelect.value = String(stats.dailyGoal || 10);
  };

  const updateVoice = (accent) => {
    TTSEngine.setAccent(accent);
  };

  const updateRate = (rateVal) => {
    TTSEngine.setRate(rateVal);
    const rateDisplay = document.getElementById('settings-rate-display');
    if (rateDisplay) rateDisplay.textContent = `${rateVal}x`;
  };

  const updateDailyGoal = (goalVal) => {
    const stats = StorageEngine.getStats();
    stats.dailyGoal = Number(goalVal);
    StorageEngine.saveStats(stats);
    Toast.show(`Meta diaria actualizada a ${goalVal} palabras`, 'success');
    DashboardController.refresh();
  };

  const handleImportJSON = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = StorageEngine.importProgressFromJSON(e.target.result);
      if (result.success) {
        Toast.show(result.message, 'success');
        DashboardController.refresh();
      } else {
        Toast.show(result.message, 'error');
      }
      event.target.value = ''; // Limpiar input file
    };
    reader.readAsText(file);
  };

  const promptReset = () => {
    const confirmReset = window.confirm('¿Estás seguro de que deseas reiniciar todo tu progreso de estudio? Esta acción no se puede deshacer.');
    if (confirmReset) {
      StorageEngine.resetAllProgress();
      Toast.show('Progreso reiniciado correctamente a valores de fábrica.', 'info');
      DashboardController.refresh();
      FlashcardController.initSession();
    }
  };

  return {
    init,
    updateVoice,
    updateRate,
    updateDailyGoal,
    handleImportJSON,
    promptReset
  };
})();

// ============================================================================
// 11. TECH & DEV ENGLISH CONTROLLERS (MÓDULO INDEPENDIENTE)
// ============================================================================
const TechHubController = (() => {
  let currentSubTab = 'flashcards';

  const init = () => {
    refreshMetrics();
    setSubTab(currentSubTab);
  };

  const refreshMetrics = () => {
    const allTech = typeof TECH_DEV_WORDS !== 'undefined' ? TECH_DEV_WORDS : [];
    const metrics = StorageEngine.getTechMetricsSummary(allTech);

    const masteredEl = document.getElementById('tech-stat-mastered');
    if (masteredEl) masteredEl.textContent = metrics.masteredCount;

    const learningEl = document.getElementById('tech-stat-learning');
    if (learningEl) learningEl.textContent = metrics.learningCount;

    const dueEl = document.getElementById('tech-stat-due');
    if (dueEl) dueEl.textContent = metrics.dueTodayCount;

    const totalEl = document.getElementById('tech-stat-total');
    if (totalEl) totalEl.textContent = metrics.totalWords;

    const readinessEl = document.getElementById('tech-header-readiness');
    if (readinessEl) readinessEl.textContent = `${metrics.readinessPercentage}%`;
  };

  const setSubTab = (tabId) => {
    currentSubTab = tabId;

    // Toggle subviews
    document.querySelectorAll('.tech-subview').forEach(sv => sv.classList.add('hidden'));
    const target = document.getElementById(`tech-subview-${tabId}`);
    if (target) target.classList.remove('hidden');

    // Update tab button styles
    const tabs = ['flashcards', 'chunks', 'quiz'];
    tabs.forEach(t => {
      const btn = document.getElementById(`tech-tab-btn-${t}`);
      if (!btn) return;
      if (t === tabId) {
        btn.className = 'px-4 py-2 rounded-xl bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm transition-all flex items-center gap-2';
      } else {
        btn.className = 'px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-all flex items-center gap-2';
      }
    });

    if (tabId === 'flashcards') {
      TechFlashcardController.initSession();
    } else if (tabId === 'chunks') {
      TechChunksController.init();
    } else if (tabId === 'quiz') {
      TechQuizController.startQuiz();
    }

    if (window.lucide) lucide.createIcons();
  };

  return {
    init,
    refreshMetrics,
    setSubTab,
    getCurrentSubTab: () => currentSubTab
  };
})();

const TechFlashcardController = (() => {
  let queue = [];
  let currentIndex = 0;
  let isFlipped = false;

  const initSession = () => {
    const allTech = typeof TECH_DEV_WORDS !== 'undefined' ? TECH_DEV_WORDS : [];
    queue = StorageEngine.getTechStudyQueue(allTech, 15);
    currentIndex = 0;
    isFlipped = false;

    const cardEl = document.getElementById('tech-flashcard-element');
    const finishedCard = document.getElementById('tech-fc-finished-card');
    if (finishedCard) finishedCard.classList.add('hidden');

    if (!queue.length) {
      if (cardEl) cardEl.classList.add('hidden');
      if (finishedCard) finishedCard.classList.remove('hidden');
      return;
    }

    if (cardEl) cardEl.classList.remove('hidden');
    renderCurrentCard();
  };

  const getCategoryBadgeClass = (category) => {
    if (category.includes('Standup')) return 'badge-tech-standup';
    if (category.includes('Review')) return 'badge-tech-pr';
    if (category.includes('System Design')) return 'badge-tech-sysdesign';
    return 'badge-tech-interview';
  };

  const renderCurrentCard = () => {
    if (currentIndex >= queue.length) {
      const cardEl = document.getElementById('tech-flashcard-element');
      const finishedCard = document.getElementById('tech-fc-finished-card');
      if (cardEl) cardEl.classList.add('hidden');
      if (finishedCard) {
        finishedCard.classList.remove('hidden');
        if (window.lucide) lucide.createIcons();
      }
      TechHubController.refreshMetrics();
      return;
    }

    const item = queue[currentIndex];
    isFlipped = false;

    const cardEl = document.getElementById('tech-flashcard-element');
    if (cardEl) cardEl.classList.remove('flipped');

    const counter = document.getElementById('tech-fc-counter');
    if (counter) counter.textContent = `Tarjeta ${currentIndex + 1} de ${queue.length}`;

    // Front
    const frontWord = document.getElementById('tech-fc-front-word');
    const frontPhonetic = document.getElementById('tech-fc-front-phonetic');
    const frontCat = document.getElementById('tech-fc-front-category');
    const frontPos = document.getElementById('tech-fc-front-pos');

    if (frontWord) frontWord.textContent = item.word;
    if (frontPhonetic) frontPhonetic.textContent = item.phonetic;
    if (frontPos) frontPos.textContent = item.partOfSpeech;
    if (frontCat) {
      frontCat.textContent = item.category;
      frontCat.className = `px-2.5 py-1 rounded-lg text-xs font-bold ${getCategoryBadgeClass(item.category)}`;
    }

    // Back
    const backMeaning = document.getElementById('tech-fc-back-meaning');
    const backCat = document.getElementById('tech-fc-back-category');
    const backTip = document.getElementById('tech-fc-back-tip');
    const backColloc = document.getElementById('tech-fc-back-collocation');

    if (backMeaning) backMeaning.textContent = item.meaningEs;
    if (backCat) backCat.textContent = item.category;
    if (backTip) backTip.textContent = item.interviewTip || 'Uso común en equipos de software globales.';
    if (backColloc) backColloc.textContent = item.collocation;

    const s1 = item.sentences && item.sentences[0];
    const s2 = item.sentences && item.sentences[1];

    const s1En = document.getElementById('tech-fc-s1-en');
    const s1Es = document.getElementById('tech-fc-s1-es');
    if (s1En && s1) s1En.textContent = s1.en;
    if (s1Es && s1) s1Es.textContent = s1.es;

    const s2En = document.getElementById('tech-fc-s2-en');
    const s2Es = document.getElementById('tech-fc-s2-es');
    if (s2En && s2) s2En.textContent = s2.en;
    if (s2Es && s2) s2Es.textContent = s2.es;

    if (window.lucide) lucide.createIcons();
  };

  const flipCurrentCard = () => {
    const cardEl = document.getElementById('tech-flashcard-element');
    if (!cardEl) return;
    isFlipped = !isFlipped;
    cardEl.classList.toggle('flipped', isFlipped);
  };

  const handleCardClick = (event) => {
    if (event.target.closest('button')) return;
    flipCurrentCard();
  };

  const playCurrentWordAudio = (event) => {
    if (event) event.stopPropagation();
    const item = queue[currentIndex];
    if (!item) return;
    const btn = document.getElementById('tech-fc-audio-btn');
    TTSEngine.speak(item.word, null, btn);
  };

  const playSentenceAudio = (idx, event) => {
    if (event) event.stopPropagation();
    const item = queue[currentIndex];
    if (!item || !item.sentences) return;
    const s = item.sentences[idx - 1];
    if (s) {
      const btn = document.getElementById(`tech-fc-s${idx}-audio`);
      TTSEngine.speak(s.en, null, btn);
    }
  };

  const submitRating = (rating) => {
    const item = queue[currentIndex];
    if (!item) return;
    StorageEngine.applyTechSRSRating(item.id, rating);
    currentIndex += 1;
    renderCurrentCard();
    TechHubController.refreshMetrics();
  };

  const startNewSession = () => initSession();

  return {
    initSession,
    flipCurrentCard,
    handleCardClick,
    playCurrentWordAudio,
    playSentenceAudio,
    submitRating,
    startNewSession
  };
})();

const TechChunksController = (() => {
  let mode = 'reader';
  let sentencesList = [];
  let currentIndex = 0;
  let isTranslationVisible = true;

  const init = () => {
    const allTech = typeof TECH_DEV_WORDS !== 'undefined' ? TECH_DEV_WORDS : [];
    sentencesList = [];
    allTech.forEach(w => {
      if (w.sentences && w.sentences.length) {
        w.sentences.forEach(s => {
          sentencesList.push({
            wordId: w.id,
            targetWord: w.word,
            category: w.category,
            collocation: w.collocation,
            en: s.en,
            es: s.es
          });
        });
      }
    });

    sentencesList.sort(() => Math.random() - 0.5);
    currentIndex = 0;
    isTranslationVisible = true;
    renderSentence();
  };

  const setMode = (newMode) => {
    mode = newMode;
    const readerTab = document.getElementById('tech-chunk-tab-reader');
    const clozeTab = document.getElementById('tech-chunk-tab-cloze');
    const clozeArea = document.getElementById('tech-chunk-cloze-area');

    if (mode === 'reader') {
      readerTab.className = 'px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm';
      clozeTab.className = 'px-3.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400';
      if (clozeArea) clozeArea.classList.add('hidden');
    } else {
      clozeTab.className = 'px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm';
      readerTab.className = 'px-3.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400';
      if (clozeArea) clozeArea.classList.remove('hidden');
    }
    renderSentence();
  };

  const renderSentence = () => {
    if (!sentencesList.length) return;
    const item = sentencesList[currentIndex];

    const catBadge = document.getElementById('tech-chunk-cat-badge');
    if (catBadge) {
      catBadge.textContent = item.category;
      if (item.category.includes('Standup')) catBadge.className = 'px-2.5 py-0.5 rounded-md text-xs font-bold badge-tech-standup';
      else if (item.category.includes('Review')) catBadge.className = 'px-2.5 py-0.5 rounded-md text-xs font-bold badge-tech-pr';
      else if (item.category.includes('System Design')) catBadge.className = 'px-2.5 py-0.5 rounded-md text-xs font-bold badge-tech-sysdesign';
      else catBadge.className = 'px-2.5 py-0.5 rounded-md text-xs font-bold badge-tech-interview';
    }

    const collocTag = document.getElementById('tech-chunk-colloc-tag');
    if (collocTag) collocTag.textContent = item.collocation ? `Colocación: ${item.collocation}` : 'Contexto técnico';

    const transText = document.getElementById('tech-chunk-display-es');
    if (transText) transText.textContent = item.es;
    updateTranslationDisplay();

    const displayEn = document.getElementById('tech-chunk-display-en');
    if (!displayEn) return;

    const regex = new RegExp(`\\b(${escapeRegExp(item.targetWord)}(\\w*)?)\\b`, 'gi');
    if (mode === 'reader') {
      displayEn.innerHTML = item.en.replace(regex, `<span class="text-emerald-600 dark:text-emerald-400 underline decoration-emerald-400 underline-offset-8 font-black">$1</span>`);
    } else {
      displayEn.innerHTML = item.en.replace(regex, `<span id="tech-cloze-blank" class="px-4 py-0.5 border-b-4 border-emerald-500 font-black text-emerald-500">______</span>`);
      renderClozeOptions(item);
    }

    if (window.lucide) lucide.createIcons();
  };

  const renderClozeOptions = (currentItem) => {
    const grid = document.getElementById('tech-chunk-options-grid');
    const feedback = document.getElementById('tech-chunk-feedback');
    if (!grid) return;

    grid.innerHTML = '';
    if (feedback) feedback.textContent = '';

    const allTech = typeof TECH_DEV_WORDS !== 'undefined' ? TECH_DEV_WORDS : [];
    const distractors = allTech
      .filter(w => w.id !== currentItem.wordId)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.word);

    const options = [currentItem.targetWord, ...distractors].sort(() => Math.random() - 0.5);

    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'tech-cloze-opt-btn p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono font-bold text-sm transition-all';
      btn.textContent = opt;
      btn.onclick = () => handleClozeSelection(opt, currentItem.targetWord, btn);
      grid.appendChild(btn);
    });
  };

  const handleClozeSelection = (selected, correct, buttonElement) => {
    const isCorrect = selected.toLowerCase() === correct.toLowerCase();
    const feedback = document.getElementById('tech-chunk-feedback');
    const blank = document.getElementById('tech-cloze-blank');

    document.querySelectorAll('.tech-cloze-opt-btn').forEach(b => b.disabled = true);

    if (isCorrect) {
      buttonElement.className = 'tech-cloze-opt-btn p-3 rounded-xl bg-emerald-500 text-white font-mono font-bold text-sm shadow-md';
      if (feedback) feedback.innerHTML = '<span class="text-emerald-500 font-bold">¡Correcto! Uso y colocación precisa en contexto técnico.</span>';
      if (blank) {
        blank.textContent = correct;
        blank.className = 'px-2 py-0.5 text-emerald-500 font-black border-b-4 border-emerald-500';
      }
      playCurrentSentenceAudio();
      StorageEngine.recordStudySession();
    } else {
      buttonElement.className = 'tech-cloze-opt-btn p-3 rounded-xl bg-rose-500 text-white font-mono font-bold text-sm animate-shake';
      if (feedback) feedback.innerHTML = `<span class="text-rose-500 font-bold">Incorrecto. El término adecuado es: <strong>${correct}</strong></span>`;
      if (blank) {
        blank.textContent = correct;
        blank.className = 'px-2 py-0.5 text-rose-500 font-black border-b-4 border-rose-500';
      }
    }
  };

  const toggleTranslationVisibility = () => {
    isTranslationVisible = !isTranslationVisible;
    updateTranslationDisplay();
  };

  const updateTranslationDisplay = () => {
    const transText = document.getElementById('tech-chunk-display-es');
    const btnLabel = document.getElementById('tech-chunk-trans-label');
    if (!transText || !btnLabel) return;
    if (isTranslationVisible) {
      transText.classList.remove('opacity-0', 'blur-sm');
      btnLabel.textContent = 'Ocultar Traducción';
    } else {
      transText.classList.add('opacity-0', 'blur-sm');
      btnLabel.textContent = 'Ver Traducción';
    }
  };

  const nextSentence = () => {
    currentIndex = (currentIndex + 1) % sentencesList.length;
    renderSentence();
  };

  const prevSentence = () => {
    currentIndex = (currentIndex - 1 + sentencesList.length) % sentencesList.length;
    renderSentence();
  };

  const playCurrentSentenceAudio = () => {
    const item = sentencesList[currentIndex];
    if (item) TTSEngine.speak(item.en);
  };

  const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return {
    init,
    setMode,
    toggleTranslationVisibility,
    nextSentence,
    prevSentence,
    playCurrentSentenceAudio
  };
})();

const TechQuizController = (() => {
  let questions = [];
  let currentQIndex = 0;
  let score = 0;
  let correctCount = 0;

  const startQuiz = () => {
    const allTech = typeof TECH_DEV_WORDS !== 'undefined' ? TECH_DEV_WORDS : [];
    const shuffled = [...allTech].sort(() => Math.random() - 0.5).slice(0, 10);

    questions = shuffled.map(target => {
      const distractors = allTech
        .filter(w => w.id !== target.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => w.meaningEs);

      const options = [target.meaningEs, ...distractors].sort(() => Math.random() - 0.5);

      return {
        word: target.word,
        category: target.category,
        correctMeaning: target.meaningEs,
        options
      };
    });

    currentQIndex = 0;
    score = 0;
    correctCount = 0;

    const activeCard = document.getElementById('tech-quiz-active-card');
    const resultsCard = document.getElementById('tech-quiz-results-card');
    if (activeCard) activeCard.classList.remove('hidden');
    if (resultsCard) resultsCard.classList.add('hidden');

    renderQuestion();
  };

  const renderQuestion = () => {
    if (currentQIndex >= questions.length) {
      finishQuiz();
      return;
    }

    const q = questions[currentQIndex];

    const currentQEl = document.getElementById('tech-quiz-current-q');
    if (currentQEl) currentQEl.textContent = currentQIndex + 1;

    const scoreEl = document.getElementById('tech-quiz-score-display');
    if (scoreEl) scoreEl.textContent = `Puntos: ${score}`;

    const catPill = document.getElementById('tech-quiz-cat-pill');
    if (catPill) catPill.textContent = q.category;

    const progressBar = document.getElementById('tech-quiz-progress-bar');
    if (progressBar) {
      progressBar.style.width = `${((currentQIndex + 1) / questions.length) * 100}%`;
    }

    const wordEl = document.getElementById('tech-quiz-question-word');
    if (wordEl) wordEl.textContent = q.word;

    const optionsContainer = document.getElementById('tech-quiz-options-container');
    if (!optionsContainer) return;
    optionsContainer.innerHTML = '';

    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'tech-quiz-opt-btn p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-sm text-left transition-all';
      btn.textContent = opt;
      btn.onclick = () => handleAnswer(opt, q.correctMeaning, btn);
      optionsContainer.appendChild(btn);
    });

    if (window.lucide) lucide.createIcons();
  };

  const handleAnswer = (selected, correct, buttonElement) => {
    document.querySelectorAll('.tech-quiz-opt-btn').forEach(b => b.disabled = true);

    const isCorrect = selected === correct;

    if (isCorrect) {
      buttonElement.classList.remove('bg-slate-50', 'dark:bg-slate-800/80', 'border-slate-200');
      buttonElement.classList.add('bg-emerald-500', 'border-emerald-500', 'text-white');
      score += 100;
      correctCount += 1;
    } else {
      buttonElement.classList.remove('bg-slate-50', 'dark:bg-slate-800/80', 'border-slate-200');
      buttonElement.classList.add('bg-rose-500', 'border-rose-500', 'text-white', 'animate-shake');

      document.querySelectorAll('.tech-quiz-opt-btn').forEach(b => {
        if (b.textContent === correct) {
          b.classList.add('bg-emerald-500', 'border-emerald-500', 'text-white');
        }
      });
    }

    setTimeout(() => {
      currentQIndex += 1;
      renderQuestion();
    }, 1100);
  };

  const finishQuiz = () => {
    const activeCard = document.getElementById('tech-quiz-active-card');
    const resultsCard = document.getElementById('tech-quiz-results-card');
    if (activeCard) activeCard.classList.add('hidden');
    if (resultsCard) resultsCard.classList.remove('hidden');

    const finalCorrect = document.getElementById('tech-quiz-final-correct');
    if (finalCorrect) finalCorrect.textContent = `${correctCount} / 10`;

    const finalPct = document.getElementById('tech-quiz-final-pct');
    if (finalPct) finalPct.textContent = `${Math.round((correctCount / 10) * 100)}%`;

    StorageEngine.recordStudySession();
    TechHubController.refreshMetrics();
    if (window.lucide) lucide.createIcons();
  };

  const restartQuiz = () => startQuiz();

  const playQuestionAudio = () => {
    const q = questions[currentQIndex];
    if (q) TTSEngine.speak(q.word);
  };

  return {
    startQuiz,
    restartQuiz,
    playQuestionAudio
  };
})();

// ============================================================================
// 12. KEYBOARD SHORTCUTS MANAGER
// ============================================================================
window.addEventListener('keydown', (e) => {
  // Ignorar eventos de teclado cuando el usuario escribe en inputs o textareas
  const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
  if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
    return;
  }

  const currentView = NavigationController.getCurrentView();

  if (currentView === 'flashcards') {
    if (e.code === 'Space') {
      e.preventDefault();
      FlashcardController.flipCurrentCard();
    } else if (e.key === '1') {
      e.preventDefault();
      FlashcardController.submitRating('hard');
    } else if (e.key === '2') {
      e.preventDefault();
      FlashcardController.submitRating('good');
    } else if (e.key === '3') {
      e.preventDefault();
      FlashcardController.submitRating('easy');
    } else if (e.key === 'a' || e.key === 'A') {
      e.preventDefault();
      FlashcardController.playCurrentWordAudio();
    }
  } else if (currentView === 'tech' && TechHubController.getCurrentSubTab() === 'flashcards') {
    if (e.code === 'Space') {
      e.preventDefault();
      TechFlashcardController.flipCurrentCard();
    } else if (e.key === '1') {
      e.preventDefault();
      TechFlashcardController.submitRating('hard');
    } else if (e.key === '2') {
      e.preventDefault();
      TechFlashcardController.submitRating('good');
    } else if (e.key === '3') {
      e.preventDefault();
      TechFlashcardController.submitRating('easy');
    } else if (e.key === 'a' || e.key === 'A') {
      e.preventDefault();
      TechFlashcardController.playCurrentWordAudio();
    }
  }
});

// ============================================================================
// 12. INITIALIZATION ON DOM READY
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar Voces y TTS
  TTSEngine.init();

  // Inicializar Tema Claro / Oscuro
  ThemeController.init();

  // Configurar listeners de menú móvil
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileClose = document.getElementById('mobile-menu-close');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => NavigationController.toggleMobileMenu(true));
  }
  if (mobileClose) {
    mobileClose.addEventListener('click', () => NavigationController.toggleMobileMenu(false));
  }

  // Arrancar en la vista Dashboard
  NavigationController.navigateTo('dashboard');
});
