// ── Supabase ──
const SUPA_URL = 'https://tvuwlxmgpauubuitqgbd.supabase.co';
const SUPA_KEY = 'sb_publishable_Z70iI8GKpj_2PU5T8BiaOQ_DvGXBg43';
const db = supabase.createClient(SUPA_URL, SUPA_KEY);

// ── Map ──
const map = L.map('map').setView([42.3801, -71.0589], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:'© OpenStreetMap contributors'
}).addTo(map);

const PIN_COLOR = {
  green:'#22c55e', yellow:'#fbbf24',  
  red:'#ef4444',   expired:'#94a3b8'
};

let streets        = [];
let markers        = [];
let selectedStreet = null;
let freeSpots      = 0;
let nomTimer       = null;
let sugIndex       = -1;
let countdown      = 60;

// ── Helpers ──
function toast(msg, ms) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), ms || 2500);
}

function timeAgo(ts) {
  if (!ts) return '';
  const s = Math.floor((Date.now() - new Date(ts)) / 1000);
  if (s < 60)    return 'just now';
  if (s < 3600)  return Math.floor(s/60) + ' min ago';
  if (s < 86400) return Math.floor(s/3600) + ' hr ago';
  return Math.floor(s/86400) + 'd ago';
}

function isExpired(ts) {
  if (!ts) return true;
  return (Date.now() - new Date(ts)) / 60000 > 20;
}

function freshClass(ts) {
  if (!ts) return 'expired';
  const m = (Date.now() - new Date(ts)) / 60000;
  if (m <= 5)  return 'fresh';
  if (m <= 15) return 'aging';
  if (m <= 20) return 'stale';
  return 'expired';
}

function freshPct(ts) {
  if (!ts) return 0;
  return Math.max(0, Math.round(100 - (Date.now() - new Date(ts)) / 12000));
}

function barColor(pct) {
  return pct === 0 ? '#ef4444' : pct <= 30 ? '#fbbf24' : '#22c55e';
}

// ── Draw map markers ──
function drawMarkers(list) {
  markers.forEach(m => map.removeLayer(m));
  markers = [];
  list.forEach(s => {
    const total = s.total_spots || 10;
    const free  = Math.max(0, s.spots || 0);
    const color = PIN_COLOR[s.status] || '#94a3b8';
    const exp   = s.status === 'expired';

    const circle = L.circleMarker([s.lat, s.lng], {
      radius:13, fillColor:color, color:'#fff',
      weight:2, opacity:exp?0.4:1, fillOpacity:exp?0.3:0.9
    }).addTo(map);

    circle.bindPopup(
      `<b>${s.name}${s.city ? ', '+s.city : ''}</b><br>` +
      (exp
        ? '<span style="color:#94a3b8">Expired — no fresh data</span>'
        : `<b style="color:${color}">${free} of ${total} spots free</b>`) +
      (s.confidence
        ? `<br><span style="color:#3b82f6;font-size:11px">Confidence: ${s.confidence}/10</span>`
        : '') +
      (s.comment
        ? `<br><i style="color:#888;font-size:11px">"${s.comment}"</i>`
        : '') +
      (s.last_updated
        ? `<br><span style="color:#aaa;font-size:11px">Updated ${timeAgo(s.last_updated)}</span>`
        : '')
    );

    circle.on('click', () => (window.openStreetMobile || openStreet)(s));
    markers.push(circle);
  });
}

// ── Build sidebar list ──
function buildList(list) {
  const el = document.getElementById('street-list');
  if (!list.length) {
    el.innerHTML = '<p style="padding:14px;color:#aaa;font-size:13px;">No streets found.</p>';
    return;
  }
  el.innerHTML = '';
  list.forEach(s => {
    const total = s.total_spots || 10;
    const free  = Math.max(0, s.spots || 0);
    const exp   = s.status === 'expired';
    const div   = document.createElement('div');
    div.className = 'street-item';
    div.innerHTML =
      `<div class="dot ${s.status || 'unknown'}"></div>` +
      `<div style="flex:1">` +
        `<div class="s-name">${s.name}${s.city ? ', '+s.city : ''}</div>` +
        `<div class="s-info">${
          exp         ? 'Expired — no fresh data' :
          free > 0    ? `${free} of ${total} spots free` :
          s.spots===0 ? 'No reports yet' : 'Full'
        }</div>` +
        (s.last_updated
          ? `<div class="s-time">${timeAgo(s.last_updated)}</div>`
          : '') +
        `<div class="fresh-bar">
          <div class="fresh-fill ${freshClass(s.last_updated)}"
            style="width:${freshPct(s.last_updated)}%">
          </div>
        </div>` +
        (s.confidence && !exp
          ? `<div class="conf-row">
               <span>Confidence</span>
               <span>${s.confidence}/10</span>
             </div>
             <div class="conf-bar">
               <div class="conf-fill" style="width:${s.confidence*10}%"></div>
             </div>`
          : '') +
        (s.comment
          ? `<div class="c-bubble">"${s.comment}"</div>`
          : '') +
      `</div>`;
    div.onclick = () => { map.setView([s.lat, s.lng], 17); (window.openStreetMobile || openStreet)(s); };
    el.appendChild(div);
  });
}

// ── Open street in report panel ──
async function openStreet(s) {
  document.getElementById('no-street-msg').style.display         = 'none';
  document.getElementById('street-selected-panel').style.display = 'block';
  document.getElementById('selected-label').textContent =
    `${s.name}${s.city ? ', '+s.city : ''}`;

  if (s.id) {
    const { data, error } = await db
      .from('streets').select('*').eq('id', s.id).single();
    if (!error && data) s = data;
  }

  selectedStreet = s;

  const total = Math.max(1, parseInt(s.total_spots) || 10);
  const free  = Math.max(0, parseInt(s.spots)       || 0);

  freeSpots = free;
  document.getElementById('free-val').textContent       = free;
  document.getElementById('total-val').textContent      = total;
  document.getElementById('total-edit-val').textContent = total;

  const freshRow = document.getElementById('freshness-row');
  if (s.last_updated) {
    freshRow.style.display = 'flex';
    const pct   = freshPct(s.last_updated);
    const cls   = freshClass(s.last_updated);
    const color = cls==='fresh' ? '#22c55e' : cls==='aging' ? '#fbbf24' :
                  cls==='stale' ? '#f97316' : '#94a3b8';
    document.getElementById('fresh-indicator').style.width      = pct + '%';
    document.getElementById('fresh-indicator').style.background = color;
    document.getElementById('fresh-label').textContent          = timeAgo(s.last_updated);
  } else {
    freshRow.style.display = 'none';
  }

  document.getElementById('comment-input').value = s.comment || '';
  document.getElementById('btn-confirm').style.display =
    (s.last_updated && !isExpired(s.last_updated)) ? 'block' : 'none';
  document.getElementById('edit-total-row').style.display = 'none';
}

// ── Adjust free spots counter ──
function adjustFree(delta) {
  const total = parseInt(document.getElementById('total-val').textContent) || 10;
  freeSpots = Math.max(0, Math.min(total, freeSpots + delta));
  document.getElementById('free-val').textContent = freeSpots;
}

// ── Toggle edit total ──
function editTotal() {
  const row = document.getElementById('edit-total-row');
  row.style.display = row.style.display === 'none' ? 'block' : 'none';
}

// ── Adjust total in edit row ──
function adjustTotal(delta) {
  const cur = parseInt(document.getElementById('total-edit-val').textContent);
  document.getElementById('total-edit-val').textContent = Math.max(1, cur + delta);
}

// ── Save total ──
async function saveTotal() {
  if (!selectedStreet?.id) { toast('Select a saved street first!'); return; }
  const val = parseInt(document.getElementById('total-edit-val').textContent);
  selectedStreet.total_spots = val;
  document.getElementById('total-val').textContent = val;

  const { error } = await db.from('streets')
    .update({ total_spots: val }).eq('id', selectedStreet.id);

  if (error) { toast('Save failed: ' + error.message); return; }
  document.getElementById('edit-total-row').style.display = 'none';
  toast(`Total spots saved as ${val}`);
}

// ── Load streets ──
async function loadStreets() {
  const { data, error } = await db.from('streets').select('*').order('name');
  if (error) {
    document.getElementById('live-status').textContent = 'Error';
    document.getElementById('street-list').innerHTML =
      '<p style="padding:14px;color:#e44;font-size:13px;">Could not connect.</p>';
    return;
  }

  const expiredIds = data
    .filter(s => isExpired(s.last_updated) && s.status !== 'expired')
    .map(s => s.id);

  if (expiredIds.length) {
    await db.from('streets')
      .update({ spots:0, status:'expired', last_updated:null })
      .in('id', expiredIds);
    data.forEach(s => {
      if (expiredIds.includes(s.id)) {
        s.spots=0; s.status='expired'; s.last_updated=null;
      }
    });
  }

  streets = data;
  document.getElementById('live-status').textContent = 'Live';
  drawMarkers(streets);
  buildList(streets);
}

// ── Report a spot ──
async function report(type) {
  if (!selectedStreet) {
    toast('Click a street on the map or sidebar first!');
    return;
  }

  document.querySelector('.btn-free').disabled  = true;
  document.querySelector('.btn-taken').disabled = true;

  const comment = document.getElementById('comment-input').value.trim();

  try {
    let existing = null;
    if (selectedStreet.id) {
      const { data } = await db.from('streets')
        .select('*').eq('id', selectedStreet.id).single();
      existing = data;
    } else {
      const { data } = await db.from('streets')
        .select('*').ilike('name', selectedStreet.name).limit(1);
      existing = data?.[0] || null;
    }

    if (existing) {
      const currentSpots = parseInt(existing.spots)       || 0;
      const totalSpots   = parseInt(existing.total_spots) || 10;
      const newSpots     = type === 'free'
        ? Math.min(totalSpots, freeSpots > currentSpots ? freeSpots : currentSpots + 1)
        : Math.max(0, currentSpots - 1);
      const newStatus = newSpots === 0 ? 'red' : newSpots <= 2 ? 'yellow' : 'green';
      const newConf   = Math.min(10, (existing.confidence || 1) + 1);

      const { error } = await db.from('streets').update({
        spots:         newSpots,
        status:        newStatus,
        confidence:    newConf,
        confirmations: 0,
        comment:       comment || existing.comment || '',
        last_updated:  new Date().toISOString()
      }).eq('id', existing.id);

      if (error) { toast('Save failed: ' + error.message); return; }
      toast(type === 'free' ? 'Spot reported as free!' : 'Spot marked as taken!');

    } else {
      const { error } = await db.from('streets').insert({
        name:          selectedStreet.name,
        city:          selectedStreet.city    || '',
        lat:           selectedStreet.lat,
        lng:           selectedStreet.lng,
        spots:         type === 'free' ? Math.max(1, freeSpots) : 0,
        total_spots:   10,
        status:        type === 'free' ? 'green' : 'red',
        confidence:    1,
        confirmations: 0,
        comment:       comment || '',
        last_updated:  new Date().toISOString()
      });

      if (error) { toast('Save failed: ' + error.message); return; }
      toast(type === 'free'
        ? 'New street added — reported as free!'
        : 'New street added — marked as taken!');
    }

    await loadStreets();
    if (selectedStreet) {
      const updated = streets.find(s =>
        s.name === selectedStreet.name && s.city === selectedStreet.city);
      if (updated) openStreet(updated);
    }

  } catch(e) {
    toast('Error: ' + e.message);
  } finally {
    document.querySelector('.btn-free').disabled  = false;
    document.querySelector('.btn-taken').disabled = false;
  }
}

// ── Confirm still accurate ──
async function confirmReport() {
  if (!selectedStreet?.id) { toast('Select a street first!'); return; }

  const { data, error: fetchErr } = await db.from('streets')
    .select('*').eq('id', selectedStreet.id).single();
  if (fetchErr || !data) return;

  const newConf  = (data.confirmations || 0) + 1;
  const newScore = newConf % 3 === 0
    ? Math.min(10, (data.confidence || 1) + 1) : data.confidence;

  const { error } = await db.from('streets').update({
    confirmations: newConf,
    confidence:    newScore,
    last_updated:  new Date().toISOString()
  }).eq('id', selectedStreet.id);

  if (error) { toast('Save failed: ' + error.message); return; }
  toast('Thanks! Confidence score went up.');
  await loadStreets();
}

// ── Manual refresh ──
async function manualRefresh() {
  ['refresh-icon','section-refresh-icon'].forEach(id => {
    document.getElementById(id)?.classList.add('spinning');
  });
  document.getElementById('refresh-label').textContent = 'Refreshing...';
  document.getElementById('refresh-btn').disabled = true;

  await loadStreets();

  ['refresh-icon','section-refresh-icon'].forEach(id => {
    document.getElementById(id)?.classList.remove('spinning');
  });
  document.getElementById('refresh-label').textContent = 'Refresh';
  document.getElementById('refresh-btn').disabled = false;
  countdown = 60;
  document.getElementById('countdown').textContent = 60;
  toast('Data refreshed!');
}

// ── Countdown ──
setInterval(() => {
  countdown--;
  if (countdown <= 0) { loadStreets(); countdown = 60; }
  const el = document.getElementById('countdown');
  el.textContent = countdown;
  el.parentElement.style.color = countdown <= 10
    ? 'rgba(239,68,68,0.7)' : 'rgba(255,255,255,0.4)';
}, 1000);

// ── Autocomplete ──
function showSuggestions(items) {
  const box = document.getElementById('suggestions');
  box.innerHTML = '';
  sugIndex = -1;
  if (!items.length) { box.classList.remove('open'); return; }

  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'sug-item';
    let badge = item.type === 'known'
      ? `<span class="sug-badge ${
          item.status==='green'  ? 'bg-green'  :
          item.status==='yellow' ? 'bg-yellow' : 'bg-red'}">${
          item.status==='green'  ? item.spots+' open' :
          item.status==='yellow' ? item.spots+' left' : 'Full'
        }</span>`
      : `<span class="sug-badge bg-blue">Search</span>`;

    div.innerHTML =
      `<div class="sug-icon ${item.type}">
        ${item.type==='known' ? '📍' : item.type==='loading' ? '…' : '🔍'}
      </div>` +
      `<div style="flex:1">
        <div class="sug-main">${item.name}${item.city ? ', '+item.city : ''}</div>
        <div class="sug-sub">${item.sub}</div>
      </div>${badge}`;
    div.onclick = () => pickSuggestion(item);
    box.appendChild(div);
  });
  box.classList.add('open');
}

function hideSuggestions() {
  document.getElementById('suggestions').classList.remove('open');
  sugIndex = -1;
}

function pickSuggestion(item) {
  document.getElementById('search-input').value =
    item.name + (item.city ? ', '+item.city : '');
  hideSuggestions();
  map.setView([item.lat, item.lng], 17);

  // Use mobile-aware open function if on mobile
  const openFn = window.openStreetMobile || openStreet;

  if (item.type === 'known') {
    buildList([item]);
    openFn(item);
  } else {
    const m = L.marker([item.lat, item.lng]).addTo(map)
      .bindPopup(`<b>${item.name}</b><br>
        <span style="color:#888;font-size:12px">No reports yet. Be the first!</span>`)
      .openPopup();
    markers.push(m);
    openFn({
      name:        item.name,
      city:        item.city || '',
      lat:         item.lat,
      lng:         item.lng,
      spots:       0,
      total_spots: 10
    });
    buildList([{
      name:   item.name,
      city:   item.city,
      spots:  0,
      status: 'unknown',
      lat:    item.lat,
      lng:    item.lng
    }]);
  }
}

document.getElementById('search-input').addEventListener('input', function() {
  const q = this.value.trim();
  if (q.length < 2) {
    hideSuggestions(); drawMarkers(streets); buildList(streets); return;
  }

  const local = streets
    .filter(s => `${s.name||''} ${s.city||''}`.toLowerCase().includes(q.toLowerCase()))
    .map(s => ({
      type:'known', name:s.name, city:s.city||'',
      sub:`${s.city||''} · ${
        s.status==='expired' ? 'Expired' :
        s.spots>0 ? s.spots+' open' : 'Full'}`,
      status:s.status, spots:s.spots,
      lat:s.lat, lng:s.lng, id:s.id,
      total_spots:s.total_spots, comment:s.comment
    }));

  showSuggestions([...local, {
    type:'loading',
    name:'Searching more streets...',
    sub:`Looking up "${q}"`,
    lat:0, lng:0
  }]);

  clearTimeout(nomTimer);
  nomTimer = setTimeout(() => {
    fetch(`https://nominatim.openstreetmap.org/search?format=json` +
      `&q=${encodeURIComponent(q+', United States')}&limit=5&addressdetails=1`)
      .then(r => r.json())
      .then(data => {
        const seen = new Set();
        const nom = data
          .filter(r =>
            r.class==='highway' || r.addresstype==='road' ||
            ['residential','tertiary','secondary','primary'].includes(r.type))
          .map(r => ({
            type:'search',
            name: r.address.road || r.display_name.split(',')[0],
            city: r.address.city || r.address.town || r.address.village || '',
            sub:  [
              r.address.city||r.address.town||r.address.village||'',
              r.address.state||''
            ].filter(Boolean).join(', '),
            lat: parseFloat(r.lat),
            lng: parseFloat(r.lon)
          }))
          .filter(r => {
            const key = `${r.name}|${r.city}`.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return !local.some(l =>
              l.name.toLowerCase()===r.name.toLowerCase() &&
              l.city.toLowerCase()===r.city.toLowerCase());
          });
        showSuggestions([...local, ...nom]);
      })
      .catch(() => showSuggestions(local));
  }, 400);
});

document.getElementById('search-input').addEventListener('keydown', function(e) {
  const items = document.querySelectorAll('.sug-item');
  if (e.key==='ArrowDown') {
    e.preventDefault();
    sugIndex = Math.min(sugIndex+1, items.length-1);
    items.forEach((el,i) => el.classList.toggle('active', i===sugIndex));
  } else if (e.key==='ArrowUp') {
    e.preventDefault();
    sugIndex = Math.max(sugIndex-1, 0);
    items.forEach((el,i) => el.classList.toggle('active', i===sugIndex));
  } else if (e.key==='Enter') {
    sugIndex>=0 && items[sugIndex]
      ? items[sugIndex].click() : searchStreet();
  } else if (e.key==='Escape') { hideSuggestions(); }
});

document.addEventListener('click', e => {
  if (!document.getElementById('search-input').contains(e.target))
    hideSuggestions();
});

function searchStreet() {
  const q = document.getElementById('search-input').value.trim();
  if (!q) return;

  // Blur keyboard on mobile after search
  document.getElementById('search-input').blur();

  const local = streets.find(s =>
    `${s.name} ${s.city}`.toLowerCase().includes(q.toLowerCase()));
  if (local) { pickSuggestion({type:'known', ...local}); return; }

  fetch(`https://nominatim.openstreetmap.org/search?format=json` +
    `&q=${encodeURIComponent(q+', United States')}&limit=1`)
    .then(r => r.json())
    .then(data => {
      if (data[0]) pickSuggestion({
        type:'search', name:q, city:'',
        lat:parseFloat(data[0].lat),
        lng:parseFloat(data[0].lon)
      });
      else toast('Street not found. Try "Ferry St, Everett"');
    });
}
// ── Mobile bottom sheet expand/collapse ──
// ── Mobile bottom sheet ──
function initMobile() {
  if (window.innerWidth > 768) return;

  const sidebar = document.querySelector('.sidebar');
  const handle  = document.getElementById('sidebar-handle');
  const head    = document.getElementById('sidebar-head');

  // Start in peek state
  sidebar.classList.remove('expanded');

  // Tap handle or header to expand
  function expandSheet() {
    sidebar.classList.add('expanded');
  }

  handle?.addEventListener('click', expandSheet);
  head?.addEventListener('click', expandSheet);

  // Auto expand when any street is opened
  window.openStreetMobile = async function(s) {
    // Expand sheet first so user sees it moving
    sidebar.classList.add('expanded');
    // Then load the street data
    await openStreet(s);
    // Scroll report panel into view after data loads
    setTimeout(() => {
      const panel = document.querySelector('.report-panel');
      if (panel) panel.scrollIntoView({ behavior:'smooth', block:'nearest' });
    }, 500);
  };
}

// Collapse back to peek state
function collapseSheet() {
  const sidebar = document.querySelector('.sidebar');
  sidebar?.classList.remove('expanded');
  // Scroll map back to center
  map.invalidateSize();
}

window.addEventListener('load', initMobile);
window.addEventListener('resize', () => {
  if (window.innerWidth <= 768) initMobile();
});

// Run on load and on resize
window.addEventListener('load', initMobile);
window.addEventListener('resize', initMobile);
// ── Start ──
loadStreets();