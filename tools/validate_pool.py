#!/usr/bin/env python3
"""Validiert den Pruefungssimulator-Fragenpool unter data/pruefung/.

Prueft je Frage in jeder unter data/pruefung/index.json referenzierten
Pool-Datei:
  - alle elf Pflichtfelder vorhanden (id, typ, frage, modul, teile, block,
    schwierigkeit, erklaerung, plus typspezifische Felder)
  - typ ist mc/num/order
  - mc: genau 4 optionen, antwort im Bereich 0-3
  - num: einheit/loesung/toleranz vorhanden, loesung numerisch
  - order: mindestens 2 optionen
  - id ist global eindeutig ueber alle Pool-Dateien
  - jeder Eintrag in teile ist ein in index.json bekannter Pruefungsteil
  - block ist fuer MINDESTENS EINEN der in teile gelisteten Pruefungsteile
    ein dort definierter Block (eine Frage kann laut Schema mehreren Teilen
    dienen, deren Blockstruktur sich unterscheidet -- block muss daher nicht
    in jedem gelisteten Teil gueltig sein, siehe Beispiel in
    prompt-pruefungssimulator.md Abschnitt 3: block "adressierung" bei
    teile ["ap2-netzwerke", "ap1"], obwohl ap1 diesen Block nicht hat)
  - modul ist ein in data/manifest.json bekannter Modul-Slug
  - schwierigkeit ist leicht/mittel/schwer

Gibt danach eine Statistik aus: Typ-Verteilung, Fragen je Block,
Antwort-Index-Verteilung (nur mc) und Anteil der Faelle, in denen die
richtige Antwort (mit-)die laengste Option ist (Laengen-Bias-Indikator).

Exit-Code 0, wenn alles sauber ist, sonst 1.
"""

import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
POOL_DIR = REPO_ROOT / "data" / "pruefung"
INDEX_PATH = POOL_DIR / "index.json"
MANIFEST_PATH = REPO_ROOT / "data" / "manifest.json"

TYPEN = {"mc", "num", "order"}
SCHWIERIGKEITEN = {"leicht", "mittel", "schwer"}
COMMON_FELDER = {"id", "typ", "frage", "modul", "teile", "block", "schwierigkeit", "erklaerung"}


def load_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def main():
    errors = []

    try:
        index = load_json(INDEX_PATH)
    except (json.JSONDecodeError, FileNotFoundError) as e:
        print(f"FEHLER: {INDEX_PATH.relative_to(REPO_ROOT)} nicht lesbar: {e}")
        return 1

    try:
        manifest = load_json(MANIFEST_PATH)
    except (json.JSONDecodeError, FileNotFoundError) as e:
        print(f"FEHLER: {MANIFEST_PATH.relative_to(REPO_ROOT)} nicht lesbar: {e}")
        return 1

    valid_module_slugs = {m["slug"] for m in manifest["modules"]}

    teile_by_id = {t["id"]: t for t in index["teile"]}
    valid_teil_ids = set(teile_by_id)
    bloecke_by_teil = {tid: {b["id"] for b in t["bloecke"]} for tid, t in teile_by_id.items()}

    pool_files = set()
    for teil in index["teile"]:
        for datei in teil.get("pool_dateien", []):
            pool_files.add(datei)

    fragen = []  # Liste aus (frage_dict, quell_datei)
    for datei in sorted(pool_files):
        pool_path = POOL_DIR / datei
        if not pool_path.exists():
            errors.append(f"FEHLENDE POOL-DATEI: {datei} (in index.json referenziert)")
            continue
        try:
            pool = load_json(pool_path)
        except json.JSONDecodeError as e:
            errors.append(f"UNGUELTIGES JSON: {datei} ({e})")
            continue
        for f in pool.get("fragen", []):
            fragen.append((f, datei))

    if not fragen:
        print("Keine Fragen gefunden.")
        if errors:
            print(f"\n{len(errors)} Problem(e):")
            for e in errors:
                print(f"  - {e}")
        return 1 if errors else 0

    all_ids = {}  # id -> erste Quelldatei

    for f, quelle in fragen:
        label = f"{f.get('id', '<ohne id>')} ({quelle})"

        fehlende = COMMON_FELDER - set(f.keys())
        if fehlende:
            errors.append(f"{label}: fehlende Pflichtfelder {sorted(fehlende)}")
            continue

        fid = f["id"]
        if fid in all_ids:
            errors.append(f"{label}: id nicht eindeutig, bereits in {all_ids[fid]} vergeben")
        else:
            all_ids[fid] = quelle

        typ = f["typ"]
        if typ not in TYPEN:
            errors.append(f"{label}: unbekannter typ '{typ}'")
            continue

        teile = f["teile"]
        if not isinstance(teile, list) or not teile:
            errors.append(f"{label}: teile muss eine nicht-leere Liste sein")
            teile = []
        gueltige_teile = []
        for t in teile:
            if t not in valid_teil_ids:
                errors.append(f"{label}: teil '{t}' nicht in index.json bekannt")
            else:
                gueltige_teile.append(t)

        block = f["block"]
        if gueltige_teile and not any(block in bloecke_by_teil[t] for t in gueltige_teile):
            errors.append(f"{label}: block '{block}' ist in keinem der Teile {gueltige_teile} definiert")

        modul = f["modul"]
        if modul not in valid_module_slugs:
            errors.append(f"{label}: modul '{modul}' nicht in data/manifest.json bekannt")

        schwierigkeit = f["schwierigkeit"]
        if schwierigkeit not in SCHWIERIGKEITEN:
            errors.append(f"{label}: schwierigkeit '{schwierigkeit}' nicht in {sorted(SCHWIERIGKEITEN)}")

        if typ == "mc":
            optionen = f.get("optionen")
            antwort = f.get("antwort")
            if not isinstance(optionen, list) or len(optionen) != 4:
                errors.append(f"{label}: mc braucht genau 4 optionen")
            if not isinstance(antwort, int) or isinstance(antwort, bool) or not (0 <= antwort <= 3):
                errors.append(f"{label}: antwort muss ein int 0-3 sein")
        elif typ == "num":
            for feld in ("einheit", "loesung", "toleranz"):
                if feld not in f:
                    errors.append(f"{label}: num braucht Feld '{feld}'")
            if "loesung" in f and not isinstance(f["loesung"], (int, float)):
                errors.append(f"{label}: loesung muss numerisch sein")
        elif typ == "order":
            optionen = f.get("optionen")
            if not isinstance(optionen, list) or len(optionen) < 2:
                errors.append(f"{label}: order braucht mindestens 2 optionen (Reihenfolge)")

    # ------------------------------------------------------------ Statistik
    typ_counts = {}
    block_counts = {}
    antwort_counts = {0: 0, 1: 0, 2: 0, 3: 0}
    laengste_treffer = 0
    mc_total = 0

    for f, _ in fragen:
        typ = f.get("typ")
        typ_counts[typ] = typ_counts.get(typ, 0) + 1
        block = f.get("block")
        if block:
            block_counts[block] = block_counts.get(block, 0) + 1
        if typ == "mc":
            optionen = f.get("optionen")
            antwort = f.get("antwort")
            if isinstance(optionen, list) and len(optionen) == 4 and isinstance(antwort, int) and 0 <= antwort <= 3:
                mc_total += 1
                antwort_counts[antwort] += 1
                laengen = [len(o) for o in optionen]
                if laengen[antwort] == max(laengen):
                    laengste_treffer += 1

    print(f"Statistik ueber {len(fragen)} Fragen aus {len(pool_files)} Pool-Datei(en):\n")
    print("Typ-Verteilung:")
    for typ in sorted(typ_counts):
        print(f"  {typ}: {typ_counts[typ]}")

    print("\nFragen je Block:")
    for block in sorted(block_counts):
        print(f"  {block}: {block_counts[block]}")

    if mc_total:
        print(f"\nAntwort-Index-Verteilung ({mc_total} mc-Fragen):")
        for idx in range(4):
            print(f"  {idx}: {antwort_counts[idx]}")
        anteil = round(100 * laengste_treffer / mc_total, 1)
        print(f"\nRichtige Antwort ist (mit-)laengste Option: {laengste_treffer} / {mc_total} ({anteil} %)")

    print()
    if errors:
        print(f"{len(errors)} Problem(e) gefunden:\n")
        for e in errors:
            print(f"  - {e}")
        return 1

    print("OK — keine Schema-Probleme gefunden.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
