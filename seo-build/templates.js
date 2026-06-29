/* ============================================================
   Sustable – Multi-Page Generator: Daten, SEO, Templates
   Reines JS (läuft unter JavaScriptCore). Keine Node-Imports.
   ============================================================ */

/* ---------------- SEO-Konfiguration (zentrale Quelle) ---------------- */
var SITE_URL = "https://sustable.eu";            // nach Go-Live ggf. anpassen
var SITE_NAME = "Sustable";
var DEFAULT_OG_IMAGE = SITE_URL + "/assets/hero-v5.png"; // TODO: dediziertes 1200x630 OG-Bild anlegen

/* ---------------- Produkte ---------------- */
var PRODUCTS = [
  { id:'one-plus', slug:'solartisch-sustable-one-edelstahl', name:'Sustable ONE+ Edelstahl', fullName:'Solartisch Sustable ONE+ Edelstahl', shortLabel:'ONE+', price:1750, wp:465, kwp:0.465, material:'Edelstahl, gebürstet', masse:'172 × 115 × 75 cm', img:'https://sustable.eu/wp-content/uploads/2025/10/One_1.avif', badge:'465 Wp · Edelstahl', tagline:'Das Flaggschiff aus gebürstetem Edelstahl.', desc:'Eleganter Solartisch aus gebürstetem Edelstahl mit 465 Wp-Solarmodul und 500 W-Wechselrichter – für Balkon, Terrasse oder Garten.' },
  { id:'one', slug:'solartisch-sustable-one-aluminium', name:'Sustable ONE Aluminium', fullName:'Solartisch Sustable ONE Aluminium', shortLabel:'ONE', price:1490, wp:465, kwp:0.465, material:'Aluminium, anthrazit', masse:'172 × 115 × 75 cm', img:'https://sustable.eu/wp-content/uploads/2025/10/One_7.avif', badge:'465 Wp · Aluminium', tagline:'Gleiche Leistung, leichter Aluminiumrahmen.', desc:'Solartisch mit pulverbeschichtetem Aluminiumrahmen in Anthrazit und 465 Wp-Solarmodul – leichter und besonders wetterbeständig.' },
  { id:'mini', slug:'solartisch-sustable-mini', name:'Sustable mini', fullName:'Solartisch Sustable mini', shortLabel:'mini', price:1190, wp:315, kwp:0.315, material:'Aluminium, anthrazit', masse:'140 × 80 × 75 cm', img:'https://sustable.eu/wp-content/uploads/2025/10/One_6.avif', badge:'315 Wp · kompakt', tagline:'Kompakt für Balkon und kleine Terrassen.', desc:'Der kompakte Solartisch mit 315 Wp-Modul – ideal für Balkon und kleinere Terrassen, mit identischer Plug-&-Play-Technik.' }
];
function prod(id){ for (var i=0;i<PRODUCTS.length;i++){ if (PRODUCTS[i].id===id) return PRODUCTS[i]; } return PRODUCTS[0]; }
function productPath(p){ return '/produkt/' + p.slug + '/'; }

/* ---------------- Händler ---------------- */
var DEALERS = [
  { id:'creativ', name:'BÜRO-CREATIV GmbH', untertitel:'Fachhändler · Koblenz', strasse:'Schönbornsluster Straße 53', ort:'56070 Koblenz', tel:'+49 261 579780', telHref:'tel:+49261579780', mail:'info@buero-creativ.de', mailHref:'mailto:info@buero-creativ.de', zeiten1:null, zeiten2:null, lat:50.3878, lng:7.5789, routeHref:'https://www.google.com/maps/dir/?api=1&destination=Sch%C3%B6nbornsluster%20Stra%C3%9Fe%2053%2C%2056070%20Koblenz' },
  { id:'wassermann', name:'Möbel Wassermann', untertitel:'Interliving · Memmingen', strasse:'Mittereschweg 2', ort:'87700 Memmingen', tel:'+49 8331 97670', telHref:'tel:+49833197670', mail:'info@moebel-wassermann.de', mailHref:'mailto:info@moebel-wassermann.de', zeiten1:'Mo–Fr: 10:00–18:30 Uhr', zeiten2:'Sa: 09:00–18:00 Uhr', lat:47.9741, lng:10.1632, routeHref:'https://www.google.com/maps/dir/?api=1&destination=Mittereschweg%202%2C%2087700%20Memmingen' }
];

/* ---------------- FAQ ---------------- */
var FAQS = [
  { cat:'Allgemeine Fragen', items:[
    { k:'a1', q:'Was ist ein Solartisch?', a:'Ein Solartisch ist ein Tisch mit einer integrierten Solarzelle, die Sonnenenergie in Strom umwandelt. Unser Modell verfügt über eine leistungsstarke 470 W-Solarzelle und kann wie ein Balkonkraftwerk genutzt werden.' },
    { k:'a2', q:'Wie funktioniert der Solartisch?', a:'Die Solarzelle in der Tischplatte wandelt Sonnenlicht in Gleichstrom (DC) um. Ein integrierter Mikro-Wechselrichter konvertiert diesen in nutzbaren Wechselstrom (AC), der direkt ins Hausnetz eingespeist werden kann.' },
    { k:'a3', q:'Kann ich den Tisch als normales Möbelstück nutzen?', a:'Ja! Der Solartisch ist wetterfest, stabil und kann sowohl als Esstisch, Gartentisch oder Arbeitsplatz genutzt werden. Er ist robust und leicht zu reinigen.' }
  ]},
  { cat:'Technische Fragen', items:[
    { k:'t1', q:'Welche technischen Daten hat der Solartisch?', a:'Leistung: 470 W PV-Modul. Wechselrichter: 500 W Mikro-Wechselrichter integriert. Material: entspiegeltes, gehärtetes Glas mit Aluminiumrahmen. Wetterfestigkeit: IP65 (geeignet für den Außeneinsatz). Maße: 172 cm × 115 cm × 75 cm. Gewicht: ca. 50 kg.' },
    { k:'t2', q:'Wie viel Strom kann der Solartisch erzeugen?', a:'Bei guten Bedingungen kann der Tisch ca. 450–500 kWh pro Jahr erzeugen – genug, um mehr als einen Kühlschrank das ganze Jahr zu betreiben oder dein Smartphone über 100.000-mal aufzuladen.' },
    { k:'t3', q:'Brauche ich einen zusätzlichen Wechselrichter?', a:'Nein, der Tisch hat bereits einen integrierten 500 W Mikro-Wechselrichter. Er wird direkt per Steckdose ans Hausnetz angeschlossen.' }
  ]},
  { cat:'Installation & Nutzung', items:[
    { k:'i1', q:'Wie installiere ich den Solartisch?', a:'Die Installation ist denkbar einfach: 1. Den Tisch an einem sonnigen Platz aufstellen. 2. Die vier Füße am Rahmen und den Wechselrichter nach Anleitung montieren. 3. Mit der Steckdose verbinden – fertig!' },
    { k:'i2', q:'Muss der Solartisch genehmigt werden?', a:'In Deutschland sind Balkonkraftwerke bis 800 W ohne Genehmigung erlaubt. Unser 500 W-Solartisch liegt innerhalb dieser Grenze. Seit April 2024 ist nur noch eine einfache Anmeldung im Marktstammdatenregister erforderlich.' },
    { k:'i3', q:'Wo ist der beste Standort für den Tisch?', a:'Grundsätzlich überall, wo ihn die Sonne erreicht – am besten Balkon, Terrasse, Garten oder Dachterrasse. Direktes Sonnenlicht maximiert den Stromertrag. Dank der versteckten Rollen kann ihn eine einzige Person kinderleicht in eine andere Position bringen.' },
    { k:'i4', q:'Kann ich den Tisch auch im Innenbereich nutzen?', a:'Ja, aber der Stromertrag ist dann stark reduziert, da Fenster UV-Strahlung filtern. Es ist nicht zu empfehlen.' }
  ]},
  { cat:'Pflege & Langlebigkeit', items:[
    { k:'p1', q:'Wie reinige ich den Solartisch?', a:'Ein feuchtes Tuch mit Glasreiniger reicht aus. Kratzer werden durch das gehärtete Glas vermieden.' },
    { k:'p2', q:'Ist der Tisch wetterfest?', a:'Ja! Der Tisch ist nach IP44 zertifiziert und hält Regen, Schnee und Sonne problemlos stand.' },
    { k:'p3', q:'Wie lange hält das PV-Modul?', a:'Die Lebensdauer beträgt 25 Jahre und länger, wobei die Leistung nach 20 Jahren noch bei über ca. 90 % liegt.' }
  ]},
  { cat:'Kauf & Garantie', items:[
    { k:'k1', q:'Wie viel kostet der Solartisch?', a:'Sustable ONE (Aluminium Anthrazit): ab 1.490 €. Sustable ONE+ (Edelstahl gebürstet): 1.750 €. Sustable mini (kompakt): 1.190 €.' },
    { k:'k2', q:'Ist der Solartisch förderfähig und umsatzsteuerbefreit?', a:'Ja. Der Solartisch ist ein Tischkraftwerk und damit ein Kleinkraftwerk, das in den meisten deutschen Regionen förderfähig ist. Für die Lieferung von Solartischen mit integrierter Photovoltaikanlage unter 30 kWp zur Nutzung im häuslichen Umfeld gilt der Umsatzsteuersatz von 0 % gemäß § 12 Abs. 3 Nr. 1 UStG.' }
  ]}
];

/* ---------------- Blog ---------------- */
var BLOG_POSTS = [
  { id:'journey', date:'31. März 2026', dateIso:'2026-03-31', cat:'Unternehmen', title:'Solartische statt Gartentisch – Unsere Journey von Januar bis März bei Sustable', img:'https://sustable.eu/wp-content/uploads/2026/03/DSC04368-2048x1365.jpg', excerpt:'Die Energiewende findet zunehmend im eigenen Zuhause statt. Während Balkonkraftwerke immer beliebter werden, entsteht mit Solartischen eine neue Kategorie nachhaltiger Gartenmöbel.', body:[
    'Die Energiewende findet zunehmend im eigenen Zuhause statt. Während Balkonkraftwerke immer beliebter werden, entsteht mit Solartischen eine völlig neue Kategorie nachhaltiger Gartenmöbel: ein Tisch, der nicht nur schön aussieht, sondern gleichzeitig sauberen Strom erzeugt.',
    'Die ersten Monate des Jahres standen ganz im Zeichen der Serienreife. Aus zahlreichen Prototypen wurde ein Produkt, das sich sehen lassen kann – vom gebürsteten Edelstahlrahmen bis zum nahtlos integrierten Solarmodul.',
    'Besonders stolz sind wir auf die Fertigung: Unsere Solartische werden regional und fair produziert. Kurze Wege, faire Arbeitsbedingungen und hochwertige Materialien sind für uns kein Marketing, sondern gelebte Praxis.',
    'In den kommenden Monaten konzentrieren wir uns auf den Ausbau unseres Händlernetzes und den Launch der Sustable-App, mit der du den Ertrag deines Tischkraftwerks jederzeit im Blick hast. Es bleibt spannend – wir halten dich auf dem Laufenden.'
  ]},
  { id:'micro-pv', date:'2. September 2025', dateIso:'2025-09-02', cat:'Wissen', title:'Warum Micro-PV die Zukunft ist: kleine Solarkraftwerke für jedermann', img:'https://sustable.eu/wp-content/uploads/2025/10/One_6.avif', excerpt:'Die Zukunft der Energieversorgung wird nicht nur auf großen Dächern entschieden, sondern im Alltag jedes Einzelnen.', body:[
    'Die Zukunft der Energieversorgung wird nicht nur auf großen Dächern und in Solarparks entschieden, sondern im Alltag jedes Einzelnen. Micro-PV – also kleine, dezentrale Photovoltaik-Lösungen – macht Solarstrom für alle zugänglich.',
    'Der große Vorteil: Es braucht weder eine eigene Dachfläche noch eine aufwändige Installation. Ein Plug-&-Play-Gerät wird einfach in die Steckdose gesteckt und speist Strom direkt ins Hausnetz ein.',
    'Genau hier setzt der Sustable Solartisch an. Er verbindet die Idee des Balkonkraftwerks mit einem hochwertigen Möbelstück – und macht so aus ungenutzter Terrassen- oder Balkonfläche ein kleines Kraftwerk.',
    'Micro-PV ist damit mehr als ein Trend: Es ist ein wichtiger Baustein einer demokratischen Energiewende, an der sich jeder beteiligen kann.'
  ]},
  { id:'energiewende', date:'26. August 2025', dateIso:'2025-08-26', cat:'Wissen', title:'Energiewende für alle – so gelingt der Umstieg für jeden', img:'https://sustable.eu/wp-content/uploads/2026/01/DSC02941-min-2048x1365.jpg', excerpt:'Klimawandel, steigende Energiepreise und politische Abhängigkeiten machen deutlich: Die Energiewende ist ein Thema der Gegenwart.', body:[
    'Klimawandel, steigende Energiepreise und politische Abhängigkeiten machen deutlich: Die Energiewende ist kein Thema der fernen Zukunft, sondern der Gegenwart.',
    'Viele Menschen möchten ihren Beitrag leisten, scheitern aber an Hürden wie fehlendem Eigenheim, hohen Anschaffungskosten oder komplizierter Bürokratie. Dabei muss der Einstieg gar nicht schwer sein.',
    'Kleine, dezentrale Lösungen senken die Einstiegshürde drastisch. Wer mit einem Solartisch oder Balkonkraftwerk startet, spart sofort Stromkosten und gewinnt ein Stück Unabhängigkeit – ganz ohne Dachmontage.',
    'Unser Ziel bei Sustable ist es, die Energiewende so einfach und attraktiv wie möglich zu machen. Denn echte Veränderung entsteht, wenn viele mitmachen.'
  ]},
  { id:'balkon-garten', date:'6. August 2025', dateIso:'2025-08-06', cat:'Produkt', title:'Nachhaltige Energie für Balkon & Garten: Warum wir den Sustable Solartisch entwickelt haben', img:'https://sustable.eu/wp-content/uploads/2025/10/One_1.avif', excerpt:'Die Geschichte hinter dem Solartisch – und warum Balkon und Garten perfekte Orte für saubere Energie sind.', body:[
    'Alles begann mit einer einfachen Frage: Warum verschenken wir wertvolle Sonnenfläche auf Terrasse und Balkon, während Gartenmöbel dort ohnehin den ganzen Tag in der Sonne stehen?',
    'Aus dieser Idee entstand der Sustable Solartisch – ein Möbelstück, das die Funktion eines klassischen Gartentisches mit der Leistung eines Mini-Solarkraftwerks vereint.',
    'Bei der Entwicklung war uns wichtig, dass die Technik nicht den Komfort einschränkt: Der Tisch lässt sich ganz normal nutzen, ist wetterfest und dank versenkbarer Rollen flexibel platzierbar.',
    'Das Ergebnis ist ein Produkt, das Design, Nachhaltigkeit und Funktion vereint – und das die Energiewende auf die heimische Terrasse bringt.'
  ]}
];

/* ---------------- Helfer ---------------- */
function fmtEur(n, decimals){
  var d = decimals === undefined ? 0 : decimals;
  return n.toLocaleString('de-DE', { minimumFractionDigits:d, maximumFractionDigits:d }) + ' €';
}
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

/* ---------------- SVG / kleine Bausteine ---------------- */
var arrowW = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 8h11"></path><path d="M9 4l4 4-4 4"></path></svg>';
var arrowD = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#111113" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 8h11"></path><path d="M9 4l4 4-4 4"></path></svg>';
var check = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;" aria-hidden="true"><path d="M4 12l5 5 11-11"></path></svg>';

/* ---------------- JSON-LD ---------------- */
function ldOrganization(){
  return {
    "@context":"https://schema.org","@type":"Organization","name":SITE_NAME,"url":SITE_URL,
    "logo":SITE_URL+"/assets/logo.png",
    "sameAs":["https://www.instagram.com/sustable.eu/","https://www.linkedin.com/company/sustable-poweredbyecon"]
  };
}
function ldWebSite(){
  return { "@context":"https://schema.org","@type":"WebSite","name":SITE_NAME,"url":SITE_URL };
}
function ldProduct(p){
  return {
    "@context":"https://schema.org","@type":"Product","name":p.fullName,
    "image":[p.img],"description":p.desc,"brand":{"@type":"Brand","name":SITE_NAME},
    "category":"Solartisch","sku":p.id,
    "offers":{"@type":"Offer","price":String(p.price),"priceCurrency":"EUR","availability":"https://schema.org/InStock","url":SITE_URL+productPath(p)}
  };
}
function ldFaq(){
  var mainEntity = [];
  for (var g=0; g<FAQS.length; g++){
    for (var i=0; i<FAQS[g].items.length; i++){
      var it = FAQS[g].items[i];
      mainEntity.push({ "@type":"Question","name":it.q,"acceptedAnswer":{"@type":"Answer","text":it.a} });
    }
  }
  return { "@context":"https://schema.org","@type":"FAQPage","mainEntity":mainEntity };
}
function ldBreadcrumb(items){ // items: [{name,path}]
  var list = [];
  for (var i=0;i<items.length;i++){
    list.push({ "@type":"ListItem","position":i+1,"name":items[i].name,"item":SITE_URL+items[i].path });
  }
  return { "@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":list };
}

/* ---------------- <head> + Dokument-Wrapper ---------------- */
function head(o){
  var url = SITE_URL + o.path;
  var img = o.image || DEFAULT_OG_IMAGE;
  var type = o.type || "website";
  var s = '';
  s += '<meta charset="utf-8">\n';
  s += '<meta name="viewport" content="width=device-width, initial-scale=1">\n';
  s += '<title>' + esc(o.title) + '</title>\n';
  s += '<meta name="description" content="' + esc(o.description) + '">\n';
  s += '<link rel="canonical" href="' + url + '">\n';
  if (o.noindex) s += '<meta name="robots" content="noindex, follow">\n';
  s += '<meta property="og:type" content="' + type + '">\n';
  s += '<meta property="og:site_name" content="' + SITE_NAME + '">\n';
  s += '<meta property="og:locale" content="de_DE">\n';
  s += '<meta property="og:title" content="' + esc(o.title) + '">\n';
  s += '<meta property="og:description" content="' + esc(o.description) + '">\n';
  s += '<meta property="og:url" content="' + url + '">\n';
  s += '<meta property="og:image" content="' + img + '">\n';
  s += '<meta name="twitter:card" content="summary_large_image">\n';
  s += '<meta name="twitter:title" content="' + esc(o.title) + '">\n';
  s += '<meta name="twitter:description" content="' + esc(o.description) + '">\n';
  s += '<meta name="twitter:image" content="' + img + '">\n';
  s += '<link rel="icon" href="/assets/logo.png">\n';
  s += '<link rel="preconnect" href="https://fonts.googleapis.com">\n';
  s += '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">\n';
  s += '<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">\n';
  if (o.maplibre) s += '<link rel="stylesheet" href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css">\n';
  s += '<link rel="stylesheet" href="/styles.css">\n';
  var ld = o.jsonld || [];
  for (var i=0;i<ld.length;i++){
    s += '<script type="application/ld+json">' + JSON.stringify(ld[i]) + '</' + 'script>\n';
  }
  return s;
}

function doc(o, bodyHtml){
  var scripts = '';
  if (o.maplibre) scripts += '<script src="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"></' + 'script>\n';
  scripts += '<script src="/app.js" defer></' + 'script>\n';
  scripts += '<script src="/effects.js" defer></' + 'script>\n';
  return '<!DOCTYPE html>\n<html lang="de">\n<head>\n' + head(o) + '</head>\n'
    + '<body data-page="' + (o.page||'') + '" style="min-height:100vh; display:flex; flex-direction:column; background:#ffffff;">\n'
    + header(o.page) + '\n<main style="flex:1;">\n' + bodyHtml + '\n</main>\n'
    + toastRoot() + '\n' + footer() + '\n' + scripts + '</body>\n</html>\n';
}

function toastRoot(){ return '<div id="toast-root"></div>'; }

/* ---------------- Header ---------------- */
var NAV = [
  ['/ueber-uns/','Über uns','about'],
  ['/mehr-erfahren/','Mehr erfahren','mehr'],
  ['/blog/','Blog','blog'],
  ['/business/','Business','business'],
  ['/haendlersuche/','Händlersuche','haendler'],
  ['/faq/','FAQ','faq']
];
function header(active){
  var deskLinks = NAV.map(function(x){
    var cur = (x[2]===active) ? ' aria-current="page"' : '';
    return '<a href="'+x[0]+'"'+cur+' style="color:#1d1d1f; cursor:pointer;">'+x[1]+'</a>';
  }).join('');
  var mobLinks = NAV.concat([['/shop/','Shop','shop']]).map(function(x){
    return '<a href="'+x[0]+'" style="padding:15px 6px; font-size:16.5px; font-weight:600; color:#1d1d1f; border-bottom:1px solid #f0f0f2; cursor:pointer;">'+x[1]+'</a>';
  }).join('');
  return ''
  + '<header style="position:sticky; top:0; z-index:1000; background:rgba(255,255,255,0.88); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); border-bottom:1px solid #e8e8ed;">\n'
  + '  <div class="header-inner" style="max-width:1280px; margin:0 auto; padding:12px 32px; display:flex; align-items:center; gap:24px;">\n'
  + '    <a href="/" aria-label="Sustable Startseite" style="cursor:pointer; display:flex; align-items:center; flex-shrink:0;"><img src="/assets/logo.png" alt="Sustable Logo" width="120" height="36" style="height:36px; width:auto; display:block;"></a>\n'
  + '    <nav class="desktop-nav" aria-label="Hauptnavigation" style="flex:1; display:flex; align-items:center; justify-content:center; gap:32px; font-size:14.5px; font-weight:500;">'+deskLinks+'</nav>\n'
  + '    <div style="display:flex; align-items:center; gap:12px; flex-shrink:0; margin-left:auto;">\n'
  + '      <a href="/warenkorb/" aria-label="Warenkorb" style="cursor:pointer; display:flex; align-items:center; gap:9px; background:#f5f5f7; border-radius:980px; padding:9px 17px; color:#1d1d1f; font-weight:600; font-size:14px;">\n'
  + '        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9.5" cy="20" r="1.5"></circle><circle cx="17.5" cy="20" r="1.5"></circle><path d="M3 4h2l2.4 11h10.2L20 7H6.6"></path></svg>\n'
  + '        <span id="cart-count">0</span><span id="cart-total" class="cart-price" style="color:#86868b; font-weight:500;">'+fmtEur(0,2)+'</span>\n'
  + '      </a>\n'
  + '      <a href="/shop/" class="shop-btn" style="cursor:pointer; display:flex; align-items:center; gap:8px; background:#111113; color:#ffffff; border-radius:980px; padding:10px 22px; font-weight:600; font-size:14.5px;">Shop '+arrowW+'</a>\n'
  + '      <button id="menu-btn" class="menu-btn" aria-label="Menü öffnen" aria-expanded="false" style="cursor:pointer; align-items:center; justify-content:center; width:42px; height:42px; background:#f5f5f7; border:0; border-radius:12px; flex-shrink:0;">\n'
  + '        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"></path><path d="M3 12h18"></path><path d="M3 18h18"></path></svg>\n'
  + '      </button>\n'
  + '    </div>\n'
  + '  </div>\n'
  + '  <nav class="mobile-menu" aria-label="Mobile Navigation" style="flex-direction:column; padding:6px 18px 14px; background:rgba(255,255,255,0.98);">'+mobLinks+'</nav>\n'
  + '</header>';
}

/* ---------------- Footer ---------------- */
function footer(){
  return ''
  + '<footer style="background:#ffffff; border-top:1px solid #e8e8ed; padding:56px 32px 36px; position:relative; z-index:2;">\n'
  + '  <div style="max-width:1280px; margin:0 auto;">\n'
  + '    <div style="display:flex; justify-content:space-between; align-items:center; gap:24px; flex-wrap:wrap; margin-bottom:34px;">\n'
  + '      <div style="display:flex; align-items:center;"><img src="/assets/logo.png" alt="Sustable" width="107" height="32" style="height:32px; width:auto;"></div>\n'
  + '      <nav aria-label="Footer-Navigation" style="display:flex; gap:26px; font-size:13.5px; font-weight:500; flex-wrap:wrap;">\n'
  + '        <a href="/shop/" style="color:#424245;">Shop</a>\n'
  + '        <a href="/haendlersuche/" style="color:#424245;">Händlersuche</a>\n'
  + '        <a href="/business/" style="color:#424245;">Business</a>\n'
  + '        <a href="/blog/" style="color:#424245;">Blog</a>\n'
  + '        <a href="/faq/" style="color:#424245;">FAQ</a>\n'
  + '        <a href="/impressum/" style="color:#424245;">Impressum</a>\n'
  + '        <a href="/datenschutz/" style="color:#424245;">Datenschutz</a>\n'
  + '        <a href="/widerrufsbelehrung/" style="color:#424245;">Widerrufsbelehrung</a>\n'
  + '        <a href="/agb/" style="color:#424245;">AGB</a>\n'
  + '      </nav>\n'
  + '    </div>\n'
  + '    <div style="display:flex; justify-content:space-between; align-items:center; gap:20px; flex-wrap:wrap; border-top:1px solid #f0f0f2; padding-top:26px;">\n'
  + '      <div style="font-size:13px; color:#86868b;">© 2026 Sustable powered by e-con</div>\n'
  + '      <div style="display:flex; gap:18px; font-size:13px; font-weight:600;">\n'
  + '        <a href="https://www.linkedin.com/company/sustable-poweredbyecon" target="_blank" rel="noopener" style="color:#424245;">LinkedIn</a>\n'
  + '        <a href="https://www.instagram.com/sustable.eu/" target="_blank" rel="noopener" style="color:#424245;">Instagram</a>\n'
  + '      </div>\n'
  + '    </div>\n'
  + '  </div>\n'
  + '</footer>';
}

/* kleine Inhalts-Helfer */
function benefit(svg, title, text){
  return '<div style="background:#f5f5f7; border-radius:20px; padding:34px;"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:18px;" aria-hidden="true">'+svg+'</svg><h3 style="margin:0 0 8px; font-size:18px; font-weight:700; color:#1d1d1f;">'+title+'</h3><p style="margin:0; font-size:14.5px; line-height:1.65; color:#6e6e73;">'+text+'</p></div>';
}
function appRow(svg, title, text, last){
  var border = 'border-top:1px solid rgba(255,255,255,0.12);' + (last ? ' border-bottom:1px solid rgba(255,255,255,0.12);' : '');
  return '<div style="display:flex; align-items:center; gap:16px; padding:18px 0; '+border+'"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+svg+'</svg><div><div style="font-size:15px; font-weight:600; color:#ffffff;">'+title+'</div><div style="font-size:13.5px; color:#86868b;">'+text+'</div></div></div>';
}
function techRow(k,v){ return '<div style="padding:11px 0; border-bottom:1px solid #e8e8ed; color:#86868b;">'+k+'</div><div style="padding:11px 0; border-bottom:1px solid #e8e8ed; color:#1d1d1f; font-weight:600;">'+v+'</div>'; }

/* ===== Module weiter unten in pages.js ===== */
