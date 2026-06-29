/* ============================================================
   Generator-Treiber (jsc). Gibt alle Dateien als Blöcke aus:
   @@@FILE:<pfad>@@@ ... @@@END@@@
   write.py schreibt sie nach sustable-website/.
   ============================================================ */

function bc(items){ return ldBreadcrumb(items); }
function ldArticle(post){
  return { "@context":"https://schema.org","@type":"BlogPosting","headline":post.title,
    "image":[post.img],"datePublished":post.dateIso,"dateModified":post.dateIso,
    "author":{"@type":"Organization","name":SITE_NAME},
    "publisher":{"@type":"Organization","name":SITE_NAME,"logo":{"@type":"ImageObject","url":SITE_URL+"/assets/logo.png"}},
    "mainEntityOfPage":SITE_URL+"/blog/"+post.id+"/","description":post.excerpt };
}

var routes = [];

/* Home */
routes.push({ out:'index.html', page:'home',
  title:'Solartisch mit Photovoltaik – Sustable ONE | Solarmöbel',
  description:'Der Solartisch, der deine Stromabrechnung kürzt. Eleganter Gartentisch mit integriertem 465-Wp-Solarmodul – Plug & Play, made im Allgäu. Jetzt entdecken.',
  path:'/', body: pageHome(), jsonld:[ldOrganization(), ldWebSite()] });

/* Produkte */
var prodSeo = {
  'one-plus': { title:'Solartisch Sustable ONE+ Edelstahl – 465 Wp | Sustable', description:'Premium-Solartisch aus gebürstetem Edelstahl mit 465-Wp-Modul & 500-W-Wechselrichter. Plug & Play, mobil & kippbar, 10 Jahre Garantie. 1.750 €.' },
  'one': { title:'Solartisch Sustable ONE Aluminium – 465 Wp | Sustable', description:'Solartisch mit Aluminiumrahmen in Anthrazit und 465-Wp-Modul. Leicht, wetterfest, Plug & Play, 10 Jahre Garantie. Ab 1.490 €.' },
  'mini': { title:'Solartisch Sustable mini – 315 Wp kompakt | Sustable', description:'Kompakter Solartisch mit 315-Wp-Modul – ideal für Balkon und kleine Terrassen. Plug & Play, Made in Germany. 1.190 €.' }
};
for (var pi=0; pi<PRODUCTS.length; pi++){
  var p = PRODUCTS[pi];
  routes.push({ out:'produkt/'+p.slug+'/index.html', page:'produkt',
    title: prodSeo[p.id].title, description: prodSeo[p.id].description, path: productPath(p), image: p.img, type:'product',
    body: pageProdukt(p),
    jsonld:[ ldProduct(p), bc([{name:'Start',path:'/'},{name:'Shop',path:'/shop/'},{name:p.name,path:productPath(p)}]) ] });
}

/* Solartisch-Ratgeber */
routes.push({ out:'solartisch/index.html', page:'solartisch',
  title:'Was ist ein Solartisch? Funktion, Ertrag & Kosten | Sustable',
  description:'Ein Solartisch erzeugt Strom direkt auf deiner Terrasse. Wie er funktioniert, was er bringt, was er kostet und worauf du achten musst – der komplette Überblick.',
  path:'/solartisch/', body: pageSolartisch(),
  jsonld:[ bc([{name:'Start',path:'/'},{name:'Solartisch',path:'/solartisch/'}]) ] });

/* Mehr erfahren */
routes.push({ out:'mehr-erfahren/index.html', page:'mehr',
  title:'Sustable ONE im Detail – Funktion, App & Technik',
  description:'Alle Funktionen des Sustable Solartischs: Stromerzeugung, App-Monitoring, Mobilität und die Technik dahinter.',
  path:'/mehr-erfahren/', body: pageMehr(),
  jsonld:[ bc([{name:'Start',path:'/'},{name:'Mehr erfahren',path:'/mehr-erfahren/'}]) ] });

/* FAQ */
routes.push({ out:'faq/index.html', page:'faq',
  title:'Häufige Fragen zum Solartisch | Sustable',
  description:'Antworten rund um den Sustable Solartisch: Anmeldung, Einspeisung, Ertrag, Wetterfestigkeit, Lieferung und Garantie.',
  path:'/faq/', body: pageFaq(), jsonld:[ ldFaq() ] });

/* Blog-Index */
routes.push({ out:'blog/index.html', page:'blog',
  title:'Solartisch-Magazin: Wissen rund um Solarmöbel | Sustable',
  description:'Ratgeber und Hintergründe zu Solartischen, Micro-PV und nachhaltiger Energie für Garten, Terrasse und Balkon.',
  path:'/blog/', body: pageBlogIndex() });

/* Blog-Beiträge */
for (var bi=0; bi<BLOG_POSTS.length; bi++){
  var post = BLOG_POSTS[bi];
  routes.push({ out:'blog/'+post.id+'/index.html', page:'blog',
    title: post.title + ' | Sustable Blog', description: post.excerpt, path:'/blog/'+post.id+'/',
    image: post.img, type:'article', body: pageBlogPost(post),
    jsonld:[ ldArticle(post), bc([{name:'Start',path:'/'},{name:'Blog',path:'/blog/'},{name:post.title,path:'/blog/'+post.id+'/'}]) ] });
}

/* Über uns */
routes.push({ out:'ueber-uns/index.html', page:'about',
  title:'Über Sustable – Solartische aus dem Allgäu',
  description:'Sustable verbindet Design, Nachhaltigkeit und Technik. Lerne unsere Geschichte und die regionale Fertigung im Allgäu kennen.',
  path:'/ueber-uns/', body: pageAbout(),
  jsonld:[ bc([{name:'Start',path:'/'},{name:'Über uns',path:'/ueber-uns/'}]) ] });

/* Business */
routes.push({ out:'business/index.html', page:'business',
  title:'Solartische für Unternehmen & Gastronomie | Sustable Business',
  description:'Energieautarke Premium-Outdoor-Möbel für Hotels, Gastronomie und Objektplanung. Sustable für Geschäftskunden.',
  path:'/business/', body: pageBusiness(),
  jsonld:[ bc([{name:'Start',path:'/'},{name:'Business',path:'/business/'}]) ] });

/* Händlersuche (maplibre nur hier) */
routes.push({ out:'haendlersuche/index.html', page:'haendler',
  title:'Sustable Händler in deiner Nähe – Solartisch live erleben',
  description:'Erlebe den Sustable ONE+ live bei unseren Fachhändlern in Koblenz und Memmingen. Finde einen Händler in deiner Nähe.',
  path:'/haendlersuche/', body: pageHaendler(), maplibre:true,
  jsonld:[ bc([{name:'Start',path:'/'},{name:'Händlersuche',path:'/haendlersuche/'}]) ] });

/* Shop */
routes.push({ out:'shop/index.html', page:'shop',
  title:'Solartische kaufen – Sustable Shop | Made in Germany',
  description:'Alle Sustable Solartische im Überblick: ONE+, ONE und mini. Plug & Play, 10 Jahre Garantie, Versand in Deutschland.',
  path:'/shop/', body: pageShop(),
  jsonld:[ bc([{name:'Start',path:'/'},{name:'Shop',path:'/shop/'}]) ] });

/* Warenkorb / Checkout (noindex) */
routes.push({ out:'warenkorb/index.html', page:'warenkorb', title:'Warenkorb | Sustable', description:'Dein Warenkorb bei Sustable.', path:'/warenkorb/', body: pageCart(), noindex:true });
routes.push({ out:'checkout/index.html', page:'checkout', title:'Kasse | Sustable', description:'Kasse bei Sustable.', path:'/checkout/', body: pageCheckout(), noindex:true });

/* Rechtstexte (noindex, Platzhalter) */
routes.push({ out:'impressum/index.html', page:'legal', title:'Impressum | Sustable', description:'Impressum von Sustable.', path:'/impressum/', body: pageLegal('Impressum','https://sustable.eu/impressum/'), noindex:true });
routes.push({ out:'datenschutz/index.html', page:'legal', title:'Datenschutzerklärung | Sustable', description:'Datenschutzerklärung von Sustable.', path:'/datenschutz/', body: pageLegal('Datenschutzerklärung','https://sustable.eu/datenschutzerklaerung/'), noindex:true });
routes.push({ out:'agb/index.html', page:'legal', title:'AGB | Sustable', description:'Allgemeine Geschäftsbedingungen von Sustable.', path:'/agb/', body: pageLegal('AGB','https://sustable.eu/agb/'), noindex:true });
routes.push({ out:'widerrufsbelehrung/index.html', page:'legal', title:'Widerrufsbelehrung | Sustable', description:'Widerrufsbelehrung von Sustable.', path:'/widerrufsbelehrung/', body: pageLegal('Widerrufsbelehrung','https://sustable.eu/widerrufsbelehrung/'), noindex:true });

/* ---- Ausgabe der HTML-Dateien ---- */
for (var i=0; i<routes.length; i++){
  var r = routes[i];
  var html = doc({ page:r.page, title:r.title, description:r.description, path:r.path, image:r.image, type:r.type, jsonld:r.jsonld, maplibre:r.maplibre, noindex:r.noindex }, r.body);
  print('@@@FILE:'+r.out+'@@@');
  print(html);
  print('@@@END@@@');
}

/* ---- sitemap.xml (nur indexierbare Seiten) ---- */
var today = (typeof BUILD_DATE !== 'undefined') ? BUILD_DATE : '2026-06-17';
var sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
for (var j=0; j<routes.length; j++){
  if (routes[j].noindex) continue;
  var pth = routes[j].path;
  var prio = (pth === '/') ? '1.0' : (pth.indexOf('/produkt/')===0 ? '0.9' : '0.7');
  sm += '  <url>\n    <loc>'+SITE_URL+pth+'</loc>\n    <lastmod>'+today+'</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>'+prio+'</priority>\n  </url>\n';
}
sm += '</urlset>\n';
print('@@@FILE:sitemap.xml@@@');
print(sm);
print('@@@END@@@');

/* ---- robots.txt ---- */
var robots = 'User-agent: *\nAllow: /\n\nDisallow: /warenkorb/\nDisallow: /checkout/\n\nSitemap: '+SITE_URL+'/sitemap.xml\n';
print('@@@FILE:robots.txt@@@');
print(robots);
print('@@@END@@@');
