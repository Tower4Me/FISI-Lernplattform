#!/usr/bin/env python3
"""Prueft alle internen href-Verlinkungen auf module/-Seiten.

Findet zwei Fehlerklassen:
  - toter Link: href zeigt auf eine HTML-Datei, die nicht existiert.
  - verwaiste Einheit: Datei existiert, ist aber nicht im Manifest gelistet
    (nur relevant fuer Ziel-Dateien direkt unterhalb von module/<modul>/).

Exit-Code 0, wenn alles sauber ist, sonst 1.
"""

import json
import re
import sys
from pathlib import Path
from urllib.parse import urlsplit

REPO_ROOT = Path(__file__).resolve().parent.parent
MODULE_DIR = REPO_ROOT / "module"
MANIFEST_PATH = REPO_ROOT / "data" / "manifest.json"

HREF_RE = re.compile(r'href="([^"]+)"')
# Entfernt <code>/<pre>-Blockinhalte vor der href-Suche: Lehrinhalte zeigen
# darin oft Link-Syntax als Beispiel (z. B. <code>&lt;a href="..."&gt;</code>
# in module/software-os-web/html-css-grundlagen.html), was sonst als toter
# Link "..." fehlerhaft erkannt wird.
CODE_PRE_RE = re.compile(r"<(code|pre)\b[^>]*>.*?</\1>", re.IGNORECASE | re.DOTALL)


def load_manifest_units():
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    units = set()
    for mod in manifest["modules"]:
        for unit in mod["units"]:
            units.add((mod["slug"], unit["slug"]))
    return units


def is_external_or_skippable(href):
    if href.startswith(("http://", "https://", "mailto:", "#")):
        return True
    return False


def main():
    manifest_units = load_manifest_units()
    errors = []

    html_files = sorted(MODULE_DIR.rglob("*.html"))
    if not html_files:
        print("Keine HTML-Dateien unter module/ gefunden.")
        return 1

    for html_file in html_files:
        text = html_file.read_text(encoding="utf-8")
        scanned_text = CODE_PRE_RE.sub("", text)
        for href in HREF_RE.findall(scanned_text):
            if is_external_or_skippable(href):
                continue

            path_part = urlsplit(href).path
            if not path_part:
                continue

            target = (html_file.parent / path_part).resolve()

            try:
                target.relative_to(MODULE_DIR.resolve())
            except ValueError:
                continue  # Link zeigt nicht in module/, nicht Teil dieser Pruefung.

            if not target.exists():
                rel_source = html_file.relative_to(REPO_ROOT)
                errors.append(
                    f"TOTER LINK: {rel_source} -> {href} (Ziel fehlt: "
                    f"{target.relative_to(REPO_ROOT)})"
                )
                continue

            rel_target = target.relative_to(MODULE_DIR)
            if len(rel_target.parts) == 2 and rel_target.suffix == ".html":
                mod_slug, filename = rel_target.parts
                unit_slug = filename[:-5]
                if (mod_slug, unit_slug) not in manifest_units:
                    rel_source = html_file.relative_to(REPO_ROOT)
                    errors.append(
                        f"VERWAISTE EINHEIT: {rel_source} -> {href} "
                        f"(Datei existiert, aber ({mod_slug}, {unit_slug}) "
                        f"fehlt im Manifest)"
                    )

    if errors:
        print(f"{len(errors)} Problem(e) gefunden:\n")
        for e in errors:
            print(f"  - {e}")
        return 1

    print(f"OK — {len(html_files)} HTML-Dateien geprueft, keine toten Links.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
