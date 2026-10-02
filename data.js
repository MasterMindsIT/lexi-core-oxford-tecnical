/**
 * LexiCore 80/20 - Oxford 3000 / GSL High-Frequency Vocabulary Dataset
 * Base de datos representativa de 52 palabras de altísima frecuencia clasificadas
 * según los niveles del MCER (A1, A2, B1, B2) y categorías funcionales.
 * 
 * Estructura compatible y lista para escalar a las 3.000 palabras completas.
 */

const OXFORD_3000_WORDS = [
  // ==========================================
  // NIVEL A1 - FUNDAMENTOS (15 Palabras)
  // ==========================================
  {
    id: 1,
    word: "agree",
    phonetic: "/əˈɡriː/",
    partOfSpeech: "verb",
    level: "A2",
    frequencyRank: 142,
    meaningEs: "estar de acuerdo, concordar",
    collocation: "agree with (someone) / agree on (something)",
    category: "Communication",
    sentences: [
      {
        en: "I completely agree with your opinion.",
        es: "Estoy completamente de acuerdo con tu opinión."
      },
      {
        en: "We agreed on the project deadline.",
        es: "Nos pusimos de acuerdo sobre la fecha límite del proyecto."
      }
    ]
  },
  {
    id: 2,
    word: "ask",
    phonetic: "/ɑːsk/",
    partOfSpeech: "verb",
    level: "A1",
    frequencyRank: 85,
    meaningEs: "preguntar, pedir",
    collocation: "ask for (help) / ask about (a topic)",
    category: "Communication",
    sentences: [
      {
        en: "Can I ask you a quick question?",
        es: "¿Puedo hacerte una pregunta rápida?"
      },
      {
        en: "Don't hesitate to ask for help if you need it.",
        es: "No dudes en pedir ayuda si la necesitas."
      }
    ]
  },
  {
    id: 3,
    word: "change",
    phonetic: "/tʃeɪndʒ/",
    partOfSpeech: "verb",
    level: "A1",
    frequencyRank: 112,
    meaningEs: "cambiar, transformar / cambio",
    collocation: "change one's mind / make a change",
    category: "General",
    sentences: [
      {
        en: "Technology can change our lives dramatically.",
        es: "La tecnología puede cambiar nuestras vidas drásticamente."
      },
      {
        en: "I changed my mind about the vacation destination.",
        es: "Cambié de opinión sobre el destino de las vacaciones."
      }
    ]
  },
  {
    id: 4,
    word: "feel",
    phonetic: "/fiːl/",
    partOfSpeech: "verb",
    level: "A1",
    frequencyRank: 78,
    meaningEs: "sentir, experimentar una sensación o emoción",
    collocation: "feel like (doing something) / feel confident",
    category: "Emotions",
    sentences: [
      {
        en: "I feel very confident about the upcoming exam.",
        es: "Me siento muy seguro con respecto al próximo examen."
      },
      {
        en: "Do you feel like going for a walk tonight?",
        es: "¿Tienes ganas de ir a dar un paseo esta noche?"
      }
    ]
  },
  {
    id: 5,
    word: "give",
    phonetic: "/ɡɪv/",
    partOfSpeech: "verb",
    level: "A1",
    frequencyRank: 44,
    meaningEs: "dar, entregar, proporcionar",
    collocation: "give up (rendirse) / give someone a hand (ayudar)",
    category: "Action",
    sentences: [
      {
        en: "Never give up on your biggest dreams.",
        es: "Nunca te rindas en tus sueños más grandes."
      },
      {
        en: "Could you give me a hand with this heavy box?",
        es: "¿Podrías darme una mano con esta caja pesada?"
      }
    ]
  },
  {
    id: 6,
    word: "help",
    phonetic: "/help/",
    partOfSpeech: "verb",
    level: "A1",
    frequencyRank: 95,
    meaningEs: "ayudar, socorrer / ayuda",
    collocation: "can't help (doing something) / help with",
    category: "Social",
    sentences: [
      {
        en: "She always tries to help people in need.",
        es: "Ella siempre intenta ayudar a las personas necesitadas."
      },
      {
        en: "I can't help laughing whenever he tells that joke.",
        es: "No puedo evitar reírme cada vez que él cuenta ese chiste."
      }
    ]
  },
  {
    id: 7,
    word: "need",
    phonetic: "/niːd/",
    partOfSpeech: "verb",
    level: "A1",
    frequencyRank: 62,
    meaningEs: "necesitar, requerir",
    collocation: "in need of / urgently need",
    category: "Necessity",
    sentences: [
      {
        en: "We need to finish this report before Friday.",
        es: "Necesitamos terminar este informe antes del viernes."
      },
      {
        en: "The community is in desperate need of clean water.",
        es: "La comunidad tiene una necesidad desesperada de agua limpia."
      }
    ]
  },
  {
    id: 8,
    word: "talk",
    phonetic: "/tɔːk/",
    partOfSpeech: "verb",
    level: "A1",
    frequencyRank: 89,
    meaningEs: "hablar, conversar",
    collocation: "talk to (someone) / talk about (something)",
    category: "Communication",
    sentences: [
      {
        en: "Let's sit down and talk about our future plans.",
        es: "Sentémonos y hablemos de nuestros planes futuros."
      },
      {
        en: "I need to talk to the team manager right now.",
        es: "Necesito hablar con el gerente del equipo ahora mismo."
      }
    ]
  },
  {
    id: 9,
    word: "time",
    phonetic: "/taɪm/",
    partOfSpeech: "noun",
    level: "A1",
    frequencyRank: 22,
    meaningEs: "tiempo, hora, momento",
    collocation: "on time (puntual) / spend time / waste time",
    category: "Time & Space",
    sentences: [
      {
        en: "Please make sure to arrive on time for the meeting.",
        es: "Por favor, asegúrate de llegar a tiempo a la reunión."
      },
      {
        en: "I love spending quality time with my family.",
        es: "Me encanta pasar tiempo de calidad con mi familia."
      }
    ]
  },
  {
    id: 10,
    word: "work",
    phonetic: "/wɜːk/",
    partOfSpeech: "verb",
    level: "A1",
    frequencyRank: 36,
    meaningEs: "trabajar, funcionar / trabajo",
    collocation: "work out (hacer ejercicio/resolver) / work on",
    category: "Work & Career",
    sentences: [
      {
        en: "I work out at the gym three mornings a week.",
        es: "Hago ejercicio en el gimnasio tres mañanas por semana."
      },
      {
        en: "Don't worry, everything will work out in the end.",
        es: "No te preocupes, todo se solucionará al final."
      }
    ]
  },
  {
    id: 11,
    word: "try",
    phonetic: "/traɪ/",
    partOfSpeech: "verb",
    level: "A1",
    frequencyRank: 73,
    meaningEs: "intentar, probar",
    collocation: "try out (probar algo nuevo) / try your best",
    category: "Action",
    sentences: [
      {
        en: "Always try your best, even when tasks are difficult.",
        es: "Siempre haz tu mejor esfuerzo, incluso cuando las tareas sean difíciles."
      },
      {
        en: "I want to try out that new Italian restaurant downtown.",
        es: "Quiero probar ese nuevo restaurante italiano del centro."
      }
    ]
  },
  {
    id: 12,
    word: "important",
    phonetic: "/ɪmˈpɔːtnt/",
    partOfSpeech: "adjective",
    level: "A1",
    frequencyRank: 98,
    meaningEs: "importante, esencial, relevante",
    collocation: "play an important role / critically important",
    category: "General",
    sentences: [
      {
        en: "Consistency is the most important key to learning English.",
        es: "La constancia es la clave más importante para aprender inglés."
      },
      {
        en: "Sleep plays an important role in brain health.",
        es: "El sueño juega un papel importante en la salud cerebral."
      }
    ]
  },
  {
    id: 13,
    word: "problem",
    phonetic: "/ˈprɒbləm/",
    partOfSpeech: "noun",
    level: "A1",
    frequencyRank: 105,
    meaningEs: "problema, dificultad",
    collocation: "solve a problem / face a problem / no problem",
    category: "General",
    sentences: [
      {
        en: "We need creative ideas to solve this technical problem.",
        es: "Necesitamos ideas creativas para resolver este problema técnico."
      },
      {
        en: "Thanks for your help! - No problem at all!",
        es: "¡Gracias por tu ayuda! - ¡No hay ningún problema!"
      }
    ]
  },
  {
    id: 14,
    word: "start",
    phonetic: "/stɑːt/",
    partOfSpeech: "verb",
    level: "A1",
    frequencyRank: 84,
    meaningEs: "empezar, comenzar, iniciar",
    collocation: "start off / fresh start / start over",
    category: "Action",
    sentences: [
      {
        en: "The best time to start learning is right now.",
        es: "El mejor momento para empezar a aprender es ahora mismo."
      },
      {
        en: "They decided to move to a new city for a fresh start.",
        es: "Decidieron mudarse a una nueva ciudad para un nuevo comienzo."
      }
    ]
  },
  {
    id: 15,
    word: "way",
    phonetic: "/weɪ/",
    partOfSpeech: "noun",
    level: "A1",
    frequencyRank: 33,
    meaningEs: "camino, manera, forma, método",
    collocation: "by the way (a propósito) / find a way / on the way",
    category: "General",
    sentences: [
      {
        en: "By the way, have you received the invitation email?",
        es: "A propósito, ¿has recibido el correo de invitación?"
      },
      {
        en: "Where there is a will, there is always a way.",
        es: "Donde hay voluntad, siempre hay un camino."
      }
    ]
  },

  // ==========================================
  // NIVEL A2 - INTERMEDIO ELEMENTAL (15 Palabras)
  // ==========================================
  {
    id: 16,
    word: "allow",
    phonetic: "/əˈlaʊ/",
    partOfSpeech: "verb",
    level: "A2",
    frequencyRank: 175,
    meaningEs: "permitir, autorizar",
    collocation: "allow (someone) to (do something) / allow for",
    category: "Rules & Law",
    sentences: [
      {
        en: "The new software allows us to work much faster.",
        es: "El nuevo software nos permite trabajar mucho más rápido."
      },
      {
        en: "Smoking is not allowed inside the building.",
        es: "No está permitido fumar dentro del edificio."
      }
    ]
  },
  {
    id: 17,
    word: "believe",
    phonetic: "/bɪˈliːv/",
    partOfSpeech: "verb",
    level: "A2",
    frequencyRank: 121,
    meaningEs: "creer, tener fe",
    collocation: "believe in (oneself) / firmly believe",
    category: "Thoughts",
    sentences: [
      {
        en: "You must believe in yourself before anyone else will.",
        es: "Debes creer en ti mismo antes de que alguien más lo haga."
      },
      {
        en: "I firmly believe that education changes lives.",
        es: "Creo firmemente que la educación transforma vidas."
      }
    ]
  },
  {
    id: 18,
    word: "create",
    phonetic: "/kriˈeɪt/",
    partOfSpeech: "verb",
    level: "A2",
    frequencyRank: 139,
    meaningEs: "crear, generar, producir",
    collocation: "create opportunities / create an account",
    category: "Action",
    sentences: [
      {
        en: "Small businesses create many job opportunities.",
        es: "Las pequeñas empresas crean muchas oportunidades de empleo."
      },
      {
        en: "Click here to create a new user profile.",
        es: "Haz clic aquí para crear un nuevo perfil de usuario."
      }
    ]
  },
  {
    id: 19,
    word: "decide",
    phonetic: "/dɪˈsaɪd/",
    partOfSpeech: "verb",
    level: "A2",
    frequencyRank: 188,
    meaningEs: "decidir, tomar una decisión",
    collocation: "decide to (do) / decide on (an option)",
    category: "Thoughts",
    sentences: [
      {
        en: "She couldn't decide which course to take.",
        es: "Ella no podía decidir qué curso tomar."
      },
      {
        en: "They finally decided on a date for their wedding.",
        es: "Finalmente decidieron una fecha para su boda."
      }
    ]
  },
  {
    id: 20,
    word: "experience",
    phonetic: "/ɪkˈspɪəriəns/",
    partOfSpeech: "noun",
    level: "A2",
    frequencyRank: 167,
    meaningEs: "experiencia, vivencia / experimentar",
    collocation: "gain experience / memorable experience / firsthand experience",
    category: "Life & Career",
    sentences: [
      {
        en: "Internships are great to gain hands-on experience.",
        es: "Las pasantías son geniales para adquirir experiencia práctica."
      },
      {
        en: "Traveling alone was a deeply transformative experience.",
        es: "Viajar solo fue una experiencia profundamente transformadora."
      }
    ]
  },
  {
    id: 21,
    word: "grow",
    phonetic: "/ɡrəʊ/",
    partOfSpeech: "verb",
    level: "A2",
    frequencyRank: 194,
    meaningEs: "crecer, cultivar, desarrollar",
    collocation: "grow up (madurar) / grow exponentially",
    category: "Development",
    sentences: [
      {
        en: "Children grow up fast in a loving and supportive family.",
        es: "Los niños crecen rápido en una familia cariñosa y que los apoya."
      },
      {
        en: "Our company continues to grow every year.",
        es: "Nuestra empresa continúa creciendo cada año."
      }
    ]
  },
  {
    id: 22,
    word: "happen",
    phonetic: "/ˈhæpən/",
    partOfSpeech: "verb",
    level: "A2",
    frequencyRank: 147,
    meaningEs: "ocurrir, suceder, pasar",
    collocation: "happen to (someone) / as it happens",
    category: "General",
    sentences: [
      {
        en: "What happened after you left the meeting?",
        es: "¿Qué sucedió después de que te fuiste de la reunión?"
      },
      {
        en: "Accidents can happen when you are tired.",
        es: "Los accidentes pueden ocurrir cuando estás cansado."
      }
    ]
  },
  {
    id: 23,
    word: "improve",
    phonetic: "/ɪmˈpruːv/",
    partOfSpeech: "verb",
    level: "A2",
    frequencyRank: 215,
    meaningEs: "mejorar, progresar, perfeccionar",
    collocation: "improve skills / drastically improve",
    category: "Development",
    sentences: [
      {
        en: "Daily practice will improve your listening skills.",
        es: "La práctica diaria mejorará tu habilidad de comprensión auditiva."
      },
      {
        en: "The weather is expected to improve by tomorrow morning.",
        es: "Se espera que el clima mejore para mañana por la mañana."
      }
    ]
  },
  {
    id: 24,
    word: "offer",
    phonetic: "/ˈɒfə(r)/",
    partOfSpeech: "verb",
    level: "A2",
    frequencyRank: 198,
    meaningEs: "ofrecer, proponer / oferta",
    collocation: "accept an offer / offer support / job offer",
    category: "Work & Social",
    sentences: [
      {
        en: "They offered him a lucrative position in London.",
        es: "Le ofrecieron un puesto lucrativo en Londres."
      },
      {
        en: "He offered to help us prepare dinner.",
        es: "Se ofreció a ayudarnos a preparar la cena."
      }
    ]
  },
  {
    id: 25,
    word: "remain",
    phonetic: "/rɪˈmeɪn/",
    partOfSpeech: "verb",
    level: "A2",
    frequencyRank: 240,
    meaningEs: "permanecer, quedarse, continuar siendo",
    collocation: "remain calm / remain silent / it remains to be seen",
    category: "State",
    sentences: [
      {
        en: "Please remain seated until the plane comes to a complete stop.",
        es: "Por favor, permanezca sentado hasta que el avión se detenga por completo."
      },
      {
        en: "She managed to remain calm during the unexpected crisis.",
        es: "Logró mantener la calma durante la inesperada crisis."
      }
    ]
  },
  {
    id: 26,
    word: "spend",
    phonetic: "/spend/",
    partOfSpeech: "verb",
    level: "A2",
    frequencyRank: 153,
    meaningEs: "gastar (dinero), pasar/dedicar (tiempo)",
    collocation: "spend time on / spend money on",
    category: "General",
    sentences: [
      {
        en: "How much time do you spend practicing English every day?",
        es: "¿Cuánto tiempo dedicas a practicar inglés todos los días?"
      },
      {
        en: "She prefers to spend money on experiences rather than objects.",
        es: "Ella prefiere gastar dinero en experiencias antes que en objetos."
      }
    ]
  },
  {
    id: 27,
    word: "suggest",
    phonetic: "/səˈdʒest/",
    partOfSpeech: "verb",
    level: "A2",
    frequencyRank: 265,
    meaningEs: "sugerir, proponer, insinuar",
    collocation: "suggest doing (something) / strongly suggest",
    category: "Communication",
    sentences: [
      {
        en: "I suggest reviewing flashcards ten minutes each morning.",
        es: "Sugiero repasar tarjetas de memoria diez minutos cada mañana."
      },
      {
        en: "Her tone suggested that she wasn't happy with the result.",
        es: "Su tono insinuó que no estaba contenta con el resultado."
      }
    ]
  },
  {
    id: 28,
    word: "travel",
    phonetic: "/ˈtrævl/",
    partOfSpeech: "verb",
    level: "A2",
    frequencyRank: 280,
    meaningEs: "viajar, desplazarse / viaje",
    collocation: "travel abroad / travel light",
    category: "Travel",
    sentences: [
      {
        en: "Learning English allows you to travel abroad with ease.",
        es: "Aprender inglés te permite viajar al extranjero con tranquilidad."
      },
      {
        en: "I always try to travel light with just a backpack.",
        es: "Siempre intento viajar ligero con solo una mochila."
      }
    ]
  },
  {
    id: 29,
    word: "understand",
    phonetic: "/ˌʌndəˈstænd/",
    partOfSpeech: "verb",
    level: "A2",
    frequencyRank: 110,
    meaningEs: "entender, comprender",
    collocation: "clearly understand / make oneself understood",
    category: "Thoughts",
    sentences: [
      {
        en: "Do you clearly understand how this grammatical rule works?",
        es: "¿Entiendes con claridad cómo funciona esta regla gramatical?"
      },
      {
        en: "I want to understand native speakers without needing subtitles.",
        es: "Quiero entender a los hablantes nativos sin necesidad de subtítulos."
      }
    ]
  },
  {
    id: 30,
    word: "wait",
    phonetic: "/weɪt/",
    partOfSpeech: "verb",
    level: "A2",
    frequencyRank: 160,
    meaningEs: "esperar, aguardar",
    collocation: "wait for (someone) / can't wait to (hacer algo)",
    category: "Action",
    sentences: [
      {
        en: "I can't wait to celebrate your new achievement!",
        es: "¡No puedo esperar para celebrar tu nuevo logro!"
      },
      {
        en: "We waited for the train for more than thirty minutes.",
        es: "Esperamos el tren durante más de treinta minutos."
      }
    ]
  },

  // ==========================================
  // NIVEL B1 - INTERMEDIO (12 Palabras)
  // ==========================================
  {
    id: 31,
    word: "achieve",
    phonetic: "/əˈtʃiːv/",
    partOfSpeech: "verb",
    level: "B1",
    frequencyRank: 310,
    meaningEs: "lograr, alcanzar, conseguir",
    collocation: "achieve a goal / achieve success / achieve high marks",
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
  },
  {
    id: 32,
    word: "avoid",
    phonetic: "/əˈvɔɪd/",
    partOfSpeech: "verb",
    level: "B1",
    frequencyRank: 345,
    meaningEs: "evitar, esquivar, eludir",
    collocation: "avoid making mistakes / avoid traffic / avoid confrontation",
    category: "Action",
    sentences: [
      {
        en: "You should avoid memorizing words without real context.",
        es: "Debes evitar memorizar palabras sin contexto real."
      },
      {
        en: "We took the highway early to avoid heavy rush hour traffic.",
        es: "Tomamos la autopista temprano para evitar el tráfico de la hora pico."
      }
    ]
  },
  {
    id: 33,
    word: "benefit",
    phonetic: "/ˈbenɪfɪt/",
    partOfSpeech: "noun",
    level: "B1",
    frequencyRank: 320,
    meaningEs: "beneficio, provecho / beneficiar",
    collocation: "reap the benefits / mutual benefit / benefit from",
    category: "Value",
    sentences: [
      {
        en: "Bilingual speakers benefit from greater cognitive flexibility.",
        es: "Los hablantes bilingües se benefician de una mayor flexibilidad cognitiva."
      },
      {
        en: "This business agreement will bring mutual benefits to both teams.",
        es: "Este acuerdo comercial traerá beneficios mutuos a ambos equipos."
      }
    ]
  },
  {
    id: 34,
    word: "challenge",
    phonetic: "/ˈtʃælɪndʒ/",
    partOfSpeech: "noun",
    level: "B1",
    frequencyRank: 305,
    meaningEs: "desafío, reto / desafiar",
    collocation: "face a challenge / overcome a challenge / rise to the challenge",
    category: "Achievement",
    sentences: [
      {
        en: "Mastering English pronunciation is a fun challenge.",
        es: "Dominar la pronunciación en inglés es un reto divertido."
      },
      {
        en: "She rose to the challenge and delivered an inspiring speech.",
        es: "Estuvo a la altura del desafío y dio un discurso inspirador."
      }
    ]
  },
  {
    id: 35,
    word: "encourage",
    phonetic: "/ɪnˈkʌrɪdʒ/",
    partOfSpeech: "verb",
    level: "B1",
    frequencyRank: 390,
    meaningEs: "animar, alentar, fomentar",
    collocation: "encourage (someone) to / strongly encourage",
    category: "Social",
    sentences: [
      {
        en: "Teachers should always encourage curiosity in students.",
        es: "Los maestros siempre deben fomentar la curiosidad en los estudiantes."
      },
      {
        en: "My mentor encouraged me to apply for the prestigious scholarship.",
        es: "Mi mentor me animó a postularme para la prestigiosa beca."
      }
    ]
  },
  {
    id: 36,
    word: "manage",
    phonetic: "/ˈmænɪdʒ/",
    partOfSpeech: "verb",
    level: "B1",
    frequencyRank: 295,
    meaningEs: "administrar, gestionar / ingeniárselas para hacer algo",
    collocation: "manage to (do something) / manage time effectively",
    category: "Work & Skills",
    sentences: [
      {
        en: "Despite the obstacles, she managed to arrive before noon.",
        es: "A pesar de los obstáculos, se las arregló para llegar antes del mediodía."
      },
      {
        en: "Effective leaders know how to manage time and prioritize tasks.",
        es: "Los líderes eficaces saben cómo administrar el tiempo y priorizar tareas."
      }
    ]
  },
  {
    id: 37,
    word: "opportunity",
    phonetic: "/ˌɒpəˈtjuːnəti/",
    partOfSpeech: "noun",
    level: "B1",
    frequencyRank: 275,
    meaningEs: "oportunidad, ocasión favorable",
    collocation: "seize the opportunity / golden opportunity / miss an opportunity",
    category: "Career & Life",
    sentences: [
      {
        en: "This job offers a unique opportunity for professional growth.",
        es: "Este trabajo ofrece una oportunidad única para el crecimiento profesional."
      },
      {
        en: "Do not miss the opportunity to learn something new today.",
        es: "No dejes pasar la oportunidad de aprender algo nuevo hoy."
      }
    ]
  },
  {
    id: 38,
    word: "perform",
    phonetic: "/pəˈfɔːm/",
    partOfSpeech: "verb",
    level: "B1",
    frequencyRank: 360,
    meaningEs: "actuar, rendir, desempeñar, realizar",
    collocation: "perform well / perform duties / perform an experiment",
    category: "Work & Performance",
    sentences: [
      {
        en: "Athletes perform much better when they follow a strict recovery routine.",
        es: "Los atletas rinden mucho mejor cuando siguen una rutina estricta de recuperación."
      },
      {
        en: "The musician performed on stage in front of thousands of fans.",
        es: "El músico actuó en el escenario frente a miles de fanáticos."
      }
    ]
  },
  {
    id: 39,
    word: "prevent",
    phonetic: "/prɪˈvent/",
    partOfSpeech: "verb",
    level: "B1",
    frequencyRank: 372,
    meaningEs: "prevenir, impedir, evitar que suceda",
    collocation: "prevent (someone) from (doing) / prevent accidents",
    category: "Safety & Health",
    sentences: [
      {
        en: "Regular exercise helps prevent chronic health conditions.",
        es: "El ejercicio regular ayuda a prevenir afecciones de salud crónicas."
      },
      {
        en: "Bad weather prevented the airplanes from taking off.",
        es: "El mal tiempo impidió que los aviones despegaran."
      }
    ]
  },
  {
    id: 40,
    word: "require",
    phonetic: "/rɪˈkwaɪə(r)/",
    partOfSpeech: "verb",
    level: "B1",
    frequencyRank: 285,
    meaningEs: "requerir, exigir, necesitar por norma",
    collocation: "require attention / legally required / require effort",
    category: "Rules & Work",
    sentences: [
      {
        en: "Mastering any language requires consistent daily practice.",
        es: "Dominar cualquier idioma requiere práctica diaria constante."
      },
      {
        en: "This complex project requires close attention to detail.",
        es: "Este complejo proyecto requiere una minuciosa atención a los detalles."
      }
    ]
  },
  {
    id: 41,
    word: "significant",
    phonetic: "/sɪɡˈnɪfɪkənt/",
    partOfSpeech: "adjective",
    level: "B1",
    frequencyRank: 335,
    meaningEs: "significativo, importante, considerable",
    collocation: "significant impact / significant difference / statistically significant",
    category: "Analysis",
    sentences: [
      {
        en: "Learning the top 1000 words makes a significant difference in comprehension.",
        es: "Aprender las 1000 palabras principales marca una diferencia significativa en la comprensión."
      },
      {
        en: "The new strategy had a significant impact on annual sales.",
        es: "La nueva estrategia tuvo un impacto significativo en las ventas anuales."
      }
    ]
  },
  {
    id: 42,
    word: "value",
    phonetic: "/ˈvæljuː/",
    partOfSpeech: "noun",
    level: "B1",
    frequencyRank: 290,
    meaningEs: "valor, importancia / valorar, apreciar",
    collocation: "add value / share common values / place value on",
    category: "Value",
    sentences: [
      {
        en: "We truly value the diverse perspectives of our international team.",
        es: "Realmente valoramos las diversas perspectivas de nuestro equipo internacional."
      },
      {
        en: "Active listening adds immense value to any conversation.",
        es: "La escucha activa aporta un valor inmenso a cualquier conversación."
      }
    ]
  },

  // ==========================================
  // NIVEL B2 - INTERMEDIO ALTO (10 Palabras)
  // ==========================================
  {
    id: 43,
    word: "acquire",
    phonetic: "/əˈkwaɪə(r)/",
    partOfSpeech: "verb",
    level: "B2",
    frequencyRank: 420,
    meaningEs: "adquirir, asimilar, incorporar",
    collocation: "acquire knowledge / acquire a skill / acquire fluency",
    category: "Learning",
    sentences: [
      {
        en: "Children acquire languages naturally through immersive exposure.",
        es: "Los niños adquieren idiomas de forma natural mediante la exposición inmersiva."
      },
      {
        en: "He acquired invaluable leadership skills during his military service.",
        es: "Adquirió invaluables habilidades de liderazgo durante su servicio militar."
      }
    ]
  },
  {
    id: 44,
    word: "crucial",
    phonetic: "/ˈkruːʃl/",
    partOfSpeech: "adjective",
    level: "B2",
    frequencyRank: 440,
    meaningEs: "crucial, decisivo, vital",
    collocation: "play a crucial role / crucial factor / of crucial importance",
    category: "Analysis",
    sentences: [
      {
        en: "Spaced repetition is a crucial technique for long-term memory retention.",
        es: "La repetición espaciada es una técnica crucial para la retención en la memoria a largo plazo."
      },
      {
        en: "Effective communication is crucial during emergency situations.",
        es: "La comunicación eficaz es crucial durante situaciones de emergencia."
      }
    ]
  },
  {
    id: 45,
    word: "determine",
    phonetic: "/dɪˈtɜːmɪn/",
    partOfSpeech: "verb",
    level: "B2",
    frequencyRank: 410,
    meaningEs: "determinar, precisar, establecer",
    collocation: "determine the outcome / determine factors",
    category: "Analysis",
    sentences: [
      {
        en: "Your habits determine your future more than your intentions.",
        es: "Tus hábitos determinan tu futuro más que tus intenciones."
      },
      {
        en: "Scientists are working to determine the exact cause of the phenomenon.",
        es: "Los científicos están trabajando para determinar la causa exacta del fenómeno."
      }
    ]
  },
  {
    id: 46,
    word: "enhance",
    phonetic: "/ɪnˈhɑːns/",
    partOfSpeech: "verb",
    level: "B2",
    frequencyRank: 460,
    meaningEs: "mejorar, potenciar, realzar",
    collocation: "enhance performance / enhance quality / enhance user experience",
    category: "Development",
    sentences: [
      {
        en: "Listening to podcasts will enhance your natural speech rhythm.",
        es: "Escuchar podcasts potenciará tu ritmo natural al hablar."
      },
      {
        en: "The latest software update greatly enhances security features.",
        es: "La última actualización del software mejora notablemente las características de seguridad."
      }
    ]
  },
  {
    id: 47,
    word: "implement",
    phonetic: "/ˈɪmplɪment/",
    partOfSpeech: "verb",
    level: "B2",
    frequencyRank: 430,
    meaningEs: "implementar, poner en práctica, ejecutar",
    collocation: "implement a strategy / implement changes / successfully implement",
    category: "Work & Strategy",
    sentences: [
      {
        en: "The company plans to implement modern automated workflows.",
        es: "La empresa planea implementar flujos de trabajo automatizados y modernos."
      },
      {
        en: "It is easy to devise a strategy, but difficult to implement it well.",
        es: "Es fácil idear una estrategia, pero difícil implementarla bien."
      }
    ]
  },
  {
    id: 48,
    word: "maintain",
    phonetic: "/meɪnˈteɪn/",
    partOfSpeech: "verb",
    level: "B2",
    frequencyRank: 415,
    meaningEs: "mantener, conservar, sostener una postura",
    collocation: "maintain focus / maintain high standards / maintain a routine",
    category: "Action",
    sentences: [
      {
        en: "It requires discipline to maintain a daily study routine.",
        es: "Requiere disciplina mantener una rutina de estudio diaria."
      },
      {
        en: "They maintain that the original agreement is still legally binding.",
        es: "Ellos sostienen que el acuerdo original sigue siendo jurídicamente vinculante."
      }
    ]
  },
  {
    id: 49,
    word: "outcome",
    phonetic: "/ˈaʊtkʌm/",
    partOfSpeech: "noun",
    level: "B2",
    frequencyRank: 480,
    meaningEs: "resultado, desenlace, consecuencia",
    collocation: "positive outcome / desired outcome / uncertain outcome",
    category: "Results",
    sentences: [
      {
        en: "Dedication and active recall lead to the best learning outcome.",
        es: "La dedicación y la evocación activa conducen al mejor resultado de aprendizaje."
      },
      {
        en: "We are eagerly awaiting the final outcome of the negotiation.",
        es: "Esperamos con ansias el resultado final de la negociación."
      }
    ]
  },
  {
    id: 50,
    word: "relevant",
    phonetic: "/ˈreləvənt/",
    partOfSpeech: "adjective",
    level: "B2",
    frequencyRank: 450,
    meaningEs: "pertinente, relevante, aplicable",
    collocation: "highly relevant / relevant experience / relevant information",
    category: "Analysis",
    sentences: [
      {
        en: "Focus only on vocabulary that is directly relevant to your daily conversations.",
        es: "Enfócate solo en vocabulario que sea directamente relevante para tus conversaciones diarias."
      },
      {
        en: "Her resume highlights all relevant experience in international sales.",
        es: "Su currículum destaca toda la experiencia relevante en ventas internacionales."
      }
    ]
  },
  {
    id: 51,
    word: "reliable",
    phonetic: "/rɪˈlaɪəbl/",
    partOfSpeech: "adjective",
    level: "B2",
    frequencyRank: 490,
    meaningEs: "confiable, fidedigno, seguro",
    collocation: "reliable source / reliable partner / highly reliable",
    category: "Value",
    sentences: [
      {
        en: "Always seek information from reliable and verified academic sources.",
        es: "Busca siempre información de fuentes académicas confiables y verificadas."
      },
      {
        en: "He is a reliable friend who is always there when you need him.",
        es: "Es un amigo confiable que siempre está ahí cuando lo necesitas."
      }
    ]
  },
  {
    id: 52,
    word: "widespread",
    phonetic: "/ˈwaɪdspred/",
    partOfSpeech: "adjective",
    level: "B2",
    frequencyRank: 510,
    meaningEs: "generalizado, extendido, de amplio alcance",
    collocation: "widespread use / widespread support / widespread belief",
    category: "General",
    sentences: [
      {
        en: "The 80/20 rule has found widespread adoption among accelerated language learners.",
        es: "La regla del 80/20 ha encontrado una adopción generalizada entre estudiantes de idiomas acelerados."
      },
      {
        en: "Remote work gained widespread acceptance across multinational companies.",
        es: "El trabajo remoto ganó una aceptación generalizada en las empresas multinacionales."
      }
    ]
  }
];

// Helper utilities para acceso y consulta rápida
const VocabularyData = {
  getAll: () => OXFORD_3000_WORDS,
  getById: (id) => OXFORD_3000_WORDS.find(w => w.id === id),
  getByLevel: (level) => OXFORD_3000_WORDS.filter(w => w.level.toUpperCase() === level.toUpperCase()),
  getByPartOfSpeech: (pos) => OXFORD_3000_WORDS.filter(w => w.partOfSpeech.toLowerCase() === pos.toLowerCase()),
  search: (query) => {
    if (!query || query.trim() === '') return OXFORD_3000_WORDS;
    const q = query.toLowerCase().trim();
    return OXFORD_3000_WORDS.filter(w => 
      w.word.toLowerCase().includes(q) ||
      w.meaningEs.toLowerCase().includes(q) ||
      w.collocation.toLowerCase().includes(q)
    );
  },
  getTotalCount: () => OXFORD_3000_WORDS.length
};
