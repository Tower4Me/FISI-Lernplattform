#!/usr/bin/env python3
"""Baut data/search-index.json fuer Inhaltstreffer in der Suche
(assets/search.js), zusaetzlich zum reinen Titel-/Alias-Abgleich aus
data/manifest.json.

Extrahiert je Einheit:
  - alle <h3>-Ueberschriften (Unterabschnitte, z. B. "DPI — Dots per Inch")
  - den Fliesstext aus <section id="merksatz">

<h2> wird bewusst NICHT indiziert: die Standard-Abschnittstitel (Einstieg,
Konzept, Praxisbeispiel, Merksatz, Quiz) sind in praktisch jeder Einheit
identisch und haben keine Suchrelevanz -- sie wuerden nur Rauschen und
Groesse ohne Nutzen hinzufuegen.

Exit-Code 0, wenn alles sauber gebaut wurde, sonst 1 (z. B. eine im
Manifest gelistete Einheit ohne existierende HTML-Datei -- dafuer ist
tools/validate_manifest.py die eigentliche Quelle der Wahrheit, hier nur
als Sicherheitsnetz).
"""

import json
import re
import sys
from html import unescape
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
MANIFEST_PATH = REPO_ROOT / "data" / "manifest.json"
OUTPUT_PATH = REPO_ROOT / "data" / "search-index.json"

H3_RE = re.compile(r"<h3[^>]*>(.*?)</h3>", re.S)
MERKSATZ_RE = re.compile(r'<section[^>]*\bid="merksatz"[^>]*>(.*?)</section>', re.S)
TAG_RE = re.compile(r"<[^>]+>")
WHITESPACE_RE = re.compile(r"\s+")


def strip_tags(fragment):
    text = TAG_RE.sub(" ", fragment)
    text = unescape(text)
    return WHITESPACE_RE.sub(" ", text).strip()


def main():
    errors = []
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))

    index = {}
    for mod in manifest["modules"]:
        for unit in mod["units"]:
            rel_path = "module/{}/{}.html".format(mod["slug"], unit["slug"])
            path = REPO_ROOT / rel_path
            if not path.exists():
                errors.append("FEHLT: " + rel_path)
                continue
            html = path.read_text(encoding="utf-8")

            headings = [strip_tags(h) for h in H3_RE.findall(html)]
            headings = [h for h in headings if h]

            m = MERKSATZ_RE.search(html)
            merksatz = strip_tags(m.group(1)) if m else ""
            # Der <h2>Merksatz</h2>-Titel steckt im gematchten Abschnitt mit
            # drin -- als erstes Wort entfernen, er traegt keine Information.
            if merksatz.startswith("Merksatz"):
                merksatz = merksatz[len("Merksatz"):].strip()

            entry = {}
            if headings:
                entry["headings"] = headings
            if merksatz:
                entry["merksatz"] = merksatz
            if entry:
                index[rel_path] = entry

    if errors:
        for e in errors:
            print(e)
        print("FEHLER: {} Einheit(en) ohne HTML-Datei.".format(len(errors)))
        return 1

    OUTPUT_PATH.write_text(
        json.dumps(index, ensure_ascii=False, indent=1, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    size_kb = OUTPUT_PATH.stat().st_size / 1024
    print(
        "OK — {} Einheiten indiziert, data/search-index.json ({:.1f} KB) geschrieben.".format(
            len(index), size_kb
        )
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
