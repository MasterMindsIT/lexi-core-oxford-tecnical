# ⚡ LexiCore 80/20 - Accelerated English Learning for Developers & Tech Professionals

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript ES6+](https://img.shields.io/badge/JavaScript_ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Web Speech API](https://img.shields.io/badge/Web_Speech_API-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Storage](https://img.shields.io/badge/Storage-localStorage-10B981?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

Una aplicación web **Single Page Application (SPA)** moderna, ultraligera, responsiva y autónoma diseñada bajo el **Principio de Pareto (Regla del 80/20)** para el aprendizaje acelerado y la retención a largo plazo del inglés. 

Incluye un módulo general basado en **Oxford 3000 / GSL (General Service List)** y un hub especializado **100% independiente** enfocado en **Ingenieros de Software, Daily Standups, Code Reviews, System Design y Entrevistas Técnicas internacionales**.

---

## 🎯 Filosofía y Fundamentos Científicos

### 1. La Regla del 80/20 (Principio de Pareto)
En lingüística del inglés, las **1.000 palabras más frecuentes cubren aproximadamente el 80%** de todas las conversaciones cotidianas. Dominar este núcleo de alta frecuencia genera el mayor retorno de inversión de tu tiempo antes de memorizar vocabulario secundario o poco común.

### 2. Sistema de Repetición Espaciada (SRS)
Para combatir la **Curva del Olvido de Hermann Ebbinghaus**, el sistema programa repasos en intervalos crecientes:
* **Difícil (`[1]`):** Intervalo de 1 día (repaso inmediato hoy/mañana).
* **Bien (`[2]`):** Intervalo de 3 días.
* **Fácil (`[3]`):** Intervalo de 7 días o más (consolida y promueve a palabra dominada).

### 3. Language Chunks & Colocaciones (Contexto Real)
No memorices palabras aisladas. El cerebro humano recuerda patrones y bloques de lenguaje (*chunks*). Cada término viene acompañado de sus preposiciones habituales y oraciones reales en inglés con traducción al español.

---

## 💻 Hub Especializado: Tech & Dev English

Diseñado específicamente para programadores, líderes técnicos y candidatos a vacantes remotas en el extranjero:

| Categoría | Conceptos y Expresiones Clave |
|---|---|
| **Daily Standups & Agile** | *blocker, bandwidth, bottleneck, ETA, sync up, roll out, roll back, backlog, scope, triage, workload*. |
| **Code Reviews & PRs** | *refactor, technical debt, edge case, boilerplate, workaround, deprecate, breaking change, race condition, nitpick, LGTM, sanitize*. |
| **System Design & Cloud** | *trade-off, latency, throughput, scalable, fault-tolerant, load balancer, SPOF, decouple, eventual consistency, cache invalidation, benchmark*. |
| **Entrevistas Técnicas (STAR)** | *spearhead, dive deep, cross-functional, root cause, negotiate, take ownership, streamline, showcase, pushback, leverage, on-call*. |

> Cada entrada técnica incluye un **Interview Pro-Tip** con consejos tácticos para explicar conceptos de arquitectura frente a reclutadores y líderes de ingeniería.

---

## ✨ Características Principales

* 🚀 **Cero Dependencias / Cero Configuración:** Corre 100% en el navegador con HTML5, Tailwind CSS vía CDN y Vanilla JS ES6+. Sin Node.js obligatorio, sin bases de datos externas, sin registros de cuentas.
* 🎙️ **Motor de Pronunciación TTS Nativo:** Integración con la **Web Speech API** del navegador con selector de acentos (`en-US` y `en-GB`) y velocidad graduable (`0.8x` para análisis fonético, `1.0x` natural).
* 🃏 **Smart Flashcards con Giro 3D:** Tarjetas interactivas con perspectiva 3D realista (`perspective: 1400px`), transcripción fonética IPA y atajos de teclado para estudiar sin tocar el ratón.
* 💬 **Modo Oraciones & Cloze:** Lector con traducción oculta/visible y ejercicios interactivos de rellenar el espacio en blanco (`______`) con retroalimentación inmediata.
* ⚡ **Speed Quiz Interactivo:** Evaluaciones rápidas de 10 preguntas generadas aleatoriamente con marcador de puntos, barra de progreso y cálculo de porcentaje de precisión.
* 📖 **Explorador y Diccionario Reactivo:** Buscador en vivo en inglés/español con filtros por nivel CEFR (A1-B2) y estado de dominio (Por aprender, En progreso, Dominada).
* 🌓 **Modo Oscuro / Claro:** Detección de tema del sistema con botón de alternancia suave.
* 💾 **Persistencia en LocalStorage & Backups JSON:** Tus rachas, intervalos y palabras dominadas se conservan al cerrar el navegador o reiniciar tu PC. Incluye botones de **Exportar Progreso (JSON)** e **Importar Progreso (JSON)** para respaldos o transferencias entre computadoras.

---

## 🚀 Inicio Rápido (Menos de 30 segundos)

### Requisitos Previos
Cualquier navegador web moderno (Google Chrome, Microsoft Edge, Brave, Mozilla Firefox o Safari).

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/lexicore-80-20.git
cd lexicore-80-20
```

### 2. Iniciar el Servidor Local

Puedes usar cualquiera de las siguientes alternativas:

#### Opción A: Python 3 (Recomendada)
```bash
python3 -m http.server 8000
```
Abre en tu navegador:
👉 **`http://localhost:8000`**

#### Opción B: Node.js (npx serve)
```bash
npx serve .
```

#### Opción C: VS Code / Cursor (Live Server)
Haz clic derecho sobre `index.html` y selecciona **"Open with Live Server"**.

#### Opción D: Apertura Directa
También puedes hacer doble clic directamente sobre `index.html` en tu explorador de archivos.

---

## ⌨️ Atajos de Teclado (Modo Flashcard)

Para maximizar tu velocidad de estudio y mantener el foco, utiliza los atajos físicos:

| Tecla | Acción |
|:---:|---|
| <kbd>Espacio</kbd> | **Voltear tarjeta** entre frente y reverso |
| <kbd>1</kbd> | Calificar como **Difícil** (Repasar hoy / 1 día) |
| <kbd>2</kbd> | Calificar como **Bien** (Repasar en 3 días) |
| <kbd>3</kbd> | Calificar como **Fácil** (Repasar en 7 días / consolidar) |
| <kbd>A</kbd> | **Reproducir pronunciación** nativa en audio |

---

## 📂 Arquitectura del Proyecto

```
├── index.html        # Estructura semántica SPA, vistas dinámicas, navegación y modal
├── styles.css        # Efectos 3D de Flashcards, animaciones de racha 🔥 y badges
├── data.js           # Catálogo Oxford 3000 / GSL (52 palabras A1-B2 con fonética y oraciones)
├── tech_data.js      # Catálogo especializado de 44 términos IT, PRs, System Design y STAR
├── storage.js        # Motor de persistencia en localStorage (SRS general + SRS técnico)
├── app.js            # Controladores de UI, motor TTS, atajos de teclado, Chunks y Quiz
├── .gitignore        # Ignora archivos temporales del SO, editores y respaldos personales
└── README.md         # Documentación completa del proyecto
```

---

## 🧩 Cómo Agregar Más Vocabulario

La aplicación está preparada para escalar fácilmente hasta las 3.000 palabras de Oxford o agregar más términos especializados.

### Esquema para `data.js`:
```javascript
{
  id: 53,
  word: "achieve",
  phonetic: "/əˈtʃiːv/",
  partOfSpeech: "verb",
  level: "B1",
  frequencyRank: 310,
  meaningEs: "lograr, alcanzar, conseguir",
  collocation: "achieve a goal / achieve success",
  category: "Achievement",
  sentences: [
    {
      en: "With persistence, you can achieve any realistic goal.",
      es: "Con perseverancia, puedes alcanzar cualquier meta realista."
    },
    {
      en: "The research team achieved remarkable results this quarter.",
      es: "El equipo de investigación logró resultados notables este trimestre."
    }
  ]
}
```

### Esquema para `tech_data.js`:
```javascript
{
  id: 145,
  word: "idempotent",
  phonetic: "/ˌaɪ.dɪmˈpəʊ.tənt/",
  partOfSpeech: "adjective",
  level: "B2",
  category: "System Design & Cloud",
  meaningEs: "idempotente: produce el mismo resultado sin importar cuántas veces se ejecute",
  collocation: "idempotent API endpoint / ensure idempotency",
  interviewTip: "Esencial al diseñar APIs de pago: evita cobrar dos veces ante reintentos de red.",
  sentences: [
    {
      en: "Payment APIs must be idempotent to prevent duplicate charges on network retries.",
      es: "Las APIs de pago deben ser idempotentes para prevenir cargos duplicados en reintentos de red."
    },
    {
      en: "HTTP PUT and DELETE operations are designed to be idempotent by specification.",
      es: "Las operaciones HTTP PUT y DELETE están diseñadas para ser idempotentes por especificación."
    }
  ]
}
```

---

## 🛡️ Privacidad y Persistencia de Datos

1. **100% Local:** Ningún dato se envía a servidores externos. Todo vive en el `localStorage` de tu navegador.
2. **Copias de Seguridad:** Utiliza el botón **"Exportar Progreso (JSON)"** en la pestaña de Ajustes para generar respaldos descargables en cualquier momento.

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si deseas agregar nuevas palabras de alta frecuencia, colocaciones de programación o mejoras en los algoritmos SRS:
1. Haz un fork del repositorio.
2. Crea una rama para tu función (`git checkout -b feature/nuevo-vocabulario`).
3. Haz commit de tus cambios (`git commit -m 'feat: agregar términos de kubernetes y docker'`).
4. Haz push a la rama (`git push origin feature/nuevo-vocabulario`).
5. Abre un **Pull Request**.

---

## 📄 Licencia

Este proyecto está distribuido bajo la licencia **MIT**. Puedes usarlo, estudiarlo y modificarlo libremente.
