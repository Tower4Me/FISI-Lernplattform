# Lernplan FISI – AP1 & AP2 (katalogvollständig)

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

Format je Zeile: **Einheit** — Prio · Tags

> Hinweis Datenbasis: AP1-Häufigkeiten aus OCR gescannter Prüfungen; Rechen- und
> Tabellenaufgaben sind dort systematisch unterschätzt (als `P1 faktisch`
> markiert, wo die Häufigkeit niedriger misst als die reale Prüfungspraxis).

---

# Modul 1 – Projektmanagement & Arbeitsorganisation

> Migrationsstatus: kein Quellmaterial in den 4 alt/-Dateien. Alle Einheiten
> dieses Moduls müssen komplett neu verfasst werden (siehe ROADMAP TODO).

## Thema 1.1 Projektmanagement-Grundlagen
- Projektbegriff, Merkmale, magisches Dreieck (Zeit/Kosten/Qualität) — P2 · Kern · beides
- Projektphasen / 4-Phasen-Modell, Meilensteine, Kick-off — P2 · Kern · beides
- Lastenheft vs. Pflichtenheft (Zweck, Urheber, Inhalt) — P2 · Kern · beides
- Rollen & Stakeholder (Auftraggeber, PL, Steuerkreis) — P3 · Kern · beides
- SMART-Ziele — P3 · Kern · AP1

## Thema 1.2 Planungswerkzeuge
- Projektstrukturplan (Top-down/Bottom-up/Yo-Yo) — P3 · Kern · beides
- Netzplan (Vorgänge, Puffer, kritischer Pfad) — P3 · Kern · beides
- Gantt-Diagramm — P3 · Kern · beides
- Kanban/Scrum-Board, WIP-Limit — P3 · Bonus · AP1

## Thema 1.3 Vorgehensmodelle
- Wasserfall vs. agil (Scrum: Rollen, Artefakte, Events) — P3 · Kern · beides
- BPMN (neu 2025) — n/a · Kern · AP1
- Change Management (Lewin: Unfreeze/Change/Refreeze), Kaizen — P3 · Kern · beides

## Thema 1.4 Teamarbeit & Kommunikation
- Teamphasen nach Tuckman — n/a · Kern · AP1
- Kommunikationsmodelle (Sender-Empfänger, 4-Ohren) — n/a · Kern · AP1
- Konfliktlösung: Harvard-Konzept, BATNA, Win-win — n/a · Bonus · AP1
- Konstruktive Kritik / Feedback / Retrospektive — n/a · Bonus · AP1

## Thema 1.5 Problemlösung & Support
- Problemanalyse: 5 Whys, Root-Cause, Ishikawa — P3 · Kern · beides
- Ticketsystem, Störungs-/Fehlermanagement, Eskalation — P3 · Kern · beides
- First/Second/Third Level Support — P3 · Kern · beides

---

# Modul 2 – Kalkulation & Grundrechnen  (immer prüfungsrelevant)

## Thema 2.1 Datenmengen & Übertragung
- Datenmenge/Speicherbedarf (Auflösung × Farbtiefe, Binärpräfixe) — P1 faktisch · Kern · beides
  → Einheit `kalkulation/bits-und-bytes` (Quelle: alt DS; Tool: Text-zu-Bits-Konverter)
- Übertragungsdauer / Bandbreite / Durchsatz — P1 (AP2) / P2 (AP1) · Kern · beides
  → kein Quellmaterial in alt/, noch zu erstellen (siehe ROADMAP TODO)
- Zahlensysteme: binär/dezimal/hex, Zweierkomplement — P1 (AP2) · Kern · beides
  → Einheit `kalkulation/zahlensysteme` (Quelle: alt DS; Tools: Zahlensystem-Konverter,
    Hex-Viewer + Dateityp-Rater als Praxis-Zusatz; Zweierkomplement fehlt im Quelltext,
    beim Schreiben ergänzt)

## Thema 2.2 Elektrotechnik & Energie
- Leistung P=U·I, Leistungsaufnahme W=P·t — P1 faktisch · Kern · AP1
  → Einheit `kalkulation/elektrotechnik-grundformeln` (Quelle: alt HW;
    Tools: Elektrotechnik-Rechentrainer, Rechenquiz)
- Netzteil-Dimensionierung, Wirkungsgrad, Stromkosten (kWh) — P2 · Kern · beides
  → in derselben Einheit `kalkulation/elektrotechnik-grundformeln` zusammengefasst
- Hinweis: Formeln P=U·I / W=P·t im AP1-Katalog 2024 nicht mehr explizit gelistet,
  in Altprüfungen aber häufig — weiter üben.

## Thema 2.3 Kaufmännische Kalkulation
- Handelskalkulation (Bezugs-/Selbst-/Verkaufspreis), Rabatt/Skonto — P3 · Kern · beides
- Zuschlagskalkulation, BAB, Gemeinkosten — P3 · Kern · beides
- Nutzwertanalyse / gewichteter Angebotsvergleich — P3 · Kern · beides
- Break-Even, Deckungsbeitrag, Rentabilität, Amortisation — P3 · Kern · beides
- Kauf vs. Miete vs. Leasing, TCO — P2 (AP2) · Kern · beides

---

# Modul 3 – Hardware & Technologien

## Thema 3.1 Kernkomponenten
- CPU (Von-Neumann, ALU, Kennzahlen, Cache, CISC/RISC) — P2 · Kern · beides
  → gesplittet: Grundaufbau in `hardware/computer-grundaufbau`,
    ALU/Cache/CISC-RISC/Pipeline in `hardware/cpu-aufbau` (Quelle: alt HW)
- RAM (SRAM/DRAM, DDR-Gen, Dual Channel, Timings) — P1 (AP2) / P2 (AP1) · Kern · beides
  → Einheit `hardware/arbeitsspeicher-ram` (Quelle: alt HW)
- Mainboard, Bussysteme (PCIe, SATA, SAS, iSCSI) — P3 · Kern · beides
  → Einheit `hardware/mainboard-busse` (Quelle: alt HW, inkl. Kompatibilitätsprüfung
    CPU-Sockel/RAM/PCIe als Praxisbeispiel)
- BIOS/UEFI, POST, S.M.A.R.T., Bootvorgang — P3 · Kern · beides
  → kein Quellmaterial in alt/, noch zu erstellen (siehe ROADMAP TODO)

## Thema 3.2 Massenspeicher
- HDD vs. SSD vs. NVMe (Vor-/Nachteile, Formfaktoren M.2/U.2) — P1 · Kern · beides
  → Einheit `hardware/ssd-hdd-nvme` (Quelle: alt HW)
- Speichermedien (magnetisch/elektronisch/optisch), Datenraten — P2 · Kern · beides
  → in derselben Einheit `hardware/ssd-hdd-nvme` zusammengefasst
- RAID 0/1/5/6/10, Hot Swap/Hot Spare (AP1: gestrichen) — P1 (AP2) / — (AP1) · Kern · AP2
  → Einheit `hardware/raid-level` (Quelle: alt SEC; Tool: RAID-Kalkulator)
- NAS / SAN / JBOD, Fibre Channel, HBA — P1 (AP2) · Kern · AP2
  → Einheit `hardware/nas-san-storage` (Quelle: alt DS, NFS&SMB + Block-vs-File-Storage&iSCSI)

## Thema 3.3 Peripherie & Schnittstellen
- USB A/C, HDMI, DisplayPort, Thunderbolt, RJ45 — P2 · Kern · beides
  → Einheit `hardware/schnittstellen-video` (Quelle: alt HW; Tool: NIC-Konfigurations-Simulator
    als Randwissen-Praxiszusatz)
- Drucker (Laser/Tinte/Nadel/3D, DPI, Druckkosten) — P1 (AP1) · Kern · AP1
  → kein Quellmaterial in alt/, noch zu erstellen (siehe ROADMAP TODO)
- Monitore (TFT/LCD/OLED, Auflösungen HD–8K) — P2 · Kern · AP1
  → Einheit `hardware/monitore-display` (Quelle: alt HW)
- Scanner-Typen, Sensoren — P3 · Bonus · AP1
  → kein Quellmaterial in alt/, noch zu erstellen (siehe ROADMAP TODO)

## Thema 3.4 Geräteklassen & Arbeitsplatz
- Desktop/Notebook/Tablet/Thin vs. Fat Client, Dockingstation — P2 · Kern · AP1
  → kein Quellmaterial in alt/, noch zu erstellen (siehe ROADMAP TODO)
- USV (VFD/VI/VFI, Scheinleistung, IEC 62040-3) — P2 · Kern · beides
  → Teilinhalt (USV allgemein) in alt SEC (m7s2 RTO/RPO&USV), primär migriert nach
    `it-sicherheit/rto-rpo-verfuegbarkeit`; IEC-62040-3-Klassen (VFD/VI/VFI) fehlen,
    beim Schreiben ergänzen
- Auto-ID: Barcode, QR, RFID, NFC, Asset/Service Tag — P3 · Kern · AP1
  → kein Quellmaterial in alt/, noch zu erstellen (siehe ROADMAP TODO)

## Thema 3.5 Nachhaltigkeit & Ergonomie
- Green IT, Energy Star, Recycling, Nutzungsdauer — P3 · Kern · AP1
  → kein Quellmaterial in alt/, noch zu erstellen (siehe ROADMAP TODO)
- Ergonomie / Arbeitsstättenverordnung, Barrierefreiheit HW — P3 · Kern · AP1
  → kein Quellmaterial in alt/, noch zu erstellen (siehe ROADMAP TODO)

**Randwissen ohne eigenen Katalog-Bullet (aus alt HW, zusätzlich migrieren):**
- Gehäusetypen, Formfaktoren, Lüfterkonzepte/Airflow — Randwissen · AP1
  → Einheit `hardware/gehaeuse-formfaktoren` (Quelle: alt HW)

---

# Modul 4 – Netzwerktechnik  (AP2-Kernmodul)

> Migrationsstatus: In den 4 alt/-Dateien ist praktisch kein Modul-4-Stoff
> enthalten (kein IPv4/DNS/VLAN/WLAN/OSI-Material). Einzige Ausnahme: VPN
> steckt zusammen mit TLS in einem Abschnitt der SEC-Datei. Alle übrigen
> Einheiten dieses Moduls müssen komplett neu verfasst werden
> (siehe ROADMAP TODO).

## Thema 4.1 Modelle & Grundlagen
- ISO/OSI (7) vs. TCP/IP (4), Schichtzuordnung — P3 (AP1) / P2 (AP2) · Kern · beides
- Netzwerkkomponenten (Hub/Bridge/Switch/Router) + Schichten — P2 (AP1) / P1 (AP2) · Kern · beides
- Topologien, VLAN (tagged/untagged), PoE, QoS — P2 (AP2) · Kern · AP2

## Thema 4.2 Adressierung
- IPv4, Subnetting, CIDR, Netzmaske, Broadcast — P2 (AP1) / P1 (AP2) · Kern · beides
- IPv6 (Global/Unique-Local/Link-Local, SLAAC, EUI-64) — P3 (AP1) / P2 (AP2) · Kern · beides
- MAC vs. IP, ARP, APIPA — P2 · Kern · beides

## Thema 4.3 Protokolle & Dienste
- DHCP (DORA-Ablauf) — P2 · Kern · beides
- DNS (Record-Typen A/AAAA/MX/CNAME/PTR/SOA), hosts — P1 (AP2) · Kern · beides
- TCP vs. UDP, 3-Way-Handshake, Ports — P2 (AP2) · Kern · beides
- Anwendungsprotokolle (HTTP/S, FTP, SMTP/IMAP/POP3, SSH, RDP, SNMP, NTP, LDAP) — P2 · Kern · beides

## Thema 4.4 Zugang, WLAN & Diagnose
- WLAN (Standards, SSID, WPA2/3, Enterprise/RADIUS, AP/Repeater) — P1 (AP2) · Kern · beides
- Verkabelung: Twisted Pair Cat 5–7, LWL (Single/Multimode), strukturiert — P2 · Kern · beides
- Internetzugang: DSL-Varianten, Datenraten — P3 · Bonus · beides
- Diagnose: ping, tracert, ipconfig, nslookup, netsh, Loopback — P1 (AP2) · Kern · beides
- VPN (Site-to-Site/End-to-Site, IPsec, L2TP), Fernwartung, Telearbeit — P1 (AP2) · Kern · beides
  → Teilinhalt in alt SEC (m5s2 „VPN & TLS", gemeinsam mit Zertifikate/TLS-Stoff);
    VPN-Teil noch als eigene Einheit `netzwerktechnik/vpn-grundlagen` zu schreiben,
    TLS-Teil ist bereits in `it-sicherheit/zertifikate-tls-pki` (Modul 5.2) migriert

## Thema 4.5 Virtualisierung & Cloud
- Server-/Desktop-/App-Virtualisierung, Hypervisor Typ 1/2 — P2 (AP2) · Kern · beides
- Container (Docker), Unterschied zu VM — P2 · Kern · beides
- Cloud: IaaS/PaaS/SaaS/FaaS, Public/Private/Hybrid, On-Premises — P1 (AP2) · Kern · beides

---

# Modul 5 – IT-Sicherheit

## Thema 5.1 Grundlagen & Management
- Schutzziele: Vertraulichkeit, Integrität, Verfügbarkeit, Authentizität — P2 (AP1) / P1 (AP2) · Kern · beides
  → Einheit `it-sicherheit/schutzziele-cia`
- BSI IT-Grundschutz, Schutzbedarfsanalyse & -kategorien — P2 · Kern · beides
  → gesplittet: BSI-Teil in `it-sicherheit/sicherheitsstandards-isms`,
    Schutzbedarf-Teil in `it-sicherheit/schutzbedarfsanalyse`
- ISMS, ISO/IEC 27001, Security by Design/Default — P3 · Kern · beides
  → Einheit `it-sicherheit/sicherheitsstandards-isms` (zusammengefasst mit BSI-Bullet)
- Maßnahmentypen: technisch/organisatorisch/personell/infrastrukturell — P3 · Kern · beides
  → Einheit `it-sicherheit/toms` (bereits vorhanden, Referenz-Einheit)

## Thema 5.2 Kryptographie
- Symmetrisch/asymmetrisch/hybrid, AES/RSA — P3 (AP1) / P1 (AP2) · Kern · beides
  → Einheit `it-sicherheit/kryptographie-sym-asym` (Quelle: alt SEC m3s1+m3s2;
    Tool: Verschlüsselungs-Simulator)
- Hashverfahren, digitale Signatur — P2 (AP1) / P1 (AP2) · Kern · beides
  → Einheit `it-sicherheit/hash-signatur` (Quelle: alt SEC m3s3+m3s4;
    Tool: Hash-Demonstrator)
- Zertifikate, CA, PKI, TLS/HTTPS — P2 (AP1) / P1 (AP2) · Kern · beides
  → Einheit `it-sicherheit/zertifikate-tls-pki` (Quelle: alt SEC m5s2, TLS-Teil;
    VPN-Teil derselben Quelle geht an Modul 4.4)

## Thema 5.3 Angriffe & Abwehr
- Schadsoftware (Virus/Wurm/Trojaner/Ransomware/Rootkit/Spyware) — P2 · Kern · beides
  → Einheit `it-sicherheit/schadsoftware-typen` (Quelle: alt SEC m2s1)
- Angriffe (Phishing, MITM, SQL-Injection, XSS, DoS/DDoS, Spoofing) — P2 · Kern · beides
  → Einheit `it-sicherheit/angriffsmethoden` (Quelle: alt SEC m2s2+m2s3 Szenario;
    SQL-Injection-Detailteil zusätzlich aus alt DB „SQL Injection & Best Practices")
- Firewall-Typen (Paketfilter/SPI/WAF), DMZ, Port-Forwarding — P1 (AP2) · Kern · beides
  → Einheit `it-sicherheit/firewall-dmz` (Quelle: alt SEC m5s1)
- Endpoint-Security, Virenscanner, Datenträgerverschlüsselung — P3 · Kern · beides
  → kein Quellmaterial in alt/, noch zu erstellen (siehe ROADMAP TODO)

## Thema 5.4 Zugriff & Härtung
- Authentifizierung vs. Autorisierung, 2FA/MFA, SSO, AAA — P2 · Kern · beides
  → Einheit `it-sicherheit/authentifizierung-mfa-aaa` (Quelle: alt SEC m4s1+m4s2)
- Passwort-Policy, Komplexität berechnen, Captcha/PIN/TAN — P2 · Kern · beides
  → Teilinhalt „Was macht ein gutes Passwort aus" in alt SEC m4s1 enthalten,
    in `it-sicherheit/authentifizierung-mfa-aaa` mit aufgenommen; Komplexität
    berechnen/Captcha/PIN/TAN fehlen, beim Schreiben ergänzen
- Berechtigungskonzepte (RBAC, Least Privilege), GPO, Schalenmodell — P3 (AP1) / P2 (AP2) · Kern · beides
  → Einheit `it-sicherheit/berechtigungskonzepte` (Quelle: alt SEC m4s3)
- Betriebssystem-Härtung — P3 · Kern · beides
  → kein Quellmaterial in alt/, noch zu erstellen (siehe ROADMAP TODO)
- Zutritt/Zugang/Zugriff, physische Sicherheit, Redundanz, Klima — P2 (AP1) · Kern · beides
  → Zutritt/Zugang/Zugriff bereits über `it-sicherheit/toms` abgedeckt;
    physische Sicherheit/Redundanz/Klima fehlen, noch zu erstellen

## Thema 5.5 Datensicherung
- Backup-Arten (Voll/inkrementell/differenziell), Generationenprinzip — P1 (AP2) · Kern · beides
  → Einheit `it-sicherheit/backup-arten` (Quelle: alt SEC m6s3)
- RTO/RPO, 3-2-1-Regel, Hot/Cold Backup, Medien — P1 (AP2) · Kern · AP2
  → Einheit `it-sicherheit/rto-rpo-verfuegbarkeit` (Quelle: alt SEC m7s1+m7s2,
    inkl. USV-Teilinhalt aus Modul 3.4)
- Datensicherung vs. Datensicherheit vs. Datenschutz, Datenträgerentsorgung — P3 · Kern · beides
  → kein Quellmaterial in alt/, noch zu erstellen (siehe ROADMAP TODO)

---

# Modul 6 – Datenschutz & Recht

## Thema 6.1 Datenschutz
- DSGVO/BDSG, personenbezogene Daten — P3 (AP1) · Kern · beides
  → Einheit `datenschutz-recht/dsgvo-grundlagen` (Quelle: alt SEC m8s1)
- Grundsätze Art. 5 (Zweckbindung, Datenminimierung usw.) — P3 · Kern · beides
  → in derselben Einheit `datenschutz-recht/dsgvo-grundlagen` zusammengefasst
- Betroffenenrechte, Anonymisierung/Pseudonymisierung — P3 · Kern · beides
  → Einheit `datenschutz-recht/betroffenenrechte` (Quelle: alt SEC m8s2)
- Persönlichkeitsrechte (Recht am eigenen Bild etc.) — P3 · Bonus · AP1
  → kein Quellmaterial in alt/, noch zu erstellen (siehe ROADMAP TODO)

## Thema 6.2 Verträge & Lizenzen
- Vertragsarten (Kauf/Werk/Dienst/Miete/Leasing), Bestandteile — P3 · Kern · beides
  → kein Quellmaterial in alt/, noch zu erstellen (siehe ROADMAP TODO)
- SLA, First/Second/Third Level, Verzug — P3 · Kern · beides
  → kein Quellmaterial in alt/, noch zu erstellen (siehe ROADMAP TODO)
- Gewährleistung vs. Garantie, Mängelarten, Mängelrüge — P3 · Kern · beides
  → kein Quellmaterial in alt/, noch zu erstellen (siehe ROADMAP TODO)
- Urheberrecht, Lizenzmodelle (EULA/OEM/GPL/MIT, Freemium, Pay-per-Use) — P3 (AP1) / P2 (AP2) · Kern · beides
  → kein Quellmaterial in alt/, noch zu erstellen (siehe ROADMAP TODO)

## Thema 6.3 Barrierefreiheit & Normen
- Barrierefreiheit Software (einfache Sprache, Braille, Sprachein-/ausgabe) — P3 · Kern · AP1
  → kein Quellmaterial in alt/, noch zu erstellen (siehe ROADMAP TODO)
- Normen/Zertifikate/Kennzeichnungen, Compliance/Ethik — P3 · Bonus · AP1
  → kein Quellmaterial in alt/, noch zu erstellen (siehe ROADMAP TODO)

---

# Modul 7 – Software, Betriebssysteme & Web

## Thema 7.1 Software-Klassifikation
- System-/Anwendungs-/Standard-/Individualsoftware — P3 · Kern · AP1
  → kein Quellmaterial in alt/, noch zu erstellen (siehe ROADMAP TODO)
- Branchensoftware (ERP/CRM/CMS/DMS), OEM, Open Source vs. proprietär — P3 · Kern · beides
  → kein Quellmaterial in alt/, noch zu erstellen (siehe ROADMAP TODO)
- KI-Software / KI-Grundlagen (neu 2025) — n/a · Kern · AP1
  → kein Quellmaterial in alt/, noch zu erstellen (siehe ROADMAP TODO)
- IT-Servicemanagement (ITIL, ISO 20000) — P3 · Bonus · beides
  → kein Quellmaterial in alt/, noch zu erstellen (siehe ROADMAP TODO)

## Thema 7.2 Betriebssysteme
- Multitasking (kooperativ/präemptiv), Prozess/Task/Thread — P3 · Kern · beides
  → kein Quellmaterial in alt/, noch zu erstellen (siehe ROADMAP TODO)
- Windows vs. Linux/Unix, Domäneneinbindung — P2 · Kern · beides
  → kein Quellmaterial in alt/, noch zu erstellen (siehe ROADMAP TODO)
- Linux-Konsole (ls, chmod, chown, mount, grep), Verzeichnisbaum, ugw+rwx — P2 · Kern · beides
  → Einheit `software-os-web/linux-konsole` (Quelle: alt DS „Mounting & fstab" +
    „Linux Dateiberechtigungen")
- Windows-Konsole (dir, ipconfig, getmac) — P2 · Kern · beides
  → schwache Passung: alt DS „Windows Dateiberechtigungen & ACL" behandelt ACL statt
    Konsolenbefehle → als `software-os-web/windows-berechtigungen-acl` migriert,
    dir/ipconfig/getmac fehlen weiterhin und sind separat zu ergänzen

## Thema 7.3 Dateisysteme
- NTFS / FAT32 / exFAT / ext4 / APFS, Journaling, MFT/Inode — P2 · Kern · beides
  → gesplittet: Datei/Metadaten/Inode/MFT in `software-os-web/dateisysteme-grundlagen`,
    NTFS/FAT32/exFAT/ext4-Vergleich + Journaling/Fragmentierung in
    `software-os-web/dateisysteme-vergleich` (Quelle: alt DS)
- Partitionierung/Formatierung — P3 · Kern · beides
  → kein explizites Quellmaterial, Mount/fstab-Bezug in `software-os-web/linux-konsole`

## Thema 7.4 Multimedia
- Zeichensätze: ASCII, Unicode, UTF-8 — P3 · Kern · AP1
  → Einheit `software-os-web/zeichensaetze-ascii-unicode` (Quelle: alt DS ASCII&Zeichenkodierung
    + CR/LF/CRLF; Tool: CRLF-Visualizer)
- Kompression verlustfrei/verlustbehaftet (ZIP, Huffman, JPEG, MP3) — P3 · Kern · AP1
  → Einheit `software-os-web/kompression` (Quelle: alt DS)
- Raster vs. Vektor, Bild-/Videoformate, OCR — P3 · Kern · AP1
  → Einheit `software-os-web/bild-videoformate` (Quelle: alt DS „Dateiformate nach Kategorie";
    Raster-vs-Vektor und OCR fehlen im Quelltext, beim Schreiben ergänzen)
- Prüfziffern/Parität (EAN, IBAN) — P3 · Bonus · AP1
  → kein Quellmaterial in alt/, noch zu erstellen (siehe ROADMAP TODO)

## Thema 7.5 Internet & Web
- URL/URI/URN-Aufbau — P3 · Kern · AP1
  → kein Quellmaterial in alt/, noch zu erstellen (siehe ROADMAP TODO)
- Ablauf Website-Aufruf (Client/Server), virtuelle Hosts — P3 · Bonus · AP1
  → kein Quellmaterial in alt/, noch zu erstellen (siehe ROADMAP TODO)
- HTML/CSS-Grundlagen, Responsive Design, Impressumspflicht — P3 · Bonus · AP1
  → kein Quellmaterial in alt/, noch zu erstellen (siehe ROADMAP TODO)

## Thema 7.6 Softwareentwicklung (AP1-Grundlagen)
- Programmierparadigmen (prozedural/OO/funktional), Sprachhöhe — P3 · Kern · AP1
  → kein Quellmaterial in alt/, noch zu erstellen (siehe ROADMAP TODO)
- Datentypen, Variablen, Kontrollstrukturen, Pseudocode — P3 · Kern · AP1
  → kein Quellmaterial in alt/, noch zu erstellen (siehe ROADMAP TODO)
- Compiler/Interpreter/Linker, Debugging, Schreibtischtest — P3 · Kern · AP1
  → kein Quellmaterial in alt/, noch zu erstellen (siehe ROADMAP TODO)
- UML (Use-Case, Klassen-, Aktivitätsdiagramm) — P3 · Kern · AP1
  → kein Quellmaterial in alt/, noch zu erstellen (siehe ROADMAP TODO)
- Struktogramm/PAP: ab 2025 gestrichen — — · —

**Randwissen ohne eigenen Katalog-Bullet (aus alt DS, zusätzlich migrieren):**
- MIME-Types, Base64-Kodierung — Randwissen · AP1
  → Einheit `software-os-web/mime-base64` (Quelle: alt DS)
- Deployment-Formate: ISO-Abbilder, WIM (Windows Imaging Format) — Randwissen · AP1
  → Einheit `software-os-web/deployment-formate` (Quelle: alt DS)

---

# Modul 8 – Datenbanken & SQL

## Thema 8.1 Datenbank-Grundlagen
- Relational vs. NoSQL, ACID, DBMS-Aufgaben, Schema — P2 (AP2) · Kern · AP2
  → Einheit `datenbanken-sql/db-grundlagen` (Quelle: alt DB „Was ist eine Datenbank?" +
    „Arten von Datenbanken")
- Datentypen, Constraints, Redundanz/Folgen — P2 · Kern · AP2
  → Einheit `datenbanken-sql/datentypen-constraints` (Quelle: alt DB „Aufbau & Grundbegriffe" +
    „Datentypen & Constraints")

## Thema 8.2 Datenmodellierung
- ER-Modell, Kardinalitäten, referenzielle Integrität — P2 (AP2) · Kern · AP2
  → Einheit `datenbanken-sql/er-modell-kardinalitaeten` (Quelle: alt DB „ER-Diagramme",
    „Kardinalitäten & Umsetzung in SQL", „Erweitertes ERM")
- Normalisierung 1.–3. NF, Primär-/Fremdschlüssel — P2 · Kern · AP2
  → Einheit `datenbanken-sql/normalisierung` (Quelle: alt DB, inkl. Praxis TowerTech GmbH)

## Thema 8.3 SQL
- DDL/DML/DCL, SELECT/WHERE/JOIN/GROUP BY, CREATE TABLE — P2 (AP2) · Kern · AP2
  → gesplittet (zu umfangreich für 1 Einheit): `datenbanken-sql/sql-ddl` (Was ist SQL,
    SQL-Systeme im Vergleich, DDL), `datenbanken-sql/sql-dml` (SELECT/WHERE/ORDER/
    INSERT/UPDATE/DELETE/Aggregat/GROUP BY, inkl. Praxis Azubi-Chaos),
    `datenbanken-sql/sql-join` (JOIN-Typen), `datenbanken-sql/sql-dcl` (GRANT/REVOKE/
    Rollen, inkl. Praxis DCL-Simulation). Tool: SQL-Editor (Terminal), in sql-ddl/
    sql-dml/sql-dcl eingebettet
- Hinweis: SQL in AP1 ab 2025 gestrichen; in AP2 weiter Kern. — — · AP2

**Randwissen ohne eigenen Katalog-Bullet (aus alt DB, zusätzlich migrieren):**
- Subqueries (WHERE/IN, FROM, EXISTS) — Randwissen · AP2
  → Einheit `datenbanken-sql/sql-subqueries` (Quelle: alt DB)
- Transaktionen (BEGIN/COMMIT/ROLLBACK, SAVEPOINT, Autocommit) — Randwissen · AP2
  → Einheit `datenbanken-sql/sql-transaktionen` (Quelle: alt DB; inhaltlich nah an
    ACID aus Modul 8.1)

---

# Modul 9 – Qualitätssicherung

> Migrationsstatus: kein Quellmaterial in den 4 alt/-Dateien. Alle Einheiten
> dieses Moduls müssen komplett neu verfasst werden (siehe ROADMAP TODO).

## Thema 9.1 QM-Grundlagen
- PDCA-Zyklus, prozessorientiertes QM, Zertifizierung — P3 · Kern · beides
- Qualitätsplanung/-lenkung, Gütesiegel (Blauer Engel) — P3 · Bonus · AP1

## Thema 9.2 Testverfahren
- Black-/White-Box, Unit-/Integrations-/System-/Abnahmetest, Lasttest — P3 · Kern · beides
- Testprotokoll Arbeitsplatzeinrichtung — P3 · Kern · AP1

---

# Modul 10 – Kaufmännisches & Auftragsabwicklung (AP1-Cluster)

> Migrationsstatus: kein Quellmaterial in den 4 alt/-Dateien. Alle Einheiten
> dieses Moduls müssen komplett neu verfasst werden (siehe ROADMAP TODO).

## Thema 10.1 Markt & Bedarfe
- Wirtschaftssektoren, Betriebl. Grundfunktionen, Wertschöpfung — P3 · Kern · AP1
- Marktformen (Monopol/Oligopol/Polypol), Marktgleichgewicht — P3 · Kern · AP1
- Bedürfnis/Bedarf/Nachfrage, Zielgruppen, Kundentypologien — P3 · Kern · AP1
- Unternehmens-/Gesellschaftsformen (GmbH/AG/GbR/OHG/KG/UG) — P2 · Kern · beides

## Thema 10.2 Marketing & Vertrieb
- ABC-Analyse, Nutzwertanalyse, AIDA, Produktlebenszyklus — P3 · Kern · AP1
- Vertriebsformen, B2B/B2C/B2G, Marktforschung (Primär/Sekundär) — P3 · Bonus · AP1
- Outsourcing vs. Offshoring, Internet-Geschäftsmodelle — P3 · Bonus · AP1

## Thema 10.3 Kundenberatung & Präsentation
- Informationsrecherche, Quellenbewertung, engl. Fachtexte — P3 · Kern · AP1
- Präsentations-/Argumentationstechniken, Medienkompetenz — P3 · Kern · AP1

## Thema 10.4 Angebotsvergleich
- Make-or-buy, qualitativer/quantitativer Angebotsvergleich — P3 · Kern · beides
- Ausschreibung, Leistungsverzeichnis, Preis-Leistungs-Verhältnis — P3 · Kern · AP1

## Thema 10.5 Leistungserbringung & Abschluss
- Aufbauorganisation (Ein-/Mehrlinien-/Matrix/Stablinie), Organigramm — P2 · Kern · beides
- Vollmachten (Prokura, i.V./i.A./ppa.) — P3 · Kern · AP1
- Abnahme, Abnahmeprotokoll, Soll-Ist-Vergleich, Dokumentation — P3 · Kern · AP1
- Lessons Learned, Nachfolgeaufträge — P3 · Bonus · AP1

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
- Ausbildungsbetrieb: Stellung in Branche, Geschäftsprozesse — n/a · Kern · AP2
- Duales System: Rechte/Pflichten Ausbildungsvertrag, BBiG, Beteiligte — P1 · Kern · AP2
- Ausbildungsordnung/Rahmenlehrplan/Ausbildungsrahmenplan — n/a · Kern · AP2
- Arbeitsverhältnis: JArbSchG, ArbSchG, ArbZG, BUrlG, EFZG, KSchG — P1 · Kern · AP2
- Inhalte von Arbeitsverträgen, Kündigung(sschutz), Fristen — P1 · Kern · AP2
- Tarifrecht: Arbeitnehmer-/Arbeitgeberorganisationen, Tarifautonomie — P1 · Kern · AP2
- Betriebliche Mitbestimmung: Betriebsrat, BetrVG, Organe — P1 · Kern · AP2
- Wandel der Arbeitswelt, Digitalisierung, lebenslanges Lernen — n/a · Kern · AP2
- Fort-/Weiterbildung, Umschulung, beruflicher Aufstieg — n/a · Kern · AP2
- Leben/Lernen/Arbeiten in Europa, berufliche Mobilität — n/a · Bonus · AP2

## Thema 11.2 Nachhaltige Existenzsicherung
- Soziale Sicherung: 5 Säulen, Versicherungsprinzip, Sozialgerichtsbarkeit — P1 · Kern · AP2
- Grenzen sozialer Sicherung, private Vorsorge — n/a · Kern · AP2
- Entgeltabrechnung: Positionen (brutto/netto, Abzüge) erläutern — n/a · Kern · AP2
- Karriere-/Familienplanung, Rollenreflexion — n/a · Bonus · AP2
- Existenzgründung: Möglichkeiten und Grenzen — n/a · Bonus · AP2

## Thema 11.3 Unternehmen & Marktteilnehmende in vernetzter Welt
- Unternehmen im Wirtschaftskreislauf, Wertschöpfungskette — P1 · Kern · AP2
- Wandel der Märkte, nachhaltige Entwicklung — P1 · Kern · AP2
- Rechtsgeschäfte: Geschäftsfähigkeit, Kauf-/Miet-/Kreditverträge — P2 · Kern · AP2
- Wirksamkeit von Rechtsgeschäften, Verbraucherschutz — P2 · Kern · AP2
- Bedürfnis/Bedarf/Kaufkraft, Konsumentscheidungen — n/a · Kern · AP2
- Soziale Marktwirtschaft als Grundprinzip — n/a · Kern · AP2
- Standortwettbewerb, Lohnniveau, Nachhaltigkeitsstandards — n/a · Bonus · AP2
- Chancen/Risiken Europa & Globalisierung — n/a · Bonus · AP2

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
  `datenbanken-sql/sql-ddl`, `sql-dml`, `sql-dcl`
- Hex-Viewer + Dateityp-Rater → `assets/tools/hex-viewer.js` →
  `kalkulation/zahlensysteme`
- Hash-Demonstrator → `assets/tools/hash-demo.js` → `it-sicherheit/hash-signatur`
- RAID-Kalkulator → `assets/tools/raid-rechner.js` → `hardware/raid-level`
- Text-zu-Bits-Konverter → `assets/tools/bits-konverter.js` →
  `kalkulation/bits-und-bytes`
- Zahlensystem-Konverter → `assets/tools/zahlensystem-konverter.js` →
  `kalkulation/zahlensysteme`
- CRLF-Visualizer → `assets/tools/crlf-visualizer.js` →
  `software-os-web/zeichensaetze-ascii-unicode`
- Verschlüsselungs-Simulator → `assets/tools/verschluesselung-demo.js` →
  `it-sicherheit/kryptographie-sym-asym`
- Elektrotechnik-Rechentrainer + Rechenquiz → `assets/tools/elektrotechnik-rechner.js` →
  `kalkulation/elektrotechnik-grundformeln`
- NIC-Konfigurations-Simulator → `assets/tools/nic-simulator.js` →
  `hardware/schnittstellen-video` (Randwissen-Praxiszusatz)
- Angriffs-Szenario („Der Freitagnachmittag-Angriff") → `assets/tools/angriffs-szenario.js`
  (falls generalisierbar, sonst als reines Praxisbeispiel ohne Tool-Extraktion) →
  `it-sicherheit/angriffsmethoden`

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
