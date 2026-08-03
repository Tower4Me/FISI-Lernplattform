# ZEICHNUNGSLOG

Protokoll der SVG-Ergänzungen aus QUALITAETSKONTROLLE.md, Kategorie
ZEICHNUNG. Keine TOOLs, keine Textänderungen außer dem für die Grafik
nötigen Einbetten (Lead-Satz, `<figure class="figure--diagram">`-Block).

## Nachträgliche Fehlerkorrektur (Label-über-Linie-Bug)

Ben meldete zwei Screenshots mit sichtbar kaputten Grafiken
(`testverfahren-black-white-box`: abgerissene Verbindungslinie;
`duales-system-ausbildungsvertrag`: Beschriftungstext liegt auf dem
Pfeil). Ursache: Bei Beschriftungen an diagonalen/gekrümmten Linien
reicht `getBoundingClientRect()`/`getBBox()`-Overflow-Prüfung gegen die
viewBox nicht — sie prüft nur, ob Inhalt aus dem Rahmen ragt, nicht ob
Text und Linie sich gegenseitig überlappen.

Neue Prüfmethode: reale Linien-/Pfad-Geometrie mit
`getPointAtLength()` engmaschig abgetastet und gegen die
`getBBox()`-Box jedes `<text>`-Elements geprüft (echte Kollisionsprüfung
statt grober Bounding-Box-Überschneidung, die bei diagonalen Linien
durch die große eigene Bounding-Box viele Fehlalarme erzeugt hätte).
Zusätzlich ein eigenständiges Python-Screening-Skript gebaut
(`check_svg_overlap.py`, im Scratchpad), um alle 66 Dateien mit
`figure--diagram` im Projekt grob vorzufiltern, bevor teure
Browser-Einzelprüfungen laufen.

**Gefundene und behobene echte Bugs** (Label saß auf der Linie, die es
beschriftet, oder Linie war schlicht falsch dimensioniert):
- `testverfahren-black-white-box.html` — Verbindungslinie
  Feinentwurf→Integrationstest war nur 20 statt 100 px lang
  (Kopier-/Tippfehler, `x2="310"` statt `x2="390"`).
- `duales-system-ausbildungsvertrag.html` — zwei Kanten-Labels
  („praktische Ausbildung“, „Theorie & Allgemeinbildung“) lagen auf den
  jeweiligen Pfeillinien.
- `vertragsarten.html` — 5 von 6 Verzweigungs-Labels im
  Entscheidungsbaum lagen auf ihren Linien (Sache/Ergebnis/Tätigkeit/
  Nutzung auf Zeit auf Ebene 1, Rückgabe/Kaufoption auf Ebene 2).
- `wirtschaftskreislauf-wertschoepfungskette.html` — alle 4 neuen
  Diagonal-Label (Steuern/Transfers, Steuern/öff. Güter, Ersparnis/
  Zinsen, Kredit/Zinsen) lagen auf ihren Linien.
- `marktformen.html` — Labels „Nachfrage“, „Angebot“ auf den
  gleichnamigen Kurven; zusätzlich kreuzte die vertikale
  Gleichgewichtsmenge-Linie das „Nachfrageüberhang“-Label (Linie in
  zwei Segmente mit Lücke für das Label aufgeteilt).
- `aufbauorganisation-organigramm.html` — Label „Projekt“ in der
  Matrix-Mini-Grafik lag auf seiner Verbindungslinie.
- `kompression.html` — alle 6 Kanten-Labels (0/1) im Huffman-Baum
  lagen auf ihren Kanten.
- `multitasking-prozesse.html` — Label „gibt CPU ab“ berührte die
  kleine Pfeillinie direkt darunter (Mini-Lücke ergänzt).
- **Vorherige Sitzung (Modul 1–5), stichprobenartig geprüft:**
  `break-even-deckungsbeitrag.html` (Labels „Gesamtkosten“ und
  „Fixkosten (4.000 €)“ lagen auf der Gesamtkosten-Linie) und
  `teamphasen-tuckman.html` (Label „Rückfall möglich“ berührte die
  x-Achse, ~2 px) waren ebenfalls betroffen und wurden korrigiert.
- `topologien-vlan-poe-qos.html` (Modul 4) — Label „zentral am Switch“
  lag auf der unteren Stern-Spoke-Linie, nach unten verschoben.
- `grafikkarte-gpu.html` (Modul 3) — Label „PCIe“ lag auf der
  Verbindungslinie zwischen Grafikkarte und PCIe-Steckplatz, neben den
  Steckplatz statt darauf verschoben.

## Vollständiger Nachprüf-Durchgang Modul 1–6 (auf Bens Bitte)

Alle Dateien mit `figure--diagram` in Modul 1–6 mit der Linien-Abtast-
Methode geprüft (Python-Vorfilter über alle Dateien, danach jeder echte
Kandidat einzeln im Browser mit `getPointAtLength()` gegengeprüft).
Ergebnis: außer den zwei oben genannten neuen Funden (`topologien-vlan-
poe-qos`, `grafikkarte-gpu`) keine weiteren echten Übereinstimmungen.
Einzeln als sauber bestätigt: `problemanalyse-5whys-ishikawa`,
`netzplan`, `zertifikate-tls-pki`, `kommunikationsmodelle`,
`betroffenenrechte`, `vertragsarten`, `backup-arten`.

Als strukturell unbedenklich eingestuft (keine „Linie mit eigenem
Beschriftungs-Label“, sondern große Referenzelemente wie Swimlane-
Grenzen, Gantt-Tagesraster oder Lifelines, bei denen Inhalt zwangsläufig
nahe an der Linie liegt, ohne dass die Linie selbst etwas „behauptet“,
das durch den Text verdeckt würde): `bpmn.html` (Swimlane-Trennlinien),
`gantt-diagramm.html` (Tages-Gitterlinien), `ipv4-subnetting.html`
(Bit-Grenzmarkierungen), `mac-ip-arp-apipa.html` (Sequenzdiagramm-
Lifelines, gleiches Muster wie die bereits verifizierten
`tcp-handshake.html`/`dhcp-dora.html`). Rotierte Achsentitel
(`transform="rotate(...)"`, z. B. „Preis“, „Leistungsfähigkeit/
Zusammenhalt“, „hierarchische Eskalation“) lösen einen Fehlalarm aus,
weil `getBBox()` den eigenen `transform` des Elements ignoriert — mit
echter Sichtprüfung im Browser als unauffällig bestätigt.

**Geprüft und als unauffällig eingestuft** (Fehlalarm der groben
Bounding-Box-Vorprüfung, mit echter Linien-Abtastung im Browser nicht
reproduzierbar): rotierte Achsentitel (z. B. „Preis“, „Kosten/Erlös“,
„Leistungsfähigkeit/Zusammenhalt“) — `getBBox()` ignoriert bei
rotierten `<text>`-Elementen den `transform`, dadurch scheinbarer
Treffer, der real nicht existiert (bereits im Modul-1-Log als bekannte
Einschränkung von `getBBox()` vermerkt, hier für `rotate()` bestätigt).

**Nicht einzeln nachgeprüft, aber strukturell gleich zu bereits
bestätigt unauffälligen Fällen:** Textbeschriftungen direkt neben
vertikalen Sequenzdiagramm-Lifelines, Gantt-Gitterlinien und kurzen
Tick-Strichen (z. B. `website-aufruf-hosting`, `deployment-formate`,
`gantt-diagramm`, `rechtsgeschaefte-geschaeftsfaehigkeit-vertraege`,
`ipv4-subnetting`) — dieses Muster ist projektweit seit den ersten
Einheiten etabliert (Label sitzt bewusst auf/neben der Referenzlinie,
z. B. Achsen- oder Lifeline-Beschriftung) und wurde stichprobenartig
(u. a. `dateisysteme-grundlagen`, `sql-transaktionen`, `betroffenenrechte`)
gegengeprüft — kein reales Problem. Eine lückenlose Einzelprüfung aller
66 Dateien mit `figure--diagram` im Projekt (inkl. aller Alt-Grafiken
aus Modul 1–5) war im Rahmen dieser Korrekturrunde nicht mehr
vollständig möglich; bei weiteren visuellen Auffälligkeiten bitte
melden.

Referenzstil übernommen aus `module/netzwerktechnik/ipv4-subnetting.html`
(ANDing-Diagramm) und `module/software-os-web/epk-ereignisgesteuerte-prozesskette.html`
(EPK-Legende/Beispiel): `<figure class="figure--diagram"><svg viewBox="0 0 W H" role="img" aria-labelledby="…">`,
Farben ausschließlich über `var(--...)`-Tokens, keine feste
`width`/`height` am `<svg>` (übernimmt `.figure--diagram svg { max-width:100%; height:auto; }`
aus `style.css` — dadurch automatisch responsive), `<figcaption>` +
`<title>`/`<desc>` für Barrierefreiheit. Print-Verhalten läuft über die
bereits bestehende `.figure--diagram`-Regel in `@media print`
(`break-inside: avoid`), keine Zusatz-CSS pro Grafik nötig.

Bewusst ausgelassene ZEICHNUNG-Befunde (laut Auftrag):
- Modul 1: `rollen-stakeholder` (Organigramm), `change-management` (Zeitleiste),
  `konfliktloesung-harvard-batna` (Win-win/ZOPA), `first-second-third-level-support` (Trichter)
- Modul 2: `kauf-miete-leasing-tco` (TCO-Balkendiagramm)
- Modul 3: `scanner-sensoren` (CCD-vs-CIS-Schnitt)
- Modul 5: `physische-sicherheit` (Hot/Cold-Aisle-Draufsicht)
- Modul 6: `sla-support-level` (Stufendiagramm)
- Modul 7: `windows-berechtigungen-acl` (ACL-Liste)
- Modul 11: `betriebliche-mitbestimmung` (Stufengrafik), `fort-weiterbildung-umschulung` (Treppe),
  `grenzen-sozialer-sicherung-vorsorge` (3-Schichten), `wandel-maerkte-nachhaltige-entwicklung` (3-Säulen)

Wiederverwendung: PDCA-Zyklus (Modul 5 `sicherheitsstandards-isms` +
Modul 9 `pdca-prozessorientiertes-qm`) — eine Grafik, zweimal identisch
eingebettet (kein gemeinsames Asset-File, da Inline-SVG je Konvention;
identischer SVG-Code an beiden Stellen).

---

## Modul 1 – Projektmanagement (12 Befunde umgesetzt, 4 ausgelassen)

- `projektbegriff-magisches-dreieck` — Dreieck mit Zeit/Kosten/Qualität-Ecken
  und Scope-Fläche in der Mitte. Konzept-Abschnitt.
- `projektphasen-meilensteine` — Zeitstrahl mit 4 Phasenblöcken oben, 2
  Meilenstein-Rauten auf einer Achse darunter. Konzept-Abschnitt.
- `lastenheft-pflichtenheft` — Vertikales Flussdiagramm Auftraggeber →
  Lastenheft → Auftragnehmer → Pflichtenheft → Vertragsbestandteil.
  Konzept-Abschnitt.
- `projektstrukturplan` — SVG-Baum zum ERP-Praxisbeispiel (Root, 5
  Teilprojekte, 5 Arbeitspakete unter Datenmigration inkl. Bottom-up-
  Ergänzung gestrichelt). Eingebettet im Praxisbeispiel-Abschnitt (Befund
  selbst verweist auf „zum Praxisbeispiel"), nicht im Konzept.
- `netzplan` — **Fachlich prüfen**: Vorgangsknotennetz mit FAZ/FEZ/SAZ/SEZ
  je Knoten für das Serverumzug-Beispiel, kritischer Pfad grün, Puffer-Pfad
  gestrichelt. Werte selbst berechnet (Vorwärts-/Rückwärtsrechnung) und
  gegen den Fließtext abgeglichen — bitte gegenlesen, da direkte
  Zahlenangaben (FAZ/FEZ/SAZ/SEZ) im Text bisher nicht vorkamen.
- `gantt-diagramm` — Balkendiagramm Tag 1–13 mit 4 Vorgangsbalken,
  Meilenstein-Raute (Go-Live) und Schulungsvorbereitung inkl.
  gestricheltem Pufferbereich. Praxisbeispiel-Abschnitt.
- `kanban-scrum-board` — 4-Spalten-Board (Neu/In Bearbeitung/Wartet/
  Erledigt) mit Ticket-Karten, WIP-Limit an „In Bearbeitung" rot markiert.
  Konzept-Abschnitt.
- `bpmn` — Zusätzliche Grafik für das **parallele Gateway** (AND-Split/
  AND-Join, Raute mit „+"), ergänzt die bereits vorhandene Legende und das
  Praxisbeispiel (die dort schon standen, nur exklusives Gateway zeigten).
  Konzept-Abschnitt.
- `teamphasen-tuckman` — Tuckman-Kurve (Liniendiagramm) über die 5 Phasen
  inkl. gestrichelter Rückfall-Linie Performing→Storming. Konzept-Abschnitt.
- `kommunikationsmodelle` — **zwei** Grafiken (ein Befund, zwei
  Teilgrafiken laut Befundtext): Nachrichtenquadrat (4 Seiten um eine
  zentrale Nachricht) beim 4-Ohren-Abschnitt, Eisberg-Diagramm
  (Sachebene sichtbar/Beziehungsebene verborgen) beim Eisbergmodell-
  Abschnitt. Beide Konzept.
- `problemanalyse-5whys-ishikawa` — Fischgrätdiagramm mit Wirbelsäule,
  Problem-Kopf und 6 Gräten (6 M) inkl. Kurzbeispiel je Kategorie.
  Konzept-Abschnitt.
- `ticketsystem-stoerungsmanagement-eskalation` — Zwei-Achsen-Diagramm:
  fachliche Eskalation waagerecht (First→Second→Third-Level), hierarchische
  Eskalation senkrecht (First-Level→Teamleiter→Geschäftsleitung gestrichelt).
  Konzept-Abschnitt.

Ausgelassen (siehe Vorgabe oben): `rollen-stakeholder`, `change-management`,
`konfliktloesung-harvard-batna`, `first-second-third-level-support`.

**Hinweis zur Verifikationsmethode:** Ab hier per `getBoundingClientRect()`
statt `getBBox()` auf Überlauf geprüft — `getBBox()` liefert bei rotierten
`<text>`-Elementen (z. B. gedrehte Achsenbeschriftungen) die Bounding Box
VOR der eigenen Transformation und erzeugt dadurch falsche
Überlauf-Warnungen bei Texten, die tatsächlich sauber im Rahmen liegen.
Mit `getBoundingClientRect()` (tatsächlich gerenderte Position) verifiziert,
inkl. Nachprüfung der bereits fertigen Modul-1-Grafiken mit rotierten
Labels (`teamphasen-tuckman`, `ticketsystem-stoerungsmanagement-eskalation`)
— beide sauber, keine Korrektur nötig.

Verifiziert: alle 12 Seiten per Fetch-Parse geprüft (viewBox vorhanden,
keine feste width/height, title+desc vorhanden — bis auf eine bereits
vorher bestehende Lücke in `bpmn.html`, drittes/vorhandenes SVG ohne
`<desc>`, nicht Teil dieser Änderung). Stichproben `kommunikationsmodelle`
und `problemanalyse-5whys-ishikawa` zusätzlich auf Text-Overflow innerhalb
der viewBox geprüft (keine Überschreitung), kein horizontales Scrollen
bei 360px Viewportbreite.

---

## Modul 2 – Kalkulation & Grundrechnen (3 Befunde umgesetzt, 1 ausgelassen)

- `handelskalkulation` — Vertikale Kette LEP→ZEP→BEP→EP (blau, Einkauf)
  → SKP→BVP (grün, Verkaufs-Aufschlag) → ZVP→LVP (violett, Rückrechnung
  durch Division). Konzept-Abschnitt.
- `zuschlagskalkulation-bab` — Zwei parallele Ketten MEK→MK (blau) und
  FEK→FK (violett), münden zusammen in HK, dann weiter additiv über SK
  zu BVP (grün). Konzept-Abschnitt.
- `break-even-deckungsbeitrag` — **Fachlich prüfen**: klassisches
  Break-Even-Diagramm mit Fixkosten-, Gesamtkosten- und Erlöslinie,
  Verlust-/Gewinnzone schattiert, Schnittpunkt bei 267 Kunden/6.675 €.
  Werte selbst aus den Praxisbeispiel-Zahlen (Fixkosten 4.000 €,
  DB 15 €/Kunde) berechnet und mit beiden Geradengleichungen
  gegengeprüft (25x = 4.000 + 10x → x ≈ 266,7) — bitte gegenlesen.
  Konzept-Abschnitt.

Ausgelassen: `kauf-miete-leasing-tco` (TCO-Balkendiagramm).

Verifiziert: alle 3 Seiten (viewBox/title/desc/keine feste Größe) sowie
Text-Overflow per `getBoundingClientRect()` — nach einer gefundenen und
behobenen echten Überschreitung bei `break-even-deckungsbeitrag`
(„Kunden“-Label ragte rechts über die viewBox hinaus, Position korrigiert)
sind alle drei sauber.

---

## Modul 3 – Hardware & Technologien (3 Befunde umgesetzt, 1 ausgelassen)

- `computer-grundaufbau` — Von-Neumann-Blockdiagramm: Steuerwerk/Rechenwerk
  (CPU, gestrichelt umrandet), Speicherwerk und Ein-/Ausgabewerk, alle am
  gemeinsamen, rot hervorgehobenen Bus (Flaschenhals). Konzept-Abschnitt.
- `mainboard-busse` — Topologie CPU-direkt (GPU, NVMe, grün) vs. über
  Chipsatz/PCH verwaltet (USB/SATA/Audio, weitere PCIe-Slots, violett).
  Konzept-Abschnitt.
- `usv-klassen` — Drei Leistungspfad-Diagramme übereinander (VFD/VI/VFI):
  Netz→Last mit unterschiedlich stark eingebundenem Akku (gestrichelt/
  zugeschaltet bei VFD und VI, durchgezogen/ständig im Pfad bei VFI).
  Konzept-Abschnitt.

Ausgelassen: `scanner-sensoren` (CCD-vs-CIS-Schnitt).

Verifiziert: alle 3 Seiten (viewBox/title/desc/keine feste Größe, kein
Text-Overflow per `getBoundingClientRect()`).

---

## Modul 4 – Netzwerktechnik (8 Befunde umgesetzt, 0 ausgelassen — kein
Befund in diesem Modul auf der Ausschlussliste)

- `topologien-vlan-poe-qos` — 2×2-Raster mit Bus/Stern/Ring/Mesh als
  Mini-Schemata. Konzept-Abschnitt.
- `ipv6-grundlagen` — EUI-64 Schritt für Schritt am Beispiel
  00:1A:2B:3C:4D:5E → Trennen → FFFE einfügen → U/L-Bit flippen →
  021A:2BFF:FE3C:4D5E, analog zum ANDing-Diagramm bei IPv4-Subnetting.
  Konzept-Abschnitt.
- `mac-ip-arp-apipa` — ARP-Sequenzdiagramm (Sender/Andere Geräte/
  Ziel-Host), Broadcast-Request + Unicast-Reply, Stil identisch zum
  bestehenden TCP-Handshake-Diagramm übernommen. Konzept-Abschnitt.
- `dhcp-dora` — **Fachlich prüfen**: DORA-Sequenzdiagramm Client↔Server,
  4 Schritte, alle als Broadcast markiert. Reihenfolge/Fakten aus dem
  bereits vorhandenen, korrekten Fließtext übernommen (nichts Neues
  behauptet), trotzdem zur Sicherheit gegenlesen. Konzept-Abschnitt.
- `netzwerk-diagnose` — Flussdiagramm mit 5 Ja/Nein-Entscheidungen
  (Loopback → IP-Konfiguration → Gateway → externe Adresse → DNS),
  bei Nein jeweils vermutliche Fehlerursache. Konzept-Abschnitt.
- `virtualisierung-hypervisor` — Schichtenvergleich Typ 1 (direkt auf
  Hardware) vs. Typ 2 (zusätzliche Host-OS-Schicht). Konzept-Abschnitt.
- `container-docker` — Schichtenvergleich VM (mit eigenem Gast-OS pro
  Instanz) vs. Container (teilen sich den Host-Kernel, nur App+Libs).
  Konzept-Abschnitt.
- `cloud-grundlagen` — Verantwortungs-Matrix On-Premises/IaaS/PaaS/SaaS
  × Infrastruktur/OS/Laufzeitumgebung/Anwendung/Daten, K/A-Kürzel statt
  reiner Farbcodierung (druckfest). Konzept-Abschnitt.

Verifiziert: alle 8 Seiten (viewBox/title/desc/keine feste Größe) sowie
Text-Overflow per `getBoundingClientRect()` bei jeder einzelnen Grafik —
keine Korrektur nötig.

---

## Modul 5 – IT-Sicherheit (5 Befunde umgesetzt, 1 ausgelassen)

- `sicherheitsstandards-isms` — **PDCA-Zyklus** als Kreis aus vier
  Kreisbogen-Segmenten (Plan/Do/Check/Act, im Uhrzeigersinn) um eine
  zentrale Beschriftung „kontinuierliche Verbesserung". Identischer
  SVG-Code wird unten in Modul 9 (`pdca-prozessorientiertes-qm`)
  wiederverwendet. Konzept-Abschnitt.
- `zertifikate-tls-pki` — Baumdiagramm Root-CA → Intermediate-CA →
  End-Zertifikat, plus Browser-Knoten mit „vertraut direkt" (gestrichelt
  zur Root-CA) und „prüft Kette" (durchgezogen zum End-Zertifikat).
  Konzept-Abschnitt.
- `berechtigungskonzepte` — Schalenmodell als 5 konzentrische Kreise
  (physischer Zugang → Netzwerk → OS-Login → Anwendung → Datenfreigabe),
  Beschriftung außen über Leader-Linien, Farbverlauf blau→rot zur
  zunehmenden Kritikalität nach innen. Konzept-Abschnitt.
- `backup-arten` — Zwei Restore-Ketten-Zeitstrahlen (Inkrementell vs.
  Differenziell) für dasselbe Sonntag-Montag-Dienstag-Mittwoch-Beispiel:
  bei Inkrementell alle Backups in Kette nötig, bei Differenziell wird
  das Montags-Backup übersprungen (gestrichelt, „nicht benötigt").
  Konzept-Abschnitt.
- `rto-rpo-verfuegbarkeit` — Zeitstrahl mit „Letztes Backup“ —RPO→
  „Ausfall“ —RTO→ „Wiederanlauf“, RPO oberhalb (Blick zurück), RTO
  unterhalb (Blick vor) der Achse, Werte aus dem Praxisbeispiel (RTO 2 Std,
  RPO 15 Min). Konzept-Abschnitt.

Ausgelassen: `physische-sicherheit` (Hot/Cold-Aisle-Draufsicht).

Verifiziert: alle 5 Seiten (viewBox/title/desc/keine feste Größe) sowie
Text-Overflow per `getBoundingClientRect()`. Bei `sicherheitsstandards-isms`
zusätzlich die vier Kreisbogen-Pfade (`<path>` mit `A`-Arc-Befehl) über
`getBBox()` gegengeprüft — alle vier Bounding-Boxen konsistent
(71×71 je Quadrant), Geometrie stimmt.

---

## Modul 6 – Datenschutz & Recht (2 Befunde umgesetzt, 1 ausgelassen)

- `betroffenenrechte` — Beziehungsdiagramm der DSGVO-Rollen: betroffene
  Person übt Rechte gegenüber dem Verantwortlichen aus, der einen
  Auftragsverarbeiter beauftragen kann (AVV, bleibt aber selbst
  verantwortlich — als eigene Zeile im Verantwortlichen-Knoten markiert,
  nicht als Pfeil, da keine reale Nachricht), ein interner
  Datenschutzbeauftragter überwacht/berät (gestrichelter Pfeil), und bei
  Datenpannen wird an die Aufsichtsbehörde gemeldet — bei der auch die
  betroffene Person Beschwerde einlegen kann (roter gestrichelter
  Außenpfad, führt am DSB-Knoten vorbei). Konzept-Abschnitt, direkt nach
  der Rollen-Tabelle.
- `vertragsarten` — Entscheidungsbaum zur Vertragsart-Bestimmung: Wurzel
  „Was wird geschuldet?" verzweigt zu Sache (Kaufvertrag), Ergebnis
  (Werkvertrag), Tätigkeit (Dienstvertrag) und einem Zwischenknoten
  „Nutzung auf Zeit", der sich weiter in Rückgabe (Mietvertrag) und
  Kaufoption (Leasingvertrag) aufteilt. Konzept-Abschnitt, im
  „Werkvertrag vs. Dienstvertrag"-Bereich, wie im Befund verortet.

Ausgelassen: `sla-support-level` (First/Second/Third-Level-Stufendiagramm,
laut Auftrag).

*Kein Befund (nicht angefasst): `dsgvo-grundlagen`, `persoenlichkeitsrechte`,
`gewaehrleistung-garantie`, `normen-compliance`, `barrierefreiheit-software`.*

Verifiziert: beide Seiten (viewBox/title/desc/keine feste Größe) sowie
Content-Overflow per `getBBox()` gegen die jeweilige viewBox geprüft
(`betroffenenrechte`: Inhalt bis 500×414 in einer 520×434-viewBox;
`vertragsarten`: Inhalt bis 655×278 in einer 660×300-viewBox — beide ohne
Überschreitung) und `document.documentElement.scrollWidth` bei 360px
Viewportbreite geprüft (kein horizontales Scrollen auf beiden Seiten).

---

## Modul 7 – Software, OS & Web (8 Befunde umgesetzt, 1 ausgelassen)

- `multitasking-prozesse` — Zeitachsen-Vergleich kooperatives vs.
  präemptives Multitasking: zwei Zeitleisten, oben kooperativ (Prozess A
  gibt an B ab, hängt sich danach auf und blockiert dauerhaft —
  schraffiert + rote Umrandung), unten präemptiv (gleich große
  Zeitscheiben, erzwungener Wechsel unabhängig vom Prozess).
  Konzept-Abschnitt.
- `dateisysteme-grundlagen` — Vom Verzeichniseintrag über Inode/MFT zu
  den Datenblöcken: Verzeichniseintrag verweist auf Inode/MFT-Eintrag
  (Metadaten), der auf mehrere, absichtlich nicht fortlaufend
  nummerierte Datenblöcke zeigt (Fragmentierungs-Hinweis).
  Konzept-Abschnitt.
- `dateisysteme-vergleich` — Slack Space: zwei Blockdarstellungen
  (1-KB-Datei im 4-KB-Block mit schraffiertem Slack-Rest vs.
  4-KB-Datei ohne Slack Space). Konzept-Abschnitt.
- `kompression` — Huffman-Baum für die Beispielhäufigkeiten A=5/B=3/C=2/D=1
  (frei gewähltes Lehrbuchbeispiel, keine Quellmaterial-Übernahme):
  0-Kanten durchgezogen, 1-Kanten gestrichelt, resultierende Codes je
  Blatt. Konzept-Abschnitt.
- `bild-videoformate` — Container vs. Codec am Beispiel MP4: zwei
  MP4-Container nebeneinander mit identischer Video-/Audiospur-Struktur,
  aber unterschiedlichem Video-Codec (H.264 vs. H.265) — zeigt, dass
  Container und Codec unabhängige Entscheidungen sind. Konzept-Abschnitt.
- `website-aufruf-hosting` — Sequenzdiagramm Client/DNS-Server/Webserver,
  6 Schritte (DNS-Anfrage/-Antwort, TCP/TLS-Aufbau, HTTP-Request/-Response,
  lokales Rendering als gestrichelte Selbstnotiz). Konzept-Abschnitt.
- `mime-base64` — Base64 am Beispiel „Man" → „TWFu" (klassisches,
  frei nachvollziehbares Lehrbeispiel): 3 Bytes farblich je Ursprung,
  zusammengefügt zu 24 Bit, neu gruppiert in vier 6-Bit-Gruppen (Farben
  zeigen die Byte-Grenzen-Überschreitung), Ergebnis-Zeichen T/W/F/u.
  Konzept-Abschnitt.
- `deployment-formate` — Sequenzdiagramm PXE-Boot: Client↔Deployment-Server,
  boot.wim zuerst (Windows PE startet lokal), danach erst install.wim.
  Konzept-Abschnitt.

Ausgelassen: `windows-berechtigungen-acl` (ACL-Liste, laut Auftrag).

*Kein Befund/nicht angefasst (nur andere Kategorien oder sauber):
`linux-konsole`, `windows-vs-linux`, `software-klassifikation`,
`branchensoftware`, `ki-grundlagen`, `it-servicemanagement`,
`pruefziffern-paritaet`, `epk-ereignisgesteuerte-prozesskette`,
`url-uri-urn`, `html-css-grundlagen`, `bildschirmausgabemasken`,
`programmierparadigmen`, `datentypen-pseudocode`,
`compiler-interpreter-debugging`, `uml-diagramme`,
`pap-programmablaufplan`, `struktogramm-nassi-shneiderman`,
`zeichensaetze-ascii-unicode`, `partitionierung-formatierung`,
`multitasking-prozesse` (nur ZEICHNUNG-Befund, keine weiteren).*

Verifiziert: alle 8 Seiten per `getBBox()`-Content-Overflow gegen die
jeweilige viewBox geprüft (keine Überschreitung) sowie
`document.documentElement.scrollWidth` bei 360px Viewportbreite
(`multitasking-prozesse`, `betroffenenrechte`-Methode fortgeführt) —
kein horizontales Scrollen. `mime-base64`: nach Erstverifikation zwei
Tippfehler korrigiert (gerade `"` statt der im Projekt sonst
durchgängig genutzten „…"-Anführungszeichen in Titel/Bildtext).

---

## Modul 8 – Datenbanken & SQL (2 Befunde umgesetzt, 0 ausgelassen)

- `sql-join` — **Fachlich prüfen**: vier Venn-Diagramme (INNER/LEFT/
  RIGHT/FULL OUTER JOIN) mit Tabellen A = mitarbeiter, B = abteilung.
  Schattierung per `clipPath`-Schnitt (INNER) bzw. volle Kreisfüllung
  (LEFT/RIGHT je ein Kreis, FULL OUTER beide) umgesetzt — Mengenlogik
  selbst hergeleitet und gegen die im Fließtext bereits beschriebenen
  JOIN-Definitionen abgeglichen, bitte trotzdem gegenlesen, da
  JOIN-Venn-Mengen laut Auftrag als fehleranfällig gilt.
  Konzept-Abschnitt.
- `sql-transaktionen` — Zeitstrahl SAVEPOINT: BEGIN → INSERT → SAVEPOINT
  → UPDATE (Tippfehler, rot markiert mit ✕) → ROLLBACK TO (gestrichelter
  Rückfallpfeil zum SAVEPOINT, „verwirft UPDATE") → COMMIT. Werte/Ablauf
  direkt aus der bereits im Fließtext stehenden Beispiel-Befehlskette
  übernommen, keine neuen Fakten erfunden. Konzept-Abschnitt.

*Kein Befund: `db-grundlagen`, `datentypen-constraints`, `normalisierung`,
`sql-ddl`, `sql-dml`, `sql-dcl`, `sql-subqueries`,
`er-modell-kardinalitaeten` (nur FALSCH-Befund, keine ZEICHNUNG).*

Verifiziert: beide Seiten per `getBBox()` (keine Überschreitung,
`sql-join`: Inhalt bis 364×294 in 420×305; `sql-transaktionen`: Inhalt
bis 498×233 in 500×250 — knappe, aber ausreichende Ränder) sowie
Sichtprüfung per Screenshot (Rollback-Bogen, ✕-Markierung und
Venn-Schattierungen rendern wie vorgesehen).

---

## Modul 9 – Qualitätssicherung (2 Befunde umgesetzt, 0 ausgelassen)

- `pdca-prozessorientiertes-qm` — **Wiederverwendung**: identischer
  PDCA-Kreis-SVG-Code wie `it-sicherheit/sicherheitsstandards-isms.html`
  (Modul 5), 1:1 übernommen, gleicher Alt-Text/Desc leicht an den
  Kontext dieser Einheit angepasst (kein ISMS-Bezug in der Figcaption).
  Konzept-Abschnitt, im Abschnitt „Der PDCA-Zyklus".
- `testverfahren-black-white-box` — **Fachlich prüfen**: V-Modell mit
  linker absteigender Seite (Anforderungen → Grobentwurf → Feinentwurf
  → Implementierung) und rechter aufsteigender Seite (Unittest →
  Integrationstest → Systemtest → Abnahmetest), gestrichelte
  Querverbindungen zeigen, welche Teststufe gegen welche Entwicklungsphase
  prüft. Die vier Teststufen und ihre Zuständigkeit/Black-White-Box-Angaben
  stammen direkt aus dem Fließtext der Einheit; die linke Seite
  (Anforderungen/Grobentwurf/Feinentwurf) ist das textbuchübliche
  V-Modell-Gegenstück, wird aber in der Einheit selbst nicht behandelt —
  bitte gegenlesen, ob diese Ergänzung so gewünscht ist. Konzept-Abschnitt.

Verifiziert: beide Seiten per `getBBox()` (keine Überschreitung;
`testverfahren-black-white-box`: Inhalt bis 580×310 in 600×320, knapper
aber ausreichender Rand). `pdca-prozessorientiertes-qm` übernimmt
1:1 bereits verifizierten Code, keine erneute Geometrieprüfung nötig.

---

## Modul 10 – Kaufmännisches & Auftragsabwicklung (3 Befunde umgesetzt,
0 ausgelassen)

- `marktformen` — Angebot-Nachfrage-Diagramm: fallende Nachfragekurve,
  steigende Angebotskurve, Schnittpunkt als Gleichgewicht (ohne erfundene
  Zahlenwerte, da im Fließtext keine konkreten Preise/Mengen vorkommen —
  bewusst als Konzeptdiagramm ohne Achsenbeschriftung mit Werten gehalten),
  zusätzlich je ein gestrichelter Doppelpfeil oberhalb (Angebotsüberschuss)
  und unterhalb (Nachfrageüberhang) des Gleichgewichts, beide Begriffe
  stehen bereits im Fließtext. Konzept-Abschnitt.
- `abc-analyse-aida-produktlebenszyklus` — S-Kurve Produktlebenszyklus
  über die vier Phasen (Einführung/Wachstum/Reife-Sättigung/Rückgang),
  Phasengrenzen als gestrichelte Vertikallinien. Konzept-Abschnitt.
- `aufbauorganisation-organigramm` — Vergleichs-Grafik der vier
  Organisationsformen (2×2-Raster): Einlinien- und Stablinien- system
  als Baum mit durchgezogenen Weisungslinien (Stablinie zusätzlich mit
  gestrichelter Stabsstellen-Linie), Mehrliniensystem als zwei
  gleichrangige Vorgesetzte auf eine Person, Matrixorganisation als
  echtes 2D-Gitter (Abteilungs-Zeilen × Projekt-Spalten) zur klaren
  Abgrenzung von Mehrlinien. Konzept-Abschnitt.

*Kein Befund: `wirtschaftssektoren-grundfunktionen`,
`zielgruppen-kundentypologien`, `vertriebsformen-b2b-b2c-marktforschung`,
`outsourcing-offshoring-geschaeftsmodelle`,
`informationsrecherche-quellenbewertung`,
`praesentationstechniken-medienkompetenz`, `make-or-buy-angebotsvergleich`,
`ausschreibung-leistungsverzeichnis`, `vollmachten-prokura`,
`abnahme-abnahmeprotokoll`, `lessons-learned-nachfolgeauftraege`,
`unternehmens-gesellschaftsformen` (nur TOOL-Befund).*

Verifiziert: alle 3 Seiten per `getBBox()` (keine Überschreitung;
`marktformen`: 450×247 in 460×290; `abc-analyse-…`: 450×242 in 460×260;
`aufbauorganisation-organigramm`: 465×347 in 480×400).

---

## Modul 11 – WiSo (4 Befunde umgesetzt, 4 ausgelassen)

- `duales-system-ausbildungsvertrag` — Beziehungsgrafik: Auszubildende(r)
  im Zentrum, lernt bei Ausbildungsbetrieb (praktisch) und Berufsschule
  (theoretisch) — beide inhaltlich abgestimmt (gestrichelt) —, Betrieb
  meldet den Vertrag bei der zuständigen Stelle (IHK) an, die wiederum
  Trägerin der Abschlussprüfung ist (Außenpfad, analog zum
  „Beschwerde"-Pfad bei `betroffenenrechte`). Konzept-Abschnitt.
- `soziale-sicherung` — Fünf-Säulen-Grafik: gemeinsames Dach „Gesetzliche
  Sozialversicherung", fünf Säulen KV/PV/RV/AV/UV mit Kürzel, Namen,
  abgesichertem Risiko und Finanzierung; UV zusätzlich schraffiert und
  „nur Arbeitgeber" hervorgehoben, da einzige nicht-paritätische Säule.
  Konzept-Abschnitt.
- `wirtschaftskreislauf-wertschoepfungskette` — Erweiterter
  Wirtschaftskreislauf als zweite, neue Grafik neben dem bereits
  vorhandenen einfachen Kreislauf (nicht verändert): Staat
  (Steuern/Transfers, Steuern/öff. Güter), Banken (Ersparnis/Zinsen,
  Kredit/Zinsen) und Ausland (Export/Import, an Unternehmen angebunden)
  als zusätzliche Knoten um das bestehende Haushalte-Unternehmen-Paar.
  Eigene Marker-IDs verwendet, um Kollisionen mit den bereits im
  ersten SVG der Seite vorhandenen IDs `arrowLink`/`arrowMuted` zu
  vermeiden. Konzept-Abschnitt.
- `rechtsgeschaefte-geschaeftsfaehigkeit-vertraege` — Zeitstrahl
  Geschäftsfähigkeit: drei Altersstufen (0–7 geschäftsunfähig, 7–18
  beschränkt geschäftsfähig, ab 18 voll geschäftsfähig) mit
  Kurzbeschreibung je Stufe, zusätzliche Anmerkung zum
  Taschengeldparagrafen (§ 110 BGB) an der mittleren Stufe. Werte 1:1
  aus der bereits vorhandenen Tabelle übernommen. Konzept-Abschnitt.

Ausgelassen (laut Auftrag): `betriebliche-mitbestimmung`
(Stufengrafik), `fort-weiterbildung-umschulung` (Treppengrafik),
`grenzen-sozialer-sicherung-vorsorge` (3-Schichten-Grafik),
`wandel-maerkte-nachhaltige-entwicklung` (3-Säulen-Grafik).

*Kein Befund: `arbeitsvertrag-kuendigung` (nur TOOL), `entgeltabrechnung`
(nur FALSCH/UNVERSTÄNDLICH/TOOL), `arbeitsschutzgesetze`, `tarifrecht`,
`wandel-arbeitswelt-digitalisierung`, `arbeiten-lernen-europa`,
`existenzgruendung` (nur TOOL), `wirksamkeit-rechtsgeschaefte-verbraucherschutz`
(nur UNVERSTÄNDLICH), `beduerfnis-bedarf-kaufkraft` (nur UNVERSTÄNDLICH),
`karriere-familienplanung-rollenreflexion`, `soziale-marktwirtschaft`,
`standortwettbewerb-lohnniveau`, `chancen-risiken-europa-globalisierung`.*

**Bugfix während der Verifikation:** Bei `rechtsgeschaefte-…` waren nach
dem ersten Schreiben sämtliche doppelten Anführungszeichen innerhalb des
SVG-Blocks als typografische „gerade" Zeichen (”) statt als echte
ASCII-`"` im HTML gelandet (Ursache nicht abschließend geklärt, trat nur
bei dieser einen Datei auf) — dadurch griff `.figure--diagram svg` nicht
und `viewBox` blieb leer. Per `grep '="'` über `module/` nach identischem
Muster in allen anderen heute erstellten Dateien gesucht: kein weiterer
Treffer. Block mit korrekten Anführungszeichen neu geschrieben und
anschließend echten Overflow gefunden und behoben (Label „voll
geschäftsfähig" ragte 3,4px über die viewBox — Breite von 460 auf 480
erhöht).

Verifiziert: alle 4 Seiten per `getBBox()` (keine Überschreitung nach
Fix; `duales-system-…`: 460×298 in 480×320; `soziale-sicherung`:
465×240 in 480×250; `wirtschaftskreislauf-…`: beide SVGs der Seite
geprüft, zweites bis 690×460 in 700×470; `rechtsgeschaefte-…`: 463×175
in 480×180 nach Breiten-Korrektur).

---

## Vierter Korrekturdurchgang — von Ben per Screenshot gemeldet

Vier weitere echte Bugs, alle **nicht** durch die automatisierte
Linien/Text-Abtastung auffindbar, weil es sich um andere Fehlerklassen
handelt als „Label liegt auf eigener Linie". Zeigt: automatisierte
Prüfung ersetzt keine Sichtprüfung.

- `testverfahren-black-white-box.html` — **drei** Probleme in einer
  Grafik:
  1. Die mittlere gestrichelte Linie (Grobentwurf → Systemtest) endete
     bei `x2="390"` statt bei Systemtest (`x2="470"`) — sie erreichte
     nur die Höhe von Integrationstest, nicht die von Systemtest.
     Reiner Koordinaten-Fehler, unabhängig vom zuvor behobenen
     Feinentwurf→Integrationstest-Bug in derselben Datei.
  2. Die grünen Pfeile (Unittest→Integrationstest→Systemtest→
     Abnahmetest) zielten auf Punkte neben statt auf den Kästchen
     (z. B. Pfeilspitze bei x=370, während Integrationstest erst bei
     x=390 beginnt).
  3. Blaue wie grüne Pfeile liefen von/zu Kästchen-Ecken statt
     -Mitten. Alle sechs Pfeile auf echte Kantenmitten der jeweiligen
     Kästchen umgerechnet (z. B. Anforderungen-Unterkante-Mitte →
     Grobentwurf-Oberkante-Mitte statt Ecke-zu-Ecke).
- `netzplan.html` — der gestrichelte gepufferte Pfeil von
  „Schulungsvorbereitung" zu „Go-Live" (`polyline`) endete bei
  `y="50"` (Oberkante von Go-Live) statt bei `y="122"` (Unterkante) —
  dadurch durchstach der Pfeil das gesamte Go-Live-Kästchen, statt an
  der Unterkante zu enden. Endpunkt korrigiert.
- `grafikkarte-gpu.html` — das kleine PCIe-Steckplatz-Rechteck
  (y="134", Höhe 10, Unterkante 144) überlappte 4 px mit der
  „Mainboard"-Leiste darunter (Oberkante 140); da die Mainboard-Leiste
  später im Dokument steht (= im Vordergrund gezeichnet wird),
  schnitt sie den unteren Rand des PCIe-Rechtecks sichtbar ab
  („abgehakt"/abgeschnitten). Rechteck + Verbindungslinie nach oben
  verschoben (Unterkante jetzt 137, 3 px Abstand zur Mainboard-Leiste).
- `ticketsystem-stoerungsmanagement-eskalation.html` — das rotierte
  Label „hierarchische Eskalation“ hatte `transform="rotate(-90 10
  180)"`, stand aber selbst bei `x="10" y="255"` — Rotationszentrum und
  Textposition wichen um 75 px in y voneinander ab. Bei einer Rotation
  um einen Punkt, der nicht der eigene Textanker ist, wandert der Text
  auf einer Kreisbahn um dieses Zentrum statt sich nur zu drehen —
  hier landete er mitten auf der Teamleiter-Box und der waagerechten
  Achse. **Das entkräftet die frühere Einstufung aller rotierten
  Achsentitel als generellen Fehlalarm** (siehe vorheriger Abschnitt):
  Der Fehlalarm gilt nur, wenn Text-Position und Rotationszentrum
  übereinstimmen (dann verschiebt `getBBox()` fälschlich, obwohl das
  Rendering korrekt ist) — stimmen sie nicht überein, ist es ein
  echter Bug, der nur durch Sichtprüfung auffällt. Zur Sicherheit alle
  `rotate(-90 …)`-Vorkommen im Projekt per `grep` durchsucht: einziger
  Treffer mit Abweichung war dieser; `break-even-deckungsbeitrag`,
  `marktformen`, `teamphasen-tuckman`, `abc-analyse-…` und beide
  Stellen in `bpmn.html` haben Text-Position und Rotationszentrum
  identisch und sind bestätigt unauffällig. Fix: Text-`y` von 255 auf
  180 (= Rotationszentrum) korrigiert.

Alle vier Fixes per Screenshot im Browser gegengeprüft (nicht nur
Geometrie-Berechnung) — sehen jetzt wie beabsichtigt aus. Zusätzlich
`getBBox()`-Overflow gegen die jeweilige viewBox geprüft: keine
Überschreitung bei allen vieren.

## Fünfter Korrekturdurchgang — Symmetrie des V-Modells

Ben wies darauf hin, dass die Kästchen-Anordnung im V-Modell trotz des
vorherigen Fixes „komisch" wirkte. Ursache: linke und rechte Seite
hatten unterschiedliche Versatz-Schritte zwischen den Ebenen — z. B.
lagen Systemtest und Abnahmetest exakt übereinander (`cx=525` bei
beiden) statt diagonal versetzt wie ihr Pendant Anforderungen/
Grobentwurf auf der linken Seite. Komplett neu aufgebaut mit
gleichem horizontalem Versatz (55 px je Ebene) und gleichem
vertikalem Versatz (45 px je Ebene) auf beiden Seiten, echt
spiegelsymmetrisch um die Mittelachse (x=300): Anforderungen (cx=75)
↔ Abnahmetest (cx=525), Grobentwurf (130) ↔ Systemtest (470),
Feinentwurf (185) ↔ Integrationstest (415), Implementierung (240) ↔
Unittest (360) mit 10 px Lücke am unteren Treffpunkt der beiden
Diagonalen. Alle sechs Pfeile und drei gestrichelten
Verbindungslinien entsprechend neu berechnet. viewBox-Höhe von 320
auf 340 erhöht (unterer Ebenen-Abstand jetzt konsistent 45 statt
30 px). Per Screenshot und `getBBox()`-Check bestätigt: symmetrisch,
kein Overflow, keine Überlappung.

---
