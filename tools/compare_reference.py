#!/usr/bin/env python3
"""Vergleicht erzeugte Seiten unter module/ mit der Referenz unter _referenz/module/.

Normalisiert nur Whitespace (Einrueckung, Leerzeilen, mehrfache Leerzeichen)
sowie `&amp;` gegenueber `&`. Jede andere Abweichung wird mit Datei und
Zeilennummer (Referenz / erzeugt) gemeldet.

Aufruf:
  py tools/compare_reference.py                 # alle Seiten
  py tools/compare_reference.py kalkulation     # nur module/kalkulation/

Exit-Code 0 bei 0 Abweichungen, sonst 1.
"""

import difflib
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
MODULE_DIR = REPO_ROOT / "module"
REF_DIR = REPO_ROOT / "_referenz" / "module"

WS = re.compile(r"\s+")


def normalized_lines(path):
    """Liefert [(zeilennummer, normalisierte Zeile)] ohne Leerzeilen."""
    out = []
    text = path.read_text(encoding="utf-8")
    for no, line in enumerate(text.splitlines(), 1):
        norm = WS.sub(" ", line).strip().replace("&amp;", "&")
        if norm:
            out.append((no, norm))
    return out


def compare_file(rel):
    ref = normalized_lines(REF_DIR / rel)
    gen = normalized_lines(MODULE_DIR / rel)
    a = [t for _, t in ref]
    b = [t for _, t in gen]
    problems = []
    matcher = difflib.SequenceMatcher(None, a, b, autojunk=False)
    for op, i1, i2, j1, j2 in matcher.get_opcodes():
        if op == "equal":
            continue
        ref_no = ref[i1][0] if i1 < len(ref) else (ref[-1][0] + 1 if ref else 1)
        gen_no = gen[j1][0] if j1 < len(gen) else (gen[-1][0] + 1 if gen else 1)
        problems.append(f"  {op} Referenz Z. {ref_no} / erzeugt Z. {gen_no}")
        for _, t in ref[i1:i2]:
            problems.append(f"    - {t[:160]}")
        for _, t in gen[j1:j2]:
            problems.append(f"    + {t[:160]}")
    return problems


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    if not REF_DIR.is_dir():
        print(f"Referenz fehlt: {REF_DIR}")
        return 1
    modules = sys.argv[1:]

    def collect(base):
        files = {p.relative_to(base).as_posix() for p in base.rglob("*.html")}
        if modules:
            files = {f for f in files if f.split("/", 1)[0] in modules}
        return files

    ref_files = collect(REF_DIR)
    gen_files = collect(MODULE_DIR)
    deviations = 0

    for rel in sorted(ref_files - gen_files):
        print(f"FEHLT (nur in Referenz): {rel}")
        deviations += 1
    for rel in sorted(gen_files - ref_files):
        print(f"NEU (nicht in Referenz): {rel}")
        deviations += 1
    for rel in sorted(ref_files & gen_files):
        problems = compare_file(rel)
        if problems:
            print(f"ABWEICHUNG: {rel}")
            print("\n".join(problems))
            deviations += 1

    print(f"\n{len(ref_files & gen_files)} Seiten verglichen, "
          f"{deviations} Datei(en) mit Abweichungen.")
    return 1 if deviations else 0


if __name__ == "__main__":
    sys.exit(main())
