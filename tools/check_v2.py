"""Prüft v2/ (AUFTRAG-V2 Abschnitte 5, 7, 8). Nur Standardbibliothek.

Aufruf: py tools/check_v2.py   (Exit-Code 1 bei Fehlern)
"""
import re
import sys
from pathlib import Path

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


def main():
    check_contrast()
    for e in errors:
        print("FEHLER:", e)
    print(f"check_v2: {len(errors)} Fehler")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
