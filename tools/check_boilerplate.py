#!/usr/bin/env python3
"""Prueft alle Einheiten unter module/**/*.html auf Konsistenz mit dem
Referenz-Footer aus templates/unit-template.html sowie auf die je nach
Seitentyp erwartete Script-Tag- und Anker-Struktur. Rein lesend, aendert
nichts.

Nicht alle 193 Dateien haben dieselbe Struktur -- das Modul "pruefung"
enthaelt bewusst andere Seitentypen (siehe AUFTRAG.md Phase 4). Diese
Unterschiede werden mechanisch erkannt (an vorhandenen Markup-Merkmalen,
nicht an hartkodierten Dateinamen), nicht als Fehler gewertet:

  - Standard-Einheit (hat ein data-quiz-src-Attribut): erwartet
    quiz-engine.js sowie die fuenf Standard-Anker einstieg/konzept/
    praxis/merksatz/quiz in dieser Reihenfolge (CONVENTIONS.md
    Abschnitt 2).
  - Seite ohne Quiz (kein data-quiz-src, z. B. module/pruefung/
    ap-ablauf.html): kein quiz-engine.js erwartet. Nur der
    Merksatz-Anker ist Pflicht -- AUFTRAG.md Abschnitt 2 verlangt dessen
    Markup unabhaengig vom Rest der Einheit.
  - Simulator-Startseite (hat ein Element mit id="exam-root", die vier
    module/pruefung/simulation-*.html): zusaetzlich exam-engine.js
    erwartet.

Unabhaengig vom Seitentyp immer geprueft:
  - Die vier Kern-Skripte manifest-loader.js, theme.js, search.js,
    next-unit.js muessen vorhanden sein (muessen VOR den jeweiligen
    Verbrauchern eingebunden sein, das prueft dieses Skript nicht extra --
    das wuerde jede der vier bei Fehlen ohnehin sofort sichtbar brechen).
  - <footer class="site-footer">...</footer> muss inhaltlich exakt dem
    Referenz-Footer aus templates/unit-template.html entsprechen.
  - Ein <link rel="icon" ...> (Favicon) muss vorhanden sein.

Exit-Code 0, wenn alles sauber ist, sonst 1.
"""

import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
MODULE_DIR = REPO_ROOT / "module"
TEMPLATE_PATH = REPO_ROOT / "templates" / "unit-template.html"

FOOTER_RE = re.compile(r'<footer class="site-footer">([\s\S]*?)</footer>')
SECTION_ID_RE = re.compile(r'<section[^>]*\bid="([a-z]+)"')
SCRIPT_SRC_RE = re.compile(r'<script src="[^"]*assets/([\w.-]+\.js)"')

STANDARD_ANCHORS = ["einstieg", "konzept", "praxis", "merksatz", "quiz"]
CORE_SCRIPTS = {"manifest-loader.js", "theme.js", "search.js", "next-unit.js"}


def main():
    errors = []

    if not TEMPLATE_PATH.exists():
        print("FEHLER: " + str(TEMPLATE_PATH) + " existiert nicht.")
        return 1
    template_html = TEMPLATE_PATH.read_text(encoding="utf-8")
    fm = FOOTER_RE.search(template_html)
    if not fm:
        print(
            "FEHLER: templates/unit-template.html hat keinen "
            '<footer class="site-footer">-Block.'
        )
        return 1
    reference_footer = fm.group(1).strip()

    files = sorted(MODULE_DIR.glob("**/*.html"))
    for path in files:
        rel = path.relative_to(REPO_ROOT).as_posix()
        html = path.read_text(encoding="utf-8")

        m = FOOTER_RE.search(html)
        if not m:
            errors.append(rel + ': kein <footer class="site-footer">-Block')
        elif m.group(1).strip() != reference_footer:
            errors.append(rel + ": Footer weicht vom Referenz-Footer ab")

        if 'rel="icon"' not in html:
            errors.append(rel + ": kein Favicon-<link>")

        scripts = set(SCRIPT_SRC_RE.findall(html))
        missing_core = CORE_SCRIPTS - scripts
        if missing_core:
            errors.append(
                rel + ": fehlende Kern-Skripte: " + ", ".join(sorted(missing_core))
            )

        has_quiz_src = "data-quiz-src" in html
        has_quiz_engine = "quiz-engine.js" in scripts
        if has_quiz_src and not has_quiz_engine:
            errors.append(rel + ": hat data-quiz-src, aber kein quiz-engine.js")
        if has_quiz_engine and not has_quiz_src:
            errors.append(rel + ": hat quiz-engine.js, aber kein data-quiz-src")

        has_exam_root = 'id="exam-root"' in html
        has_exam_engine = "exam-engine.js" in scripts
        if has_exam_root and not has_exam_engine:
            errors.append(rel + ': hat id="exam-root", aber kein exam-engine.js')
        if has_exam_engine and not has_exam_root:
            errors.append(rel + ': hat exam-engine.js, aber kein id="exam-root"')

        anchors = SECTION_ID_RE.findall(html)
        if has_quiz_src:
            if anchors != STANDARD_ANCHORS:
                errors.append(
                    rel
                    + ": Anker "
                    + str(anchors)
                    + " entsprechen nicht der Standard-Reihenfolge "
                    + str(STANDARD_ANCHORS)
                )
        elif "merksatz" not in anchors:
            errors.append(rel + ': kein <section id="merksatz">')

    if errors:
        for e in errors:
            print(e)
        print("FEHLER: {} Problem(e) in {} geprueften Dateien.".format(len(errors), len(files)))
        return 1

    print("OK — {} Einheiten geprueft, Boilerplate konsistent.".format(len(files)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
