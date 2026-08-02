# Qualitätskontrolle aller Module

Systematische Durchsicht aller Lerneinheiten (Stand: 2026-08-02). Reine
Befundsammlung — es wurde nichts am Inhalt der Module geändert.

Kategorien:
1. **FALSCH** — fachlich/technisch falsche Aussagen
2. **UNVERSTÄNDLICH** — schwer verständliche oder unklare Stellen
3. **VERBESSERN** — sprachlich/didaktisch verbesserbar (kein Muss)
4. **ZEICHNUNG** — wo eine Grafik/Diagramm das Verständnis deutlich heben würde
5. **TOOL** — wo ein interaktives Tool sinnvoll wäre (Vorbild: Subnetting-Rechner)

Module ohne Befund sind hier nicht aufgeführt (sauber).

---

## Modul 1 – Projektmanagement (19 Einheiten geprüft, 17 mit Befund)

### Projektbegriff & magisches Dreieck (`projektbegriff-magisches-dreieck`)
- **ZEICHNUNG**: Konzept — das magische Dreieck wird nur mit der Mobile-Analogie und Fließtext beschrieben. Eine SVG-Grafik des Dreiecks (drei Ecken Zeit/Kosten/Qualität, Scope als Fläche in der Mitte) fehlt.
- **TOOL**: Konzept/Praxis — ein Schieberegler-Tool für Zeit/Kosten/Qualität, das die gegenseitige Wechselwirkung zeigt, fehlt.

### Projektphasen, Meilensteine & Kick-off (`projektphasen-meilensteine`)
- **ZEICHNUNG**: Konzept — das 4-Phasen-Modell steht nur als Tabelle. Ein Zeitstrahl mit den vier Phasen und Meilensteinen als Punktmarkierungen würde den sequenziellen Ablauf sowie Phase (Zeitraum) vs. Meilenstein (Zeitpunkt) klarer machen.

### Lastenheft vs. Pflichtenheft (`lastenheft-pflichtenheft`)
- **ZEICHNUNG**: Konzept — der Ablauf Auftraggeber → Lastenheft → Auftragnehmer → Pflichtenheft → Vertragsbestandteil wird nur textuell/tabellarisch erklärt; ein Flussdiagramm fehlt.

### Rollen & Stakeholder (`rollen-stakeholder`)
- **ZEICHNUNG**: Konzept — die Rollenhierarchie (Auftraggeber, Steuerkreis, Projektleiter, Team) steht nur als Tabelle; ein Organigramm mit Berichts-/Eskalationslinien fehlt.
- **TOOL**: Konzept — die Macht-Interesse-Matrix wird nur beschrieben, nirgends gezeigt/interaktiv; ein Einordnungs-Tool (2x2-Raster) fehlt.

### SMART-Ziele (`smart-ziele`)
- **TOOL**: Konzept/Praxis — ein interaktiver „SMART-Ziel-Checker" (eigene Formulierung eingeben, Kriterien werden geprüft) fehlt.

### Projektstrukturplan (`projektstrukturplan`)
- **ZEICHNUNG**: Konzept — der PSP ist per Definition ein Baumdiagramm, steht aber nur als Tabelle (Top-down/Bottom-up/Yo-Yo). Ein SVG-Baum zum Praxisbeispiel (ERP-Einführung) fehlt.
- **TOOL**: Konzept/Praxis — ein interaktives PSP-Werkzeug (Knoten anlegen/zuordnen) fehlt, nachrangig gegenüber der fehlenden Zeichnung.

### Netzplan & kritischer Pfad (`netzplan`)
- **ZEICHNUNG**: Konzept/Praxis — trotz Kern-Diagrammthema (Vorgangsknotennetz, Vorwärts-/Rückwärtsrechnung, kritischer Pfad) enthält die Einheit kein einziges SVG.
- **VERBESSERN**: Konzept — die Standard-IHK-Notation für Vorgangsknoten (FAZ/FEZ/SAZ/SEZ, Formeln FEZ = FAZ + Dauer, Puffer = SAZ − FAZ) fehlt; AP2-Aufgaben verlangen konkrete Berechnung dieser Werte, die Einheit bereitet nur qualitativ vor.
- **TOOL**: Konzept/Praxis — ein Netzplan-Rechner (Vorgänge mit Dauer/Vorgängern → automatische Berechnung von Puffer/kritischem Pfad) fehlt.

### Gantt-Diagramm (`gantt-diagramm`)
- **ZEICHNUNG**: Praxisbeispiel — das Beispiel liefert exakte Balkenwerte (Tag 1–5, 6–7, 8–10, 11–12, Meilenstein Tag 13 etc.), wird aber nirgends als Balken-SVG dargestellt.
- **TOOL**: Praxis — ein interaktiver Gantt-Generator (Vorgänge → Balken zeichnen, ggf. aus Netzplan-Werten abgeleitet) fehlt.

### Kanban- & Scrum-Board (`kanban-scrum-board`)
- **ZEICHNUNG**: Konzept — keine visuelle Board-Darstellung (Spalten/Karten), obwohl das Board selbst ein visuelles Artefakt ist.
- **TOOL**: Praxis — ein interaktives Mini-Kanban-Board (Karten zwischen Spalten verschieben, WIP-Limit blockiert bei Überschreitung) fehlt.

### BPMN (`bpmn`)
- **ZEICHNUNG**: Konzept — Legende und Praxisbeispiel zeigen nur das exklusive Gateway. Das im Text erklärte parallele Gateway wird nirgends visuell dargestellt.

### Change Management (`change-management`)
- **ZEICHNUNG**: Einstieg/Konzept — kein einziges SVG-Diagramm. Eine Zeitleiste (Unfreeze → Change → Refreeze) neben dem Kaizen-Vergleich fehlt.

### Teamphasen nach Tuckman (`teamphasen-tuckman`)
- **ZEICHNUNG**: Konzept — kein Diagramm vorhanden; die klassische Tuckman-Kurve (Leistungsfähigkeit über die 5 Phasen inkl. möglichem Rückfall) fehlt.

### Kommunikationsmodelle (`kommunikationsmodelle`)
- **ZEICHNUNG**: Konzept — kein Diagramm vorhanden, obwohl zwei bildhafte Modelle behandelt werden (4-Seiten-Quadrat nach Schulz von Thun, Eisbergmodell).
- **TOOL**: Konzept/Praxis — ein „4-Ohren-Simulator" (Beispielnachricht, vier Interpretationen durchklicken) fehlt.

### Konfliktlösung (Harvard-Konzept, BATNA) (`konfliktloesung-harvard-batna`)
- **ZEICHNUNG**: Konzept — kein Diagramm; eine Win-win/Win-lose/Lose-lose-Matrix sowie eine ZOPA-Visualisierung (Verhandlungsspielraum zwischen den BATNAs) fehlen.
- **TOOL**: Konzept/Praxis — ein interaktiver BATNA/ZOPA-Rechner fehlt.

### Problemanalyse (5 Whys, Ishikawa) (`problemanalyse-5whys-ishikawa`)
- **FALSCH**: Konzept — Tabelle „Ishikawa-Diagramm (6 M)", Zeile „Management (Measurement)": die Klammer-Übersetzung ist fachlich falsch. „Management" und „Measurement" (Messung) sind zwei unterschiedliche Begriffe aus zwei verschiedenen 6M-Varianten, hier fälschlich gleichgesetzt. Die Beispielspalte vermischt zusätzlich beide Konzepte (Monitoring passt zu Measurement, Zuständigkeiten zu Management).
- **ZEICHNUNG**: Konzept — das Ishikawa-/Fischgrätdiagramm wird nur textuell beschrieben, ein tatsächliches SVG-Fischgrätdiagramm fehlt, obwohl genau diese Visualisierung den Kern des Konzepts ausmacht.
- **TOOL**: Konzept/Praxis — ein interaktives 5-Whys-/Ishikawa-Tool (Ursachen je Kategorie eintragen bzw. geführte Warum-Kette) fehlt.

### Ticketsystem, Störungsmanagement & Eskalation (`ticketsystem-stoerungsmanagement-eskalation`)
- **UNVERSTÄNDLICH**: Merksatz — führt „Problemmanagement" neu ein („… während Problemmanagement die Ursache behebt"), obwohl im Konzept nur „Problem" als Tabellenbegriff definiert wird, nicht „Problemmanagement" als eigener Begriff. Wirkt im Merksatz unvermittelt.
- **ZEICHNUNG**: Konzept — die zwei Eskalationsarten (fachlich vs. hierarchisch) stehen nur tabellarisch; ein Diagramm, das beide Achsen getrennt visualisiert, fehlt.
- **TOOL**: Konzept — ein Priorisierungs-Tool (Dringlichkeit × Auswirkung → Priorität) fehlt, obwohl genau dieses Berechnungsprinzip im Text beschrieben wird.

### First-, Second- & Third-Level-Support (`first-second-third-level-support`)
- **ZEICHNUNG**: Konzept — die Kernaussage „möglichst viele Anfragen auf der ersten, kostengünstigsten Ebene lösen" steht nur als Text; ein Trichter-/Pyramid-Diagramm (abnehmendes Fallvolumen, zunehmende Spezialisierung/Kosten) fehlt.

*Sauber (kein Befund): `wasserfall-vs-agil`, `feedback-retrospektive`.*

---

## Modul 2 – Kalkulation & Grundrechnen (9 Einheiten geprüft, 8 mit Befund)

### Bits & Bytes (`bits-und-bytes`)
- **FALSCH**: Praxisbeispiel — Rundungskaskade bei der Tagesspeicherbedarfs-Rechnung: 1.440 × gerundete 2,64 MiB wird als „≈ 3.802 MiB" ausgewiesen; exakt (1.440 × 2.764.800 Byte ÷ 1024²) ergeben sich aber ≈ 3.796,9 MiB. Das Endergebnis 3,71 GiB bleibt zufällig richtig, der Zwischenwert 3.802 MiB stimmt aber nicht exakt.
- **TOOL**: Konzept/Praxis — für die wiederkehrende Rechenaufgabe „Speicherbedarf = Breite × Höhe × Farbtiefe" existiert kein eigener Rechner; ein Tool mit Eingabe Auflösung/Farbtiefe → Ausgabe in Bit/Byte/KiB/MiB fehlt.

### Übertragungsdauer & Bandbreite (`datenmengen-uebertragung`)
- **TOOL**: Konzept/Praxis — die Formel „Übertragungsdauer = Datenmenge ÷ Datenrate" hat kein interaktives Pendant; ein Rechner (inkl. Umrechnung Byte/Bit und binär/dezimal) fehlt, obwohl der Text selbst vor der Verwechslungsgefahr warnt.

### Elektrotechnik-Grundformeln (`elektrotechnik-grundformeln`)
- **FALSCH**: Konzept — SVG-Diagramm der 80-PLUS-Klassen zeigt „Platinum: 96 %" bei 50 % Last. Der korrekte Platinum-Wert bei 50 % Last liegt bei 92 % (115 V) bzw. 94 % (230 V) — 96 % ist der Titanium-Wert (230 V, 50 % Last). Zusätzlich mischt die Grafik uneinheitlich Spezifikationen (Standard/Bronze nach 115-V-Norm, Gold nach 230-V-Norm), während Praxisbeispiel (Bronze, η=0,85/115V) und Quizfrage q3 (Gold, η=0,92/230V) unterschiedliche Normen ansetzen.

### Handelskalkulation (`handelskalkulation`)
- **VERBESSERN**: Konzept — In der Verkaufskalkulations-Tabelle stehen „+ Kundenskonto"/„+ Kundenrabatt" mit Plus-Symbol, obwohl die Berechnung tatsächlich eine Division durch den Komplementärfaktor ist. Wird im Fließtext korrekt erklärt, aber die Tabellendarstellung kann den falschen Eindruck einer einfachen Prozent-Addition erwecken.
- **ZEICHNUNG**: Konzept — das Kalkulationsschema (LEP → ZEP → BEP → EP → SKP → BVP → ZVP → LVP) steht nur als zwei Tabellen; ein Ketten-/Flussdiagramm mit Pfeilen und +/− je Schritt fehlt.
- **TOOL**: Konzept/Praxis — kein interaktiver Kalkulationsrechner (Eingabe LEP + Prozentsätze → Schritt-für-Schritt bis LVP) vorhanden, obwohl das mehrstufige Schema klassisch fehleranfällig ist.

### Zuschlagskalkulation & BAB (`zuschlagskalkulation-bab`)
- **ZEICHNUNG**: Konzept — BAB-Prinzip und Zuschlagskalkulationsschema (MEK→MGK→MK, FEK→FGK→FK→HK→SK→BVP) sind rein tabellarisch dargestellt; ein Flussdiagramm fehlt.
- **TOOL**: Konzept/Praxis — kein interaktiver BAB-/Zuschlagskalkulations-Rechner vorhanden.

### Nutzwertanalyse (`nutzwertanalyse`)
- **TOOL**: Konzept/Praxis — kein Tool zur Eingabe von Kriterien/Gewichten/Punkten mit automatischer Nutzwert-Berechnung; bei mehreren Kriterien/Angeboten ist Handrechnung fehleranfällig.

### Break-Even & Deckungsbeitrag (`break-even-deckungsbeitrag`)
- **ZEICHNUNG**: Konzept — das klassische Break-Even-Diagramm (Kosten/Erlös über Menge mit Fixkosten-, Gesamtkosten- und Erlöslinie sowie Schnittpunkt) fehlt vollständig; die Formel wird nur algebraisch beschrieben.
- **TOOL**: Konzept/Praxis — kein interaktiver Break-Even-Rechner (Fixkosten, Verkaufspreis, variable Stückkosten → Deckungsbeitrag/Break-Even-Menge) vorhanden.

### Kauf, Miete, Leasing & TCO (`kauf-miete-leasing-tco`)
- **ZEICHNUNG**: Praxisbeispiel — der TCO-Vergleich Kauf vs. Leasing (12.900 € vs. 12.600 €) steht nur als Fließtext/Rechnung; ein Balkendiagramm fehlt.
- **TOOL**: Konzept/Praxis — kein interaktiver TCO-Rechner (Preis, Laufzeit, Rate, Restwert, Betriebskosten → TCO-Vergleich) vorhanden.

*Sauber (kein Befund): `zahlensysteme`.*

---

## Modul 3 – Hardware & Technologien (19 Einheiten geprüft, 7 mit Befund)

### Computer-Grundaufbau (`computer-grundaufbau`)
- **ZEICHNUNG**: Konzept — Von-Neumann-Modell und Bussystem stehen nur als zwei separate Tabellen; ein Blockdiagramm (Rechenwerk/Steuerwerk/Speicherwerk verbunden über Adress-, Daten- und Steuerbus) fehlt, obwohl der gemeinsame Bus als Flaschenhals der Kernpunkt der Einheit ist.

### Arbeitsspeicher (RAM) (`arbeitsspeicher-ram`)
- **VERBESSERN**: Konzept, DDR-Tabelle — Taktangaben werden durchgehend als „MHz" bezeichnet (z. B. „2133–3200 MHz" DDR4, „4800–8000+ MHz" DDR5), technisch korrekt wäre MT/s (die doppelte Datenrate bei DDR kommt nicht von doppeltem Kerntakt). Branchenüblich, aber für ein Prüfungsfach wäre die korrekte Einheit/ein Hinweis sinnvoll.
- **TOOL**: Konzept, RAM-Timings — die Formel „Latenz [ns] = (CL ÷ Takt) × 2000" wird nur an zwei statischen Beispielen gezeigt; ein interaktiver Latenz-Rechner fehlt.

### Mainboard & Bussysteme (`mainboard-busse`)
- **ZEICHNUNG**: Konzept, Abschnitt „Chipsatz (PCH)" — CPU-direkte vs. chipsatzverwaltete Anschlüsse stehen nur als Tabelle; ein Blockdiagramm der Topologie (CPU – direkte PCIe-Lanes zu GPU/NVMe – PCH – restliche Anschlüsse) fehlt.

### Drucker (`drucker`)
- **TOOL**: Konzept/Praxis, Abschnitt „Druckkosten berechnen" — die Kosten-pro-Seite-Formel wird nur an einem festen Rechenbeispiel gezeigt; ein interaktiver Druckkosten-Rechner (Kassettenpreis, Seitenzahl, Papierkosten, Volumen) fehlt.

### Scanner & Sensoren (`scanner-sensoren`)
- **ZEICHNUNG**: Konzept, Abschnitt „CCD vs. CIS" — der Unterschied im Lichtweg (Spiegelsystem bei CCD vs. direkt anliegende Sensorzeile bei CIS) ist ein räumliches Konzept, das nur mit Fließtext beschrieben wird; ein Schnittdiagramm fehlt.

### USV-Klassen (IEC 62040-3) (`usv-klassen`)
- **ZEICHNUNG**: Konzept, Abschnitt „Die drei USV-Klassen" — die drei Topologien (VFD, VI, VFI) unterscheiden sich im Leistungsfluss, stehen aber nur tabellarisch; ein Blockdiagramm der drei Leistungspfade fehlt, gerade für die Umschaltzeit-Frage relevant.
- **TOOL**: Konzept, Abschnitt „Scheinleistung (VA) vs. Wirkleistung (W)" — die Formel P = S × cos φ wird nur an einem statischen Beispiel gezeigt; ein VA/W-Rechner fehlt.

### Auto-ID (Barcode, RFID, NFC) (`auto-id`)
- **FALSCH**: Konzept, Tabellen „Auto-ID-Technologien im Vergleich" und „RFID genauer: passiv vs. aktiv" — die Reichweite passiver RFID-Tags wird mit „wenige cm" bzw. „bis ca. 1 Meter" angegeben. Das widerspricht dem eigenen Praxisbeispiel im selben Dokument, in dem ganze Paletten mit passiven RFID-Tags automatisch durch ein Lesegerät-Tor am Warenausgang erfasst werden — ein solches Gate-Szenario setzt reale passive UHF-RFID-Reichweiten von mehreren Metern voraus. Konzept-Tabelle und Praxisbeispiel widersprechen sich.

*Sauber (kein Befund): `cpu-aufbau`, `grafikkarte-gpu`, `bios-uefi-boot`, `ssd-hdd-nvme`, `raid-level`, `nas-san-storage`, `schnittstellen-video`, `monitore-display`, `geraeteklassen-arbeitsplatz`, `green-it`, `ergonomie-barrierefreiheit`, `gehaeuse-formfaktoren`.*

---

## Modul 4 – Netzwerktechnik (20 Einheiten geprüft, 9 mit Befund)

### Topologien, VLAN, PoE & QoS (`topologien-vlan-poe-qos`)
- **ZEICHNUNG**: Konzept, Abschnitt „Netzwerktopologien" — Bus, Stern, Ring und Mesh werden nur tabellarisch beschrieben; ein SVG-Schema der vier Aufbauten fehlt, obwohl das Thema inhärent räumlich ist.

### IPv6-Grundlagen (`ipv6-grundlagen`)
- **ZEICHNUNG**: Konzept, Abschnitt „EUI-64" — die Transformation der 48-Bit-MAC in den 64-Bit-Interface-Identifier (auftrennen, FFFE einfügen, U/L-Bit invertieren) steht nur als Text/Liste; ein Schritt-für-Schritt-SVG (analog zum ANDing-Diagramm bei IPv4-Subnetting) fehlt.
- **TOOL**: Praxisbeispiel — anders als bei IPv4-Subnetting (Referenz-Rechner) gibt es kein interaktives Werkzeug zum Kürzen/Expandieren einer IPv6-Adresse oder Berechnen des EUI-64-Interface-Identifiers aus einer MAC-Adresse.

### MAC vs. IP, ARP & APIPA (`mac-ip-arp-apipa`)
- **ZEICHNUNG**: Konzept, Abschnitt „ARP" — der Request/Reply-Ablauf (Broadcast-Anfrage, Unicast-Antwort, Cache-Eintrag) steht nur als nummerierte Liste; ein Sequenzdiagramm (analog zu TCP-Handshake in diesem Modul) fehlt.

### DHCP (DORA-Ablauf) (`dhcp-dora`)
- **ZEICHNUNG**: Konzept, Abschnitt „DORA" — der komplette DORA-Ablauf wird nur als Tabelle/Text vermittelt, obwohl es eine klassische Client-Server-Sequenz ist; ein Sequenzdiagramm (Discover→Offer→Request→Acknowledge, analog zu TCP-Handshake) fehlt auffällig.

### Internetzugang (DSL-Varianten) (`internetzugang-dsl`)
- **TOOL**: Konzept, Abschnitt „Datenraten" — der Text rechnet ein Beispiel (16 Mbit/s → ca. 8 s für 16 MByte) nur manuell vor; ein interaktiver Umrechner (Mbit/s ↔ MByte/s, Downloadzeit) fehlt, obwohl diese Umrechnung in AP2 häufig verlangt wird.

### Netzwerk-Diagnose (`netzwerk-diagnose`)
- **ZEICHNUNG**: Konzept, Abschnitt „Systematische Fehlersuche" — der 5-stufige Eskalationspfad (Loopback → eigene IP → Gateway → externe Adresse → DNS) steht nur als nummerierte Liste; ein Flussdiagramm mit Entscheidungspunkten fehlt.

### Virtualisierung & Hypervisor (`virtualisierung-hypervisor`)
- **ZEICHNUNG**: Konzept, Abschnitt „Hypervisor-Typen" — der Unterschied Typ-1 (Bare-Metal) vs. Typ-2 (Hosted) steht nur tabellarisch; ein SVG-Schichtendiagramm fehlt.

### Container (Docker) vs. VM (`container-docker`)
- **ZEICHNUNG**: Konzept, Vergleichstabelle VM vs. Container — der zentrale Unterschied (eigenes Gast-OS vs. geteilter Host-Kernel) ist visuell gut darstellbar, steht aber nur tabellarisch; ein Schichtendiagramm fehlt.

### Cloud-Grundlagen (`cloud-grundlagen`)
- **ZEICHNUNG**: Konzept, Abschnitt „Servicemodelle" — die Verantwortungsverteilung zwischen Anbieter und Kunde bei IaaS/PaaS/SaaS/FaaS steht nur tabellarisch; das klassische Verantwortungs-Stapel-Diagramm (Schichten je Modell eingefärbt) fehlt.

*Sauber (kein Befund): `iso-osi-tcp-ip`, `netzwerkkomponenten`, `ipv4-subnetting`, `dns-grundlagen`, `tcp-udp`, `tcp-handshake`, `ports`, `anwendungsprotokolle`, `wlan-grundlagen`, `verkabelung-tp-lwl`, `vpn-grundlagen`.*

---

## Modul 5 – IT-Sicherheit (18 Einheiten geprüft, 9 mit Befund)

### Angriffsmethoden (`angriffsmethoden`)
- **FALSCH**: Konzept, Abschnitt „SQL-Injection im Detail" — die Aussage „SQL-Injection steht seit Jahren auf Platz 1 der OWASP Top 10" ist veraltet/falsch. In der aktuellen OWASP Top 10 (2021) liegt „Injection" (inkl. SQL-Injection) auf Platz 3 (A03:2021); Platz 1 ist „Broken Access Control", Platz 2 „Cryptographic Failures". Nur in der älteren Version von 2017 war Injection auf Platz 1.

### Sicherheitsstandards (ISMS, BSI, ISO 27001) (`sicherheitsstandards-isms`)
- **ZEICHNUNG**: Konzept, PDCA-Zyklus — der PDCA-Kreislauf (Plan, Do, Check, Act) wird nur als Fließtext beschrieben; ein Kreisdiagramm mit den vier Phasen und Pfeilen fehlt.

### Zertifikate, PKI & TLS (`zertifikate-tls-pki`)
- **ZEICHNUNG**: Konzept — die Vertrauenskette (Root-CA → Zwischenzertifikate → Website-Zertifikat) wird nur verbal beschrieben; ein Baumdiagramm (Root-CA → Intermediate-CA → Endzertifikat, inkl. Browser als Prüfinstanz) fehlt für dieses klassische Prüfungsthema.

### Endpoint-Security (`endpoint-security`)
- **VERBESSERN**: Praxisbeispiel, dritter Punkt — Satz „Der auf dem Notebook installierte EDR-Agent meldet den fehlenden Verbindungsaufbau zur Firmen-IT als Anomalie gemeldet und markiert das Gerät automatisch als „kompromittiert"" enthält eine doppelte Verbform, dadurch grammatisch fehlerhaft und schwer lesbar.

### Authentifizierung, MFA & AAA (`authentifizierung-mfa-aaa`)
- **TOOL**: Konzept, Abschnitt „Passwort-Komplexität berechnen" — die Formel Zeichenraum^Länge wird nur an drei statischen Tabellenbeispielen gezeigt; ein interaktiver Rechner (Zeichenraum/Länge einstellbar → Kombinationsanzahl/Brute-Force-Zeit) fehlt.

### Berechtigungskonzepte (`berechtigungskonzepte`)
- **ZEICHNUNG**: Konzept, Schalenmodell — das „Zwiebelschalen-Prinzip" (physischer Zugang → Netzwerk → OS-Login → Anwendung → Datenfreigabe) wird nur in einem Satz beschrieben; eine Grafik mit konzentrischen Schalen fehlt.

### Physische Sicherheit & Redundanz (`physische-sicherheit`)
- **ZEICHNUNG**: Konzept, Abschnitt „Klimatisierung" — das Kaltgang-/Warmgang-Prinzip (Hot Aisle/Cold Aisle) ist ein räumliches Anordnungskonzept, das sich schwer aus Text erschließt; eine Draufsicht-Skizze mit Serverschränken und Luftstrompfeilen fehlt.

### Backup-Arten (`backup-arten`)
- **ZEICHNUNG**: Konzept/Praxisbeispiel — der Unterschied bei der Restore-Kette (Vollbackup + letztes differenzielles vs. Vollbackup + lückenlos alle inkrementellen) ist prüfungsrelevant, wird aber nur textlich erklärt; ein Zeitstrahl-Diagramm fehlt.

### RTO, RPO & Verfügbarkeit (`rto-rpo-verfuegbarkeit`)
- **ZEICHNUNG**: Konzept, Abschnitt „RTO und RPO" — RTO/RPO sind ein klassisches Zeitstrahl-Thema (RPO = Datenverlustfenster vor Ausfall, RTO = Wiederherstellungsdauer nach Ausfall), wird aber nur über Tabelle/Mnemonik erklärt; ein Zeitstrahl mit Ausfallzeitpunkt, letztem Backup und Wiederanlauf fehlt.

*Sauber (kein Befund): `schutzziele-cia`, `schutzbedarfsanalyse`, `toms`, `kryptographie-sym-asym`, `hash-signatur`, `schadsoftware-typen`, `firewall-dmz`, `betriebssystem-haertung`, `datensicherung-datenschutz`.*

---

## Modul 6 – Datenschutz & Recht (9 Einheiten geprüft, 5 mit Befund)

### Betroffenenrechte & Rollen (`betroffenenrechte`)
- **ZEICHNUNG**: Konzept, Abschnitt „Wer ist wer? Die Rollen der DSGVO" — die vier Rollen (Verantwortlicher, Auftragsverarbeiter, DSB, Aufsichtsbehörde) stehen nur als Tabellenzeilen nebeneinander, ihre Beziehung zueinander (wer meldet an wen, wer bleibt verantwortlich) bleibt implizit; ein Beziehungsdiagramm fehlt, gerade für den häufig verwechselten Cloud-Fall.

### Vertragsarten (`vertragsarten`)
- **VERBESSERN**: Konzept, Abschnitt „Die wichtigsten Vertragsarten" — die IT-spezifische Abgrenzung „Standardsoftware = Kaufvertrag vs. Individualsoftware nach Lastenheft = Werkvertrag" fehlt komplett. Nur der Werkvertrags-Fall wird im Praxisbeispiel behandelt; der ebenso oft geprüfte Fall „Kauf einer Standardsoftware" wird nirgends verortet, obwohl diese Abgrenzung ein bekannter Prüfungsschwerpunkt ist.
- **ZEICHNUNG**: Konzept, Abschnitt „Werkvertrag vs. Dienstvertrag" — ein Entscheidungsbaum („Was wird geschuldet: Sache? Ergebnis? Tätigkeit? Nutzung auf Zeit?" → Vertragstyp) fehlt für diese fehleranfällige Unterscheidung.
- **TOOL**: Konzept/Praxis — ein interaktiver „Vertragsart-Klassifizierer" (Szenario → Kauf-/Werk-/Dienst-/Miet-/Leasingvertrag zuordnen) fehlt, angesichts der Fehleranfälligkeit dieses Themas sinnvoll.

### Urheberrecht & Lizenzmodelle (`urheberrecht-lizenzen`)
- **VERBESSERN**: Konzept, Abschnitt „Urheberrecht bei Software" — es fehlt der Hinweis auf § 69b UrhG (Arbeitnehmerurheberrecht bei Software): Erstellt ein angestellter Entwickler ein Programm in Wahrnehmung seiner Aufgaben, gehen die vermögensrechtlichen Befugnisse automatisch an den Arbeitgeber über. Für angehende Fachinformatiker die praktisch relevanteste Norm zu diesem Thema; der Merksatz („Urheberrecht bleibt beim Schöpfer") verkürzt dies ohne diese wichtige Ausnahme.

### SLA & Support-Level (`sla-support-level`)
- **ZEICHNUNG**: Konzept, Abschnitt „First-, Second- und Third-Level-Support" — die Eskalationskette steht nur tabellarisch/als Fließtext; ein Stufendiagramm (First → Second → Third mit Eskalationspfeilen und typischen Zeitgrenzen) fehlt.

### Barrierefreiheit Software (`barrierefreiheit-software`)
- **VERBESSERN**: Konzept (gesamte Einheit) — fehlender Verweis auf das Barrierefreiheitsstärkungsgesetz (BFSG), das seit 28.6.2025 die EU-Richtlinie 2019/882 umsetzt und digitale Produkte/Dienstleistungen für Verbraucher gesetzlich zur Barrierefreiheit verpflichtet. WCAG wird aktuell nur als freiwilliger „internationaler Standard" dargestellt, was den inzwischen bestehenden gesetzlichen Zwang für viele Anbieter verschweigt.
- **TOOL**: Konzept, Abschnitt „WCAG" — Farbkontrast (WCAG-Kriterium 1.4.3) kommt im Fließtext gar nicht vor, obwohl leicht prüf-/übbar; ein interaktiver Kontrast-Checker (zwei Farben → Kontrastverhältnis + AA/AAA-Bewertung) fehlt.

*Sauber (kein Befund): `dsgvo-grundlagen`, `persoenlichkeitsrechte`, `gewaehrleistung-garantie`, `normen-compliance`.*

---

## Modul 7 – Software, OS & Web (28 Einheiten, Teil 1: 14 geprüft, 8 mit Befund)

### Linux-Konsole & Dateiberechtigungen (`linux-konsole`)
- **FALSCH**: Abschnitt „Das rwx-Rechtesystem" — die Bezeichnung „ugw" für die drei Rechtegruppen ist fachlich falsch. Die reale chmod-Symbolik unter Linux verwendet u/g/o (User/Group/Others), nicht „w". Der Buchstabe „w" kollidiert zudem mit dem Schreibrecht (write). `chmod o+r datei.txt` funktioniert, `chmod w+r datei.txt` gibt es nicht — wer sich „ugw" einprägt, wird beim echten Arbeiten mit chmod-Symbolik verwirrt.

### Multitasking, Prozesse & Threads (`multitasking-prozesse`)
- **ZEICHNUNG**: Abschnitt „Kooperatives vs. präemptives Multitasking" — eine Zeitachsen-Grafik, die den Kontextwechsel zwischen zwei Prozessen bei beiden Modellen gegenüberstellt, fehlt.

### Windows-Konsole & ACL (`windows-berechtigungen-acl`)
- **ZEICHNUNG**: Abschnitt „Was ist eine ACL?" — eine Grafik, die eine ACL als geordnete Liste von ACEs mit Allow-/Deny-Einträgen darstellt, fehlt.
- **TOOL**: kein interaktives Werkzeug vorhanden, das zeigt, wie sich vererbte + explizite Allow-/Deny-Einträge in einer ACL gegenseitig auflösen.

### Dateisysteme-Grundlagen (`dateisysteme-grundlagen`)
- **ZEICHNUNG**: Abschnitt „Inode (Linux)" / „MFT — Master File Table" — eine Grafik, die zeigt, wie ein Metadaten-Eintrag auf die tatsächlichen Datenblöcke zeigt, fehlt.

### Dateisysteme im Vergleich (`dateisysteme-vergleich`)
- **ZEICHNUNG**: Abschnitt „Slack Space" — eine visuelle Darstellung eines nur teilweise gefüllten Blocks (z. B. 1-KB-Datei in 4-KB-Block) fehlt.
- **TOOL**: kein interaktiver Entscheidungshelfer („Welches Dateisystem passt zu meinem Szenario?") vorhanden.

### Kompression (`kompression`)
- **ZEICHNUNG**: Abschnitt „Verlustfreie Kompression" — das Huffman-Prinzip wird nur in einem Nebensatz erwähnt, ohne Beispielbaum/Diagramm (anders als RLE, das ein Textbeispiel hat).

### Bild-, Audio- & Videoformate (`bild-videoformate`)
- **ZEICHNUNG**: Abschnitt „Videoformate: Container vs. Codec" — eine Grafik (Container als „Box" mit Video-/Audiospur, je mit Codec-Label) fehlt für dieses häufig verwechselte Konzept.

### Zeichensätze — ASCII, Unicode, UTF-8 (`zeichensaetze-ascii-unicode`)
- **VERBESSERN**: Quizfrage q6 — Formulierung „Wie viele Bytes benötigt UTF-8 mindestens für das Euro-Zeichen (€, U+20AC)?" ist missverständlich: für dieses konkrete Zeichen fallen exakt 3 Bytes an, das Wort „mindestens" suggeriert fälschlich Variabilität.
- **TOOL**: neben dem vorhandenen CRLF-Visualizer fehlt ein UTF-8-Byte-Encoder (Zeichen eingeben → Codepoint → resultierende Bytes).

*Sauber (kein Befund): `software-klassifikation`, `branchensoftware`, `ki-grundlagen`, `it-servicemanagement`, `windows-vs-linux`, `partitionierung-formatierung`.*

### Modul 7 – Teil 2: 14 geprüft, 5 mit Befund

### Prüfziffern & Parität (`pruefziffern-paritaet`)
- **VERBESSERN**: Konzept (EAN/IBAN) — die Rechenverfahren werden nur in Worten beschrieben; es fehlt ein konkretes Rechenbeispiel mit echten Ziffern (reale EAN-13 oder IBAN durchgerechnet), an dem Modulo-10- bzw. Modulo-97-Algorithmus nachvollzogen werden kann.
- **TOOL**: Praxisbeispiel/Konzept — ein interaktiver Prüfziffern-Rechner (12 EAN-Ziffern oder IBAN eingeben, live berechnete Prüfziffer mit Zwischenschritten) fehlt.

### Website-Aufruf & virtuelle Hosts (`website-aufruf-hosting`)
- **ZEICHNUNG**: Konzept „Ablauf eines Website-Aufrufs" — der 6-Schritte-Ablauf (DNS-Auflösung → TCP/TLS-Verbindungsaufbau → HTTP-Request mit Host-Header → HTTP-Response → Rendering) steht nur als Textliste; ein Sequenzdiagramm (Client–DNS–Server) fehlt.

### EPK (Ereignisgesteuerte Prozesskette) (`epk-ereignisgesteuerte-prozesskette`)
- **VERBESSERN**: Konzept/Symboltabelle — die Modellierungsregel, dass XOR-/ODER-Konnektoren nur nach Funktionen stehen dürfen (Ereignisse sind passiv, nach ihnen nur UND-Konnektoren), wird nirgends explizit erklärt, obwohl das SVG-Beispiel diese Regel korrekt umsetzt. Klassischer IHK-Prüfungsstolperstein, sollte im Text benannt werden.

### MIME-Types & Base64 (`mime-base64`)
- **ZEICHNUNG**: Konzept „Base64" — das 3-Byte-zu-4-Zeichen-Prinzip (24 Bit in vier 6-Bit-Gruppen) wird nur in Prosa beschrieben; eine visuelle Bit-Aufteilung fehlt.
- **TOOL**: Konzept „Base64" — ein interaktiver Base64-Encoder/Decoder (Text eingeben, Bit-Aufteilung live sehen) fehlt.

### Deployment-Formate (ISO, WIM) (`deployment-formate`)
- **ZEICHNUNG**: Konzept/Praxisbeispiel PXE-Boot — der PXE-Boot-Ablauf (Client lädt boot.wim über Netzwerk, danach install.wim über Deployment-Server) ist ein mehrstufiger Netzwerkprozess, der nur textuell beschrieben wird; ein Ablaufdiagramm fehlt.

*Sauber (kein Befund): `url-uri-urn`, `html-css-grundlagen`, `bildschirmausgabemasken`, `programmierparadigmen`, `datentypen-pseudocode`, `compiler-interpreter-debugging`, `uml-diagramme`, `pap-programmablaufplan`, `struktogramm-nassi-shneiderman`.*

---

## Modul 8 – Datenbanken & SQL (10 Einheiten geprüft, 4 mit Befund)

### SQL & DDL (`sql-ddl`)
- **FALSCH**: Konzept/CREATE TABLE — die Tabellen `abteilung`/`mitarbeiter` werden mit `FOREIGN KEY (...) REFERENCES ...` angelegt, aber `assets/tools/sql-editor.js` setzt nirgends `PRAGMA foreign_keys = ON;`. SQLite hat FK-Erzwingung per Default deaktiviert — im Editor lässt sich trotzdem eine `mitarbeiter`-Zeile mit nicht existierender `abteilung_id` einfügen, was der gelehrten referenziellen Integrität widerspricht. Betrifft alle fünf SQL-Einheiten (ddl/dml/join/subqueries/transaktionen), die dasselbe FK-Schema wiederverwenden.
- **UNVERSTÄNDLICH**: Konzept, Tabelle „Datentypen" (analog in `datentypen-constraints`) — `VARCHAR(n)`/`DECIMAL(p,s)` werden wie fest erzwungene Längen-/Präzisionsangaben dargestellt, obwohl SQLite dynamisch typisiert ist (Type Affinity) und diese Angaben real nicht validiert — z. B. lässt sich `email VARCHAR(150)` im selben Editor problemlos mit 500 Zeichen befüllen. Wird nirgends erwähnt, obwohl der Editor direkt gegen SQLite läuft.

### ER-Modell & Kardinalitäten (`er-modell-kardinalitaeten`)
- **FALSCH**: Praxisbeispiel — „das DBMS lehnt den Einfüge-Versuch ab, weil die referenzielle Integrität verletzt wäre" gilt nur bei aktivierter FK-Erzwingung; im modul-eigenen SQL-Editor ist diese standardmäßig aus (siehe Befund bei `sql-ddl`) — die beschriebene Ablehnung tritt im Praxis-Tool tatsächlich nicht ein.

### SQL & JOIN (`sql-join`)
- **ZEICHNUNG**: Konzept, Abschnitt „Die vier JOIN-Typen" — nur als Tabelle beschrieben, kein Venn-Diagramm der vier Join-Typen (INNER/LEFT/RIGHT/FULL OUTER), obwohl das didaktischer Standard für dieses Thema ist.

### Transaktionen (`sql-transaktionen`)
- **ZEICHNUNG**: Konzept, Abschnitt SAVEPOINT — kein Zeitstrahl-Diagramm für BEGIN → INSERT → SAVEPOINT → UPDATE → ROLLBACK TO → COMMIT; aktuell nur als Tabellenzeilen-Abfolge dargestellt.

*Sauber (kein Befund): `db-grundlagen`, `datentypen-constraints`, `normalisierung`, `sql-dml`, `sql-dcl`, `sql-subqueries`.*

---

## Modul 9 – Qualitätssicherung (4 Einheiten geprüft, 3 mit Befund)

### PDCA-Zyklus & prozessorientiertes QM (`pdca-prozessorientiertes-qm`)
- **ZEICHNUNG**: Konzept, Abschnitt „Der PDCA-Zyklus (Deming-Kreis)" — der Zyklus steht nur als lineare 4-Zeilen-Tabelle; der Kerngedanke „wiederholbarer Regelkreis" (auch im Merksatz formuliert) geht in Tabellenform verloren. Ein kreisförmiges SVG-Diagramm (Plan → Do → Check → Act → zurück zu Plan) fehlt.

### Testverfahren (Black-/White-Box, Teststufen) (`testverfahren-black-white-box`)
- **ZEICHNUNG**: Konzept, Abschnitt „Teststufen entlang des Entwicklungsprozesses" — die vier Teststufen stehen nur als Tabellenzeilen; ein V-Modell-Diagramm (Reihenfolge, Zuständigkeit, Black-/White-Box-Charakter je Stufe gemeinsam visualisiert) fehlt.
- **TOOL**: Konzept/Praxisbeispiel — kein interaktives Element vorhanden; ein Zuordnungs-Tool (Teststufe in richtige Reihenfolge bringen bzw. Testart klassifizieren) fehlt.

### Testprotokoll Arbeitsplatzeinrichtung (`testprotokoll-arbeitsplatzeinrichtung`)
- **TOOL**: Praxisbeispiel — das Beispiel-Testprotokoll ist eine rein statische Tabelle; ein ausfüllbares Mini-Formular (Prüfpunkt, Soll/Ist, i. O./n. i. O., Bemerkung) fehlt.

*Sauber (kein Befund): `qualitaetsplanung-guetesiegel`.*

---

## Modul 10 – Kaufmännisches & Auftragsabwicklung (15 Einheiten geprüft, 4 mit Befund)

### Marktformen & Marktgleichgewicht (`marktformen`)
- **ZEICHNUNG**: Konzept, Abschnitt „Marktgleichgewicht" — der Text beschreibt explizit den „Schnittpunkt von Angebots- und Nachfragekurve" sowie Angebotsüberschuss/Nachfrageüberhang, zeigt aber keine Grafik. Das klassische Angebot-Nachfrage-Diagramm mit Gleichgewichtspunkt fehlt.

### ABC-Analyse, AIDA & Produktlebenszyklus (`abc-analyse-aida-produktlebenszyklus`)
- **ZEICHNUNG**: Konzept, Abschnitt „Produktlebenszyklus" — die vier Phasen (Einführung/Wachstum/Reife/Rückgang) stehen nur als Tabelle; die typische Umsatz-über-Zeit-S-Kurve fehlt komplett.

### Aufbauorganisation & Organigramm (`aufbauorganisation-organigramm`)
- **ZEICHNUNG**: Konzept, Einleitungsabsatz — der Text erklärt die Notation eines Organigramms im Detail (Kästchen = Stellen, durchgezogene Linien = Weisungsbefugnis, gestrichelte Linien = Stabsstellen), zeigt aber selbst kein Beispiel-Organigramm. Ein Vergleichs-SVG der vier Organisationsformen (Einlinien/Mehrlinien/Stablinien/Matrix) fehlt.

### Unternehmens- & Gesellschaftsformen (`unternehmens-gesellschaftsformen`)
- **TOOL**: Konzept, Abschnitt „Kriterien der Rechtsformwahl" — die Liste nennt Haftungsrisiko, Kapitalbedarf, Gründerzahl und Publizitätspflichten als Auswahlkriterien, bietet aber keine Möglichkeit, Rechtsformen interaktiv danach zu vergleichen; ein Vergleichs-/Auswahltool fehlt.

*Sauber (kein Befund): `wirtschaftssektoren-grundfunktionen`, `zielgruppen-kundentypologien`, `vertriebsformen-b2b-b2c-marktforschung`, `outsourcing-offshoring-geschaeftsmodelle`, `informationsrecherche-quellenbewertung`, `praesentationstechniken-medienkompetenz`, `make-or-buy-angebotsvergleich`, `ausschreibung-leistungsverzeichnis`, `vollmachten-prokura`, `abnahme-abnahmeprotokoll`, `lessons-learned-nachfolgeauftraege`.*

---

## Modul 11 – WiSo (21 Einheiten, Teil 1: 11 geprüft, 7 mit Befund)

### Duales System & Ausbildungsvertrag (`duales-system-ausbildungsvertrag`)
- **ZEICHNUNG**: Konzept, Abschnitt „Das duale System" — eine Grafik, die die Beziehung zwischen Azubi, Ausbildungsbetrieb, Berufsschule und zuständiger Stelle (IHK) zeigt, fehlt, obwohl die „zwei Lernorte" die Kernidee der Einheit sind.

### Arbeitsvertrag & Kündigungsfristen (`arbeitsvertrag-kuendigung`)
- **TOOL**: Konzept, Tabelle „Gesetzliche Kündigungsfristen (§ 622 BGB)" — ein Kündigungsfristen-Rechner (Betriebszugehörigkeit → geltende Frist) fehlt, würde Grenzfälle (genau 2/5/8/… Jahre) klarer machen.

### Betriebliche Mitbestimmung (`betriebliche-mitbestimmung`)
- **FALSCH**: Konzept, Abschnitt „Organe der betrieblichen Mitbestimmung" — die JAV-Beschreibung „vertritt speziell die Interessen von Auszubildenden und Beschäftigten unter 18 Jahren" lässt die gesetzliche Altersgrenze weg: Nach § 60 BetrVG vertritt die JAV Auszubildende bis 25 Jahre, nicht nur unter 18. Bei einer Prüfungsfrage zur genauen Abgrenzung führt das zu einer falschen Antwort.
- **ZEICHNUNG**: Konzept, Tabelle „Abstufung der Beteiligungsrechte" — die vier Eskalationsstufen (Information → Anhörung → Beratung → Mitbestimmung) stehen nur tabellarisch; eine Stufen-/Treppengrafik fehlt.

### Fort-/Weiterbildung, Umschulung & beruflicher Aufstieg (`fort-weiterbildung-umschulung`)
- **ZEICHNUNG**: Konzept, Tabelle „IT-Weiterbildungssystem" — die drei aufeinander aufbauenden Stufen (Spezialist → Operativer Professional → Strategischer Professional) sind nur tabellarisch dargestellt; eine Treppengrafik fehlt.

### Soziale Sicherung (5 Säulen) (`soziale-sicherung`)
- **ZEICHNUNG**: Konzept, Tabelle „Die 5 Säulen der Sozialversicherung" — die Einstiegs-Analogie spricht explizit von „fünf getrennten Sicherungsnetzen", es fehlt aber jede visuelle Darstellung der fünf Säulen.

### Grenzen sozialer Sicherung & private Vorsorge (`grenzen-sozialer-sicherung-vorsorge`)
- **ZEICHNUNG**: Konzept, Tabelle „3-Schichten-Modell der Altersvorsorge" — nur tabellarisch dargestellt; ein Schichten-/Pyramidendiagramm fehlt.

### Entgeltabrechnung (Brutto/Netto) (`entgeltabrechnung`)
- **FALSCH**: Praxisbeispiel, Gehaltsabrechnungstabelle — der KV-Arbeitnehmeranteil (222,00 €, 7,4 % von 3.000 €) ist veraltet: aktuell (2026) gelten 14,6 % Basisbeitrag + durchschnittlicher Zusatzbeitrag 2,9 % = 17,5 % Gesamt, davon 8,75 % AN-Anteil ≈ 262,50 €. RV (279 €, 9,3 %) und AV (39 €, 1,3 %) in derselben Tabelle sind für 2026 korrekt, wodurch der KV-Fehler auffällt; die angegebene Netto-Summe (1.980,00 €) passt dadurch nicht zu aktuellen Beitragssätzen.
- **UNVERSTÄNDLICH**: Konzept, Abschnitt „Vom Brutto zum Netto" — der Satz „Einkommen oberhalb dieser Grenze bleibt beitragsfrei (in der Rentenversicherung)" liest sich so, als gäbe es die Beitragsbemessungsgrenze nur in der Rentenversicherung; tatsächlich haben auch KV/PV/AV eigene Beitragsbemessungsgrenzen mit anderem Grenzwert.
- **TOOL**: Praxisbeispiel — ein interaktiver Brutto-Netto-Rechner (Brutto + Steuerklasse → Netto mit Einzelabzügen) fehlt komplett.

*Sauber (kein Befund): `arbeitsschutzgesetze`, `tarifrecht`, `wandel-arbeitswelt-digitalisierung`, `arbeiten-lernen-europa`.*

### Modul 11 – Teil 2: 10 geprüft, 6 mit Befund

### Existenzgründung (`existenzgruendung`)
- **TOOL**: Konzept/Rechtsformwahl — ein interaktiver Rechtsform-Vergleichsrechner (Haftungswunsch/Kapital → Empfehlung Einzelunternehmen/UG/GmbH) fehlt; die Tabelle ist statisch.

### Wirtschaftskreislauf & Wertschöpfungskette (`wirtschaftskreislauf-wertschoepfungskette`)
- **ZEICHNUNG**: Konzept, erweiterter Wirtschaftskreislauf — nur der einfache Kreislauf (Haushalte/Unternehmen) ist als SVG dargestellt; der erweiterte Kreislauf mit Staat, Banken und Ausland steht nur als Textliste.

### Wandel der Märkte & nachhaltige Entwicklung (`wandel-maerkte-nachhaltige-entwicklung`)
- **ZEICHNUNG**: Konzept, nachhaltige Entwicklung — das Drei-Säulen-Modell (ökologisch/ökonomisch/sozial) steht nur als Tabelle; eine visuelle Darstellung der Gleichrangigkeit der drei Dimensionen fehlt.

### Rechtsgeschäfte, Geschäftsfähigkeit & Verträge (`rechtsgeschaefte-geschaeftsfaehigkeit-vertraege`)
- **ZEICHNUNG**: Konzept, Geschäftsfähigkeit — die Altersstufen (0–7, 7–17, ab 18) stehen nur in einer Tabelle; eine Zeitstrahl-Grafik mit den Altersgrenzen fehlt.
- **TOOL**: Konzept, Geschäftsfähigkeit — ein interaktiver „Geschäftsfähigkeits-Check" (Alter eingeben → Einordnung geschäftsunfähig/beschränkt/voll geschäftsfähig, ggf. Taschengeldparagraf-Szenario) fehlt.

### Wirksamkeit von Rechtsgeschäften & Verbraucherschutz (`wirksamkeit-rechtsgeschaefte-verbraucherschutz`)
- **UNVERSTÄNDLICH**: Praxisbeispiel — Satz „Ein anderer Kunde kauft einen gebrauchten Server, wobei der Verkäufer der TowerTech GmbH bewusst einen bekannten Hardwaredefekt verschweigt" ist mehrdeutig: „der Verkäufer der TowerTech GmbH" liest sich als Genitiv (TowerTechs eigener Zulieferer), gemeint ist aber, dass TowerTech selbst Verkäuferin ist.

### Bedürfnis, Bedarf & Kaufkraft (`beduerfnis-bedarf-kaufkraft`)
- **UNVERSTÄNDLICH**: Quiz Frage q7 — Antwortoption „Das Wetter am Verkaufsort ausschließlich" ist sprachlich unklar formuliert (unklar, worauf sich „ausschließlich" bezieht).

*Sauber (kein Befund): `karriere-familienplanung-rollenreflexion`, `soziale-marktwirtschaft`, `standortwettbewerb-lohnniveau`, `chancen-risiken-europa-globalisierung`.*

---

## Zusammenfassung

Geprüft: **172 Module** (alle), davon **92 mit mindestens einem Befund**, 80 sauber
(kein Befund notiert).

Befunde je Modul:

| Modul | Geprüft | Mit Befund |
|---|---|---|
| 1 Projektmanagement | 19 | 17 |
| 2 Kalkulation & Grundrechnen | 9 | 8 |
| 3 Hardware & Technologien | 19 | 7 |
| 4 Netzwerktechnik | 20 | 9 |
| 5 IT-Sicherheit | 18 | 9 |
| 6 Datenschutz & Recht | 9 | 5 |
| 7 Software, OS & Web | 28 | 13 |
| 8 Datenbanken & SQL | 10 | 4 |
| 9 Qualitätssicherung | 4 | 3 |
| 10 Kaufmännisches & Auftragsabwicklung | 15 | 4 |
| 11 WiSo | 21 | 13 |
| **Summe** | **172** | **92** |

Befunde je Kategorie (insgesamt 128 Einzelbefunde, eine Einheit kann mehrere haben):

| Kategorie | Anzahl |
|---|---|
| FALSCH | 10 |
| UNVERSTÄNDLICH | 5 |
| VERBESSERN | 10 |
| ZEICHNUNG | 65 |
| TOOL | 38 |

**Einordnung:** Die klare Mehrheit der Befunde (65 + 38 = 103 von 128, ≈ 80 %) sind
ZEICHNUNG/TOOL-Anregungen — also Ausbaupotenzial, kein Korrekturbedarf. Die 10
FALSCH-Befunde sind die dringlichsten (u. a. Ishikawa-6M-Übersetzung, 80-PLUS-
Platinum-Wert, RFID-Reichweite widerspricht eigenem Praxisbeispiel, veralteter
OWASP-Platz für SQL-Injection, fehlende PRAGMA-foreign_keys-Aktivierung im
SQL-Editor, falsche „ugw"-Rechtegruppen-Bezeichnung bei Linux-Berechtigungen,
JAV-Altersgrenze nach § 60 BetrVG fehlt, veralteter KV-Beitragssatz in der
Entgeltabrechnung 2026). Details siehe jeweiliger Modul-Abschnitt oben.

