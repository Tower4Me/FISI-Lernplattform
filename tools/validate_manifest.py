#!/usr/bin/env python3
"""Validiert data/manifest.json gegen den tatsaechlichen Datei-Bestand.

Prueft je gelisteter Einheit:
  - HTML-Datei existiert (module/<modul>/<einheit>.html)
  - <section id="merksatz"> ist vorhanden
  - falls ein quiz-Feld gesetzt ist: die JSON-Datei existiert und ist
    valides JSON mit einer nicht-leeren "questions"-Liste

Meldet ausserdem verwaiste HTML-Dateien unter module/, die im Manifest
fehlen.

Exit-Code 0, wenn alles sauber ist, sonst 1.
"""

import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
MODULE_DIR = REPO_ROOT / "module"
MANIFEST_PATH = REPO_ROOT / "data" / "manifest.json"

MERKSATZ_RE = re.compile(r'<section[^>]*\bid="merksatz"')


def main():
    errors = []

    try:
        manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        print(f"FEHLER: data/manifest.json ist kein valides JSON: {e}")
        return 1

    listed_files = set()

    for mod in manifest["modules"]:
        mod_slug = mod["slug"]
        for unit in mod["units"]:
            unit_slug = unit["slug"]
            label = f"{mod_slug}/{unit_slug}"

            html_path = MODULE_DIR / mod_slug / f"{unit_slug}.html"
            listed_files.add(html_path.resolve())

            if not html_path.exists():
                errors.append(f"FEHLENDE HTML: {label} -> {html_path.relative_to(REPO_ROOT)}")
                continue

            html_text = html_path.read_text(encoding="utf-8")
            if not MERKSATZ_RE.search(html_text):
                errors.append(f"KEIN MERKSATZ: {label} -> section#merksatz fehlt")

            quiz_rel = unit.get("quiz")
            if quiz_rel:
                quiz_path = REPO_ROOT / quiz_rel
                if not quiz_path.exists():
                    errors.append(f"FEHLENDE QUIZ-JSON: {label} -> {quiz_rel}")
                    continue
                try:
                    quiz_data = json.loads(quiz_path.read_text(encoding="utf-8"))
                except json.JSONDecodeError as e:
                    errors.append(f"UNGUELTIGE QUIZ-JSON: {label} -> {quiz_rel} ({e})")
                    continue
                questions = quiz_data.get("questions")
                if not questions:
                    errors.append(f"LEERE QUIZ-JSON: {label} -> {quiz_rel} hat keine questions")

    all_html_files = {p.resolve() for p in MODULE_DIR.rglob("*.html")}
    orphans = sorted(all_html_files - listed_files)
    for orphan in orphans:
        errors.append(f"VERWAISTE DATEI: {orphan.relative_to(REPO_ROOT)} nicht im Manifest gelistet")

    if errors:
        print(f"{len(errors)} Problem(e) gefunden:\n")
        for e in errors:
            print(f"  - {e}")
        return 1

    total_units = sum(len(mod["units"]) for mod in manifest["modules"])
    print(f"OK — {total_units} Einheiten im Manifest geprueft, alles konsistent.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
