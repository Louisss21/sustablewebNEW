/* ============================================================
   Sustable – HTML5-Effekte (Scroll-Reveal, Count-up, Header,
   Scroll-Progress). Progressive Enhancement: ohne JS bleibt
   alles sichtbar. Respektiert prefers-reduced-motion.
   ============================================================ */
(function(){
"use strict";
var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function ready(fn){ if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }

/* ---------- Scroll-Fortschrittsbalken ---------- */
function initProgress(){
  var bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.appendChild(bar);
  function upd(){
    var h = document.documentElement;
    var max = (h.scrollHeight - h.clientHeight) || 1;
    var p = Math.min(1, Math.max(0, (h.scrollTop || window.pageYOffset) / max));
    bar.style.transform = 'scaleX(' + p + ')';
  }
  window.addEventListener('scroll', upd, { passive:true });
  window.addEventListener('resize', upd);
  upd();
}

/* ---------- Header-Elevation beim Scrollen ---------- */
function initHeader(){
  var header = document.querySelector('header');
  if (!header) return;
  function upd(){ if ((window.pageYOffset||0) > 8) header.classList.add('scrolled'); else header.classList.remove('scrolled'); }
  window.addEventListener('scroll', upd, { passive:true });
  upd();
}

/* ---------- Count-up ---------- */
function animateCount(el){
  var target = parseFloat(el.getAttribute('data-countup')); if (isNaN(target)) return;
  if (reduce){ el.textContent = String(target); return; }
  var dur = 1100, start = null;
  function step(ts){
    if (start===null) start = ts;
    var t = Math.min(1, (ts - start) / dur);
    var eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
    el.textContent = String(Math.round(target * eased));
    if (t < 1) requestAnimationFrame(step); else el.textContent = String(target);
  }
  requestAnimationFrame(step);
}

/* ---------- Reveal + Count-up via IntersectionObserver ---------- */
function initReveal(){
  var counts = document.querySelectorAll('[data-countup]');
  if (reduce || !('IntersectionObserver' in window)){
    // alles sofort zeigen / Zahlen final setzen
    for (var c=0;c<counts.length;c++) counts[c].textContent = counts[c].getAttribute('data-countup');
    return;
  }
  document.documentElement.classList.add('fx'); // aktiviert versteckten Ausgangszustand

  var targets = document.querySelectorAll('main section h2, main .grid2 > *, main .grid3 > *, main section video, main details');
  for (var i=0;i<targets.length;i++){
    var el = targets[i];
    el.classList.add('reveal');
    // Stagger nach Position unter gleichen Geschwistern
    var idx = 0, p = el.previousElementSibling;
    while (p){ idx++; p = p.previousElementSibling; }
    el.style.transitionDelay = (Math.min(idx,6) * 70) + 'ms';
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  for (var j=0;j<targets.length;j++) io.observe(targets[j]);

  var io2 = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if (e.isIntersecting){ animateCount(e.target); io2.unobserve(e.target); } });
  }, { threshold: 0.6 });
  for (var k=0;k<counts.length;k++) io2.observe(counts[k]);
}

ready(function(){
  initProgress();
  initHeader();
  initReveal();
});
})();
