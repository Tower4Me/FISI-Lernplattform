# CONVENTIONS.md

Verbindliche Konventionen für die Lerneinheiten (FISI AP1/AP2).
Gilt für alle HTML-Einheiten, Dateinamen und Anzeige.

---

## 0. Sprache & Zeichensatz

- Alle Dateien UTF-8.
- **Inhalte (Fließtext, Überschriften, Quizfragen, JSON-Texte) verwenden echte
  Umlaute und ß** (ä, ö, ü, ß). Ersatzschreibweisen wie "ae/ue/oe/ss" sind im
  Inhalt NICHT zulässig.
- Nur Dateinamen, Slugs, Anker und CSS-Klassen sind umlautfrei (siehe Abschnitt 1).

---

## 1. Dateischema

Regeln für alle Pfade und Dateinamen:

- Nur Kleinbuchstaben.
- Keine Umlaute/Sonderzeichen. Ersetzung: ae/oe/ue/ss (ä→ae, ö→oe, ü→ue, ß→ss).
- Worttrennung mit Bindestrich `-`, kein Unterstrich, kein Leerzeichen.
- Pfad = Hierarchie: `module/<modul-slug>/<einheit-slug>.html`
- Keine Nummern-Präfixe im Slug (Reihenfolge steuert das Manifest, nicht der Dateiname).

Beispiele:
- `module/it-sicherheit/toms.html`
- `module/it-sicherheit/schutzziele-cia.html`
- `module/netzwerktechnik/ipv4-subnetting.html`
- `module/kalkulation/datenmengen-uebertragung.html`
- `module/wiso/soziale-sicherung.html`

Modul-Slugs (fix):
`projektmanagement`, `kalkulation`, `hardware`, `netzwerktechnik`,
`it-sicherheit`, `datenschutz-recht`, `software-os-web`, `datenbanken-sql`,
`qualitaetssicherung`, `kaufmaennisches`, `wiso`

### Quiz-Daten

- Pfadschema fix: `data/<modul-slug>/<einheit-slug>.json`
  - Beispiel: `data/it-sicherheit/toms.json`
- Der Quiz-Ordner spiegelt exakt den Modul-Ordner. Kein Sammelordner
  (z. B. `data/quizfragen/`) — das war eine frühe Abweichung und ist korrigiert.
- Einbindung in der Einheit über `data-quiz-src` mit relativem Pfad
  (`../../data/<modul-slug>/<einheit-slug>.json`).

### Interaktive Tools

- Ein Tool = ein eigenständiges JS-Modul unter `assets/tools/<tool-slug>.js`
  (z. B. `raid-rechner.js`, `hex-viewer.js`, `hash-demo.js`, `sql-editor.js`).
- Einbettung über Container mit `data-tool`-Attribut, analog zum Quiz-Muster.
- Tools sind Zusatz innerhalb von Konzept oder Praxisbeispiel; sie ersetzen
  keine der 5 Pflicht-Sektionen.

---

## 2. Anzeigename & Breadcrumbs

Anzeigename-Format: `Modul: Einheit`
- Beispiel: `IT-Sicherheit: TOMs`
- Beispiel: `Netzwerktechnik: IPv4 & Subnetting`
- Doppelpunkt + ein Leerzeichen. Modul und Einheit in Anzeigeschreibweise
  (mit Umlauten, Groß-/Kleinschreibung), nicht der Slug.

Breadcrumbs (immer 3 Ebenen, `›` als Trenner):
`Lernplan › <Modul> › <Einheit>`
- Beispiel: `Lernplan › IT-Sicherheit › TOMs`
- Jede Ebene außer der letzten ist ein Link. Letzte Ebene ist aktiv,
  nicht verlinkt.

---

## 3. Fester Einheiten-Aufbau

Jede Einheit hat exakt diese 5 Abschnitte in dieser Reihenfolge:

1. **Einstieg (Analogie)** — Alltagsanalogie, die das Thema greifbar macht.
   Kein Fachjargon vor der Analogie.
2. **Konzept** — die eigentliche fachliche Erklärung. Definitionen,
   Zusammenhänge, ggf. Abbildung/Tabelle.
3. **Praxisbeispiel** — konkretes Szenario, möglichst prüfungsnah
   (Betriebssituation wie in den AP-Aufgaben).
4. **Merksatz** — 1–2 Sätze, die hängenbleiben sollen. Optisch abgesetzt.
5. **Quiz** — mind. 3 Fragen zur Selbstkontrolle, mit auflösbarer Lösung.

Abschnitte werden nicht weggelassen, nicht umsortiert. Fehlt inhaltlich ein
Praxisbeispiel, wird ein Beispiel konstruiert — leer lassen ist nicht zulässig.

HTML-Ankerstruktur (fix, für Sprungmarken und Konsistenz):
`#einstieg`, `#konzept`, `#praxis`, `#merksatz`, `#quiz`

---

## 4. Badge-System

Zwei Badge-Gruppen, unabhängig voneinander. Eine Einheit trägt je ein Badge
aus Gruppe A und ein oder zwei Badges aus Gruppe B.

Gruppe A — Wichtigkeit (genau 1, 2 Stufen):
- `Kern` — prüfungsrelevanter Pflichtstoff.
- `Randwissen` — möglich, aber selten/randständig.

Gruppe B — Prüfungsteil (1 oder 2 Badges, nebeneinander):
- `AP1`
- `AP2`
- Themen für beide Teile bekommen beide Badges nebeneinander: `AP1` `AP2`.
  Es gibt KEIN kombiniertes "beides"-Badge.

Beispiel-Kombinationen:
- `Kern` `AP2` — z. B. RAID
- `Kern` `AP1` `AP2` — z. B. Schutzziele
- `Randwissen` `AP1` — z. B. HTML/CSS-Grundlagen

Hinweis: Die Prioritäten P1–P3 aus PLAN.md sind NICHT dasselbe wie die Badges.
P1–P3 = gemessene Häufigkeit (Analyse-Ebene). Kern/Randwissen = Anzeige-Badge.
Mapping-Empfehlung: P1/P2 → `Kern`, P3/Bonus → Einzelfallentscheidung,
`n/a` (Katalogpflicht ohne Datenbasis) → i. d. R. `Kern`.

---

## 5. Farbkonzept

Hex-Werte sind gesetzt, aber projektweit an einer Stelle überschreibbar
(CSS-Variablen). Bei Änderung: nur hier und in der zentralen CSS anpassen.

Basis / UI:
- `--bg` Seitenhintergrund: `#0f1720`
- `--surface` Karten/Boxen: `#1b2530`
- `--text` Fließtext: `#e6edf3`
- `--text-muted` Sekundärtext: `#9fb0c0`
- `--border` Linien/Trenner: `#2b3947`
- `--link` Links/Breadcrumb: `#4aa3ff`

Badge Gruppe A (Wichtigkeit):
- `Kern` — Text `#0f1720` auf `#3fb950` (Grün, kräftig)
- `Randwissen` — Text `#e6edf3` auf `#4b5563` (Grau, gedämpft)

Badge Gruppe B (Prüfungsteil):
- `AP1` — Text `#0f1720` auf `#e3b341` (Amber)
- `AP2` — Text `#0f1720` auf `#a371f7` (Violett)

Abschnitts-Akzente (linke Kante/Icon je Abschnitt):
- Einstieg `#4aa3ff` (Blau)
- Konzept `#e6edf3` (Neutral)
- Praxisbeispiel `#3fb950` (Grün)
- Merksatz `#e3b341` (Amber, hervorgehoben)
- Quiz `#a371f7` (Violett)

Semantik Quiz-Feedback:
- Richtig `#3fb950`, Falsch `#f85149`.

Kontrast: Alle Badge-Kombinationen erfüllen mind. WCAG AA (4.5:1) für Text.
Wenn ein Hex geändert wird, Kontrast neu prüfen.

---

## 6. Quiz-UI (verbindliche Muster)

Aus der Referenz-Einheit (TOMs) abgeleitete Fixes, gelten für alle Einheiten:

- **Antwortoption = komplett klickbare Fläche.** Radio-Input und Antworttext
  stecken gemeinsam in einem `<label class="quiz__label">` innerhalb des
  `<li class="quiz__option">`.
- Das `li` trägt KEIN Padding; das Padding liegt auf dem Label
  (`flex: 1; padding: 0.5rem 0.75rem;`), damit die gesamte Kachel klickbar ist.
- Randklick-Weiterleitung im JS: Klick auf das `li` selbst löst den Radio aus
  (`if (e.target === li) input.click();`).
- Antwortpositionen der richtigen Lösung über die Fragen streuen; keine
  Längen-Tells (richtige Antwort nicht systematisch die längste).

## 7. Responsive / Mobile

- Zielgruppe nutzt überwiegend Smartphones. Jede Einheit vor Abnahme einmal
  mobil prüfen.
- Tabellen: global `table { display: block; max-width: 100%; overflow-x: auto; }`
  — breite Tabellen scrollen horizontal statt zu überlaufen.
- Keine festen Pixelbreiten in Inhalts-Layouts.

---

## 8. Einheitliche Fachbegriffe

Verbindliche Vorzugsschreibweise. Links = verwenden, rechts = nicht verwenden.

> STATUS: OFFEN — Begriffspaare werden von Ben vorgegeben und hier nachgetragen.
> Format pro Zeile: `Vorzugsbegriff — nicht verwenden: Variante1, Variante2`

Bis dieser Abschnitt gefüllt ist, gilt: innerhalb einer Einheit für denselben
Begriff durchgehend dieselbe Schreibweise verwenden.

---

## 9. Offene Punkte

- Abschnitt 8 (Fachbegriffe): Begriffspaare fehlen noch.
- ~~Bestandskorrektur toms.html/toms.json (Ersatzschreibweisen ae/ue/oe)~~ —
  erledigt, echte Umlaute eingesetzt.

---

## 10. Quellmaterial & Fragenerzeugung

### Quellordner (außerhalb des Repos)
`C:\Users\benfr\OneDrive\Notizen&Lab\IHK Prüfungen`

Enthält IHK-Originalprüfungen, Musterlösungen und Dozenten-Handouts.
Zugriff über `--add-dir` bzw. `/add-dir`.

### Absolute Regel
Aus diesem Ordner wird NICHTS ins Repo übernommen:
- keine PDFs, keine Bilder, keine OCR-Texte
- keine wörtlichen Aufgabenstellungen, auch nicht auszugsweise
- keine Originaltabellen, -zahlenwerte oder -szenarien in unveränderter Form

Der Ordner ist reine Lesequelle für Analyse. Grund: Urheberrecht.
Das Repo ist öffentlich (GitHub Pages), ein einmal gepushter Commit ist
in der History dauerhaft nachvollziehbar.

### Erlaubte Nutzung
Analysiert werden dürfen:
- Aufgabentypen und Fragestruktur (Berechnung, Zuordnung, Freitext, Multiple Choice)
- typische IHK-Formulierungsmuster ("Nennen Sie zwei…", "Begründen Sie…",
  "Berechnen Sie… Runden Sie auf…")
- Handlungsschritt-Aufbau (Szenario → Teilaufgaben a/b/c)
- Verteilung und Gewichtung der Themen

Daraus entstehen EIGENE Quizfragen: eigenes Szenario, eigene Firmennamen,
eigene Zahlenwerte, eigene Formulierung. Das Prüfungsmuster wird abgebildet,
der Prüfungstext nicht reproduziert.

Test vor jedem Commit: Ließe sich ein Satz der Frage per Volltextsuche in
einer Original-PDF wiederfinden? Dann ist er zu nah dran.

### Ergebnis
Ausschließlich `data/<modul-slug>/<einheit-slug>.json` und die HTML-Einheiten.
Vor jedem Push: `git status` prüfen.

---

## 11. Abbildungen (SVG)

- Abbildungen werden ausschließlich als Inline-SVG geschrieben, direkt im HTML.
  Keine externen Bilddateien, keine Fotos, keine fremden Grafiken (Urheberrecht).
- Farben NUR über die CSS-Variablen aus Abschnitt 5 (`fill="var(--surface)"`,
  `stroke="var(--border)"`, Akzente über `var(--link)` etc.). Keine Hex-Werte
  im SVG.
- Responsive: `viewBox` gesetzt, keine festen `width`/`height` in px.
  Container-Klasse `figure--diagram`, max-width 100%.
- Schriftgröße im SVG mind. 14px-Äquivalent — muss auf dem Smartphone lesbar sein.
- Immer mit `<figcaption>` (kurze Beschreibung) und `role="img"` +
  `<title>` im SVG für Barrierefreiheit.
- Platzierung: in der Regel im Abschnitt Konzept. Eine Abbildung ersetzt keine
  der 5 Pflicht-Sektionen.
- Nur einsetzen, wenn die Abbildung echten Erkenntnisgewinn bringt
  (Ablauf, Struktur, Zusammenhang). Keine dekorativen Bilder.

---

## 12. Theme & Druck

### Farbnutzung (Voraussetzung für beides)
Farben ausschließlich über die CSS-Variablen aus Abschnitt 5. Keine Hex-Werte
in HTML, SVG oder Inline-Styles. Das ist die Bedingung dafür, dass Light-Mode
und Druckansicht später als reiner Variablen-Swap umsetzbar sind.

### Light-Mode
- Umsetzung über `[data-theme="light"]` auf `<html>`, Variablen-Swap in style.css.
- Persistenz per localStorage, Default = Systempräferenz
  (`prefers-color-scheme`).
- Einheiten-HTML enthält KEINE theme-spezifische Logik.

### Druck
- Druckgranularität: eine Einheit = ein Druckvorgang. Kein Sammeldruck.
- Umsetzung zentral in style.css unter `@media print`. Einheiten-HTML enthält
  keine Druck-Sonderlogik.
- Mehrseitiger Fluss ist gewollt. Kein Herunterskalieren auf eine Seite.
- Ausgeblendet beim Druck: Navigation, Breadcrumbs, Theme-Toggle,
  Quiz-Interaktion (Buttons, Feedback).
- Sichtbar beim Druck: alle 5 Pflicht-Sektionen, Abbildungen, Quizfragen
  inkl. Antwortoptionen (Lösung ausgeblendet).
- Umbruchregeln: `break-inside: avoid` für Abbildungen, Merksatz-Box und
  Quiz-Fragen; nach Überschriften `break-after: avoid`.
- Hintergrund weiß, Text schwarz.