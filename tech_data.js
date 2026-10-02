/**
 * LexiCore 80/20 - Tech & Dev English Dataset
 * Catálogo especializado de 44 términos, colocaciones y frases clave para
 * Ingenieros de Software, Daily Standups, Code Reviews, System Design y Entrevistas Técnicas.
 */

const TECH_DEV_WORDS = [
  // ==========================================================================
  // 1. DAILY STANDUPS & AGILE (11 Términos)
  // ==========================================================================
  {
    id: 101,
    word: "blocker",
    phonetic: "/ˈblɒk.ər/",
    partOfSpeech: "noun",
    level: "B1",
    category: "Daily Standups & Agile",
    meaningEs: "impedimento crítico, obstáculo que detiene el trabajo",
    collocation: "raise a blocker / have any blockers / clear blockers",
    interviewTip: "En daily standups, avisa de inmediato si tienes un blocker para que el Scrum Master o tu equipo te destraben.",
    sentences: [
      {
        en: "I have no blockers today and expect to finish the authentication module before noon.",
        es: "No tengo ningún impedimento hoy y espero terminar el módulo de autenticación antes del mediodía."
      },
      {
        en: "The missing third-party credentials became a major blocker for our deployment.",
        es: "La falta de credenciales de terceros se convirtió en un obstáculo importante para nuestro despliegue."
      }
    ]
  },
  {
    id: 102,
    word: "bandwidth",
    phonetic: "/ˈbænd.wɪtθ/",
    partOfSpeech: "noun",
    level: "B2",
    category: "Daily Standups & Agile",
    meaningEs: "capacidad o tiempo disponible para asumir nuevas tareas",
    collocation: "have enough bandwidth / lack bandwidth / free up bandwidth",
    interviewTip: "Úsalo para comunicar tu carga de trabajo de manera profesional: 'I don't have enough bandwidth this sprint.'",
    sentences: [
      {
        en: "I do not have the bandwidth this sprint to take on that extra refactoring ticket.",
        es: "No tengo suficiente disponibilidad este sprint para asumir ese ticket adicional de refactorización."
      },
      {
        en: "Once we automate unit tests, we will free up bandwidth for new feature development.",
        es: "Una vez que automaticemos las pruebas unitarias, liberaremos capacidad para desarrollar nuevas funciones."
      }
    ]
  },
  {
    id: 103,
    word: "bottleneck",
    phonetic: "/ˈbɒt.əl.nek/",
    partOfSpeech: "noun",
    level: "B2",
    category: "Daily Standups & Agile",
    meaningEs: "cuello de botella, punto que ralentiza todo el proceso",
    collocation: "identify a bottleneck / performance bottleneck / eliminate bottlenecks",
    interviewTip: "En entrevistas de arquitectura, explicar cómo detectas y eliminas cuellos de botella demuestra seniority.",
    sentences: [
      {
        en: "Slow database queries are currently the main bottleneck in our payment processing pipeline.",
        es: "Las consultas lentas a la base de datos son actualmente el principal cuello de botella en nuestro flujo de procesamiento de pagos."
      },
      {
        en: "Adding a Redis cache eliminated the performance bottleneck during peak traffic.",
        es: "Añadir una caché de Redis eliminó el cuello de botella de rendimiento durante el tráfico pico."
      }
    ]
  },
  {
    id: 104,
    word: "ETA",
    phonetic: "/ˌiː.tiːˈeɪ/",
    partOfSpeech: "noun",
    level: "B1",
    category: "Daily Standups & Agile",
    meaningEs: "tiempo estimado de entrega / llegada (Estimated Time of Arrival)",
    collocation: "give an ETA / what is your ETA on... / rough ETA",
    interviewTip: "Acrónimo universal en equipos remotos para pedir o dar estimaciones de entrega de una tarea o PR.",
    sentences: [
      {
        en: "What is your ETA on merging the payment gateway pull request?",
        es: "¿Cuál es tu tiempo estimado de entrega para fusionar el pull request de la pasarela de pagos?"
      },
      {
        en: "My rough ETA for resolving this production bug is approximately two hours.",
        es: "Mi tiempo estimado aproximado para resolver este error de producción es de unas dos horas."
      }
    ]
  },
  {
    id: 105,
    word: "sync up",
    phonetic: "/sɪŋk ʌp/",
    partOfSpeech: "phrase",
    level: "B1",
    category: "Daily Standups & Agile",
    meaningEs: "reunirse brevemente para coordinar / ponerse al día",
    collocation: "sync up offline / quick sync up / sync up after the standup",
    interviewTip: "Se usa para proponer reuniones cortas de 5-10 minutos en Slack o Teams fuera del standup.",
    sentences: [
      {
        en: "Let us sync up after the daily standup to align on the database schema changes.",
        es: "Reunámonos brevemente después de la reunión diaria para coordinar los cambios del esquema de la base de datos."
      },
      {
        en: "Can we have a quick sync up regarding the frontend integration challenges?",
        es: "¿Podemos tener una reunión rápida para coordinar los desafíos de integración del frontend?"
      }
    ]
  },
  {
    id: 106,
    word: "roll out",
    phonetic: "/rəʊl aʊt/",
    partOfSpeech: "verb",
    level: "B2",
    category: "Daily Standups & Agile",
    meaningEs: "lanzar, desplegar gradualmente una función a producción",
    collocation: "gradual roll out / roll out a feature / roll out in phases",
    interviewTip: "Indica un despliegue controlado (e.g. usando feature flags o canary deployments).",
    sentences: [
      {
        en: "We plan to roll out the new checkout design to ten percent of active users first.",
        es: "Planeamos desplegar el nuevo diseño de pago al diez por ciento de los usuarios activos primero."
      },
      {
        en: "The DevOps team decided to roll out the security patch during low-traffic hours.",
        es: "El equipo de DevOps decidió lanzar el parche de seguridad durante las horas de bajo tráfico."
      }
    ]
  },
  {
    id: 107,
    word: "roll back",
    phonetic: "/rəʊl bæk/",
    partOfSpeech: "verb",
    level: "B1",
    category: "Daily Standups & Agile",
    meaningEs: "revertir un despliegue o cambio a su versión estable previa",
    collocation: "roll back the release / roll back changes / immediate rollback",
    interviewTip: "Respuesta obligada ante un error imprevisto en producción mientras se investiga el root cause.",
    sentences: [
      {
        en: "We had to roll back the latest deployment due to unexpected memory spikes.",
        es: "Tuvimos que revertir el último despliegue debido a picos inesperados de consumo de memoria."
      },
      {
        en: "Always have a clear strategy to roll back if critical errors arise in production.",
        es: "Ten siempre una estrategia clara para revertir si surgen errores críticos en producción."
      }
    ]
  },
  {
    id: 108,
    word: "backlog",
    phonetic: "/ˈbæk.lɒɡ/",
    partOfSpeech: "noun",
    level: "B1",
    category: "Daily Standups & Agile",
    meaningEs: "lista acumulada de tareas pendientes y requerimientos priorizados",
    collocation: "product backlog / prioritize the backlog / backlog grooming",
    interviewTip: "Término esencial en metodologías Scrum/Agile para referirse a la pila de requerimientos.",
    sentences: [
      {
        en: "We prioritized three technical debt issues from the product backlog for this sprint.",
        es: "Priorizamos tres problemas de deuda técnica de la pila de tareas pendientes para este sprint."
      },
      {
        en: "The product owner spent the afternoon grooming the backlog for the next quarter.",
        es: "El Product Owner pasó la tarde depurando la lista de pendientes para el próximo trimestre."
      }
    ]
  },
  {
    id: 109,
    word: "scope",
    phonetic: "/skəʊp/",
    partOfSpeech: "noun",
    level: "B2",
    category: "Daily Standups & Agile",
    meaningEs: "alcance del proyecto o tarea / ámbito de una variable",
    collocation: "scope creep / within scope / out of scope",
    interviewTip: "'Scope creep' se refiere a cuando un cliente o manager agrega requerimientos sin ampliar el tiempo.",
    sentences: [
      {
        en: "Adding third-party social logins is currently out of scope for the MVP release.",
        es: "Agregar inicio de sesión con redes sociales de terceros está actualmente fuera del alcance del MVP."
      },
      {
        en: "Clear requirements prevent scope creep and keep the sprint goals realistic.",
        es: "Requerimientos claros previenen la desviación del alcance y mantienen realistas los objetivos del sprint."
      }
    ]
  },
  {
    id: 110,
    word: "triage",
    phonetic: "/ˈtriː.ɑːʒ/",
    partOfSpeech: "verb",
    level: "B2",
    category: "Daily Standups & Agile",
    meaningEs: "clasificar y priorizar incidencias o bugs según su urgencia",
    collocation: "triage bugs / bug triage session / triage incoming alerts",
    interviewTip: "En entornos de guardia (on-call), clasificar la severidad de un incidente es el primer paso.",
    sentences: [
      {
        en: "The engineering team meets every morning to triage incoming customer bug reports.",
        es: "El equipo de ingeniería se reúne cada mañana para clasificar los reportes de errores de los clientes."
      },
      {
        en: "We must triage critical security vulnerabilities with the highest priority.",
        es: "Debemos priorizar las vulnerabilidades críticas de seguridad con la máxima urgencia."
      }
    ]
  },
  {
    id: 111,
    word: "workload",
    phonetic: "/ˈwɜːk.ləʊd/",
    partOfSpeech: "noun",
    level: "B1",
    category: "Daily Standups & Agile",
    meaningEs: "carga de trabajo, volumen de tareas asignadas",
    collocation: "manage the workload / heavy workload / distribute the workload",
    interviewTip: "Demuestra madurez profesional cuando pides equilibrar la carga para evitar burnout.",
    sentences: [
      {
        en: "Our team lead redistributed the workload to help us meet the deadline comfortably.",
        es: "Nuestro líder de equipo redistribuyó la carga de trabajo para ayudarnos a cumplir la fecha límite con comodidad."
      },
      {
        en: "Async communication helps distribute the daily workload across different time zones.",
        es: "La comunicación asíncrona ayuda a distribuir la carga de trabajo diaria entre distintas zonas horarias."
      }
    ]
  },

  // ==========================================================================
  // 2. CODE REVIEWS & PULL REQUESTS (11 Términos)
  // ==========================================================================
  {
    id: 112,
    word: "refactor",
    phonetic: "/ˌriːˈfæk.tər/",
    partOfSpeech: "verb",
    level: "B2",
    category: "Code Reviews & PRs",
    meaningEs: "reestructurar código para mejorar su diseño sin cambiar su comportamiento externo",
    collocation: "refactor legacy code / refactor for readability / candidate for refactoring",
    interviewTip: "En Code Reviews, sugerir refactorizaciones para eliminar duplicación o mejorar legibilidad es muy valorado.",
    sentences: [
      {
        en: "Could we refactor this utility function into smaller single-responsibility helpers?",
        es: "¿Podríamos refactorizar esta función de utilidad en funciones auxiliares más pequeñas de responsabilidad única?"
      },
      {
        en: "We decided to refactor the payment gateway client to improve testability.",
        es: "Decidimos refactorizar el cliente de la pasarela de pagos para mejorar la capacidad de prueba."
      }
    ]
  },
  {
    id: 113,
    word: "technical debt",
    phonetic: "/ˈtek.nɪ.kəl det/",
    partOfSpeech: "noun",
    level: "B2",
    category: "Code Reviews & PRs",
    meaningEs: "deuda técnica: costo futuro de elegir una solución rápida en lugar de una sólida",
    collocation: "accumulate technical debt / pay off technical debt / incur technical debt",
    interviewTip: "Excelente concepto para entrevistas: explica cómo balanceas velocidad de entrega con pagar deuda técnica.",
    sentences: [
      {
        en: "Rushing features without automated tests will accumulate dangerous technical debt over time.",
        es: "Apresurar funciones sin pruebas automatizadas acumulará una peligrosa deuda técnica con el tiempo."
      },
      {
        en: "We dedicated ten percent of every sprint to pay off technical debt and update dependencies.",
        es: "Dedicamos el diez por ciento de cada sprint a saldar deuda técnica y actualizar dependencias."
      }
    ]
  },
  {
    id: 114,
    word: "edge case",
    phonetic: "/edʒ keɪs/",
    partOfSpeech: "noun",
    level: "B2",
    category: "Code Reviews & PRs",
    meaningEs: "caso límite / caso extremo que ocurre en condiciones inusuales",
    collocation: "handle edge cases / consider edge cases / unexpected edge case",
    interviewTip: "En entrevistas de algoritmos, preguntar por los edge cases (arrays vacíos, nulos, desbordes) demuestra nivel Senior.",
    sentences: [
      {
        en: "Did you consider the edge case where the user inputs an empty string with leading spaces?",
        es: "¿Consideraste el caso límite en el que el usuario ingresa una cadena vacía con espacios al inicio?"
      },
      {
        en: "Unit tests should specifically verify edge cases like boundary values and null inputs.",
        es: "Las pruebas unitarias deben verificar específicamente los casos límite como valores frontera y entradas nulas."
      }
    ]
  },
  {
    id: 115,
    word: "boilerplate",
    phonetic: "/ˈbɔɪ.lə.pleɪt/",
    partOfSpeech: "noun",
    level: "B2",
    category: "Code Reviews & PRs",
    meaningEs: "código repetitivo / plantilla genérica requerida sin valor de negocio",
    collocation: "boilerplate code / reduce boilerplate / boilerplate template",
    interviewTip: "Describe frameworks o librerías explicando cómo ayudan a eliminar 'boilerplate code'.",
    sentences: [
      {
        en: "Using custom React hooks helped us remove significant amounts of boilerplate code.",
        es: "Usar custom hooks de React nos ayudó a eliminar cantidades significativas de código repetitivo."
      },
      {
        en: "Modern frameworks generate the initial project boilerplate automatically via the CLI.",
        es: "Los frameworks modernos generan el código base inicial del proyecto automáticamente a través de la CLI."
      }
    ]
  },
  {
    id: 116,
    word: "workaround",
    phonetic: "/ˈwɜːk.ə.raʊnd/",
    partOfSpeech: "noun",
    level: "B2",
    category: "Code Reviews & PRs",
    meaningEs: "solución alternativa temporal / parche para sortear una limitación",
    collocation: "temporary workaround / quick workaround / find a workaround",
    interviewTip: "Si aplicas un workaround, añade siempre un comentario con un ticket TODO para resolver la causa raíz después.",
    sentences: [
      {
        en: "This workaround temporarily bypasses the third-party API outage until they release a patch.",
        es: "Esta solución alternativa esquiva temporalmente la caída de la API de terceros hasta que publiquen un parche."
      },
      {
        en: "We implemented a clever workaround to bypass browser cookie restrictions on older devices.",
        es: "Implementamos una ingeniosa solución alternativa para sortear restricciones de cookies del navegador en dispositivos antiguos."
      }
    ]
  },
  {
    id: 117,
    word: "deprecate",
    phonetic: "/ˈdep.rə.keɪt/",
    partOfSpeech: "verb",
    level: "B2",
    category: "Code Reviews & PRs",
    meaningEs: "desaconsejar o marcar como obsoleto antes de su eliminación definitiva",
    collocation: "deprecate an endpoint / deprecated method / officially deprecate",
    interviewTip: "Común al versionar APIs públicas: se marca como deprecated y se da un período de gracia a los clientes.",
    sentences: [
      {
        en: "We decided to deprecate the legacy REST endpoint in favor of the new GraphQL query.",
        es: "Decidimos marcar como obsoleto el endpoint REST heredado en favor de la nueva consulta GraphQL."
      },
      {
        en: "A compiler warning alerts developers when they call deprecated library methods.",
        es: "Una advertencia del compilador alerta a los desarrolladores cuando llaman a métodos obsoletos de la biblioteca."
      }
    ]
  },
  {
    id: 118,
    word: "breaking change",
    phonetic: "/ˈbreɪ.kɪŋ tʃeɪndʒ/",
    partOfSpeech: "noun",
    level: "B2",
    category: "Code Reviews & PRs",
    meaningEs: "cambio que rompe la compatibilidad con versiones anteriores",
    collocation: "introduce breaking changes / avoid breaking changes / semver breaking change",
    interviewTip: "Crucial en Semantic Versioning (SemVer): un breaking change obliga a incrementar el número 'MAJOR'.",
    sentences: [
      {
        en: "Altering the JSON response payload would introduce a breaking change for our mobile app.",
        es: "Modificar la estructura de respuesta JSON introduciría un cambio incompatible para nuestra aplicación móvil."
      },
      {
        en: "Always document any breaking change clearly in the release changelog.",
        es: "Documenta siempre cualquier cambio incompatible con claridad en el registro de cambios de la versión."
      }
    ]
  },
  {
    id: 119,
    word: "race condition",
    phonetic: "/reɪs kənˈdɪʃ.ən/",
    partOfSpeech: "noun",
    level: "B2",
    category: "Code Reviews & PRs",
    meaningEs: "condición de carrera: error concurrente donde el resultado depende del orden de ejecución",
    collocation: "trigger a race condition / prevent race conditions / subtle race condition",
    interviewTip: "Se resuelve usando transacciones atómicas, bloqueos mutuos (mutex) o sincronización de estados.",
    sentences: [
      {
        en: "Concurrent database writes caused an intermittent race condition during checkout.",
        es: "Las escrituras concurrentes en la base de datos causaron una condición de carrera intermitente durante el pago."
      },
      {
        en: "Using distributed locks prevents dangerous race conditions when updating inventory.",
        es: "El uso de bloqueos distribuidos previene peligrosas condiciones de carrera al actualizar el inventario."
      }
    ]
  },
  {
    id: 120,
    word: "nitpick",
    phonetic: "/ˈnɪt.pɪk/",
    partOfSpeech: "noun",
    level: "B2",
    category: "Code Reviews & PRs",
    meaningEs: "observación menor o detallista en un PR (suele prefijarse como 'nit:')",
    collocation: "minor nitpick / just a nit / nit: rename variable",
    interviewTip: "En GitHub / GitLab, usar 'nit: ...' indica al autor que es una sugerencia menor y no bloquea el merge.",
    sentences: [
      {
        en: "Nitpick: consider renaming this variable to something more descriptive before merging.",
        es: "Detalle menor: considera renombrar esta variable por algo más descriptivo antes de fusionar."
      },
      {
        en: "Feel free to ignore this nitpick if you want to ship the hotfix immediately.",
        es: "Siéntete libre de ignorar esta observación menor si deseas enviar el parche de emergencia de inmediato."
      }
    ]
  },
  {
    id: 121,
    word: "LGTM",
    phonetic: "/ˌel.dʒiː.tiːˈem/",
    partOfSpeech: "phrase",
    level: "B1",
    category: "Code Reviews & PRs",
    meaningEs: "se ve bien para mí / aprobado (Looks Good To Me)",
    collocation: "leave an LGTM / approved and LGTM / LGTM with minor comments",
    interviewTip: "La sigla más común en la historia de los Code Reviews en Google, GitHub y Silicon Valley para aprobar un PR.",
    sentences: [
      {
        en: "The architecture looks clean and tests are passing. LGTM! Approved.",
        es: "La arquitectura se ve limpia y las pruebas están pasando. ¡Se ve muy bien! Aprobado."
      },
      {
        en: "I left a few optional stylistic comments, but otherwise LGTM.",
        es: "Dejé algunos comentarios estilísticos opcionales, pero por lo demás se ve excelente."
      }
    ]
  },
  {
    id: 122,
    word: "sanitize",
    phonetic: "/ˈsæn.ɪ.taɪz/",
    partOfSpeech: "verb",
    level: "B2",
    category: "Code Reviews & PRs",
    meaningEs: "sanitizar, limpiar datos de entrada para evitar inyecciones o vulnerabilidades",
    collocation: "sanitize user input / sanitize HTML / SQL injection sanitize",
    interviewTip: "Principio fundamental de ciberseguridad: nunca confíes en el input del usuario ('Never trust user input').",
    sentences: [
      {
        en: "Make sure to sanitize all user inputs to defend against potential cross-site scripting attacks.",
        es: "Asegúrate de sanitizar todas las entradas de usuario para defenderte contra posibles ataques XSS."
      },
      {
        en: "The backend framework automatically sanitizes string inputs to prevent SQL injections.",
        es: "El framework del backend sanitiza automáticamente las entradas de texto para prevenir inyecciones SQL."
      }
    ]
  },

  // ==========================================================================
  // 3. SYSTEM DESIGN & ARCHITECTURE (11 Términos)
  // ==========================================================================
  {
    id: 123,
    word: "trade-off",
    phonetic: "/ˈtreɪd.ɒf/",
    partOfSpeech: "noun",
    level: "B2",
    category: "System Design & Cloud",
    meaningEs: "compensación, compromiso o balance entre dos ventajas contrapuestas",
    collocation: "evaluate trade-offs / weigh the trade-offs / architectural trade-off",
    interviewTip: "La palabra más importante en entrevistas de System Design: 'There are no solutions, only trade-offs.'",
    sentences: [
      {
        en: "We chose PostgreSQL over MongoDB because strict ACID compliance was an essential trade-off.",
        es: "Elegimos PostgreSQL sobre MongoDB porque el cumplimiento estricto de ACID era un compromiso esencial."
      },
      {
        en: "Every engineering decision involves trade-offs between speed, cost, and maintainability.",
        es: "Cada decisión de ingeniería implica equilibrios entre velocidad, costo y mantenibilidad."
      }
    ]
  },
  {
    id: 124,
    word: "latency",
    phonetic: "/ˈleɪ.tən.si/",
    partOfSpeech: "noun",
    level: "B2",
    category: "System Design & Cloud",
    meaningEs: "latencia: retraso temporal entre la solicitud y la respuesta",
    collocation: "low latency / reduce latency / network latency",
    interviewTip: "Distínguela siempre de 'throughput': latencia es qué tan rápido responde una petición individual.",
    sentences: [
      {
        en: "Deploying our servers closer to users via an edge CDN drastically reduced API latency.",
        es: "Desplegar nuestros servidores más cerca de los usuarios mediante una CDN de borde redujo drásticamente la latencia de la API."
      },
      {
        en: "Financial trading algorithms demand sub-millisecond network latency to remain competitive.",
        es: "Los algoritmos de operaciones financieras exigen latencia de red submilimétrica para seguir siendo competitivos."
      }
    ]
  },
  {
    id: 125,
    word: "throughput",
    phonetic: "/ˈθruː.pʊt/",
    partOfSpeech: "noun",
    level: "B2",
    category: "System Design & Cloud",
    meaningEs: "rendimiento, caudal: volumen de peticiones o datos procesados por unidad de tiempo",
    collocation: "high throughput / maximum throughput / system throughput",
    interviewTip: "Se mide comúnmente en TPS (Transactions Per Second) o RPS (Requests Per Second).",
    sentences: [
      {
        en: "The Apache Kafka cluster delivers high throughput and handles millions of events per second.",
        es: "El clúster de Apache Kafka ofrece un alto rendimiento y procesa millones de eventos por segundo."
      },
      {
        en: "We upgraded the network interface cards to maximize database throughput.",
        es: "Actualizamos las tarjetas de interfaz de red para maximizar el caudal de la base de datos."
      }
    ]
  },
  {
    id: 126,
    word: "scalable",
    phonetic: "/ˈskeɪ.lə.bəl/",
    partOfSpeech: "adjective",
    level: "B2",
    category: "System Design & Cloud",
    meaningEs: "escalable: capaz de manejar un crecimiento de demanda sin degradar el rendimiento",
    collocation: "highly scalable / horizontally scalable / scalable architecture",
    interviewTip: "Diferencia siempre entre escalado horizontal (añadir más máquinas) y vertical (añadir más RAM/CPU).",
    sentences: [
      {
        en: "Stateless containerized services are easy to make horizontally scalable in the cloud.",
        es: "Los servicios en contenedores sin estado son fáciles de hacer escalables horizontalmente en la nube."
      },
      {
        en: "Designing scalable distributed systems requires decoupled asynchronous communication.",
        es: "Diseñar sistemas distribuidos escalables requiere comunicación asíncrona desacoplada."
      }
    ]
  },
  {
    id: 127,
    word: "fault-tolerant",
    phonetic: "/ˌfɒlt ˈtɒl.ər.ənt/",
    partOfSpeech: "adjective",
    level: "B2",
    category: "System Design & Cloud",
    meaningEs: "tolerante a fallos: capaz de seguir operando aun si uno o más componentes fallan",
    collocation: "fault-tolerant system / ensure fault tolerance / resilient and fault-tolerant",
    interviewTip: "En entrevistas de diseño, menciona redundancia multizona y circuit breakers para garantizar tolerancia a fallos.",
    sentences: [
      {
        en: "Replicating database nodes across three independent data centers ensures a fault-tolerant setup.",
        es: "Replicar nodos de base de datos en tres centros de datos independientes garantiza una configuración tolerante a fallos."
      },
      {
        en: "The architecture remains fault-tolerant even if two microservices crash simultaneously.",
        es: "La arquitectura sigue siendo tolerante a fallos incluso si dos microservicios se caen simultáneamente."
      }
    ]
  },
  {
    id: 128,
    word: "load balancer",
    phonetic: "/ˈləʊd ˌbæl.ən.sər/",
    partOfSpeech: "noun",
    level: "B1",
    category: "System Design & Cloud",
    meaningEs: "balanceador de carga: distribuye el tráfico entre múltiples servidores",
    collocation: "configure a load balancer / round-robin load balancer / behind a load balancer",
    interviewTip: "Menciona algoritmos de balanceo como Round Robin, Least Connections o IP Hash.",
    sentences: [
      {
        en: "The load balancer distributes incoming HTTPS traffic evenly across five backend instances.",
        es: "El balanceador de carga distribuye el tráfico HTTPS entrante de manera uniforme entre cinco instancias del backend."
      },
      {
        en: "If a server fails health checks, the load balancer automatically reroutes traffic away from it.",
        es: "Si un servidor no supera las comprobaciones de salud, el balanceador redirige automáticamente el tráfico fuera de él."
      }
    ]
  },
  {
    id: 129,
    word: "SPOF",
    phonetic: "/spɒf/",
    partOfSpeech: "noun",
    level: "B2",
    category: "System Design & Cloud",
    meaningEs: "punto único de fallo (Single Point of Failure)",
    collocation: "eliminate the SPOF / introduce a SPOF / avoid any SPOF",
    interviewTip: "Identificar un SPOF en un diagrama de arquitectura demuestra inmediatamente mentalidad de Senior o Staff Engineer.",
    sentences: [
      {
        en: "Having only one primary database without automated failover creates a dangerous SPOF.",
        es: "Tener solo una base de datos principal sin conmutación por error automática crea un peligroso punto único de fallo."
      },
      {
        en: "We redesigned the authentication proxy to eliminate any potential SPOF.",
        es: "Rediseñamos el proxy de autenticación para eliminar cualquier punto único de fallo potencial."
      }
    ]
  },
  {
    id: 130,
    word: "decouple",
    phonetic: "/diːˈkʌp.əl/",
    partOfSpeech: "verb",
    level: "B2",
    category: "System Design & Cloud",
    meaningEs: "desacoplar, separar componentes para que no dependan directamente entre sí",
    collocation: "decouple microservices / loosely decoupled / decouple frontend from backend",
    interviewTip: "El desacoplamiento reduce el impacto de caídas en cascada y facilita despliegues independientes.",
    sentences: [
      {
        en: "Using a message queue helps decouple the order processing service from the notification sender.",
        es: "El uso de una cola de mensajes ayuda a desacoplar el servicio de procesamiento de pedidos del remitente de notificaciones."
      },
      {
        en: "We decoupled business logic from database models to make unit testing much easier.",
        es: "Desacoplamos la lógica de negocio de los modelos de base de datos para facilitar mucho las pruebas unitarias."
      }
    ]
  },
  {
    id: 131,
    word: "eventual consistency",
    phonetic: "/ɪˈven.tʃu.əl kənˈsɪs.tən.si/",
    partOfSpeech: "noun",
    level: "B2",
    category: "System Design & Cloud",
    meaningEs: "consistencia eventual: modelo donde todas las réplicas convergen al mismo dato con el tiempo",
    collocation: "rely on eventual consistency / strong vs eventual consistency / achieve eventual consistency",
    interviewTip: "Concepto clave del teorema CAP en bases de datos NoSQL como DynamoDB o Cassandra.",
    sentences: [
      {
        en: "Our social media timeline relies on eventual consistency rather than strict immediate locks.",
        es: "Nuestro feed de red social se basa en la consistencia eventual en lugar de bloqueos inmediatos estrictos."
      },
      {
        en: "Under high network load, distributed nodes achieve eventual consistency within milliseconds.",
        es: "Bajo una alta carga de red, los nodos distribuidos alcanzan la consistencia eventual en cuestión de milisegundos."
      }
    ]
  },
  {
    id: 132,
    word: "cache invalidation",
    phonetic: "/kæʃ ɪnˌvæl.ɪˈdeɪ.ʃən/",
    partOfSpeech: "noun",
    level: "B2",
    category: "System Design & Cloud",
    meaningEs: "invalidación de caché: eliminar o actualizar datos obsoletos en la capa de caché",
    collocation: "cache invalidation strategy / hard problem cache invalidation / TTL cache invalidation",
    interviewTip: "Cita famosa de Phil Karlton: 'There are only two hard things in Computer Science: cache invalidation and naming things.'",
    sentences: [
      {
        en: "Implementing an event-driven cache invalidation strategy ensures users see fresh product prices.",
        es: "Implementar una estrategia de invalidación de caché guiada por eventos garantiza que los usuarios vean precios de productos actualizados."
      },
      {
        en: "We configured a five-minute TTL as a simple fallback for cache invalidation.",
        es: "Configuramos un TTL de cinco minutos como respaldo simple para la invalidación de la caché."
      }
    ]
  },
  {
    id: 133,
    word: "benchmark",
    phonetic: "/ˈbentʃ.mɑːk/",
    partOfSpeech: "verb",
    level: "B2",
    category: "System Design & Cloud",
    meaningEs: "evaluar o medir el rendimiento de un sistema frente a un estándar",
    collocation: "benchmark performance / run a benchmark / industry benchmark",
    interviewTip: "Nunca digas que una tecnología es más rápida sin respaldarlo con benchmarks cuantitativos.",
    sentences: [
      {
        en: "We benchmarked the new Rust microservice against our old Python implementation.",
        es: "Hicimos un análisis de rendimiento comparativo del nuevo microservicio en Rust frente a nuestra antigua implementación en Python."
      },
      {
        en: "Always benchmark queries with realistic production-scale data before deploying index changes.",
        es: "Evalúa siempre el rendimiento de las consultas con datos a escala de producción antes de desplegar cambios de índices."
      }
    ]
  },

  // ==========================================================================
  // 4. TECH INTERVIEWS & BEHAVIORAL QUESTIONS (11 Términos)
  // ==========================================================================
  {
    id: 134,
    word: "spearhead",
    phonetic: "/ˈspɪə.hed/",
    partOfSpeech: "verb",
    level: "B2",
    category: "Tech Interviews & Behavioral",
    meaningEs: "liderar, encabezar una iniciativa técnica desde su inicio",
    collocation: "spearhead the migration / spearhead an initiative / spearhead the project",
    interviewTip: "Verbo de alto impacto para el método STAR cuando te pregunten: 'Tell me about a time you led a technical project.'",
    sentences: [
      {
        en: "I spearheaded the migration from a monolithic backend to modular cloud microservices.",
        es: "Lideré la migración de un backend monolítico a microservicios modulares en la nube."
      },
      {
        en: "She spearheaded the adoption of automated end-to-end testing across three engineering squads.",
        es: "Ella encabezó la adopción de pruebas integrales automatizadas en tres escuadras de ingeniería."
      }
    ]
  },
  {
    id: 135,
    word: "dive deep",
    phonetic: "/daɪv diːp/",
    partOfSpeech: "phrase",
    level: "B2",
    category: "Tech Interviews & Behavioral",
    meaningEs: "profundizar exhaustivamente en los detalles técnicos y causa raíz",
    collocation: "dive deep into the codebase / dive deep into logs / Amazon leadership dive deep",
    interviewTip: "Principio de liderazgo famoso en Amazon: los ingenieros deben dominar los detalles minuciosos de su sistema.",
    sentences: [
      {
        en: "When memory usage spiked unexpectedly, I had to dive deep into heap dump profiles.",
        es: "Cuando el uso de memoria se disparó inesperadamente, tuve que profundizar minuciosamente en los perfiles de volcados de memoria."
      },
      {
        en: "Interviewers appreciate when candidates dive deep into underlying operating system mechanics.",
        es: "Los entrevistadores aprecian cuando los candidatos profundizan en los mecanismos subyacentes del sistema operativo."
      }
    ]
  },
  {
    id: 136,
    word: "cross-functional",
    phonetic: "/ˌkrɒs ˈfʌŋk.ʃən.əl/",
    partOfSpeech: "adjective",
    level: "B2",
    category: "Tech Interviews & Behavioral",
    meaningEs: "interdisciplinario: que involucra ingeniería, diseño de producto, QA y negocio",
    collocation: "cross-functional team / cross-functional collaboration / align cross-functional partners",
    interviewTip: "Úsalo para demostrar que no programas aislado, sino que colaboras fluidamente con diseñadores y Product Managers.",
    sentences: [
      {
        en: "I collaborated closely with a cross-functional team of UX designers and data engineers.",
        es: "Colaboré estrechamente con un equipo interdisciplinario de diseñadores UX e ingenieros de datos."
      },
      {
        en: "Effective cross-functional communication prevented misunderstandings about API specifications.",
        es: "La comunicación interdisciplinaria eficaz evitó malentendidos sobre las especificaciones de la API."
      }
    ]
  },
  {
    id: 137,
    word: "root cause",
    phonetic: "/ruːt kɔːz/",
    partOfSpeech: "noun",
    level: "B1",
    category: "Tech Interviews & Behavioral",
    meaningEs: "causa raíz: el origen fundamental de un fallo o problema técnico",
    collocation: "root cause analysis (RCA) / identify the root cause / fix the root cause",
    interviewTip: "En respuestas de incidentes (post-mortems), explica siempre cómo encontraste y solucionaste el 'root cause'.",
    sentences: [
      {
        en: "Our post-mortem analysis uncovered the root cause: an unindexed column during high traffic.",
        es: "Nuestro análisis post-mortem descubrió la causa raíz: una columna sin indexar durante un alto tráfico."
      },
      {
        en: "Rather than applying temporary patches, our goal is always to address the root cause.",
        es: "En lugar de aplicar parches temporales, nuestro objetivo siempre es abordar la causa raíz."
      }
    ]
  },
  {
    id: 138,
    word: "negotiate",
    phonetic: "/nəˈɡəʊ.ʃi.eɪt/",
    partOfSpeech: "verb",
    level: "B2",
    category: "Tech Interviews & Behavioral",
    meaningEs: "negociar requisitos técnicos, alcances o plazos con stakeholders",
    collocation: "negotiate deadlines / negotiate technical requirements / reach an agreement",
    interviewTip: "Demuestra pragmatismo en entrevistas: 'When product requested 5 features, I negotiated an MVP of 2.'",
    sentences: [
      {
        en: "I negotiated with the product manager to break the feature down into two manageable milestones.",
        es: "Negocié con el product manager para dividir la funcionalidad en dos hitos manejables."
      },
      {
        en: "Senior engineers know how to negotiate deadlines without compromising on code quality.",
        es: "Los ingenieros senior saben negociar plazos de entrega sin comprometer la calidad del código."
      }
    ]
  },
  {
    id: 139,
    word: "take ownership",
    phonetic: "/teɪk ˈəʊ.nə.ʃɪp/",
    partOfSpeech: "phrase",
    level: "B2",
    category: "Tech Interviews & Behavioral",
    meaningEs: "asumir la responsabilidad total y proactiva de un proyecto o incidente",
    collocation: "take full ownership / foster ownership / ownership mindset",
    interviewTip: "Una de las cualidades más buscadas por empresas internacionales: no esperar a que te digan qué hacer.",
    sentences: [
      {
        en: "I took full ownership of the CI/CD pipeline modernization and completed it ahead of schedule.",
        es: "Asumí la total responsabilidad de la modernización del pipeline de CI/CD y lo completé antes de lo previsto."
      },
      {
        en: "Great engineers do not say 'that is not my job'; they take ownership and solve the issue.",
        es: "Los grandes ingenieros no dicen 'ese no es mi trabajo'; asumen la responsabilidad y resuelven el problema."
      }
    ]
  },
  {
    id: 140,
    word: "streamline",
    phonetic: "/ˈstriːm.laɪn/",
    partOfSpeech: "verb",
    level: "B2",
    category: "Tech Interviews & Behavioral",
    meaningEs: "agilizar, simplificar y hacer más eficiente un flujo de trabajo",
    collocation: "streamline the onboarding process / streamline workflows / streamline deployments",
    interviewTip: "Usa métricas de impacto: 'I streamlined the build pipeline, reducing wait times from 25 min to 4 min.'",
    sentences: [
      {
        en: "I streamlined the developer onboarding process by automating local environment container setup.",
        es: "Agilicé el proceso de incorporación de desarrolladores automatizando la configuración de contenedores en local."
      },
      {
        en: "Introducing GitHub Actions streamlined our deployment pipeline and minimized human errors.",
        es: "La introducción de GitHub Actions simplificó nuestro pipeline de despliegue y minimizó los errores humanos."
      }
    ]
  },
  {
    id: 141,
    word: "showcase",
    phonetic: "/ˈʃəʊ.keɪs/",
    partOfSpeech: "verb",
    level: "B2",
    category: "Tech Interviews & Behavioral",
    meaningEs: "exhibir, mostrar resultados, habilidades o prototipos de forma convincente",
    collocation: "showcase measurable results / showcase technical expertise / showcase a demo",
    interviewTip: "Encuadra tus respuestas demostrando resultados cuantificables: números, porcentajes o tiempo ahorrado.",
    sentences: [
      {
        en: "In my behavioral interview, I showcased how reducing bundle size boosted mobile conversions.",
        es: "En mi entrevista conductual, mostré cómo la reducción del tamaño del bundle impulsó las conversiones móviles."
      },
      {
        en: "We prepared an interactive demo to showcase the new recommendation engine to executive leaders.",
        es: "Preparamos una demo interactiva para exhibir el nuevo motor de recomendaciones a los líderes ejecutivos."
      }
    ]
  },
  {
    id: 142,
    word: "pushback",
    phonetic: "/ˈpʊʃ.bæk/",
    partOfSpeech: "noun",
    level: "B2",
    category: "Tech Interviews & Behavioral",
    meaningEs: "objeción o resistencia constructiva ante una propuesta o decisión técnica",
    collocation: "give constructive pushback / face pushback / push back on unrealistic deadlines",
    interviewTip: "Pregunta clásica: 'Tell me about a time you disagreed with a colleague'. El pushback constructivo es clave.",
    sentences: [
      {
        en: "I gave polite pushback against shipping without automated tests, proposing a phased rollout instead.",
        es: "Hice una objeción educada contra lanzar sin pruebas automatizadas, proponiendo en su lugar un despliegue gradual."
      },
      {
        en: "Healthy engineering cultures encourage respectful pushback during architectural reviews.",
        es: "Las culturas de ingeniería saludables fomentan el debate constructivo durante las revisiones de arquitectura."
      }
    ]
  },
  {
    id: 143,
    word: "leverage",
    phonetic: "/ˈliː.vər.ɪdʒ/",
    partOfSpeech: "verb",
    level: "B2",
    category: "Tech Interviews & Behavioral",
    meaningEs: "aprovechar al máximo una herramienta, ventaja o conocimiento existente",
    collocation: "leverage existing infrastructure / leverage open source / leverage cloud services",
    interviewTip: "Palabra predilecta en empresas multinacionales para explicar que reutilizas soluciones en lugar de reinventar la rueda.",
    sentences: [
      {
        en: "We decided to leverage managed AWS DynamoDB instead of maintaining our own Cassandra nodes.",
        es: "Decidimos aprovechar el servicio administrado AWS DynamoDB en lugar de mantener nuestros propios nodos de Cassandra."
      },
      {
        en: "Junior developers should leverage comprehensive documentation before asking for help.",
        es: "Los desarrolladores junior deben aprovechar la documentación completa antes de pedir ayuda."
      }
    ]
  },
  {
    id: 144,
    word: "on-call",
    phonetic: "/ˌɒn ˈkɔːl/",
    partOfSpeech: "adjective",
    level: "B1",
    category: "Tech Interviews & Behavioral",
    meaningEs: "de guardia / disponible para responder ante incidentes de producción 24/7",
    collocation: "on-call rotation / primary on-call engineer / on-call duty",
    interviewTip: "Pregunta común: 'What is your experience with on-call rotations and managing production alerts?'",
    sentences: [
      {
        en: "I was the primary on-call engineer when our payment processing API experienced a sudden outage.",
        es: "Yo era el ingeniero principal de guardia cuando nuestra API de procesamiento de pagos experimentó una caída repentina."
      },
      {
        en: "A well-structured on-call rotation ensures engineer well-being and fair distribution of alerts.",
        es: "Una guardia bien estructurada garantiza el bienestar de los ingenieros y un reparto justo de las alertas."
      }
    ]
  }
];

// Helper de acceso y consultas rápidas para Tech & Dev English
const TechVocabularyData = {
  getAll: () => TECH_DEV_WORDS,
  getById: (id) => TECH_DEV_WORDS.find(w => w.id === id),
  getByCategory: (category) => TECH_DEV_WORDS.filter(w => w.category === category),
  getCategories: () => [
    "Daily Standups & Agile",
    "Code Reviews & PRs",
    "System Design & Cloud",
    "Tech Interviews & Behavioral"
  ],
  search: (query) => {
    if (!query || query.trim() === '') return TECH_DEV_WORDS;
    const q = query.toLowerCase().trim();
    return TECH_DEV_WORDS.filter(w =>
      w.word.toLowerCase().includes(q) ||
      w.meaningEs.toLowerCase().includes(q) ||
      w.collocation.toLowerCase().includes(q) ||
      w.category.toLowerCase().includes(q)
    );
  },
  getTotalCount: () => TECH_DEV_WORDS.length
};
