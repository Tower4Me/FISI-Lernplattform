#!/usr/bin/env python3
"""Baut module/<modul>/<einheit>.html aus Manifest, Inhalt und Vorlagen.

Eingaben:
  data/manifest.json          Titel, Modulname/-kurzname, Pruefungsteile,
                              optionale Tool-Skripte ("scripts") je Einheit
  content/<modul>/<slug>.html nur der Inhalt von <main class="site-main">
  templates/page.html         Basisvorlage (Kopf, Brotkrumen, Titel, Footer)
  templates/scripts-<typ>.html Script-Tags je Seitentyp:
      standard   Inhalt hat data-quiz-src (quiz-engine.js)
      simulator  Inhalt hat id="exam-root" (exam-engine.js)
      ohne-quiz  sonst

Deterministisch: gleiche Eingabe ergibt byte-identische Ausgabe (UTF-8, LF).
Exit-Code 0 bei Erfolg, sonst 1.
"""

import html
import json
import sys
from pathlib import Path
from string import Template

REPO_ROOT = Path(__file__).resolve().parent.parent
MANIFEST_PATH = REPO_ROOT / "data" / "manifest.json"
CONTENT_DIR = REPO_ROOT / "content"
MODULE_DIR = REPO_ROOT / "module"
TEMPLATE_DIR = REPO_ROOT / "templates"


def read(path):
    # Textmodus: CRLF aus einem Windows-Checkout wird zu LF.
    return path.read_text(encoding="utf-8")


def page_type(content):
    if "data-quiz-src" in content:
        return "standard"
    if 'id="exam-root"' in content:
        return "simulator"
    return "ohne-quiz"


def render(page, scripts, module, unit, content):
    esc = lambda s: html.escape(s, quote=False)
    badges = "\n".join(
        f'        <span class="badge badge--{e}">{e.upper()}</span>'
        for e in unit["exams"]
    )
    tools = "".join(
        f'\n  <script src="../../assets/{s}"></script>\n'
        for s in unit.get("scripts", [])
    )
    script_block = scripts[page_type(content)].substitute(tools=tools)
    return page.substitute(
        title=esc(f'{module["short"]}: {unit["name"]}'),
        module_slug=module["slug"],
        module_name=esc(module["name"]),
        unit_name=esc(unit["name"]),
        badges=badges,
        content=content.strip("\n"),
        scripts=script_block.rstrip("\n"),
    )


def main():
    manifest = json.loads(read(MANIFEST_PATH))
    page = Template(read(TEMPLATE_DIR / "page.html"))
    scripts = {
        t: Template(read(TEMPLATE_DIR / f"scripts-{t}.html"))
        for t in ("standard", "simulator", "ohne-quiz")
    }

    built = skipped = 0
    for module in manifest["modules"]:
        for unit in module["units"]:
            rel = f'{module["slug"]}/{unit["slug"]}.html'
            src = CONTENT_DIR / rel
            if not src.exists():
                # ponytail: Uebergang waehrend der Umstellung; nach Phase 3 Fehler.
                skipped += 1
                continue
            out = render(page, scripts, module, unit, read(src))
            dest = MODULE_DIR / rel
            dest.parent.mkdir(parents=True, exist_ok=True)
            with open(dest, "w", encoding="utf-8", newline="\n") as f:
                f.write(out)
            built += 1

    print(f"{built} Seiten gebaut, {skipped} ohne content/ uebersprungen.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
