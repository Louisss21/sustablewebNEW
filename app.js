/* ============================================================
   Sustable – Client-Interaktivität (Multi-Page)
   Arbeitet auf statischem HTML. Cart via localStorage,
   damit er über alle Seiten hinweg erhalten bleibt.
   ============================================================ */
(function(){
"use strict";

/* ---------- Daten (nur was der Client braucht) ---------- */
var PRODUCTS = [
  { id:'one-plus', slug:'solartisch-sustable-one-edelstahl', fullName:'Solartisch Sustable ONE+ Edelstahl', price:1750, wp:465, kwp:0.465, material:'Edelstahl, gebürstet', masse:'172 × 115 × 75 cm', img:'https://sustable.eu/wp-content/uploads/2025/10/One_1.avif' },
  { id:'one', slug:'solartisch-sustable-one-aluminium', fullName:'Solartisch Sustable ONE Aluminium', price:1490, wp:465, kwp:0.465, material:'Aluminium, anthrazit', masse:'172 × 115 × 75 cm', img:'https://sustable.eu/wp-content/uploads/2025/10/One_7.avif' },
  { id:'mini', slug:'solartisch-sustable-mini', fullName:'Solartisch Sustable mini', price:1190, wp:315, kwp:0.315, material:'Aluminium, anthrazit', masse:'140 × 80 × 75 cm', img:'https://sustable.eu/wp-content/uploads/2025/10/One_6.avif' }
];
function prod(id){ for (var i=0;i<PRODUCTS.length;i++){ if (PRODUCTS[i].id===id) return PRODUCTS[i]; } return PRODUCTS[0]; }
var SPEC_YIELD = { nord:950, mitte:1020, sued:1100 };
var CITIES = {'koblenz':[50.356,7.594],'memmingen':[47.984,10.181],'münchen':[48.137,11.575],'muenchen':[48.137,11.575],'berlin':[52.52,13.405],'hamburg':[53.551,9.994],'köln':[50.937,6.96],'koeln':[50.937,6.96],'frankfurt':[50.11,8.682],'stuttgart':[48.776,9.183],'hannover':[52.376,9.732],'leipzig':[51.34,12.375],'dresden':[51.05,13.737],'nürnberg':[49.454,11.077],'nuernberg':[49.454,11.077],'düsseldorf':[51.226,6.773],'duesseldorf':[51.226,6.773],'bremen':[53.08,8.80],'dortmund':[51.514,7.466],'essen':[51.456,7.012],'augsburg':[48.371,10.898],'ulm':[48.401,9.987],'kempten':[47.726,10.314],'freiburg':[47.999,7.842],'mainz':[50.0,8.27],'bonn':[50.735,7.1],'wiesbaden':[50.082,8.24],'karlsruhe':[49.007,8.404]};
var PLZ_ZONES = {'0':[51.05,13.74],'1':[52.52,13.40],'2':[53.55,9.99],'3':[51.32,9.49],'4':[51.51,7.47],'5':[50.74,7.10],'6':[50.11,8.68],'7':[48.78,9.18],'8':[48.14,11.58],'9':[49.45,11.08]};
var DEALERS = [
  { id:'creativ', name:'BÜRO-CREATIV GmbH', strasse:'Schönbornsluster Straße 53', ort:'56070 Koblenz', lat:50.3878, lng:7.5789 },
  { id:'wassermann', name:'Möbel Wassermann', strasse:'Mittereschweg 2', ort:'87700 Memmingen', lat:47.9741, lng:10.1632 }
];

/* ---------- Helfer ---------- */
function fmtEur(n, d){ d = (d===undefined)?0:d; return n.toLocaleString('de-DE',{minimumFractionDigits:d,maximumFractionDigits:d}) + ' €'; }
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
var CART_KEY = 'sustable_demo_cart_v1';
function getCart(){ try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch(e){ return []; } }
function setCart(c){ try { localStorage.setItem(CART_KEY, JSON.stringify(c)); } catch(e){} updateBadge(); }
function cartCount(c){ c=c||getCart(); var n=0; for (var i=0;i<c.length;i++) n+=c[i].qty; return n; }
function cartTotal(c){ c=c||getCart(); var t=0; for (var i=0;i<c.length;i++) t+=c[i].qty*prod(c[i].id).price; return t; }

function updateBadge(){
  var c = getCart();
  var cc = document.getElementById('cart-count'); if (cc) cc.textContent = cartCount(c);
  var ct = document.getElementById('cart-total'); if (ct) ct.textContent = fmtEur(cartTotal(c), 2);
}
function addToCart(id, qty){
  qty = qty || 1;
  var c = getCart(); var found = false;
  for (var i=0;i<c.length;i++){ if (c[i].id===id){ c[i].qty += qty; found=true; break; } }
  if (!found) c.push({ id:id, qty:qty });
  setCart(c);
  showToast(qty===1 ? 'Zum Warenkorb hinzugefügt' : qty+'× zum Warenkorb hinzugefügt');
}

/* ---------- Toast ---------- */
var _toastTimer = null;
function showToast(text){
  var root = document.getElementById('toast-root'); if (!root) return;
  clearTimeout(_toastTimer);
  root.innerHTML = '<div style="position:fixed; bottom:30px; left:50%; transform:translateX(-50%); z-index:2000; background:#111113; color:#ffffff; font-size:14.5px; font-weight:600; padding:14px 26px; border-radius:980px; box-shadow:0 8px 30px rgba(0,0,0,0.25); display:flex; align-items:center; gap:12px;"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l5 5 11-11"></path></svg>'+esc(text)+'<a href="/warenkorb/" style="color:#ffffff; font-weight:700; text-decoration:underline;">Zum Warenkorb</a></div>';
  _toastTimer = setTimeout(function(){ root.innerHTML=''; }, 3500);
}

/* ---------- Mobiles Menü ---------- */
function initMenu(){
  var btn = document.getElementById('menu-btn'); if (!btn) return;
  btn.addEventListener('click', function(){
    var open = document.body.classList.toggle('menu-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

/* ---------- Add-to-Cart Buttons ---------- */
function initAddButtons(){
  var btns = document.querySelectorAll('[data-add]');
  for (var i=0;i<btns.length;i++){
    btns[i].addEventListener('click', function(){
      var id = this.getAttribute('data-add');
      var qtyEl = this.getAttribute('data-add-qty');
      var qty = 1;
      if (qtyEl){ var el = document.getElementById(qtyEl); if (el) qty = parseInt(el.textContent,10) || 1; }
      addToCart(id, qty);
    });
  }
}

/* ---------- Rechner (Home) ---------- */
function initCalc(){
  var slider = document.getElementById('calc-strom-input'); if (!slider) return;
  var state = { product:'one-plus', strom:35, region:'sued' };
  function calcNote(p){ return 'Berechnung auf Basis des Sustable ' + (p.id==='one-plus'?'ONE+ Edelstahl':(p.id==='one'?'ONE Aluminium':'mini')) + ' mit ' + p.wp + ' Wp-Solarmodul, optimal geneigt um 25°. Richtwerte bei vollständiger Eigennutzung des erzeugten Stroms.'; }
  function productsHtml(){
    var html='';
    for (var i=0;i<PRODUCTS.length;i++){
      var p=PRODUCTS[i]; var a=state.product===p.id;
      var label = p.id==='one-plus'?'ONE+':(p.id==='one'?'ONE':'mini');
      html += '<button type="button" data-calc-select="'+p.id+'" style="flex:1; cursor:pointer; text-align:center; padding:13px 8px; border-radius:14px; transition:all .15s; border:1.5px solid '+(a?'#111113':'#d2d2d7')+'; background:'+(a?'#111113':'#ffffff')+'; color:'+(a?'#ffffff':'#1d1d1f')+';"><div style="font-weight:700; font-size:15px;">'+label+'</div><div style="font-size:12px; margin-top:2px; color:'+(a?'rgba(255,255,255,0.7)':'#86868b')+';">'+p.wp+' Wp</div></button>';
    }
    return html;
  }
  function render(){
    var p = prod(state.product);
    var y = Math.round(p.kwp * SPEC_YIELD[state.region]);
    var save = y * state.strom / 100;
    var set = function(id,t){ var el=document.getElementById(id); if (el) el.textContent=t; };
    set('calc-strom', state.strom);
    set('calc-ersparnis', fmtEur(save));
    set('calc-ertrag', y.toLocaleString('de-DE')+' kWh');
    set('calc-amort', (p.price/save).toLocaleString('de-DE',{maximumFractionDigits:1})+' Jahre');
    set('calc-ersparnis25', fmtEur(save*25));
    set('calc-note', calcNote(p));
    var cp = document.getElementById('calc-products'); if (cp){ cp.innerHTML = productsHtml(); bindSelect(); }
  }
  function bindSelect(){
    var bs = document.querySelectorAll('[data-calc-select]');
    for (var i=0;i<bs.length;i++){ bs[i].addEventListener('click', function(){ state.product=this.getAttribute('data-calc-select'); render(); }); }
  }
  slider.addEventListener('input', function(){ state.strom = parseInt(this.value,10); render(); });
  var region = document.getElementById('calc-region');
  if (region) region.addEventListener('change', function(){ state.region=this.value; render(); });
  bindSelect();
  render();
}

/* ---------- Produkt-Detail Menge ---------- */
function initProductQty(){
  var q = document.getElementById('pd-qty'); if (!q) return;
  var inc = document.getElementById('pd-inc'), dec = document.getElementById('pd-dec');
  function val(){ return parseInt(q.textContent,10)||1; }
  if (inc) inc.addEventListener('click', function(){ q.textContent = Math.min(9, val()+1); });
  if (dec) dec.addEventListener('click', function(){ q.textContent = Math.max(1, val()-1); });
}

/* ---------- Warenkorb ---------- */
function renderCart(){
  var root = document.getElementById('cart-app'); if (!root) return;
  var c = getCart();
  if (cartCount(c) === 0){
    root.innerHTML = '<div style="background:#ffffff; border-radius:22px; padding:70px 40px; text-align:center;"><p style="margin:0 0 26px; font-size:17px; color:#6e6e73;">Dein Warenkorb ist leer.</p><a href="/shop/" style="display:inline-flex; align-items:center; gap:9px; background:#111113; color:#ffffff; border-radius:980px; padding:13px 28px; font-weight:600; font-size:15px;">Zum Shop</a></div>';
    return;
  }
  var rows = '';
  for (var i=0;i<c.length;i++){
    var p = prod(c[i].id);
    rows += '<div class="cart-row" style="display:flex; align-items:center; gap:22px; padding:22px 0; border-bottom:1px solid #f0f0f2;"><div style="width:92px; height:92px; background:#f5f5f7; border-radius:16px; overflow:hidden; flex-shrink:0;"><img src="'+p.img+'" alt="'+esc(p.fullName)+'" style="width:100%; height:100%; object-fit:cover; display:block;"></div>'
    + '<div class="cart-name" style="flex:1;"><div style="font-weight:700; font-size:15.5px; color:#1d1d1f; margin-bottom:4px;">'+esc(p.fullName)+'</div><div style="font-size:13.5px; color:#86868b;">'+fmtEur(p.price)+' / Stück</div></div>'
    + '<div style="display:flex; align-items:center; border:1.5px solid #d2d2d7; border-radius:980px;"><button type="button" data-cart-dec="'+p.id+'" style="cursor:pointer; padding:7px 14px; font-weight:600; color:#1d1d1f; background:none; border:0;">−</button><span style="min-width:30px; text-align:center; font-weight:700;">'+c[i].qty+'</span><button type="button" data-cart-inc="'+p.id+'" style="cursor:pointer; padding:7px 14px; font-weight:600; color:#1d1d1f; background:none; border:0;">+</button></div>'
    + '<div style="min-width:90px; text-align:right; font-weight:700; font-size:15.5px;">'+fmtEur(c[i].qty*p.price)+'</div>'
    + '<button type="button" data-cart-remove="'+p.id+'" title="Entfernen" style="cursor:pointer; color:#86868b; font-size:20px; padding:6px; line-height:1; background:none; border:0;">×</button></div>';
  }
  root.innerHTML = '<div class="grid2" style="display:grid; grid-template-columns:1.6fr 1fr; gap:22px; align-items:start;"><div style="background:#ffffff; border-radius:22px; padding:10px 30px;">'+rows+'</div>'
  + '<div style="background:#ffffff; border-radius:22px; padding:32px;"><h2 style="margin:0 0 20px; font-size:19px; font-weight:700;">Zusammenfassung</h2>'
  + '<div style="display:flex; justify-content:space-between; font-size:14.5px; color:#6e6e73; padding:8px 0;"><span>Zwischensumme</span><span style="font-weight:600; color:#1d1d1f;">'+fmtEur(cartTotal(c),2)+'</span></div>'
  + '<div style="display:flex; justify-content:space-between; font-size:14.5px; color:#6e6e73; padding:8px 0; border-bottom:1px solid #f0f0f2; margin-bottom:12px;"><span>Versand</span><span style="font-weight:600; color:#1d1d1f;">kostenlos</span></div>'
  + '<div style="display:flex; justify-content:space-between; font-size:17px; font-weight:700; padding:8px 0 22px;"><span>Gesamt</span><span>'+fmtEur(cartTotal(c),2)+'</span></div>'
  + '<a href="/checkout/" style="display:flex; align-items:center; justify-content:center; gap:9px; background:#111113; color:#ffffff; border-radius:980px; padding:14px; font-weight:600; font-size:15.5px;">Zur Kasse</a>'
  + '<div style="text-align:center; font-size:12.5px; color:#86868b; margin-top:14px;">Demo-Shop – es wird keine echte Bestellung ausgelöst.</div></div></div>';
  // bind
  bindAll('[data-cart-inc]', function(el){ changeQty(el.getAttribute('data-cart-inc'), 1); });
  bindAll('[data-cart-dec]', function(el){ changeQty(el.getAttribute('data-cart-dec'), -1); });
  bindAll('[data-cart-remove]', function(el){ var id=el.getAttribute('data-cart-remove'); var c=getCart().filter(function(x){return x.id!==id;}); setCart(c); renderCart(); });
}
function changeQty(id, delta){
  var c = getCart();
  for (var i=0;i<c.length;i++){ if (c[i].id===id) c[i].qty += delta; }
  c = c.filter(function(x){ return x.qty>0; });
  setCart(c); renderCart();
}
function bindAll(sel, fn){ var els=document.querySelectorAll(sel); for (var i=0;i<els.length;i++){ (function(el){ el.addEventListener('click', function(){ fn(el); }); })(els[i]); } }

/* ---------- Checkout ---------- */
function initCheckout(){
  var root = document.getElementById('checkout-app'); if (!root) return;
  var st = { step:1, fields:{vorname:'',nachname:'',email:'',strasse:'',plz:'',ort:''}, payment:'ueberweisung', error:null, ordered:false, orderNumber:'' };
  var payLabels = { ueberweisung:'Vorkasse / Überweisung', paypal:'PayPal', kreditkarte:'Kreditkarte' };
  function render(){
    var c = getCart();
    if (st.ordered){
      root.innerHTML = '<div style="background:#ffffff; border-radius:22px; padding:70px 50px; text-align:center;"><div style="width:62px; height:62px; border-radius:50%; background:#f5f5f7; margin:0 auto 24px; display:flex; align-items:center; justify-content:center;"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l5 5 11-11"></path></svg></div><h2 style="margin:0 0 14px; font-size:30px; font-weight:700;">Vielen Dank für deine Bestellung!</h2><p style="margin:0 0 8px; font-size:15.5px; color:#6e6e73;">Bestellnummer <span style="font-weight:700; color:#1d1d1f;">'+st.orderNumber+'</span></p><p style="margin:0 0 34px; font-size:13.5px; color:#86868b;">Dies ist eine Demo – es wurde keine echte Bestellung ausgelöst.</p><a href="/" style="display:inline-flex; align-items:center; background:#111113; color:#ffffff; border-radius:980px; padding:13px 28px; font-weight:600; font-size:15px;">Zurück zur Startseite</a></div>';
      return;
    }
    if (cartCount(c) === 0){
      root.innerHTML = '<div style="background:#ffffff; border-radius:22px; padding:60px 40px; text-align:center;"><p style="margin:0 0 24px; font-size:16px; color:#6e6e73;">Dein Warenkorb ist leer – lege zuerst einen Solartisch in den Warenkorb.</p><a href="/shop/" style="display:inline-flex; align-items:center; background:#111113; color:#ffffff; border-radius:980px; padding:13px 28px; font-weight:600; font-size:15px;">Zum Shop</a></div>';
      return;
    }
    var labels = {1:'Schritt 1 von 3 · Lieferadresse',2:'Schritt 2 von 3 · Zahlungsart',3:'Schritt 3 von 3 · Übersicht'};
    var inner = '';
    if (st.step===1){
      var f = st.fields;
      function inp(name,ph,span){ return '<input name="'+name+'" value="'+esc(f[name])+'" data-field="'+name+'" placeholder="'+ph+'" style="'+(span?'grid-column:1 / -1; ':'')+'padding:14px 18px; font-size:14.5px; border:1px solid #d2d2d7; border-radius:12px; outline:none;">'; }
      inner = '<div style="background:#ffffff; border-radius:22px; padding:40px;"><h2 style="margin:0 0 24px; font-size:21px; font-weight:700;">Lieferadresse</h2><div class="form-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">'+inp('vorname','Vorname *',false)+inp('nachname','Nachname *',false)+inp('email','E-Mail *',true)+inp('strasse','Straße und Hausnummer *',true)+inp('plz','PLZ *',false)+inp('ort','Ort *',false)+'</div>'
      + (st.error?'<div style="margin-top:16px; font-size:13.5px; font-weight:600; color:#d70015;">'+esc(st.error)+'</div>':'')
      + '<div style="display:flex; justify-content:space-between; margin-top:30px;"><a href="/warenkorb/" style="display:inline-flex; align-items:center; color:#6e6e73; font-weight:600; font-size:14.5px; padding:13px 0;">← Zurück zum Warenkorb</a><button type="button" data-step="2" style="cursor:pointer; background:#111113; color:#ffffff; border:0; border-radius:980px; padding:13px 28px; font-weight:600; font-size:15px;">Weiter zur Zahlung</button></div></div>';
    } else if (st.step===2){
      function radio(v,l){ return '<label style="display:flex; align-items:center; gap:14px; border:1.5px solid #d2d2d7; border-radius:14px; padding:16px 18px; cursor:pointer; font-size:14.5px; font-weight:600;"><input type="radio" name="payment" value="'+v+'"'+(st.payment===v?' checked':'')+' data-payment style="accent-color:#111113; width:18px; height:18px;">'+l+'</label>'; }
      inner = '<div style="background:#ffffff; border-radius:22px; padding:40px;"><h2 style="margin:0 0 24px; font-size:21px; font-weight:700;">Zahlungsart</h2><div style="display:flex; flex-direction:column; gap:12px;">'+radio('ueberweisung','Vorkasse / Überweisung')+radio('paypal','PayPal')+radio('kreditkarte','Kreditkarte')+'</div>'
      + '<div style="display:flex; justify-content:space-between; margin-top:30px;"><button type="button" data-step="1" style="cursor:pointer; background:none; border:0; color:#6e6e73; font-weight:600; font-size:14.5px; padding:13px 0;">← Zurück</button><button type="button" data-step="3" style="cursor:pointer; background:#111113; color:#ffffff; border:0; border-radius:980px; padding:13px 28px; font-weight:600; font-size:15px;">Weiter zur Übersicht</button></div></div>';
    } else {
      var f2 = st.fields; var lines='';
      for (var i=0;i<c.length;i++){ var p=prod(c[i].id); lines += '<div style="display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid #f0f0f2; font-size:14.5px;"><span style="font-weight:600;">'+c[i].qty+' × '+esc(p.fullName)+'</span><span style="font-weight:700;">'+fmtEur(c[i].qty*p.price)+'</span></div>'; }
      inner = '<div style="background:#ffffff; border-radius:22px; padding:40px;"><h2 style="margin:0 0 24px; font-size:21px; font-weight:700;">Bestellübersicht</h2>'+lines
      + '<div style="display:flex; justify-content:space-between; padding:16px 0 6px; font-size:17px; font-weight:700;"><span>Gesamt</span><span>'+fmtEur(cartTotal(c),2)+'</span></div>'
      + '<div style="font-size:13.5px; color:#424245; background:#f5f5f7; border-radius:14px; padding:14px 18px; margin:18px 0 8px; line-height:1.7;"><span style="font-weight:700;">Lieferung an:</span> '+esc(f2.vorname)+' '+esc(f2.nachname)+', '+esc(f2.strasse)+', '+esc(f2.plz)+' '+esc(f2.ort)+'<br><span style="font-weight:700;">Zahlung:</span> '+payLabels[st.payment]+'</div>'
      + '<div style="display:flex; justify-content:space-between; margin-top:24px;"><button type="button" data-step="2" style="cursor:pointer; background:none; border:0; color:#6e6e73; font-weight:600; font-size:14.5px; padding:13px 0;">← Zurück</button><button type="button" data-place style="cursor:pointer; background:#111113; color:#ffffff; border:0; border-radius:980px; padding:14px 30px; font-weight:600; font-size:16px;">Jetzt kaufen (Demo)</button></div></div>';
    }
    var progress = st.step * 33.34;
    root.innerHTML = '<div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:10px;"><div style="font-size:14.5px; font-weight:600; color:#1d1d1f;">'+labels[st.step]+'</div><div style="font-size:12.5px; color:#86868b;">Demo-Checkout</div></div>'
    + '<div style="height:4px; background:#e8e8ed; border-radius:980px; margin-bottom:34px; overflow:hidden;"><div style="width:'+progress+'%; height:100%; background:#111113; border-radius:980px; transition:width .3s;"></div></div>' + inner;
    // bind inputs (kein Re-Render bei Eingabe)
    bindAll('[data-field]', null); // placeholder; we attach input below
    var fields = root.querySelectorAll('[data-field]');
    for (var k=0;k<fields.length;k++){ (function(el){ el.addEventListener('input', function(){ st.fields[el.getAttribute('data-field')] = el.value; st.error=null; }); })(fields[k]); }
    var pays = root.querySelectorAll('[data-payment]');
    for (var m=0;m<pays.length;m++){ (function(el){ el.addEventListener('change', function(){ st.payment = el.value; }); })(pays[m]); }
    var steps = root.querySelectorAll('[data-step]');
    for (var s=0;s<steps.length;s++){ (function(el){ el.addEventListener('click', function(){ go(parseInt(el.getAttribute('data-step'),10)); }); })(steps[s]); }
    var place = root.querySelector('[data-place]');
    if (place) place.addEventListener('click', placeOrder);
  }
  function go(step){
    if (step===2 && st.step===1){
      var f = st.fields;
      if (!f.vorname||!f.nachname||!f.email||!f.strasse||!f.plz||!f.ort){ st.error='Bitte fülle alle Pflichtfelder aus.'; render(); return; }
    }
    st.step = step; window.scrollTo({top:0}); render();
  }
  function placeOrder(){
    st.orderNumber = 'SU-2026-' + Math.floor(1000 + Math.random()*9000);
    st.ordered = true; setCart([]); window.scrollTo({top:0}); render();
  }
  render();
}

/* ---------- Händlersuche + Karte ---------- */
var _map=null, _markers={};
function haversine(a,b){ var R=6371, rad=Math.PI/180; var dLat=(b[0]-a[0])*rad, dLng=(b[1]-a[1])*rad; var s=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(a[0]*rad)*Math.cos(b[0]*rad)*Math.sin(dLng/2)*Math.sin(dLng/2); return 2*R*Math.asin(Math.sqrt(s)); }
function showDealer(id){
  var d=null; for (var i=0;i<DEALERS.length;i++){ if (DEALERS[i].id===id) d=DEALERS[i]; }
  if (_map && d){
    _map.flyTo({ center:[d.lng,d.lat], zoom:12.5, duration:1400 });
    for (var k in _markers){ if (!_markers.hasOwnProperty(k)) continue; var pop=_markers[k].getPopup(); if (k===id){ if (pop && !pop.isOpen()) _markers[k].togglePopup(); } else { if (pop && pop.isOpen()) _markers[k].togglePopup(); } }
  }
}
function initHaendler(){
  var mapEl = document.getElementById('map'); if (!mapEl) return;
  function tryInit(){
    if (!window.maplibregl){ setTimeout(tryInit, 150); return; }
    _map = new window.maplibregl.Map({ container: mapEl, style:'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json', center:[9.2,49.7], zoom:5.4, attributionControl:{compact:true} });
    _map.addControl(new window.maplibregl.NavigationControl({showCompass:false}), 'bottom-right');
    for (var i=0;i<DEALERS.length;i++){
      var d=DEALERS[i];
      var popup = new window.maplibregl.Popup({offset:22, closeButton:false}).setHTML('<div style="font-family:Montserrat,sans-serif;font-size:13px;line-height:1.6"><b style="font-size:14px">'+d.name+'</b><br>'+d.strasse+'<br>'+d.ort+'</div>');
      _markers[d.id] = new window.maplibregl.Marker({color:'#111113'}).setLngLat([d.lng,d.lat]).setPopup(popup).addTo(_map);
    }
  }
  tryInit();
  bindAll('[data-dealer-show]', function(el){ showDealer(el.getAttribute('data-dealer-show')); });
  var input = document.getElementById('search-input');
  var submit = document.getElementById('search-submit');
  function doSearch(){
    var q = (input.value||'').trim().toLowerCase();
    var info = document.getElementById('search-info');
    var dists = document.querySelectorAll('[data-dealer-dist]');
    function clearDist(){ for (var i=0;i<dists.length;i++) dists[i].textContent=''; }
    if (!q){ info.textContent=''; clearDist(); return; }
    var coords = null;
    if (CITIES[q]) coords = CITIES[q];
    else { var digits = q.replace(/[^0-9]/g,''); if (digits.length>=1 && PLZ_ZONES[digits[0]]) coords = PLZ_ZONES[digits[0]]; }
    if (!coords){ info.textContent='Ort nicht gefunden – bitte Stadt oder Postleitzahl eingeben.'; clearDist(); return; }
    var nearest=null, nd=null, distById={};
    for (var i=0;i<DEALERS.length;i++){ var km=Math.round(haversine(coords,[DEALERS[i].lat,DEALERS[i].lng])); distById[DEALERS[i].id]=km; if (nearest===null||km<nearest){ nearest=km; nd=DEALERS[i]; } }
    for (var j=0;j<dists.length;j++){ var id=dists[j].getAttribute('data-dealer-dist'); dists[j].textContent='ca. '+distById[id]+' km'; }
    info.textContent='Nächster Händler: '+nd.name+' (ca. '+distById[nd.id]+' km entfernt)';
    showDealer(nd.id);
  }
  if (submit) submit.addEventListener('click', doSearch);
  if (input) input.addEventListener('keydown', function(e){ if (e.key==='Enter') doSearch(); });
}

/* ---------- Init ---------- */
function init(){
  updateBadge();
  initMenu();
  initAddButtons();
  var page = document.body.getAttribute('data-page');
  if (page==='home') initCalc();
  if (page==='produkt') initProductQty();
  if (page==='warenkorb') renderCart();
  if (page==='checkout') initCheckout();
  if (page==='haendler') initHaendler();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

})();
