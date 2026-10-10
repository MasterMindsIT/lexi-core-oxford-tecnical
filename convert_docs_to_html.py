#!/usr/bin/env python3
"""
Convertidor de documentos .docx de Kale Anders a HTML interactivo y responsivo.
Genera A1-A2.html, B1-B2.html y C1-C2.html en lexi-core-oxford-tecnical con:
- ToC dinámico y navegación lateral sticky
- Barra de navegación entre niveles
- Ejercicios interactivos con soluciones ocultables/revelables
- Modo oscuro y modo claro con persistencia
- Hoja de estilos @media print optimizada para papel A4/PDF
"""

import os
import re
import html
from docx import Document

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DOCS_CONFIG = [
    {
        "docx": os.path.join(BASE_DIR, "A1-A2.docx"),
        "html": os.path.join(BASE_DIR, "A1-A2.html"),
        "title": "Inglés Básico A1-A2",
        "subtitle": "Guía completa de estudio basada en el método comunicativo de Kale Anders",
        "badge": "Nivel Básico A1-A2",
        "badge_color": "#059669",
        "accent_bg": "#ecfdf5",
        "file_code": "a1-a2"
    },
    {
        "docx": os.path.join(BASE_DIR, "B1-B2.docx"),
        "html": os.path.join(BASE_DIR, "B1-B2.html"),
        "title": "Inglés Intermedio B1-B2",
        "subtitle": "Guía completa de estudio basada en el método comunicativo de Kale Anders",
        "badge": "Nivel Intermedio B1-B2",
        "badge_color": "#2563eb",
        "accent_bg": "#eff6ff",
        "file_code": "b1-b2"
    },
    {
        "docx": os.path.join(BASE_DIR, "C1-C2.docx"),
        "html": os.path.join(BASE_DIR, "C1-C2.html"),
        "title": "Inglés Avanzado C1-C2",
        "subtitle": "Guía de maestría y fluidez nativa basada en el método comunicativo de Kale Anders",
        "badge": "Nivel Avanzado C1-C2",
        "badge_color": "#7c3aed",
        "accent_bg": "#f5f3ff",
        "file_code": "c1-c2"
    }
]


def slugify(text):
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    return text[:50]


def is_true_chapter(text):
    """Verifica si el texto es un encabezado de capítulo principal (ej. 1. GRAMATICA AVANZADA)."""
    return bool(re.match(r"^\d+\.\s+([A-ZÁÉÍÓÚÑ\s\(\)/-]+)$", text))


def format_run(run):
    text = html.escape(run.text)
    if not text:
        return ""
    if run.font.name == "Consolas":
        text = f"<code>{text}</code>"
    if run.bold and run.italic:
        text = f"<strong><em>{text}</em></strong>"
    elif run.bold:
        text = f"<strong>{text}</strong>"
    elif run.italic:
        text = f"<em>{text}</em>"
    return text


def paragraph_to_html(p):
    return "".join(format_run(r) for r in p.runs).strip()


def build_html_for_doc(config):
    docx_path = config["docx"]
    html_path = config["html"]
    print(f"📖 Procesando {os.path.basename(docx_path)}...")

    doc = Document(docx_path)
    paragraphs = doc.paragraphs

    toc = []
    content_blocks = []
    
    in_bullet_list = False
    bullet_items = []

    in_ordered_list = False
    ordered_items = []

    def flush_lists():
        nonlocal in_bullet_list, bullet_items, in_ordered_list, ordered_items
        if in_bullet_list and bullet_items:
            content_blocks.append(f"<ul class=\"doc-list\">{''.join(bullet_items)}</ul>")
            bullet_items = []
            in_bullet_list = False
        if in_ordered_list and ordered_items:
            content_blocks.append(f"<ol class=\"doc-ordered-list\">{''.join(ordered_items)}</ol>")
            ordered_items = []
            in_ordered_list = False

    is_first_h1 = True
    cover_skipped = False

    for i, p in enumerate(paragraphs):
        raw_text = p.text.strip()
        if not raw_text:
            flush_lists()
            continue

        style_name = p.style.name

        # Saltar primeros párrafos de portada redundante
        if not cover_skipped and style_name == "Normal" and i < 4:
            continue
        cover_skipped = True

        p_html = paragraph_to_html(p)

        # 1. Heading 1
        if style_name == "Heading 1":
            if is_true_chapter(raw_text):
                flush_lists()
                h1_id = f"cap-{slugify(raw_text)}"
                toc.append({"level": 1, "id": h1_id, "text": raw_text})
                border_cls = "" if is_first_h1 else "chapter-separator"
                is_first_h1 = False
                content_blocks.append(f"""
                <div class="chapter-anchor {border_cls}" id="{h1_id}"></div>
                <h2 class="doc-h1">
                  <span class="chapter-tag">CAPÍTULO</span>
                  <span>{p_html}</span>
                </h2>""")
            else:
                # Es un paso numerado que fue marcado erróneamente como H1
                in_ordered_list = True
                clean_step = re.sub(r"^\d+\.\s*", "", p_html)
                ordered_items.append(f"<li>{clean_step}</li>")
        
        # 2. Heading 2
        elif style_name == "Heading 2":
            flush_lists()
            h2_id = f"sec-{slugify(raw_text)}"
            toc.append({"level": 2, "id": h2_id, "text": raw_text})
            content_blocks.append(f"""
            <div class="section-anchor" id="{h2_id}"></div>
            <h3 class="doc-h2">{p_html}</h3>""")

        # 3. Heading 3
        elif style_name == "Heading 3":
            flush_lists()
            content_blocks.append(f"<h4 class=\"doc-h3\">{p_html}</h4>")

        # 4. Book Note (Notas pedagógicas de Kale Anders)
        elif style_name == "Book Note":
            flush_lists()
            content_blocks.append(f"""
            <div class="callout-note">
              <div class="callout-icon">💡</div>
              <div class="callout-body">{p_html}</div>
            </div>""")

        # 5. Ejercicios Didácticos
        elif style_name == "Exercise":
            flush_lists()
            if "Respuesta sugerida:" in raw_text or "Correcta:" in raw_text:
                parts = raw_text.split(":", 1)
                label = parts[0] + ":"
                ans = parts[1].strip() if len(parts) > 1 else ""
                content_blocks.append(f"""
                <div class="exercise-answer-box">
                  <span class="ans-label">{html.escape(label)}</span>
                  <button class="btn-reveal" onclick="toggleAnswer(this)" title="Haz clic para ver la solución">👁️ Revelar solución</button>
                  <span class="ans-text hidden-answer">{html.escape(ans)}</span>
                </div>""")
            elif " / " in raw_text and ("   " in raw_text or raw_text.startswith("   ")):
                opts = [o.strip() for o in raw_text.split("/") if o.strip()]
                opt_badges = "".join(f"<span class=\"opt-badge\" onclick=\"selectOption(this)\">{html.escape(o)}</span>" for o in opts)
                content_blocks.append(f"<div class=\"exercise-options\">{opt_badges}</div>")
            elif raw_text in ["Completa:", "Encierra la correcta:"]:
                content_blocks.append(f"<div class=\"exercise-subheading\"><strong>{p_html}</strong></div>")
            else:
                content_blocks.append(f"<div class=\"exercise-question\">{p_html}</div>")

        # 6. Viñetas
        elif style_name == "List Bullet":
            if in_ordered_list:
                flush_lists()
            in_bullet_list = True
            bullet_items.append(f"<li>{p_html}</li>")

        # 7. Normal
        else:
            if re.match(r"^\d+\.\s+[A-Z]", raw_text) and not is_true_chapter(raw_text):
                in_ordered_list = True
                clean_step = re.sub(r"^\d+\.\s*", "", p_html)
                ordered_items.append(f"<li>{clean_step}</li>")
            else:
                flush_lists()
                if raw_text.startswith("- "):
                    clean_text = raw_text[2:]
                    content_blocks.append(f"<div class=\"bilingual-en\"><strong>{html.escape(clean_text)}</strong></div>")
                elif i > 0 and paragraphs[i-1].text.strip().startswith("- "):
                    content_blocks.append(f"<div class=\"bilingual-es\">{p_html}</div>")
                else:
                    content_blocks.append(f"<p class=\"doc-p\">{p_html}</p>")

    flush_lists()

    # Construir ToC
    toc_html_items = []
    for item in toc:
        if item["level"] == 1:
            toc_html_items.append(f"""
            <li class="toc-item-h1">
              <a href="#{item['id']}" onclick="closeMobileToc()">{html.escape(item['text'])}</a>
            </li>""")
        else:
            toc_html_items.append(f"""
            <li class="toc-item-h2">
              <a href="#{item['id']}" onclick="closeMobileToc()">&bull; {html.escape(item['text'])}</a>
            </li>""")
    toc_html = "".join(toc_html_items)

    main_content_html = "\n".join(content_blocks)

    nav_links = [
        ("A1-A2.html", "a1-a2", "Nivel A1-A2"),
        ("B1-B2.html", "b1-b2", "Nivel B1-B2"),
        ("C1-C2.html", "c1-c2", "Nivel C1-C2"),
        ("oxford_dictionary_book_a1.html", "oxford", "Diccionario Oxford 3000"),
        ("index.html", "app", "🏠 App Principal")
    ]
    tabs_html = ""
    for url, code, label in nav_links:
        active_cls = "nav-tab-active" if code == config["file_code"] else ""
        tabs_html += f"""<a href="{url}" class="nav-tab {active_cls}">{label}</a>\n"""

    full_html = f"""<!DOCTYPE html>
<html lang="es" class="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{config['title']} - Guía Didáctica | Kale Anders</title>
  <style>
    :root {{
      --primary: {config['badge_color']};
      --primary-light: {config['accent_bg']};
      --bg: #ffffff;
      --bg-alt: #f8fafc;
      --text: #1e293b;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --sidebar-bg: #f8fafc;
      --card-bg: #ffffff;
      --shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      --font-main: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      --font-title: "Cambria", Georgia, serif;
    }}

    .dark {{
      --primary: {config['badge_color']};
      --primary-light: #1e1b4b;
      --bg: #0f172a;
      --bg-alt: #1e293b;
      --text: #f1f5f9;
      --text-muted: #94a3b8;
      --border: #334155;
      --sidebar-bg: #0b1120;
      --card-bg: #1e293b;
      --shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    }}

    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }}

    html {{
      scroll-behavior: smooth;
    }}

    body {{
      font-family: var(--font-main);
      background-color: var(--bg-alt);
      color: var(--text);
      line-height: 1.7;
      font-size: 15px;
      transition: background-color 0.2s, color 0.2s;
    }}

    /* Barra Superior Fija */
    .top-header {{
      position: sticky;
      top: 0;
      z-index: 100;
      background: var(--bg);
      border-bottom: 1px solid var(--border);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 24px;
      gap: 16px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.03);
    }}

    .top-header-left {{
      display: flex;
      align-items: center;
      gap: 12px;
    }}

    .btn-return-app {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--primary);
      color: #ffffff;
      border: 1px solid var(--primary);
      padding: 6px 14px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 13px;
      text-decoration: none;
      transition: all 0.2s;
      white-space: nowrap;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }}

    .btn-return-app:hover {{
      opacity: 0.92;
      transform: translateX(-2px);
      color: #ffffff;
    }}

    .btn-toc-toggle {{
      background: none;
      border: 1px solid var(--border);
      color: var(--text);
      padding: 6px 12px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 6px;
    }}

    .brand-title {{
      font-weight: 800;
      font-size: 16px;
      color: var(--primary);
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
    }}

    .nav-tabs-bar {{
      display: flex;
      gap: 6px;
      overflow-x: auto;
      padding: 4px 0;
    }}

    .nav-tab {{
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-muted);
      padding: 6px 14px;
      border-radius: 8px;
      white-space: nowrap;
      transition: all 0.15s;
    }}

    .nav-tab:hover {{
      color: var(--text);
      background: var(--bg-alt);
    }}

    .nav-tab-active {{
      background: var(--primary) !important;
      color: #ffffff !important;
    }}

    .top-actions {{
      display: flex;
      align-items: center;
      gap: 10px;
    }}

    .btn-action {{
      border: 1px solid var(--border);
      background: var(--bg);
      color: var(--text);
      padding: 7px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: background 0.15s;
    }}

    .btn-action:hover {{
      background: var(--bg-alt);
    }}

    .btn-print {{
      background: var(--primary);
      color: white;
      border: none;
    }}

    .btn-print:hover {{
      opacity: 0.9;
    }}

    /* Layout Principal: Sidebar + Contenido */
    .app-layout {{
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      min-height: calc(100vh - 60px);
    }}

    /* Barra Lateral de Contenidos (ToC) */
    .sidebar-toc {{
      width: 330px;
      flex-shrink: 0;
      background: var(--sidebar-bg);
      border-right: 1px solid var(--border);
      padding: 24px 18px;
      position: sticky;
      top: 60px;
      height: calc(100vh - 60px);
      overflow-y: auto;
    }}

    .sidebar-title {{
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 800;
      color: var(--text-muted);
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }}

    .toc-search {{
      width: 100%;
      padding: 8px 12px;
      border-radius: 8px;
      border: 1px solid var(--border);
      background: var(--bg);
      color: var(--text);
      font-size: 12.5px;
      margin-bottom: 14px;
      outline: none;
    }}

    .toc-list {{
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }}

    .toc-item-h1 {{
      margin-top: 10px;
    }}

    .toc-item-h1 a {{
      display: block;
      font-weight: 700;
      font-size: 13px;
      color: var(--text);
      text-decoration: none;
      padding: 6px 10px;
      border-radius: 6px;
      transition: background 0.15s;
    }}

    .toc-item-h2 a {{
      display: block;
      font-size: 12.5px;
      color: var(--text-muted);
      text-decoration: none;
      padding: 4px 10px 4px 18px;
      border-radius: 6px;
      transition: all 0.15s;
    }}

    .toc-item-h1 a:hover, .toc-item-h2 a:hover {{
      background: var(--border);
      color: var(--text);
    }}

    /* Contenedor del Documento Principal */
    .doc-container {{
      flex: 1;
      min-width: 0;
      padding: 40px 60px 80px 60px;
      background: var(--bg);
    }}

    .doc-card {{
      max-width: 860px;
      margin: 0 auto;
    }}

    /* Portada de Documento */
    .doc-hero {{
      text-align: center;
      padding: 30px 20px 45px 20px;
      border-bottom: 2px solid var(--border);
      margin-bottom: 40px;
    }}

    .hero-badge {{
      display: inline-block;
      background: var(--primary-light);
      color: var(--primary);
      font-size: 12px;
      font-weight: 700;
      padding: 6px 16px;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 16px;
    }}

    .hero-title {{
      font-family: var(--font-title);
      font-size: 38px;
      font-weight: 800;
      color: var(--text);
      margin-bottom: 12px;
      line-height: 1.2;
    }}

    .hero-subtitle {{
      font-size: 16px;
      color: var(--text-muted);
      max-width: 620px;
      margin: 0 auto;
    }}

    /* Jerarquía Tipográfica */
    .chapter-anchor, .section-anchor {{
      scroll-margin-top: 80px;
    }}

    .chapter-separator {{
      margin-top: 60px;
      padding-top: 30px;
      border-top: 2px solid var(--border);
    }}

    .doc-h1 {{
      font-family: var(--font-title);
      font-size: 26px;
      font-weight: 800;
      color: var(--primary);
      margin-top: 20px;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1.5px solid var(--border);
      display: flex;
      flex-direction: column;
      gap: 4px;
    }}

    .chapter-tag {{
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 800;
      color: var(--text-muted);
      font-family: var(--font-main);
    }}

    .doc-h2 {{
      font-family: var(--font-title);
      font-size: 20px;
      font-weight: 700;
      color: var(--text);
      margin-top: 34px;
      margin-bottom: 12px;
    }}

    .doc-h3 {{
      font-size: 13.5px;
      font-weight: 800;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-top: 22px;
      margin-bottom: 8px;
    }}

    .doc-p {{
      margin-bottom: 12px;
      color: var(--text);
    }}

    /* Listas con viñetas */
    .doc-list {{
      margin: 12px 0 18px 24px;
    }}

    .doc-list li {{
      margin-bottom: 6px;
    }}

    /* Listas ordenadas / Pasos del método */
    .doc-ordered-list {{
      margin: 14px 0 22px 24px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }}

    .doc-ordered-list li {{
      background: var(--bg-alt);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 10px 14px;
      font-weight: 500;
    }}

    /* Ejemplos Bilingües */
    .bilingual-en {{
      color: var(--text);
      font-size: 15.5px;
      margin-top: 10px;
      padding: 6px 12px;
      background: var(--bg-alt);
      border-left: 3px solid var(--primary);
      border-radius: 0 6px 6px 0;
    }}

    .bilingual-es {{
      color: var(--text-muted);
      font-size: 13.5px;
      margin-bottom: 12px;
      padding-left: 12px;
      font-style: italic;
    }}

    /* Cajas Callout / Book Note */
    .callout-note {{
      background: var(--primary-light);
      border-left: 4px solid var(--primary);
      border-radius: 8px;
      padding: 14px 18px;
      margin: 18px 0;
      display: flex;
      gap: 12px;
      font-style: italic;
      color: var(--text);
    }}

    .callout-icon {{
      font-size: 20px;
      line-height: 1;
    }}

    .callout-body {{
      flex: 1;
    }}

    /* Ejercicios Guiados */
    .exercise-subheading {{
      font-weight: 700;
      margin-top: 16px;
      margin-bottom: 6px;
      color: var(--primary);
    }}

    .exercise-question {{
      margin-top: 12px;
      font-weight: 600;
      color: var(--text);
    }}

    .exercise-options {{
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 8px 0 8px 18px;
    }}

    .opt-badge {{
      background: var(--bg-alt);
      border: 1px solid var(--border);
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12.5px;
      font-weight: 600;
      color: var(--text);
      cursor: pointer;
      user-select: none;
      transition: all 0.15s;
    }}

    .opt-badge:hover {{
      border-color: var(--primary);
      background: var(--primary-light);
      color: var(--primary);
    }}

    .opt-badge.selected {{
      background: var(--primary);
      color: #ffffff;
      border-color: var(--primary);
    }}

    .exercise-answer-box {{
      margin: 6px 0 16px 18px;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }}

    .ans-label {{
      font-weight: 700;
      color: var(--text-muted);
    }}

    .btn-reveal {{
      background: var(--bg-alt);
      border: 1px solid var(--border);
      color: var(--primary);
      padding: 3px 10px;
      border-radius: 6px;
      font-size: 11.5px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s;
    }}

    .btn-reveal:hover {{
      background: var(--primary);
      color: #ffffff;
    }}

    .ans-text {{
      font-style: italic;
      font-weight: 700;
      color: #059669;
      background: #ecfdf5;
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid #a7f3d0;
    }}

    .hidden-answer {{
      display: none;
    }}

    /* Inline Code */
    code {{
      font-family: Consolas, Monaco, monospace;
      background: var(--bg-alt);
      border: 1px solid var(--border);
      padding: 1px 5px;
      border-radius: 4px;
      font-size: 0.9em;
      color: var(--primary);
    }}

    /* Botón flotante para subir */
    .btn-back-to-top {{
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--primary);
      color: white;
      border: none;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      cursor: pointer;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s, transform 0.2s;
      z-index: 90;
    }}

    .btn-back-to-top.visible {{
      opacity: 1;
      pointer-events: auto;
    }}

    .btn-back-to-top:hover {{
      transform: translateY(-3px);
    }}

    /* Drawer de ToC para Pantallas Pequeñas */
    @media (max-width: 900px) {{
      .sidebar-toc {{
        display: none;
        position: fixed;
        left: 0;
        top: 60px;
        bottom: 0;
        z-index: 99;
        width: 300px;
        box-shadow: 2px 0 15px rgba(0,0,0,0.2);
      }}

      .sidebar-toc.open {{
        display: block;
      }}

      .doc-container {{
        padding: 24px 20px 60px 20px;
      }}

      .hero-title {{
        font-size: 28px;
      }}
    }}

    /* Impresión / Guardar en PDF */
    @media print {{
      body {{
        background: white;
        color: black;
        font-size: 10.5pt;
      }}

      .top-header, .sidebar-toc, .btn-reveal, .btn-back-to-top {{
        display: none !important;
      }}

      .doc-container {{
        padding: 0;
      }}

      .chapter-anchor {{
        page-break-before: always;
      }}

      .hidden-answer {{
        display: inline !important;
      }}

      .bilingual-en {{
        background: none;
        border-left: 2pt solid black;
      }}

      @page {{
        margin: 1.5cm 1.2cm 1.5cm 1.2cm;
      }}
    }}
  </style>
</head>
<body>

  <!-- Barra Superior Fija -->
  <header class="top-header">
    <div class="top-header-left">
      <a href="index.html" class="btn-return-app" title="Regresar a la aplicación principal LexiCore">
        <span>←</span> <span>Volver a LexiCore</span>
      </a>
      <button class="btn-toc-toggle" onclick="toggleMobileToc()" title="Alternar índice">
        📑 <span>Índice</span>
      </button>
      <a href="index.html" class="brand-title">
        <span>⚡ Kale Anders &bull; {config['title']}</span>
      </a>
    </div>

    <!-- Pestañas de Navegación Rápida -->
    <div class="nav-tabs-bar">
      {tabs_html}
    </div>

    <!-- Acciones -->
    <div class="top-actions">
      <button class="btn-action" onclick="toggleTheme()" title="Cambiar tema">
        🌓 <span id="theme-btn-text">Tema</span>
      </button>
      <button class="btn-action btn-print" onclick="window.print()" title="Imprimir o guardar PDF">
        🖨️ <span>Imprimir / PDF</span>
      </button>
    </div>
  </header>

  <!-- Layout Principal -->
  <div class="app-layout">
    
    <!-- Barra Lateral de Contenidos -->
    <aside class="sidebar-toc" id="sidebar-toc">
      <div style="padding-bottom: 12px; margin-bottom: 12px; border-bottom: 1px solid var(--border);">
        <a href="index.html" class="btn-return-app" style="width: 100%; justify-content: center; box-sizing: border-box;">
          ← Volver a la App Principal
        </a>
      </div>
      <div class="sidebar-title">
        <span>Índice del Módulo</span>
        <span style="font-size: 10px; background: var(--primary); color: white; padding: 2px 6px; border-radius: 4px;">{len(toc)} Secciones</span>
      </div>
      <input type="text" class="toc-search" placeholder="Filtrar temas..." oninput="filterToc(this.value)">
      <ul class="toc-list" id="toc-list">
        {toc_html}
      </ul>
    </aside>

    <!-- Contenido Principal -->
    <main class="doc-container">
      <div class="doc-card">
        
        <!-- Portada -->
        <div class="doc-hero">
          <span class="hero-badge">{config['badge']}</span>
          <h1 class="hero-title">{config['title']}</h1>
          <p class="hero-subtitle">{config['subtitle']}</p>
          <div style="margin-top: 18px; display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
            <a href="index.html" class="btn-return-app" style="padding: 9px 20px; font-size: 14px;">
              ← Regresar a LexiCore App
            </a>
            <button class="btn-action btn-print" onclick="window.print()" style="padding: 9px 20px; font-size: 14px;">
              🖨️ Imprimir / Guardar PDF
            </button>
          </div>
        </div>

        <!-- Bloques del Documento -->
        <div class="doc-content">
          {main_content_html}
        </div>

        <!-- Navegación final del documento -->
        <div style="margin-top: 50px; padding: 24px; border-radius: 14px; background: var(--bg-alt); border: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
          <div>
            <h4 style="font-size: 16px; font-weight: 800; color: var(--text);">¿Listo para continuar tu estudio?</h4>
            <p style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">Practica tu vocabulario en el Dashboard con Flashcards SRS, Quizzes o explora otros niveles.</p>
          </div>
          <a href="index.html" class="btn-return-app" style="padding: 10px 22px; font-size: 14px;">
            ← Volver a la App Principal
          </a>
        </div>

      </div>
    </main>

  </div>

  <!-- Botón Volver Arriba -->
  <button class="btn-back-to-top" id="btn-back-to-top" onclick="window.scrollTo({{top: 0, behavior: 'smooth'}})" title="Subir al inicio">
    ↑
  </button>

  <script>
    // Inicializar Tema
    function initTheme() {{
      const saved = localStorage.getItem('lexicore_theme') || 'light';
      if (saved === 'dark') {{
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      }} else {{
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }}
    }}

    function toggleTheme() {{
      const isDark = document.documentElement.classList.toggle('dark');
      document.documentElement.classList.toggle('light', !isDark);
      localStorage.setItem('lexicore_theme', isDark ? 'dark' : 'light');
    }}

    // Soluciones en Ejercicios
    function toggleAnswer(btn) {{
      const ansSpan = btn.nextElementSibling;
      if (!ansSpan) return;
      const isHidden = ansSpan.classList.contains('hidden-answer');
      if (isHidden) {{
        ansSpan.classList.remove('hidden-answer');
        btn.textContent = '🙈 Ocultar solución';
      }} else {{
        ansSpan.classList.add('hidden-answer');
        btn.textContent = '👁️ Revelar solución';
      }}
    }}

    // Selección interactiva de opciones
    function selectOption(el) {{
      const parent = el.parentElement;
      parent.querySelectorAll('.opt-badge').forEach(b => b.classList.remove('selected'));
      el.classList.add('selected');
    }}

    // ToC en Móviles
    function toggleMobileToc() {{
      const sidebar = document.getElementById('sidebar-toc');
      if (sidebar) sidebar.classList.toggle('open');
    }}

    function closeMobileToc() {{
      const sidebar = document.getElementById('sidebar-toc');
      if (sidebar && window.innerWidth <= 900) {{
        sidebar.classList.remove('open');
      }}
    }}

    // Filtrar temas en el ToC
    function filterToc(query) {{
      const q = query.toLowerCase().trim();
      document.querySelectorAll('#toc-list li').forEach(li => {{
        const text = li.textContent.toLowerCase();
        li.style.display = (!q || text.includes(q)) ? 'block' : 'none';
      }});
    }}

    // Botón Volver Arriba
    window.addEventListener('scroll', () => {{
      const btn = document.getElementById('btn-back-to-top');
      if (window.scrollY > 400) {{
        btn.classList.add('visible');
      }} else {{
        btn.classList.remove('visible');
      }}
    }});

    initTheme();
  </script>
</body>
</html>
"""

    with open(html_path, "w", encoding="utf-8") as f:
        f.write(full_html)
    
    size_kb = os.path.getsize(html_path) / 1024
    print(f"✅ Generado {os.path.basename(html_path)} ({size_kb:.1f} KB)")


def main():
    print("=" * 60)
    print("🚀 CONVERSIÓN DE DOCUMENTOS KALE ANDERS A HTML")
    print("=" * 60)
    for cfg in DOCS_CONFIG:
        build_html_for_doc(cfg)
    print("=" * 60)
    print("🎉 ¡TODOS LOS ARCHIVOS HTML HAN SIDO CREADOS CON ÉXITO!")
    print("=" * 60)


if __name__ == "__main__":
    main()
