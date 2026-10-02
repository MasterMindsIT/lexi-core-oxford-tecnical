/**
 * LexiCore 80/20 - Storage & Persistence Engine
 * Maneja la persistencia en localStorage, el estado del algoritmo SRS,
 * la racha diaria de estudio, métricas 80/20, importación y exportación de datos.
 */

const StorageEngine = (() => {
  const KEYS = {
    PROGRESS: 'lexicore_srs_progress_v1',
    TECH_PROGRESS: 'lexicore_tech_srs_v1',
    STATS: 'lexicore_user_stats_v1',
    SETTINGS: 'lexicore_user_settings_v1'
  };

  // Valores predeterminados para estadísticas de usuario
  const DEFAULT_STATS = {
    streak: 0,
    lastStudyDate: null,
    dailyGoal: 10,
    todayReviewedCount: 0,
    totalReviewsCompleted: 0
  };

  // Configuración predeterminada de usuario
  const DEFAULT_SETTINGS = {
    theme: 'dark',
    soundEffects: true,
    voiceAccent: 'en-US',
    speechRate: 1.0,
    autoPlayAudio: false
  };

  // Helper para obtener fecha local en formato YYYY-MM-DD
  const getTodayDateString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper para sumar días a una fecha
  const addDaysToDate = (dateStr, days) => {
    const d = new Date(dateStr + 'T00:00:00');
    d.setDate(d.getDate() + days);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Obtener todo el progreso de palabras { [wordId]: progressObj }
  const getProgressMap = () => {
    try {
      const data = localStorage.getItem(KEYS.PROGRESS);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Error al leer progreso de localStorage:', e);
      return {};
    }
  };

  // Guardar mapa de progreso
  const saveProgressMap = (progressMap) => {
    try {
      localStorage.setItem(KEYS.PROGRESS, JSON.stringify(progressMap));
    } catch (e) {
      console.error('Error al guardar progreso en localStorage:', e);
    }
  };

  // Obtener estadísticas de usuario
  const getStats = () => {
    try {
      const data = localStorage.getItem(KEYS.STATS);
      const stats = data ? JSON.parse(data) : { ...DEFAULT_STATS };
      
      // Si la última sesión no fue hoy, reiniciar el contador diario de revisiones
      const today = getTodayDateString();
      if (stats.lastStudyDate !== today) {
        stats.todayReviewedCount = 0;
      }
      return stats;
    } catch (e) {
      console.error('Error al leer estadísticas de localStorage:', e);
      return { ...DEFAULT_STATS };
    }
  };

  // Guardar estadísticas de usuario
  const saveStats = (stats) => {
    try {
      localStorage.setItem(KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
      console.error('Error al guardar estadísticas en localStorage:', e);
    }
  };

  // Obtener configuración de usuario
  const getSettings = () => {
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : { ...DEFAULT_SETTINGS };
    } catch (e) {
      console.error('Error al leer ajustes de localStorage:', e);
      return { ...DEFAULT_SETTINGS };
    }
  };

  // Guardar configuración de usuario
  const saveSettings = (settings) => {
    try {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Error al guardar ajustes en localStorage:', e);
    }
  };

  // Actualizar la racha diaria de estudio
  const recordStudySession = () => {
    const stats = getStats();
    const today = getTodayDateString();

    if (!stats.lastStudyDate) {
      // Primera sesión de estudio
      stats.streak = 1;
      stats.lastStudyDate = today;
    } else if (stats.lastStudyDate === today) {
      // Ya estudió hoy; mantener la racha actual
    } else {
      const yesterday = addDaysToDate(today, -1);
      if (stats.lastStudyDate === yesterday) {
        // Estudió ayer de forma consecutiva
        stats.streak += 1;
      } else {
        // Se rompió la racha (más de 1 día de inactividad)
        stats.streak = 1;
      }
      stats.lastStudyDate = today;
    }

    stats.todayReviewedCount = (stats.todayReviewedCount || 0) + 1;
    stats.totalReviewsCompleted = (stats.totalReviewsCompleted || 0) + 1;
    saveStats(stats);
    return stats;
  };

  /**
   * Obtener el estado SRS de una palabra individual.
   * Si no existe, inicializa con status: 'new'
   */
  const getWordProgress = (wordId) => {
    const progressMap = getProgressMap();
    if (progressMap[wordId]) {
      return progressMap[wordId];
    }
    return {
      id: wordId,
      status: 'new', // 'new' | 'learning' | 'mastered'
      repetitions: 0,
      interval: 0, // Días hasta el próximo repaso
      easeFactor: 2.5,
      nextReviewDate: null,
      lastReviewed: null,
      history: []
    };
  };

  /**
   * Aplicar calificación SRS a una palabra.
   * @param {number} wordId - ID de la palabra
   * @param {'hard' | 'good' | 'easy'} rating - Grado de dificultad seleccionado
   */
  const applySRSRating = (wordId, rating) => {
    const progressMap = getProgressMap();
    const current = getWordProgress(wordId);
    const today = getTodayDateString();

    let newInterval = 1;
    let newRepetitions = current.repetitions;
    let newStatus = current.status;
    let newEase = current.easeFactor || 2.5;

    switch (rating) {
      case 'hard':
        // Difícil: repaso inmediato hoy/mañana, reinicia racha de la tarjeta
        newInterval = 1;
        newRepetitions = 0;
        newStatus = 'learning';
        newEase = Math.max(1.3, newEase - 0.2);
        break;

      case 'good':
        // Bien: intervalo estándar escalable (1 día -> 3 días -> n * ease)
        if (newRepetitions === 0) {
          newInterval = 2;
        } else if (newRepetitions === 1) {
          newInterval = 3;
        } else {
          newInterval = Math.round(current.interval * newEase);
        }
        newRepetitions += 1;
        newStatus = newRepetitions >= 4 ? 'mastered' : 'learning';
        break;

      case 'easy':
        // Fácil: salto más amplio (7 días directo o expansión rápida)
        if (newRepetitions === 0) {
          newInterval = 4;
        } else if (newRepetitions === 1) {
          newInterval = 7;
        } else {
          newInterval = Math.round(current.interval * (newEase + 0.3) * 1.5);
        }
        newRepetitions += 1;
        newEase = Math.min(3.0, newEase + 0.15);
        // Marcada como dominada si alcanza 3 o más repeticiones exitosas
        newStatus = newRepetitions >= 2 ? 'mastered' : 'learning';
        break;

      default:
        newInterval = 1;
    }

    const updatedItem = {
      ...current,
      status: newStatus,
      repetitions: newRepetitions,
      interval: newInterval,
      easeFactor: Number(newEase.toFixed(2)),
      nextReviewDate: addDaysToDate(today, newInterval),
      lastReviewed: today,
      history: [
        ...(current.history || []),
        { date: today, rating, interval: newInterval }
      ]
    };

    progressMap[wordId] = updatedItem;
    saveProgressMap(progressMap);

    // Contabilizar sesión en racha y estadísticas
    recordStudySession();

    return updatedItem;
  };

  /**
   * Calcula el resumen de métricas para el Dashboard
   * @param {Array} allWords - Catálogo completo de palabras
   */
  const getMetricsSummary = (allWords = []) => {
    const progressMap = getProgressMap();
    const stats = getStats();
    const today = getTodayDateString();

    const totalWords = allWords.length || 1;
    let masteredCount = 0;
    let learningCount = 0;
    let newCount = 0;
    let dueTodayCount = 0;

    // Conteo por nivel CEFR
    const levelStats = {
      A1: { total: 0, mastered: 0, learning: 0 },
      A2: { total: 0, mastered: 0, learning: 0 },
      B1: { total: 0, mastered: 0, learning: 0 },
      B2: { total: 0, mastered: 0, learning: 0 }
    };

    allWords.forEach(word => {
      const lvl = word.level ? word.level.toUpperCase() : 'A1';
      if (levelStats[lvl]) levelStats[lvl].total += 1;

      const p = progressMap[word.id];
      if (!p || p.status === 'new') {
        newCount += 1;
      } else if (p.status === 'mastered') {
        masteredCount += 1;
        if (levelStats[lvl]) levelStats[lvl].mastered += 1;
        if (p.nextReviewDate && p.nextReviewDate <= today) {
          dueTodayCount += 1;
        }
      } else if (p.status === 'learning') {
        learningCount += 1;
        if (levelStats[lvl]) levelStats[lvl].learning += 1;
        if (p.nextReviewDate && p.nextReviewDate <= today) {
          dueTodayCount += 1;
        }
      }
    });

    // Estimación de Cobertura 80/20 del vocabulario cotidiano:
    // Ponderación: Palabras dominadas valen 100%, palabras en progreso 40%.
    // La meta es alcanzar el 80% de cobertura del habla cotidiana según Pareto.
    const effectiveLearnedScore = (masteredCount * 1.0) + (learningCount * 0.4);
    const coveragePercentage = Math.min(80, Math.round((effectiveLearnedScore / totalWords) * 80));

    return {
      totalWords,
      masteredCount,
      learningCount,
      newCount,
      dueTodayCount,
      coveragePercentage,
      targetCoverage: 80,
      streak: stats.streak,
      dailyGoal: stats.dailyGoal,
      todayReviewedCount: stats.todayReviewedCount,
      levelStats
    };
  };

  /**
   * Obtiene la cola de palabras para estudiar en la sesión actual
   * Prioriza:
   * 1. Palabras vencidas para repaso hoy (due)
   * 2. Palabras nuevas (hasta completar el lote deseado)
   */
  const getStudyQueue = (allWords = [], limit = 15) => {
    const progressMap = getProgressMap();
    const today = getTodayDateString();

    const dueWords = [];
    const newWords = [];
    const otherWords = [];

    allWords.forEach(word => {
      const p = progressMap[word.id];
      if (!p || p.status === 'new') {
        newWords.push(word);
      } else if (p.nextReviewDate && p.nextReviewDate <= today) {
        dueWords.push(word);
      } else {
        otherWords.push(word);
      }
    });

    // Mezclar lote: primero vencidas, luego nuevas
    const queue = [...dueWords];
    const needed = limit - queue.length;
    if (needed > 0) {
      queue.push(...newWords.slice(0, needed));
    }
    // Si aún no llena el límite y no hay nuevas, sugerir repasar otras
    if (queue.length === 0 && otherWords.length > 0) {
      queue.push(...otherWords.slice(0, limit));
    }

    return queue;
  };

  // ==========================================================================
  // TECH & DEV ENGLISH PERSISTENCE METHODS (INDEPENDIENTES)
  // ==========================================================================
  const getTechProgressMap = () => {
    try {
      const data = localStorage.getItem(KEYS.TECH_PROGRESS);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Error al leer progreso técnico de localStorage:', e);
      return {};
    }
  };

  const saveTechProgressMap = (progressMap) => {
    try {
      localStorage.setItem(KEYS.TECH_PROGRESS, JSON.stringify(progressMap));
    } catch (e) {
      console.error('Error al guardar progreso técnico en localStorage:', e);
    }
  };

  const getTechWordProgress = (wordId) => {
    const map = getTechProgressMap();
    if (map[wordId]) return map[wordId];
    return {
      id: wordId,
      status: 'new',
      repetitions: 0,
      interval: 0,
      easeFactor: 2.5,
      nextReviewDate: null,
      lastReviewed: null,
      history: []
    };
  };

  const applyTechSRSRating = (wordId, rating) => {
    const map = getTechProgressMap();
    const current = getTechWordProgress(wordId);
    const today = getTodayDateString();

    let newInterval = 1;
    let newRepetitions = current.repetitions;
    let newStatus = current.status;
    let newEase = current.easeFactor || 2.5;

    switch (rating) {
      case 'hard':
        newInterval = 1;
        newRepetitions = 0;
        newStatus = 'learning';
        newEase = Math.max(1.3, newEase - 0.2);
        break;
      case 'good':
        if (newRepetitions === 0) newInterval = 2;
        else if (newRepetitions === 1) newInterval = 3;
        else newInterval = Math.round(current.interval * newEase);
        newRepetitions += 1;
        newStatus = newRepetitions >= 4 ? 'mastered' : 'learning';
        break;
      case 'easy':
        if (newRepetitions === 0) newInterval = 4;
        else if (newRepetitions === 1) newInterval = 7;
        else newInterval = Math.round(current.interval * (newEase + 0.3) * 1.5);
        newRepetitions += 1;
        newEase = Math.min(3.0, newEase + 0.15);
        newStatus = newRepetitions >= 2 ? 'mastered' : 'learning';
        break;
      default:
        newInterval = 1;
    }

    const updatedItem = {
      ...current,
      status: newStatus,
      repetitions: newRepetitions,
      interval: newInterval,
      easeFactor: Number(newEase.toFixed(2)),
      nextReviewDate: addDaysToDate(today, newInterval),
      lastReviewed: today,
      history: [
        ...(current.history || []),
        { date: today, rating, interval: newInterval }
      ]
    };

    map[wordId] = updatedItem;
    saveTechProgressMap(map);
    recordStudySession();
    return updatedItem;
  };

  const getTechStudyQueue = (allTechWords = [], limit = 15) => {
    const map = getTechProgressMap();
    const today = getTodayDateString();

    const dueWords = [];
    const newWords = [];
    const otherWords = [];

    allTechWords.forEach(word => {
      const p = map[word.id];
      if (!p || p.status === 'new') {
        newWords.push(word);
      } else if (p.nextReviewDate && p.nextReviewDate <= today) {
        dueWords.push(word);
      } else {
        otherWords.push(word);
      }
    });

    const queue = [...dueWords];
    const needed = limit - queue.length;
    if (needed > 0) queue.push(...newWords.slice(0, needed));
    if (queue.length === 0 && otherWords.length > 0) queue.push(...otherWords.slice(0, limit));
    return queue;
  };

  const getTechMetricsSummary = (allTechWords = []) => {
    const map = getTechProgressMap();
    const today = getTodayDateString();

    const totalWords = allTechWords.length || 1;
    let masteredCount = 0;
    let learningCount = 0;
    let newCount = 0;
    let dueTodayCount = 0;

    const categoryStats = {};

    allTechWords.forEach(word => {
      const cat = word.category || 'General';
      if (!categoryStats[cat]) categoryStats[cat] = { total: 0, mastered: 0, learning: 0 };
      categoryStats[cat].total += 1;

      const p = map[word.id];
      if (!p || p.status === 'new') {
        newCount += 1;
      } else if (p.status === 'mastered') {
        masteredCount += 1;
        categoryStats[cat].mastered += 1;
        if (p.nextReviewDate && p.nextReviewDate <= today) dueTodayCount += 1;
      } else if (p.status === 'learning') {
        learningCount += 1;
        categoryStats[cat].learning += 1;
        if (p.nextReviewDate && p.nextReviewDate <= today) dueTodayCount += 1;
      }
    });

    // Score de preparación para entrevistas técnicas (Tech Readiness %):
    const effectiveLearnedScore = (masteredCount * 1.0) + (learningCount * 0.4);
    const readinessPercentage = Math.min(100, Math.round((effectiveLearnedScore / totalWords) * 100));

    return {
      totalWords,
      masteredCount,
      learningCount,
      newCount,
      dueTodayCount,
      readinessPercentage,
      categoryStats
    };
  };

  // Exportar todo el estado como archivo JSON descargable
  const exportProgressAsJSON = () => {
    const exportData = {
      app: 'LexiCore 80/20',
      version: 1,
      exportedAt: new Date().toISOString(),
      progress: getProgressMap(),
      techProgress: getTechProgressMap(),
      stats: getStats(),
      settings: getSettings()
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `lexicore_backup_${getTodayDateString()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Importar progreso desde un objeto JSON
  const importProgressFromJSON = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('El archivo no contiene un formato JSON válido.');
      }

      if (parsed.progress) {
        saveProgressMap(parsed.progress);
      }
      if (parsed.techProgress) {
        saveTechProgressMap(parsed.techProgress);
      }
      if (parsed.stats) {
        saveStats({ ...DEFAULT_STATS, ...parsed.stats });
      }
      if (parsed.settings) {
        saveSettings({ ...DEFAULT_SETTINGS, ...parsed.settings });
      }

      return { success: true, message: '¡Progreso importado con éxito!' };
    } catch (err) {
      return { success: false, message: 'Error al importar: ' + err.message };
    }
  };

  // Reiniciar todo el progreso
  const resetAllProgress = () => {
    localStorage.removeItem(KEYS.PROGRESS);
    localStorage.removeItem(KEYS.TECH_PROGRESS);
    localStorage.removeItem(KEYS.STATS);
    // Conservamos ajustes de tema y voz si el usuario lo desea
    const currentSettings = getSettings();
    saveSettings(currentSettings);
    return true;
  };

  return {
    getTodayDateString,
    getProgressMap,
    getStats,
    saveStats,
    getSettings,
    saveSettings,
    getWordProgress,
    applySRSRating,
    getMetricsSummary,
    getStudyQueue,
    recordStudySession,
    // Métodos Tech & Dev
    getTechProgressMap,
    saveTechProgressMap,
    getTechWordProgress,
    applyTechSRSRating,
    getTechStudyQueue,
    getTechMetricsSummary,
    // Utilidades
    exportProgressAsJSON,
    importProgressFromJSON,
    resetAllProgress
  };
})();
