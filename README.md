# Sustable Website

Statische Website (eine Datei `index.html` + Bilder im Ordner `assets/`). Keine Build-Tools, kein Framework – läuft direkt im Browser.

## Inhalt
```
sustable-website/
├── index.html        # die komplette Seite (alle Unterseiten in einem)
└── assets/
    ├── logo.png
    ├── hero-v5.png   # Hero-Hintergrundbild
    └── app-screen.png
```

## Auf GitHub hochladen
Den **kompletten Ordner `sustable-website`** (oder seinen Inhalt) in dein GitHub-Repository legen und committen/pushen.

## Mit Vercel veröffentlichen
1. Auf [vercel.com](https://vercel.com) einloggen → **Add New… → Project**.
2. Das GitHub-Repository auswählen und importieren.
3. Falls `index.html` **nicht** im Repo-Root liegt, sondern im Unterordner `sustable-website`:
   bei **Root Directory** auf *Edit* klicken und `sustable-website` auswählen.
4. Framework Preset bleibt auf **Other** (kein Build nötig). **Deploy** klicken – fertig.

> Tipp: Liegt `index.html` direkt im Repo-Root, ist Schritt 3 nicht nötig.

## Hinweise
- Produktbilder, Blog-Bilder und das Fertigungs-Video werden von `sustable.eu` geladen (online).
- Die Kartenbibliothek (MapLibre) und die Schrift (Montserrat) kommen per CDN.
- Warenkorb/Checkout sind ein Demo-Shop (lokal im Browser, keine echte Bestellung).
