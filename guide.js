/* ============================================================
   Sustable – Avatar-Guide (Louis & Nils)
   Poppt pro Abschnitt automatisch auf (an [data-gd]-Markern).
   × klappt dauerhaft ein -> Launcher-Knopf klappt wieder aus.
   Progressive Enhancement, prefers-reduced-motion-freundlich.
   ============================================================ */
(function(){
"use strict";
var AV = {
  louis: { img:"/assets/avatar-louis.png", name:"Louis" },
  nils:  { img:"/assets/avatar-nils.png",  name:"Nils" }
};
var DEFAULT_MSG = { who:"louis", text:"Fragen? Wir – Louis & Nils – sind jederzeit für dich da." };
var STORE = "sustable_guide_collapsed";

function ready(fn){ if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",fn); else fn(); }

ready(function(){
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var collapsed = false; try { collapsed = !!localStorage.getItem(STORE); } catch(e){}

  // ---- Widget ----
  var el = document.createElement("div");
  el.className = "guide";
  el.innerHTML =
    '<img class="guide-av" alt="" width="62" height="62">' +
    '<div class="guide-bubble"><button class="guide-x" aria-label="Guide einklappen" title="Einklappen">×</button>' +
    '<div class="guide-name mono"></div><div class="guide-text"></div></div>';
  document.body.appendChild(el);
  var avEl = el.querySelector(".guide-av");
  var nameEl = el.querySelector(".guide-name");
  var textEl = el.querySelector(".guide-text");

  // ---- Launcher (Wieder-Ausklappen) ----
  var launcher = document.createElement("button");
  launcher.className = "guide-launcher";
  launcher.setAttribute("aria-label","Guide von Louis & Nils öffnen");
  launcher.setAttribute("title","Louis & Nils einblenden");
  launcher.innerHTML = '<img src="'+AV.louis.img+'" alt=""><span class="guide-launcher-dot"></span>';
  launcher.hidden = true;
  document.body.appendChild(launcher);

  var lastEl = null, hasMsg = false;

  function setMessage(who, text){
    var a = AV[who] || AV.louis;
    avEl.src = a.img; nameEl.textContent = a.name; textEl.textContent = text;
    hasMsg = true;
    if (!collapsed){
      el.classList.remove("show"); void el.offsetWidth; el.classList.add("show");
    }
  }
  function reveal(node){
    if (!node || node === lastEl) return;
    lastEl = node;
    setMessage(node.getAttribute("data-gd-who"), node.getAttribute("data-gd"));
  }
  function collapse(){
    collapsed = true;
    try { localStorage.setItem(STORE,"1"); } catch(e){}
    el.classList.remove("show");
    launcher.hidden = false;
  }
  function expand(){
    collapsed = false;
    try { localStorage.removeItem(STORE); } catch(e){}
    launcher.hidden = true;
    if (!hasMsg){ setMessage(DEFAULT_MSG.who, "Da bin ich wieder! Scroll einfach weiter – ich meld mich zu jedem Bereich."); }
    else { el.classList.remove("show"); void el.offsetWidth; el.classList.add("show"); }
  }
  el.querySelector(".guide-x").addEventListener("click", function(ev){ ev.stopPropagation(); collapse(); });
  launcher.addEventListener("click", expand);

  if (collapsed) launcher.hidden = false;

  // ---- Abschnitts-Trigger ----
  var anchors = Array.prototype.slice.call(document.querySelectorAll("[data-gd]"));
  if (anchors.length && "IntersectionObserver" in window){
    var io = new IntersectionObserver(function(entries){
      // sichtbarsten Marker im mittleren Band wählen
      var best=null;
      for (var i=0;i<entries.length;i++){ if (entries[i].isIntersecting){ best = entries[i].target; break; } }
      if (best) reveal(best);
    }, { rootMargin: "-42% 0px -42% 0px", threshold: 0 });
    anchors.forEach(function(a){ io.observe(a); });
    // Begrüßung: ersten Marker nach kurzer Verzögerung zeigen
    setTimeout(function(){ if(!hasMsg && !collapsed) reveal(anchors[0]); }, reduce?300:1100);
  } else {
    // Seiten ohne Marker (Warenkorb/Kasse/Recht): ein freundlicher Default
    setTimeout(function(){ if(!collapsed) setMessage(DEFAULT_MSG.who, DEFAULT_MSG.text); }, reduce?300:1200);
  }
});
})();
