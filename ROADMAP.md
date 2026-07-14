# Roadmap: FiSi-Lernplattform (AP2-Fokus)

Ziel: Modulare Lernplattform auf GitHub Pages. Struktur Modul → Thema → Einheit,
gemeinsames Design + Quiz-Engine, Inhalte vollumfänglich inkl. WiSo.

---

## Phase 0 – Vorbereitung ✅ (erledigt)
- [x] Claude.ai Project angelegt, APs 2021+ und Stoff hochgeladen
- [x] Desktop-App mit Claude Code installiert
- [ ] AP2-Material vollständig nachladen
- [ ] Prüfungskatalog (AkA/IHK) im Project ablegen

## Phase 1 – Planung (im Project)
- [ ] AP-Auswertung: Themenhäufigkeit AP1/AP2
- [ ] PLAN.md: vollständige Struktur Modul → Thema → Einheit
      (inkl. WiSo komplett, Priorität pro Einheit, Tags Kern/Bonus + AP1/AP2)
- [ ] PLAN.md gegen Prüfungskatalog auf Vollständigkeit prüfen
- [ ] CONVENTIONS.md: Dateischema, Anzeigenamen, Breadcrumbs,
      Einheiten-Aufbau, Badge- und Farbkonzept, Fachbegriffe
**Meilenstein: Bauplan steht, keine offenen Strukturfragen**

## Phase 2 – Fundament (Claude Code)
- [ ] Neues GitHub-Repo anlegen, PLAN.md + CONVENTIONS.md rein
- [ ] GitHub Pages aktivieren
- [ ] Grundgerüst: assets/style.css, assets/quiz-engine.js (JSON-Fragen,
      localStorage-Fortschritt), Seitentemplate, index.html mit Modulübersicht
- [ ] Light-Mode-Toggle: `[data-theme="light"]`-Umschaltung + localStorage-
      Persistenz gemäß CONVENTIONS.md Abschnitt 12
- [ ] Print-CSS: zentrales `@media print` in style.css gemäß
      CONVENTIONS.md Abschnitt 12
**Meilenstein: leere Plattform läuft online**

## Phase 3 – Qualitätsreferenz
- [ ] Eine Einheit komplett bauen (z.B. IT-Sicherheit: TOMs) + Quiz-JSON
- [ ] Gründlich prüfen: Inhalt, Aufbau, Design, Quiz-Qualität
      (Antwortpositionen, keine Längen-Tells)
- [ ] Korrekturen in CONVENTIONS.md zurückschreiben
**Meilenstein: Referenz-Einheit abgenommen — erst dann weiter**

## Phase 4 – Serienproduktion
- [ ] Einheiten in Batches nach Priorität (AP2-Kernthemen zuerst)
- [ ] Inhalte der 4 alten Plattformen zerlegen und migrieren
- [ ] Pro Batch: Review gegen CONVENTIONS.md, dann Commit
- [ ] Quizfragen nach IHK-Prüfungsmuster erzeugen, keine Originalaufgaben
      übernehmen (siehe CONVENTIONS.md Abschnitt 10)
**Meilenstein: alle Kern-Einheiten AP2 online**

## Phase 5 – Vervollständigung
- [ ] Bonus-/Randwissen-Einheiten
- [ ] AP1-spezifische Themen ergänzen
- [ ] WiSo komplett
- [ ] Wiederholungsmodus: falsch beantwortete Fragen erneut abfragen
**Meilenstein: Lehrplan vollständig abgedeckt**

## Phase 6 – Feinschliff (laufend)
- [ ] Feedback von Klassenkameraden einholen
- [ ] Quiz-Fragen erweitern
- [ ] Alte 4 Plattformen archivieren/verlinken

---

## Offene Einheiten ohne Quellmaterial (Neuerstellung nötig)

Beim Abgleich von PLAN.md gegen die 4 alt/-Plattformdateien (Datenbanken/SQL,
Dateisysteme/Kodierung/Storage, Hardware, IT-Sicherheit/Datenschutz) hat sich
gezeigt: große Teile des Katalogs haben kein Altmaterial und müssen komplett
neu verfasst werden (kein „Migrieren", sondern originäre Erstellung nach
CONVENTIONS.md). Referenz-Detail je Bullet steht direkt in PLAN.md bei der
jeweiligen Einheit („kein Quellmaterial in alt/ …"). Hier die Übersicht nach
Modul, zur Priorisierung von Phase 5:

- [ ] **Modul 1 – Projektmanagement & Arbeitsorganisation**: komplett kein
      Altmaterial (Themen 1.1–1.5, alle Bullets)
- [ ] **Modul 2 – Kalkulation**: Übertragungsdauer/Bandbreite/Durchsatz (2.1)
- [ ] **Modul 3 – Hardware**: BIOS/UEFI/POST/S.M.A.R.T. (3.1); Drucker,
      Scanner-Typen (3.3); Geräteklassen/Dockingstation, USV-Klassen
      VFD/VI/VFI nach IEC 62040-3, Auto-ID Barcode/QR/RFID/NFC (3.4);
      Green IT/Energy Star, Ergonomie/Arbeitsstättenverordnung (3.5)
- [ ] **Modul 4 – Netzwerktechnik**: komplett kein Altmaterial außer dem
      VPN-Teilinhalt (Thema 4.4) — betrifft ISO/OSI vs. TCP/IP,
      Netzwerkkomponenten, Topologien/VLAN/PoE/QoS, IPv4/Subnetting, IPv6,
      MAC/ARP/APIPA, DHCP, DNS, TCP/UDP, Anwendungsprotokolle, WLAN,
      Verkabelung, Internetzugang/DSL, Diagnose-Tools (ping/tracert/…),
      VPN-Grundlagen (eigene Einheit, TLS-Teil ist bereits migriert),
      Virtualisierung, Container, Cloud (Themen 4.1–4.5 komplett)
- [ ] **Modul 5 – IT-Sicherheit**: physische Sicherheit/Redundanz/Klima (5.4,
      Zutritt/Zugang/Zugriff-Teil bereits über TOMs abgedeckt);
      Datensicherung vs. Datensicherheit vs. Datenschutz,
      Datenträgerentsorgung (5.5). Erledigt: Endpoint-Security (5.3),
      Betriebssystem-Härtung (5.4), Passwort-Komplexität/Captcha/PIN/TAN (5.4)
- [ ] **Modul 6 – Datenschutz & Recht**: Persönlichkeitsrechte (6.1);
      Thema 6.2 Verträge & Lizenzen komplett; Thema 6.3 Barrierefreiheit &
      Normen komplett
- [ ] **Modul 7 – Software, OS & Web**: Thema 7.1 Software-Klassifikation
      komplett; 7.2 Multitasking/Windows-vs-Linux allgemein und
      Windows-Konsole (dir/ipconfig/getmac) im Detail; Partitionierung/
      Formatierung (7.3); Prüfziffern/Parität EAN/IBAN (7.4); Thema 7.5
      Internet & Web komplett; Thema 7.6 Softwareentwicklung komplett
- [ ] **Modul 8 – Datenbanken & SQL**: keine Lücken, vollständig aus alt/
      migrierbar
- [ ] **Modul 9 – Qualitätssicherung**: komplett kein Altmaterial
- [ ] **Modul 10 – Kaufmännisches & Auftragsabwicklung**: komplett kein
      Altmaterial
- [ ] **Modul 11 – WiSo**: komplett kein Altmaterial

---

## Arbeitsweise
- Planung/Inhalt-Analyse: im Claude.ai Project
- Umsetzung: Claude Code, liest PLAN.md + CONVENTIONS.md bei jeder Session
- Lange Sessions am Wochenende, Batches statt Mammut-Chats
