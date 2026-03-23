// Inject shared admin header + category nav and setup active link + header height var
(function(){
  const headerHtml = `
  <header style="padding:18px 24px;">
    <div style="display:flex;align-items:center;justify-content:space-between;gap:12px">
      <div style="display:flex;align-items:center;gap:12px">
        <div id="adminHeaderInner">
          <h1 style="margin:0">Admin Dashboard</h1>
          <p class="muted" style="margin:0">Manage questions, users and settings</p>
        </div>
      </div>
    </div>
  </header>
  <div id="adminHeaderBar" class="admin-header-bar">
    <div style="max-width:1200px;margin:0 auto;padding:12px 24px;">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
        <div style="flex:1">
          <h3 style="margin:0">Track Assessment — Admin</h3>
        </div>
        <nav class="category-links" style="display:flex;gap:8px;flex-wrap:nowrap;align-items:center;overflow-x:visible;">
          <a class="category-link" href="questions-all.html">All Questions</a>
          <a class="category-link" href="questions-verbal-ability.html">Verbal Ability</a>
          <a class="category-link" href="questions-numerical-abilty.html">Numerical Ability</a>
          <a class="category-link" href="questions-clerical-ability.html">Clerical Ability</a>
          <a class="category-link" href="questions-entrepreneurship-test.html">Entrepreneurship Test</a>
          <a class="category-link" href="questions-science-test.html">Science Test</a>
          <a class="category-link" href="questions-logical-reasoning.html">Logical Reasoning</a>
          <a class="category-link" href="questions-mechanical-ability.html">Mechanical Ability</a>
          <a class="category-link" href="questions-interpersonal-skills-test.html">Interpersonal Skills Test</a>
        </nav>
      </div>
    </div>
  </div>
  `;

  // Insert header at the top of the body. Run immediately if DOM already ready,
  // otherwise wait for DOMContentLoaded.
  function initHeader(){
    try{
      if (!document.body) return; // still nothing
      // only insert if not present
      if (!document.getElementById('adminHeaderBar')){
        const wrapper = document.createElement('div');
        wrapper.innerHTML = headerHtml;
        document.body.insertBefore(wrapper, document.body.firstChild);
        console.log('admin-header: injected header');
      }

      function syncHeaderHeight(){
        const hb = document.getElementById('adminHeaderBar');
        if (!hb) return;
        document.documentElement.style.setProperty('--admin-header-height', hb.offsetHeight + 'px');
      }
      window.addEventListener('load', syncHeaderHeight);
      window.addEventListener('resize', ()=> setTimeout(syncHeaderHeight,50));
      setTimeout(syncHeaderHeight,200);
      // Ensure the interpersonal link exists (helps when browser cached an older header)
      function ensureInterpersonalLink(){
        try{
          const nav = document.querySelector('.category-links');
          if (!nav) return;
          if (!nav.querySelector('a[href="questions-interpersonal-skills-test.html"]')){
            const a = document.createElement('a');
            a.className = 'category-link';
            a.href = 'questions-interpersonal-skills-test.html';
            a.textContent = 'Interpersonal Skills Test';
            nav.appendChild(a);
          }
        }catch(e){ console.error('ensureInterpersonalLink error', e); }
      }
      ensureInterpersonalLink();

      // Rewrite category links to always navigate to questions-all.html with category param
      try{
        const nav = document.querySelector('.category-links');
        if (nav){
          const links = Array.from(nav.querySelectorAll('a.category-link'));
          for (const a of links){
            const name = (a.textContent||'').trim();
            if (!name) continue;
            if (name === 'All Questions'){
              a.href = 'questions-all.html';
            } else {
              a.href = `questions-all.html?category=${encodeURIComponent(name)}`;
            }
          }
        }
      }catch(e){ console.error('rewrite category links failed', e); }

      // Inject unified category-link styles at runtime so they override per-page CSS
      function injectCategoryStyles(){
        try{
          if (document.getElementById('hdr-category-styles')) return;
          const css = `
            .category-links a.category-link{ color: #7c3aed !important; background: linear-gradient(90deg, rgba(124,58,237,0.06), rgba(6,182,212,0.02)) !important; border: 1px solid rgba(124,58,237,0.12) !important; font-weight: 700 !important; padding: 6px 10px !important; border-radius: 8px !important; text-decoration: none !important; }
            .admin-header-bar .category-links a.category-link{ color: #7c3aed !important; }
            .category-links a.category-link.active{ background: linear-gradient(90deg,#7c3aed,#06b6d4) !important; color: #fff !important; border-color: transparent !important; box-shadow: 0 8px 22px rgba(124,58,237,0.12) !important; }
          `;
          const s = document.createElement('style'); s.id = 'hdr-category-styles'; s.textContent = css; document.head.appendChild(s);
        }catch(e){ console.error('injectCategoryStyles error', e); }
      }
      injectCategoryStyles();

      (function highlightCategory(){
        const links = Array.from(document.querySelectorAll('.category-links a.category-link'));
        if (!links.length) return;
        try{
          const params = new URLSearchParams(window.location.search);
          const cat = params.get('category');
          let matched = null;
          if (cat){
            matched = links.find(a => {
              const href = a.getAttribute('href') || '';
              return href.includes('category=' + encodeURIComponent(cat)) || href.includes('category=' + cat);
            });
          }
          if (!matched){
            matched = links.find(a => (a.getAttribute('href')||'').split('?')[0].endsWith('questions-all.html')) || links[0];
          }
          if (matched) matched.classList.add('active');
        }catch(e){ links[0] && links[0].classList.add('active'); }
      })();

      // If we're on the consolidated All Questions page, intercept category clicks
      try{
        const isAllPage = window.location.pathname.split('/').pop() === 'questions-all.html' || window.location.pathname.split('/').pop() === '';
        if (isAllPage){
          const nav = document.querySelector('.category-links');
          if (nav){
            nav.addEventListener('click', (ev)=>{
              const a = ev.target.closest('a.category-link');
              if (!a) return;
              ev.preventDefault();
              try{
                // toggle active class
                const all = Array.from(document.querySelectorAll('.category-links a.category-link'));
                all.forEach(x=>x.classList.remove('active'));
                a.classList.add('active');
                // derive category name from link text
                const category = (a.textContent || '').trim();
                // update any page header title if present
                try{ const h = document.querySelector('.main-card h2'); if (h) h.textContent = category; }catch(e){}
                // call consolidated loader if available
                if (window.loadQuestions) {
                  // pass empty string to mean 'all'
                  const param = (category === 'All Questions') ? '' : category;
                  window.loadQuestions(param);
                } else {
                  // fallback: navigate
                  window.location.href = a.href;
                }
              }catch(e){ console.error('header nav click handler error', e); window.location.href = a.href; }
            });
          }
        }
      }catch(e){ console.error('setup nav interceptor failed', e); }
    }catch(e){ console.error('admin-header init error', e); }
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initHeader);
  } else {
    initHeader();
  }
})();
