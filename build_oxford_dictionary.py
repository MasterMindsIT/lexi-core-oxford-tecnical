#!/usr/bin/env python3
"""
LexiCore 80/20 - Oxford 3000 Full Dictionary & Study Book Builder
Construye el dataset completo de las ~3.000 palabras de Oxford 3000 con:
- Palabra en inglés y nivel MCER (A1, A2, B1, B2)
- Categoría gramatical y fonética IPA (US / UK)
- Traducción principal al español
- 1 o 2 oraciones de ejemplo bilingües contextuales (EN / ES)
- Generación de oxford_dictionary_full.json, oxford_dictionary_full.csv
- Generación de oxford_dictionary_book.html (optimizado para impresión/PDF en navegador)
"""

import urllib.request
import json
import csv
import re
import os
import sys
import html

# Directorio de salida
OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_OUTPUT = os.path.join(OUTPUT_DIR, "oxford_dictionary_full.json")
CSV_OUTPUT = os.path.join(OUTPUT_DIR, "oxford_dictionary_full.csv")
HTML_OUTPUT = os.path.join(OUTPUT_DIR, "oxford_dictionary_book.html")

# Fuentes de datos abiertas en GitHub
URL_OXFORD_DATA = "https://raw.githubusercontent.com/tyypgzl/Oxford-5000-words/main/full-word.json"
URL_EN_ES_WORDS = "https://raw.githubusercontent.com/fufu70/spanish-english-json/main/en-es-words.json"
URL_LLM_DICT = "https://raw.githubusercontent.com/IvanDubls/llm_dictionary/main/llm_dict_enes/dictionaries/en_es_aidict.json"
URL_TATOEBA_SENTENCES = "https://raw.githubusercontent.com/fufu70/spanish-english-json/main/sentences.json"

# Diccionario de respaldo para ortografía británica / variantes comunes
FALLBACK_TRANSLATIONS = {
    "centre": "centro",
    "colour": "color",
    "defence": "defensa",
    "favour": "favor, preferir",
    "favourite": "favorito",
    "licence": "licencia, permiso",
    "offence": "ofensa, infracción",
    "practise": "practicar",
    "programme": "programa, programar",
    "app": "aplicación móvil / software",
    "cafe": "café, cafetería",
    "cd": "disco compacto",
    "depend": "depender",
    "devote": "dedicar, consagrar",
    "erupt": "entrar en erupción, estallar",
    "fellow": "compañero, colega / becario",
    "gaming": "videojuegos, jugar partidas",
    "graphics": "gráficos, diseño visual",
    "incorporate": "incorporar, integrar",
    "indoor": "interior, bajo techo",
    "info": "información",
    "inner": "interior, interno, íntimo",
    "judgement": "juicio, criterio, dictamen",
    "lighting": "iluminación, luces",
    "negotiate": "negociar, acordar",
    "outdoor": "al aire libre, exterior",
    "outer": "exterior, externo",
    "output": "producción, rendimiento, salida",
    "partly": "en parte, parcialmente",
    "per cent": "por ciento (%)",
    "petrol": "gasolina, combustible",
    "revise": "revisar, repasar",
    "secondly": "en segundo lugar",
    "shopping": "compras, ir de compras",
    "spokeswoman": "portavoz (mujer)",
    "sporting": "deportivo",
    "starve": "morir de hambre, pasar hambre",
    "statistic": "estadística, dato estadístico",
    "teenage": "adolescente",
    "teens": "adolescencia, años adolescentes",
    "usage": "uso, utilización, costumbre",
    "venue": "lugar, sede del evento",
    "washing": "lavado, colada de ropa",
    "whoever": "quienquiera que, cualquiera",
    "wooden": "de madera",
    "workforce": "fuerza laboral, personal",
    "workplace": "lugar de trabajo, entorno laboral",
    "afford": "permitirse pagar, costear",
    "artwork": "obra de arte, diseño gráfico",
    "broadly": "ampliamente, a grandes rasgos",
    "comprise": "comprender, abarcar, constar de",
    "cooker": "cocina (fogón/electrodoméstico)",
    "criticize": "criticar, censurar",
    "downwards": "hacia abajo",
    "enquiry": "consulta, indagación",
    "onto": "sobre, encima de",
    "punk": "punk (estilo o movimiento)",
    "ah": "¡ah! (expresión)",
    "anything": "cualquier cosa, nada"
}


def download_json(url, desc):
    print(f"📥 Descargando {desc}...")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=40) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        if isinstance(data, str):
            data = json.loads(data)
        print(f"   ✓ {desc} cargado con éxito.")
        return data


def clean_translation(trans_list):
    """Limpia etiquetas gramaticales como {f}, {m}, etc."""
    cleaned = []
    seen = set()
    for t in trans_list:
        clean = re.sub(r"\{.*?\}", "", t).strip()
        clean = re.sub(r"\(.*?\)", "", clean).strip()
        clean = clean.strip(";,").strip()
        if clean and clean.lower() not in seen:
            seen.add(clean.lower())
            cleaned.append(clean)
    return ", ".join(cleaned[:3]) if cleaned else ""


def main():
    print("=" * 70)
    print("🚀 INICIANDO CONSTRUCCIÓN DEL DICCIONARIO OXFORD 3000 (LEXICORE)")
    print("=" * 70)

    # 1. Cargar Oxford 3000/5000 base
    oxford_raw = download_json(URL_OXFORD_DATA, "Corpus Oxford Learner's Dictionaries")

    # Filtrar estrictamente palabras de Oxford 3000 (Niveles A1, A2, B1, B2)
    oxford_words = {}
    for item in oxford_raw:
        val = item.get("value", {})
        w = val.get("word", "").strip().lower()
        lvl = val.get("level", "").strip()
        if w and lvl in ["A1", "A2", "B1", "B2"]:
            # Si la palabra ya existe, conservar el nivel más temprano (A1 antes que B2)
            lvl_rank = {"A1": 1, "A2": 2, "B1": 3, "B2": 4}
            if w not in oxford_words or lvl_rank.get(lvl, 9) < lvl_rank.get(oxford_words[w].get("level"), 9):
                oxford_words[w] = val

    print(f"📊 Palabras únicas encontradas para Oxford 3000 (A1-B2): {len(oxford_words)}")

    # 2. Cargar Diccionario EN-ES de fufu70
    es_dict_raw = download_json(URL_EN_ES_WORDS, "Diccionario Inglés-Español (fufu70)")
    es_words_map = {}
    for entry in es_dict_raw.get("list", []):
        w = entry.get("word", "").strip().lower()
        if w and w not in es_words_map:
            trans = entry.get("translation", [])
            cleaned_trans = clean_translation(trans)
            if cleaned_trans:
                es_words_map[w] = cleaned_trans

    # 3. Cargar Corpus Bilingüe de Oraciones y Diccionario (IvanDubls)
    ai_dict_raw = download_json(URL_LLM_DICT, "Corpus Bilingüe de Oraciones (llm_dictionary)")
    ai_translations = {}
    sentence_index = {}

    for item in ai_dict_raw:
        if not isinstance(item, dict):
            continue
        es_w = (item.get("word") or "").strip()
        trans = (item.get("translation") or "").strip()
        ex1_es = (item.get("example_1") or "").strip()
        ex1_en = (item.get("example_translation_1") or "").strip()
        ex2_es = (item.get("example_2") or "").strip()
        ex2_en = (item.get("example_translation_2") or "").strip()

        # Extraer palabras en inglés asociadas a la traducción
        parts = [re.sub(r"\(.*?\)", "", p).strip().lower() for p in re.split(r"[;,/]", trans)]
        for p in parts:
            if p and len(p.split()) <= 2:
                if p not in ai_translations:
                    ai_translations[p] = es_w

        # Indexar oraciones bilingües por palabras en inglés
        for s_en, s_es in [(ex1_en, ex1_es), (ex2_en, ex2_es)]:
            if s_en and s_es:
                words_found = set(re.findall(r"[a-zA-Z]{3,}", s_en.lower()))
                for wf in words_found:
                    if wf not in sentence_index:
                        sentence_index[wf] = []
                    if len(sentence_index[wf]) < 2:
                        if not any(x["en"] == s_en for x in sentence_index[wf]):
                            sentence_index[wf].append({"en": s_en, "es": s_es})

    # 4. Cargar Tatoeba adicional para oraciones de refuerzo
    tatoeba_raw = download_json(URL_TATOEBA_SENTENCES, "Colección Bilingüe Tatoeba")
    for item in tatoeba_raw:
        if not isinstance(item, dict):
            continue
        s_en = (item.get("en") or "").strip()
        s_es = (item.get("es") or "").strip()
        if s_en and s_es and 15 <= len(s_en) <= 120:
            words_found = set(re.findall(r"[a-zA-Z]{3,}", s_en.lower()))
            for wf in words_found:
                if wf not in sentence_index:
                    sentence_index[wf] = []
                if len(sentence_index[wf]) < 2:
                    if not any(x["en"] == s_en for x in sentence_index[wf]):
                        sentence_index[wf].append({"en": s_en, "es": s_es})

    print("🧠 Integrando y consolidando términos...")

    # Ordenar palabras por nivel MCER y luego alfabéticamente
    lvl_order = {"A1": 1, "A2": 2, "B1": 3, "B2": 4}
    sorted_words = sorted(
        oxford_words.keys(),
        key=lambda w: (lvl_order.get(oxford_words[w].get("level", "B2"), 9), w)
    )

    final_dataset = []
    item_id = 1

    for word in sorted_words:
        val = oxford_words[word]
        level = val.get("level", "B1")
        part_of_speech = val.get("type", "word")
        phonetics = val.get("phonetics", {})
        us_phonetic = phonetics.get("us") or ""
        uk_phonetic = phonetics.get("uk") or ""
        primary_phonetic = us_phonetic or uk_phonetic or ""

        # Determinar traducción al español
        trans = (
            es_words_map.get(word)
            or FALLBACK_TRANSLATIONS.get(word)
            or ai_translations.get(word)
        )
        if not trans:
            # Buscar coincidencia sin sufijos o variante
            base_cand = word.rstrip("s").rstrip("ed").rstrip("ing")
            trans = es_words_map.get(base_cand) or ai_translations.get(base_cand) or word

        # Determinar oraciones de ejemplo bilingües
        examples = []
        # Opción A: Oraciones bilingües indexadas
        bilingual_candidates = sentence_index.get(word, [])
        for cand in bilingual_candidates:
            if len(examples) < 2:
                examples.append(cand)

        # Opción B: Si faltan oraciones, tomar ejemplos originales de Oxford
        ox_examples = val.get("examples", [])
        if len(examples) < 2 and ox_examples:
            for ox_s in ox_examples:
                ox_s_clean = re.sub(r"^[a-zA-Z\s]+(?=[A-Z])", "", ox_s).strip()
                if not any(e["en"] == ox_s_clean for e in examples):
                    # Traducir o emparejar contextualmente
                    examples.append({
                        "en": ox_s_clean,
                        "es": f"(Uso contextual: {trans})"
                    })
                if len(examples) >= 2:
                    break

        # Construir entrada unificada
        entry = {
            "id": item_id,
            "word": word,
            "level": level,
            "partOfSpeech": part_of_speech,
            "phonetic": primary_phonetic,
            "phonetic_uk": uk_phonetic,
            "phonetic_us": us_phonetic,
            "translation_es": trans,
            "examples": examples
        }
        final_dataset.append(entry)
        item_id += 1

    print(f"✅ Total de entradas consolidadas: {len(final_dataset)}")

    # 5. Exportar JSON
    print(f"💾 Guardando {JSON_OUTPUT}...")
    with open(JSON_OUTPUT, "w", encoding="utf-8") as f:
        json.dump(final_dataset, f, ensure_ascii=False, indent=2)
    json_size_mb = os.path.getsize(JSON_OUTPUT) / (1024 * 1024)
    print(f"   ✓ Archivo JSON creado ({json_size_mb:.2f} MB).")

    # 6. Exportar CSV
    print(f"💾 Guardando {CSV_OUTPUT}...")
    with open(CSV_OUTPUT, "w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow([
            "ID", "Word", "Level", "PartOfSpeech", "Phonetic",
            "Translation_ES", "Example1_EN", "Example1_ES", "Example2_EN", "Example2_ES"
        ])
        for item in final_dataset:
            ex1_en = item["examples"][0]["en"] if len(item["examples"]) > 0 else ""
            ex1_es = item["examples"][0]["es"] if len(item["examples"]) > 0 else ""
            ex2_en = item["examples"][1]["en"] if len(item["examples"]) > 1 else ""
            ex2_es = item["examples"][1]["es"] if len(item["examples"]) > 1 else ""
            writer.writerow([
                item["id"], item["word"], item["level"], item["partOfSpeech"],
                item["phonetic"], item["translation_es"],
                ex1_en, ex1_es, ex2_en, ex2_es
            ])
    csv_size_mb = os.path.getsize(CSV_OUTPUT) / (1024 * 1024)
    print(f"   ✓ Archivo CSV creado ({csv_size_mb:.2f} MB).")

    # 7. Generar HTML imprimible
    print(f"📄 Generando libro de estudio HTML imprimible {HTML_OUTPUT}...")
    build_printable_html(final_dataset, HTML_OUTPUT)
    html_size_mb = os.path.getsize(HTML_OUTPUT) / (1024 * 1024)
    print(f"   ✓ Libro HTML creado ({html_size_mb:.2f} MB).")

    print("=" * 70)
    print("🎉 ¡PROCESO COMPLETADO EXITOSAMENTE!")
    print(f"📁 JSON: {JSON_OUTPUT}")
    print(f"📁 CSV:  {CSV_OUTPUT}")
    print(f"📁 HTML: {HTML_OUTPUT}")
    print("=" * 70)


def build_printable_html(dataset, output_path):
    """Genera una versión HTML estilizada para lectura física y PDF (Ctrl+P)."""
    counts_by_lvl = {}
    for item in dataset:
        lvl = item["level"]
        counts_by_lvl[lvl] = counts_by_lvl.get(lvl, 0) + 1

    html_content = f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Oxford 3000 - Diccionario y Libro de Estudio Imprimible | LexiCore 80/20</title>
  <style>
    :root {{
      --primary: #4338ca;
      --primary-light: #eef2ff;
      --text: #1e293b;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --bg: #ffffff;
      --a1-color: #059669;
      --a2-color: #2563eb;
      --b1-color: #d97706;
      --b2-color: #dc2626;
    }}

    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }}

    body {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: var(--text);
      background-color: #f8fafc;
      line-height: 1.5;
      font-size: 13px;
    }}

    /* Barra superior interactiva (Oculta al imprimir) */
    .top-toolbar {{
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--border);
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.04);
    }}

    .top-toolbar .title {{
      font-weight: 800;
      font-size: 16px;
      color: var(--primary);
    }}

    .search-input {{
      padding: 8px 14px;
      border: 1px solid var(--border);
      border-radius: 8px;
      font-size: 14px;
      width: 280px;
      outline: none;
    }}

    .btn-print {{
      background: var(--primary);
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }}

    .btn-print:hover {{
      background: #3730a3;
    }}

    /* Contenedor principal de libro */
    .book-container {{
      max-width: 1200px;
      margin: 30px auto;
      background: var(--bg);
      padding: 40px 60px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    }}

    /* Portada Editorial */
    .cover-page {{
      text-align: center;
      padding: 60px 20px 80px 20px;
      border-bottom: 2px solid var(--border);
      margin-bottom: 40px;
    }}

    .cover-badge {{
      display: inline-block;
      background: var(--primary-light);
      color: var(--primary);
      font-weight: 700;
      padding: 6px 16px;
      border-radius: 20px;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 1px;
      margin-bottom: 20px;
    }}

    .cover-title {{
      font-size: 38px;
      font-weight: 900;
      color: #0f172a;
      line-height: 1.15;
      margin-bottom: 16px;
    }}

    .cover-subtitle {{
      font-size: 18px;
      color: var(--text-muted);
      max-width: 750px;
      margin: 0 auto 30px auto;
    }}

    .stats-summary {{
      display: flex;
      justify-content: center;
      gap: 24px;
      flex-wrap: wrap;
      margin-top: 24px;
    }}

    .stat-box {{
      padding: 12px 20px;
      border-radius: 12px;
      border: 1px solid var(--border);
      background: #f8fafc;
      min-width: 130px;
    }}

    .stat-box .count {{
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
    }}

    .stat-box .label {{
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 600;
      color: var(--text-muted);
    }}

    /* Secciones por Nivel */
    .level-section {{
      margin-top: 40px;
      margin-bottom: 50px;
    }}

    .level-header {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 12px;
      border-bottom: 2px solid #0f172a;
      margin-bottom: 24px;
    }}

    .level-title {{
      font-size: 22px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }}

    /* Grid de dos columnas para tarjetas de vocabulario */
    .word-grid {{
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }}

    .word-card {{
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 14px 16px;
      background: #ffffff;
      break-inside: avoid;
      page-break-inside: avoid;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 8px;
    }}

    .word-header {{
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 8px;
    }}

    .word-term {{
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
    }}

    .word-meta {{
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
    }}

    .badge-pos {{
      font-style: italic;
      color: var(--text-muted);
    }}

    .badge-ipa {{
      font-family: Consolas, Monaco, "Lucida Console", monospace;
      background: #f1f5f9;
      color: #475569;
      padding: 1px 5px;
      border-radius: 4px;
      font-size: 11px;
    }}

    .badge-level {{
      font-weight: 700;
      font-size: 10px;
      padding: 1px 6px;
      border-radius: 4px;
      color: white;
    }}

    .lvl-A1 {{ background: var(--a1-color); }}
    .lvl-A2 {{ background: var(--a2-color); }}
    .lvl-B1 {{ background: var(--b1-color); }}
    .lvl-B2 {{ background: var(--b2-color); }}

    .word-translation {{
      font-size: 13px;
      font-weight: 600;
      color: #334155;
    }}

    .word-examples {{
      font-size: 12px;
      color: #475569;
      background: #f8fafc;
      padding: 8px 10px;
      border-radius: 6px;
      border-left: 3px solid var(--primary);
      display: flex;
      flex-direction: column;
      gap: 6px;
    }}

    .ex-pair {{
      line-height: 1.35;
    }}

    .ex-en {{
      font-weight: 500;
      color: #0f172a;
    }}

    .ex-es {{
      font-size: 11px;
      color: var(--text-muted);
    }}

    .srs-boxes {{
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
      font-size: 10px;
      color: var(--text-muted);
      font-weight: 600;
      border-top: 1px dashed #f1f5f9;
      padding-top: 6px;
    }}

    .checkbox-box {{
      width: 12px;
      height: 12px;
      border: 1px solid #94a3b8;
      border-radius: 2px;
      display: inline-block;
      vertical-align: middle;
      margin-right: 3px;
    }}

    /* Estilos de Impresión / Guardado en PDF */
    @media print {{
      body {{
        background: white;
        font-size: 10pt;
      }}

      .top-toolbar {{
        display: none !important;
      }}

      .book-container {{
        max-width: 100%;
        margin: 0;
        padding: 0;
        box-shadow: none;
        border-radius: 0;
      }}

      .level-section {{
        page-break-before: always;
      }}

      .word-grid {{
        grid-template-columns: repeat(2, 1fr);
        gap: 8pt;
      }}

      .word-card {{
        border: 0.5pt solid #cbd5e1;
        padding: 6pt 8pt;
        break-inside: avoid;
        page-break-inside: avoid;
      }}

      @page {{
        size: A4 portrait;
        margin: 1.2cm 1cm 1.2cm 1cm;
      }}
    }}
  </style>
</head>
<body>

  <!-- Barra de utilidades web -->
  <header class="top-toolbar">
    <div class="title">📖 LexiCore 80/20 &bull; Oxford 3000 Study Book</div>
    <div style="display: flex; align-items: center; gap: 12px;">
      <input type="text" id="filter-input" class="search-input" placeholder="Buscar palabra en inglés o español..." oninput="filterWords(this.value)">
      <button class="btn-print" onclick="window.print()">
        🖨️ Imprimir / Guardar PDF (Ctrl+P)
      </button>
    </div>
  </header>

  <div class="book-container">
    
    <!-- Portada -->
    <div class="cover-page">
      <span class="cover-badge">Metodología Pareto 80/20 &bull; Oxford 3000</span>
      <h1 class="cover-title">Oxford 3000™ Complete Study Book</h1>
      <p class="cover-subtitle">
        Compendio maestro de las palabras de más alta frecuencia del idioma inglés con fonética IPA, traducción al español, oraciones bilingües y casillas para el Método Leitner de Repetición Espaciada.
      </p>

      <div class="stats-summary">
        <div class="stat-box">
          <div class="count">{len(dataset)}</div>
          <div class="label">Términos Totales</div>
        </div>
        <div class="stat-box">
          <div class="count" style="color: var(--a1-color);">{counts_by_lvl.get('A1', 0)}</div>
          <div class="label">Nivel A1 (Básico)</div>
        </div>
        <div class="stat-box">
          <div class="count" style="color: var(--a2-color);">{counts_by_lvl.get('A2', 0)}</div>
          <div class="label">Nivel A2 (Pre-Intermedio)</div>
        </div>
        <div class="stat-box">
          <div class="count" style="color: var(--b1-color);">{counts_by_lvl.get('B1', 0)}</div>
          <div class="label">Nivel B1 (Intermedio)</div>
        </div>
        <div class="stat-box">
          <div class="count" style="color: var(--b2-color);">{counts_by_lvl.get('B2', 0)}</div>
          <div class="label">Nivel B2 (Avanzado)</div>
        </div>
      </div>
    </div>
"""

    # Agrupar términos por nivel
    current_level = None
    level_descriptions = {
        "A1": "Fundamentos Críticos: Vocabulario esencial para la comunicación operativa inmediata.",
        "A2": "Consolidación Pre-Intermedia: Estructuras y descripciones de la vida cotidiana.",
        "B1": "Intermedio Operativo: Fluidez funcional en trabajo, viajes y argumentación.",
        "B2": "Independencia Profesional: Léxico avanzado para decisiones, análisis y contexto corporativo."
    }

    for item in dataset:
        lvl = item["level"]
        if lvl != current_level:
            if current_level is not None:
                html_content += "    </div>\n  </div>\n"
            current_level = lvl
            html_content += f"""
  <!-- NIVEL {current_level} -->
  <div class="level-section" data-level="{current_level}">
    <div class="level-header">
      <div>
        <h2 class="level-title" style="color: var(--{current_level.lower()}-color);">Nivel {current_level} &bull; {level_descriptions.get(current_level, '')}</h2>
      </div>
      <span style="font-weight: 700; color: var(--text-muted); font-size: 13px;">{counts_by_lvl.get(current_level, 0)} Términos</span>
    </div>
    <div class="word-grid">
"""

        # Formatear ejemplos
        ex_html = ""
        for ex in item["examples"][:2]:
            en_esc = html.escape(ex.get("en", ""))
            es_esc = html.escape(ex.get("es", ""))
            ex_html += f"""
        <div class="ex-pair">
          <div class="ex-en">&bull; {en_esc}</div>
          <div class="ex-es">{es_esc}</div>
        </div>
"""

        w_esc = html.escape(item["word"])
        pos_esc = html.escape(item["partOfSpeech"])
        ipa_esc = html.escape(item["phonetic"])
        trans_esc = html.escape(item["translation_es"])

        html_content += f"""
      <div class="word-card" data-word="{w_esc.lower()}" data-trans="{trans_esc.lower()}">
        <div>
          <div class="word-header">
            <span class="word-term">{w_esc}</span>
            <div class="word-meta">
              <span class="badge-pos">{pos_esc}</span>
              <span class="badge-ipa">{ipa_esc}</span>
              <span class="badge-level lvl-{lvl}">{lvl}</span>
            </div>
          </div>
          <div class="word-translation">{trans_esc}</div>
        </div>
        
        <div class="word-examples">
          {ex_html}
        </div>

        <div class="srs-boxes">
          <span><span class="checkbox-box"></span> R1 (D1)</span>
          <span><span class="checkbox-box"></span> R2 (D3)</span>
          <span><span class="checkbox-box"></span> R3 (D7)</span>
        </div>
      </div>
"""

    if current_level is not None:
        html_content += "    </div>\n  </div>\n"

    # Script interactivo de filtro en vivo
    html_content += """
  </div>

  <script>
    function filterWords(query) {
      const q = query.trim().toLowerCase();
      const cards = document.querySelectorAll('.word-card');
      cards.forEach(card => {
        const w = card.getAttribute('data-word') || '';
        const t = card.getAttribute('data-trans') || '';
        if (!q || w.includes(q) || t.includes(q)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }
  </script>
</body>
</html>
"""

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html_content)


if __name__ == "__main__":
    main()
