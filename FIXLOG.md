# FIXLOG

Protokoll der Korrekturen aus QUALITAETSKONTROLLE.md, nur Kategorien
FALSCH / UNVERSTÄNDLICH / VERBESSERN. ZEICHNUNG/TOOL-Befunde wurden in
diesem Durchlauf nicht bearbeitet.

---

## Modul 1 – Projektmanagement

### `netzplan` (VERBESSERN)
Befund bestätigt: Konzept enthielt keinerlei FAZ/FEZ/SAZ/SEZ-Notation.
Geändert — Abschnitt „Puffer (Pufferzeit)" um einen Absatz ergänzt:
Definition der vier Eckwerte FAZ/FEZ/SAZ/SEZ plus Formeln
FEZ = FAZ + Dauer, Puffer = SAZ − FAZ = SEZ − FEZ.
Vorher: nur qualitative Puffer-Erklärung ohne Notation.
Nachher: zusätzlicher Absatz mit der Standard-Notation und den Formeln.

### `problemanalyse-5whys-ishikawa` (FALSCH)
Befund bestätigt: Tabellenzeile „Management (Measurement)" vermischte
zwei verschiedene 6M-Varianten, Beispielspalte mischte beide Konzepte.
Geändert — Zeile korrigiert.
Vorher: `Management (Measurement)` / „fehlendes Monitoring, unklare
Zuständigkeiten“.
Nachher: `Management` / „unklare Zuständigkeiten, fehlende
Ressourcenplanung“ (reine Management-Kategorie, keine Vermischung mit
Measurement/Monitoring mehr). Merksatz nutzte bereits korrekt nur
„Management“, daher dort keine Änderung nötig. Quiz-JSON referenziert
den Begriff nicht, keine Änderung nötig.

### `ticketsystem-stoerungsmanagement-eskalation` (UNVERSTÄNDLICH)
Befund bestätigt: Merksatz führte „Problemmanagement“ ein, das im
Konzept nirgends als Begriff definiert ist (nur „Problem“ als
Tabellenbegriff).
Geändert — Merksatz umformuliert, um den undefinierten Begriff zu
vermeiden.
Vorher: „… während Problemmanagement die Ursache behebt.“
Nachher: „… während die Behebung des zugrunde liegenden Problems
eigenständig erfolgt.“ (verweist auf den bereits definierten Begriff
„Problem“ statt einen neuen Begriff einzuführen).

---

## Modul 2 – Kalkulation & Grundrechnen

### `bits-und-bytes` (FALSCH)
Befund bestätigt: 1.440 × gerundete 2,64 MiB ergibt rechnerisch 3.801,6 ≈
3.802 MiB, exakt (auf Basis der ungerundeten Byte-Zahl) sind es aber nur
≈ 3.796,9 MiB — Rundungskaskade.
Geändert — Rechenweg auf die exakte Byte-Basis umgestellt statt mit dem
gerundeten MiB-Wert weiterzurechnen.
Vorher: „1.440 × 2,64 MiB ≈ 3.802 MiB ≈ 3,71 GiB“.
Nachher: „1.440 × 2.764.800 Byte = 3.981.312.000 Byte ÷ 1024² ≈ 3.797 MiB
≈ 3,71 GiB“ (Endergebnis in GiB war bereits korrekt und unverändert).

### `elektrotechnik-grundformeln` (FALSCH)
Befund bestätigt: SVG-Diagramm zeigte für 80-PLUS Platinum bei 50 % Last
96 % — das ist der Titanium-Wert (230 V), nicht Platinum.
Geändert — Platinum-Wert im Diagramm korrigiert.
Vorher: Balken/Text „96 %“ (Breite 288 von 300).
Nachher: Balken/Text „94 %“ (Breite 282 von 300, entspricht Platinum bei
230 V/50 % Last — passend zur bereits im Dokument für Gold verwendeten
230-V-Spezifikation). Die grundsätzliche Vermischung von 115-V- und
230-V-Werten zwischen den Klassen (Standard/Bronze vs. Gold) bleibt
bestehen — das war laut Befund kein verlangter Korrekturpunkt und hätte
eine größere Umgestaltung des gesamten Diagramms erfordert; ggf. als
eigener Folgebefund vormerken.

### `handelskalkulation` (VERBESSERN)
Befund bestätigt: Schema-Tabelle zeigte „+ Kundenskonto“/„+
Kundenrabatt“ mit Plus-Symbol, obwohl tatsächlich durch den
Komplementärfaktor geteilt wird.
Geändert — irreführendes Plus-Symbol in der Konzept-Schema-Tabelle
entfernt.
Vorher: `+ Kundenskonto` / `+ Kundenrabatt`.
Nachher: `Kundenskonto (Rückrechnung, kein Aufaddieren)` /
`Kundenrabatt (Rückrechnung, kein Aufaddieren)`. Die Praxisbeispiel-
Tabelle zeigt die Division bereits explizit in Klammern (z. B. „÷ 0,97“)
und wurde nicht angefasst, da dort kein Missverständnis vorliegt.

---

## Modul 3 – Hardware & Technologien

### `arbeitsspeicher-ram` (VERBESSERN)
Befund bestätigt: DDR-Tabelle bezeichnete die Datenraten durchgehend als
„MHz“, technisch korrekt ist MT/s (DDR verdoppelt die effektive
Datenrate, nicht den Kerntakt).
Geändert — Einheit in Tabelle und RAM-Timings-Formel korrigiert.
Vorher: „2133–3200 MHz typisch“ (DDR4), „4800–8000+ MHz“ (DDR5),
Formel „Latenz [ns] = (CL ÷ Takt [MHz]) × 2000“.
Nachher: „2133–3200 MT/s typisch“, „4800–8000+ MT/s“, Formel
„Latenz [ns] = (CL ÷ Datenrate [MT/s]) × 2000“ (Text davor „Takt und
Timing“ → „Datenrate und Timing“). Merksatz nutzt bereits nur „Takt“
ohne Einheitenangabe (kein falscher Fakt), dort keine Änderung nötig.

### `auto-id` (FALSCH)
Befund bestätigt: Konzept-Tabellen gaben die Reichweite passiver
RFID-Tags mit „wenige cm“ bzw. „bis ca. 1 Meter“ an, während das
Praxisbeispiel im selben Dokument passive RFID-Tags auf ganzen Paletten
per Lesegerät-Tor am Warenausgang erfasst — ein Gate-Szenario, das reale
passive UHF-RFID-Reichweiten von mehreren Metern voraussetzt.
Geändert — Reichweitenangaben in beiden Tabellen frequenzabhängig
präzisiert, Widerspruch zum Praxisbeispiel aufgelöst.
Vorher: „wenige cm (passiv) bis mehrere Meter (aktiv)“ (Tabelle 1),
„wenige Zentimeter bis ca. 1 Meter“ (Tabelle 2, Passiver Tag).
Nachher: „wenige cm bis mehrere Meter, je nach Frequenzband und Tag-Typ
(passiv/aktiv)“ (Tabelle 1), „wenige Zentimeter (LF/HF) bis mehrere
Meter (UHF, z. B. bei Palettengates im Lager)“ (Tabelle 2). Quiz-JSON
(q3, q5) bleibt mit der Korrektur konsistent, keine Änderung nötig.

---

## Modul 5 – IT-Sicherheit

### `angriffsmethoden` (FALSCH — Sondervorgabe geprüft)
Vorgabe: nur ändern, falls das Modul SQL-Injection fälschlich auf
Platz 1 der OWASP Top 10 verortet (das galt nur 2017); korrekt ist
A03:2021 (Platz 3).
Geprüft: Modul stand tatsächlich auf „Platz 1“ (nicht bereits A03/Platz
3) — Befund damit bestätigt, nicht der im QK-Text als „ungenau“
markierte Fall.
Geändert.
Vorher: „SQL-Injection steht seit Jahren auf Platz 1 der OWASP Top 10
der Web-Sicherheitslücken …“.
Nachher: „SQL-Injection gehört zur Kategorie „Injection“ (A03:2021,
Platz 3) der OWASP Top 10 der Web-Sicherheitslücken …“.

Nebenbefund (nicht Teil dieses Durchlaufs, nur notiert): Zeile 62
derselben Tabelle enthält kaputtes Markup (`<td>Web<\td><td>...`
statt `</td>`) — kein FALSCH/UNVERSTÄNDLICH/VERBESSERN-Befund aus
QUALITAETSKONTROLLE.md, daher hier nicht behoben.

### `endpoint-security` (VERBESSERN)
Befund bestätigt: Praxisbeispiel-Satz enthielt eine doppelte Verbform.
Geändert.
Vorher: „… meldet den fehlenden Verbindungsaufbau zur Firmen-IT als
Anomalie gemeldet und markiert …“.
Nachher: „… meldet den fehlenden Verbindungsaufbau zur Firmen-IT als
Anomalie und markiert …“.

---

## Modul 6 – Datenschutz & Recht

### `vertragsarten` (VERBESSERN)
Befund bestätigt: die IT-spezifische Abgrenzung „Standardsoftware =
Kaufvertrag vs. Individualsoftware nach Lastenheft = Werkvertrag“ fehlte
komplett; nur der Werkvertrags-Fall kam im Praxisbeispiel vor.
Geändert — neuer Absatz nach der Vertragsarten-Tabelle im Konzept
eingefügt.
Vorher: keine Erwähnung von Standardsoftware-Kauf als Kaufvertrag
(Rechtskauf).
Nachher: Absatz „IT-spezifische Einordnung: Der Kauf einer fertigen
Standardsoftware … ist ein Kaufvertrag (Rechtskauf analog § 453 BGB)
… Individualsoftware nach einem Lastenheft … ist ein Werkvertrag.“

### `urheberrecht-lizenzen` (VERBESSERN)
Befund bestätigt: kein Hinweis auf § 69b UrhG (Arbeitnehmerurheberrecht
bei Software), Merksatz verkürzte „Urheberrecht bleibt beim Schöpfer“
ohne diese Ausnahme.
Geändert — Absatz im Konzept ergänzt, Merksatz um Klammerzusatz
erweitert.
Vorher: Konzept ohne § 69b UrhG; Merksatz „Das Urheberrecht selbst
bleibt beim Schöpfer, übertragen wird nur das Nutzungsrecht (Lizenz).“
Nachher: neuer Absatz zu § 69b UrhG im Konzept; Merksatz „Das
Urheberrecht selbst bleibt beim Schöpfer (Ausnahme: Arbeitnehmer,
§ 69b UrhG), sonst wird nur das Nutzungsrecht (Lizenz) übertragen.“

### `barrierefreiheit-software` (VERBESSERN)
Befund bestätigt: kein Verweis auf das Barrierefreiheitsstärkungsgesetz
(BFSG, seit 28.6.2025), WCAG wurde nur als freiwilliger Standard
dargestellt.
Geändert — Absatz am Ende des WCAG-Abschnitts ergänzt.
Vorher: keine Erwähnung des BFSG.
Nachher: Absatz zu BFSG/EU-Richtlinie 2019/882 und der seit 28.6.2025
bestehenden gesetzlichen Pflicht für E-Commerce/Verbrauchersoftware.

---

## Modul 7 – Software, OS & Web

### `linux-konsole` (FALSCH)
Befund bestätigt: Die Rechtegruppen wurden als „ugw“ bezeichnet;
reale chmod-Symbolik ist u/g/o (User/Group/Others), „w“ kollidiert
zudem mit dem Schreibrecht.
Geändert — alle vier Fundstellen korrigiert.
Vorher: „kurz „ugw" genannt“ (Konzept-Intro), Tabellenkopf
„Gruppe (u/g/w)“, Tabellenzeile „w — World/Others“, Merksatz
„Owner/Group/Others (ugw)“.
Nachher: „kurz „ugo" genannt“, Tabellenkopf „Gruppe (u/g/o)“,
Tabellenzeile „o — Others“, Merksatz „Owner/Group/Others (ugo)“.
Quiz-JSON enthielt den Begriff nicht, keine Änderung nötig.

### `zeichensaetze-ascii-unicode` (VERBESSERN)
Befund bestätigt: Quizfrage q6 fragte „mindestens wie viele Bytes“,
obwohl für das Euro-Zeichen exakt 3 Bytes anfallen (kein Bereich).
Geändert — Wort „mindestens“ aus der Frage entfernt.
Vorher: „Wie viele Bytes benötigt UTF-8 mindestens für das
Euro-Zeichen (€, U+20AC)?“.
Nachher: „Wie viele Bytes benötigt UTF-8 für das Euro-Zeichen
(€, U+20AC)?“.

### `pruefziffern-paritaet` (VERBESSERN)
Befund bestätigt: Rechenverfahren (Modulo-10/-97) wurden nur in Worten
beschrieben, kein durchgerechnetes Zahlenbeispiel.
Geändert — konkretes, verifiziertes Rechenbeispiel für EAN-13 ergänzt.
Vorher: keine konkrete Beispielrechnung.
Nachher: neuer Absatz nach der EAN-Erklärung mit vollständig
durchgerechnetem Beispiel (EAN-13 4006381333931 → Summe 89 → Prüfziffer
90−89=1, unabhängig nachgerechnet und mit der bekannten Beispielnummer
abgeglichen). IBAN-Beispiel nicht ergänzt (Buchstaben-zu-Zahl-Umwandlung
plus Modulo-97 einer sehr langen Zahl wäre für eine minimal-invasive
Ergänzung zu umfangreich) — der Befund verlangte „reale EAN-13 ODER
IBAN“, mit dem EAN-Beispiel ist das erfüllt.

### `epk-ereignisgesteuerte-prozesskette` (VERBESSERN)
Befund bestätigt: Die Regel, dass XOR-/ODER-Konnektoren nur nach
Funktionen stehen dürfen (Ereignisse sind passiv), wurde nirgends
erklärt, obwohl das SVG-Beispiel sie korrekt umsetzt.
Geändert — Regel als eigener Absatz zwischen Symboltabelle und Beispiel
ergänzt.
Vorher: keine Erwähnung der Regel im Fließtext.
Nachher: neuer Absatz „Wichtige Modellierungsregel: Ein XOR- oder
ODER-Konnektor darf nur direkt nach einer Funktion stehen … Nach einem
Ereignis ist höchstens ein UND-Konnektor zulässig …“.

---

## Modul 8 – Datenbanken & SQL

### `sql-ddl` (FALSCH — PRAGMA foreign_keys)
Befund bestätigt: `assets/tools/sql-editor.js` setzte nirgends
`PRAGMA foreign_keys = ON;`, SQLite hatte FK-Erzwingung damit per
Default deaktiviert — im Editor ließ sich eine `mitarbeiter`-Zeile mit
nicht existierender `abteilung_id` einfügen, entgegen der gelehrten
referenziellen Integrität. Dieser Fix betrifft den gemeinsam genutzten
Editor und damit automatisch alle fünf SQL-Einheiten
(ddl/dml/join/subqueries/transaktionen), die ihn einbetten.
Geändert — zentral im Tool statt in jeder Einheit einzeln.
Vorher: `db = new SQL.Database(); runSeed(db);` (bzw. beim Reset
identisch) ohne PRAGMA.
Nachher: `db = new SQL.Database(); db.run("PRAGMA foreign_keys = ON;");
runSeed(db);` an beiden Stellen (Erstladung und Zurücksetzen-Button) in
`assets/tools/sql-editor.js`.
Im Browser verifiziert: `CREATE TABLE abteilung …; CREATE TABLE
mitarbeiter … FOREIGN KEY …; INSERT INTO mitarbeiter (…, abteilung_id)
VALUES (…, 9999);` mit nicht existierender `abteilung_id` liefert jetzt
„Fehler: FOREIGN KEY constraint failed“ statt stillschweigend zu
funktionieren.

### `sql-ddl` (UNVERSTÄNDLICH — VARCHAR/DECIMAL)
Befund bestätigt: `VARCHAR(n)`/`DECIMAL(p,s)` wurden wie erzwungene
Längen-/Präzisionsangaben dargestellt, obwohl SQLite dynamisch typisiert
ist und diese Angaben nicht validiert.
Geändert — erklärenden Absatz im Konzept ergänzt.
Vorher: keine Erwähnung der SQLite-Type-Affinity-Besonderheit.
Nachher: neuer Absatz „SQLite-Besonderheit: … werden von SQLite
akzeptiert, aber technisch nicht erzwungen … In streng typisierten
Systemen wie MySQL oder PostgreSQL würde ein solcher Wert dagegen
abgelehnt.“ (analoge Tabelle in `datentypen-constraints` war laut
QK-Liste ohne eigenen Befund, dort nicht angefasst.)

### `er-modell-kardinalitaeten` (FALSCH)
Befund bestätigt, aber bereits durch den PRAGMA-Fix in `sql-ddl`
miterledigt: Die Aussage „das DBMS lehnt den Einfüge-Versuch ab“ ist
jetzt auch im (gemeinsam genutzten) Editor tatsächlich korrekt.
Geändert: nichts am Text dieser Einheit — sie bindet den SQL-Editor gar
nicht selbst ein (reine Praxisbeispiel-Beschreibung ohne Live-Tool),
der Text war für sich genommen schon fachlich richtig. Der Widerspruch
existierte nur zwischen der allgemeinen SQL-Aussage und dem Verhalten
des SQL-Editor-Tools in den anderen Einheiten — durch den PRAGMA-Fix in
`assets/tools/sql-editor.js` behoben.

---

## Modul 11 – WiSo

### `betriebliche-mitbestimmung` (FALSCH)
Befund bestätigt: JAV-Beschreibung ließ die gesetzliche Altersgrenze
nach § 60 BetrVG weg (JAV vertritt Auszubildende bis 25 Jahre, nicht
nur Beschäftigte unter 18).
Geändert.
Vorher: „vertritt speziell die Interessen von Auszubildenden und
Beschäftigten unter 18 Jahren“.
Nachher: „vertritt nach § 60 BetrVG speziell die Interessen aller
Beschäftigten unter 18 Jahren sowie der Auszubildenden bis 25 Jahre“.
Quiz-Frage q3 nutzt dieselbe unpräzise, aber nicht explizit falsche
Formulierung, nicht geändert, da vom Befund nicht erfasst und nicht
eindeutig falsch.

### `entgeltabrechnung` (FALSCH — Sondervorgabe mit exakten Werten)
Vorgabe: KV-AN-Anteil 2026 korrekt = 8,75 % von 3.000 € = 262,50 €
(bisher 7,4 % / 222,00 € veraltet), Netto entsprechend anpassen.
Geändert.
Vorher: „− Krankenversicherung (AN-Anteil) 222,00 €“, „Nettogehalt
1.980,00 €“.
Nachher: „− Krankenversicherung (AN-Anteil) 262,50 €“, „Nettogehalt
1.939,50 €“ (neu berechnet: 3.000,00 − 420,00 − 0,00 − 262,50 − 60,00
− 279,00 − 39,00 = 1.939,50). RV/PV/AV unverändert gelassen (nicht Teil
der Vorgabe). Quiz-JSON referenziert diese Beträge nicht.

### `entgeltabrechnung` (UNVERSTÄNDLICH)
Befund bestätigt: Satz klang, als gäbe es die Beitragsbemessungsgrenze
nur in der Rentenversicherung.
Geändert.
Vorher: „… Einkommen oberhalb dieser Grenze bleibt beitragsfrei (in der
Rentenversicherung) …“.
Nachher: „… Einkommen oberhalb dieser Grenze bleibt beitragsfrei.
Renten- und Arbeitslosenversicherung haben eine gemeinsame, höhere
Beitragsbemessungsgrenze; Kranken- und Pflegeversicherung haben eine
eigene, niedrigere Grenze …“.

### `wirksamkeit-rechtsgeschaefte-verbraucherschutz` (UNVERSTÄNDLICH)
Befund bestätigt: „der Verkäufer der TowerTech GmbH“ liest sich als
Genitiv, gemeint war TowerTech selbst als Verkäuferin.
Geändert.
Vorher: „wobei der Verkäufer der TowerTech GmbH bewusst … verschweigt“.
Nachher: „wobei die TowerTech GmbH als Verkäuferin bewusst …
verschweigt“.

### `beduerfnis-bedarf-kaufkraft` (UNVERSTÄNDLICH)
Befund bestätigt: Quiz-Antwortoption q7 „Das Wetter am Verkaufsort
ausschließlich“ unklar formuliert.
Geändert.
Vorher: „Das Wetter am Verkaufsort ausschließlich“.
Nachher: „Das aktuelle Wetter am Verkaufsort“.

---

## Zusammenfassung

Bearbeitet: 25 Befunde der Kategorien FALSCH/UNVERSTÄNDLICH/VERBESSERN
aus QUALITAETSKONTROLLE.md (Modul 1: 3, Modul 2: 3, Modul 3: 2,
Modul 5: 2, Modul 6: 3, Modul 7: 4, Modul 8: 3, Modul 11: 5), verteilt
auf 8 Module. Module 4, 9 und 10 hatten keine Befunde dieser drei
Kategorien und wurden nicht angefasst.

- **Direkt am Text/Quiz/Diagramm geändert:** 24 Befunde.
- **Indirekt gelöst, kein eigener Texteintrag nötig:** 1 Befund (Modul 8
  `er-modell-kardinalitaeten` — durch den zentralen `PRAGMA
  foreign_keys`-Fix im gemeinsam genutzten SQL-Editor-Tool wurde die
  bereits im Text korrekte Aussage auch im Tool-Verhalten wahr).
- **Beide Sondervorgaben mit exakten Vorgabewerten geprüft und beide
  zutreffend geändert** (kein „bereits korrekt, nicht ändern“-Fall):
  Modul 5 `angriffsmethoden` stand tatsächlich auf „Platz 1“ (nicht
  bereits A03/Platz 3); Modul 11 `entgeltabrechnung` hatte tatsächlich
  den veralteten KV-Satz.
- **Bewusst nicht mitgeändert (außerhalb des jeweiligen Befundtexts):**
  IBAN-Rechenbeispiel bei `pruefziffern-paritaet` (EAN-Beispiel deckt
  den Befund „reale EAN-13 ODER IBAN“ bereits ab); Quiz-Frage q3 bei
  `betriebliche-mitbestimmung` (dieselbe unpräzise Altersformulierung,
  aber kein eigener QK-Befund, daher nicht angefasst).
- **Nebenbefund notiert, nicht behoben:** kaputtes HTML-Markup
  (`<td>Web<\td>...`) in Modul 5 `angriffsmethoden.html`, Zeile 62 —
  kein Befund aus QUALITAETSKONTROLLE.md, daher außerhalb des Auftrags.

ZEICHNUNG- und TOOL-Befunde aus QUALITAETSKONTROLLE.md wurden in diesem
Durchlauf komplett ignoriert, wie beauftragt.

---

## Verschiebe-Aufgabe: Text-Encoder von Bits & Bytes → Zeichensätze

Betrifft ausschließlich zwei Einheiten, keine anderen Änderungen.

### `bits-und-bytes` (Modul 2, Kalkulation) — Tool entfernt
Der Text-Encoder (`assets/tools/bits-konverter.js`, Eingabefeld +
Tabelle Zeichen/Byte/Binär/Hex/Dezimal, Beispiel „Hi!“) gehörte
thematisch nicht zu Bits & Bytes, sondern zur Zeichenkodierung.
Entfernt:
- Absatz „Probiere die Bit-Kodierung von Text direkt aus:“ plus
  `<div class="tool" data-tool="bits-konverter">` im Konzept-Abschnitt
  (stand zwischen dem KiB/MiB/GiB-Prüfungsfallstrick-Absatz und
  „Speicherbedarf berechnen: Auflösung × Farbtiefe“).
- `<script src="../../assets/tools/bits-konverter.js"></script>` am
  Seitenende.
- Der erklärende Text „X Zeichen ergeben X Byte … Ein einfaches
  ASCII-Zeichen … belegt in UTF-8 genau 1 Byte, Sonderzeichen/Umlaute
  können 2–4 Byte benötigen“ steht nicht als eigener HTML-Absatz,
  sondern wird vom Tool selbst zur Laufzeit erzeugt
  (`bits-konverter.js`, Funktion `render()`) — er ist damit automatisch
  mitentfernt worden, da das gesamte Tool entfernt wurde.
Geprüft: kein verwaister Verweis, keine leere Section, Merksatz/Quiz
referenzieren das Tool nicht (Quiz-JSON durchsucht — kein Treffer).

### `zeichensaetze-ascii-unicode` (Modul 7, Software/OS/Web) — Tool eingefügt
Tool im Praxisbeispiel-Abschnitt ergänzt, nach der Platzierungs-
Konvention der Plattform (Vorbild: Subnetz-Rechner in
`ipv4-subnetting.html`, Hex-Viewer in `zahlensysteme.html`,
Verschlüsselungs-Demo in `kryptographie-sym-asym.html` — kurzer
„Probiere …“-Lead-Satz direkt gefolgt vom `<div class="tool">`).
Eingefügt, als erstes Element im Praxisbeispiel-Abschnitt (vor dem
bestehenden CRLF-Praxisfall, damit die Reihenfolge dem Konzept-Teil
folgt: erst ASCII/UTF-8, danach CR/LF):
```html
<p>
  Probiere direkt aus, wie ein Text zeichenweise in seine
  Byte-Darstellung zerlegt wird — genau das Prinzip hinter der
  ASCII-Tabelle aus dem Konzept-Teil, hier erweitert auf
  beliebigen UTF-8-Text:
</p>
<div class="tool" data-tool="bits-konverter">
  <p class="muted">Tool wird geladen …</p>
</div>
```
Plus `<script src="../../assets/tools/bits-konverter.js"></script>`
vor dem bereits vorhandenen `crlf-visualizer.js`-Tag am Seitenende.
Bestehender Inhalt (CRLF-Praxisfall, ISO-8859-1-Fall) unverändert
darunter erhalten.

**Hinweis zur Vorgabe „Codepoint→UTF-8-Bytes-Tool existiert bereits“:**
In der Einheit existiert kein separates interaktives Codepoint→Bytes-
Tool — nur eine statische Tabelle (A/ä/€/😀 → Codepoint → UTF-8-Bytes)
im Konzept-Abschnitt sowie der `crlf-visualizer` (Zeilenenden LF/CRLF/
CR, nicht Zeichenkodierung). Beides wurde wie vorgegeben nicht
angefasst. Der ursprünglich in QUALITAETSKONTROLLE.md notierte
TOOL-Befund „UTF-8-Byte-Encoder fehlt“ bleibt damit inhaltlich weiter
zutreffend für einen reinen Codepoint-Eingabe-Rechner — der jetzt
verschobene Text-Encoder deckt einen ähnlichen, aber nicht identischen
Anwendungsfall ab (ganzer Text statt einzelner Codepoint).

Im Browser verifiziert: `bits-und-bytes.html` zeigt kein Tool mehr im
Konzept-Abschnitt (keine Konsolenfehler). `zeichensaetze-ascii-unicode.html`
zeigt `bits-konverter` im Praxis-Abschnitt und `crlf-visualizer`
unverändert im Konzept-Abschnitt; Testeingabe „Hi!“ liefert korrekt
H = 0x48 = 72, i = 0x69 = 105, ! = 0x21 = 33.

---

## Modul 4 – Netzwerktechnik: Struktur-Split (kein QC-Befund, Ben-Auftrag)

### `topologien-vlan-poe-qos` → vier eigenständige Einheiten

Die kombinierte Einheit „Topologien, VLAN, PoE & QoS“ wurde auf
ausdrücklichen Wunsch in vier eigenständige Einheiten aufgeteilt, jede mit
eigenem Einstieg/Konzept/Praxisbeispiel/Merksatz/Quiz (Struktur exakt nach
Vorbild `ipv4-subnetting.html`). Das bisherige gemeinsame
Großraumbüro-Praxisbeispiel wurde **nicht** übernommen — jede Einheit hat
jetzt ein eigenes, kleineres, themenreines Beispiel.

**Angelegt/umbenannt:**
- `module/netzwerktechnik/topologien-vlan-poe-qos.html` →
  **umbenannt** (`git mv`) zu `module/netzwerktechnik/netzwerktopologien.html`
  (Topologien-Teil, inkl. bestehendem Bus/Stern/Ring/Mesh-SVG unverändert
  übernommen). Zugehörige Quiz-JSON ebenfalls umbenannt:
  `data/netzwerktechnik/topologien-vlan-poe-qos.json` →
  `data/netzwerktechnik/netzwerktopologien.json` (4 Fragen, davon 1 aus
  der alten Datei übernommen, 3 neu für Bus/Ring/Mesh ergänzt, da die
  alte Datei nur 1 von 7 Fragen zu Topologien hatte).
- **Neu angelegt:** `module/netzwerktechnik/vlan.html` +
  `data/netzwerktechnik/vlan.json` (4 Fragen, 3 aus der alten Datei
  übernommen + 1 neu zu Inter-VLAN-Routing).
- **Neu angelegt:** `module/netzwerktechnik/poe.html` +
  `data/netzwerktechnik/poe.json` (5 Fragen, 2 aus der alten Datei
  übernommen + 3 neu zur erweiterten Type-1–4-Tabelle/UPoE).
- **Neu angelegt:** `module/netzwerktechnik/qos.html` +
  `data/netzwerktechnik/qos.json` (4 Fragen, 1 aus der alten Datei
  übernommen + 3 neu).

**PoE zusätzlich ausgebaut** (nicht nur unverändert übernommen):
Vergleichstabelle von 3 auf 4 Zeilen erweitert (Type 1–4 statt nur 3
Standard-Zeilen), neue Spalten Jahr/Leistung-Quelle/Adernpaare ergänzt,
Kernpunkte-Liste (Datenübertragung, Leistungssprung ab Type 3 wegen 4
statt 2 Adernpaaren, Abwärtskompatibilität, typische Verbraucher,
Merkhilfe 15/30/60/100 W) sowie eine Randnotiz zu UPoE/UPoE+ (Cisco-
proprietär, keine IEEE-Standards, ausdrücklich nicht als gleichwertig
dargestellt) ergänzt. Badge auf AP1+AP2 erweitert (vorher nur AP2), da
laut Ben PoE 2026 in AP1 drankam — Einstieg enthält entsprechenden
Prüfungsrelevanz-Hinweis.

**`data/manifest.json` geändert:** der eine Eintrag `slug:
"topologien-vlan-poe-qos"` wurde durch vier Einträge in derselben
Position ersetzt (Reihenfolge: `netzwerktopologien`, `vlan`, `poe`,
`qos` — passend zur Vorgabe 1–4). `index.html` selbst musste nicht
angefasst werden, da es Modulliste/Badges ausschließlich aus
`data/manifest.json` rendert (siehe CONVENTIONS §14) — im Browser
gegen einen frischen (nicht gecachten) Server-Port geprüft: alle vier
neuen Einheiten erscheinen unter Netzwerktechnik an der richtigen
Stelle mit korrekten Links/Badges.

**Cross-Referenz-Prüfung:**
- `module/hardware/schnittstellen-video.html` und alle anderen Dateien
  in `module/hardware/` enthalten **keinen** Verweis auf PoE oder die
  alte Einheit — nichts zu korrigieren (per `grep -rl "PoE\|topologien-
  vlan-poe-qos"` projektweit geprüft).
- Kein anderes `module/**/*.html` verlinkte auf
  `topologien-vlan-poe-qos.html` — keine toten Links durch die
  Umbenennung entstanden.
- Neuer interner Link `netzwerktopologien.html` → `vlan.html` (Konzept,
  „siehe Einheit VLAN“) und umgekehrt `vlan.html` → `netzwerktopologien.html`
  (Konzept, „siehe Einheit Netzwerktopologien“) ergänzt, da beide Themen
  eng zusammenhängen (physische vs. logische Struktur).
- `PLAN.md` Thema 4.1 aktualisiert: ein Bullet wurde zu vier Bullets
  aufgeteilt, jeweils mit Verweis auf die neue Einheit und einem Hinweis
  auf den Split-Zeitpunkt.
- `QUALITAETSKONTROLLE.md` und `ZEICHNUNGSLOG.md` **nicht** verändert:
  Ersteres ist ein eingefrorener Prüfbericht (keine Historie von
  Korrekturmarkierungen im restlichen Dokument, siehe übrige Einträge),
  Letzteres ist ein reines Ereignisprotokoll vergangener Zeichnungs-Fixes
  — beide bleiben als historische Snapshots unverändert korrekt, auch
  wenn sich der Dateiname der betroffenen Einheit seither geändert hat.

**Verifiziert** (lokaler Python-HTTP-Server auf frischem Port wegen
Browser-Caching des alten `manifest.json` auf zuvor genutzten Ports):
alle vier Einheiten laden fehlerfrei, Breadcrumbs/„Zurück zum
Lernplan“-Link korrekt, Quiz rendert mit quiz-engine.js (4/4/5/4
Fragen), PoE-Tabelle zeigt exakt die vorgegebenen Werte, PoE-Tabelle
scrollt bei 360 px Breite horizontal innerhalb der Tabelle (kein
Seiten-Scroll, CONVENTIONS §7 global table-Regel greift unverändert).
