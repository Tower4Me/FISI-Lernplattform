# CONVENTIONS.md

Verbindliche Konventionen für die Lerneinheiten (FISI AP1/AP2).
Gilt für alle HTML-Einheiten, Dateinamen und Anzeige. Projektstruktur und
Build-Befehle: [CLAUDE.md](CLAUDE.md).

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
- Pfad = Hierarchie: `content/<modul-slug>/<einheit-slug>.html` (Quelle)
  bzw. `module/<modul-slug>/<einheit-slug>.html` (erzeugte Seite).
- Keine Nummern-Präfixe im Slug (Reihenfolge steuert das Manifest, nicht der Dateiname).

Beispiele:
- `content/it-sicherheit/toms.html` → `module/it-sicherheit/toms.html`
- `content/netzwerktechnik/ipv4-subnetting.html` → `module/netzwerktechnik/ipv4-subnetting.html`
- `content/wiso/soziale-sicherung.html` → `module/wiso/soziale-sicherung.html`

Modul-Slugs (fix):
`projektmanagement`, `kalkulation`, `hardware`, `netzwerktechnik`,
`it-sicherheit`, `datenschutz-recht`, `software-os-web`, `programmierung`,
`datenbanken-sql`, `qualitaetssicherung`, `kaufmaennisches`, `wiso`, `pruefung`

### Quelle und erzeugte Seite

- `content/<modul-slug>/<einheit-slug>.html` enthält **nur** den Inhalt
  zwischen `<main class="site-main">` und `</main>` (die Abschnitte aus
  Abschnitt 3). Vorlage: `templates/einheit-vorlage.html`.
- `module/**/*.html` wird von `tools/build_pages.py` erzeugt und **nie
  direkt bearbeitet**. Kopf (`<head>`, Titel), Brotkrumen, `<h1>` mit Badges,
  Footer und Script-Tags kommen aus `templates/page.html` und
  `templates/scripts-<typ>.html`, die Werte dafür aus `data/manifest.json`
  (Abschnitt 14). Metadaten stehen damit nur an einer Stelle.
- Seitentyp erkennt der Generator am Inhalt: `data-quiz-src` = `standard`
  (mit `quiz-engine.js`), `id="exam-root"` = `simulator` (mit
  `exam-engine.js`), sonst `ohne-quiz`.
- Erzeugte Seiten werden mitcommittet (GitHub Pages liefert sie direkt aus).
  Die CI prüft, dass sie aktuell sind (Abschnitt 16).

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
  Das Skript selbst wird über das Unit-Feld `scripts` im Manifest
  eingebunden (Abschnitt 14), nicht im Inhalt.
- Kein Inline-`<script>` im Inhalt einer Einheit — seitenspezifische Logik
  gehört als eigene Datei nach `assets/tools/` (Beispiel:
  `subnetz-rechner.js` für `ipv4-subnetting`).
- Tools sind Zusatz innerhalb von Konzept oder Praxisbeispiel; sie ersetzen
  keine der 5 Pflicht-Sektionen.
- Direkt vor dem Tool-Container steht üblicherweise ein kurzer
  Einleitungssatz ("Probiere …", "Berechne …", "Teste …"). Dieser Satz
  bekommt `class="tool-intro"` (eigene `<p class="tool-intro">`, nicht
  Teil eines längeren Erklärungsabsatzes) — Grund: Beim Drucken wird
  `.tool` komplett ausgeblendet (Abschnitt 12), ohne `.tool-intro` bliebe
  die reine Instruktionszeile als sinnlose Restzeile ohne das Tool
  darunter im Ausdruck stehen. Enthält der Absatz vor dem Tool auch
  eigenständigen Lerninhalt (nicht nur die Instruktion), wird die
  Instruktion in einen eigenen, kurzen `<p class="tool-intro">`
  abgetrennt statt den ganzen Absatz zu klassifizieren — sonst geht beim
  Drucken echter Inhalt verloren.

### Vendorte Drittanbieter-Bibliotheken

Grundsatz: keine Laufzeit-Abhängigkeit von einem CDN. Falls ein Tool eine
Drittanbieter-Bibliothek braucht (z. B. eine SQL-Engine für den
SQL-Editor), gilt:

- Die Bibliothek liegt als Datei lokal im Repo unter
  `assets/tools/vendor/<bibliotheksname>/` — nicht per `<script src="https://…">`
  von einem CDN geladen.
- Der Lizenztext der Bibliothek liegt unverändert daneben (`LICENSE`),
  zusammen mit einer `VERSION.txt` (Quelle, Versionsnummer, Update-Hinweis).
- Der Vendor-Code selbst bleibt unverändert (kein Patchen); projektspezifische
  Logik steckt ausschließlich im eigenen Wrapper-Tool
  (`assets/tools/<tool-slug>.js`), das die Bibliothek referenziert.
- Lazy Load: Die Bibliothek wird nicht auf jeder Seite eingebunden, sondern
  nur dort, wo das jeweilige Tool per `data-tool` eingebettet ist — und dort
  erst bei Bedarf nachgeladen (z. B. per `IntersectionObserver`, wenn der
  Tool-Container in den sichtbaren Bereich scrollt), nicht beim initialen
  Seitenaufbau. Grund: CONVENTIONS §7 (mobile Zielgruppe, keine unnötige
  Ladelast).
- Beispiel: `assets/tools/vendor/sql.js/` (sql-wasm.js + sql-wasm.wasm,
  MIT-Lizenz) für `assets/tools/sql-editor.js`.

---

## 2. Anzeigename & Breadcrumbs

Anzeigename-Format (`<title>`): `Modul: Einheit`
- Beispiel: `IT-Sicherheit: TOMs`
- Beispiel: `Netzwerktechnik: IPv4 & Subnetting`
- Doppelpunkt + ein Leerzeichen. Modul und Einheit in Anzeigeschreibweise
  (mit Umlauten, Groß-/Kleinschreibung), nicht der Slug.
- Erzeugt aus dem Manifest: Modulteil = Modulfeld `short`, Einheit = Unit-Feld
  `name`. Brotkrumen und `<h1>` verwenden `name` des Moduls bzw. der Einheit.

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

`tools/build_pages.py` prüft die Anker: Seiten mit Quiz brauchen alle fünf
in dieser Reihenfolge, Seiten ohne Quiz (Modul `pruefung`) mindestens
`#merksatz`. Sonst bricht der Build mit Fehler ab.

---

## 4. Badge-System

Eine Badge-Gruppe: Prüfungsteil (1 oder 2 Badges, nebeneinander). Erzeugt
aus dem Unit-Feld `exams` im Manifest, nicht im Inhalt gepflegt:
- `AP1`
- `AP2`
- Themen für beide Teile bekommen beide Badges nebeneinander: `AP1` `AP2`.
  Es gibt KEIN kombiniertes "beides"-Badge.

Beispiel-Kombinationen:
- `AP2` — z. B. RAID
- `AP1` `AP2` — z. B. Schutzziele
- `AP1` — z. B. HTML/CSS-Grundlagen

> Historie: Bis Juli 2026 gab es zusätzlich eine Wichtigkeits-Badge-Gruppe
> (`Kern`/`Randwissen`). Diese wurde ersatzlos entfernt — nur AP1/AP2 sind
> als Tag/Badge sichtbar.

> Optik seit Runde 4 (Mobile-Optimierung): Outline/Ghost-Pillen (Rand +
> Text in der Badge-Farbe, transparenter Hintergrund) statt der früheren
> kräftigen Vollflächen-Pillen — Nutzer-Auswahl aus 5 vorgeschlagenen
> Varianten (aktuell/Outline/Soft-Tint/Minimal-Punkt/Gradient). Details
> und Kontrast-Herleitung: Abschnitt 5.

---

## 5. Farbkonzept

Seit dem Theming-Umbau (vier Themes, siehe Abschnitt 12) sind Farb-Slots in
**zwei Gruppen** aufgeteilt. Nur hier und in `assets/style.css` ändern.

### Gruppe 1 — Basis-UI (wechselt pro Theme)

7 Slots, die in `:root` (white-Default) sowie je einmal in
`[data-theme="dark"|"creme"|"terminal"]` gesetzt werden:
`--bg`, `--surface`, `--surface-2`, `--text`, `--text-muted`, `--border`,
`--link`. Konkrete Werte je Theme: siehe Abschnitt 12 (dort keine
Duplizierung dieser Liste, um Werte nicht doppelt pflegen zu müssen).

### Gruppe 2 — semantisch (identisch über ALLE vier Themes)

Diese Slots kodieren Lern-Bedeutung, nicht Theme-Ästhetik, und stehen
**grundsätzlich genau einmal** in `:root` — mit einer dokumentierten
Ausnahme (`--badge-ap2-outline`, siehe eigener Absatz unten).

Badge (Prüfungsteil), seit Runde 4 Outline/Ghost-Stil (Text + Rand,
transparenter Hintergrund, kein `--fg` mehr nötig):
- `--badge-ap1-outline: #a87718` (Amber) — Gruppe 2, ein Wert für alle
  fünf Themes, ≥3.0:1 gegen alle 10 Hintergründe (identischer Zahlenwert
  wie `--acc-merksatz`, aber eigene Variable — andere Bedeutung).
- `--badge-ap2-outline` (Violett) — **kein** einzelner Wert über alle
  Themes hinweg möglich (Begründung siehe unten), daher Default in
  `:root` (`#6b21c9`, gilt für white/creme) plus Überschreibung in
  `dark`/`terminal` (`#c9a6ff`) und `sunset` (`#dcbcff`).

Abschnitts-Akzente (linke Kante je Abschnitt):
- Einstieg `#2f7fd1` (Blau, gedeckter) — **geändert** von `#4aa3ff`
- Konzept `#6b7280` (neutrales Grau) — **geändert** von `#e6edf3`
- Praxisbeispiel `#2f8f46` (Grün, gedeckter) — **geändert** von `#3fb950`
- Merksatz `#a87718` (Amber, gedeckter) — **geändert** von `#e3b341` (Design-Batch 1)
- Quiz `#a371f7` (Violett) — unverändert

Semantik Quiz-Feedback:
- Richtig `#2f8f46` — **geändert** von `#3fb950`
- Falsch `#e5484d` — **geändert** von `#f85149`

### Warum diese drei Änderungen (Kontrast-Fix beim Theming-Umbau)

`--acc-konzept` war `#e6edf3` (fast weiß) — auf den hellen Themes (white/
creme) praktisch unsichtbar, da Rahmenfarbe fast gleich dem hellen
Untergrund. Ersetzt durch ein neutrales Grau, das auf Hell UND Dunkel als
Rahmenakzent funktioniert (≥3:1 gegen beide Extreme, WCAG 1.4.11 für
Nicht-Text-UI).

`--ok`, `--fail`, `--acc-praxis` und `--acc-einstieg` waren gegen einen
hellen Hintergrund kontrastarm (`--ok`/`--acc-praxis` ~2.5:1, `--fail`
~3.35:1, `--acc-einstieg` ~2.64:1 gegen Weiß — teils Text, teils Rahmen).
Da ein einzelner Farbwert, der gleichzeitig AA-Textkontrast (4.5:1) gegen
Weiß UND gegen das fast-schwarze Dark/Terminal-`--surface` erreicht,
rechnerisch nicht existiert, wurden alle vier **einmal global** (gilt für
alle vier Themes gleich, keine Per-Theme-Abweichung) etwas dunkler/satter
gezogen — Kompromiss zwischen Lesbarkeit auf Hell und der bisherigen
Signalwirkung auf Dunkel. `--acc-quiz` (`#a371f7`) besteht bereits knapp
(~3.36:1) und wurde nicht angefasst.

`--acc-merksatz` war ursprünglich `#e3b341` (Amber) und blieb beim
Theming-Umbau bewusst unverändert (~1.95:1 gegen Weiß, offene
Restkollision). In Design-Batch 1 per Python-Skript (WCAG-Kontrast direkt
aus `assets/style.css` berechnet, gegen `--surface` UND `--surface-2`
aller fünf Themes) auf `#a87718` korrigiert — besteht ≥3.0:1 gegen alle
zehn Hintergründe, Minimum 3.28:1 bei sunset/surface-2. Damit ist die
Restkollision aus Abschnitt 9 aufgelöst.

Weiterhin unter 3.0:1 gegen mindestens einen Hintergrund und **nicht**
Teil von Design-Batch 1 (nur mitgemessen, nicht angefasst): `--acc-konzept`
(2.68–2.77:1 gegen dark/surface-2 und sunset/surface-2), `--acc-quiz`
(2.56–2.81:1 gegen white/surface-2 und creme/surface-2), `--fail` (2.99:1
gegen creme/surface-2, knapp). Kandidat für ein künftiges Batch.
Die Fortschrittsanzeige (`.progress__bar`) nutzt `--ok` als Farbe (nicht
mehr die inzwischen entfernte Kern-Badge-Farbe, siehe Historie-Hinweis in
Abschnitt 4).

Kontrast: Alle Badge-Kombinationen erfüllen weiterhin mind. WCAG AA
(4.5:1) für Text (in sich geschlossene Pillen). Wenn ein Gruppe-2-Hex
geändert wird: Kontrast gegen **beide** Extreme (helles UND dunkles
`--surface`) neu prüfen, nicht nur gegen ein Theme.

### Badge-Redesign Runde 4: Outline-Stil und die Violett-Ausnahme

Beim Umbau der Badges von Vollflächen-Pillen (dunkler Text auf kräftigem
Farb-Hintergrund) auf Outline/Ghost (Farbe nur noch als Text/Rand, siehe
Abschnitt 4) ändert sich die Kontrast-Rechnung grundlegend: Der Text sitzt
jetzt direkt auf `--surface` der Karte, nicht mehr auf einem eigenen,
extra dafür gewählten Farbfeld. Für `--badge-ap1-outline` (Amber) reicht
der bereits vorhandene, verifizierte Wert `#a87718` (identisch mit
`--acc-merksatz`) unverändert — ≥3.0:1 gegen alle 10 Hintergründe.

Für Violett (`--badge-ap2-outline`) existiert dagegen **kein** einzelner
Hex-Wert, der gegen sowohl die fast-weißen (`white`/`creme`) als auch die
fast-schwarzen (`dark`/`terminal`/`sunset`) `--surface`-Werte ≥3:1
erreicht — dieselbe mathematische Einschränkung wie bei `--ok`/`--fail`/
`--acc-praxis`/`--acc-einstieg` oben, nur dass dort ein globaler
Kompromisswert toleriert wurde (Text erscheint dort nie direkt auf sehr
hellem UND sehr dunklem Grund gleichzeitig). Bei den Badges ist genau das
aber der Fall (fünf Themes, sehr helle bis sehr dunkle `--surface`-Werte),
ein Kompromisswert würde auf mindestens einem Theme unter 3:1 fallen. Per
Skript wurde deshalb bewusst **pro Theme-Helligkeitsgruppe** ein eigener
Violett-Ton gewählt (`--badge-ap2-outline` dadurch ausnahmsweise Gruppe 1,
nicht Gruppe 2): `#6b21c9` (dunkles Violett) für white/creme, `#c9a6ff`
(helles Lavendel) für dark/terminal, `#dcbcff` (noch helleres Lavendel)
für sunset, da dessen `--surface` selbst schon violett-dunkel ist und
mehr Abstand braucht. Alle fünf Kombinationen liegen bei ≥5.9:1 gegen
beide `--surface`-Werte ihres Themes. Badge-AP1 bleibt bewusst Gruppe 2
(ein Wert reicht dort aus) — falls künftig weitere Gruppe-2-Farben auf
Outline-Stil umgebaut werden, immer zuerst per Skript prüfen, ob ein
einzelner Wert über alle fünf Themes ≥3:1 erreicht, bevor auf eine
Per-Theme-Variable ausgewichen wird.

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

### Quiz-Fragen: kein Längensignal

Quizfragen dürfen kein Längensignal enthalten. Die richtige Antwort darf
nicht die längste oder die einzige vollständig ausformulierte Option sein,
sonst lässt sie sich ohne Wissen erraten (bekanntes KI-Muster: die richtige
Antwort wird als sauberer Satz formuliert, die Distraktoren bleiben kürzer).

Regeln für jede neue Frage:

- Wo möglich, die Frage so stellen, dass die Antworten Werte, Begriffe oder
  kurze Zuordnungen sind (z. B. Ports, Bit-Größen, Schicht L2/L3/L4, „IP in
  MAC" statt Erklärungssatz). Dann sind alle Optionen natürlich gleich kurz.
- Nur wo eine Satzantwort unvermeidbar ist: alle vier Optionen als gleich
  ausführliche, gleich plausible Sätze formulieren.
- Distraktoren müssen inhaltlich ernsthaft sein (typische Verwechslungen),
  keine offensichtlichen Fülloptionen.
- Die richtige Antwort zufällig positionieren, nicht gehäuft auf demselben
  `answer`-Index.
- Genau eine eindeutig richtige Antwort, keine „alles davon"/„nichts
  davon"-Optionen.
- Fachliche Korrektheit hat immer Vorrang vor Format oder Längenangleichung.

Prüfmaßstab: Über ein Quiz hinweg soll der Anteil „richtige Antwort =
längste Option" nicht deutlich über dem Zufallswert (etwa 25 % bei 4
Optionen) liegen.

## 7. Responsive / Mobile

- Zielgruppe nutzt überwiegend Smartphones. Jede Einheit vor Abnahme einmal
  mobil prüfen.
- Tabellen: global `table { display: block; max-width: 100%; overflow-x: auto; }`
  — breite Tabellen scrollen horizontal statt zu überlaufen.
- Keine festen Pixelbreiten in Inhalts-Layouts.

---

## 8. Einheitliche Fachbegriffe

Verbindliche Vorzugsschreibweise. Links = verwenden, rechts = nicht verwenden.

> STATUS: OFFEN — Begriffspaare werden vorgegeben und hier nachgetragen.
> Format pro Zeile: `Vorzugsbegriff — nicht verwenden: Variante1, Variante2`

Bis dieser Abschnitt gefüllt ist, gilt: innerhalb einer Einheit für denselben
Begriff durchgehend dieselbe Schreibweise verwenden.

---

## 8a. Pseudocode-Notation

Verbindlich für alle Einheiten mit Pseudocode (primär Modul `programmierung`,
aber auch andernorts, wo ein Algorithmus in Pseudocode statt als Diagramm
gezeigt wird). Sprachneutral, angelehnt an gängige deutsche
Pseudocode-Konventionen. Immer in einem `<div class="code-block" ...>`
(monospace, `white-space: pre-wrap`, Farben ausschließlich über
`var(--surface)`/`var(--border)`), nie als eigenes CSS-Konstrukt je Einheit.

### Grundelemente

| Element | Notation | Beispiel |
|---|---|---|
| Zuweisung | `Variable = Wert` | `Menge = 120` |
| Algorithmus-Kopf | `ALGORITHMUS Name(Parameter)` | `ALGORITHMUS GrößteZahl(a, b, c)` |
| Ausgabe | `AUSGABE Wert` | `AUSGABE Ergebnis` |
| Rückgabe | `RÜCKGABE Wert` | `RÜCKGABE ERGEBNIS` |

### Verzweigung

```
WENN Bedingung DANN
  Anweisung
SONST WENN Bedingung DANN
  Anweisung
SONST
  Anweisung
ENDE WENN
```

`SONST WENN` und `SONST` sind optional (einseitige bzw. zweiseitige
Verzweigung). Mehrere `SONST WENN` auf gleicher Einrückungstiefe = kaskadierte
Verzweigung (Abgrenzung zur Verschachtelung: siehe Einheit
„Verschachtelung & Kaskadierung von Kontrollstrukturen“).

### Schleifen

```
FÜR i VON 1 BIS 5 TUE
  Anweisung
ENDE FÜR

FÜR JEDE Element IN Liste TUE
  Anweisung
ENDE FÜR

SOLANGE Bedingung TUE
  Anweisung
ENDE SOLANGE

WIEDERHOLE
  Anweisung
BIS Bedingung
```

`FÜR`/`FÜR JEDE` = Zählschleife (Anzahl Durchläufe steht vorher fest).
`SOLANGE` = kopfgesteuert (Bedingung vor dem Durchlauf, kann null Mal
laufen). `WIEDERHOLE … BIS` = fußgesteuert (Bedingung nach dem Durchlauf,
läuft mindestens einmal) — bewusst kein `MACHE … SOLANGE`, um Verwechslung
mit der kopfgesteuerten Form zu vermeiden.

### Operatoren

- Arithmetisch: `+ - * / %` (% = Modulo, Rest der Ganzzahldivision)
- Vergleich: `== != < > <= >=` (Ergebnis immer Boolean)
- Logisch: `UND ODER NICHT`

### Einrückung

Jede Verschachtelungsebene (Anweisung im Körper einer Struktur) wird um
2 Leerzeichen eingerückt. Kaskadierte `SONST WENN` bleiben auf der Ebene
des zugehörigen `WENN`.

> Herkunft: Diese Notation ist keine neue Erfindung, sondern die
> Fortschreibung dessen, was in `content/programmierung/*.html` bereits
> durchgängig verwendet wurde. Bei Übernahme in andere Module
> ggf. dort ebenfalls vereinheitlichen.

### Gemischte Notation: Pseudocode vs. echter Code (Stand 2026-09-20)

Seit Stand 2026-09-20 gilt in ausgewählten Einheiten des Moduls `programmierung`
**nicht mehr durchgängig Pseudocode** — dort, wo eine Einheit „echtes
Programmieren“ vermitteln soll, wird echter Code (aktuell Python)
verwendet, weil dessen Syntax (`if`/`elif`/`else`, `for`/`while`) in der
Praxis geläufiger ist als die sprachneutrale Pseudocode-Form. Betroffen
ist ausschließlich der **Abschnitt Praxisbeispiel** (inkl. Übungsaufgabe/
Musterlösung nach 8b) — der Konzept-Abschnitt bleibt in derselben
Einheit bei WENN/DANN/SOLANGE/FÜR, weil er das Konstrukt sprachneutral
als Algorithmus-Design-Hilfsmittel erklärt.

| Einheit | Konzept | Praxisbeispiel/Übungsaufgabe |
|---|---|---|
| `verzweigungen-if-else.html` | WENN/DANN/SONST (Pseudocode) | `if`/`elif`/`else` (Python) |
| `schleifen.html` | SOLANGE/FÜR/WIEDERHOLE…BIS (Pseudocode) | `for`/`while` (Python) |
| `programmierparadigmen.html` | — (kein Kontrollstruktur-Konzept) | kein Übungsaufgabe/Musterlösung-Paar mehr, stattdessen Paradigmen-Vergleich: dieselbe Aufgabe dreimal in echtem Code (imperativ/OOP/funktional) nebeneinander, siehe 8b |

Alle anderen Einheiten mit Pseudocode bleiben unverändert bei
WENN/DANN/SOLANGE/FÜR — explizit auch dort, wo eine Notation-Umstellung
naheliegend erscheinen könnte, aber nicht sinnvoll ist:

- `verschachtelung-kaskadierung.html`, `pap-programmablaufplan.html`,
  `struktogramm-nassi-shneiderman.html`,
  `compiler-interpreter-debugging.html` — echte Pseudocode-Kontexte
  (Algorithmus-Design-Hilfsmittel) bzw. die Einheit lebt explizit vom
  Kombinieren mehrerer Konstrukte (Verschachtelung), ein
  Notation-Wechsel wäre dort nicht zielführend.

Neue Einheiten: Notation nach demselben Kriterium wählen — zeigt die
Einheit reales Programmieren an einem konkreten Konstrukt (Praxisbeispiel
einer Sprache), echter Code; erklärt sie ein Konzept oder einen
Algorithmus sprachneutral, Pseudocode nach 8a.

---

## 8b. Musterlösungen (Übungsaufgaben)

Verbindlich für alle Einheiten mit einer Übungsaufgabe im Praxisbeispiel
(bisher: die Einheiten in `content/programmierung/`). Muster:

> Ausnahme seit Stand 2026-09-20: In `verzweigungen-if-else.html` und
> `schleifen.html` ist die Musterlösung echter Code (Python) statt
> Pseudocode — Struktur (`<details>`/`<summary>`, zugeklappt, kurzer
> Erläuterungssatz danach) bleibt identisch, siehe 8a. In
> `programmierparadigmen.html` entfällt das Übungsaufgabe/
> Musterlösung-Paar ganz, ersetzt durch einen offen sichtbaren
> Paradigmen-Vergleich (keine „Lösung“ im eigentlichen Sinn).

```html
<h3>Übungsaufgabe</h3>
<p>… Aufgabenstellung …</p>
<details class="loesung">
  <summary>Musterlösung anzeigen</summary>
  <pre><code>… Pseudocode gemäß Abschnitt 8a …</code></pre>
  <p>… kurze Erläuterung des Lösungswegs …</p>
</details>
```

- Natives `<details>`/`<summary>`, **kein JavaScript** — Auf-/Zuklappen ist
  reine Browser-Funktionalität.
- Standardmäßig zugeklappt (kein `open`-Attribut), damit die Aufgabe erst
  eigenständig bearbeitet werden kann, bevor die Lösung sichtbar wird.
- Lösung als `<pre><code>` im Pseudocode aus Abschnitt 8a, plus ein
  kurzer Erläuterungssatz danach — außer in den beiden Ausnahme-Einheiten
  oben, dort echter Code (Python) statt Pseudocode.
- Sitzt im `praxis`-Abschnitt, ergänzt das Praxisbeispiel, ersetzt keine
  der 5 Pflicht-Sektionen (Abschnitt 3).
- Druckverhalten: Ohne Sonderregel bliebe eine `<details>`-Lösung beim
  Ausdrucken zugeklappt (native UA-Stylesheet-Logik folgt dem `open`-Status
  auch im Druck). Deshalb erzwingt eine Regel im zentralen
  `@media print`-Block (Abschnitt 12) das Aufklappen unabhängig vom
  Bildschirm-Zustand — siehe dort.

---

## 9. Offene Punkte

- Abschnitt 8 (Fachbegriffe): Begriffspaare fehlen noch.
- ~~Bestandskorrektur toms.html/toms.json (Ersatzschreibweisen ae/ue/oe)~~ —
  erledigt, echte Umlaute eingesetzt.
- ~~`--acc-merksatz` (`#e3b341`, Amber) hat auf den hellen Themes (white/creme)
  weiterhin niedrigen Rahmenkontrast (~1.95:1 gegen Weiß)~~ — erledigt in
  Design-Batch 1, siehe Abschnitt 5 (jetzt `#a87718`, ≥3.0:1 gegen alle
  10 Hintergründe).
- `--acc-konzept`, `--acc-quiz` und `--fail` liegen je gegen mindestens einen
  `--surface-2`-Hintergrund unter 3.0:1 (Details siehe Abschnitt 5) — bei
  Design-Batch 1 nur mitgemessen, nicht korrigiert, offen für ein künftiges
  Batch.
- Quiz-Feedback (`--ok`/`--fail`) rein über Text-/Rahmenfarbe zu signalisieren
  ist grundsätzlich a11y-schwach (Farbe als einziges Signal). Sauberere Lösung
  (Hintergrund-Chip/Icon statt Textfarbe) als separate Folgeaufgabe vorgemerkt,
  nicht Teil des Theming-Umbaus.
- ~~Druck-Layout (Umbruchregeln, Ausblenden von Theme-Switcher/Quiz-Interaktion,
  Ankreuz-Quiz ohne Lösung)~~ — erledigt, siehe Abschnitt 12.

---

## 10. Quellmaterial & Fragenerzeugung

### Quellordner (außerhalb des Repos)
Lokaler Ordner mit IHK-Originalprüfungen, Musterlösungen und
Dozenten-Handouts. Der Pfad steht nur lokal in `CLAUDE.local.md`
(gitignored). Zugriff über `--add-dir` bzw. `/add-dir`.

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
Ausschließlich `data/<modul-slug>/<einheit-slug>.json` und die Inhalte unter
`content/`.
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
- Alle 8 aktuell existierenden Inline-SVGs (Stand Theming-Umbau) nutzen bereits
  durchgehend `var(--...)` — keine hardgecodeten Hex-Werte gefunden. Dadurch
  folgen Abbildungen automatisch allen vier Themes, ohne dass die SVGs selbst
  angepasst werden müssen.
- Ausnahme, die NICHT automatisch themefähig ist: `<img src="*.svg">`
  (referenzierte Rastergrafik-Einbindung statt Inline-SVG). Kommt aktuell
  nirgends vor — falls doch eingeführt, folgt sie dem Theme nicht (kein
  `var()`-Zugriff über die Dateigrenze) und muss separat gelöst werden.

---

## 12. Theming & Druck

### Fünf Themes, flache Liste

Fünf gleichberechtigte Themes, gesetzt über `data-theme` am `<html>`-Element:
`white` (neutrales Hell, Default), `dark` (neutrales Dunkel, entspricht der
ursprünglichen alleinigen `:root`), `creme` (warmes Cremeweiß, brauner
Unterton, Gold-Link), `terminal` (sehr dunkles Anthrazit,
Limettengrün-Akzent) und `sunset` (dunkles Lila/Violett, warmer
Orange-Akzent, Retro-Sunset-Optik). Das ist eine **flache Liste**, keine
zwei Achsen (kein "Skin über Hell/Dunkel-Modus") — `white`/`dark` sind zwei
von fünf gleichrangigen Optionen, keine Sonderrolle.

### Slot-Gruppen (siehe auch Abschnitt 5)

- **Gruppe 1** (Basis-UI, 7 Slots: `--bg`, `--surface`, `--surface-2`,
  `--text`, `--text-muted`, `--border`, `--link`) wird in JEDEM Theme-Block
  neu gesetzt. `white` hat **keinen eigenen Block** — die Werte liegen direkt
  als Default in `:root` und werden von
  `[data-theme="dark"|"creme"|"terminal"|"sunset"]` überschrieben.
- **Gruppe 2** (semantisch: Badges, Abschnitts-Akzente, Quiz-Feedback) steht
  **genau einmal** in `:root`, wird in keinem Theme-Block wiederholt und
  ändert sich nie zwischen Themes.

Konkrete Gruppe-1-Werte je Theme (alle außer `dark` als **Vorschlag**
markiert, justierbar):

| Slot | white (Default) | dark | creme (Vorschlag) | terminal (Vorschlag) | sunset (Vorschlag) |
|---|---|---|---|---|---|
| `--bg` | `#ffffff` | `#0f1720` | `#f5efe0` | `#0d0f0d` | `#1a1029` |
| `--surface` | `#f4f5f7` | `#1b2530` | `#fffcf5` | `#141714` | `#2b1b42` |
| `--surface-2` | `#e9ebee` | `#223042` | `#ece0c4` | `#1c201c` | `#3d2659` |
| `--text` | `#1a2430` | `#e6edf3` | `#3a2f22` | `#c9f2c0` | `#f3e8fb` |
| `--text-muted` | `#5b6772` | `#9fb0c0` | `#7d6a4e` | `#7c9c74` | `#b79bd4` |
| `--border` | `#d8dce1` | `#2b3947` | `#ddccaa` | `#2a332a` | `#4d3166` |
| `--link` | `#1f6feb` | `#4aa3ff` | `#9c6b1a` (Gold) | `#39ff14` (Lime) | `#ff8a3d` (Orange) |

`sunset`-Kontrast gegen `--bg` (rechnerisch geprüft): `--text` ~15.4:1,
`--text-muted` ~7.5:1, `--link` ~7.8:1 — alle deutlich über WCAG AA (4.5:1),
`--text`/`--text-muted` sogar über AAA (7:1). `--border` ~1.7:1, bewusst
niedrig wie bei den anderen Themes (reiner Trennlinien-Akzent, kein Text).

Farbnutzung als Voraussetzung: ausschließlich über CSS-Variablen, nirgends
Hex-Werte in HTML, SVG oder Inline-Styles außerhalb von `assets/style.css`
(siehe Abschnitt 11) — sonst bricht der Theme-Wechsel an dieser Stelle.

### Systemerkennung, Persistenz, FOUC (`assets/theme.js`)

- Beim Laden: gespeichertes Theme aus `localStorage` (Key `fisi:theme`) hat
  Vorrang. Sonst `window.matchMedia("(prefers-color-scheme: dark)")` →
  `dark` bei dunkler Systempräferenz, sonst `white`. `creme`/`terminal` sind
  reine Nutzerwahl, das System kennt nur hell/dunkel.
- Jede manuelle Auswahl im Menü (auch explizit „White“ oder „Dark“)
  überschreibt die Systemerkennung dauerhaft und wird in `localStorage`
  gespeichert. Solange kein manueller Wert gespeichert ist, reagiert die
  Seite live auf Änderungen der Systempräferenz.
- FOUC-Vermeidung: ein winziges Inline-`<script>` im `<head>`, **vor** dem
  `<link rel="stylesheet">`, setzt `data-theme` synchron und pfadunabhängig
  (kein Asset-Pfad nötig, da nur `localStorage`/`matchMedia`/`documentElement`
  angefasst werden — dieselbe Zeile funktioniert identisch in `index.html`
  und jeder Unit). Das eigentliche `assets/theme.js` (Menü-Aufbau, Klick-
  Handling, `matchMedia`-Listener) lädt normal am Seitenende nach
  `quiz-engine.js` und muss NICHT blockierend eingebunden werden, da das
  Inline-Snippet die FOUC-kritische Arbeit bereits erledigt hat.
- Beide Ergänzungen sind rein mechanisch (ein Inline-Snippet + ein
  `<script src=".../assets/theme.js">`) und enthalten keine
  einheiten-spezifische Logik — die Regel „Einheiten-HTML enthält KEINE
  theme-spezifische Logik“ bleibt damit gültig.

### Umschalt-Menü

Ein Button/Menü, von `theme.js` selbst in den DOM injiziert (kein
manuelles Markup in den Units nötig), mit fünf Einträgen in fester
Reihenfolge: **White, Dark** (das Hell/Dunkel-Paar, oben), darunter durch
einen Trenner abgesetzt **Creme, Terminal, Sunset** (die Spezialdesigns).
Button-Beschriftung: `Farbe: <Label>` (z. B. „Farbe: Sunset“) — Präfix
bewusst „Farbe“ statt „Theme“. Zeigt die aktive Auswahl an (Haken-Präfix +
Linkfarbe). Barrierefrei: `role="menu"`/`menuitemradio`, `aria-haspopup`,
`aria-expanded`, `aria-checked`, Pfeiltasten-Navigation im Menü, Escape
schließt, Klick außerhalb schließt. Kein CDN, reines Vanilla-JS/CSS.

### Druck

- Druckgranularität: eine Einheit = ein Druckvorgang. Kein Sammeldruck.
- Alles Druck-Verhalten steht in **einem einzigen** `@media print`-Block in
  `style.css` (keine zweite, separate Print-Regel anlegen). Der Block steht
  nach den Theme-Blöcken, damit die Spezifität greift. Einheiten-HTML
  enthält keine Druck-Sonderlogik — Voraussetzung dafür ist, dass alle
  interaktiven Tools konsistent `class="tool"` tragen und Quiz-Buttons/
  -Feedback ausschließlich über `.btn`/`.quiz__feedback`/`.quiz__result`
  laufen (zentral von `quiz-engine.js` erzeugt, siehe Abschnitt 6) — beides
  beim Print-Umbau geprüft, keine Ausnahme gefunden.
- `@media print` erzwingt IMMER die white-Gruppe-1-Werte, unabhängig vom
  aktiven Theme.
- Mehrseitiger Fluss ist gewollt. Kein Herunterskalieren auf eine Seite.

**Ausgeblendet beim Druck** (reine Bildschirm-UI ohne Papier-Nutzen):
Theme-Switcher, Breadcrumbs (die Unit-`<h1>` liefert den Titel bereits),
Footer inkl. „← Zurück zum Lernplan“-Link (steckt vollständig im
ausgeblendeten `.site-footer`, keine eigene Klasse nötig), der
Auf-/Zuklapp-Chevron der Modulkarten (`.module-card__head::after`),
interaktive Tools (`.tool`, komplett) inkl. ihrer kurzen
Einleitungssätze (`.tool-intro`, siehe Abschnitt 3), Quiz-Buttons
(`.btn`) und Quiz-Feedback/-Ergebnis (`.quiz__feedback`, `.quiz__result`).

**Sichtbar beim Druck:** alle 5 Pflicht-Sektionen, Abbildungen
(`.figure--diagram`), Musterlösungen (`details.loesung`, siehe Abschnitt 8b),
Quizfragen inkl. Antwortoptionen — aber als leeres Ankreuz-Formular:

- `details.loesung > *:not(summary) { display: block !important; }` erzwingt
  im Druck den aufgeklappten Zustand unabhängig vom `open`-Attribut bzw. dem
  Bildschirm-Zustand — sonst würde eine zugeklappte Musterlösung (der
  Normalzustand auf dem Bildschirm) auch auf Papier zugeklappt erscheinen.
  Die `<summary>` verliert ihren nativen Aufklapp-Indikator (Marker/Cursor),
  da sie im Druck ohnehin nicht mehr interaktiv ist.
- Radio-Inputs werden per `display: none` versteckt, stattdessen zeigt
  `.quiz__label::before` ein Kästchen-Zeichen (`☐`) zum Ankreuzen per Stift.
- Quiz-Optionen verlieren Rahmen/Hintergrund und werden kompakter (kleinere
  Schrift, engerer Abstand) — auf Papier keine "Klick-Kachel" nötig.
- **Lösungen erscheinen nie im Druck**, auch nicht, wenn auf dem Bildschirm
  vorher schon "Auswerten" angeklickt wurde: Neben Buttons/Feedback wird
  auch die Korrekt/Falsch-Randfarbe (`.quiz__option--correct/--wrong`)
  explizit neutralisiert.

**Umbruchregeln** — sinnvoll, nicht "jeden Umbruch verhindern":
- `h2, h3 { break-after: avoid; }` — Überschrift klebt am folgenden Inhalt.
- `table, tr { break-inside: avoid; }` — Tabellen/-zeilen werden nicht
  zerrissen.
- `break-inside: avoid` gezielt für die von Natur aus kurzen Blöcke:
  Abbildungen, Einstieg-/Praxis-/Merksatz-Abschnitt, einzelne Quizfragen
  (`.quiz__q`).
- **Bewusst KEIN** pauschales `.section { break-inside: avoid; }` — der
  Konzept-Abschnitt kann mit Tabellen lang werden und soll ganz normal über
  mehrere Seiten laufen dürfen, statt in eine erzwungene Lücke gepresst zu
  werden.

---

## 13. Modulübersicht (Index-Seite)

- Jede Modul-Karte auf `index.html` ist ein natives `<details class="module-card">`
  — kein JS-Toggle. Standard: `open` gesetzt (aufgeklappt).
- Der Modul-Header (Titel + Fortschrittsanzeige rechts) ist das
  `<summary class="module-card__head">`. Fortschrittsbalken und
  Einheiten-Liste stehen als Inhalt danach im selben `<details>`.
- Struktur: `<ul class="module-list"><li><details class="module-card">…</details></li></ul>`
  — das `<li>` bleibt als gültiger Listen-Wrapper erhalten, die Klasse
  `module-card` sitzt direkt auf dem `<details>`.
- Default-Dreieck-Marker wird entfernt:
  `summary::-webkit-details-marker { display: none; }` (WebKit/Blink) plus
  `list-style: none;` auf dem Summary-Element (Firefox).
- Stattdessen ein eigener Chevron-Indikator per `::after`-Pseudoelement
  (Border-Ecke, 45°-Rotation), der beim Öffnen über
  `.module-card[open] > .module-card__head::after` seine Rotation ändert.
- Diese Abschnittsstruktur ist rein clientseitiges HTML/CSS, keine
  JS-Logik nötig; `index.html` befüllt weiterhin nur Titel, Zähler,
  Fortschrittsbalken und Einheiten-Links aus `manifest.json`.

---

## 14. Format von data/manifest.json

`data/manifest.json` ist die einzige Quelle, aus der `index.html` die
Modulübersicht rendert (Titel, Fortschrittszähler, Einheiten-Links,
Badges). Kein anderer Ort im Projekt bestimmt Reihenfolge oder Anzeige.

### Felder

Top-Level:
- `title` (String) — Seitentitel, angezeigt in `<h1>` von index.html.
- `modules` (Array) — alle 13 Module, siehe unten.

Pro Modul-Objekt:
- `slug` (String) — fixer Modul-Slug aus Abschnitt 1 (z. B. `it-sicherheit`).
  Wird als `id` auf dem `<details class="module-card">` verwendet
  (Sprungziel für `index.html#<slug>`-Links aus den Breadcrumbs).
- `name` (String) — Anzeigename des Moduls (mit Umlauten, siehe Abschnitt 2).
  Erscheint in Modulkarte und Brotkrumen.
- `short` (String) — Kurzname des Moduls für den Seitentitel
  (`<short>: <Einheit>`, Abschnitt 2), z. B. `Kalkulation` statt
  „Kalkulation & Grundrechnen“.
- `units` (Array) — die Einheiten dieses Moduls, siehe unten. Leeres Array
  `[]`, solange keine Einheit gebaut ist (rendert „Noch keine Einheiten
  angelegt.“).

Pro Unit-Objekt (Eintrag in `units`):
- `slug` (String) — Einheiten-Slug, identisch mit dem Dateinamen ohne
  `.html` (siehe Abschnitt 1).
- `name` (String) — Anzeigename der Einheit (Umlaute erlaubt).
- `exams` (Array von Strings) — ein oder zwei Werte aus `"ap1"` / `"ap2"`,
  steuert das Badge aus Abschnitt 4 sowie den AP1/AP2-Filter (Abschnitt 15b).
  Kein kombinierter Wert, immer als Array mit 1–2 Einträgen.
- `quiz` (String) — Pfad zur Quiz-JSON relativ zum Repo-Root
  (`data/<modul-slug>/<einheit-slug>.json`), identisch mit dem Pfad, der
  in der Einheit als `data-quiz-src` (dort relativ von der Einheit aus)
  eingebunden ist.
- `aliases` (Array von Strings, **optional**) — alternative Suchbegriffe,
  unter denen die Einheit ebenfalls gefunden werden soll, obwohl sie nicht
  im sichtbaren `name` vorkommen (z. B. `["Teilkostenrechnung"]` für die
  Einheit „Zuschlagskalkulation & BAB“, `["Vollkostenrechnung"]` für
  „Handelskalkulation“). Wird ausschließlich von `assets/search.js`
  mitdurchsucht (siehe Abschnitt 15a) — fließt nirgends in Anzeige,
  Breadcrumb oder Seitentitel ein, ein Treffer über Alias zeigt immer den
  echten `name`. Fehlt das Feld, verhält sich die Einheit wie bisher (rein
  titelbasierte Suche). Kein Pflichtfeld, beliebig erweiterbar für weitere
  Einheiten.
- `scripts` (Array von Strings, **optional**) — Tool-Skripte der Einheit,
  relativ zu `assets/` (z. B. `["tools/raid-rechner.js"]`). Der Generator
  bindet sie nach `theme.js` ein (Abschnitt 1, Interaktive Tools).
- `zaehlt_nicht` (Boolean, **optional**) — Einheit zählt nicht zum
  Lernfortschritt (Modul `pruefung`); ausgewertet von `index.html` und
  `assets/progress-io.js`.

### Reihenfolge-Logik

- Die Reihenfolge der `modules` im Array ist die feste Katalogreihenfolge
  — nicht alphabetisch nach Slug.
- Die Reihenfolge der `units` innerhalb eines Moduls ist die
  Lern-/Anzeigereihenfolge (Themenreihenfolge) — nicht
  alphabetisch nach Slug. Genau das meint CONVENTIONS §1 mit „Reihenfolge
  steuert das Manifest, nicht der Dateiname“.
- Neue Einheiten werden also durch Einfügen an der richtigen Position im
  `units`-Array einsortiert, nicht angehängt, wenn sie thematisch früher
  gehören.

### Beispiel

```json
{
  "title": "Lernplan FISI – AP1 & AP2",
  "modules": [
    {
      "slug": "it-sicherheit",
      "name": "IT-Sicherheit",
      "short": "IT-Sicherheit",
      "units": [
        {
          "slug": "schutzziele-cia",
          "name": "Schutzziele (CIA)",
          "exams": ["ap1", "ap2"],
          "quiz": "data/it-sicherheit/schutzziele-cia.json"
        }
      ]
    },
    {
      "slug": "hardware",
      "name": "Hardware & Technologien",
      "short": "Hardware",
      "units": [
        {
          "slug": "raid-level",
          "name": "RAID-Level",
          "exams": ["ap2"],
          "quiz": "data/hardware/raid-level.json",
          "scripts": ["tools/raid-rechner.js"]
        }
      ]
    }
  ]
}
```

---

## 15a. Suche

Suche über Lerneinheiten-**Titel** (Unit-Name aus `data/manifest.json`), keine
Volltextsuche über Fließtext oder Abschnitts-Überschriften.

### Umsetzung

- Zentrales Skript `assets/search.js` (analog `theme.js`): injiziert das
  komplette Such-Markup selbst, kein such-spezifisches HTML in den Einheiten.
- Einbindung: `<script src="../../assets/search.js"></script>` steht in
  `templates/scripts-<typ>.html` (Einheiten) bzw.
  `<script src="assets/search.js"></script>` in `index.html`, direkt neben
  der bestehenden `theme.js`-Einbindung.
- Datenquelle: `data/manifest.json` (Unit-Name + Modul-Name je Einheit).
  Kein separater Suchindex nötig — Reihenfolge/Erweiterung folgt automatisch
  aus dem ohnehin gepflegten Manifest, keine zusätzliche Build-Pflicht.
- Optional pro Unit: `aliases` (Abschnitt 14) werden mitdurchsucht (gleiche
  Umlaut-/Case-Normalisierung wie der Titel), aber nie angezeigt — ein
  Treffer über Alias zeigt immer den echten Unit-Namen. Alias-Treffer
  gelten nie als exakter Treffer (Score-Stufe „exakt" bleibt dem echten
  Titel vorbehalten), sonst würde ein Alias-Volltreffer einen echten
  Titel-Teiltreffer in der Sortierung überholen.
- Pfadauflösung: `search.js` liest seinen eigenen `<script src="…">`-Wert
  (`document.currentScript`) und leitet daraus das relative Präfix zum
  Repo-Root ab — genau wie `style.css`/`theme.js` bereits jeweils
  `"assets/…"` (Index) bzw. `"../../assets/…"` (Einheiten) verwenden.

### Verhalten

- Ruhezustand: Eingabefeld unauffällig (gedämpfte Farben), reagiert nicht
  im Hintergrund. Erst nach Fokus/Eingabe wird gefiltert.
- Leeres Feld → keine Treffer-Liste sichtbar (kein Dropdown mit allen
  165 Einheiten).
- Treffer sortiert nach Relevanz: exakter Treffer > Anfangstreffer >
  Teiltreffer (bei Gleichstand: Manifest-Reihenfolge).
- Umlaut- und Case-tolerant: Vergleich läuft über eine normalisierte Form
  (`ä→ae`, `ö→oe`, `ü→ue`, `ß→ss`, kleingeschrieben) auf beiden Seiten
  (Query und Unit-Name) — „Prüfung“ und „Pruefung“ finden dieselben Treffer.
- Pro Treffer angezeigt: Unit-Name + Modulname (Orientierung). Kein
  Themen-Feld, da `data/manifest.json` (Abschnitt 14) kein Thema-Feld
  enthält — nur Modul/Einheit, keine Modul/Thema-Gliederung.
- Tastatur: Pfeil-runter/-hoch bewegt die Auswahl, Enter öffnet die
  aktive Einheit, Escape schließt die Liste. ARIA-Combobox-Muster
  (`role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`,
  Listbox mit `role="option"`).
- Klick auf einen Treffer öffnet die Unit-Seite direkt.

### Platzierung

- Suche sitzt in derselben Kopfzeile wie der Breadcrumb ("Lernplan …"),
  nicht unter Titel/Fortschrittsbalken. `search.js` verschiebt dafür zur
  Laufzeit den bestehenden `.breadcrumbs`-Nav zusammen mit dem Suchfeld in
  einen neuen Wrapper `<div class="site-header__top">` (Flex-Zeile,
  `justify-content: space-between`) — Breadcrumb links, Suche rechts davon,
  auf gleicher Höhe. Titel/Fortschrittsbalken bleiben als eigene Elemente
  danach im `.site-header` unverändert. Rein per DOM-Umbau zur Laufzeit,
  keine Änderung an der Einheiten-HTML nötig.
  **Ausnahme `index.html`:** hat keinen `.breadcrumbs`-Nav (Abschnitt 15d,
  „Header-Toolbar“) — „Lernplan“ als einziger Eintrag wäre direkt über der
  H1 redundant. `search.js` läuft dort unverändert über seinen bestehenden
  Fallback-Zweig (kein `.breadcrumbs` gefunden → `topRow` wird als erstes
  Kind eingefügt), eine index-spezifische CSS-Regel hält die Actions-Gruppe
  trotzdem rechtsbündig.
- `index.html`: Modifier-Klasse `.site-search--prominent` (breiter,
  `flex: 0 1 20rem`). Einheiten-Seiten: `.site-search--compact`
  (`flex: 0 1 14rem`), damit man nach dem Öffnen einer Einheit weitersuchen
  kann, ohne zurück zur Übersicht zu müssen.
- Optik an den Theme-Umschalter-Button angeglichen (gleiche Rundung
  `999px`, Rahmenbreite/-farbe `var(--border)`, Höhe, Schriftgröße `0.8rem`)
  — im Ruhezustand aber bewusst gedämpfter (`var(--surface-2)` /
  `var(--text-muted)` statt `var(--surface)` / `var(--text)`), damit die
  Unauffälligkeits-Anforderung erhalten bleibt.
- Der Theme-Umschalter-Button sitzt seit dem Design-Fix ebenfalls in dieser
  Zeile statt fixiert in der Ecke: `theme.js` sucht `.site-header__actions`
  (von `search.js` angelegt, enthält die Suche) und hängt seinen Button dort
  direkt daneben ein — rechtsbündig, mit `position: relative` statt
  `position: fixed`. Findet `theme.js` diesen Container nicht (Fallback,
  z. B. falls `search.js` je entfernt wird), landet der Button wie früher
  fixiert oben rechts im `document.body`.
- `.site-header__top` ist eine Flex-Zeile mit `flex-wrap: wrap` (Breadcrumb
  vs. Actions-Gruppe wechselt auf schmalen Viewports die Zeile).
  `.site-header__actions` selbst hat bewusst `flex-wrap: nowrap` — Suche und
  Theme-Button sollen als Gruppe zusammenbleiben und nicht intern
  untereinander rutschen, nur die Suche darf schrumpfen (`min-width: 0` auf
  `.site-search--prominent`/`--compact`, sonst verhindert der Flexbox-Default
  `min-width: auto` das Schrumpfen). Geprüft bei 375px Breite: kein
  Overlap, kein horizontales Scrollen.
- Reihenfolge der `<script>`-Tags ist wichtig: `search.js` muss vor
  `theme.js` NICHT zwingend im Markup stehen (aktuell steht `theme.js`
  zuerst) — `theme.js` deferred seinen `buildUI()`-Aufruf über
  `document.readyState`/`DOMContentLoaded` auf einen Zeitpunkt nach der
  synchronen Ausführung aller Script-Tags, zu dem `.site-header__actions`
  bereits existiert. Falls diese Defer-Logik in `theme.js` je entfernt wird,
  muss `search.js` vor `theme.js` geladen werden, sonst hängt der Button
  wieder im Fallback (fixiert) statt neben der Suche.
- Beim Druck (`@media print`) vollständig ausgeblendet (`.site-search` und
  `.site-header__top` in der bestehenden Ausblend-Liste neben
  `.theme-switcher`).

### Idempotenz-Schutz

`search.js` prüft ganz am Anfang `if (document.getElementById("site-search-input")) return;`
und bricht sonst sofort ab. Schutz gegen doppelte Injektion (doppelte IDs),
falls das Skript je zweimal auf derselben Seite ausgeführt würde.

### Bekannte Einschränkung (Stand jetzt)

- h2 ist in jeder Einheit identisch (Einstieg/Konzept/Praxis/Merksatz/Quiz,
  Abschnitt 3) und wird nicht durchsucht. h3-Zwischenüberschriften und
  Merksatz stehen in `data/search-index.json` (erzeugt von
  `tools/build_search_index.py`, Abschnitt 16) und liefern Inhaltstreffer
  als unterste Relevanzstufe.

### Wichtiger CSS-Hinweis (Bugfix beim Bau dieser Funktion)

`transition` auf `background`/`border-color`/`color`, wenn deren Werte über
CSS-Variablen aus den `[data-theme="…"]`-Blöcken kommen, kann dazu führen,
dass `.site-search__input` nach einem Theme-Wechsel auf den Farben des
vorherigen Themes hängen bleibt (reproduzierbar über die echte
Theme-Switcher-UI, kein Test-Artefakt). Deshalb hat `.site-search__input`
bewusst **keine** `transition` auf diesen Eigenschaften. Falls hier künftig
wieder eine Übergangsanimation ergänzt wird: nach jedem der vier Themes
einmal durchklicken und die berechnete Hintergrund-/Rahmen-/Textfarbe des
Elements prüfen, nicht nur den `data-theme`-Attributwert.

---

## 15b. Filter (AP1/AP2)

Filter über die Modulliste auf `index.html` nach Prüfungsteil. Existiert nur
dort — auf Einheiten-Seiten gibt es keine Modulliste zum Filtern, daher wird
kein Filter-Markup/-Skript in die Einheiten eingebunden (anders als
Theme/Suche, die auf jeder Seite laufen).

### Umsetzung

- Zentrales Skript `assets/filter.js`, Optik/Aufbau 1:1 an `theme.js`
  angeglichen (Button + selbst injiziertes Dropdown-Menü, gleiche Rundung/
  Rahmen/Höhe/Schriftgröße, Klasse `.filter-switcher` statt
  `.theme-switcher`). Menü-Aufbau: oben ein `Alle`-Eintrag, per Trenner
  (`.filter-switcher__sep`, analog `.theme-switcher__sep`) abgesetzt von
  AP1/AP2 darunter. Alle drei Einträge sind Radios (`role="menuitemradio"`)
  in **einem** Set — genau wie beim Theme-Menü ist zu jedem Zeitpunkt genau
  einer der drei aktiv (Single-Select, keine Checkboxen, keine
  Mehrfachauswahl).
- Pflicht-Edit: genau eine Zeile
  `<script src="assets/filter.js"></script>` in `index.html`, direkt neben
  der bestehenden `theme.js`/`search.js`-Einbindung. Keine Änderung an den
  Einheiten-Dateien.
- Datenquelle: Das bestehende `exams`-Array pro Unit aus
  `data/manifest.json` (Abschnitt 14) — kein separates Datenfeld nötig. Das
  Index-Rendering (`index.html`, Inline-Script) setzt zusätzlich
  `data-exams="ap1,ap2"` (bzw. nur einen Wert) auf jedes
  `<li class="module-card__unit">`, damit `filter.js` rein über DOM-Attribute
  filtern kann, ohne selbst noch einmal `manifest.json` zu laden.

### Verhalten

- Single-Select, genau drei sich gegenseitig ausschließende Zustände:
  `alle` (Standard beim Laden), `ap1`, `ap2`. Immer genau einer aktiv, nie
  keiner und nie mehrere gleichzeitig.
- `alle` zeigt alle Einheiten unabhängig von `exams`. `ap1`/`ap2` zeigen nur
  Einheiten, deren `exams`-Array den jeweiligen Wert enthält (Einheiten mit
  beiden Badges erscheinen entsprechend bei `ap1` UND bei `ap2`, aber nie
  bei nur einem der beiden gleichzeitig aktiven Filter, da ohnehin nur ein
  Filterwert zur Zeit aktiv sein kann).
- Button-Beschriftung zeigt den aktiven Zustand: `Filter: Alle`,
  `Filter: AP1` oder `Filter: AP2`.
- Persistenz in `localStorage` (Key `fisi:filter`, einfacher String-Wert
  `"alle"`/`"ap1"`/`"ap2"`) — Auswahl bleibt über Seitenaufrufe hinweg
  erhalten, analog zu Theme (`fisi:theme`) und Fortschritt (`fisi:*` in
  `quiz-engine.js`). Altes JSON-Array-Format (frühere Checkbox-Variante)
  wird beim Lesen migriert: genau ein gültiger Wert wird übernommen, sonst
  (leer oder beide) greift `alle`.
- Gefilterte Einheiten werden per `hidden`-Attribut auf dem
  `<li class="module-card__unit">` ausgeblendet, nicht aus dem DOM entfernt
  (Fortschritts-/Done-Zählung pro Modul bleibt dadurch unangetastet, siehe
  `renderModule()` in `index.html`, die zählt unabhängig vom Filter). Eine
  Modulkarte, deren Einheiten durch den Filter komplett verschwinden, wird
  selbst ebenfalls über `hidden` ausgeblendet (kein leerer Kartenrumpf).
- Ein `MutationObserver` auf `#module-list` wendet den Filter nach jedem
  (Neu-)Rendering der Modulliste erneut an — nötig, weil die Liste
  asynchron erst nach dem `manifest.json`-Fetch befüllt wird, unabhängig von
  der Script-Ladereihenfolge zwischen `filter.js` und dem Inline-Skript in
  `index.html`.
- Idempotenz-Schutz analog `search.js`:
  `if (document.getElementById("filter-switcher-btn")) return;` gegen
  doppelte Injektion.
- Beim Druck (`@media print`) vollständig ausgeblendet (`.filter-switcher`
  in derselben Ausblend-Liste wie `.theme-switcher`/`.site-search`).

### Platzierung

- Button sitzt wie der Theme-Umschalter standardmäßig in
  `.site-header__actions` (von `search.js` angelegt), rechts neben Suche und
  Theme-Button in derselben Kopfzeile. Fallback auf fixierte Position oben
  rechts im `document.body`, falls dieser Container fehlt — identisches
  Fallback-Muster wie `theme.js`.

---

## 15c. Willkommens-Popup

Einmaliges Hinweis-Overlay auf `index.html`, das kurz die wichtigsten
Features nennt (Aufbau der Einheiten, lokaler Fortschritt inkl. 80&nbsp;%-
Schwelle, interaktive Tools, Farbschemata, Druck pro Einheit) sowie einen
rechtlichen Hinweis, dass für Richtigkeit/Vollständigkeit keine Gewähr
übernommen wird.

### Umsetzung

- Zentrales Skript `assets/welcome.js` (analog `theme.js`/`filter.js`):
  injiziert das komplette Popup-Markup selbst, kein Popup-HTML statisch in
  `index.html`. Pflicht-Edit: genau eine Zeile
  `<script src="assets/welcome.js"></script>`, direkt neben der
  bestehenden `filter.js`-Einbindung.
- Existiert nur auf `index.html` — Einheiten-Seiten binden das Skript gar
  nicht erst ein (anders als Theme/Suche, die auf jeder Seite laufen).
- Persistenz in `localStorage` (Key `fisi:welcome-seen`, Wert `"1"` nach
  dem Schließen) — Key-Präfix `fisi:` wie Theme (`fisi:theme`), Filter
  (`fisi:filter`) und Fortschritt (`fisi:*` in `quiz-engine.js`). Kein
  eigenes "Nicht mehr anzeigen"-Steuerelement: einmal geschlossen (egal
  über welchen der drei Wege) heißt endgültig nicht mehr anzeigen, bis
  `localStorage` geleert wird.
- Öffnet automatisch beim Laden, sofern der Key noch nicht gesetzt ist.
  Rein additiv zum bestehenden `manifest.json`-Fetch/Modullisten-Rendering
  in `index.html` — kein Eingriff in dessen Ablauf, blockiert das Laden
  der Modulliste nicht.
- Barrierefrei: `role="dialog"`, `aria-modal="true"`,
  `aria-labelledby` auf die Überschrift. Fokus geht beim Öffnen auf den
  Schließen-Button (einziges interaktives Element im Dialog), Fokus-Falle
  hält `Tab`/`Shift+Tab` innerhalb des Dialogs. Schließen über
  Button-Klick, `Escape` oder Klick auf die Overlay-Fläche außerhalb des
  Dialogs — alle drei Wege setzen den Key und entfernen das Overlay
  vollständig aus dem DOM (nicht nur `hidden`). Da kein auslösendes
  Element existiert (Auto-Open), geht der Fokus danach auf das
  Suchfeld (`.site-search__input`), falls vorhanden, sonst auf `<body>`.
- Idempotenz-Schutz analog `search.js`/`filter.js`:
  `if (document.getElementById("welcome-overlay")) return;` gegen
  doppelte Injektion.
- Beim Druck (`@media print`) vollständig ausgeblendet (`.welcome-overlay`
  in derselben Ausblend-Liste wie `.theme-switcher`/`.site-search`).
- Farben ausschließlich über CSS-Variablen (`--surface`, `--text`,
  `--border`, `--text-muted`, `.btn`/`.btn--primary`), keine Hex-Werte —
  funktioniert dadurch automatisch in allen fünf Themes. Die
  Overlay-Abdunkelung (`rgba(0, 0, 0, 0.55)`) und der Box-Shadow
  (`rgba(0, 0, 0, 0.25)`) sind kein Hex-Wert und folgen demselben Muster,
  das bereits bei `.theme-switcher__menu`/`.filter-switcher__menu`/
  `.site-search__results` verwendet wird.

---

## 15d. Alle Merksätze drucken

Eigenständige Seite `merksaetze.html` (Root-Ebene, analog `index.html`),
die eine druckbare Sammelansicht aller Merksätze aus allen Einheiten
erzeugt (Einheitsname + Merksatz-Text, gruppiert nach Modul, in
Manifest-Reihenfolge). Erreichbar über einen Link-Button auf `index.html`,
unterhalb von Farbe- und Filter-Button (siehe „Header-Toolbar-Grid“
unten). Sichtbarer Text immer mit echtem Umlaut „Merksätze“ — nur der
Dateiname `merksaetze.js`/`merksaetze.html` bleibt aus Abschnitt-1-Gründen
ASCII (Ersatzschreibweise „Merksaetze“ ist NIRGENDS im sichtbaren Text
zulässig, auch nicht in Titel, Überschriften oder Button-Beschriftung).

### Architekturentscheidung: eigene Seite statt Overlay

Bewusst **keine** Overlay-Lösung auf `index.html`, sondern eine eigene
HTML-Datei mit eigener URL. Grund: `window.print()`/Strg+P drucken die
aktuelle Seite — ein Overlay müsste zusätzlich die Modulliste dahinter
zustandsabhängig ausblenden, und `position: fixed`-Overlays verhalten sich
browserübergreifend im Druck unzuverlässig (Clipping/Wiederholung über
mehrere Seiten unterschiedlich je nach Browser). Eine eigene Seite
verwendet das normale `.site-header`/`.site-main`/`.site-footer`-Skelett
und erbt dadurch **ohne jede neue Regel** das komplette bestehende
Druckverhalten (Abschnitt 12): White-Theme-Erzwingung, Ausblenden von
Breadcrumb/Footer, Umbruchregeln.

### Muster: Sammelansicht per DOMParser aus Unit-HTML

Quelle der Merksätze ist **live** der `#merksatz`-Abschnitt jeder
Einheiten-HTML zur Laufzeit (`fetch` + `DOMParser`), keine separate
Datenkopie/kein Build-Schritt — die Sammelansicht kann nie veralten,
solange eine Einheit den festen 5-Abschnitt-Aufbau (Abschnitt 3) einhält.
Dieses Muster (fremde HTML-Datei fetchen, gezielt einen Abschnitt
extrahieren, sicher in die eigene Seite übernehmen) ist wiederverwendbar
für künftige Sammelansichten (z. B. „Alle Praxisbeispiele“):

- **Nie `innerHTML`/`outerHTML` von Fremd-Fetch-Inhalt zuweisen.** Statt-
  dessen: `new DOMParser().parseFromString(html, "text/html")` (parst
  inert, führt keine `<script>`-Tags aus) → gezielt den benötigten Knoten
  per `querySelector` finden (hier: `#merksatz.section--merksatz p`) →
  `document.importNode(node, true)` zum sicheren Übernehmen in die eigene
  Seite (statt eines Strings).
- **Inline-Tag-Allowlist statt Blockliste.** Nur `CODE`/`STRONG`/`EM`/`B`/
  `I`/`BR` bleiben als Element erhalten (mit allen Attributen gestrippt —
  kein `href`/`style`/`on*`), alles andere wird **entpackt** (Kinder an
  seine Stelle geschoben, Element selbst entfernt) statt gelöscht — der
  Lerninhalt bleibt vollständig sichtbar, auch wenn künftig unerwartetes
  Markup im Quelltext auftaucht.
- Pfade werden aus `data/manifest.json` abgeleitet
  (erzeugte Seite `module/<modul-slug>/<einheit-slug>.html`, siehe Abschnitt 14), nie
  hartcodiert — Reihenfolge = Manifest-Reihenfolge.

### Gedrosselte Parallelität

181 Einheiten-Fetches gleichzeitig sind auf GitHub Pages spürbar. Statt
strikt sequenziell (langsam) oder alle auf einmal (Lastspitze) läuft ein
**Worker-Pool fester Größe** (`CONCURRENCY = 8` in `assets/merksaetze.js`):
maximal 8 gleichzeitige Fetches, der nächste startet, sobald einer fertig
ist. Fortschrittsanzeige `"x / 181 geladen"` aktualisiert sich nach jedem
einzelnen Abschluss (nicht erst am Ende eines Batches).

### Fehlertoleranz

Jede Einheit wird einzeln in `try`/`catch` geladen (Netzwerkfehler,
HTTP-Fehlerstatus, fehlende `#merksatz`-Section, fehlendes `<p>` darin).
Ein Fehler überspringt nur diese eine Einheit, bricht die restliche Ladung
nicht ab. Alle Fehler werden gesammelt und nach Abschluss sichtbar unter
„Nicht geladen (N)“ gelistet (Modul – Einheit: Grund).

### Header-Toolbar (`.site-header__buttons`)

> Stand seit dem Umbau „kein Breadcrumb + Flex-Toolbar“ auf `index.html`
> (Design-Fix, weil „Lernplan“ als einziger Breadcrumb-Eintrag direkt über
> der H1 „Lernplan FISI …“ redundant wirkte). Ersetzt die frühere
> 2-Spalten-Grid-Beschreibung unten.

`index.html` hat **keinen** `.breadcrumbs`-Nav (anders als die
Einheiten-Seiten, Abschnitt 2) — die H1 direkt darunter macht ihn
redundant. `search.js` baut `.site-header__top` trotzdem unverändert:
findet es kein `.breadcrumbs`-Element, greift der bestehende
Fallback-Zweig (`header.insertBefore(topRow, header.firstChild)`), keine
Änderung an `search.js` nötig. Damit `.site-header__top` (weiterhin
`justify-content: space-between`, für den 2-Kind-Fall auf Einheiten-Seiten
gedacht) sein einziges Kind nicht an den linken Rand rutschen lässt, gibt
es eine index-spezifische Override-Regel über `body:has(#module-list)`
(Erkennungsmuster analog zu `isIndex` in `search.js`):

```css
body:has(#module-list) .site-header__top { justify-content: flex-end; }
```

Auf `index.html` besteht `.site-header__actions` aus genau zwei direkten
Kindern: der Suche und `.site-header__buttons`. Seit dem Umbau auf
Icon-Buttons (Farbe/Zahnrad/Filter als runde Kreise statt Textpillen,
siehe unten) ist die Toolbar schmal genug, um **in derselben Zeile** wie
die Suche zu stehen (wie auf den Einheiten-Seiten) — kein eigener
Umbruch mehr wie in einer früheren Zwischenversion mit Textpillen. Die
Suche bekommt dafür eine kleinere Basisbreite als auf Einheiten-Seiten
(`.site-search--prominent` dort: `flex: 1 1 20rem; min-width: 22rem`) und
wächst über `flex-grow` in den jeweils verbleibenden Platz.
`.site-header__buttons` bekommt `flex-shrink: 0`, damit bei Platzmangel
die Suche schrumpft statt die Toolbar-Buttons intern umbrechen zu lassen.

```css
body:has(#module-list) .site-header__actions { width: 100%; }
body:has(#module-list) .site-search--prominent { flex: 1 1 12rem; min-width: 11rem; }

.site-header__buttons {
  display: flex;
  flex-wrap: wrap;
  flex-shrink: 0;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
}
```

`width: 100%` auf `.site-header__actions` ist nötig, weil `.site-header__top`
auf `index.html` nur dieses eine Kind hat (kein Breadcrumb) — ohne
`width: 100%` wäre `.site-header__actions` als Flex-Item ohne eigenen
`flex-grow`-Wert nur so breit wie sein Inhalt, die Suche hätte dadurch
keinen Platz zum Wachsen. Bei ≤600px greift weiterhin der bestehende
`@media`-Block aus Abschnitt 15a (`.site-header__actions { flex-wrap: wrap; }`)
und stapelt Suche/Toolbar wieder wie gewohnt.

Vier Elemente in Reihenfolge Farbe → Zahnrad → Filter → Drucken, alle
gleichwertig in einer Flex-Zeile statt fester Grid-Zellen — bei
Platzmangel wickelt jedes Element einzeln um (`flex-wrap: wrap`), **nie**
über einen festen `width`-Wert. Ein dezenter linker Trenner
(`border-left` + `margin-left` auf `.merksaetze-druck-link`) gruppiert
optisch „Ansicht/Einstellungen“ (Farbe/Zahnrad/Filter) von der
verbleibenden Text-Aktion „Drucken“, ohne dafür ein eigenes
Wrapper-Element einzuführen.

**Icon-Buttons statt Textpillen (Design-Fix):** Farbe-, Filter- und
Zahnrad-Button sind runde Icon-Buttons (`border-radius: 50%`, feste
Breite `var(--control-h)`, kein sichtbarer Text) statt der ursprünglichen
Textpillen „Farbe: Dark“/„Filter: Alle“. Adressierung über die IDs
`#theme-switcher-btn`/`#filter-switcher-btn`/`#progress-menu-btn` (nicht
über die Klassen `.theme-switcher__btn`/`.filter-switcher__btn`, die
weiterhin als Textpillen-Basis für den Druck-Link dienen). Jedes Icon ist
ein kleines, selbst verfasstes Inline-SVG (`stroke`/`fill: currentColor`,
kein Hex-Wert, läuft automatisch in allen fünf Themes) — Halbkreis für
Farbe, Trichter für Filter, Zahnrad/Sonnensymbol für den Fortschritt-Menü-
Button. Der aktuelle Zustand (aktives Theme/aktiver Filter) steckt nicht
mehr im Button-Text, sondern in `aria-label`/`title`
(z. B. `"Farbe: Dark (Menü öffnen)"`), aktualisiert bei jeder
Zustandsänderung in `updateUI()`. Sichtbar bleibt der Zustand zusätzlich
im geöffneten Menü über das bestehende Haekchen (`.is-active::before`).

**Zahnrad-Button (`#progress-menu-btn`, `.progress-switcher`):** ersetzt
die früheren zwei einzelnen Pillen „Fortschritt exportieren“/„Fortschritt
importieren“ durch einen Icon-Button mit Dropdown-Menü — Aufbau/Optik 1:1
von `.filter-switcher` übernommen (reine Wiederverwendung von
`.filter-switcher__btn`/`__menu`/`__item`, eigene `.progress-switcher`-
Klasse nur für Positionierung/Fallback), nur mit zwei Aktions-Einträgen
(`role="menuitem"`, keine Radios/Checkboxen — jeder Klick löst sofort
Export bzw. Dateiauswahl aus und schließt danach das Menü) statt
Radio-Optionen. Eigene Mindestbreite fürs Menü
(`.progress-switcher .filter-switcher__menu { min-width: 13rem; }`), da
„Fortschritt exportieren“/„Fortschritt importieren“ länger sind als
Farbe-/Filter-Optionen. `assets/progress-io.js` hängt sich per
`insertBefore` direkt **nach** dem Theme-Switcher (nicht ans Ende der
Toolbar) ein, damit die Reihenfolge Farbe → Zahnrad → Filter → Drucken
entsteht — Ladereihenfolge in `index.html`: `theme.js → search.js →
filter.js → merksaetze.js → progress-io.js → welcome.js`, `.theme-switcher`
existiert zu diesem Zeitpunkt also garantiert bereits in
`.site-header__buttons`. Export-/Import-Logik selbst (Blob-Download,
FileReader-Import, Bestätigungsdialog, Statusmeldung) unverändert
gegenüber der vorherigen Zwei-Pillen-Variante.

**Gemeinsame Höhe** über die Variable `--control-h: 2.25rem` (in `:root`,
Abschnitt Layout-Variablen — eine Größe, kein Farbwert, daher zulässig
trotz „keine Hex-Werte“-Regel). Suchfeld (`.site-search__input`) UND alle
Buttons (`.theme-switcher__btn`, `.filter-switcher__btn`, inkl. deren
Wiederverwendung auf Druck-Link, Zahnrad-Button und Menü-Einträgen)
bekommen `height: var(--control-h); box-sizing: border-box;` plus
`display: inline-flex; align-items: center; justify-content: center;`
(nur die Buttons, nicht der Such-Input — der zentriert Text nativ). Die
drei Icon-Buttons haben zusätzlich `width: var(--control-h)` (echter
Kreis statt Pille, siehe oben).

**Aufbau-Strategie:** `assets/merksaetze.js` baut den Toolbar-Container
selbst, statt `theme.js`/`filter.js` anzufassen. Ladereihenfolge in
`index.html`: `theme.js → search.js → filter.js → merksaetze.js →
progress-io.js → welcome.js`. Da `merksaetze.js` als letztes der drei
Header-Skripte vor `progress-io.js` lädt, existieren `.theme-switcher` und
`.filter-switcher` zu diesem Zeitpunkt garantiert bereits in
`.site-header__actions` — `merksaetze.js` erzeugt `.site-header__buttons`,
verschiebt beide Wrapper-Elemente unverändert hinein und hängt den
Druck-Link als drittes Kind an. `progress-io.js` lädt danach und schiebt
seinen Zahnrad-Button (`.progress-switcher`) per `insertBefore` zwischen
Farbe und Filter (siehe oben), mit Fallback auf `.site-header__actions`
bzw. `document.body`, falls die Toolbar fehlt. Vorteil: **keine Änderung**
an `theme.js`/`filter.js` nötig — beide funktionieren unabhängig davon, wo
ihr Wrapper im DOM hängt, da ihre Dropdown-Menüs relativ zu sich selbst
(nicht zu `.site-header__actions`) positionieren. Fällt `merksaetze.js`
weg, degradiert der Header sauber auf die alte flache Reihe zurück
(Fallback im Code, falls Theme/Filter fehlen).

`.progress-io__status` (Erfolgs-/Fehlermeldung nach Export/Import) steht
auf `flex-basis: 100%`, rutscht dadurch als eigene Zeile unter die Toolbar,
statt eine der Pillen zu verbreitern.

### Umsetzung

- `assets/merksaetze.js` hat zwei Rollen in einer Datei, per
  Selbst-Erkennung über vorhandene IDs (analog `filter.js`):
  - Auf `index.html` (`#module-list` vorhanden): baut die oben
    beschriebene `.site-header__buttons`-Toolbar und hängt den Druck-Link
    (`<a href="merksaetze.html">`, Klasse `.filter-switcher__btn` —
    Optik/Höhe wiederverwendet, kein neues Button-CSS) als weitere Pille
    daran an.
  - Auf `merksaetze.html` (`#merksaetze-list` vorhanden): lädt und
    rendert die Sammelansicht.
- Idempotenz-Schutz analog `search.js`/`filter.js`:
  `if (document.getElementById("merksaetze-druck-link")) return;`.
- Druck-Button auf `merksaetze.html` (nicht zu verwechseln mit dem
  Link-Button auf `index.html`) nutzt die bestehenden `.btn`/
  `.btn--primary`-Klassen — bereits über die vorhandene
  `.btn { display: none; }`-Regel im Druck ausgeblendet, keine neue Regel
  nötig.
- Beim Druck zusätzlich ausgeblendet: `.merksaetze-controls`
  (Fortschrittsanzeige + Druck-Button auf `merksaetze.html`, reine
  Bildschirm-UI) — ergänzt in derselben bestehenden Ausblend-Liste wie
  `.theme-switcher`/`.site-footer`. Die `.site-header__buttons`-Toolbar
  auf `index.html` braucht keine eigene Print-Regel: sie steckt
  vollständig innerhalb von `.site-header__top`, das bereits komplett
  ausgeblendet wird. `.merksaetze-entry { break-inside: avoid; }` ergänzt
  in derselben bestehenden Umbruch-Regel wie `.section--merksatz`/
  `.quiz__q`. Kein zweiter `@media print`-Block (Abschnitt 12 verbietet
  das).
- Farben ausschließlich über CSS-Variablen, keine Hex-Werte — funktioniert
  dadurch automatisch in allen fünf Themes; Druck erzwingt wie überall die
  White-Werte.

### Mobile-Optimierung (Runde 4): Zahnrad-Icon, Menü-Positionierung, Link-Kontrast

**Zahnrad-Icon sah aus wie eine Sonne:** Die ursprüngliche Icon-Variante
(Ring + 8 Speichen-Strahlen, siehe frühere Fassung dieses Abschnitts) war
bei der tatsächlichen Button-Größe (16px) nicht als Zahnrad erkennbar,
sondern wirkte wie ein Sonnensymbol. Gegen zwei Alternativen visuell
geprüft (Ring + rotierte Rechteck-Zähne in zwei Varianten vs. eine
klassische, aus zwei Pfaden aufgebaute Zahnrad-Kontur mit gezacktem
Außenring) — die dritte Variante liest sich eindeutig als Zahnrad,
ersetzt jetzt `ICON_SVG` in `assets/progress-io.js`.

**Dropdown-Menüs auf schmalen Screens abgeschnitten:** `.theme-switcher__menu`
und `.filter-switcher__menu` (Letzteres auch vom Zahnrad-Menü aus
`progress-io.js` wiederverwendet) sind auf Desktop `position: absolute`
relativ zum eigenen Button (`top: calc(100% + 0.4rem); right: 0;`). Auf
schmalen Screens sitzen die Icon-Buttons dicht am rechten Viewport-Rand —
ohne eigene Behandlung ragt das Menü dort kaum noch ins Bild bzw. wird
abgeschnitten. Fix analog zu `positionResults()` in `search.js`
(Abschnitt 15a): ab `@media (max-width: 600px)` wird das Menü auf
`position: fixed` umgestellt,

```css
@media (max-width: 600px) {
  .theme-switcher__menu,
  .filter-switcher__menu {
    position: fixed;
    top: auto; right: auto; left: auto;
    overflow-y: auto;
  }
}
```

und `theme.js`/`filter.js`/`progress-io.js` bekommen je eine eigene
(duplizierte, siehe Konventions-Grundsatz „kein gemeinsames Modul“)
`positionMenu()`-Funktion, aufgerufen beim Öffnen (`openMenu()`) sowie bei
`resize`. Sie liest `btn.getBoundingClientRect()` und setzt `top`/`right`/
`max-height` inline — nur wirksam, wenn das Menü tatsächlich
`position: fixed` ist (`getComputedStyle(menu).position !== "fixed"` als
Guard, damit auf Desktop nichts inline überschrieben wird). Ragt das Menü
trotz `right`-Offset über den linken Rand hinaus (sehr schmales Gerät),
wird zusätzlich auf `left: 8px` umgeschaltet.

**Text-/Link-Kontrast je Theme („Altlast“):** Zwei getrennte Probleme,
beide auf denselben Ursachenkreis (Theme-Akzentfarbe `--link` als
Textfarbe) zurückgeführt:

1. Die globale Regel `a { color: var(--link); }` färbte **jeden** Link in
   der jeweiligen Theme-Akzentfarbe (Blau/Gold/Neongrün/Orange) statt in
   einer für Fließtext optimierten Farbe — bei Creme (Gold auf
   Cremeweiß) und teils Sunset/Terminal schlecht lesbar. Neu:

   ```css
   a {
     color: var(--text);
     text-decoration: underline;
     text-decoration-color: var(--border);
     text-underline-offset: 0.15em;
   }
   a:hover,
   a:focus-visible {
     color: var(--link);
     text-decoration-color: currentColor;
   }
   ```

   Links tragen ihre Erkennbarkeit jetzt über eine dezente Unterstreichung
   statt über die Farbe (WCAG 1.4.1: Links dürfen sich innerhalb von
   Fließtext nicht nur durch Farbe unterscheiden) — `--text` ist pro Theme
   ohnehin auf Kontrast gegen `--bg` getrimmt, die Akzentfarbe kommt erst
   bei Hover/Fokus als Hinweisreiz dazu. Button-/Pillen-Links (`.btn`,
   `.merksaetze-druck-link`) setzen weiterhin explizit
   `text-decoration: none;`, sonst würde die neue Default-Unterstreichung
   auch auf ihnen erscheinen. Die separate `.jump-nav a { color: var(--link); }`-
   Regel entfällt ersatzlos (deckt die globale Regel jetzt mit ab).

2. **Eigentliche Ursache der schlecht lesbaren Menü-Einträge** (aus den
   Screenshots: der Eintrag „Creme“ im Theme-Menü war *immer* creme-farben
   eingefärbt, unabhängig vom aktiven Theme): `theme.js` vergibt
   `item.dataset.theme = t.value;` auf jedem Menü-Eintrag, um beim Klick zu
   wissen, welches Theme gemeint ist — das erzeugt aber exakt dasselbe
   `data-theme="creme"`-Attribut wie am `<html>`-Element. Die
   Theme-Variablen-Blöcke waren bis dahin nur `[data-theme="creme"] { ... }`
   (ohne Element-Präfix) — dieser Selektor matcht **jedes** Element mit
   diesem Attribut, nicht nur `<html>`. Der Button für „Creme“ bekam damit
   seine eigenen, lokalen `--text`/`--bg`/`--link`-Werte und ignorierte das
   tatsächlich aktive Theme. Fix: alle vier Theme-Blöcke sowie der
   `@media print`-Reset sind jetzt auf das Root-Element eingeschränkt
   (`html[data-theme="dark"]` statt `[data-theme="dark"]`, `:root` statt
   `:root, [data-theme]` im Druck-Reset). Zusätzlich markiert sich der
   aktive Menü-Eintrag nicht mehr über `color: var(--link)` (dieselbe
   Akzentfarben-Problematik wie bei Punkt 1), sondern nur noch über
   Fettschrift + Häkchen (`.theme-switcher__item.is-active`,
   `.filter-switcher__item.is-active`: `color: var(--text)`).

---

## 16. Build und Konsistenzprüfung

Alle Skripte unter `tools/` sind reines Python (Standardbibliothek, kein
Node.js). Aufruf jeweils vom Repo-Root, z. B. `py tools/build_pages.py`.

Erzeugen:

- **`tools/build_pages.py`** — baut `module/**/*.html` aus
  `data/manifest.json`, `content/` und `templates/` (Abschnitt 1).
  Deterministisch (UTF-8, LF). Bricht ab, wenn zu einer Einheit im Manifest
  die Inhaltsdatei fehlt oder die Abschnitts-Anker nicht stimmen (Abschnitt 3).
- **`tools/build_search_index.py`** — erzeugt `data/search-index.json`
  aus allen `<h3>`-Überschriften plus dem Merksatz-Text je Einheit
  (bewusst ohne `<h2>`, das sind nur die identischen
  Standard-Abschnittstitel ohne Suchrelevanz). Wird von `assets/search.js`
  erst beim ersten Eingabe-Event nachgeladen (Abschnitt 15a).

Beide nach jeder Änderung an Manifest, `content/` oder `templates/`
ausführen.

Prüfen:

- **`tools/validate_manifest.py`** — prüft je Einheit aus
  `data/manifest.json`: HTML-Datei vorhanden, `section#merksatz`
  vorhanden, Quiz-JSON (falls im Manifest referenziert) vorhanden/valide/
  nicht-leere `questions`-Liste. Meldet zusätzlich HTML-Dateien unter
  `module/`, die im Manifest fehlen (verwaist).
- **`tools/check_links.py`** — prüft jeden `href` in `module/**/*.html`,
  der auf eine andere Datei innerhalb von `module/` zeigt: Existiert das
  Ziel? Ist die Ziel-Einheit im Manifest gelistet (keine verwaiste Datei)?
- **`tools/validate_pool.py`** — prüft den Prüfungssimulator-Fragenpool
  unter `data/pruefung/` (Pflichtfelder, Typ-Schema, Block-/Teil-Bezüge,
  Antwort-Index-Verteilung, Längen-Bias).
- **`tools/compare_reference.py`** — nur für Umbauten an `templates/` oder
  `build_pages.py`: vorher `module/` nach `_referenz/module/` kopieren
  (gitignored), nach dem Umbau vergleichen. Meldet jede Abweichung außer
  Whitespace und `&`/`&amp;` mit Datei und Zeile.

Alle melden Funde als Liste und enden dann mit Exit-Code 1.

`.github/workflows/validate.yml` führt bei jedem Push auf `main` beide
Build-Skripte und die drei Prüfskripte aus (Ubuntu-Runner, Python 3.12) und
prüft per `git diff --exit-code -- module/` bzw.
`-- data/search-index.json`, dass die committeten erzeugten Dateien aktuell
sind. Die Action committet selbst nichts zurück.

Manuell bleiben Prüfschritte, die sich nicht mechanisch fassen lassen:
inhaltliche Korrektheit, Quiz-Qualität (Abschnitt 6), Quellmaterial-Regeln
(Abschnitt 10), Ansicht im Browser und auf dem Smartphone (Abschnitt 7).
