"""Prüft v2/ (AUFTRAG-V2 Abschnitte 5, 7, 8). Nur Standardbibliothek.

Aufruf: py tools/check_v2.py   (Exit-Code 1 bei Fehlern)

Prüft:
  - Struktur: Manifest lesbar, 3 bis 7 Kapitel je Lernfeld, eindeutige Nummern
    und Slugs, Fragmente und Check-Dateien vorhanden, Seiten erzeugt
  - Inhalt: genau ein Merksatz je Unterpunkt, Vertiefung mit Link, kein Emoji
  - Checks: 5 bis 8 Fragen, gültige Lösungen, Erklärung 1 bis 3 Sätze,
    richtige Option höchstens in 30 % der Fragen die längste, keine absoluten
    Wörter in falschen Optionen, keine Selbstbeantwortung
  - Seiten: noindex, eindeutige ids, interne Links und Anker
  - Kontrast der Tokens in beiden Themes
"""
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote

sys.path.insert(0, str(Path(__file__).resolve().parent))
import build_v2  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
V2 = ROOT / "v2"

errors = []


def err(msg):
    errors.append(msg)


# --- Kontrast (WCAG 2.x) -------------------------------------------------

def _lum(hexcol):
    h = hexcol.lstrip("#")
    rgb = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    lin = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in rgb]
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]


def contrast(a, b):
    la, lb = sorted((_lum(a), _lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


def read_tokens():
    """Liefert {"light": {...}, "dark": {...}} aus tokens.css."""
    css = (V2 / "assets" / "tokens.css").read_text(encoding="utf-8")
    light_block = re.search(r":root\s*\{(.*?)\}", css, re.S).group(1)
    dark_block = re.search(r':root\[data-theme="dark"\]\s*\{(.*?)\}', css, re.S).group(1)
    pick = lambda block: dict(re.findall(r"--([\w-]+):\s*(#[0-9A-Fa-f]{6})", block))
    return {"light": pick(light_block), "dark": pick(dark_block)}


# Textfarbe auf Hintergrund, Mindestkontrast 4.5:1 (normaler Text)
CONTRAST_PAIRS = [
    ("ink", "bg"), ("ink", "surface"), ("ink", "surface-2"),
    ("muted", "bg"), ("muted", "surface"), ("muted", "surface-2"),
    ("accent", "bg"), ("accent", "surface"),
    ("accent-strong", "accent-bg"), ("ink", "accent-bg"),
    ("info", "info-bg"), ("ink", "info-bg"),
    ("ok", "ok-bg"), ("ink", "ok-bg"),
    ("bad", "bad-bg"), ("ink", "bad-bg"),
    ("bg", "accent"),  # Primärknopf: Seitenfarbe auf Akzent
]


def check_contrast():
    themes = read_tokens()
    for name, tok in themes.items():
        for fg, bg in CONTRAST_PAIRS:
            ratio = contrast(tok[fg], tok[bg])
            if ratio < 4.5:
                err(f"Kontrast {name}: --{fg} auf --{bg} = {ratio:.2f}:1 (< 4.5)")


# --- Struktur und Inhalt -------------------------------------------------

EMOJI_RE = re.compile("[\U0001F300-\U0001FAFF☀-➿️]")


def check_structure(site):
    seen_nums, seen_slugs = set(), set()
    for lf in site:
        n = len(lf["kapitel"])
        if not 3 <= n <= 7:
            err(f"{lf['id']}: {n} Kapitel, erlaubt 3 bis 7")
        for k in lf["kapitel"]:
            if not k["unterpunkte"]:
                err(f"Kapitel {k['nummer']}: keine Unterpunkte")
            if "check" not in k:
                err(f"Kapitel {k['nummer']}: kein Check")
            for u in k["unterpunkte"]:
                for key, seen in (("nummer", seen_nums), ("slug", seen_slugs)):
                    if (lf["id"], u[key]) in seen:
                        err(f"{lf['id']}: {key} doppelt: {u[key]}")
                    seen.add((lf["id"], u[key]))
                if u["stufe"] not in ("AP1", "AP2"):
                    err(f"{u['nummer']}: stufe {u['stufe']} ungültig")
                p = V2 / u["datei"]
                if not p.exists():
                    err(f"Fragment fehlt: v2/{u['datei']}")
                    continue
                check_fragment(p.read_text(encoding="utf-8"), f"v2/{u['datei']}")
                if not (V2 / lf["id"] / u["href"]).exists():
                    err(f"Seite fehlt (Build ausführen): v2/{lf['id']}/{u['href']}")
            if "check" in k:
                p = V2 / k["check"]["datei"]
                if p.exists():
                    check_quiz(json.loads(p.read_text(encoding="utf-8")), f"v2/{k['check']['datei']}")
                else:
                    err(f"Check fehlt: v2/{k['check']['datei']}")


def check_fragment(src, where):
    n = len(build_v2.MERKSATZ_RE.findall(src))
    if n != 1:
        err(f"{where}: {n} Merksätze, erwartet genau 1")
    if EMOJI_RE.search(src):
        err(f"{where}: enthält Emoji")
    if re.search(r"<h[12][ >]", src):
        err(f"{where}: h1/h2 im Fragment, Zwischenüberschriften sind h3")
    for typ, body in re.findall(r'<aside class="note" data-typ="([a-z-]+)">(.*?)</aside>', src, re.S):
        if typ not in build_v2.NOTE_TYPES:
            err(f"{where}: unbekannter Note-Typ {typ}")
        if typ == "vertiefung" and "<a href=" not in body:
            err(f"{where}: Vertiefung ohne Link")
    if re.search(r"<(script|style|link)\b", src):
        err(f"{where}: script/style/link gehören nicht ins Fragment")


# --- Quiz-Regeln (AUFTRAG Abschnitt 5) ------------------------------------

ABSOLUT_RE = re.compile(r"\b(immer|niemals|nie|ausschließlich|ausnahmslos|grundsätzlich nie)\b", re.I)
ABKUERZUNGEN = ["z. B.", "d. h.", "u. a.", "bzw.", "ca.", "Nr.", "usw.", "etc.", "z.B.", "d.h.", "evtl.", "ggf.", "vgl.", "Abs.", "Art."]
STOP = set("""aber alle allem allen aller alles also andere anderen auch auf aus bei beim beide beiden bevor bzw dabei
damit dann dass dein deine dem den denn der deren des dessen die dies diese diesem diesen dieser dieses doch dort durch
eine einem einen einer eines etwa etwas fuer für gegen hier immer ihre ihrem ihren ihrer ist jede jedem jeden jeder
jedes kann kein keine können man mehr mit muss nach nicht noch nur oder ohne sein seine sich sie sind soll über ueber
und uns unter vom von vor wann warum was weil welche welchem welchen welcher welches wenn werden wer wie wird wo zum zur
zwischen sollte sollten haben hat wurde wurden einer""".split())


def sentences(text):
    t = text
    for a in ABKUERZUNGEN:
        t = t.replace(a, a.replace(".", ""))
    parts = [p for p in re.split(r"(?<=[.!?])\s+", t.strip()) if p]
    return len(parts)


def words(text):
    return {w for w in re.findall(r"[a-zäöüß0-9-]{5,}", text.lower()) if w not in STOP}


def check_quiz(data, where):
    qs = data.get("fragen", [])
    if not 5 <= len(qs) <= 8:
        err(f"{where}: {len(qs)} Fragen, erlaubt 5 bis 8")
    longest_right = 0
    for i, q in enumerate(qs, 1):
        w = f"{where} F{i}"
        opts, right = q.get("optionen", []), q.get("richtig", [])
        if q.get("typ") not in ("mc", "mc-multi"):
            err(f"{w}: typ {q.get('typ')} ungültig")
        for f in ("frage", "erklaerung", "thema"):
            if not q.get(f):
                err(f"{w}: Feld {f} fehlt")
        if len(opts) < 3:
            err(f"{w}: weniger als 3 Optionen")
        if not right or any(not isinstance(r, int) or not 0 <= r < len(opts) for r in right):
            err(f"{w}: richtig {right} ungültig")
            continue
        if q.get("typ") == "mc" and len(right) != 1:
            err(f"{w}: mc braucht genau eine richtige Option")
        if q.get("typ") == "mc-multi" and len(right) < 2:
            err(f"{w}: mc-multi braucht mindestens zwei richtige Optionen")
        if len(set(opts)) != len(opts):
            err(f"{w}: doppelte Optionen")
        n = sentences(q.get("erklaerung", ""))
        if not 1 <= n <= 3:
            err(f"{w}: Erklärung hat {n} Sätze, erlaubt 1 bis 3")
        lengths = [len(o) for o in opts]
        if max(lengths) in [lengths[r] for r in right] and lengths.count(max(lengths)) == 1:
            longest_right += 1
        for j, o in enumerate(opts):
            if j not in right and ABSOLUT_RE.search(o):
                err(f"{w}: absolute Formulierung in falscher Option: {o!r}")
        # Selbstbeantwortung: ein markantes Wort der richtigen Antwort steht in der
        # Frage, aber in keiner falschen Option.
        stem = words(q.get("frage", ""))
        wrong = set().union(*(words(opts[j]) for j in range(len(opts)) if j not in right)) if len(opts) > len(right) else set()
        for r in right:
            hits = (words(opts[r]) & stem) - wrong
            if hits:
                err(f"{w}: richtige Option wiederholt Wort aus der Frage: {sorted(hits)}")
    if qs and longest_right / len(qs) > 0.30:
        err(f"{where}: richtige Option ist in {longest_right} von {len(qs)} Fragen die längste (max. 30 %)")


# --- Erzeugte Seiten -----------------------------------------------------

class PageScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids, self.dups, self.links, self.noindex = set(), set(), [], False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            if a["id"] in self.ids:
                self.dups.add(a["id"])
            self.ids.add(a["id"])
        if tag == "meta" and a.get("name") == "robots" and "noindex" in (a.get("content") or ""):
            self.noindex = True
        for attr in ("href", "src"):
            if attr in a and tag != "use":
                self.links.append(a[attr])


def check_pages():
    pages = sorted(p for p in V2.rglob("*.html") if "content" not in p.relative_to(V2).parts)
    scans = {}
    for p in pages:
        s = PageScan()
        s.feed(p.read_text(encoding="utf-8"))
        scans[p.resolve()] = s
    for p, s in scans.items():
        rel = p.relative_to(ROOT).as_posix()
        if not s.noindex:
            err(f"{rel}: noindex fehlt")
        for d in sorted(s.dups):
            err(f"{rel}: id doppelt: {d}")
        for href in s.links:
            if href.startswith(("http://", "https://", "mailto:", "data:", "javascript:")):
                if href.startswith("http"):
                    err(f"{rel}: externer Link/Ressource {href} (v2 lädt nichts von außen)")
                continue
            parts = urlsplit(href)
            if parts.path == "":
                target = p
            else:
                target = (p.parent / unquote(parts.path)).resolve()
                if not target.exists():
                    err(f"{rel}: Link ins Leere: {href}")
                    continue
            if parts.fragment and target in scans and parts.fragment not in scans[target].ids:
                err(f"{rel}: Anker fehlt: {href}")


def main():
    check_contrast()
    try:
        site = build_v2.load_site()
    except (build_v2.BuildError, KeyError, json.JSONDecodeError) as e:
        err(f"Manifest: {e}")
        site = []
    check_structure(site)
    check_pages()
    for e in errors:
        print("FEHLER:", e)
    print(f"check_v2: {len(errors)} Fehler")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
