// admin-modal.js
// Lightweight modal helpers: preview/view/browse/remove only.
// Real uploads are handled by the modal fragment save/temp workflow.

window.logout = async function () {
  const confirmLogout = confirm("Are you sure you want to logout?");
  if (!confirmLogout) return;

  if (window.supabase) {
    await supabase.auth.signOut();
  }

  localStorage.removeItem('authToken');
  sessionStorage.clear();

window.location.href = '/login.html';
};

window.updateModalViewButtons = function(root){
  root = root || document;
  const prefixes = ['qa_opt_a','qa_opt_b','qa_opt_c','qa_opt_d','qa_opt_e','qa_image'];

  function isUsableSrc(src){
    const s = String(src || '').trim();
    if (!s) return false;
    if (s.startsWith('data:')) return true;
    if (/^https?:\/\//i.test(s)) return true;
    if (/^blob:/i.test(s)) return true;
    return false;
  }


  prefixes.forEach(prefix => {
    const inp = root.querySelector('#' + prefix);
    const prev = root.querySelector('#' + prefix + '_preview');
    const file = root.querySelector('#' + prefix + '_file');
    const view = root.querySelector('#' + prefix + '_view');
    const browse = root.querySelector('#' + prefix + '_browse');
    const remove = root.querySelector('#' + prefix + '_remove');

    const refresh = ()=>{
      const src = ((prev && ((prev.getAttribute && prev.getAttribute('src')) || prev.src)) || '').trim();
      const visible = isUsableSrc(src);
      if (prev) prev.style.display = 'block';
      if (view){
        view.style.display = visible ? 'inline-block' : 'none';
        view.disabled = !visible;
      }
      if (browse){
        browse.style.display = visible ? 'none' : 'inline-block';
        try{ browse.textContent = 'Browse'; }catch(_){}
      }
      if (remove){
        remove.style.display = visible ? 'inline-block' : 'none';
        try{ remove.textContent = 'Remove'; }catch(_){}
      }
      try{
        if (prefix === 'qa_image'){
          const hid = root.querySelector('#qa_image_src');
          if (hid && /^https?:\/\//i.test(src)) hid.value = src;
        }
      }catch(_){}
    };

    if (browse && file && !browse.dataset.boundBrowse){
      browse.dataset.boundBrowse = '1';
      browse.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        file.click();
      });
    }

    if (view && !view.dataset.boundView){
      view.dataset.boundView = '1';
      view.addEventListener('click', (e)=>{
        e.preventDefault();
        e.stopPropagation();
        const currentPrev = root.querySelector('#' + prefix + '_preview');
        if (currentPrev && currentPrev.src) window.open(currentPrev.src, '_blank');
      });
    }

    if (remove && !remove.dataset.boundRemove){
      remove.dataset.boundRemove = '1';
      remove.addEventListener('click', ()=>{
        try{
          if (file) file.value = '';
          if (prev){
            prev.src = '';
            prev.removeAttribute('src');
          }
          if (inp && inp.dataset) delete inp.dataset.imageValue;
          if (prefix === 'qa_image'){
            const hid = root.querySelector('#qa_image_src');
            if (hid) hid.value = '';
          }
        }catch(err){
          console.error('remove click failed', err);
        }
        refresh();
      });
    }

    if (inp && !inp.dataset.boundInputWatch){
      inp.dataset.boundInputWatch = '1';
      inp.addEventListener('input', refresh);
    }

    refresh();
  });

  const qin = root.querySelector('#question_id');
  if (qin && !qin.value){
    const path = (location.pathname || '').toLowerCase();
    let prefix = 'NA';
    let categoryName = '';
    function matchFromText(t){
      if (!t) return null;
      const s = String(t).toLowerCase();
      if (s.includes('numerical')) return ['NA','Numerical Ability'];
      if (s.includes('verbal')) return ['VA','Verbal Ability'];
      if (s.includes('interpersonal')) return ['IST','Interpersonal Skills Test'];
      if (s.includes('clerical')) return ['CA','Clerical Ability'];
      if (s.includes('entrepreneurship')) return ['ET','Entrepreneurship Test'];
      if (s.includes('logical')) return ['LR','Logical Reasoning'];
      if (s.includes('mechanical')) return ['MA','Mechanical Ability'];
      if (s.includes('science')) return ['ST','Science Test'];
      return null;
    }
    const explicit = window && window.adminCategory ? window.adminCategory : null;
    let matched = null;
    if (explicit){ matched = matchFromText(explicit); categoryName = explicit; }
    const headingText = (document.querySelector('h2') && document.querySelector('h2').textContent) || document.title || '';
    if (!matched){ matched = matchFromText(path); }
    if (!matched){ matched = matchFromText(headingText); }
    if (matched){ prefix = matched[0]; categoryName = matched[1] || (explicit || headingText || ''); }
    const digits = 3;
    window.fetchNextQuestionId(prefix, digits, categoryName).then(id => { if (id) qin.value = id; }).catch(()=>{});
  }

  try{
    const modalEl = (root && root.id === 'qaModal') ? root : root.querySelector && root.querySelector('#qaModal') ? root.querySelector('#qaModal') : null;
    const panel = modalEl ? modalEl.querySelector('.panel') || modalEl : (root.querySelector && root.querySelector('.panel')) || null;
    if (panel){
      panel.scrollTop = 0;
      const first = panel.querySelector('input, textarea, select');
      if (first) { try{ first.focus(); }catch(_){} }
    }
  }catch(_){}
};

window.fetchNextQuestionId = async function(prefix='NA', digits=3, category=''){
  const backendBase = `${location.protocol}//${location.hostname}:8000`;
  try{
    const tryFetch = async (cat) => {
      const url = `${backendBase}/questions?category=${encodeURIComponent(cat || '')}`;
      const res = await fetch(url);
      if (!res.ok) return { error: `status ${res.status}` };
      return await res.json();
    };

    let data = await tryFetch(category);
    if (!Array.isArray(data)){
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
      if (category) guesses.unshift(category);
      for (const g of guesses){
        try{
          const d2 = await tryFetch(g);
          if (Array.isArray(d2)) { data = d2; break; }
        }catch(_){}
      }
    }
    if (!Array.isArray(data)) return null;
    const re = new RegExp('^' + prefix.replace(/[-\/\\^$*+?.()|[\]{}]/g,'\\$&') + "(\\d+)$");
    const nums = [];
    for (const r of data){
      const qid = r && r.question_id ? String(r.question_id) : '';
      const m = qid.match(re);
      if (m){ const n = parseInt(m[1],10); if (!isNaN(n)) nums.push(n); }
    }
    if (nums.length === 0) return prefix + String(1).padStart(digits, '0');
    const numSet = new Set(nums);
    let next = 1;
    while (numSet.has(next)) next += 1;
    return prefix + String(next).padStart(digits, '0');
  }catch(e){
    console.error('fetchNextQuestionId error', e);
    return null;
  }
};

