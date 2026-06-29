#!/usr/bin/env python3
import os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, ".."))
JSC = "/System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc"

def main():
    if not os.path.exists(JSC):
        print("jsc nicht gefunden:", JSC); sys.exit(1)
    proc = subprocess.run([JSC, "templates.js", "pages.js", "generate.js"],
                          cwd=HERE, capture_output=True, text=True)
    if proc.returncode != 0:
        print("jsc Fehler:\n", proc.stderr or proc.stdout); sys.exit(1)
    out = proc.stdout
    blocks = re.findall(r"@@@FILE:(.*?)@@@\n(.*?)\n@@@END@@@", out, re.S)
    if not blocks:
        print("Keine Dateien erzeugt. jsc-Ausgabe:\n", out[:2000]); sys.exit(1)
    count = 0
    for relpath, content in blocks:
        relpath = relpath.strip()
        dest = os.path.join(ROOT, relpath)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        with open(dest, "w", encoding="utf-8") as f:
            f.write(content)
        count += 1
        print(" geschrieben:", relpath, "(", len(content), "Bytes )")
    print("\nFertig:", count, "Dateien nach", ROOT)

if __name__ == "__main__":
    main()
