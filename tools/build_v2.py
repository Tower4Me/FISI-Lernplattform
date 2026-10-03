#!/usr/bin/env python3
"""Baut v2/ aus v2/data/manifest.json, v2/data/lernfelder.json und den Fragmenten
in v2/content/ (Schema: v2/README-v2.md).

Erzeugt:
  v2/index.html                      Lernfeld-Übersicht
  v2/<lf>/index.html                 Lernfeld-Startseite mit Kapiteln
  v2/<lf>/<id>-<slug>.html           eine Seite je Unterpunkt
  v2/<lf>/<x>-<y>-check.html         Check je Kapitel (Fragen eingebettet)
  v2/<lf>/rueckblick.html            alle Merksätze des Lernfelds
  v2/<lf>/druck-<x>-<y>.html         Druckfassung je Kapitel
  v2/komponenten.html                Demo aller Bausteine (aus content/_komponenten.html)

Deterministisch (UTF-8, LF). Exit-Code 0 bei Erfolg, sonst 1.
Andere Skripte importieren load_site() für die Struktur.
"""

import html
import json
import math
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
V2 = ROOT / "v2"
DATA = V2 / "data"
CONTENT = V2 / "content"

SITE_TITLE = "FISI Lernplattform"
PRUEFUNG_HREF = "module/pruefung/simulation-ap1.html"  # relativ zum Repo-Root

NOTE_TYPES = {
    "hinweis": ("Hinweis", "i-info"),
    "fehler": ("Häufiger Fehler", "i-alert"),
    "vertiefung": ("Vertiefung", "i-layers"),
    "ueber-ap": ("Über AP hinaus", "i-skip"),
}

ICONS = """<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="i-check" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></symbol>
  <symbol id="i-x" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></symbol>
  <symbol id="i-chev" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></symbol>
  <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></symbol>
  <symbol id="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></symbol>
  <symbol id="i-moon" viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></symbol>
  <symbol id="i-auto" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></symbol>
  <symbol id="i-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></symbol>
  <symbol id="i-alert" viewBox="0 0 24 24"><path d="M12 3l9.5 17h-19z"/><path d="M12 10v4M12 17h.01"/></symbol>
  <symbol id="i-layers" viewBox="0 0 24 24"><path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/></symbol>
  <symbol id="i-skip" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>
  <symbol id="i-print" viewBox="0 0 24 24"><path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/></symbol>
  <symbol id="i-list" viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/></symbol>
</svg>"""

esc = html.escape


class BuildError(Exception):
    pass


# ---------------------------------------------------------------- Struktur

def num_id(nummer):
    return nummer.replace(".", "-")


def load_site():
    """Liest Manifest und Stammdaten und liefert die vollständige Struktur."""
    stamm = {lf["id"]: lf for lf in json.loads((DATA / "lernfelder.json").read_text(encoding="utf-8"))["lernfelder"]}
    manifest = json.loads((DATA / "manifest.json").read_text(encoding="utf-8"))
    site = []
    for lf_m in manifest["lernfelder"]:
        if lf_m["id"] not in stamm:
            raise BuildError(f"Lernfeld {lf_m['id']} fehlt in lernfelder.json")
        lf = dict(stamm[lf_m["id"]])
        lf["kapitel"] = []
        for k_m in lf_m["kapitel"]:
            k = {"nummer": k_m["nummer"], "titel": k_m["titel"], "id": num_id(k_m["nummer"]), "unterpunkte": []}
            if not k["nummer"].startswith(lf["nummer"] + "."):
                raise BuildError(f"Kapitel {k['nummer']} passt nicht zu {lf['id']}")
            for u_m in k_m["unterpunkte"]:
                u = dict(u_m)
                u["id"] = num_id(u["nummer"])
                if not u["nummer"].startswith(k["nummer"] + "."):
                    raise BuildError(f"Unterpunkt {u['nummer']} passt nicht zu Kapitel {k['nummer']}")
                if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", u["slug"]):
                    raise BuildError(f"Slug ungültig: {u['slug']}")
                u.setdefault("stufe", lf["stufe"])
                u.setdefault("quellen", {})
                u.setdefault("material", [])
                u.setdefault("begriffe", [])
                u["datei"] = f"content/{lf['id']}/{u['id']}-{u['slug']}.html"
                u["href"] = f"{u['id']}-{u['slug']}.html"
                k["unterpunkte"].append(u)
            if k_m.get("check"):
                k["check"] = {
                    "datei": f"data/checks/{lf['id']}-kapitel-{k['id']}.json",
                    "href": f"{k['id']}-check.html",
                    "key": f"{lf['id']}-{k['id']}",
                }
            k["druck"] = f"druck-{k['id']}.html"
            lf["kapitel"].append(k)
        site.append(lf)
    return site


def entries(lf):
    """Reihenfolge zum Blättern: Unterpunkte, Check je Kapitel, am Ende Rückblick."""
    out = []
    for k in lf["kapitel"]:
        for u in k["unterpunkte"]:
            out.append({"href": u["href"], "nummer": u["nummer"], "titel": u["titel"]})
        if "check" in k:
            out.append({"href": k["check"]["href"], "nummer": k["nummer"], "titel": "Check"})
    out.append({"href": "rueckblick.html", "nummer": "", "titel": "Rückblick"})
    return out


# ---------------------------------------------------------------- Fragmente

UMLAUT = str.maketrans({"ä": "ae", "ö": "oe", "ü": "ue", "ß": "ss", "Ä": "ae", "Ö": "oe", "Ü": "ue"})


def slugify(text):
    s = re.sub(r"<[^>]+>", "", text).translate(UMLAUT).lower()
    s = re.sub(r"&[a-z]+;", "", s)
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-") or "abschnitt"


def plain_text(fragment):
    t = re.sub(r"<(svg|script|style)\b.*?</\1>", " ", fragment, flags=re.S)
    t = re.sub(r"<[^>]+>", " ", t)
    return html.unescape(re.sub(r"\s+", " ", t)).strip()


MERKSATZ_RE = re.compile(r'<p class="merksatz">(.*?)</p>', re.S)
NOTE_RE = re.compile(r'<aside class="note" data-typ="([a-z-]+)">', re.S)
H3_RE = re.compile(r"<h3( id=\"([^\"]+)\")?>(.*?)</h3>", re.S)


def render_fragment(src, where, prefix=""):
    """Ergänzt h3-ids, Note-Labels und Merksatz-Rahmen. Liefert (html, merksatz_html)."""
    merks = MERKSATZ_RE.findall(src)
    if len(merks) != 1:
        raise BuildError(f"{where}: {len(merks)} Merksätze, erwartet genau 1")
    used = set()

    def h3(m):
        hid = prefix + (m.group(2) or slugify(m.group(3)))
        base, n = hid, 2
        while hid in used:
            hid, n = f"{base}-{n}", n + 1
        used.add(hid)
        return f'<h3 id="{hid}">{m.group(3)}<a class="anchor" href="#{hid}" aria-hidden="true" tabindex="-1">#</a></h3>'

    out = H3_RE.sub(h3, src)

    def note(m):
        typ = m.group(1)
        if typ not in NOTE_TYPES:
            raise BuildError(f"{where}: unbekannter Note-Typ {typ}")
        label, icon = NOTE_TYPES[typ]
        return (f'<aside class="note note-{typ}"><p class="note-label">'
                f'<svg class="icon" aria-hidden="true"><use href="#{icon}"/></svg>{label}</p>')

    out = NOTE_RE.sub(note, out)
    out = MERKSATZ_RE.sub(lambda m: f'<div class="merksatz"><p class="block-label">Merksatz</p><p>{m.group(1)}</p></div>', out)
    return out.strip(), merks[0].strip()


def read_fragment(u):
    p = V2 / u["datei"]
    if not p.exists():
        raise BuildError(f"Fragment fehlt: v2/{u['datei']}")
    return p.read_text(encoding="utf-8")


# ---------------------------------------------------------------- Rahmen

def head(title, root, description="", scripts=()):
    desc = f'\n<meta name="description" content="{esc(description)}">' if description else ""
    return f"""<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">{desc}
<title>{esc(title)} – {SITE_TITLE}</title>
<link rel="icon" href="{root}../assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="{root}assets/tokens.css">
<link rel="stylesheet" href="{root}assets/components.css">
<script src="{root}assets/theme.js"></script>
<script src="{root}assets/app.js" defer></script>
<script src="{root}assets/tabs.js" defer></script>""" + "".join(
        f'\n<script src="{root}assets/{s}" defer></script>' for s in scripts)


def header(root):
    return f"""<a class="skip" href="#inhalt">Zum Inhalt</a>
<header class="site-header">
  <button class="btn nav-toggle" type="button" aria-expanded="false" aria-controls="nav"><svg class="icon" aria-hidden="true"><use href="#i-menu"/></svg><span class="visually-hidden">Navigation</span></button>
  <a class="brand" href="{root}index.html"><span class="brand-mark">FISI</span> <span class="brand-word">Lernplattform</span> <span class="brand-sub">nach Lernfeldern</span></a>
  <div class="header-tools">
    <a class="header-link" href="{root}../{PRUEFUNG_HREF}">Prüfungssimulator</a>
    <label class="switch"><input type="checkbox" id="ap1-only"><span class="switch-text">Nur AP1</span></label>
    <div class="theme-switch" role="group" aria-label="Farbschema">
      <button type="button" data-theme-value="light" aria-pressed="false"><svg class="icon" aria-hidden="true"><use href="#i-sun"/></svg><span class="ts-text">Hell</span></button>
      <button type="button" data-theme-value="dark" aria-pressed="false"><svg class="icon" aria-hidden="true"><use href="#i-moon"/></svg><span class="ts-text">Dunkel</span></button>
      <button type="button" data-theme-value="system" aria-pressed="false"><svg class="icon" aria-hidden="true"><use href="#i-auto"/></svg><span class="ts-text">System</span></button>
    </div>
  </div>
</header>"""


def nav(site, root, cur_lf=None, cur_kap=None, cur_href=None):
    check_svg = '<svg class="icon done" aria-hidden="true"><use href="#i-check"/></svg>'
    lines = ['<nav class="sidenav" id="nav" aria-label="Lernfelder">', '  <ul class="nav-lf">']
    for lf in site:
        is_cur = cur_lf is not None and lf["id"] == cur_lf["id"]
        cls = "lf is-open" if is_cur else "lf"
        cur_attr = ' aria-current="true"' if is_cur else ""
        lines.append(f'    <li class="{cls}" data-stufe="{lf["stufe"]}"{cur_attr}>'
                     f'<button class="lf-head" type="button" aria-expanded="{str(is_cur).lower()}">'
                     f'<span class="num">LF{lf["nummer"]}</span><span>{esc(lf["titel"])}</span>'
                     f'<svg class="icon chev" aria-hidden="true"><use href="#i-chev"/></svg></button>')
        lines.append('      <ul class="nav-kap">')
        base = "" if is_cur and cur_lf is not None else f"{root}{lf['id']}/"
        lines.append(f'        <li class="kap"><a class="kap-head" href="{base}index.html"><span class="num"></span><span>Überblick</span></a></li>')
        for k in lf["kapitel"]:
            k_open = is_cur and cur_kap is not None and k["id"] == cur_kap["id"]
            ids = " ".join(u["id"] for u in k["unterpunkte"])
            first = k["unterpunkte"][0]["href"] if k["unterpunkte"] else "index.html"
            lines.append(f'        <li class="kap{" is-open" if k_open else ""}"><a class="kap-head" href="{base}{first}">'
                         f'<span class="num">{k["nummer"]}</span><span>{esc(k["titel"])}</span>'
                         f'<span class="kap-progress" data-ids="{ids}">0/{len(k["unterpunkte"])}</span></a>')
            lines.append('          <ul class="nav-up">')
            for u in k["unterpunkte"]:
                cur = ' aria-current="page"' if u["href"] == cur_href and is_cur else ""
                lines.append(f'            <li><a class="up" data-id="{u["id"]}" href="{base}{u["href"]}"{cur}>'
                             f'<span class="num">{u["nummer"]}</span><span class="t">{esc(u["titel"])}</span>{check_svg}</a></li>')
            if "check" in k:
                c = k["check"]
                cur = ' aria-current="page"' if c["href"] == cur_href and is_cur else ""
                lines.append(f'            <li><a class="up is-check" data-check="{c["key"]}" href="{base}{c["href"]}"{cur}>'
                             f'<span class="num">{k["nummer"]}</span><span class="t">Check</span>{check_svg}</a></li>')
            lines.append("          </ul>")
            lines.append("        </li>")
        cur = ' aria-current="page"' if cur_href == "rueckblick.html" and is_cur else ""
        lines.append(f'        <li class="kap"><a class="kap-head up is-rueckblick" href="{base}rueckblick.html"{cur}>'
                     f'<span class="num">{lf["nummer"]}.R</span><span class="t">Rückblick</span></a></li>')
        lines.append("      </ul>")
        lines.append("    </li>")
    lines.append("  </ul>")
    lines.append(f'  <div class="nav-extra"><a href="{root}../{PRUEFUNG_HREF}"><svg class="icon" aria-hidden="true"><use href="#i-list"/></svg>Prüfungssimulator</a></div>')
    lines.append("</nav>")
    return "\n".join(lines)


def breadcrumb(items):
    lis = []
    for label, href in items:
        if href:
            lis.append(f'<li><a href="{href}">{label}</a></li>')
        else:
            lis.append(f'<li aria-current="page">{label}</li>')
    return f'<nav class="breadcrumb" aria-label="Pfad"><ol>{"".join(lis)}</ol></nav>'


def pager(lf, href):
    es = entries(lf)
    i = next(n for n, e in enumerate(es) if e["href"] == href)
    parts = []

    def link(e, cls, label):
        num = f'<span class="num">{e["nummer"]}</span>' if e["nummer"] else ""
        return (f'<a class="{cls}" href="{e["href"]}"><span class="dir">{label}</span>'
                f'<span class="pt">{num}{esc(e["titel"])}</span></a>')

    if i > 0:
        parts.append(link(es[i - 1], "prev", "Zurück"))
    if i + 1 < len(es):
        parts.append(link(es[i + 1], "next", "Weiter"))
    return f'<nav class="pager" aria-label="Blättern">{"".join(parts)}</nav>'


def page(title, root, site, main, cur_lf=None, cur_kap=None, cur_href=None, description="", body_attrs="", scripts=()):
    return f"""{head(title, root, description, scripts)}
</head>
<body{body_attrs}>
{ICONS}
{header(root)}
<div class="layout">
{nav(site, root, cur_lf, cur_kap, cur_href)}
<main class="page" id="inhalt">
{main}
</main>
</div>
</body>
</html>
"""


def badge(stufe):
    return f'<span class="badge badge-{stufe.lower()}">{stufe}</span>'


def lesezeit(text):
    return max(1, math.ceil(len(text.split()) / 200))


# ---------------------------------------------------------------- Seiten

def build_unterpunkt(site, lf, k, u, frag_html, text):
    crumbs = breadcrumb([(f"LF{lf['nummer']}", "index.html"),
                         (f"{k['nummer']} {esc(k['titel'])}", f"index.html#k-{k['id']}"),
                         (u["nummer"], None)])
    main = f"""{crumbs}
<header class="page-head">
  <h1><span class="num">{u['nummer']}</span>{esc(u['titel'])}</h1>
  <p class="page-meta">{badge(u['stufe'])}<span>{lesezeit(text)} Min. Lesezeit</span></p>
</header>
<div class="content" data-up="{u['id']}">
{frag_html}
</div>
{pager(lf, u['href'])}"""
    return page(f"{u['nummer']} {u['titel']}", "../", site, main, lf, k, u["href"], body_attrs=f' data-up="{u["id"]}"')


def load_check(k):
    p = V2 / k["check"]["datei"]
    if not p.exists():
        raise BuildError(f"Check fehlt: v2/{k['check']['datei']}")
    return json.loads(p.read_text(encoding="utf-8"))


def build_check(site, lf, k, data):
    crumbs = breadcrumb([(f"LF{lf['nummer']}", "index.html"),
                         (f"{k['nummer']} {esc(k['titel'])}", f"index.html#k-{k['id']}"),
                         ("Check", None)])
    # </ in JSON maskieren, damit der Script-Block nicht vorzeitig endet
    payload = json.dumps(data, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    main = f"""{crumbs}
<header class="page-head">
  <h1><span class="num">{k['nummer']}</span>Check: {esc(k['titel'])}</h1>
  <p class="page-meta">{badge(lf['stufe'])}<span>{len(data['fragen'])} Fragen</span></p>
</header>
<div class="check" data-check-key="{k['check']['key']}">
<script type="application/json" class="check-data">{payload}</script>
<noscript><p>Der Check braucht JavaScript.</p></noscript>
</div>
{pager(lf, k['check']['href'])}"""
    return page(f"{k['nummer']} Check", "../", site, main, lf, k, k["check"]["href"], scripts=("check.js",))


def build_rueckblick(site, lf, merksaetze):
    parts = [breadcrumb([(f"LF{lf['nummer']}", "index.html"), ("Rückblick", None)]),
             f"""<header class="page-head">
  <h1><span class="num">LF{lf['nummer']}</span>Rückblick: {esc(lf['titel'])}</h1>
  <p class="page-meta">{badge(lf['stufe'])}<span>Alle Merksätze nach Kapiteln</span></p>
</header>
<div class="content">"""]
    for k in lf["kapitel"]:
        parts.append(f'<section class="rb-kapitel" id="k-{k["id"]}"><h2><span class="num">{k["nummer"]}</span> {esc(k["titel"])}</h2>')
        parts.append('<ul class="rb-list">')
        for u in k["unterpunkte"]:
            parts.append(f'<li><span class="num">{u["nummer"]}</span><div><a href="{u["href"]}">{esc(u["titel"])}</a>{merksaetze[u["id"]]}</div></li>')
        parts.append("</ul>")
        parts.append(f'<p class="no-print"><a class="btn" href="{k["druck"]}"><svg class="icon" aria-hidden="true"><use href="#i-print"/></svg>Druckfassung {k["nummer"]}</a></p>')
        parts.append("</section>")
    parts.append("</div>")
    parts.append(pager(lf, "rueckblick.html"))
    return page(f"LF{lf['nummer']} Rückblick", "../", site, "\n".join(parts), lf, None, "rueckblick.html")


def build_druck(site, lf, k, frags):
    parts = [breadcrumb([(f"LF{lf['nummer']}", "index.html"),
                         (f"{k['nummer']} {esc(k['titel'])}", f"index.html#k-{k['id']}"),
                         ("Druckfassung", None)]),
             f"""<header class="page-head">
  <h1><span class="num">{k['nummer']}</span>{esc(k['titel'])}</h1>
  <p class="page-meta">{badge(lf['stufe'])}<span>LF{lf['nummer']}: {esc(lf['titel'])}</span></p>
  <p class="no-print" style="margin-top:16px"><button class="btn btn-primary" type="button" onclick="window.print()"><svg class="icon" aria-hidden="true"><use href="#i-print"/></svg>Drucken</button></p>
</header>
<div class="content">"""]
    for u in k["unterpunkte"]:
        parts.append(f'<section class="print-up" id="u-{u["id"]}"><h2><span class="num">{u["nummer"]}</span> {esc(u["titel"])}</h2>')
        parts.append(frags[u["id"]])
        parts.append("</section>")
    parts.append("</div>")
    return page(f"{k['nummer']} {k['titel']} (Druck)", "../", site, "\n".join(parts), lf, k, k["druck"])


def build_lf_index(site, lf):
    parts = [breadcrumb([(f"LF{lf['nummer']}", None)]),
             f"""<header class="page-head">
  <h1><span class="num">LF{lf['nummer']}</span>{esc(lf['titel'])}</h1>
  <p class="page-meta">{badge(lf['stufe'])}<span>{lf['ausbildungsjahr']}. Ausbildungsjahr</span><span>{lf['zeitrichtwert']} Stunden</span></p>
</header>
<div class="content">
<p class="lead">{esc(lf['kernaufgabe'])}</p>"""]
    for k in lf["kapitel"]:
        parts.append(f'<section class="rb-kapitel" id="k-{k["id"]}"><h2><span class="num">{k["nummer"]}</span> {esc(k["titel"])}</h2><ul class="rb-list">')
        for u in k["unterpunkte"]:
            parts.append(f'<li><span class="num">{u["nummer"]}</span><div><a class="up-link" data-id="{u["id"]}" href="{u["href"]}">{esc(u["titel"])}</a></div></li>')
        if "check" in k:
            parts.append(f'<li><span class="num">{k["nummer"]}</span><div><a href="{k["check"]["href"]}">Check</a></div></li>')
        parts.append("</ul></section>")
    parts.append(f'<section class="rb-kapitel"><h2><span class="num">{lf["nummer"]}.R</span> Rückblick</h2><p><a href="rueckblick.html">Alle Merksätze von LF{lf["nummer"]}</a> und Druckfassungen der Kapitel.</p></section>')
    parts.append("</div>")
    first = next((e for e in entries(lf)), None)
    if first:
        parts.append(f'<nav class="pager" aria-label="Blättern"><a class="next" href="{first["href"]}"><span class="dir">Los geht\'s</span><span class="pt"><span class="num">{first["nummer"]}</span>{esc(first["titel"])}</span></a></nav>')
    return page(f"LF{lf['nummer']} {lf['titel']}", "../", site, "\n".join(parts), lf, None, "index.html")


def build_index(site):
    alle = json.loads((DATA / "lernfelder.json").read_text(encoding="utf-8"))["lernfelder"]
    da = {lf["id"] for lf in site}
    parts = [f"""<header class="page-head">
  <h1>Lernfelder</h1>
  <p class="page-meta"><span>Fachinformatiker/in Systemintegration, nach KMK-Rahmenlehrplan</span></p>
</header>
<div class="content">
<p class="lead">Die Inhalte folgen den Lernfeldern der Berufsschule. LF1 bis LF6 gehören zur AP1, LF7 bis LF12b zur AP2.</p>
<ul class="rb-list">"""]
    for lf in alle:
        cls = f' class="lf-item" data-stufe="{lf["stufe"]}"'
        if lf["id"] in da:
            t = f'<a href="{lf["id"]}/index.html">{esc(lf["titel"])}</a>'
        else:
            t = f'<strong>{esc(lf["titel"])}</strong><span class="badge">in Arbeit</span>'
        parts.append(f'<li{cls}><span class="num">LF{lf["nummer"]}</span><div>{t}<p style="margin:2px 0 0;color:var(--muted)">{esc(lf["kernaufgabe"])}</p></div></li>')
    parts.append("</ul>\n</div>")
    return page("Lernfelder", "", site, "\n".join(parts))


def build_komponenten(site):
    src = (CONTENT / "_komponenten.html").read_text(encoding="utf-8")
    frag, _ = render_fragment(src, "content/_komponenten.html")
    main = f"""<header class="page-head">
  <h1><span class="num">0.0.0</span>Komponenten-Übersicht</h1>
  <p class="page-meta">{badge('AP1')}{badge('AP2')}<span>Demo, nicht verlinkt</span></p>
</header>
<div class="content">
{frag}
</div>"""
    return page("Komponenten", "", site, main)


# ---------------------------------------------------------------- Ablauf

def write(path, text):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)


def build():
    site = load_site()
    out = {}
    for lf in site:
        merks, frags = {}, {}
        for k in lf["kapitel"]:
            for u in k["unterpunkte"]:
                src = read_fragment(u)
                frag, merk = render_fragment(src, u["datei"])
                merks[u["id"]] = f"<p>{merk}</p>"
                # Druckfassung: mehrere Unterpunkte auf einer Seite, daher ids mit Präfix
                frags[u["id"]] = render_fragment(src, u["datei"], prefix=f"u{u['id']}-")[0]
                out[f"{lf['id']}/{u['href']}"] = build_unterpunkt(site, lf, k, u, frag, plain_text(frag))
            if "check" in k:
                out[f"{lf['id']}/{k['check']['href']}"] = build_check(site, lf, k, load_check(k))
            out[f"{lf['id']}/{k['druck']}"] = build_druck(site, lf, k, frags)
        out[f"{lf['id']}/rueckblick.html"] = build_rueckblick(site, lf, merks)
        out[f"{lf['id']}/index.html"] = build_lf_index(site, lf)
    out["index.html"] = build_index(site)
    out["komponenten.html"] = build_komponenten(site)

    # Alte generierte Lernfeld-Ordner entfernen (nur v2/lf*/)
    for d in V2.glob("lf*"):
        if d.is_dir():
            shutil.rmtree(d)
    for rel, text in sorted(out.items()):
        write(V2 / rel, text)
    return len(out)


def main():
    try:
        n = build()
    except (BuildError, KeyError, json.JSONDecodeError) as e:
        print(f"FEHLER: {e}")
        return 1
    print(f"build_v2: {n} Seiten erzeugt")
    return 0


if __name__ == "__main__":
    sys.exit(main())
