# FISI-Lernplattform

Web-basierte Lernplattform zur Prüfungsvorbereitung (AP1 & AP2) für die Ausbildung zum Fachinformatiker Systemintegration.

Teilweise können Inhalte ausführlicher sein als wirklich relevant für die APs. Sie sind dennoch für die Vollständigkeit behandelt.

**→ [Zur Lernplattform](https://tower4me.github.io/FISI-Lernplattform/)**

## Features

- Modulare Lerneinheiten mit einheitlichem Aufbau: Einstieg, Konzept, Praxisbeispiel, Merksatz, Quiz
- Interaktive Quizzes mit lokal gespeichertem Fortschritt (eine Einheit gilt ab 80 % richtiger Antworten als erledigt)
- Suche nach Einheiten-Titeln sowie Filter nach Prüfungsteil (AP1/AP2)
- Fortschrittsanzeige pro Modul, Navigation zur jeweils nächsten Einheit am Seitenende
- Interaktive Tools: SQL-Editor, Subnetzrechner, RAID-Rechner, Zahlensystem-Konverter u. a.
- Verschiedene Farbschemata, Systemeinstellung wird automatisch erkannt
- Druckoptimierte Ansicht: Lerneinheiten als PDF oder auf Papier (Strg+P), Quiz zum Ankreuzen ohne Lösungen, interaktive Tools werden beim Drucken ausgeblendet

## Lokal starten

Die Seite benötigt einen HTTP-Server (`fetch()` funktioniert nicht über `file://`):

```bash
py -m http.server 8000
```

Dann `http://localhost:8000` im Browser öffnen.

## Selbst erweitern

Die Seiten unter `module/` werden erzeugt und nicht direkt bearbeitet. Voraussetzung ist nur Python 3 (Standardbibliothek).

- **Inhalt einer Einheit:** `content/<modul>/<einheit>.html` (nur der Inhalt der Seite, fünf Abschnitte)
- **Quizfragen:** `data/<modul>/<einheit>.json`
- **Titel, Reihenfolge, AP1/AP2, Tools:** `data/manifest.json`
- **Seitenrahmen (Kopf, Footer, Skripte):** `templates/`
- **Neue Einheit:** Vorlagen `templates/einheit-vorlage.html` und `templates/quiz-vorlage.json`

Nach jeder Änderung neu bauen und prüfen:

```bash
py tools/build_pages.py
py tools/build_search_index.py
py tools/validate_manifest.py
py tools/check_links.py
py tools/validate_pool.py
```

Die erzeugten Dateien (`module/`, `data/search-index.json`) werden mitcommittet. Bei jedem Push prüft GitHub Actions, dass sie aktuell sind. Verbindliche Regeln für Aufbau, Quizfragen und Gestaltung: [CONVENTIONS.md](CONVENTIONS.md), Projektüberblick: [CLAUDE.md](CLAUDE.md).

---

*Nur für den privaten Lerngebrauch.*
