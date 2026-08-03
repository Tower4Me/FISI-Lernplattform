# TOOLLOG.md

Log der 10 interaktiven Tools aus der Qualitätskontrolle (Kategorie TOOL),
gebaut nach der Platzierungs-/Optik-Konvention des Subnetzrechners in
`module/netzwerktechnik/ipv4-subnetting.html` (Praxisbeispiel-Block,
Eingabefelder + „Berechnen“-Button, Rechenweg + Ergebnis-Liste).

Format je Eintrag: Modul/Einheit — Tool-Datei — Einbettung — Funktion.

---

## Modul 2 — Kalkulation & Grundrechnen

### Speicherbedarf-Rechner
- Einheit: `module/kalkulation/bits-und-bytes.html`
- Tool-Datei: `assets/tools/speicherbedarf-rechner.js`
- Einbettung: `data-tool="speicherbedarf-rechner"` im Praxisbeispiel-Block
- Funktion: Breite × Höhe × Farbtiefe → Bit/Byte/KiB/MiB/GiB, mit
  Rechenweg-Liste (Pixelanzahl → Bit → Byte → KiB → MiB). Validiert positive
  ganze Zahlen für Breite/Höhe und Farbtiefe (1–64 Bit).

### Übertragungsdauer-Rechner
- Einheit: `module/kalkulation/datenmengen-uebertragung.html`
- Tool-Datei: `assets/tools/uebertragungsdauer-rechner.js`
- Einbettung: `data-tool="uebertragungsdauer-rechner"` im Praxisbeispiel-Block
- Funktion: Datenmenge (Bit/Byte/KiB/MiB/GiB, binär) ÷ Datenrate
  (Bit/s/kbit/s/Mbit/s/Gbit/s, dezimal) → Übertragungsdauer, inkl.
  Umrechnung beider Werte auf Bit bzw. Bit/s als gemeinsame Basis.

### Handelskalkulations-Rechner
- Einheit: `module/kalkulation/handelskalkulation.html`
- Tool-Datei: `assets/tools/handelskalkulation-rechner.js`
- Einbettung: `data-tool="handelskalkulation-rechner"` im Praxisbeispiel-Block
- Funktion: komplettes Kalkulationsschema LEP → ZEP → BEP → Einstandspreis →
  SKP → BVP → ZVP → LVP, Schritt für Schritt inkl. Rückrechnung von
  Kundenskonto/-rabatt per Division durch (1 − Prozentsatz).

### Break-Even-Rechner
- Einheit: `module/kalkulation/break-even-deckungsbeitrag.html`
- Tool-Datei: `assets/tools/break-even-rechner.js`
- Einbettung: `data-tool="break-even-rechner"` im Praxisbeispiel-Block
- Funktion: Fixkosten, Verkaufspreis, variable Stückkosten → Deckungsbeitrag,
  Break-Even-Menge (aufgerundet) und Break-Even-Umsatz. Fehlermeldung, wenn
  Deckungsbeitrag ≤ 0.

---

## Modul 4 — Netzwerktechnik

### IPv6-Tool
- Einheit: `module/netzwerktechnik/ipv6-grundlagen.html`
- Tool-Datei: `assets/tools/ipv6-tool.js`
- Einbettung: `data-tool="ipv6-tool"` im Praxisbeispiel-Block
- Funktion: zwei Teilrechner — (1) IPv6-Adresse expandieren (8 volle
  Blöcke) und in kürzeste Schreibweise komprimieren (längste
  Nullblock-Folge → `::`); (2) EUI-64-Interface-Identifier + vollständige
  Link-Local-Adresse aus einer MAC-Adresse (FFFE einfügen, U/L-Bit
  invertieren).
- **Fachlich prüfen:** EUI-64-Ableitung (Bit-Invertierung, FFFE-Einfügung)
  und IPv6-Kompressionsregel (RFC 5952: längste Nullfolge, bei Gleichstand
  die erste von links) gegenprüfen.

### DSL-Umrechner
- Einheit: `module/netzwerktechnik/internetzugang-dsl.html`
- Tool-Datei: `assets/tools/dsl-umrechner.js`
- Einbettung: `data-tool="dsl-umrechner"` im Praxisbeispiel-Block
- Funktion: Bandbreite (Mbit/s) → MByte/s (÷8) sowie Downloadzeit für eine
  Datei gegebener Größe (MB/GB/MiB/GiB wählbar).

---

## Modul 5 — IT-Sicherheit

### Passwort-Komplexität-Rechner
- Einheit: `module/it-sicherheit/authentifizierung-mfa-aaa.html`
- Tool-Datei: `assets/tools/passwort-komplexitaet-rechner.js`
- Einbettung: `data-tool="passwort-komplexitaet-rechner"` im
  Praxisbeispiel-Block
- Funktion: wählbare Zeichenarten (Klein-/Großbuchstaben, Ziffern,
  Sonderzeichen) + Länge → Zeichenraum, Kombinationsanzahl
  (Zeichenraum^Länge) und maximale Brute-Force-Dauer bei frei wählbarer
  Rateversuchs-Rate. Große Zahlen werden in wissenschaftlicher Schreibweise
  dargestellt (Overflow-Schutz bei sehr langen Passwörtern).

---

## Modul 6 — Datenschutz & Recht

### Vertragsart-Klassifizierer
- Einheit: `module/datenschutz-recht/vertragsarten.html`
- Tool-Datei: `assets/tools/vertragsart-klassifizierer.js`
- Einbettung: `data-tool="vertragsart-klassifizierer"` im
  Praxisbeispiel-Block
- Funktion: Auswahl aus 8 vorbereiteten Geschäftsszenarien → zugeordnete
  Vertragsart (Kauf/Werk/Dienst/Miete/Leasing), Rechtsgrundlage (BGB-Norm)
  und kurze Begründung.

---

## Modul 7 — Software, Betriebssysteme & Web

### Base64-Encoder/Decoder
- Einheit: `module/software-os-web/mime-base64.html`
- Tool-Datei: `assets/tools/base64-encoder.js`
- Einbettung: `data-tool="base64-encoder"` im Praxisbeispiel-Block
- Funktion: Text → Base64 und zurück (eigene Implementierung ohne
  `btoa`/`atob`, damit UTF-8 korrekt funktioniert), inkl. sichtbarer
  Bit-Aufteilung des ersten 3-Byte-Blocks in vier 6-Bit-Gruppen.

### Prüfziffern-Rechner
- Einheit: `module/software-os-web/pruefziffern-paritaet.html`
- Tool-Datei: `assets/tools/pruefziffern-rechner.js`
- Einbettung: `data-tool="pruefziffern-rechner"` im Praxisbeispiel-Block
- Funktion: zwei Modi — EAN-13 (12 Ziffern → Prüfziffer per
  Modulo-10-Verfahren mit Faktoren 1/3, optional Prüfung einer 13.
  Ziffer) und IBAN (Länder-Code + BBAN → zwei Prüfziffern per
  Modulo-97-Verfahren nach ISO 7064, inkl. Kontrollrechnung).
- **Fachlich prüfen:** EAN-13-Modulo-10-Verfahren und
  IBAN-Modulo-97-Verfahren (ISO 7064) gegenprüfen.

---

## Verifikation (Stand dieser Bau-Session)

Alle Tools wurden im Browser (lokaler Python-HTTP-Server, da `file://`
für Cross-Origin-Fetch der Quiz-JSONs nicht ausreicht) gegen die jeweiligen
Rechenbeispiele aus dem Konzept-/Praxisabschnitt der eigenen Einheit
geprüft — alle Ergebnisse stimmen exakt überein (u. a. Speicherbedarf
1920×1080×24 Bit, Handelskalkulation LVP ≈ 756,01 €, Break-Even 267 Kunden,
Übertragungsdauer ≈ 343,6 s, EAN-13-Prüfziffer 1 für 400638133393,
IBAN DE89 370400440532013000, EUI-64 aus 00:1A:2B:3C:4D:5E →
021a:2bff:fe3c:4d5e). Zusätzlich bei 360 px Breite auf horizontales
Scrollen geprüft (Layout-Fix in `assets/style.css`: `.tool__result-row`
bricht unterhalb 420 px auf zwei Zeilen um, damit lange Werte wie
IPv6-Adressen nicht in Einzelzeichen umbrechen).
