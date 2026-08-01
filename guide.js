/* ============================================================
   Sustable – Avatar-Guide
   Louis & Nils begleiten Besucher beim Scrollen durch die Seite.
   Progressive Enhancement, sessionweit abschaltbar (×).
   ============================================================ */
(function(){
"use strict";

var AV = {
  louis: { img:"/assets/avatar-louis.png", name:"Louis" },
  nils:  { img:"/assets/avatar-nils.png",  name:"Nils" }
};

var MESSAGES = {
  home: [
    { who:"nils",  text:"Hey, ich bin Nils – Mitgründer von Sustable. Schön, dass du da bist! Ich zeig dir kurz alles. 👋" },
    { who:"louis", text:"Und ich bin Louis. Unsere Idee: ein Gartentisch, der ganz nebenbei deinen Strom macht." },
    { who:"nils",  text:"Mit dem Rechner oben siehst du in 10 Sekunden, was du pro Jahr sparst." },
    { who:"louis", text:"Warum wir das machen? Das erzählen wir dir gleich weiter unten in unserer Geschichte." },
    { who:"nils",  text:"Unser ONE+ ist aus gebürstetem Edelstahl – Plug & Play, in 5 Minuten startklar." },
    { who:"louis", text:"Neugierig? Weiter unten findest du Händler in deiner Nähe zum Live-Erleben." }
  ],
  produkt: [
    { who:"louis", text:"Das ist unser Flaggschiff. 465 Wp Solarleistung – direkt in der Tischplatte." },
    { who:"nils",  text:"Der Wechselrichter ist schon drin: einfach in die Außensteckdose stecken, fertig." },
    { who:"louis", text:"Dank versenkbarer Rollen schiebst du ihn ganz allein in die Sonne." },
    { who:"nils",  text:"10 Jahre Garantie, Made in Germany – dafür stehen wir mit unserem Namen." }
  ],
  shop: [
    { who:"nils",  text:"Drei Modelle: der ONE+, der ONE und der kompakte mini für den Balkon." },
    { who:"louis", text:"Nicht sicher, welches passt? Der Rechner auf der Startseite hilft dir weiter." }
  ],
  faq: [
    { who:"louis", text:"Hier haben wir die häufigsten Fragen gesammelt – klick dich einfach durch." },
    { who:"nils",  text:"Deine Frage ist nicht dabei? Schreib uns, wir antworten meist am selben Tag." }
  ],
  haendler: [
    { who:"nils",  text:"Gib deine Stadt oder PLZ ein – wir zeigen dir den nächsten Händler auf der Karte." },
    { who:"louis", text:"Unser Tipp: den Tisch einmal live sehen, bevor du dich entscheidest." }
  ],
  business: [
    { who:"louis", text:"Du bist Händler oder planst Objekte? Dann bist du hier genau richtig." },
    { who:"nils",  text:"Buch dir einfach einen Termin – wir melden uns innerhalb von 24 Stunden." }
  ],
  about: [
    { who:"nils",  text:"Angefangen haben wir zu zweit, im Allgäu, mit einer ganz einfachen Frage." },
    { who:"louis", text:"Warum steht ein Gartentisch den ganzen Tag ungenutzt in der Sonne herum?" },
    { who:"nils",  text:"Heute machen wir daraus saubere Energie – für jeden, ganz ohne eigenes Dach." }
  ],
  mehr: [
    { who:"louis", text:"Hier gehen wir tiefer: Technik, Wetterfestigkeit, Standort – alles erklärt." },
    { who:"nils",  text:"Kurz gesagt: robust, pflegeleicht und für den Dauereinsatz draußen gemacht." }
  ],
  blog: [
    { who:"nils",  text:"Unser Magazin: Wissen rund um Solartische und die Energiewende." },
    { who:"louis", text:"Viel Spaß beim Stöbern – schau gern öfter mal vorbei." }
  ],
  solartisch: [
    { who:"louis", text:"Kurz erklärt: Ein Solartisch ist ein Gartentisch mit eingebautem Solarmodul." },
    { who:"nils",  text:"Er speist den Strom per Steckdose direkt in dein Hausnetz ein – wie ein Balkonkraftwerk." }
  ],
  "default": [
    { who:"louis", text:"Fragen? Wir – Louis & Nils – sind per Mail direkt für dich da." }
  ]
};

function ready(fn){ if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",fn); else fn(); }

ready(function(){
  try { if (sessionStorage.getItem("sustable_guide_off")) return; } catch(e){}
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var page = (document.body.getAttribute("data-page")||"default");
  var msgs = MESSAGES[page] || MESSAGES["default"];
  if (!msgs || !msgs.length) return;

  // Widget bauen
  var el = document.createElement("div");
  el.className = "guide";
  el.innerHTML =
    '<img class="guide-av" alt="" width="62" height="62">' +
    '<div class="guide-bubble"><button class="guide-x" aria-label="Guide schließen">×</button>' +
    '<div class="guide-name mono"></div><div class="guide-text"></div>' +
    '<div class="guide-hint mono">Tippen für mehr</div></div>';
  document.body.appendChild(el);
  var avEl   = el.querySelector(".guide-av");
  var nameEl = el.querySelector(".guide-name");
  var textEl = el.querySelector(".guide-text");
  var hintEl = el.querySelector(".guide-hint");

  var shown = -1;

  function reveal(idx){
    if (idx <= shown || idx >= msgs.length) return;
    shown = idx;
    var m = msgs[idx], a = AV[m.who];
    avEl.src = a.img;
    nameEl.textContent = a.name;
    textEl.textContent = m.text;
    hintEl.style.display = (idx < msgs.length-1) ? "" : "none";
    el.classList.remove("show");           // Re-Trigger der Animation
    // Reflow erzwingen
    void el.offsetWidth;
    el.classList.add("show");
  }
  function close(){
    el.classList.remove("show");
    try { sessionStorage.setItem("sustable_guide_off","1"); } catch(e){}
    setTimeout(function(){ if(el.parentNode) el.parentNode.removeChild(el); }, 400);
  }

  el.querySelector(".guide-x").addEventListener("click", function(ev){ ev.stopPropagation(); close(); });
  // Avatar/Blase antippen -> nächste Nachricht (oder schließen am Ende)
  el.addEventListener("click", function(){ if (shown >= msgs.length-1) close(); else reveal(shown+1); });

  // Scroll-gesteuerte Schwellen
  var thresholds = msgs.map(function(_,k){ return msgs.length===1 ? 0 : 0.85*(k/(msgs.length-1)); });
  function frac(){
    var h=document.documentElement;
    var max=(h.scrollHeight - h.clientHeight);
    if (max<=0) return 1;                    // nicht scrollbar -> alles „sichtbar“
    return Math.min(1, Math.max(0, (h.scrollTop||window.pageYOffset||0)/max));
  }
  var ticking=false;
  function onScroll(){
    if (ticking) return; ticking=true;
    requestAnimationFrame(function(){
      ticking=false;
      var f=frac(), target=0;
      for (var k=0;k<thresholds.length;k++){ if (f>=thresholds[k]) target=k; }
      if (target>shown) reveal(target);
    });
  }
  window.addEventListener("scroll", onScroll, {passive:true});
  window.addEventListener("resize", onScroll);

  // Erste Nachricht mit kleiner Verzögerung (freundlicher Einstieg)
  setTimeout(function(){ reveal(0); onScroll(); }, reduce ? 300 : 1100);
});
})();
