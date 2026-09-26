---
name: neue-einheit
description: Neue Lerneinheit anlegen (Manifest-Eintrag, content-Datei, Quiz-JSON, Seiten und Suchindex bauen, Checks). Verwenden, wenn eine Einheit neu hinzukommt oder in ein anderes Modul wandert.
---

# Neue Einheit anlegen

Regeln stehen in `CONVENTIONS.md`, Aufbau in `templates/`. Hier nur der Ablauf.

1. **Slug und Position festlegen.** Slug nach CONVENTIONS.md Abschnitt 1.
   Eintrag in `data/manifest.json` an der thematisch richtigen Stelle im
   `units`-Array des Moduls (Felder: Abschnitt 14; `scripts` nur, wenn die
   Einheit ein Tool aus `assets/tools/` einbettet).
2. **Inhalt.** `templates/einheit-vorlage.html` nach
   `content/<modul-slug>/<einheit-slug>.html` kopieren und ausfüllen
   (Abschnitte 0, 3, 11). Den Hinweis-Kommentar oben löschen.
3. **Quiz.** `templates/quiz-vorlage.json` nach
   `data/<modul-slug>/<einheit-slug>.json` kopieren und ausfüllen
   (Abschnitt 3: mind. 3 Fragen; Abschnitt 6: kein Längensignal, `answer`
   streuen). Quellmaterial nur nach Abschnitt 10.
4. **Bauen.**
   ```
   py tools/build_pages.py
   py tools/build_search_index.py
   ```
   `module/` nie direkt bearbeiten, es wird komplett aus `content/` erzeugt.
5. **Prüfen.**
   ```
   py tools/validate_manifest.py
   py tools/check_links.py
   py tools/validate_pool.py
   ```
   Alle mit Exit-Code 0. Danach im Browser ansehen
   (`py -m http.server 8000`, Einheit öffnen, Quiz auswerten, mobil prüfen).
6. **Commit.** `git status` prüfen. Zusammen committen: `data/manifest.json`,
   `content/…`, `data/<modul>/…json`, erzeugtes `module/…html`,
   `data/search-index.json`.
