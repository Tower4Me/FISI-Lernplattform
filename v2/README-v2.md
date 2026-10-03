# v2: Lernplattform nach Lernfeldern

Neuaufbau nach Rahmenlehrplan (Lernfeld > Kapitel > Unterpunkt). Bis zur Umstellung
nicht von der Live-Seite verlinkt, alle Seiten `noindex`.

```
py tools/build_v2.py    # erzeugt alle Seiten unter v2/lfN/ und v2/index.html
py tools/check_v2.py    # Struktur, Links, Merksätze, Quiz-Regeln, Kontrast, noindex
```

## Dateien

```
v2/data/lernfelder.json        Lernfeld-Stammdaten (Titel wörtlich aus dem Rahmenlehrplan)
v2/data/manifest.json          Gliederung: welche Lernfelder, Kapitel, Unterpunkte es gibt
v2/data/begriffe.json          Kernfakten zu Begriffen, die mehrfach vorkommen (intern)
v2/data/checks/lfN-kapitel-x-y.json   Fragen eines Kapitel-Checks
v2/content/lfN/<id>-<slug>.html       Inhalt eines Unterpunkts (Fragment) – HIER bearbeiten
v2/content/_komponenten.html          Inhalt der Demo-Seite v2/komponenten.html
v2/assets/                     tokens.css, components.css, theme.js, app.js, tabs.js, check.js, fonts/
v2/index.html, v2/lfN/*.html, v2/komponenten.html   GENERIERT – nie direkt bearbeiten
```

## manifest.json

```json
{
  "lernfelder": [
    {
      "id": "lf4",
      "kapitel": [
        {
          "nummer": "4.1",
          "titel": "Informationssicherheit verstehen",
          "unterpunkte": [
            {
              "nummer": "4.1.1",
              "titel": "Warum Informationssicherheit?",
              "slug": "warum-informationssicherheit",
              "quellen": {
                "rahmenlehrplan": "LF4: Informationssicherheit (Schutzziele)",
                "zpa": "",
                "ihk": ["AP1 Frühjahr 2023 Aufgabe 3"],
                "extern": ["BSI IT-Grundschutz-Kompendium, Glossar"]
              },
              "material": ["schutzziele-cia"],
              "begriffe": ["schutzziele"]
            }
          ],
          "check": true
        }
      ]
    }
  ]
}
```

Abgeleitet vom Build (nicht im Manifest pflegen):

| Feld | Herkunft |
|---|---|
| Lernfeld `titel`, `nummer`, `stufe` | `lernfelder.json` über `id` |
| Unterpunkt `id` | aus `nummer`: `4.1.1` → `4-1-1` |
| Unterpunkt `stufe` | vom Lernfeld; im Unterpunkt nur setzen, wenn abweichend |
| `datei` | `content/<lf-id>/<id>-<slug>.html` |
| Seiten-URL | `v2/<lf-id>/<id>-<slug>.html` |
| Check | `check: true` → Fragen in `data/checks/<lf-id>-kapitel-<x>-<y>.json`, Seite `v2/<lf-id>/<x>-<y>-check.html` |
| Rückblick | `v2/<lf-id>/rueckblick.html` |
| Druckseite je Kapitel | `v2/<lf-id>/druck-<x>-<y>.html` |

Pflichtfelder je Unterpunkt: `nummer`, `titel`, `slug`. `quellen`, `material`,
`begriffe` sind Listen bzw. Objekte und dürfen leer sein.

## Inhaltsfragment

Nur der Inhalt, ohne `<html>`, Kopf oder Navigation. Bausteine:

```html
<h3>Zwischenüberschrift</h3>              <!-- id wird beim Build ergänzt -->
<p>Erklärung …</p>

<div class="beispiel"><p class="block-label">Beispiel</p><p>…</p></div>

<div class="vergleich"><table>…</table></div>

<div class="reiter" data-reiter>
  <div class="reiter-panel" data-label="Variante A">…</div>
  <div class="reiter-panel" data-label="Variante B">…</div>
</div>

<figure class="grafik"><svg viewBox="…" role="img" aria-label="…">…</svg><figcaption>…</figcaption></figure>

<aside class="note" data-typ="hinweis">…</aside>      <!-- hinweis | fehler | vertiefung | ueber-ap -->

<p class="merksatz">Genau ein Merksatz pro Unterpunkt.</p>
```

Notes und Merksatz bekommen Label und Icon beim Build.

## Check-JSON

```json
{
  "titel": "Check 4.1",
  "fragen": [
    {
      "typ": "mc",
      "thema": "Kurzlabel für die Ergebnisliste",
      "frage": "…",
      "optionen": ["…", "…", "…", "…"],
      "richtig": [2],
      "erklaerung": "1 bis 3 Sätze."
    }
  ]
}
```

`typ`: `mc` (genau eine richtig) oder `mc-multi` (mehrere richtig). `richtig` enthält
Indizes in `optionen`. Optionen werden beim Anzeigen gemischt.

## Speicher (localStorage)

- `fisi:v2:progress`: `{"done": {"<unterpunkt-id>": 1}, "checks": {"<lf>-<x>-<y>": <bester Prozentwert>}}`
- `fisi:v2:theme`: `"light"` | `"dark"` (fehlt = System)
- `fisi:v2:ap1`: `"1"`, wenn „Nur AP1" aktiv ist

Der Live-Schlüssel `fisi:progress` wird von v2 nie gelesen oder geschrieben.
