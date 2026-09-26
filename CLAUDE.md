# CLAUDE.md

Statische Lernplattform (FISI AP1/AP2), GitHub Pages, kein Node, nur
Python-Standardbibliothek. Verbindliche Regeln: [CONVENTIONS.md](CONVENTIONS.md).

## Struktur

```
index.html, merksaetze.html   Startseite, Merksatz-Sammelansicht
data/manifest.json            Module + Einheiten: Reihenfolge, Titel, AP1/AP2, Tools
content/<modul>/<einheit>.html  Inhalt einer Einheit (nur <main>) — HIER bearbeiten
data/<modul>/<einheit>.json   Quizfragen einer Einheit
data/pruefung/                Fragenpool des Prüfungssimulators
module/<modul>/<einheit>.html GENERIERT — nie direkt bearbeiten
templates/                    page.html + scripts-<typ>.html (Seitenrahmen),
                              einheit-vorlage.html, quiz-vorlage.json
assets/                       CSS, JS (Quiz, Theme, Suche …), assets/tools/ = interaktive Tools
tools/                        Build- und Prüfskripte
```

## Bauen und prüfen

```
py tools/build_pages.py          # module/ aus manifest + content + templates
py tools/build_search_index.py   # data/search-index.json
py tools/validate_manifest.py
py tools/check_links.py
py tools/validate_pool.py
```

Erzeugte Dateien (`module/`, `data/search-index.json`) werden mitcommittet;
die CI (`.github/workflows/validate.yml`) schlägt fehl, wenn sie veraltet sind.
Neue Einheit: Skill `neue-einheit`. Lokal ansehen: `py -m http.server 8000`.

## Vor jedem Commit

- `git status` prüfen.
- Keine PDFs, keine OCR-Texte, keine wörtlichen Original-Prüfungstexte im
  Repo (CONVENTIONS.md Abschnitt 10). Lokaler Pfad zum Quellordner: `CLAUDE.local.md`.
