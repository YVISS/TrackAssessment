// admin-modal.js
// Helper to wire View buttons and preview behavior inside question modals.
window.updateModalViewButtons = function(root){
  root = root || document;
  const prefixes = ['qa_opt_a','qa_opt_b','qa_opt_c','qa_opt_d','qa_opt_e','qa_image'];
  function looksLikeUrl(s){ if (!s) return false; return /https?:\/\//i.test(s); }
  prefixes.forEach(prefix => {
    const inp = root.querySelector('#' + prefix);
    const prev = root.querySelector('#' + prefix + '_preview');
    const file = root.querySelector('#' + prefix + '_file');
    const view = root.querySelector('#' + prefix + '_view');
    const browse = root.querySelector('#' + prefix + '_browse');
    const remove = root.querySelector('#' + prefix + '_remove');
    if (browse && file && !browse.dataset.boundBrowse){
  browse.dataset.boundBrowse = '1';
  browse.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    file.click();
  });
}
    if (!view) return; // nothing to wire
    // Determine whether the preview image is actually usable.
    const getPreviewSrc = (img)=>{
        try{
          if (!img) return '';
          return ((img.getAttribute && img.getAttribute('src')) || '').trim();
        }catch(e){
          return '';
        }
      };

      const isValidPreview = (img)=>{
        try{
          const src = getPreviewSrc(img);
          if (!src) return false;
          return src.startsWith('data:') || /^https?:\/\//i.test(src);
        }catch(e){
          return false;
        }
      };

    const refresh = ()=>{
      const src = getPreviewSrc(prev);
      const visible = !!src && isValidPreview(prev);
      if (prev){ prev.style.display = 'block'; }
      view.style.display = visible ? 'inline-block' : 'none';
      view.disabled = !visible;
      // If this is the question image prefix, mirror preview src into hidden input `qa_image_src`
      try{
        if (prefix === 'qa_image'){
          const hid = root.querySelector('#qa_image_src');
          if (hid) hid.value = src || '';
        }
      }catch(e){/* ignore */}
      // Toggle Browse / Remove labels: prefer showing a dedicated Remove button when preview exists,
      // otherwise show the Browse label. Also ensure text is correct in either state.
      try{
        if (browse){
        browse.style.display = visible ? 'none' : 'inline-block';
        try{ browse.textContent = 'Browse'; }catch(_){ }
      }
      if (remove){
        remove.style.display = visible ? 'inline-block' : 'none';
        try{ remove.textContent = 'Remove'; }catch(_){ }
      }
      }catch(_){ }
    };
        if (inp){
        inp.addEventListener('input', ()=>{
          const v = inp.value.trim();

          if (prev){
            if (prefix === 'qa_image') {
              const existing = (prev.getAttribute && prev.getAttribute('src')) || prev.src || '';
              prev.src = looksLikeUrl(v) ? v : existing;
            } else {
              const imageVal = (inp.dataset && inp.dataset.imageValue) || '';
              if (imageVal) {
                prev.src = imageVal;
              }
            }
          }

          refresh();
        });
      }
      if (file){
        file.addEventListener('change', async ()=>{
          const f = file.files && file.files[0];
          if (!f) return;

          const qidInput = root.querySelector('#question_id') || document.getElementById('question_id');
          const questionId = qidInput ? qidInput.value.trim() : '';

          if (!questionId) {
            alert('question_id is empty. Wait for the ID to appear first before uploading.');
            return;
          }

    const reader = new FileReader();
    reader.onload = (e)=>{
      const val = e.target.result;
      if (prev) prev.src = val;

      if (prefix !== 'qa_image' && inp) {
        inp.dataset.imageValue = val || '';
      }

      try{
        if (prefix === 'qa_image'){
          const hid = root.querySelector('#qa_image_src');
          if (hid) hid.value = val || '';
        }
      }catch(_){}
      refresh();
    };
    reader.readAsDataURL(f);

    let categoryName = '';
    const explicit = window && window.adminCategory ? window.adminCategory : null;
    if (explicit) categoryName = explicit;

    if (!categoryName) {
      const headingText = (document.querySelector('h2') && document.querySelector('h2').textContent) || document.title || '';
      if (headingText.toLowerCase().includes('numerical')) categoryName = 'Numerical Ability';
      else if (headingText.toLowerCase().includes('verbal')) categoryName = 'Verbal Ability';
      else if (headingText.toLowerCase().includes('science')) categoryName = 'Science Test';
      else if (headingText.toLowerCase().includes('clerical')) categoryName = 'Clerical Ability';
      else if (headingText.toLowerCase().includes('interpersonal')) categoryName = 'Interpersonal Skills Test';
      else if (headingText.toLowerCase().includes('entrepreneurship')) categoryName = 'Entrepreneurship Test';
      else if (headingText.toLowerCase().includes('logical')) categoryName = 'Logical Reasoning';
      else if (headingText.toLowerCase().includes('mechanical')) categoryName = 'Mechanical Ability';
    }

    let assetType = '';
    if (prefix === 'qa_image') assetType = 'question';
    else if (prefix === 'qa_opt_a') assetType = 'opt_a';
    else if (prefix === 'qa_opt_b') assetType = 'opt_b';
    else if (prefix === 'qa_opt_c') assetType = 'opt_c';
    else if (prefix === 'qa_opt_d') assetType = 'opt_d';
    else if (prefix === 'qa_opt_e') assetType = 'opt_e';

    try {
      const formData = new FormData();
      formData.append("file", f);
      formData.append("category", categoryName);
      formData.append("asset_type", assetType);
      formData.append("question_id", questionId);

      const res = await fetch(`${location.protocol}//${location.hostname}:8000/upload-question-image`, {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || data.error || 'Upload failed');
      }

      if (prev && data.public_url) {
        prev.src = data.public_url;
      }
      if (prefix !== 'qa_image' && inp && data.public_url) {
        inp.dataset.imageValue = data.public_url;
      }

      if (prefix === 'qa_image') {
        const hid = root.querySelector('#qa_image_src');
        if (hid) hid.value = data.public_url || '';
      }



      refresh();
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Image upload failed: ' + err.message);
    }
  });
}
    view.addEventListener('click', ()=>{ if (prev && prev.src) window.open(prev.src, '_blank'); });
if (remove && !remove.dataset.boundRemove){
  remove.dataset.boundRemove = '1';
  remove.addEventListener('click', ()=>{
    try{
      if (file){
        try{ file.value = ''; }catch(_){}
      }

      if (prev){
        try{ prev.removeAttribute('src'); }catch(_){}
        prev.style.display = 'block';
      }

      if (inp && inp.dataset){
        inp.dataset.imageValue = '';
      }

      if (prefix === 'qa_image'){
        const hid = root.querySelector('#qa_image_src');
        if (hid) hid.value = '';
      }

      refresh();
    }catch(err){
      console.error('remove click failed', err);
    }
  });
}    refresh();
  });
  // If modal contains a `question_id` input and it's empty, try to populate the next unused id
  const qin = root.querySelector('#question_id');
  if (qin && !qin.value){
    // determine category and prefix from pathname or fallback to page heading/title
    const path = (location.pathname || '').toLowerCase();
    let prefix = 'NA';
    let categoryName = '';
    function matchFromText(t){ if (!t) return null; const s = String(t).toLowerCase(); if (s.includes('numerical')) return ['NA','Numerical Ability']; if (s.includes('verbal')) return ['VA','Verbal Ability']; if (s.includes('interpersonal')) return ['IST','Interpersonal Skills Test']; if (s.includes('clerical')) return ['CA','Clerical Ability']; if (s.includes('entrepreneurship')) return ['ET','Entrepreneurship Test']; if (s.includes('logical')) return ['LR','Logical Reasoning']; if (s.includes('mechanical')) return ['MA','Mechanical Ability']; if (s.includes('science')) return ['ST','Science Test']; return null; }
    // allow page to explicitly provide category via `window.adminCategory`
    const explicit = window && window.adminCategory ? window.adminCategory : null;
    let matched = null;
    if (explicit){ matched = matchFromText(explicit); categoryName = explicit; }
    const headingText = (document.querySelector('h2') && document.querySelector('h2').textContent) || document.title || '';
    if (!matched){ matched = matchFromText(path); }
    if (!matched){ matched = matchFromText(headingText); }
    if (matched){ prefix = matched[0]; categoryName = matched[1] || (explicit || headingText || ''); }
    const digits = 3;
    // Debug info to help diagnose prefix/category detection
    try{ console.debug('admin-modal: detect prefix', { path, headingText, prefix, categoryName }); }catch(e){ }
    window.fetchNextQuestionId(prefix, digits, categoryName).then(id => { if (id) qin.value = id; else console.debug('admin-modal: fetchNextQuestionId returned null', { prefix, categoryName }); }).catch((err)=>{ console.debug('admin-modal: fetchNextQuestionId error', err); });
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
