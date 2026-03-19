// admin-modal.js
// Helper to wire View buttons and preview behavior inside question modals.
window.updateModalViewButtons = function(root){
  root = root || document;
  const prefixes = ['qa_opt_a','qa_opt_b','qa_opt_c','qa_opt_d','qa_opt_e'];
  function looksLikeUrl(s){ if (!s) return false; return /https?:\/\//i.test(s); }
  prefixes.forEach(prefix => {
    const inp = root.querySelector('#' + prefix);
    const prev = root.querySelector('#' + prefix + '_preview');
    const file = root.querySelector('#' + prefix + '_file');
    const view = root.querySelector('#' + prefix + '_view');
    if (!view) return; // nothing to wire
    const refresh = ()=>{
      const has = prev && prev.getAttribute('src');
      view.style.display = has ? 'inline-block' : 'none';
      view.disabled = !has;
    };
    if (inp){
      inp.addEventListener('input', ()=>{
        const v = inp.value.trim();
        if (prev) prev.src = looksLikeUrl(v) ? v : '';
        refresh();
      });
    }
    if (file){
      file.addEventListener('change', ()=>{
        const f = file.files && file.files[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = (e)=>{ if (prev) prev.src = e.target.result; refresh(); };
        reader.readAsDataURL(f);
      });
    }
    view.addEventListener('click', ()=>{ if (prev && prev.src) window.open(prev.src, '_blank'); });
    // initial state
    refresh();
  });
  // If modal contains a `question_id` input and it's empty, try to populate the next unused id
  const qin = root.querySelector('#question_id');
  if (qin && !qin.value){
    // default prefix NA and 3 digits
    window.fetchNextQuestionId().then(id => { if (id) qin.value = id; }).catch(()=>{});
  }
  // ensure modal panel scrolls to top and focus first input for usability
  try{
    const modalEl = (root && root.id === 'qaModal') ? root : root.querySelector && root.querySelector('#qaModal') ? root.querySelector('#qaModal') : null;
    const panel = modalEl ? modalEl.querySelector('.panel') || modalEl : (root.querySelector && root.querySelector('.panel')) || null;
    if (panel){ panel.scrollTop = 0; const first = panel.querySelector('input, textarea, select'); if (first) { try{ first.focus(); }catch(_){} } }
  }catch(e){ /* ignore */ }
};

// Fetch next unused question_id with given prefix and digit padding.
window.fetchNextQuestionId = async function(prefix='NA', digits=3, category=''){
  const backendBase = `${location.protocol}//${location.hostname}:8000`;
  try{
    const tryFetch = async (cat) => {
      const url = `${backendBase}/questions?category=${encodeURIComponent(cat || '')}`;
      const res = await fetch(url);
      if (!res.ok) return { error: `status ${res.status}` };
      const data = await res.json();
      return data;
    };

    let data = await tryFetch(category);
    // If backend returned an error object, try to guess category from pathname
    if (!Array.isArray(data)){
      // derive category hints from current pathname
      const path = (location.pathname || '').toLowerCase();
      const guesses = [];
      if (path.includes('numerical')) guesses.push('Numerical Ability');
      if (path.includes('science')) guesses.push('Science Test');
      if (path.includes('verbal')) guesses.push('Verbal Ability');
      if (path.includes('clerical')) guesses.push('Clerical Ability');
      if (path.includes('interpersonal')) guesses.push('Interpersonal Skills Test');
      if (path.includes('entrepreneurship')) guesses.push('Entrepreneurship Test');
      if (path.includes('logical')) guesses.push('Logical Reasoning');
      if (path.includes('mechanical')) guesses.push('Mechanical Ability');
      // ensure we still try the provided category if present
      if (category) guesses.unshift(category);
      for (const g of guesses){
        try{
          const d2 = await tryFetch(g);
          if (Array.isArray(d2)) { data = d2; break; }
        }catch(e){ /* continue */ }
      }
    }
    if (!Array.isArray(data)) return null;
    const re = new RegExp('^' + prefix.replace(/[-\\/\\^$*+?.()|[\]{}]/g,'\\$&') + "(\\d+)$");
    // Collect existing numeric suffixes and find smallest missing positive integer
    const nums = [];
    for (const r of data){
      const qid = r && r.question_id ? String(r.question_id) : '';
      const m = qid.match(re);
      if (m){ const n = parseInt(m[1],10); if (!isNaN(n)) nums.push(n); }
    }
    if (nums.length === 0){ return prefix + String(1).padStart(digits, '0'); }
    const numSet = new Set(nums);
    let next = 1;
    while (numSet.has(next)) next += 1;
    const pad = String(next).padStart(digits, '0');
    return prefix + pad;
  }catch(e){ console.error('fetchNextQuestionId error', e); return null; }
};
