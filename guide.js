/* ============================================================
   Sustable – Avatar-Guide (Louis & Nils)
   - Nachrichten poppen automatisch pro Abschnitt ([data-gd])
   - "Sprechen": Typewriter-Text + Kinn-Squash + Sprech-Wellen
   - Center-Stage: markierte Abschnitte ([data-gd-center]) rücken
     den Avatar groß in die Bildmitte, dann zurück in die Ecke
   - × klappt dauerhaft ein -> Launcher-Knopf klappt wieder aus
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

  var el = document.createElement("div");
  el.className = "guide";
  el.innerHTML =
    '<span class="guide-avwrap"><img class="guide-av" alt="" width="62" height="62">' +
    '<span class="guide-wave" aria-hidden="true"><i></i><i></i><i></i></span></span>' +
    '<div class="guide-bubble"><button class="guide-x" aria-label="Guide einklappen" title="Einklappen">×</button>' +
    '<div class="guide-name mono"></div><div class="guide-text"></div></div>';
  document.body.appendChild(el);
  var avEl = el.querySelector(".guide-av");
  var nameEl = el.querySelector(".guide-name");
  var textEl = el.querySelector(".guide-text");

  var backdrop = document.createElement("div");
  backdrop.className = "guide-backdrop";
  backdrop.addEventListener("click", exitCenter);

  var launcher = document.createElement("button");
  launcher.className = "guide-launcher";
  launcher.setAttribute("aria-label","Guide von Louis & Nils öffnen");
  launcher.setAttribute("title","Louis & Nils einblenden");
  launcher.innerHTML = '<img src="'+AV.louis.img+'" alt=""><span class="guide-launcher-dot"></span>';
  launcher.hidden = true;
  document.body.appendChild(launcher);
  if (collapsed) launcher.hidden = false;

  var lastEl=null, hasMsg=false, centerActive=false, typeTimer=null, centerTimer=null;

  function stopType(){ if(typeTimer){ clearTimeout(typeTimer); typeTimer=null; } el.classList.remove("talking"); }
  function typeOut(text){
    stopType();
    if (reduce){ textEl.textContent = text; return; }
    el.classList.add("talking");
    textEl.textContent = "";
    var i = 0;
    (function step(){
      textEl.textContent = text.slice(0, i);
      if (i < text.length){
        var c = text.charAt(i); i++;
        var d = c===" " ? 14 : (/[.,!?–:]/.test(c) ? 150 : 26);
        typeTimer = setTimeout(step, d);
      } else { typeTimer=null; el.classList.remove("talking"); }
    })();
  }
  function show(){ el.classList.remove("show"); void el.offsetWidth; el.classList.add("show"); }
  function setMessage(who, text){
    var a = AV[who] || AV.louis;
    avEl.src = a.img; nameEl.textContent = a.name; hasMsg = true;
    if (!collapsed){ show(); typeOut(text); }
  }
  function enterCenter(){
    centerActive = true;
    if (!backdrop.parentNode) document.body.appendChild(backdrop);
    requestAnimationFrame(function(){ backdrop.classList.add("show"); el.classList.add("center"); });
  }
  function exitCenter(){
    if (!centerActive) return;
    centerActive = false;
    el.classList.remove("center");
    backdrop.classList.remove("show");
    if (centerTimer){ clearTimeout(centerTimer); centerTimer=null; }
  }
  function reveal(node){
    if (!node || node===lastEl || collapsed || centerActive) return;
    lastEl = node;
    var who = node.getAttribute("data-gd-who");
    var text = node.getAttribute("data-gd");
    setMessage(who, text);
    if (node.getAttribute("data-gd-center")){
      enterCenter();
      var dur = reduce ? 2600 : (2600 + text.length*26 + 1400);
      centerTimer = setTimeout(exitCenter, dur);
    }
  }
  function collapse(){
    collapsed = true;
    try { localStorage.setItem(STORE,"1"); } catch(e){}
    stopType(); exitCenter(); el.classList.remove("show"); launcher.hidden = false;
  }
  function expand(){
    collapsed = false;
    try { localStorage.removeItem(STORE); } catch(e){}
    launcher.hidden = true;
    if (!hasMsg) setMessage("louis","Da bin ich wieder! Scroll einfach weiter – ich meld mich zu jedem Bereich.");
    else { show(); }
  }
  el.querySelector(".guide-x").addEventListener("click", function(ev){ ev.stopPropagation(); collapse(); });
  el.addEventListener("click", function(){ if (centerActive) exitCenter(); });
  launcher.addEventListener("click", expand);

  var anchors = Array.prototype.slice.call(document.querySelectorAll("[data-gd]"));
  if (anchors.length && "IntersectionObserver" in window){
    var io = new IntersectionObserver(function(entries){
      var best=null;
      for (var i=0;i<entries.length;i++){ if (entries[i].isIntersecting){ best = entries[i].target; break; } }
      if (best) reveal(best);
    }, { rootMargin:"-42% 0px -42% 0px", threshold:0 });
    anchors.forEach(function(a){ io.observe(a); });
    setTimeout(function(){ if(!hasMsg && !collapsed) reveal(anchors[0]); }, reduce?300:1100);
  } else {
    setTimeout(function(){ if(!collapsed) setMessage(DEFAULT_MSG.who, DEFAULT_MSG.text); }, reduce?300:1200);
  }
});
})();
