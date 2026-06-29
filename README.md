# Sustable Website (Multi-Page, SEO-optimiert)

Statische **Multi-Page**-Website: jede Route ist eine echte HTML-Datei mit eigenem
`<title>`, Meta-Description, Canonical, Open Graph/Twitter und JSON-LD. Kein Build-Schritt
nötig – einfach hochladen und auf Vercel deployen.

## Struktur (Deploy-fertig)
```
sustable-website/
├── index.html                  # Startseite (/)
├── produkt/<slug>/index.html   # 3 Produktseiten
├── solartisch/index.html       # Ratgeber „Was ist ein Solartisch?"
├── mehr-erfahren/ faq/ blog/ blog/<slug>/ ueber-uns/ business/ haendlersuche/ shop/
├── warenkorb/ checkout/        # noindex (Demo-Shop)
├── impressum/ datenschutz/ agb/ widerrufsbelehrung/   # noindex – Inhalt einpflegen!
├── assets/                     # logo, hero, app-screen
├── styles.css                  # gemeinsames CSS
├── app.js                      # Client-Interaktivität (Cart, Rechner, Karte, Menü)
├── robots.txt
├── sitemap.xml
└── vercel.json                 # cleanUrls + trailingSlash
```

## Deploy auf Vercel
1. Den Ordner-Inhalt ins GitHub-Repo legen (idealerweise `index.html` im Repo-Root –
   sonst bei Vercel **Root Directory** = `sustable-website` setzen).
2. Vercel-Projekt importieren, Framework-Preset **Other**, **kein** Build-Command. Deploy.

## Wichtig: Domain (`SITE_URL`)
Alle Canonicals, OG-URLs und die Sitemap nutzen `https://sustable.eu`. Läuft die Seite
zunächst unter einer anderen Domain (z. B. `*.vercel.app`), vor dem Indexieren die Domain
anpassen: in `seo-build/templates.js` die Konstante `SITE_URL` ändern und neu generieren.

## Seiten neu generieren (optional, nur bei Inhaltsänderungen)
Quellen liegen in `../seo-build/`. Generieren ohne Node (nutzt macOS JavaScriptCore):
```
python3 seo-build/write.py
```
Datenpflege:
- Texte/Produkte/FAQ/Blog: `seo-build/templates.js`
- Seiten-Layouts: `seo-build/pages.js`
- Routen/Titles/Descriptions/JSON-LD: `seo-build/generate.js`
- Wird eine Route ergänzt: dieselbe Liste erzeugt automatisch die `sitemap.xml`.
Die Client-Logik (`app.js`) und das `styles.css` liegen direkt im Deploy-Ordner.

## Offene Punkte
- **OG-Bild:** aktuell `hero-v5.png`. Für Social-Sharing ein dediziertes 1200×630-Bild
  unter `assets/` ablegen und `DEFAULT_OG_IMAGE` in `templates.js` setzen.
- **Rechtstexte:** Impressum/Datenschutz/AGB/Widerruf sind Platzhalter (noindex) und
  verlinken vorerst auf die aktuelle Fassung – verbindlichen Text einpflegen.
- **Go-Live-Redirects:** Entwurf in `seo-build/redirects.draft.json` – erst beim
  Domain-Umzug in `vercel.json` (`"redirects"`) übernehmen.
