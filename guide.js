/* ============================================================
   Sustable – Avatar-Guide (Louis & Nils)
   - Automatisch pro Abschnitt ([data-gd]); stört nicht (pointer-events)
   - "Sprechen": Typewriter + Kinn-Squash + Sprech-Wellen
   - lebendig: Atmen & gelegentliches Zwinkern (CSS)
   - Center-Stage bei markierten Abschnitten ([data-gd-center])
   - Interaktive Vorschläge ([data-gd-actions] = "Label|href;;Label|href")
   - blendet nach dem Lesen automatisch aus; × klappt dauerhaft ein
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
  var collapsed = false;
  var greeted = false; try { greeted = !!sessionStorage.getItem(STORE); } catch(e){}

  var el = document.createElement("div");
  el.className = "guide";
  el.innerHTML =
    '<span class="guide-avwrap"><img class="guide-av-2" alt="" width="46" height="46"><img class="guide-av" alt="" width="62" height="62">' +
    '<span class="guide-wave" aria-hidden="true"><i></i><i></i><i></i></span></span>' +
    '<div class="guide-bubble"><button class="guide-x" aria-label="Guide einklappen" title="Einklappen">×</button>' +
    '<div class="guide-name mono"></div><div class="guide-text"></div><div class="guide-actions"></div>' +
    '<form class="guide-ask"><input class="guide-ask-in" type="text" maxlength="300" placeholder="Frag Louis & Nils …" aria-label="Frage stellen"><button class="guide-ask-send" type="submit" aria-label="Frage senden">→</button></form>' +
    '<div class="guide-ask-note mono">KI-Antwort · kann Fehler enthalten</div></div>';
  document.body.appendChild(el);
  var avEl = el.querySelector(".guide-av");
  var av2El = el.querySelector(".guide-av-2");
  var nameEl = el.querySelector(".guide-name");
  var textEl = el.querySelector(".guide-text");
  var actEl = el.querySelector(".guide-actions");
  var askForm = el.querySelector(".guide-ask");
  var askIn = el.querySelector(".guide-ask-in");

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
  if (greeted) launcher.hidden = false;

  var lastEl=null, hasMsg=false, centerActive=false, typeTimer=null, centerTimer=null, hideTimer=null, pinned=false, greetHold=false, greetHoldTimer=null, history=[];

  function stopType(){ if(typeTimer){ clearTimeout(typeTimer); typeTimer=null; } el.classList.remove("talking"); }
  function cleanText(t){
    if (!t) return "";
    return String(t)
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/__(.*?)__/g, "$1")
      .replace(/(^|[^\*])\*(?!\s)([^\*]+?)\*(?!\*)/g, "$1$2")
      .replace(/`([^`]*)`/g, "$1")
      .replace(/^\s*#{1,6}\s+/gm, "")
      .replace(/^\s*[-•]\s+/gm, "• ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }
  function typeOut(raw){
    var text = cleanText(raw);
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
  function renderActions(str){
    actEl.innerHTML = "";
    if (!str) return;
    var parts = str.split(";;");
    for (var i=0;i<parts.length;i++){
      var pv = parts[i].split("|");
      if (pv.length<2) continue;
      var a = document.createElement("a");
      a.className = "guide-btn"; a.href = pv[1].trim(); a.textContent = pv[0].trim();
      a.addEventListener("click", function(ev){ ev.stopPropagation(); });
      actEl.appendChild(a);
    }
  }
  function renderReplies(replies){
    actEl.innerHTML = "";
    if (!replies) return;
    replies.forEach(function(rp){
      var b = document.createElement("button");
      b.type = "button"; b.className = "guide-btn guide-qr"; b.textContent = rp.label;
      b.addEventListener("click", function(ev){ ev.stopPropagation(); rp.fn(); });
      actEl.appendChild(b);
    });
  }
  function greet(){
    hasMsg = true; collapsed = false;
    try { sessionStorage.setItem(STORE,"1"); } catch(e){}
    launcher.hidden = true;
    if (hideTimer) clearTimeout(hideTimer);
    // Begrüßung kurz halten, damit Abschnitts-Einblendungen sie nicht sofort ersetzen
    greetHold = true;
    if (greetHoldTimer) clearTimeout(greetHoldTimer);
    greetHoldTimer = setTimeout(function(){ greetHold = false; }, 7000);
    setDuo();
    el.classList.add("intro"); show();
    typeOut("Hi! Wir sind Louis & Nils 👋 Suchst du einen neuen Gartentisch?");
    renderReplies([
      { label:"Ja", fn:startSales },
      { label:"Nur schauen", fn:browseReply }
    ]);
    setTimeout(function(){ el.classList.remove("intro"); }, 1000);
  }
  function startSales(){ ask("Ja, ich suche einen neuen Gartentisch. Kannst du mich kurz beraten?"); }
  function browseReply(){
    renderReplies(null);
    typeOut("Alles klar! Frag mich einfach, wenn du was wissen willst.");
  }
  function show(){ el.classList.remove("show"); void el.offsetWidth; el.classList.add("show"); }
  function scheduleHide(text){
    if (hideTimer) clearTimeout(hideTimer);
    if (pinned) return;
    var t = Math.min(12000, 4000 + text.length*45);
    hideTimer = setTimeout(function h(){
      if (centerActive){ hideTimer = setTimeout(h, 1500); return; }
      el.classList.remove("show"); stopType();
    }, t);
  }
  function setDuo(){
    el.classList.add("duo");
    avEl.src = AV.louis.img;
    if (av2El) av2El.src = AV.nils.img;
    nameEl.textContent = "Louis & Nils";
  }
  function setSolo(who){
    el.classList.remove("duo");
    var a = AV[who] || AV.louis;
    avEl.src = a.img; nameEl.textContent = a.name;
  }
  function setMessage(who, text, actions){
    setSolo(who); hasMsg = true;
    renderActions(actions);
    if (!collapsed){ show(); typeOut(text); scheduleHide(text); }
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
    if (!node || node===lastEl || collapsed || pinned || greetHold) return;
    lastEl = node;
    var who = node.getAttribute("data-gd-who");
    var text = node.getAttribute("data-gd");
    setMessage(who, text, node.getAttribute("data-gd-actions"));
  }
  function collapse(){
    collapsed = true;
    stopType(); exitCenter(); el.classList.remove("show"); launcher.hidden = false;
    if (hideTimer) clearTimeout(hideTimer);
  }
  function expand(){
    collapsed = false;
    launcher.hidden = true;
    greet();
  }
  el.querySelector(".guide-x").addEventListener("click", function(ev){ ev.stopPropagation(); collapse(); });
  el.addEventListener("click", function(){ if (centerActive) exitCenter(); });
  launcher.addEventListener("click", expand);

  // ---- KI-Frage ----
  function ask(q){
    pinned = true;
    exitCenter();
    if (hideTimer) clearTimeout(hideTimer);
    if (askIn) askIn.blur();
    setDuo(); actEl.innerHTML = "";
    el.classList.remove("show"); void el.offsetWidth; el.classList.add("show");
    stopType(); el.classList.add("talking"); textEl.textContent = "…";
    history.push({ role:"user", content:q });
    var fail = function(){
      history.pop();
      el.classList.remove("talking");
      typeOut("Wir sind gerade nicht erreichbar – schreib uns an info@sustable.eu, dann helfen wir dir direkt.");
      renderActions("E-Mail schreiben|mailto:info@sustable.eu");
    };
    fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history.slice(-16) })
    })
    .then(function(r){ return r.json().catch(function(){ return {}; }); })
    .then(function(d){
      el.classList.remove("talking");
      var a = (d && d.answer) ? String(d.answer) : "";
      if (a){ history.push({ role:"assistant", content:a }); typeOut(a); if (askIn) askIn.value = ""; }
      else { fail(); }
    })
    .catch(fail);
  }
  if (askIn){
    askIn.addEventListener("focus", function(){ pinned = true; if (hideTimer) clearTimeout(hideTimer); if (collapsed) expand(); });
  }
  if (askForm){
    askForm.addEventListener("submit", function(ev){
      ev.preventDefault();
      var q = (askIn && askIn.value ? askIn.value : "").trim();
      if (q) ask(q);
    });
  }

  var anchors = Array.prototype.slice.call(document.querySelectorAll("[data-gd]"));
  if (anchors.length && "IntersectionObserver" in window){
    var io = new IntersectionObserver(function(entries){
      var best=null;
      for (var i=0;i<entries.length;i++){ if (entries[i].isIntersecting){ best = entries[i].target; break; } }
      if (best) reveal(best);
    }, { rootMargin:"-42% 0px -42% 0px", threshold:0 });
    anchors.forEach(function(a){ io.observe(a); });
    setTimeout(function(){ if(!hasMsg && !collapsed && !greeted) greet(); }, reduce?120:180);
  } else {
    setTimeout(function(){ if(!collapsed && !greeted) greet(); }, reduce?120:180);
  }
});
})();
