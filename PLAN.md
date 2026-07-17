# Lernplan FISI – AP1 & AP2 (katalogvollständig)

## Produktionsreihenfolge

Reihenfolge, in der die Module gebaut werden (nicht zu verwechseln mit der
„Empfohlenen Lernreihenfolge" weiter unten, die den Lernweg für Ben
beschreibt — hier geht es um die Bau-/Migrationsreihenfolge in Claude Code):

1. Modul 5 – IT-Sicherheit
2. Modul 4 – Netzwerktechnik
3. Modul 2 – Kalkulation & Grundrechnen
4. Modul 3 – Hardware & Technologien
5. Modul 8 – Datenbanken & SQL
6. Modul 11 – WiSo
7. Modul 6 – Datenschutz & Recht
8. Modul 7 – Software, Betriebssysteme & Web
9. Modul 1 – Projektmanagement & Arbeitsorganisation
10. Modul 9 – Qualitätssicherung
11. Modul 10 – Kaufmännisches & Auftragsabwicklung

## Statuspflege

Jeder Themen-Bullet trägt eine Checkbox `[ ]` (offen) oder `[x]` (Einheit
fertig gebaut, HTML + Quiz-JSON liegen vor und sind im Manifest gelistet).
Reine Hinweiszeilen ohne eigene Einheit (z. B. „Hinweis: …", gestrichene
Kataloginhalte) tragen keine Checkbox.

**Ab jetzt gilt:** Nach jeder fertig gebauten Einheit hier den Status auf
`[x]` aktualisieren — bevor der nächste Batch beginnt.

## Referenz der Vollständigkeitsprüfung

Diese PLAN.md wurde gegen die offiziellen IHK/ZPA-Prüfungskataloge abgeglichen
(kein Katalog lag im Projekt vor, daher aus offiziellen Quellen geholt):

- AP1: ZPA-Prüfungskatalog „Einrichten eines IT-gestützten Arbeitsplatzes",
  Stand Oktober 2024 (gültig ab Frühjahr 2025), gegliedert in 21 Themencluster.
- AP2 FISI: Prüfungskatalog „Konzeption und Administration von IT-Systemen" +
  „Analyse und Entwicklung von Netzwerken" (ZPA, 2. Auflage 2024/25).
- WiSo: KMK-Qualifikationsprofil vom 17.06.2021 (bundesweit maßgeblich; es gibt
  keinen berufsspezifischen WiSo-Detailkatalog und keinen Rahmenlehrplan).

### Wichtige Katalog-Änderungen ab 2025 (eingearbeitet)
- **AP1: SQL und RAID gestrichen.** Ebenso Struktogramme und PAP.
- **AP1 neu: BPMN und KI-Grundlagen** prüfungsrelevant.
- Datenmengen zwingend in **Binärpräfixen** (KiB/MiB/GiB, Faktor 1024).
- SQL/RAID bleiben in **AP2** relevant (nur aus AP1 raus).

### Lücken, die beim Abgleich in der Vorversion gefunden und ergänzt wurden
Die erste PLAN.md war eine reine Häufigkeitsauswertung und deckte den Katalog
nicht vollständig ab. Ergänzt wurden u. a.: Teamarbeit/Kommunikationsmodelle,
Marketing/Vertrieb, Kundenberatung/Präsentation, Multimedia/Zeichensätze/
Kompression, Internet/Web (URL, HTTP, HTML/CSS), Softwareentwicklung/Pseudocode/
UML/BPMN, Qualitätssicherung/Testverfahren, Change Management, Verträge/
Leistungserbringung, sowie der **komplette WiSo-Block** nach KMK (inkl. Themen
ohne AP-Datenbasis wie Sozialversicherung, Europa, Existenzgründung).

---

## Legende

**Priorität** (aus AP-Häufigkeit, siehe Häufigkeitsanalyse am Ende):
- **P1** – Kernthema, in ≥70 % der ausgewerteten Prüfungen des jeweiligen Teils.
- **P2** – häufig, 40–69 %.
- **P3** – gelegentlich, <40 %.
- **n/a** – im Katalog gefordert, aber in den ausgewerteten Prüfungen nicht/kaum
  messbar (v. a. WiSo-Detailthemen und neue 2025-Themen). Trotzdem lernpflichtig.

**Tags:**
- `Kern` – prüfungsrelevanter Pflichtstoff. `Bonus` – möglich, aber selten/randständig.
- `AP1` / `AP2` / `beides` – in welchem Prüfungsteil relevant.

Format je Zeile: **[Status] Einheit** — Prio · Tags

> Hinweis Datenbasis: AP1-Häufigkeiten aus OCR gescannter Prüfungen; Rechen- und
> Tabellenaufgaben sind dort systematisch unterschätzt (als `P1 faktisch`
> markiert, wo die Häufigkeit niedriger misst als die reale Prüfungspraxis).

---

# Modul 1 – Projektmanagement & Arbeitsorganisation

> Migrationsstatus: kein Quellmaterial in den 4 alt/-Dateien. Alle Einheiten
> dieses Moduls müssen komplett neu verfasst werden (siehe ROADMAP TODO).

## Thema 1.1 Projektmanagement-Grundlagen
- [x] Projektbegriff, Merkmale, magisches Dreieck (Zeit/Kosten/Qualität) — P2 · Kern · beides
  → Einheit `projektmanagement/projektbegriff-magisches-dreieck` (kein
    Quellmaterial in alt/, originär verfasst)
- [x] Projektphasen / 4-Phasen-Modell, Meilensteine, Kick-off — P2 · Kern · beides
  → Einheit `projektmanagement/projektphasen-meilensteine` (kein
    Quellmaterial in alt/, originär verfasst)
- [x] Lastenheft vs. Pflichtenheft (Zweck, Urheber, Inhalt) — P2 · Kern · beides
  → Einheit `projektmanagement/lastenheft-pflichtenheft` (kein Quellmaterial
    in alt/, originär verfasst)
- [x] Rollen & Stakeholder (Auftraggeber, PL, Steuerkreis) — P3 · Kern · beides
  → Einheit `projektmanagement/rollen-stakeholder` (kein Quellmaterial in
    alt/, originär verfasst)
- [x] SMART-Ziele — P3 · Kern · AP1
  → Einheit `projektmanagement/smart-ziele` (kein Quellmaterial in alt/,
    originär verfasst)

## Thema 1.2 Planungswerkzeuge
- [x] Projektstrukturplan (Top-down/Bottom-up/Yo-Yo) — P3 · Kern · beides
  → Einheit `projektmanagement/projektstrukturplan` (kein Quellmaterial in
    alt/, originär verfasst)
- [x] Netzplan (Vorgänge, Puffer, kritischer Pfad) — P3 · Kern · beides
  → Einheit `projektmanagement/netzplan` (kein Quellmaterial in alt/,
    originär verfasst)
- [x] Gantt-Diagramm — P3 · Kern · beides
  → Einheit `projektmanagement/gantt-diagramm` (kein Quellmaterial in alt/,
    originär verfasst)
- [x] Kanban/Scrum-Board, WIP-Limit — P3 · Bonus · AP1
  → Einheit `projektmanagement/kanban-scrum-board` (kein Quellmaterial in
    alt/, originär verfasst)

## Thema 1.3 Vorgehensmodelle
- [x] Wasserfall vs. agil (Scrum: Rollen, Artefakte, Events) — P3 · Kern · beides
  → Einheit `projektmanagement/wasserfall-vs-agil` (kein Quellmaterial in
    alt/, originär verfasst)
- [x] BPMN (neu 2025) — n/a · Kern · AP1
  → Einheit `projektmanagement/bpmn` (kein Quellmaterial in alt/, originär
    verfasst)
- [x] Change Management (Lewin: Unfreeze/Change/Refreeze), Kaizen — P3 · Kern · beides
  → Einheit `projektmanagement/change-management` (kein Quellmaterial in
    alt/, originär verfasst; verweist auf `wiso/betriebliche-mitbestimmung`).
    **Thema 1.3 damit vollständig abgeschlossen.**

## Thema 1.4 Teamarbeit & Kommunikation
- [x] Teamphasen nach Tuckman — n/a · Kern · AP1
  → Einheit `projektmanagement/teamphasen-tuckman` (kein Quellmaterial in
    alt/, originär verfasst)
- [x] Kommunikationsmodelle (Sender-Empfänger, 4-Ohren) — n/a · Kern · AP1
  → Einheit `projektmanagement/kommunikationsmodelle` (kein Quellmaterial
    in alt/, originär verfasst)
- [x] Konfliktlösung: Harvard-Konzept, BATNA, Win-win — n/a · Bonus · AP1
  → Einheit `projektmanagement/konfliktloesung-harvard-batna` (kein
    Quellmaterial in alt/, originär verfasst)
- [x] Konstruktive Kritik / Feedback / Retrospektive — n/a · Bonus · AP1
  → Einheit `projektmanagement/feedback-retrospektive` (kein
    Quellmaterial in alt/, originär verfasst; verweist auf
    `projektmanagement/wasserfall-vs-agil`). **Thema 1.4 damit
    vollständig abgeschlossen.**

## Thema 1.5 Problemlösung & Support
- [x] Problemanalyse: 5 Whys, Root-Cause, Ishikawa — P3 · Kern · beides
  → Einheit `projektmanagement/problemanalyse-5whys-ishikawa` (kein
    Quellmaterial in alt/, originär verfasst)
- [x] Ticketsystem, Störungs-/Fehlermanagement, Eskalation — P3 · Kern · beides
  → Einheit `projektmanagement/ticketsystem-stoerungsmanagement-eskalation`
    (kein Quellmaterial in alt/, originär verfasst; verweist auf
    `software-os-web/it-servicemanagement` und
    `datenschutz-recht/sla-support-level`)
- [x] First/Second/Third Level Support — P3 · Kern · beides
  → Einheit `projektmanagement/first-second-third-level-support` (kein
    Quellmaterial in alt/, originär verfasst). **Thema 1.5 und damit
    Modul 1 (Projektmanagement) vollständig abgeschlossen.**

---

# Modul 2 – Kalkulation & Grundrechnen  (immer prüfungsrelevant)

## Thema 2.1 Datenmengen & Übertragung
- [x] Datenmenge/Speicherbedarf (Auflösung × Farbtiefe, Binärpräfixe) — P1 faktisch · Kern · beides
  → Einheit `kalkulation/bits-und-bytes` (Quelle: alt DS „Bits & Bytes"/„Text zu Bits";
    Tool: Text-zu-Bits-Konverter `assets/tools/bits-konverter.js`; Binärpräfixe KiB/MiB/GiB
    und Auflösung×Farbtiefe-Rechenweg gemäß Katalog 2025 originär ergänzt)
- [x] Übertragungsdauer / Bandbreite / Durchsatz — P1 (AP2) / P2 (AP1) · Kern · beides
  → Einheit `kalkulation/datenmengen-uebertragung` (kein Quellmaterial in alt/,
    originär verfasst)
- [x] Zahlensysteme: binär/dezimal/hex, Zweierkomplement — P1 (AP2) · Kern · beides
  → Einheit `kalkulation/zahlensysteme` (Quelle: alt DS „Zahlensysteme"/„Magic Bytes";
    Tools: Zahlensystem-Konverter `assets/tools/zahlensystem-konverter.js`,
    Hex-Viewer + Dateityp-Rater `assets/tools/hex-viewer.js` als Praxis-Zusatz;
    Zweierkomplement fehlte im Quelltext, originär ergänzt)

## Thema 2.2 Elektrotechnik & Energie
- [x] Leistung P=U·I, Leistungsaufnahme W=P·t — P1 faktisch · Kern · AP1
  → Einheit `kalkulation/elektrotechnik-grundformeln` (Quelle: alt HW m8 „Netzteil";
    Tool: Elektrotechnik-Rechentrainer `assets/tools/elektrotechnik-rechner.js`)
- [x] Netzteil-Dimensionierung, Wirkungsgrad, Stromkosten (kWh) — P2 · Kern · beides
  → in derselben Einheit `kalkulation/elektrotechnik-grundformeln` zusammengefasst
- Hinweis: Formeln P=U·I / W=P·t im AP1-Katalog 2024 nicht mehr explizit gelistet,
  in Altprüfungen aber häufig — weiter üben.

## Thema 2.3 Kaufmännische Kalkulation
- [x] Handelskalkulation (Bezugs-/Selbst-/Verkaufspreis), Rabatt/Skonto — P3 · Kern · beides
  → Einheit `kalkulation/handelskalkulation` (kein Quellmaterial in alt/, originär
    verfasst: vollständiges Kalkulationsschema Einkauf/Verkauf inkl. Rückrechnung
    von Kundenskonto/-rabatt)
- [x] Zuschlagskalkulation, BAB, Gemeinkosten — P3 · Kern · beides
  → Einheit `kalkulation/zuschlagskalkulation-bab` (kein Quellmaterial in alt/,
    originär verfasst: BAB-Verteilungslogik + vollständige differenzierende
    Zuschlagskalkulation Fertigungsbetrieb)
- [x] Nutzwertanalyse / gewichteter Angebotsvergleich — P3 · Kern · beides
  → Einheit `kalkulation/nutzwertanalyse` (kein Quellmaterial in alt/, originär
    verfasst)
- [x] Break-Even, Deckungsbeitrag, Rentabilität, Amortisation — P3 · Kern · beides
  → Einheit `kalkulation/break-even-deckungsbeitrag` (kein Quellmaterial in alt/,
    originär verfasst)
- [x] Kauf vs. Miete vs. Leasing, TCO — P2 (AP2) · Kern · beides
  → Einheit `kalkulation/kauf-miete-leasing-tco` (kein Quellmaterial in alt/,
    originär verfasst)

---

# Modul 3 – Hardware & Technologien

## Thema 3.1 Kernkomponenten
- [x] CPU (Von-Neumann, ALU, Kennzahlen, Cache, CISC/RISC) — P2 · Kern · beides
  → gesplittet: Grundaufbau in `hardware/computer-grundaufbau` (Von-Neumann-Architektur
    originär ergänzt, PC-Komponentenübersicht Quelle: alt HW m1),
    ALU/Cache/CISC-RISC/Pipeline in `hardware/cpu-aufbau` (Quelle: alt HW m2)
- [x] RAM (SRAM/DRAM, DDR-Gen, Dual Channel, Timings) — P1 (AP2) / P2 (AP1) · Kern · beides
  → Einheit `hardware/arbeitsspeicher-ram` (Quelle: alt HW m3)
- [x] Mainboard, Bussysteme (PCIe, SATA, SAS, iSCSI) — P3 · Kern · beides
  → Einheit `hardware/mainboard-busse` (Quelle: alt HW m5 für Formfaktoren/PCIe/SATA/
    Chipsatz; SAS originär ergänzt, iSCSI kurz angerissen mit Verweis auf
    Vertiefung in NAS/SAN-Einheit; inkl. Kompatibilitätsprüfung CPU-Sockel/RAM/PCIe
    als Praxisbeispiel)
- [x] BIOS/UEFI, POST, S.M.A.R.T., Bootvorgang — P3 · Kern · beides
  → Einheit `hardware/bios-uefi-boot` (kein Quellmaterial in alt/, originär verfasst)

## Thema 3.2 Massenspeicher
- [x] HDD vs. SSD vs. NVMe (Vor-/Nachteile, Formfaktoren M.2/U.2) — P1 · Kern · beides
  → Einheit `hardware/ssd-hdd-nvme` (Quelle: alt HW m4)
- [x] Speichermedien (magnetisch/elektronisch/optisch), Datenraten — P2 · Kern · beides
  → in derselben Einheit `hardware/ssd-hdd-nvme` zusammengefasst (optische Medien
    originär ergänzt, kein Quellmaterial in alt/)
- [x] RAID 0/1/5/6/10, Hot Swap/Hot Spare (AP1: gestrichen) — P1 (AP2) / — (AP1) · Kern · AP2
  → Einheit `hardware/raid-level` (Quelle: alt SEC m6s1+m6s2;
    Tool: RAID-Kalkulator `assets/tools/raid-rechner.js`; Hot Swap/Hot Spare
    originär ergänzt)
- [x] NAS / SAN / JBOD, Fibre Channel, HBA — P1 (AP2) · Kern · AP2
  → Einheit `hardware/nas-san-storage` (Quelle: alt DS „NFS & SMB" +
    „Block- vs. File-Storage & iSCSI"; JBOD, Fibre Channel und HBA originär ergänzt)

## Thema 3.3 Peripherie & Schnittstellen
- [x] USB A/C, HDMI, DisplayPort, Thunderbolt, RJ45 — P2 · Kern · beides
  → Einheit `hardware/schnittstellen-video` (Quelle: alt HW für USB-Standards/
    Steckerformen und HDMI/DisplayPort-Kennzahlen; Thunderbolt-Details und RJ45
    fehlten im Quelltext, originär ergänzt; Tool: NIC-Konfigurations-Simulator
    `assets/tools/nic-simulator.js` als Randwissen-Praxiszusatz)
- [x] Drucker (Laser/Tinte/Nadel/3D, DPI, Druckkosten) — P1 (AP1) · Kern · AP1
  → Einheit `hardware/drucker` (kein Quellmaterial in alt/, originär verfasst)
- [x] Monitore (TFT/LCD/OLED, Auflösungen HD–8K) — P2 · Kern · AP1
  → Einheit `hardware/monitore-display` (Quelle: alt HW „GPU & Bildschirmanschlüsse"/
    „Display-Technologien"; TFT-Grundprinzip als Verbindung zu den Panel-Typen
    originär ergänzt)
- [x] Scanner-Typen, Sensoren — P3 · Bonus · AP1
  → Einheit `hardware/scanner-sensoren` (kein Quellmaterial in alt/, originär verfasst)

## Thema 3.4 Geräteklassen & Arbeitsplatz
- [x] Desktop/Notebook/Tablet/Thin vs. Fat Client, Dockingstation — P2 · Kern · AP1
  → Einheit `hardware/geraeteklassen-arbeitsplatz` (kein Quellmaterial in alt/,
    originär verfasst)
- [x] USV (VFD/VI/VFI, Scheinleistung, IEC 62040-3) — P2 · Kern · beides
  → USV-Grundfunktion bereits in `it-sicherheit/rto-rpo-verfuegbarkeit` behandelt
    (Quelle: alt SEC m7s2); IEC-62040-3-Klassen (VFD/VI/VFI) und Scheinleistung
    jetzt in Einheit `hardware/usv-klassen` (kein Quellmaterial in alt/,
    originär verfasst)
- [x] Auto-ID: Barcode, QR, RFID, NFC, Asset/Service Tag — P3 · Kern · AP1
  → Einheit `hardware/auto-id` (kein Quellmaterial in alt/, originär verfasst)

## Thema 3.5 Nachhaltigkeit & Ergonomie
- [x] Green IT, Energy Star, Recycling, Nutzungsdauer — P3 · Kern · AP1
  → Einheit `hardware/green-it` (kein Quellmaterial in alt/, originär verfasst)
- [x] Ergonomie / Arbeitsstättenverordnung, Barrierefreiheit HW — P3 · Kern · AP1
  → Einheit `hardware/ergonomie-barrierefreiheit` (kein Quellmaterial in alt/,
    originär verfasst)

**Randwissen ohne eigenen Katalog-Bullet (aus alt HW, zusätzlich migrieren):**
- [x] Gehäusetypen, Formfaktoren, Lüfterkonzepte/Airflow — Randwissen · AP1
  → Einheit `hardware/gehaeuse-formfaktoren` (Quelle: alt HW „Formfaktoren &
    Gehäuseplanung": Gehäusetypen, Entscheidungsmatrix, Airflow/Luftdruck)

---

# Modul 4 – Netzwerktechnik  (AP2-Kernmodul)

> Migrationsstatus: In den 4 alt/-Dateien ist praktisch kein Modul-4-Stoff
> enthalten (kein IPv4/DNS/VLAN/WLAN/OSI-Material). Einzige Ausnahme: VPN
> steckt zusammen mit TLS in einem Abschnitt der SEC-Datei. Alle übrigen
> Einheiten dieses Moduls müssen komplett neu verfasst werden
> (siehe ROADMAP TODO).

## Thema 4.1 Modelle & Grundlagen
- [x] ISO/OSI (7) vs. TCP/IP (4), Schichtzuordnung — P3 (AP1) / P2 (AP2) · Kern · beides
  → Einheit `netzwerktechnik/iso-osi-tcp-ip` (kein Quellmaterial in alt/, originär verfasst)
- [x] Netzwerkkomponenten (Hub/Bridge/Switch/Router) + Schichten — P2 (AP1) / P1 (AP2) · Kern · beides
  → Einheit `netzwerktechnik/netzwerkkomponenten` (kein Quellmaterial in alt/, originär verfasst)
- [x] Topologien, VLAN (tagged/untagged), PoE, QoS — P2 (AP2) · Kern · AP2
  → Einheit `netzwerktechnik/topologien-vlan-poe-qos` (kein Quellmaterial in alt/, originär verfasst)

## Thema 4.2 Adressierung
- [x] IPv4, Subnetting, CIDR, Netzmaske, Broadcast — P2 (AP1) / P1 (AP2) · Kern · beides
  → Einheit `netzwerktechnik/ipv4-subnetting` (kein Quellmaterial in alt/, originär verfasst)
- [x] IPv6 (Global/Unique-Local/Link-Local, SLAAC, EUI-64) — P3 (AP1) / P2 (AP2) · Kern · beides
  → Einheit `netzwerktechnik/ipv6-grundlagen` (kein Quellmaterial in alt/, originär verfasst)
- [x] MAC vs. IP, ARP, APIPA — P2 · Kern · beides
  → Einheit `netzwerktechnik/mac-ip-arp-apipa` (kein Quellmaterial in alt/, originär verfasst)

## Thema 4.3 Protokolle & Dienste
- [x] DHCP (DORA-Ablauf) — P2 · Kern · beides
  → Einheit `netzwerktechnik/dhcp-dora` (kein Quellmaterial in alt/, originär verfasst)
- [x] DNS (Record-Typen A/AAAA/MX/CNAME/PTR/SOA), hosts — P1 (AP2) · Kern · beides
  → Einheit `netzwerktechnik/dns-grundlagen` (kein Quellmaterial in alt/, originär verfasst)
- [x] TCP vs. UDP, 3-Way-Handshake, Ports — P2 (AP2) · Kern · beides
  → Einheit `netzwerktechnik/tcp-udp-ports` (kein Quellmaterial in alt/, originär verfasst)
- [x] Anwendungsprotokolle (HTTP/S, FTP, SMTP/IMAP/POP3, SSH, RDP, SNMP, NTP, LDAP) — P2 · Kern · beides
  → Einheit `netzwerktechnik/anwendungsprotokolle` (kein Quellmaterial in alt/, originär verfasst)

## Thema 4.4 Zugang, WLAN & Diagnose
- [x] WLAN (Standards, SSID, WPA2/3, Enterprise/RADIUS, AP/Repeater) — P1 (AP2) · Kern · beides
  → Einheit `netzwerktechnik/wlan-grundlagen` (kein Quellmaterial in alt/, originär verfasst)
- [x] Verkabelung: Twisted Pair Cat 5–7, LWL (Single/Multimode), strukturiert — P2 · Kern · beides
  → Einheit `netzwerktechnik/verkabelung-tp-lwl` (kein Quellmaterial in alt/, originär verfasst)
- [x] Internetzugang: DSL-Varianten, Datenraten — P3 · Bonus · beides
  → Einheit `netzwerktechnik/internetzugang-dsl` (kein Quellmaterial in alt/, originär verfasst)
- [x] Diagnose: ping, tracert, ipconfig, nslookup, netsh, Loopback — P1 (AP2) · Kern · beides
  → Einheit `netzwerktechnik/netzwerk-diagnose` (kein Quellmaterial in alt/, originär verfasst)
- [x] VPN (Site-to-Site/End-to-Site, IPsec, L2TP), Fernwartung, Telearbeit — P1 (AP2) · Kern · beides
  → Einheit `netzwerktechnik/vpn-grundlagen` (Teilinhalt in alt SEC m5s2 „VPN & TLS";
    TLS-Teil bereits in `it-sicherheit/zertifikate-tls-pki` migriert, VPN-Teil hier
    originär neu verfasst)

## Thema 4.5 Virtualisierung & Cloud
- [x] Server-/Desktop-/App-Virtualisierung, Hypervisor Typ 1/2 — P2 (AP2) · Kern · beides
  → Einheit `netzwerktechnik/virtualisierung-hypervisor` (kein Quellmaterial in alt/, originär verfasst)
- [x] Container (Docker), Unterschied zu VM — P2 · Kern · beides
  → Einheit `netzwerktechnik/container-docker` (kein Quellmaterial in alt/, originär verfasst)
- [x] Cloud: IaaS/PaaS/SaaS/FaaS, Public/Private/Hybrid, On-Premises — P1 (AP2) · Kern · beides
  → Einheit `netzwerktechnik/cloud-grundlagen` (kein Quellmaterial in alt/, originär verfasst)

---

# Modul 5 – IT-Sicherheit

## Thema 5.1 Grundlagen & Management
- [x] Schutzziele: Vertraulichkeit, Integrität, Verfügbarkeit, Authentizität — P2 (AP1) / P1 (AP2) · Kern · beides
  → Einheit `it-sicherheit/schutzziele-cia`
- [x] BSI IT-Grundschutz, Schutzbedarfsanalyse & -kategorien — P2 · Kern · beides
  → gesplittet: BSI-Teil in `it-sicherheit/sicherheitsstandards-isms`,
    Schutzbedarf-Teil in `it-sicherheit/schutzbedarfsanalyse`
- [x] ISMS, ISO/IEC 27001, Security by Design/Default — P3 · Kern · beides
  → Einheit `it-sicherheit/sicherheitsstandards-isms` (zusammengefasst mit BSI-Bullet)
- [x] Maßnahmentypen: technisch/organisatorisch/personell/infrastrukturell — P3 · Kern · beides
  → Einheit `it-sicherheit/toms` (bereits vorhanden, Referenz-Einheit)

## Thema 5.2 Kryptographie
- [x] Symmetrisch/asymmetrisch/hybrid, AES/RSA — P3 (AP1) / P1 (AP2) · Kern · beides
  → Einheit `it-sicherheit/kryptographie-sym-asym` (Quelle: alt SEC m3s1+m3s2;
    Tool: Verschlüsselungs-Simulator)
- [x] Hashverfahren, digitale Signatur — P2 (AP1) / P1 (AP2) · Kern · beides
  → Einheit `it-sicherheit/hash-signatur` (Quelle: alt SEC m3s3+m3s4;
    Tool: Hash-Demonstrator)
- [x] Zertifikate, CA, PKI, TLS/HTTPS — P2 (AP1) / P1 (AP2) · Kern · beides
  → Einheit `it-sicherheit/zertifikate-tls-pki` (Quelle: alt SEC m5s2, TLS-Teil;
    VPN-Teil derselben Quelle geht an Modul 4.4)

## Thema 5.3 Angriffe & Abwehr
- [x] Schadsoftware (Virus/Wurm/Trojaner/Ransomware/Rootkit/Spyware) — P2 · Kern · beides
  → Einheit `it-sicherheit/schadsoftware-typen` (Quelle: alt SEC m2s1)
- [x] Angriffe (Phishing, MITM, SQL-Injection, XSS, DoS/DDoS, Spoofing) — P2 · Kern · beides
  → Einheit `it-sicherheit/angriffsmethoden` (Quelle: alt SEC m2s2+m2s3 Szenario;
    SQL-Injection-Detailteil zusätzlich aus alt DB „SQL Injection & Best Practices")
- [x] Firewall-Typen (Paketfilter/SPI/WAF), DMZ, Port-Forwarding — P1 (AP2) · Kern · beides
  → Einheit `it-sicherheit/firewall-dmz` (Quelle: alt SEC m5s1)
- [x] Endpoint-Security, Virenscanner, Datenträgerverschlüsselung — P3 · Kern · beides
  → Einheit `it-sicherheit/endpoint-security` (kein Quellmaterial in alt/, originär verfasst)

## Thema 5.4 Zugriff & Härtung
- [x] Authentifizierung vs. Autorisierung, 2FA/MFA, SSO, AAA — P2 · Kern · beides
  → Einheit `it-sicherheit/authentifizierung-mfa-aaa` (Quelle: alt SEC m4s1+m4s2)
- [x] Passwort-Policy, Komplexität berechnen, Captcha/PIN/TAN — P2 · Kern · beides
  → in `it-sicherheit/authentifizierung-mfa-aaa` ergänzt: Komplexitäts-Formel
    (Zeichenraum^Länge), Captcha, PIN vs. TAN (Zeichenraum/Captcha/PIN/TAN
    hatten kein Quellmaterial in alt/, originär verfasst)
- [x] Berechtigungskonzepte (RBAC, Least Privilege), GPO, Schalenmodell — P3 (AP1) / P2 (AP2) · Kern · beides
  → Einheit `it-sicherheit/berechtigungskonzepte` (Quelle: alt SEC m4s3)
- [x] Betriebssystem-Härtung — P3 · Kern · beides
  → Einheit `it-sicherheit/betriebssystem-haertung` (kein Quellmaterial in alt/, originär verfasst)
- [x] Zutritt/Zugang/Zugriff, physische Sicherheit, Redundanz, Klima — P2 (AP1) · Kern · beides
  → Zutritt/Zugang/Zugriff bereits über `it-sicherheit/toms` abgedeckt;
    physische Sicherheit/Redundanz/Klima jetzt in Einheit
    `it-sicherheit/physische-sicherheit` (kein Quellmaterial in alt/, originär verfasst)

## Thema 5.5 Datensicherung
- [x] Backup-Arten (Voll/inkrementell/differenziell), Generationenprinzip — P1 (AP2) · Kern · beides
  → Einheit `it-sicherheit/backup-arten` (Quelle: alt SEC m6s3)
- [x] RTO/RPO, 3-2-1-Regel, Hot/Cold Backup, Medien — P1 (AP2) · Kern · AP2
  → Einheit `it-sicherheit/rto-rpo-verfuegbarkeit` (Quelle: alt SEC m7s1+m7s2,
    inkl. USV-Teilinhalt; VFD/VI/VFI-IEC-62040-3-Klassen aus Modul 3.4 fehlen weiterhin)
- [x] Datensicherung vs. Datensicherheit vs. Datenschutz, Datenträgerentsorgung — P3 · Kern · beides
  → Einheit `it-sicherheit/datensicherung-datenschutz` (kein Quellmaterial in alt/, originär verfasst)

---

# Modul 6 – Datenschutz & Recht

## Thema 6.1 Datenschutz
- [x] DSGVO/BDSG, personenbezogene Daten — P3 (AP1) · Kern · beides
  → Einheit `datenschutz-recht/dsgvo-grundlagen` (Quelle: alt SEC m8s1)
- [x] Grundsätze Art. 5 (Zweckbindung, Datenminimierung usw.) — P3 · Kern · beides
  → in derselben Einheit `datenschutz-recht/dsgvo-grundlagen` zusammengefasst
    (Quelle: alt SEC m8s1; Rechtmäßigkeit/Richtigkeit/Rechenschaftspflicht als
    Katalog-Vollständigkeit originär ergänzt, Quelle nannte nur 4 von 6 Prinzipien)
- [x] Betroffenenrechte, Anonymisierung/Pseudonymisierung — P3 · Kern · beides
  → Einheit `datenschutz-recht/betroffenenrechte` (Quelle: alt SEC m8s2 für
    Betroffenenrechte/Rollen; Pseudonymisierung/Anonymisierung aus m8s1
    hierher verschoben, da inhaltlich näher an dieser Einheit)
- [x] Persönlichkeitsrechte (Recht am eigenen Bild etc.) — P3 · Bonus · AP1
  → Einheit `datenschutz-recht/persoenlichkeitsrechte` (kein Quellmaterial in
    alt/, originär verfasst)

## Thema 6.2 Verträge & Lizenzen
- [x] Vertragsarten (Kauf/Werk/Dienst/Miete/Leasing), Bestandteile — P3 · Kern · beides
  → Einheit `datenschutz-recht/vertragsarten` (kein Quellmaterial in alt/,
    originär verfasst)
- [x] SLA, First/Second/Third Level, Verzug — P3 · Kern · beides
  → Einheit `datenschutz-recht/sla-support-level` (kein Quellmaterial in alt/,
    originär verfasst)
- [x] Gewährleistung vs. Garantie, Mängelarten, Mängelrüge — P3 · Kern · beides
  → Einheit `datenschutz-recht/gewaehrleistung-garantie` (kein Quellmaterial
    in alt/, originär verfasst)
- [x] Urheberrecht, Lizenzmodelle (EULA/OEM/GPL/MIT, Freemium, Pay-per-Use) — P3 (AP1) / P2 (AP2) · Kern · beides
  → Einheit `datenschutz-recht/urheberrecht-lizenzen` (kein Quellmaterial in
    alt/, originär verfasst)

## Thema 6.3 Barrierefreiheit & Normen
- [x] Barrierefreiheit Software (einfache Sprache, Braille, Sprachein-/ausgabe) — P3 · Kern · AP1
  → Einheit `datenschutz-recht/barrierefreiheit-software` (kein Quellmaterial
    in alt/, originär verfasst)
- [x] Normen/Zertifikate/Kennzeichnungen, Compliance/Ethik — P3 · Bonus · AP1
  → Einheit `datenschutz-recht/normen-compliance` (kein Quellmaterial in alt/,
    originär verfasst; Energy Star/Blauer Engel bereits in `hardware/green-it`
    behandelt, hier nicht wiederholt)

---

# Modul 7 – Software, Betriebssysteme & Web

## Thema 7.1 Software-Klassifikation
- [x] System-/Anwendungs-/Standard-/Individualsoftware — P3 · Kern · AP1
  → Einheit `software-os-web/software-klassifikation` (kein Quellmaterial in
    alt/, originär verfasst)
- [x] Branchensoftware (ERP/CRM/CMS/DMS), OEM, Open Source vs. proprietär — P3 · Kern · beides
  → Einheit `software-os-web/branchensoftware` (kein Quellmaterial in alt/,
    originär verfasst; OEM referenziert bereits behandelte Details aus
    `datenschutz-recht/urheberrecht-lizenzen`)
- [x] KI-Software / KI-Grundlagen (neu 2025) — n/a · Kern · AP1
  → Einheit `software-os-web/ki-grundlagen` (kein Quellmaterial in alt/,
    originär verfasst)
- [x] IT-Servicemanagement (ITIL, ISO 20000) — P3 · Bonus · beides
  → Einheit `software-os-web/it-servicemanagement` (kein Quellmaterial in
    alt/, originär verfasst)

## Thema 7.2 Betriebssysteme
- [x] Multitasking (kooperativ/präemptiv), Prozess/Task/Thread — P3 · Kern · beides
  → Einheit `software-os-web/multitasking-prozesse` (kein Quellmaterial in
    alt/, originär verfasst)
- [x] Windows vs. Linux/Unix, Domäneneinbindung — P2 · Kern · beides
  → Einheit `software-os-web/windows-vs-linux` (kein Quellmaterial in alt/,
    originär verfasst)
- [x] Linux-Konsole (ls, chmod, chown, mount, grep), Verzeichnisbaum, ugw+rwx — P2 · Kern · beides
  → Einheit `software-os-web/linux-konsole` (Quelle: alt DS „Mounting & fstab" +
    „Linux Dateiberechtigungen"; grep-Befehl originär als Praxis-Ergänzung
    hinzugefügt, im Quelltext nicht enthalten)
- [x] Windows-Konsole (dir, ipconfig, getmac) — P2 · Kern · beides
  → Einheit `software-os-web/windows-berechtigungen-acl` (Quelle: alt DS
    „Windows Dateiberechtigungen & ACL" für ACL/icacls-Teil; dir/ipconfig/
    getmac fehlten im Quelltext, originär ergänzt)

## Thema 7.3 Dateisysteme
- [x] NTFS / FAT32 / exFAT / ext4 / APFS, Journaling, MFT/Inode — P2 · Kern · beides
  → gesplittet: Datei/Metadaten/Inode/MFT in `software-os-web/dateisysteme-grundlagen`,
    NTFS/FAT32/exFAT/ext4-Vergleich + Journaling/Fragmentierung in
    `software-os-web/dateisysteme-vergleich` (Quelle: alt DS; APFS im Quelltext
    nur als Randerwähnung, Details originär ergänzt)
- [x] Partitionierung/Formatierung — P3 · Kern · beides
  → Einheit `software-os-web/partitionierung-formatierung` (kein Quellmaterial
    in alt/, originär verfasst; referenziert Gerätenamen aus
    `software-os-web/linux-konsole`)

## Thema 7.4 Multimedia
- [x] Zeichensätze: ASCII, Unicode, UTF-8 — P3 · Kern · AP1
  → Einheit `software-os-web/zeichensaetze-ascii-unicode` (Quelle: alt DS ASCII&Zeichenkodierung
    + CR/LF/CRLF; Tool: CRLF-Visualizer `assets/tools/crlf-visualizer.js` ✅ gebaut)
- [x] Kompression verlustfrei/verlustbehaftet (ZIP, Huffman, JPEG, MP3) — P3 · Kern · AP1
  → Einheit `software-os-web/kompression` (Quelle: alt DS „Komprimierung" +
    Archivformat-Tabelle aus „Dateiformate nach Kategorie")
- [x] Raster vs. Vektor, Bild-/Videoformate, OCR — P3 · Kern · AP1
  → Einheit `software-os-web/bild-videoformate` (Quelle: alt DS „Dateiformate nach Kategorie",
    inkl. Raster-vs-Vektor-Infobox; OCR fehlte im Quelltext, originär ergänzt)
- [x] Prüfziffern/Parität (EAN, IBAN) — P3 · Bonus · AP1
  → Einheit `software-os-web/pruefziffern-paritaet` (kein Quellmaterial in
    alt/, originär verfasst)

## Thema 7.5 Internet & Web
- [x] URL/URI/URN-Aufbau — P3 · Kern · AP1
  → Einheit `software-os-web/url-uri-urn` (kein Quellmaterial in alt/,
    originär verfasst)
- [x] Ablauf Website-Aufruf (Client/Server), virtuelle Hosts — P3 · Bonus · AP1
  → Einheit `software-os-web/website-aufruf-hosting` (kein Quellmaterial in
    alt/, originär verfasst)
- [x] HTML/CSS-Grundlagen, Responsive Design, Impressumspflicht — P3 · Bonus · AP1
  → Einheit `software-os-web/html-css-grundlagen` (kein Quellmaterial in
    alt/, originär verfasst)

## Thema 7.6 Softwareentwicklung (AP1-Grundlagen)
- [x] Programmierparadigmen (prozedural/OO/funktional), Sprachhöhe — P3 · Kern · AP1
  → Einheit `software-os-web/programmierparadigmen` (kein Quellmaterial in
    alt/, originär verfasst)
- [x] Datentypen, Variablen, Kontrollstrukturen, Pseudocode — P3 · Kern · AP1
  → Einheit `software-os-web/datentypen-pseudocode` (kein Quellmaterial in
    alt/, originär verfasst)
- [x] Compiler/Interpreter/Linker, Debugging, Schreibtischtest — P3 · Kern · AP1
  → Einheit `software-os-web/compiler-interpreter-debugging` (kein
    Quellmaterial in alt/, originär verfasst)
- [x] UML (Use-Case, Klassen-, Aktivitätsdiagramm) — P3 · Kern · AP1
  → Einheit `software-os-web/uml-diagramme` (kein Quellmaterial in alt/,
    originär verfasst)
- Struktogramm/PAP: ab 2025 gestrichen — — · —

**Randwissen ohne eigenen Katalog-Bullet (aus alt DS, zusätzlich migrieren):**
- [x] MIME-Types, Base64-Kodierung — Randwissen · AP1
  → Einheit `software-os-web/mime-base64` (Quelle: alt DS „MIME-Types" + „Base64")
- [x] Deployment-Formate: ISO-Abbilder, WIM (Windows Imaging Format) — Randwissen · AP1
  → Einheit `software-os-web/deployment-formate` (Quelle: alt DS „Deployment-Formate")

---

# Modul 8 – Datenbanken & SQL

## Thema 8.1 Datenbank-Grundlagen
- [x] Relational vs. NoSQL, ACID, DBMS-Aufgaben, Schema — P2 (AP2) · Kern · AP2
  → Einheit `datenbanken-sql/db-grundlagen` (Quelle: alt DB „Was ist eine
    Datenbank?" + „Arten von Datenbanken" + „SQL-Systeme im Vergleich" für
    Themenabdeckung; Text/Beispiele/Szenario eigenständig neu formuliert)
- [x] Datentypen, Constraints, Redundanz/Folgen — P2 · Kern · AP2
  → Einheit `datenbanken-sql/datentypen-constraints` (Quelle: alt DB „Aufbau &
    Grundbegriffe" + „Datentypen & Constraints" für Themenabdeckung;
    Redundanz/Anomalien-Teil originär ergänzt, Text/Beispiele eigenständig
    neu formuliert)

## Thema 8.2 Datenmodellierung
- [x] ER-Modell, Kardinalitäten, referenzielle Integrität — P2 (AP2) · Kern · AP2
  → Einheit `datenbanken-sql/er-modell-kardinalitaeten` (Quelle: alt DB
    „ER-Diagramme – Grundlagen" + „Kardinalitäten & Umsetzung in SQL" für
    Themenabdeckung; eigenes Szenario/Diagramm, kein Text übernommen)
- [x] Normalisierung 1.–3. NF, Primär-/Fremdschlüssel — P2 · Kern · AP2
  → Einheit `datenbanken-sql/normalisierung` (Quelle: alt DB „Normalisierung"
    für Themenabdeckung/Lehrmuster 0NF→1NF→2NF→3NF; eigenes Schema, eigene
    Daten, TowerTech GmbH als durchgängige Praxisfirma für Modul 8 etabliert)

## Thema 8.3 SQL
- [x] DDL/DML/DCL, SELECT/WHERE/JOIN/GROUP BY, CREATE TABLE — P2 (AP2) · Kern · AP2
  → gesplittet (zu umfangreich für 1 Einheit): `datenbanken-sql/sql-ddl` ✅ (Was ist SQL,
    SQL-Systeme im Vergleich, DDL; Quelle: alt DB „Was ist SQL?" + „SQL-Systeme im
    Vergleich" + „DDL" für Themenabdeckung, eigenes Schema/Beispiele),
    `datenbanken-sql/sql-dml` ✅ (SELECT/WHERE/ORDER/INSERT/UPDATE/DELETE/Aggregat/
    GROUP BY, Praxis „Azubi-Chaos"; Quelle: alt DB „DML" + „Praxis: Das Azubi-Chaos"
    für Themenabdeckung, eigenes Szenario), `datenbanken-sql/sql-join` ✅ (INNER/LEFT/
    RIGHT/FULL OUTER JOIN; Quelle: alt DB „JOIN Typen" für Themenabdeckung; SQLite-
    Dialekthinweis empirisch mit sql.js/SQLite 3.49.1 verifiziert, nicht blind aus
    Quelle übernommen — RIGHT/FULL OUTER JOIN werden dort entgegen der alten Annahme
    unterstützt, MySQL-Lücke bei FULL OUTER JOIN bestätigt), `datenbanken-sql/sql-dcl`
    ✅ (GRANT/REVOKE/Rollen, Principle of Least Privilege, Praxis DCL-Simulation;
    Quelle: alt DB „DCL & Rollen" + „Praxis: DCL Simulation" für Themenabdeckung,
    eigene Nutzer/Szenario). Tool: SQL-Editor (Terminal) `assets/tools/sql-editor.js`
    ✅ gebaut (sql.js/SQLite-WASM lokal vendort, siehe CONVENTIONS.md), eingebettet in
    alle vier Teil-Einheiten; für sql-dcl um eine In-Memory-GRANT/REVOKE/SHOW-GRANTS-
    Simulation erweitert, da SQLite selbst kein Rechtesystem hat.
- Hinweis: SQL in AP1 ab 2025 gestrichen; in AP2 weiter Kern. — — · AP2

**Randwissen ohne eigenen Katalog-Bullet (aus alt DB, zusätzlich migrieren):**
- [x] Subqueries (WHERE/IN, FROM, EXISTS) — Randwissen · AP2
  → Einheit `datenbanken-sql/sql-subqueries` (Quelle: alt DB „Subqueries –
    Unterabfragen" für Themenabdeckung, eigenes Schema/Beispiele/Szenario)
- [x] Transaktionen (BEGIN/COMMIT/ROLLBACK, SAVEPOINT, Autocommit) — Randwissen · AP2
  → Einheit `datenbanken-sql/sql-transaktionen` (Quelle: alt DB „Transaktionen" für
    Themenabdeckung; eigenes Lager/Bestellposition-Szenario statt Bankbeispiel,
    SQL-Editor-Tool eingebettet. **Modul 8 damit vollständig abgeschlossen.**)

---

# Modul 9 – Qualitätssicherung

> Migrationsstatus: kein Quellmaterial in den 4 alt/-Dateien. Alle Einheiten
> dieses Moduls müssen komplett neu verfasst werden (siehe ROADMAP TODO).

## Thema 9.1 QM-Grundlagen
- [x] PDCA-Zyklus, prozessorientiertes QM, Zertifizierung — P3 · Kern · beides
  → Einheit `qualitaetssicherung/pdca-prozessorientiertes-qm` (kein
    Quellmaterial in alt/, originär verfasst; verweist auf
    `projektmanagement/change-management` und
    `it-sicherheit/sicherheitsstandards-isms`)
- [x] Qualitätsplanung/-lenkung, Gütesiegel (Blauer Engel) — P3 · Bonus · AP1
  → Einheit `qualitaetssicherung/qualitaetsplanung-guetesiegel` (kein
    Quellmaterial in alt/, originär verfasst; verweist auf
    `hardware/green-it`). **Thema 9.1 damit vollständig abgeschlossen.**

## Thema 9.2 Testverfahren
- [x] Black-/White-Box, Unit-/Integrations-/System-/Abnahmetest, Lasttest — P3 · Kern · beides
  → Einheit `qualitaetssicherung/testverfahren-black-white-box` (kein
    Quellmaterial in alt/, originär verfasst; verweist auf
    `projektmanagement/lastenheft-pflichtenheft`)
- [x] Testprotokoll Arbeitsplatzeinrichtung — P3 · Kern · AP1
  → Einheit `qualitaetssicherung/testprotokoll-arbeitsplatzeinrichtung`
    (kein Quellmaterial in alt/, originär verfasst; verweist auf
    `qualitaetssicherung/testverfahren-black-white-box`,
    `netzwerktechnik/netzwerk-diagnose`, `it-sicherheit/berechtigungskonzepte`,
    `hardware/ergonomie-barrierefreiheit`). **Modul 9 (Qualitätssicherung)
    damit vollständig abgeschlossen.**

---

# Modul 10 – Kaufmännisches & Auftragsabwicklung (AP1-Cluster)

> Migrationsstatus: kein Quellmaterial in den 4 alt/-Dateien. Alle Einheiten
> dieses Moduls müssen komplett neu verfasst werden (siehe ROADMAP TODO).

## Thema 10.1 Markt & Bedarfe
- [x] Wirtschaftssektoren, Betriebl. Grundfunktionen, Wertschöpfung — P3 · Kern · AP1
  → Einheit `kaufmaennisches/wirtschaftssektoren-grundfunktionen` (kein
    Quellmaterial in alt/, originär verfasst; verweist auf
    `wiso/wirtschaftskreislauf-wertschoepfungskette`)
- [x] Marktformen (Monopol/Oligopol/Polypol), Marktgleichgewicht — P3 · Kern · AP1
  → Einheit `kaufmaennisches/marktformen` (kein Quellmaterial in alt/,
    originär verfasst; verweist auf `wiso/soziale-marktwirtschaft`)
- [x] Bedürfnis/Bedarf/Nachfrage, Zielgruppen, Kundentypologien — P3 · Kern · AP1
  → Einheit `kaufmaennisches/zielgruppen-kundentypologien` (kein
    Quellmaterial in alt/, originär verfasst; Bedürfnis/Bedarf/Nachfrage
    bereits in `wiso/beduerfnis-bedarf-kaufkraft` behandelt, hier nur
    Zielgruppen/Kundentypologien vertieft)
- [x] Unternehmens-/Gesellschaftsformen (GmbH/AG/GbR/OHG/KG/UG) — P2 · Kern · beides
  → Einheit `kaufmaennisches/unternehmens-gesellschaftsformen` (kein
    Quellmaterial in alt/, originär verfasst; UG/GmbH-Grundlagen bereits
    in `wiso/existenzgruendung` kurz angerissen, hier vollständiger
    Überblick inkl. GbR/OHG/KG/AG). **Thema 10.1 damit vollständig
    abgeschlossen.**

## Thema 10.2 Marketing & Vertrieb
- [x] ABC-Analyse, Nutzwertanalyse, AIDA, Produktlebenszyklus — P3 · Kern · AP1
  → Einheit `kaufmaennisches/abc-analyse-aida-produktlebenszyklus` (kein
    Quellmaterial in alt/, originär verfasst; Nutzwertanalyse bereits in
    `kalkulation/nutzwertanalyse` behandelt, hier nur referenziert)
- [x] Vertriebsformen, B2B/B2C/B2G, Marktforschung (Primär/Sekundär) — P3 · Bonus · AP1
  → Einheit `kaufmaennisches/vertriebsformen-b2b-b2c-marktforschung` (kein
    Quellmaterial in alt/, originär verfasst)
- [x] Outsourcing vs. Offshoring, Internet-Geschäftsmodelle — P3 · Bonus · AP1
  → Einheit `kaufmaennisches/outsourcing-offshoring-geschaeftsmodelle` (kein
    Quellmaterial in alt/, originär verfasst; verweist auf
    `wiso/standortwettbewerb-lohnniveau` und `netzwerktechnik/cloud-grundlagen`).
    **Thema 10.2 damit vollständig abgeschlossen.**

## Thema 10.3 Kundenberatung & Präsentation
- [x] Informationsrecherche, Quellenbewertung, engl. Fachtexte — P3 · Kern · AP1
  → Einheit `kaufmaennisches/informationsrecherche-quellenbewertung` (kein
    Quellmaterial in alt/, originär verfasst)
- [x] Präsentations-/Argumentationstechniken, Medienkompetenz — P3 · Kern · AP1
  → Einheit `kaufmaennisches/praesentationstechniken-medienkompetenz` (kein
    Quellmaterial in alt/, originär verfasst; verweist auf
    `kaufmaennisches/informationsrecherche-quellenbewertung`). **Thema 10.3
    damit vollständig abgeschlossen.**

## Thema 10.4 Angebotsvergleich
- [x] Make-or-buy, qualitativer/quantitativer Angebotsvergleich — P3 · Kern · beides
  → Einheit `kaufmaennisches/make-or-buy-angebotsvergleich` (kein
    Quellmaterial in alt/, originär verfasst; verweist auf
    `kaufmaennisches/outsourcing-offshoring-geschaeftsmodelle` und
    `kalkulation/nutzwertanalyse`)
- [x] Ausschreibung, Leistungsverzeichnis, Preis-Leistungs-Verhältnis — P3 · Kern · AP1
  → Einheit `kaufmaennisches/ausschreibung-leistungsverzeichnis` (kein
    Quellmaterial in alt/, originär verfasst; verweist auf
    `projektmanagement/lastenheft-pflichtenheft`). **Thema 10.4 damit
    vollständig abgeschlossen.**

## Thema 10.5 Leistungserbringung & Abschluss
- [x] Aufbauorganisation (Ein-/Mehrlinien-/Matrix/Stablinie), Organigramm — P2 · Kern · beides
  → Einheit `kaufmaennisches/aufbauorganisation-organigramm` (kein
    Quellmaterial in alt/, originär verfasst)
- [x] Vollmachten (Prokura, i.V./i.A./ppa.) — P3 · Kern · AP1
  → Einheit `kaufmaennisches/vollmachten-prokura` (kein Quellmaterial in
    alt/, originär verfasst)
- [x] Abnahme, Abnahmeprotokoll, Soll-Ist-Vergleich, Dokumentation — P3 · Kern · AP1
  → Einheit `kaufmaennisches/abnahme-abnahmeprotokoll` (kein
    Quellmaterial in alt/, originär verfasst; verweist auf
    `datenschutz-recht/gewaehrleistung-garantie` und
    `qualitaetssicherung/testprotokoll-arbeitsplatzeinrichtung`)
- [x] Lessons Learned, Nachfolgeaufträge — P3 · Bonus · AP1
  → Einheit `kaufmaennisches/lessons-learned-nachfolgeauftraege` (kein
    Quellmaterial in alt/, originär verfasst; verweist auf
    `projektmanagement/feedback-retrospektive`,
    `kaufmaennisches/abnahme-abnahmeprotokoll`,
    `projektmanagement/problemanalyse-5whys-ishikawa` und
    `datenschutz-recht/sla-support-level`). **Thema 10.5, Modul 10 und
    damit die komplette Produktionsreihenfolge aller 11 Module
    vollständig abgeschlossen.**

---

# Modul 11 – WiSo  (eigener AP2-Prüfungsbereich, KMK-Qualifikationsprofil 2021)

> WiSo hat keinen berufsspezifischen Detailkatalog. Maßgeblich ist das
> KMK-Qualifikationsprofil (3 Bereiche). Alle Einheiten sind **Kern** und
> lernpflichtig, auch wo AP-Daten fehlen (`n/a`). Prüfung: 60 Min, ca. 30
> gebundene + ungebundene Aufgaben, 6 „Themeninseln".
>
> Migrationsstatus: kein Quellmaterial in den 4 alt/-Dateien. Alle Einheiten
> dieses Moduls müssen komplett neu verfasst werden (siehe ROADMAP TODO).

## Thema 11.1 Junge Menschen in Ausbildung und Beruf
- [x] Ausbildungsbetrieb: Stellung in Branche, Geschäftsprozesse — n/a · Kern · AP2
  → Einheit `wiso/duales-system-ausbildungsvertrag` (kein Quellmaterial in
    alt/, originär verfasst)
- [x] Duales System: Rechte/Pflichten Ausbildungsvertrag, BBiG, Beteiligte — P1 · Kern · AP2
  → in derselben Einheit `wiso/duales-system-ausbildungsvertrag` zusammengefasst
- [x] Ausbildungsordnung/Rahmenlehrplan/Ausbildungsrahmenplan — n/a · Kern · AP2
  → in derselben Einheit `wiso/duales-system-ausbildungsvertrag` zusammengefasst
- [x] Arbeitsverhältnis: JArbSchG, ArbSchG, ArbZG, BUrlG, EFZG, KSchG — P1 · Kern · AP2
  → Einheit `wiso/arbeitsschutzgesetze` (kein Quellmaterial in alt/, originär
    verfasst; sechs Gesetze mit Kernregelungen, TowerTech-GmbH-Praxisbeispiel)
- [x] Inhalte von Arbeitsverträgen, Kündigung(sschutz), Fristen — P1 · Kern · AP2
  → Einheit `wiso/arbeitsvertrag-kuendigung` (kein Quellmaterial in alt/,
    originär verfasst; verweist auf KSchG-Kündigungsgründe in
    `wiso/arbeitsschutzgesetze`, ohne diese zu wiederholen)
- [x] Tarifrecht: Arbeitnehmer-/Arbeitgeberorganisationen, Tarifautonomie — P1 · Kern · AP2
  → Einheit `wiso/tarifrecht` (kein Quellmaterial in alt/, originär verfasst)
- [x] Betriebliche Mitbestimmung: Betriebsrat, BetrVG, Organe — P1 · Kern · AP2
  → Einheit `wiso/betriebliche-mitbestimmung` (kein Quellmaterial in alt/,
    originär verfasst)
- [x] Wandel der Arbeitswelt, Digitalisierung, lebenslanges Lernen — n/a · Kern · AP2
  → Einheit `wiso/wandel-arbeitswelt-digitalisierung` (kein Quellmaterial in
    alt/, originär verfasst)
- [x] Fort-/Weiterbildung, Umschulung, beruflicher Aufstieg — n/a · Kern · AP2
  → Einheit `wiso/fort-weiterbildung-umschulung` (kein Quellmaterial in alt/,
    originär verfasst; inkl. IT-Weiterbildungssystem nach BIBB)
- [x] Leben/Lernen/Arbeiten in Europa, berufliche Mobilität — n/a · Bonus · AP2
  → Einheit `wiso/arbeiten-lernen-europa` (kein Quellmaterial in alt/,
    originär verfasst). **Thema 11.1 damit vollständig abgeschlossen.**

## Thema 11.2 Nachhaltige Existenzsicherung
- [x] Soziale Sicherung: 5 Säulen, Versicherungsprinzip, Sozialgerichtsbarkeit — P1 · Kern · AP2
  → Einheit `wiso/soziale-sicherung` (kein Quellmaterial in alt/, originär
    verfasst)
- [x] Grenzen sozialer Sicherung, private Vorsorge — n/a · Kern · AP2
  → Einheit `wiso/grenzen-sozialer-sicherung-vorsorge` (kein Quellmaterial
    in alt/, originär verfasst; 3-Schichten-Modell der Altersvorsorge)
- [x] Entgeltabrechnung: Positionen (brutto/netto, Abzüge) erläutern — n/a · Kern · AP2
  → Einheit `wiso/entgeltabrechnung` (kein Quellmaterial in alt/, originär
    verfasst; referenziert Sozialversicherungszweige aus
    `wiso/soziale-sicherung`)
- [x] Karriere-/Familienplanung, Rollenreflexion — n/a · Bonus · AP2
  → Einheit `wiso/karriere-familienplanung-rollenreflexion` (kein
    Quellmaterial in alt/, originär verfasst; verweist auf
    `projektmanagement/smart-ziele` und `wiso/fort-weiterbildung-umschulung`)
- [x] Existenzgründung: Möglichkeiten und Grenzen — n/a · Bonus · AP2
  → Einheit `wiso/existenzgruendung` (kein Quellmaterial in alt/, originär
    verfasst). **Thema 11.2 damit vollständig abgeschlossen.**

## Thema 11.3 Unternehmen & Marktteilnehmende in vernetzter Welt
- [x] Unternehmen im Wirtschaftskreislauf, Wertschöpfungskette — P1 · Kern · AP2
  → Einheit `wiso/wirtschaftskreislauf-wertschoepfungskette` (kein
    Quellmaterial in alt/, originär verfasst; inkl. SVG-Kreislaufdiagramm)
- [x] Wandel der Märkte, nachhaltige Entwicklung — P1 · Kern · AP2
  → Einheit `wiso/wandel-maerkte-nachhaltige-entwicklung` (kein
    Quellmaterial in alt/, originär verfasst; verweist auf
    `hardware/green-it`, ohne diese zu wiederholen)
- [x] Rechtsgeschäfte: Geschäftsfähigkeit, Kauf-/Miet-/Kreditverträge — P2 · Kern · AP2
  → Einheit `wiso/rechtsgeschaefte-geschaeftsfaehigkeit-vertraege` (kein
    Quellmaterial in alt/, originär verfasst; verweist auf
    `datenschutz-recht/vertragsarten` für weitere Vertragstypen)
- [x] Wirksamkeit von Rechtsgeschäften, Verbraucherschutz — P2 · Kern · AP2
  → Einheit `wiso/wirksamkeit-rechtsgeschaefte-verbraucherschutz` (kein
    Quellmaterial in alt/, originär verfasst; verweist auf
    `datenschutz-recht/gewaehrleistung-garantie`)
- [x] Bedürfnis/Bedarf/Kaufkraft, Konsumentscheidungen — n/a · Kern · AP2
  → Einheit `wiso/beduerfnis-bedarf-kaufkraft` (kein Quellmaterial in alt/,
    originär verfasst)
- [x] Soziale Marktwirtschaft als Grundprinzip — n/a · Kern · AP2
  → Einheit `wiso/soziale-marktwirtschaft` (kein Quellmaterial in alt/,
    originär verfasst; verweist auf `wiso/soziale-sicherung`)
- [x] Standortwettbewerb, Lohnniveau, Nachhaltigkeitsstandards — n/a · Bonus · AP2
  → Einheit `wiso/standortwettbewerb-lohnniveau` (kein Quellmaterial in
    alt/, originär verfasst; verweist auf
    `wiso/wandel-maerkte-nachhaltige-entwicklung`)
- [x] Chancen/Risiken Europa & Globalisierung — n/a · Bonus · AP2
  → Einheit `wiso/chancen-risiken-europa-globalisierung` (kein
    Quellmaterial in alt/, originär verfasst; verweist auf
    `wiso/arbeiten-lernen-europa` und `wiso/standortwettbewerb-lohnniveau`).
    **Modul 11 (WiSo) damit vollständig abgeschlossen.**

---

# Themenhäufigkeit (Datengrundlage der Prioritäten)

Getrennt ausgewertet. Prozente = Anteil der Prüfungen, in denen das Thema
vorkam (Präsenz), nicht Punktanteil.

## AP1 (n = 9: Herbst 2021 – Herbst 2025)
Kernbefunde (P1): Massenspeicher SSD/HDD (89 %), Drucker/Peripherie (78 %).
Häufig (P2): RAM (67 %), Hash/Signatur/Zertifikat (67 %), USV/phys. Sicherheit
(67 %), Schutzziele (56 %), Auth/Passwort (56 %), IPv4/Subnetting (56 %),
Schnittstellen (56 %). AP1 streut breit — kein Thema über 89 %.
Rechnen (Datenmenge/Netzteil/Übertragung) misst nur ~33 %, ist real aber P1 —
OCR-bedingte Unterschätzung, weiter fest einplanen.

## AP2 FISI (n = 7: Winter 2021/22 – Sommer 2025)
Harte Kernblöcke mit 100 %: Switch/Router, IPv4/Subnetting, DNS, RAID,
SSD/HDD, RAM sowie WiSo (Arbeitsrecht, Rechtsformen, BBiG). Weitere P1:
Diagnose/ping (86 %), Backup (86 %), Firewall/DMZ (86 %), Verschlüsselung
(86 %), Cloud (86 %), Übertragungsrechnen (86 %), WLAN/VPN (71 %),
Zahlensysteme (71 %), Sozialversicherung (71 %), Wirtschaftskreislauf (71 %).
P2: DB/ERM (57 %), SQL (43 %), IPv6 (57 %), DHCP (43 %).

---

# Empfohlene Lernreihenfolge

**Phase 1 – AP1 (breit, Basiswissen):** Modul 2 (Rechnen) → 3 (Hardware) →
5 (IT-Sicherheit) → 4.1–4.4 (Netz-Basics) → 1 (PM) → 6/7/9/10.
Fast jede AP1 kombiniert: Hardware-Auswahl + eine Rechenaufgabe + IT-Sicherheit/BSI.

**Phase 2 – AP2 (Tiefe):** Modul 4 komplett → 5 komplett → 3.2 (RAID/Storage) →
4.5 (Cloud/Virt.) → 8 (DB/SQL) → 11 (WiSo komplett).

**Durchgängig:** Modul 2 (Rechnen) — in beiden Teilen praktisch garantiert.

# Interaktive Tools (Migration aus Altplattformen)

Die 4 bestehenden Plattform-Dateien enthalten interaktive Tools, die erhalten
bleiben und als wiederverwendbare Module extrahiert werden. Vollständige Liste
nach Durchsicht aller 4 alt/-Dateien:

- SQL-Editor (Terminal, DDL/DML/DCL) → `assets/tools/sql-editor.js` →
  `datenbanken-sql/sql-ddl`, `sql-dml`, `sql-join`, `sql-dcl`, `sql-subqueries` ✅
  gebaut (SQLite via sql.js/WASM, lokal vendort unter `assets/tools/vendor/sql.js/`,
  lazy-load per IntersectionObserver mit Klick/Fokus-Fallback, kein CDN — siehe
  CONVENTIONS.md); für sql-dcl zusätzlich um eine In-Memory-GRANT/REVOKE/
  SHOW-GRANTS-Simulation erweitert, eingebettet in alle fünf SQL-Einheiten
- Hex-Viewer + Dateityp-Rater → `assets/tools/hex-viewer.js` →
  `kalkulation/zahlensysteme`
- Hash-Demonstrator → `assets/tools/hash-demo.js` → `it-sicherheit/hash-signatur` ✅ gebaut
- RAID-Kalkulator → `assets/tools/raid-rechner.js` → `hardware/raid-level` ✅ gebaut
- Text-zu-Bits-Konverter → `assets/tools/bits-konverter.js` →
  `kalkulation/bits-und-bytes`
- Zahlensystem-Konverter → `assets/tools/zahlensystem-konverter.js` →
  `kalkulation/zahlensysteme`
- CRLF-Visualizer → `assets/tools/crlf-visualizer.js` →
  `software-os-web/zeichensaetze-ascii-unicode` ✅ gebaut
- Verschlüsselungs-Simulator → `assets/tools/verschluesselung-demo.js` →
  `it-sicherheit/kryptographie-sym-asym` ✅ gebaut
- Elektrotechnik-Rechentrainer + Rechenquiz → `assets/tools/elektrotechnik-rechner.js` →
  `kalkulation/elektrotechnik-grundformeln` ✅ gebaut
- NIC-Konfigurations-Simulator → `assets/tools/nic-simulator.js` →
  `hardware/schnittstellen-video` (Randwissen-Praxiszusatz) ✅ gebaut
- Angriffs-Szenario („Der Freitagnachmittag-Angriff") → `assets/tools/angriffs-szenario.js`
  (falls generalisierbar, sonst als reines Praxisbeispiel ohne Tool-Extraktion) →
  `it-sicherheit/angriffsmethoden` — Praxisbeispiel-Variante umgesetzt, kein Tool

Regeln: ein Tool = ein eigenständiges JS-Modul ohne Abhängigkeit zur Einheit,
Einbettung über einen Container mit `data-tool`-Attribut analog zum Quiz-Muster.
Tools sind Zusatz am Ende des Konzept- oder Praxis-Abschnitts, ersetzen keine
der 5 Pflicht-Sektionen.

# Quellen
- Projekt: 9 AP1- + 7 AP2-Prüfungen (OCR), manuelle AP1-Themenübersicht,
  Lerneinheiten (Hardware, Dateisysteme, DB/SQL, IT-Sicherheit/DSGVO), Handouts Mohr.
- Extern: ZPA-Prüfungskatalog AP1 (Okt. 2024) via it-berufe-podcast.de;
  ZPA-Katalog AP2 FISI (Konzeption/Netzwerke); KMK-Qualifikationsprofil WiSo
  (17.06.2021, kmk.org / ihk.de).
