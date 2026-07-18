# FISI-Lernplattform

Web-basierte Lernplattform zur Prüfungsvorbereitung (AP1 & AP2) für die Ausbildung zum Fachinformatiker Systemintegration.

**→ [Zur Lernplattform](https://tower4me.github.io/FISI-Lernplattform/)**

## Features

- Modulare Lerneinheiten mit einheitlichem Aufbau: Einstieg, Konzept, Praxisbeispiel, Merksatz, Quiz
- Interaktive Quizzes mit lokal gespeichertem Fortschritt
- Interaktive Tools: SQL-Editor, Subnetzrechner, RAID-Rechner, Zahlensystem-Konverter u. a.
- Vier Farbschemata (White, Dark, Creme, Terminal), Systemeinstellung wird automatisch erkannt
- Druckoptimierte Ansicht: Lerneinheiten als PDF oder auf Papier, Quiz zum Ankreuzen ohne Lösungen

## Lokal starten

Die Seite benötigt einen HTTP-Server (`fetch()` funktioniert nicht über `file://`):

```bash
py -m http.server 8000
```

Dann `http://localhost:8000` im Browser öffnen.

---

*Nur für den privaten Lerngebrauch.*
