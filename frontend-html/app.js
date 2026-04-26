(function () {
  if (document.body?.dataset?.page !== 'user-dashboard') return;

  const LOGIN_PAGE = 'login.html';
  const ASSESSMENT_PAGE = 'user-assessment.html';
  const RESULTS_TABLE = 'student_results';
  const QUESTIONS_TABLE = 'Table_Questions';
  const BACKEND_BASE = `${location.protocol}//${location.hostname}:8000`;
  const REVIEW_PREFIX = 'msa_review_attempt:';

  const CATEGORY_ORDER = ['VA', 'NA', 'ST', 'IST', 'ET', 'LR', 'MA', 'CA'];
  const CATEGORY_TO_FIELD = {
    VA: 'verbal_ability',
    NA: 'numerical_ability',
    ST: 'science_test',
    IST: 'interpersonal_skills_test',
    ET: 'entrepreneurship_test',
    LR: 'logical_reasoning',
    MA: 'mechanical_ability',
    CA: 'clerical_ability'
  };

  const FIELDS = [
    { key: 'verbal_ability', label: 'Verbal Ability' },
    { key: 'numerical_ability', label: 'Numerical Ability' },
    { key: 'science_test', label: 'Science Test' },
    { key: 'clerical_ability', label: 'Clerical Ability' },
    { key: 'interpersonal_skills_test', label: 'Interpersonal Skills Test' },
    { key: 'logical_reasoning', label: 'Logical Reasoning' },
    { key: 'entrepreneurship_test', label: 'Entrepreneurship Test' },
    { key: 'mechanical_ability', label: 'Mechanical Ability' }
  ];

  const els = {
    toast: document.getElementById('toast'),
    dashboardStatus: document.getElementById('dashboardStatus'),
    dashboardContent: document.getElementById('dashboardContent'),
    welcomeText: document.getElementById('welcomeText'),
    sidebarAvatar: document.getElementById('sidebarAvatar'),
    refreshBtn: document.getElementById('refreshBtn'),
    backBtn: document.getElementById('backBtn'),
    goAssessmentBtn: document.getElementById('goAssessmentBtn'),
    showDashboardBtn: document.getElementById('showDashboardBtn'),
    logoutBtn: document.getElementById('logoutBtn')
  };

  let scoreSpiderChart = null;

  function bindSidebarHistoryToggle() {
    const section = document.getElementById('sidebarHistorySection');
    const toggle = document.getElementById('sidebarHistoryToggle');
    if (!section || !toggle || toggle.dataset.bound === '1') return;

    const storageKey = 'sidebar_history_collapsed';
    const applyState = collapsed => {
      section.classList.toggle('is-collapsed', collapsed);
      toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    };

    const savedCollapsed = sessionStorage.getItem(storageKey) === '1';
    applyState(savedCollapsed);

    toggle.addEventListener('click', () => {
      const collapsed = !section.classList.contains('is-collapsed');
      applyState(collapsed);
      sessionStorage.setItem(storageKey, collapsed ? '1' : '0');
    });

    toggle.dataset.bound = '1';
  }

  const dashboardState = {
    profile: null,
    rows: [],
    questionTotals: null,
    selectedIndex: 0,
    selectedCareer: ''
  };

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }



  function prettifyText(value) {
    return String(value ?? '-')
      .replaceAll('_', ' ')
      .replace(/\s+/g, ' ')
      .trim() || '-';
  }

  function showToast(message, isError = false) {
    if (!els.toast) return;
    els.toast.textContent = message;
    els.toast.classList.remove('hidden', 'error');
    if (isError) els.toast.classList.add('error');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
      els.toast?.classList.add('hidden');
    }, 2600);
  }


  function getReviewStorageKey(resultId) {
    return REVIEW_PREFIX + String(resultId || '').trim();
  }

  function readAttemptReviewSnapshot(resultId) {
    const key = getReviewStorageKey(resultId);
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (error) {
      console.warn('Could not parse attempt review snapshot:', error);
      return null;
    }
  }

  function ensureReviewModal() {
    let modal = document.getElementById('attemptReviewModal');
    if (modal) return modal;

    if (!document.getElementById('attemptReviewModalStyles')) {
      const style = document.createElement('style');
      style.id = 'attemptReviewModalStyles';
      style.textContent = `
        .attempt-review-modal { position: fixed; inset: 0; background: rgba(2,6,23,.78); display: none; align-items: center; justify-content: center; padding: 1rem; z-index: 3000; }
        .attempt-review-modal.is-open { display: flex; }
        .attempt-review-dialog { width: min(1200px, 96vw); max-height: 92vh; overflow: hidden; border-radius: 22px; border: 1px solid rgba(148,163,184,.22); background: linear-gradient(180deg, rgba(11,24,48,.98), rgba(10,19,36,.98)); box-shadow: 0 28px 60px rgba(2,6,23,.45); color: #eef4ff; display: flex; flex-direction: column; }
        .attempt-review-header { padding: 1rem 1.1rem; border-bottom: 1px solid rgba(148,163,184,.14); display: flex; justify-content: space-between; gap: 1rem; align-items: flex-start; }
        .attempt-review-title { margin: 0; font-size: 1.35rem; }
        .attempt-review-subtitle { margin: .25rem 0 0; color: #afc0da; line-height: 1.5; }
        .attempt-review-close { border: 1px solid rgba(148,163,184,.18); background: rgba(30,41,59,.75); color: #eef4ff; border-radius: 12px; padding: .7rem .95rem; font-weight: 700; cursor: pointer; }
        .attempt-review-toolbar { padding: .9rem 1.1rem; border-bottom: 1px solid rgba(148,163,184,.12); display: flex; flex-wrap: wrap; gap: .55rem; }
        .attempt-review-chip { border: 1px solid rgba(99,102,241,.35); background: rgba(49,46,129,.22); color: #eaf0ff; border-radius: 999px; padding: .45rem .8rem; font-weight: 700; font-size: .92rem; cursor: pointer; }
        .attempt-review-chip:hover { background: rgba(79,70,229,.32); }
        .attempt-review-body { padding: 1rem 1.1rem 1.2rem; overflow: auto; display: grid; gap: 1rem; }
        .attempt-review-empty { padding: 1.2rem; border: 1px dashed rgba(148,163,184,.22); border-radius: 16px; color: #c2d0e5; }
        .attempt-review-section { border: 1px solid rgba(148,163,184,.14); border-radius: 18px; overflow: hidden; background: linear-gradient(180deg, rgba(19,35,65,.9), rgba(12,23,44,.9)); }
        .attempt-review-section-head { padding: .95rem 1rem; border-bottom: 1px solid rgba(148,163,184,.12); display:flex; justify-content: space-between; gap:1rem; align-items:center; }
        .attempt-review-section-head h4 { margin: 0; font-size: 1.06rem; }
        .attempt-review-section-meta { color: #aebed6; font-size: .92rem; }
        .attempt-review-question { padding: 1rem; border-top: 1px solid rgba(148,163,184,.08); }
        .attempt-review-question:first-child { border-top: 0; }
        .attempt-review-question-title { margin: 0 0 .7rem; font-size: 1rem; line-height: 1.55; }
        .attempt-review-question-id { display: inline-flex; margin-bottom: .55rem; padding: .25rem .55rem; border-radius: 999px; background: rgba(59,130,246,.14); border: 1px solid rgba(59,130,246,.25); color: #d7e9ff; font-size: .82rem; font-weight: 700; }
        .attempt-review-image { display:block; max-width:min(100%, 460px); max-height: 220px; object-fit: contain; border-radius: 14px; border:1px solid rgba(148,163,184,.18); background: rgba(7,18,39,.45); margin: .45rem 0 .8rem; }
        .attempt-review-options { display:grid; gap:.55rem; }
        .attempt-review-option { border:1px solid rgba(148,163,184,.12); border-radius:14px; padding: .75rem .85rem; background: rgba(10,20,38,.68); }
        .attempt-review-option.is-selected { border-color: rgba(34,197,94,.52); background: linear-gradient(180deg, rgba(22,101,52,.30), rgba(10,20,38,.86)); box-shadow: 0 0 0 2px rgba(34,197,94,.14) inset; }
        .attempt-review-option-head { display:flex; justify-content:space-between; gap:1rem; align-items:center; margin-bottom:.25rem; }
        .attempt-review-option-key { font-weight: 800; color: #f8fbff; }
        .attempt-review-option-tag { font-size: .82rem; font-weight: 800; color: #bbf7d0; }
        .attempt-review-option-text { color: #dde7f7; line-height: 1.48; }
        .attempt-review-footer { padding: .9rem 1.1rem 1.1rem; border-top: 1px solid rgba(148,163,184,.12); display:flex; justify-content:flex-end; }
        .attempt-review-open-btn { min-width: 180px; }
        @media (max-width: 760px) {
          .attempt-review-dialog { width: 100%; max-height: 100vh; border-radius: 0; }
          .attempt-review-header { padding: .9rem; }
          .attempt-review-toolbar, .attempt-review-body, .attempt-review-footer { padding-left: .9rem; padding-right: .9rem; }
        }
      `;
      document.head.appendChild(style);
    }

    modal = document.createElement('div');
    modal.id = 'attemptReviewModal';
    modal.className = 'attempt-review-modal';
    modal.innerHTML = `
      <div class="attempt-review-dialog" role="dialog" aria-modal="true" aria-labelledby="attemptReviewTitle">
        <div class="attempt-review-header">
          <div>
            <h3 id="attemptReviewTitle" class="attempt-review-title">Review Attempt</h3>
            <p id="attemptReviewSubtitle" class="attempt-review-subtitle">Read-only review of the selected assessment attempt.</p>
          </div>
        </div>
        <div id="attemptReviewToolbar" class="attempt-review-toolbar"></div>
        <div id="attemptReviewBody" class="attempt-review-body"></div>
        <div class="attempt-review-footer">
          <button type="button" class="attempt-review-close" data-attempt-review-close>Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener('click', event => {
      if (event.target === modal) modal.classList.remove('is-open');
    });

    modal.querySelectorAll('[data-attempt-review-close]').forEach(btn => {
      btn.addEventListener('click', () => modal.classList.remove('is-open'));
    });

    if (!document.body.dataset.attemptReviewEscBound) {
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
          document.getElementById('attemptReviewModal')?.classList.remove('is-open');
        }
      });
      document.body.dataset.attemptReviewEscBound = '1';
    }

    return modal;
  }

  function ensureReviewButton() {
    let btn = document.getElementById('reviewSelectedAttemptBtn');
    if (btn) return btn;

    const anchor = els.refreshBtn?.parentElement || document.body;
    btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'reviewSelectedAttemptBtn';
    btn.className = 'secondary-btn attempt-review-open-btn';
    btn.textContent = 'Review Attempt';
    anchor.appendChild(btn);
    return btn;
  }

  function updateReviewButtonState() {
    const btn = ensureReviewButton();
    const rows = dashboardState.rows || [];
    const row = rows[dashboardState.selectedIndex] || null;
    const hasSnapshot = !!(row?.result_id && readAttemptReviewSnapshot(row.result_id));

    btn.disabled = !row;
    btn.title = hasSnapshot
      ? 'Open the selected attempt in the read-only review page.'
      : 'Review data is available for attempts submitted after installing this feature on this browser.';
  }

  function renderAttemptReview(snapshot, row) {
    const modal = ensureReviewModal();
    const toolbar = modal.querySelector('#attemptReviewToolbar');
    const body = modal.querySelector('#attemptReviewBody');
    const title = modal.querySelector('#attemptReviewTitle');
    const subtitle = modal.querySelector('#attemptReviewSubtitle');

    if (!snapshot || !Array.isArray(snapshot.categories) || !snapshot.categories.length) {
      title.textContent = 'Review Attempt';
      subtitle.textContent = row
        ? `No saved review snapshot was found for result ${row.result_id || row.id || '-'}.`
        : 'No attempt selected.';
      toolbar.innerHTML = '';
      body.innerHTML = '<div class="attempt-review-empty">This attempt has no local review copy yet. Submit a new assessment after installing this feature, then open that attempt from the dashboard to review the questions and your recorded answers.</div>';
      modal.classList.add('is-open');
      return;
    }

    title.textContent = `Review Attempt${row?.result_id ? ` (${row.result_id})` : ''}`;
    subtitle.textContent = `Submitted ${formatDateTime(snapshot.submitted_at || row?.submitted_at)} · Read-only review grouped by category.`;

    toolbar.innerHTML = snapshot.categories.map(category => `
      <button type="button" class="attempt-review-chip" data-review-jump="review-cat-${category.code}">${escapeHtml(category.label)}</button>
    `).join('');

    body.innerHTML = snapshot.categories.map(category => `
      <section id="review-cat-${category.code}" class="attempt-review-section">
        <div class="attempt-review-section-head">
          <h4>${escapeHtml(category.label)}</h4>
          <div class="attempt-review-section-meta">${escapeHtml(String(category.answered_count || 0))} / ${escapeHtml(String(category.question_count || 0))} answered</div>
        </div>
        ${(category.questions || []).map(question => {
          const selectedKey = String(question.answered_choice_key || '').trim();
          const questionText = question.text || 'Untitled question';
          const options = Array.isArray(question.options) ? question.options : [];
          const optionsHtml = options.length
            ? options.map(option => `
                <div class="attempt-review-option${selectedKey === option.key ? ' is-selected' : ''}">
                  <div class="attempt-review-option-head">
                    <span class="attempt-review-option-key">${escapeHtml(option.key)}</span>
                    ${selectedKey === option.key ? '<span class="attempt-review-option-tag">Your answer</span>' : ''}
                  </div>
                  ${option.text ? `<div class="attempt-review-option-text">${escapeHtml(option.text)}</div>` : ''}
                  ${option.image ? `<img class="attempt-review-image" src="${escapeHtml(option.image)}" alt="Option ${escapeHtml(option.key)} image" />` : ''}
                </div>
              `).join('')
            : '<div class="attempt-review-empty">No options were saved for this question.</div>';

          return `
            <article class="attempt-review-question">
              <span class="attempt-review-question-id">${escapeHtml(question.question_id || `Question ${question.order || ''}`)}</span>
              <p class="attempt-review-question-title"><strong>${escapeHtml(`Question ${question.order || ''}`)}</strong> — ${escapeHtml(questionText)}</p>
              ${question.image ? `<img class="attempt-review-image" src="${escapeHtml(question.image)}" alt="Question image" />` : ''}
              <div class="attempt-review-options">${optionsHtml}</div>
            </article>
          `;
        }).join('')}
      </section>
    `).join('');

    toolbar.querySelectorAll('[data-review-jump]').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-review-jump');
        const target = targetId ? document.getElementById(targetId) : null;
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    modal.classList.add('is-open');
    body.scrollTop = 0;
  }

  function openSelectedAttemptReview() {
    const rows = dashboardState.rows || [];
    const row = rows[dashboardState.selectedIndex] || null;
    if (!row) {
      showToast('No attempt selected.', true);
      return;
    }

    const resultId = String(row.result_id || row.id || '').trim();
    if (!resultId) {
      showToast('The selected attempt has no review id.', true);
      return;
    }

    const url = new URL('view-attempt.html', window.location.href);
    url.searchParams.set('result_id', resultId);
    if (row.submitted_at) {
      url.searchParams.set('submitted_at', row.submitted_at);
    }
    window.location.href = url.toString();
  }

  function setStatus(html, mode = '') {
    if (!els.dashboardStatus) return;
    els.dashboardStatus.innerHTML = html;
    els.dashboardStatus.classList.remove('hidden', 'is-error', 'is-success');
    if (mode === 'error') els.dashboardStatus.classList.add('is-error');
    if (mode === 'success') els.dashboardStatus.classList.add('is-success');
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function toNumber(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

function formatNumber(value, digits = 0) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '-';

  return digits === 0
    ? Math.round(n).toString()
    : n.toLocaleString(undefined, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
      });
}

  function formatSigned(value, digits = 1) {
    const n = Number(value);
    if (!Number.isFinite(n)) return '-';
    return `${n > 0 ? '+' : ''}${formatNumber(n, digits)}`;
  }

  function formatDateTime(value) {
    if (!value) return '-';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleString();
  }

  function updateSelectedAttempt(index) {
    const rows = dashboardState.rows || [];
    if (!rows.length) return;

    const safeIndex = Math.max(0, Math.min(rows.length - 1, Number(index) || 0));
    dashboardState.selectedIndex = safeIndex;

    renderSummary(
      dashboardState.profile,
      rows,
      dashboardState.questionTotals,
      safeIndex
    );
  }

  function getStoredProfile() {
    try {
      const profile = JSON.parse(sessionStorage.getItem('user_profile') || '{}');
      const userId = sessionStorage.getItem('user_id') || '';
      const email = sessionStorage.getItem('user_email') || '';
      const name = sessionStorage.getItem('user_name') || '';

      if (userId && !profile.user_id) profile.user_id = userId;
      if (email && !profile.email) profile.email = email;
      if (name && !profile.name) profile.name = name;

      return profile;
    } catch {
      return {
        user_id: sessionStorage.getItem('user_id') || '',
        email: sessionStorage.getItem('user_email') || '',
        name: sessionStorage.getItem('user_name') || ''
      };
    }
  }

  function clearSession() {
    sessionStorage.removeItem('user_profile');
    sessionStorage.removeItem('user_id');
    sessionStorage.removeItem('user_email');
    sessionStorage.removeItem('user_name');
  }

  function goToLogin() {
    clearSession();
    window.location.href = LOGIN_PAGE;
  }

  function setSidebarUser(profile) {
    const displayName = profile.name || profile.email || 'User';
    if (els.welcomeText) els.welcomeText.textContent = displayName;
    if (els.sidebarAvatar) {
      els.sidebarAvatar.textContent =
        String(displayName).trim().charAt(0).toUpperCase() || 'U';
    }
  }

  function getSupabaseClient() {
    if (window.supabaseClient && typeof window.supabaseClient.from === 'function') {
      return window.supabaseClient;
    }

    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
      throw new Error('Supabase library not loaded.');
    }

    const url =
      window.SUPABASE_URL ||
      window.supabaseUrl ||
      window.SUPABASE_CONFIG?.url ||
      window.__SUPABASE_URL__;

    const anonKey =
      window.SUPABASE_ANON_KEY ||
      window.supabaseAnonKey ||
      window.supabaseKey ||
      window.SUPABASE_CONFIG?.anonKey ||
      window.__SUPABASE_ANON_KEY__;

    if (
      !url ||
      !anonKey ||
      /YOUR-PROJECT-REF|YOUR_SUPABASE_ANON_KEY/i.test(`${url} ${anonKey}`)
    ) {
      throw new Error('Supabase config not found in supabase-config.js');
    }

    window.supabaseClient = window.supabase.createClient(url, anonKey);
    return window.supabaseClient;
  }

  async function resolveProfile(supabaseClient, storedProfile) {
    const fallback = {
      user_id: String(
        storedProfile.user_id ||
        storedProfile.id ||
        sessionStorage.getItem('user_id') ||
        ''
      ).trim(),
      email: String(
        storedProfile.email ||
        sessionStorage.getItem('user_email') ||
        ''
      ).trim(),
      name: String(
        storedProfile.name ||
        sessionStorage.getItem('user_name') ||
        ''
      ).trim(),
      created_at: storedProfile.created_at || null
    };

    if (!fallback.user_id && !fallback.email) {
      throw new Error('No user_id or email found in sessionStorage.');
    }

    try {
      if (fallback.user_id) {
        const { data, error } = await supabaseClient
          .from('users_profile')
          .select('user_id, email, name, created_at')
          .eq('user_id', fallback.user_id)
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        if (data?.user_id) {
          sessionStorage.setItem('user_id', String(data.user_id));
          sessionStorage.setItem('user_email', data.email || fallback.email || '');
          sessionStorage.setItem('user_name', data.name || fallback.name || '');
          sessionStorage.setItem('user_profile', JSON.stringify(data));
          return data;
        }
      }

      if (fallback.email) {
        const { data, error } = await supabaseClient
          .from('users_profile')
          .select('user_id, email, name, created_at')
          .eq('email', fallback.email)
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        if (data?.user_id) {
          sessionStorage.setItem('user_id', String(data.user_id));
          sessionStorage.setItem('user_email', data.email || fallback.email || '');
          sessionStorage.setItem('user_name', data.name || fallback.name || '');
          sessionStorage.setItem('user_profile', JSON.stringify(data));
          return data;
        }
      }
    } catch (err) {
      console.warn('users_profile lookup failed, using session fallback:', err);
    }

    if (!fallback.user_id) {
      throw new Error('Could not resolve the current user_id.');
    }

    sessionStorage.setItem('user_id', fallback.user_id);
    sessionStorage.setItem('user_email', fallback.email || '');
    sessionStorage.setItem('user_name', fallback.name || '');
    sessionStorage.setItem('user_profile', JSON.stringify(fallback));

    return fallback;
  }

  async function fetchResultRows(supabaseClient, userId) {
    const selectColumns = [
      'id',
      'result_id',
      'user_id',
      'submitted_at',
      'group_value:group',
      'verbal_ability',
      'numerical_ability',
      'science_test',
      'clerical_ability',
      'interpersonal_skills_test',
      'logical_reasoning',
      'entrepreneurship_test',
      'mechanical_ability',
      'va_et',
      'st_lr'
    ].join(', ');

    const { data, error } = await supabaseClient
      .from(RESULTS_TABLE)
      .select(selectColumns)
      .eq('user_id', String(userId).trim())
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  function calculateTotal(record) {
    return FIELDS.reduce((sum, field) => sum + toNumber(record[field.key]), 0);
  }

  function extractCategoryCode(questionId) {
    const raw = String(questionId || '').trim().toUpperCase();
    if (!raw) return '';
    for (const code of CATEGORY_ORDER) {
      if (raw === code || raw.startsWith(code)) return code;
    }
    return '';
  }

  async function fetchQuestionTotals(supabaseClient) {
    const totals = Object.fromEntries(FIELDS.map(field => [field.key, 0]));

    try {
      const { data, error } = await supabaseClient
        .from(QUESTIONS_TABLE)
        .select('question_id');

      if (error) throw error;

      (data || []).forEach(row => {
        const code = extractCategoryCode(row.question_id);
        const fieldKey = CATEGORY_TO_FIELD[code];
        if (fieldKey) totals[fieldKey] += 1;
      });
    } catch (error) {
      console.warn('Could not load total questions per category. Falling back to latest raw score totals.', error);
      FIELDS.forEach(field => {
        totals[field.key] = 0;
      });
    }

    return totals;
  }

  function percentFromTotalQuestions(rawValue, totalQuestions) {
    if (!totalQuestions || totalQuestions < 1) return 0;
    return Math.max(
      0,
      Math.min(100, (toNumber(rawValue) / Math.max(1, toNumber(totalQuestions))) * 100)
    );
  }

  function getFieldStats(latest, questionTotals) {
    return FIELDS.map(field => ({
      ...field,
      raw: toNumber(latest[field.key]),
      totalQuestions: Math.max(0, toNumber(questionTotals[field.key])),
      percent: percentFromTotalQuestions(latest[field.key], questionTotals[field.key])
    })).sort((a, b) => b.raw - a.raw);
  }

  function renderLatestFieldGrid(fieldStats) {
    const grid = document.getElementById('latestFieldGrid');
    if (!grid) return;

    grid.innerHTML = '';
    fieldStats.forEach((stat, index) => {
      const item = document.createElement('div');
      item.className = `stat-item ${
        ['accent-indigo', 'accent-violet', 'accent-cyan', 'accent-amber', 'accent-emerald', 'accent-rose'][index % 6]
      }`;
      item.innerHTML = `
        <h4>${escapeHtml(stat.label)}</h4>
         <p>${escapeHtml(formatNumber(stat.raw))}</p>
        <span class="mini-note">${escapeHtml(formatNumber(stat.raw))}/${escapeHtml(String(stat.totalQuestions || 0))} correct · ${escapeHtml(formatNumber(stat.percent, 1))}%</span>      
      `;
      grid.appendChild(item);
    });
  }

  function badgeClass(index) {
    if (index === 0) return 'rank-1';
    if (index === 1) return 'rank-2';
    if (index === 2) return 'rank-3';
    return 'rank-other';
  }

  function createRankItem(label, raw, percent, totalQuestions, badgeClassName, top = false) {
    const item = document.createElement('div');
    item.className = `rank-item${top ? ' is-top' : ''}`;
    item.innerHTML = `
      <div class="rank-head">
        <span class="rank-badge ${badgeClassName}">${escapeHtml(String(label).slice(0, 1))}</span>
        <span class="rank-label">${escapeHtml(label)}</span>
        <span class="rank-value">${escapeHtml(formatNumber(raw))}/${escapeHtml(String(totalQuestions || 0))} · ${escapeHtml(formatNumber(percent))}%</span>
      </div>
      <div class="rank-track">
        <div class="rank-fill${top ? '' : ' dim'}" style="width:${Math.max(3, Math.min(100, percent))}%"></div>
      </div>
    `;
    return item;
  }

  function renderCategoryRanking(fieldStats) {
    const list = document.getElementById('categoryRankList');
    if (!list) return;

    list.innerHTML = '';
    fieldStats.forEach((stat, index) => {
      list.appendChild(
        createRankItem(stat.label, stat.raw, stat.percent, stat.totalQuestions, badgeClass(index), index === 0)
      );
    });
  }

  function renderScoreSpider(fieldStats) {
    const canvas = document.getElementById('scoreSpiderChart');
    if (!canvas || typeof Chart === 'undefined') return;

    const labels = fieldStats.map(stat =>
      stat.label
        .replace('Interpersonal Skills Test', 'Interpersonal')
        .replace('Entrepreneurship Test', 'Entrepreneurship')
    );

    const percentValues = fieldStats.map(stat => Number(stat.percent.toFixed(1)));
    const rawValues = fieldStats.map(stat => Number(stat.raw.toFixed(1)));

    if (scoreSpiderChart && typeof scoreSpiderChart.destroy === 'function') {
      scoreSpiderChart.destroy();
    }
    scoreSpiderChart = null;

    scoreSpiderChart = new Chart(canvas, {
      type: 'radar',
      data: {
        labels,
        datasets: [
          {
            label: 'Latest Category Score',
            data: percentValues,
            fill: true,
            backgroundColor: 'rgba(99, 102, 241, 0.20)',
            borderColor: 'rgba(129, 140, 248, 0.95)',
            pointBackgroundColor: 'rgba(255, 255, 255, 0.95)',
            pointBorderColor: 'rgba(129, 140, 248, 0.95)',
            pointRadius: 3,
            pointHoverRadius: 5,
            borderWidth: 2
          }
        ]
      },
     options: {
  responsive: true,
  maintainAspectRatio: false,

  layout: {
    padding: 0 // ✅ ONLY ADD THIS (safe)
  },

  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label(context) {
          const i = context.dataIndex;
          return `${rawValues[i]}/${fieldStats[i].totalQuestions || 0} correct • ${percentValues[i]}%`;
        }
      }
    }
  },

  scales: {
    r: {
      beginAtZero: true,
      min: 0,
      max: 100,
      ticks: {
        stepSize: 20,
        backdropColor: 'transparent',
        color: '#9fb0ca'
      },
      grid: {
        color: 'rgba(148, 163, 184, 0.18)'
      },
      angleLines: {
        color: 'rgba(148, 163, 184, 0.18)'
      },
      pointLabels: {
        color: '#e5eefc',
        font: {
          size: 11,
          weight: '600'
        }
      }
    }
  }
}
    });
  }

  function renderAttemptHistory(rows, selectedIndex = 0) {
    const wrap = document.getElementById('historyWrap');
    const meta = document.getElementById('historyMeta');
    if (!wrap || !meta) return;

    const currentIndex = Math.max(0, Math.min(rows.length - 1, Number(selectedIndex) || 0));
    meta.textContent = `${rows.length} ${rows.length === 1 ? 'record' : 'records'}`;

    if (!rows.length) {
      wrap.innerHTML = '<div class="history-empty">No attempts found for this user.</div>';
      return;
    }

    wrap.innerHTML = rows
      .map((row, index) => {
        const isActive = index === currentIndex;
        const total = calculateTotal(row);
        const groupText = prettifyText(row.group_value || '-');
        return `
          <button
            type="button"
            class="sidebar-history__item${isActive ? ' is-active' : ''}"
            data-attempt-index="${index}"
            aria-label="Load attempt ${index + 1}"
          >
            <span class="sidebar-history__top">
              <span class="sidebar-history__index">#${index + 1}</span>
              <span class="sidebar-history__total">${escapeHtml(formatNumber(total, 0))}</span>
            </span>

            <span class="sidebar-history__date">${escapeHtml(formatDateTime(row.submitted_at))}</span>
            <span class="sidebar-history__meta-line">${escapeHtml(groupText)}</span>
          </button>
        `;
      })
      .join('');

    wrap.querySelectorAll('.sidebar-history__item').forEach(rowEl => {
      rowEl.addEventListener('click', () => {
        const nextIndex = Number(rowEl.dataset.attemptIndex);
        if (!Number.isFinite(nextIndex)) return;
        if (nextIndex === currentIndex) return;
        updateSelectedAttempt(nextIndex);
      });
    });
  }

  function hideLegacyUi() {
    const ids = ['mappingGrid', 'profileRadar', 'topMappingValue', 'topTrackValue'];

    ids.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const card = el.closest('.card, .summary-card, .radar-card, .section-card, .panel');
      (card || el).style.display = 'none';
    });

    const note = document.querySelector('.dashboard-note');
    if (note) {
      note.textContent =
        'View attempts, latest saved scores, category ranking, assessment history, selected career insight, and result explanation based on the total questions in each category.';
    }
  }

    function fillSelect(selectEl, items, selectedValue = '', emptyLabel = 'No options available') {
      if (!selectEl) return;
      selectEl.innerHTML = '';

      const uniqueItems = [...new Set(
        (items || []).map(v => String(v || '').trim()).filter(Boolean)
      )];

      if (!uniqueItems.length) {
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = emptyLabel;
        selectEl.appendChild(opt);
        return;
      }

      uniqueItems.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item;
        opt.textContent = item;
        if (selectedValue && item === selectedValue) opt.selected = true;
        selectEl.appendChild(opt);
      });
    }

    function parseGroupList(rawGroup) {
      return [...new Set(
        String(rawGroup || '')
          .split(',')
          .map(v => v.trim())
          .filter(Boolean)
      )];
    }

    function parseCareerList(rawCareer) {
      return [...new Set(
        String(rawCareer || '')
          .split(',')
          .map(v => v.trim())
          .filter(Boolean)
      )];
    }

    async function ensureCareerModal() {
      let modal = document.getElementById('viewCareerModal');
      if (modal) return modal;

      const mount = document.getElementById('careerModalMount') || document.body;
      const res = await fetch('view-career-modal.html');
      if (!res.ok) {
        throw new Error(`Failed to load view-career-modal.html: ${res.status}`);
      }

      const html = await res.text();
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html.trim();
      mount.appendChild(wrapper);

      modal = document.getElementById('viewCareerModal');
      if (!modal) {
        throw new Error('Career modal markup was not found after loading.');
      }

      modal.querySelectorAll('[data-career-modal-close]').forEach(el => {
        el.addEventListener('click', closeCareerModal);
      });

      if (!document.body.dataset.careerModalEscBound) {
        document.addEventListener('keydown', function (event) {
          if (event.key === 'Escape') {
            const activeModal = document.getElementById('viewCareerModal');
            if (activeModal && !activeModal.hasAttribute('hidden')) {
              closeCareerModal();
            }
          }
        });
        document.body.dataset.careerModalEscBound = '1';
      }

      return modal;
    }

    function closeCareerModal() {
      const modal = document.getElementById('viewCareerModal');
      if (!modal) return;
      modal.setAttribute('hidden', '');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
    }

    function resolveCareerDetail(careerName) {
      const rawCareer = String(careerName || '').trim();
      if (!rawCareer || typeof window.getCareerDetails !== 'function') return null;

      const candidates = [rawCareer];
      const withoutTrailingCode = rawCareer.replace(/\s*\([^)]*\)\s*$/, '').trim();
      if (withoutTrailingCode && withoutTrailingCode !== rawCareer) candidates.push(withoutTrailingCode);

      const beforeSlash = withoutTrailingCode.split('/')[0].trim();
      if (beforeSlash && !candidates.includes(beforeSlash)) candidates.push(beforeSlash);

      for (const candidate of candidates) {
        const direct = window.getCareerDetails(candidate);
        if (direct) return direct;
      }

      const normalize = typeof window.normalizeCareerKey === 'function'
        ? window.normalizeCareerKey
        : function (value) {
            return String(value || '')
              .toLowerCase()
              .replace(/&/g, ' and ')
              .replace(/[^a-z0-9]+/g, ' ')
              .replace(/\s+/g, ' ')
              .trim();
          };

      const targetKeys = candidates.map(normalize).filter(Boolean);
      const map = window.CAREER_DETAILS_BY_KEY || {};

      for (const targetKey of targetKeys) {
        if (map[targetKey]) return map[targetKey];
      }

      const entries = Object.entries(map);
      for (const targetKey of targetKeys) {
        const partial = entries.find(([key, value]) => {
          const displayKey = normalize(value?.displayName || '');
          return key.includes(targetKey) || targetKey.includes(key) || displayKey === targetKey;
        });
        if (partial) return partial[1];
      }

      return null;
    }

    function getCareerModalContent(careerName, groupCode = '') {
      const safeCareer = String(careerName || '').trim() || 'Selected Career';
      const safeGroup = String(groupCode || '').trim() || '—';

      const detail = resolveCareerDetail(safeCareer);

      const firstItem =
        Array.isArray(detail?.items) && detail.items.length
          ? detail.items[0]
          : null;

      const description =
        firstItem?.description ||
        `No saved description was found yet for ${safeCareer}.`;

      const code = firstItem?.code || '';

      const extra =
        typeof window.getCareerExtraDetails === 'function'
          ? window.getCareerExtraDetails(safeCareer, safeGroup, detail)
          : null;

      const highlights =
        Array.isArray(extra?.items) && extra.items.length
          ? extra.items
          : [
              ...(safeGroup && safeGroup !== '—' ? [`Mapped Group: ${safeGroup}`] : []),
              ...(code ? [`Career Code: ${code}`] : [])
            ];

      return {
        title: detail?.displayName || safeCareer,
        subtitle: `Selected from group ${safeGroup}.`,
        groupText: `Group: ${safeGroup}`,
        tagText: code ? `Code: ${code}` : 'Career Path',
        description,
        extraTitle: extra?.title || 'Key Information',
        highlights
      };
    }

    async function openCareerModal(careerName, groupCode = '') {
      try {
        const modal = await ensureCareerModal();
        const content = getCareerModalContent(careerName, groupCode);

        const titleEl = modal.querySelector('#careerModalTitle');
        const subtitleEl = modal.querySelector('#careerModalSubtitle');
        const groupEl = modal.querySelector('#careerModalGroup');
        const tagEl = modal.querySelector('#careerModalTag');
        const descEl = modal.querySelector('#careerModalDescription');
        const extraTitleEl = modal.querySelector('#careerModalExtraTitle');
        const highlightsEl = modal.querySelector('#careerModalHighlights');

        if (titleEl) titleEl.textContent = content.title;
        if (subtitleEl) subtitleEl.textContent = content.subtitle;
        if (groupEl) groupEl.textContent = content.groupText;
        if (tagEl) tagEl.textContent = content.tagText;
        if (descEl) descEl.textContent = content.description;
        if (extraTitleEl) extraTitleEl.textContent = content.extraTitle || 'Key Information';

        if (highlightsEl) {
          highlightsEl.innerHTML = content.highlights
            .map(item => `<li>${escapeHtml(item)}</li>`)
            .join('');
        }

        modal.removeAttribute('hidden');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');

        const closeButton = modal.querySelector('.career-modal__close');
        if (closeButton) closeButton.focus();
      } catch (err) {
        console.error('Failed opening career modal:', err);
        showToast('Could not open the career modal.', true);
      }
    }

    function renderCareerInsight(careerName, latest, fieldStats, groupCode = '') {
      const resultFitEl = document.getElementById('careerModalResultFit');
      if (!resultFitEl) return;

      const safeCareer = String(careerName || '').trim();
      if (!safeCareer || !latest) {
        resultFitEl.innerHTML = '<p>The explanation will appear here when a career is selected.</p>';
        return;
      }

      const detail = resolveCareerDetail(safeCareer);
      const firstItem = Array.isArray(detail?.items) && detail.items.length ? detail.items[0] : null;
      const code = String(firstItem?.code || '').trim();

      const profileComponents = getProfileComponents(latest);
      const topThree = profileComponents.slice(0, 3);
      const derivedGroup = getDerivedGroupCodes(profileComponents);
      const bestField = fieldStats?.[0] || { label: '-', raw: 0, percent: 0, totalQuestions: 0 };
      const safeGroup = String(groupCode || latest.group_value || '-').trim() || '-';

      const codeLetters = code
        .toUpperCase()
        .match(/[NCILEM]/g) || [];

      const matchingStrengths = topThree.filter(item => codeLetters.includes(item.code));
      const nonZeroTop = topThree.filter(item => Number(item.value) > 0);

      const strongestText = nonZeroTop.length
        ? nonZeroTop.map(item => `${item.label} (${formatNumber(item.value, 1)})`).join(', ')
        : 'no strong components were detected from the saved result';

      const matchingText = matchingStrengths.length
        ? matchingStrengths.map(item => `${item.label} (${item.code})`).join(', ')
        : 'the current top components';

      const groupMatch = derivedGroup.includes(safeGroup);

      resultFitEl.innerHTML = `
        <p>
          <strong>${escapeHtml(detail?.displayName || safeCareer)}</strong> appears as a recommended career
          because it is mapped under the selected result group
          <strong>${escapeHtml(safeGroup)}</strong>.
        </p>

        <ul class="career-modal__list">
          <li>
            Based on the latest assessment result, the student's strongest components are
            <strong>${escapeHtml(strongestText)}</strong>.
          </li>

          <li>
            The highest directly scored category is
            <strong>${escapeHtml(bestField.label)}</strong>
            with
            <strong>${escapeHtml(formatNumber(bestField.raw, 1))}</strong>
            correct answers out of
            <strong>${escapeHtml(String(bestField.totalQuestions || 0))}</strong>
            or
            <strong>${escapeHtml(formatNumber(bestField.percent, 1))}%</strong>.
          </li>

          <li>
            The derived profile group from the assessment result is
            <strong>${escapeHtml(derivedGroup.join(', ') || '-')}</strong>${groupMatch
              ? ', which matches the selected group shown for this result.'
              : ', and the selected career is being shown under the currently chosen mapped group.'}
          </li>

          <li>
            This career is a relevant recommendation because its career code
            <strong>${escapeHtml(code || '-')}</strong>
            aligns with
            <strong>${escapeHtml(matchingText)}</strong>,
            which are among the student's stronger assessment areas.
          </li>

          <li>
            In simple terms, the student’s stronger assessment results point toward the
            <strong>${escapeHtml(safeGroup)}</strong> pathway, and
            <strong>${escapeHtml(detail?.displayName || safeCareer)}</strong>
            is one of the careers placed under that pathway.
          </li>
        </ul>
      `;
    }

    function renderCareerList(items, selectedValues = [], latest = null, fieldStats = []) {
      const careerList = document.getElementById('careerList');
      if (!careerList) return;

      const selectedSet = new Set(
        (Array.isArray(selectedValues) ? selectedValues : parseCareerList(selectedValues))
          .map(v => String(v || '').trim())
          .filter(Boolean)
      );

      const uniqueItems = [...new Set(
        (items || []).map(v => String(v || '').trim()).filter(Boolean)
      )];

      careerList.innerHTML = '';

      if (!uniqueItems.length) {
        careerList.innerHTML = '<div class="career-empty">No career available</div>';
        renderCareerInsight('', latest, fieldStats, '');
        dashboardState.selectedCareer = '';
        return;
      }

      const currentGroup = document.getElementById('groupSelect')?.value || '';
      const preferredCareer = uniqueItems.includes(dashboardState.selectedCareer)
        ? dashboardState.selectedCareer
        : (uniqueItems.find(item => selectedSet.has(item)) || uniqueItems[0]);

      dashboardState.selectedCareer = preferredCareer;

      uniqueItems.forEach(item => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'career-item career-button';
      button.setAttribute('title', item);
      button.setAttribute('aria-pressed', preferredCareer === item ? 'true' : 'false');

      const trackStrand =
        typeof window.getCareerTrackStrand === 'function'
          ? window.getCareerTrackStrand(item)
          : null;

      const pillText = trackStrand?.strand || trackStrand?.track || '';

      const content = document.createElement('span');
      content.className = 'career-button__content';

      const label = document.createElement('span');
      label.className = 'career-button__label';
      label.textContent = item;

      content.appendChild(label);

      if (pillText) {
        const pill = document.createElement('span');
        pill.className = 'career-button__pill';
        pill.textContent = pillText;
        pill.title = trackStrand?.track
          ? `${trackStrand.track} — ${trackStrand.strand || ''}`.replace(/ — $/, '')
          : pillText;

        content.appendChild(pill);
      }

      button.appendChild(content);

      button.addEventListener('click', async function () {
        dashboardState.selectedCareer = item;

        careerList.querySelectorAll('.career-button').forEach(btn => {
          btn.setAttribute('aria-pressed', 'false');
        });
        button.setAttribute('aria-pressed', 'false');

        const activeGroup = document.getElementById('groupSelect')?.value || currentGroup;

        await openCareerModal(item, activeGroup);
        renderCareerInsight(item, latest, fieldStats, activeGroup);
      });

      careerList.appendChild(button);
    });

      renderCareerInsight(preferredCareer, latest, fieldStats, currentGroup);
    }

    async function loadCareersForGroup(groupCode, selectedCareers = [], latest = null, fieldStats = []) {
      if (!groupCode) {
        renderCareerList([], [], latest, fieldStats);
        return;
      }

      try {
        const res = await fetch(`${BACKEND_BASE}/group-careers/${encodeURIComponent(groupCode)}`);
        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();
        const backendCareers = Array.isArray(data.careers) ? data.careers : [];

        renderCareerList(backendCareers, selectedCareers, latest, fieldStats);
      } catch (err) {
        console.error('Failed loading careers for group:', groupCode, err);
        renderCareerList([], selectedCareers, latest, fieldStats);
      }
    }

    function syncVisibleGroupDropdown(value, fallbackLabel = 'No group available') {
      const groupSelect = document.getElementById('groupSelect');
      const labelEl = document.getElementById('groupDropdownLabel');
      const menu = document.getElementById('groupDropdownMenu');
      if (!groupSelect) return;

      const options = Array.from(groupSelect.options || []);
      const matched = options.find(option => option.value === value) || null;
      const finalLabel = matched
        ? (matched.textContent || matched.label || matched.value || fallbackLabel)
        : fallbackLabel;

      if (labelEl) {
        labelEl.textContent = finalLabel;
      }

      if (menu) {
        menu.querySelectorAll('.group-dropdown__option').forEach(function (button) {
          const selected = (button.dataset.value ?? '') === String(value ?? '');
          button.classList.toggle('is-selected', selected);
          button.setAttribute('aria-selected', selected ? 'true' : 'false');
        });
      }
    }

    async function renderGroupCareerControls(latest, fieldStats) {
      const groupSelect = document.getElementById('groupSelect');

      const groups = parseGroupList(latest.group_value);
      const selectedGroup = groups[groups.length - 1] || groups[0] || '';

      if (groupSelect) {
        fillSelect(groupSelect, groups, selectedGroup, 'No group available');
        groupSelect.value = selectedGroup || '';
        syncVisibleGroupDropdown(groupSelect.value, 'No group available');

        groupSelect.onchange = async function () {
          syncVisibleGroupDropdown(groupSelect.value, 'No group available');
          await loadCareersForGroup(groupSelect.value, [], latest, fieldStats);
        };
      }

      await loadCareersForGroup(selectedGroup, [], latest, fieldStats);
      syncVisibleGroupDropdown(selectedGroup, 'No group available');
    }


  const PROFILE_COMPONENTS = [
    { code: 'N', label: 'Numerical Ability', value: latest => toNumber(latest.numerical_ability), order: 0 },
    { code: 'C', label: 'Clerical Ability', value: latest => toNumber(latest.clerical_ability), order: 1 },
    { code: 'I', label: 'Interpersonal Skills Test', value: latest => toNumber(latest.interpersonal_skills_test), order: 2 },
    {
      code: 'L',
      label: 'Logical Reasoning Combined',
      value: latest => (toNumber(latest.science_test) + toNumber(latest.logical_reasoning)) / 2,
      order: 3
    },
    {
      code: 'E',
      label: 'Entrepreneurship Combined',
      value: latest => (toNumber(latest.verbal_ability) + toNumber(latest.entrepreneurship_test)) / 2,
      order: 4
    },
    { code: 'M', label: 'Mechanical Ability', value: latest => toNumber(latest.mechanical_ability), order: 5 }
  ];

  function getProfileComponents(latest) {
    return PROFILE_COMPONENTS
      .map(item => ({
        code: item.code,
        label: item.label,
        value: item.value(latest),
        order: item.order
      }))
      .sort((a, b) => (b.value - a.value) || (a.order - b.order));
  }

  function buildOrderedGroupVariants(orderedComponents) {
    const variants = [];
    const current = [];

    function walk(startIndex) {
      for (let index = startIndex; index < orderedComponents.length; index += 1) {
        current.push(orderedComponents[index].code);
        variants.push(current.join(''));
        walk(index + 1);
        current.pop();
      }
    }

    walk(0);
    return variants;
  }

  function getDerivedGroupCodes(components) {
    const positive = components.filter(item => item.value > 0);
    const chosen = (positive.length ? positive : components.slice(0, 1)).slice(0, 3);
    const arranged = [...chosen].sort((a, b) => a.order - b.order);
    return buildOrderedGroupVariants(arranged);
  }

  function renderScoreCalculation(latest, fieldStats) {
    const box = document.getElementById('scoreCalculationBox');
    if (!box) return;

    const combinedE = (toNumber(latest.verbal_ability) + toNumber(latest.entrepreneurship_test)) / 2;

    const combinedL = (toNumber(latest.science_test) + toNumber(latest.logical_reasoning)) / 2;

    const profileComponents = getProfileComponents(latest);
    const derivedGroup = getDerivedGroupCodes(profileComponents);

    box.innerHTML = `
      <div class="formula-section">
        <h5>1. Subtest score rule</h5>
        <p>For each aptitude subtest, the score is based on the number of correct answers given by the student.</p>
        <div class="formula-code">S = C
S = Score
C = Number of Correct Answers</div>
      </div>

      <div class="formula-section">
        <h5>2. Stored raw scores from the latest attempt</h5>
        <div class="formula-grid">
          ${FIELDS.map(field => `
            <div class="formula-pill">
              <strong>${escapeHtml(field.label)}</strong>
              <span>S = C = ${escapeHtml(formatNumber(latest[field.key], 1))}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="formula-section">
        <h5>3. Combined scores used for profile grouping</h5>
        <p>The paper uses the average of Verbal Ability and Entrepreneurship Test for E, and the average of Science Test and Logical Reasoning for L.</p>
        <div class="formula-code">E = (VA + ET) / 2 = (${escapeHtml(formatNumber(latest.verbal_ability, 1))} + ${escapeHtml(formatNumber(latest.entrepreneurship_test, 1))}) / 2 = ${escapeHtml(formatNumber(combinedE, 1))}
L = (ST + LR) / 2 = (${escapeHtml(formatNumber(latest.science_test, 1))} + ${escapeHtml(formatNumber(latest.logical_reasoning, 1))}) / 2 = ${escapeHtml(formatNumber(combinedL, 1))}</div>
      </div>

      <div class="formula-section">
        <h5>4. Category percentages in the dashboard</h5>
        <p>The dashboard percentage now uses the total questions in each category as the denominator.</p>
        <div class="formula-grid">
          ${fieldStats.map(item => `
            <div class="formula-pill">
              <strong>${escapeHtml(item.label)}</strong>
              <span>${escapeHtml(formatNumber(item.raw, 1))} / ${escapeHtml(String(item.totalQuestions || 0))} × 100 = ${escapeHtml(formatNumber(item.percent, 1))}%</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="formula-section">
        <h5>5. Aptitude profile arrangement</h5>
        <p>After computing the scores, the aptitude profile is arranged under the prescribed order <strong>N, C, I, L, E, M</strong>, then the strongest one to three components form the group.</p>
        <div class="formula-code">Derived group = ${escapeHtml(derivedGroup.join(', ') || '-')}
        Stored group = ${escapeHtml(String(latest.group_value || '-'))}</div>
        <div class="formula-grid" style="margin-top:0.7rem;">
          ${profileComponents.map(item => `
            <div class="formula-pill">
              <strong>${escapeHtml(item.code)} — ${escapeHtml(item.label)}</strong>
              <span>${escapeHtml(formatNumber(item.value, 1))}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderResultExplanation(latest, fieldStats) {
    const box = document.getElementById('resultExplanationBox');
    if (!box) return;

    const profileComponents = getProfileComponents(latest);
    const derivedGroup = getDerivedGroupCodes(profileComponents);
    const topThree = profileComponents.slice(0, 3);
    const bestField = fieldStats[0] || { label: '-', raw: 0, percent: 0, totalQuestions: 0 };

    box.innerHTML = `
      <div class="explanation-section">
        <h5>Why this result appears on the dashboard</h5>
        <p>The latest saved attempt shows <strong>${escapeHtml(bestField.label)}</strong> as the strongest directly scored category with <strong>${escapeHtml(formatNumber(bestField.raw, 1))}</strong> correct answers out of <strong>${escapeHtml(String(bestField.totalQuestions || 0))}</strong>, which is <strong>${escapeHtml(formatNumber(bestField.percent, 1))}%</strong>. That is why it appears as the best category in the summary card.</p>
      </div>

      <div class="explanation-section">
        <h5>How the aptitude group was interpreted</h5>
        <ul class="explanation-list">
          <li>The raw subtest scores were first recorded using the rule <strong>S = C</strong>, where the score equals the number of correct answers.</li>
          <li>The combined scores were then formed as <strong>E = (VA + ET) / 2</strong> and <strong>L = (ST + LR) / 2</strong>.</li>
          <li>The profile was organized under <strong>N, C, I, L, E, M</strong>, and the strongest one to three components were used to form the aptitude group.</li>
          <li>Based on the latest saved values, the strongest profile components are <strong>${escapeHtml(topThree.map(item => `${item.code} (${formatNumber(item.value, 1)})`).join(', '))}</strong>.</li>
          <li>The derived group from the latest saved scores is <strong>${escapeHtml(derivedGroup.join(', ') || '-')}</strong>, while the stored group result is <strong>${escapeHtml(String(latest.group_value || '-'))}</strong>.</li>
        </ul>
      </div>

      <div class="explanation-section">
        <h5>What the current career result means</h5>
        <p>The dashboard is showing the career mapping for the stored group result <strong>${escapeHtml(String(latest.group_value || '-'))}</strong>. This means the student’s highest aptitude components matched the group pattern that the system uses to map possible academic or career directions.</p>
      </div>
    `;
  }


  async function renderSummary(profile, rows, questionTotals = null, selectedIndex = 0) {
    const safeIndex = Math.max(0, Math.min(rows.length - 1, Number(selectedIndex) || 0));
    const latest = rows[safeIndex];

    if (!latest) return;

    const previous = rows[safeIndex + 1] || null;
    const totals = questionTotals || dashboardState.questionTotals || await fetchQuestionTotals(getSupabaseClient());
    dashboardState.questionTotals = totals;
    const fieldStats = getFieldStats(latest, totals);
    const latestTotal = calculateTotal(latest);
    const previousTotal = previous ? calculateTotal(previous) : null;
    const totalQuestionsAll = fieldStats.reduce((sum, item) => sum + Math.max(0, item.totalQuestions || 0), 0);
    const overallPercent = totalQuestionsAll
      ? (latestTotal / totalQuestionsAll) * 100
      : 0;
    const bestField = fieldStats[0] || { label: '-', raw: 0, percent: 0, totalQuestions: 0 };

    setText('attemptsMadeValue', String(rows.length));
    setText('latestTotalValue', `${formatNumber(latestTotal, 0)}/${totalQuestionsAll || 0}`);
    setText('accuracyValue', `${formatNumber(overallPercent, 1)}%`);
    setText('bestCategoryValue', bestField.label);
    setText('bestCategoryMeta', `${formatNumber(bestField.raw, 1)}/${bestField.totalQuestions || 0} · ${formatNumber(bestField.percent, 1)}%`);
    setText('lastSubmittedValue', formatDateTime(latest.submitted_at));
    setText('deltaValue', previousTotal == null ? 'N/A' : formatSigned(latestTotal - previousTotal, 0));

    await renderGroupCareerControls(latest, fieldStats);

    setText('userIdBadge', `user_id: ${profile.user_id || '-'}`);
    setText('summaryName', profile.name || '-');
    setText('summaryEmail', profile.email || '-');
    setText('summarySubmittedAt', formatDateTime(latest.submitted_at));

    renderCategoryRanking(fieldStats);
    renderScoreSpider(fieldStats);
    renderAttemptHistory(rows, safeIndex);
    renderResultExplanation(latest, fieldStats);
    hideLegacyUi();
    updateReviewButtonState();
  }

  async function loadDashboard() {

    const storedProfile = getStoredProfile();

    if (!storedProfile.email && !storedProfile.user_id) {
      goToLogin();
      return;
    }

    setSidebarUser(storedProfile);
    bindSidebarHistoryToggle();
    setStatus('Loading your data from <strong>Supabase</strong>...');
    const dashboardMain = document.querySelector('.dashboard-main-grid');
    if (dashboardMain) dashboardMain.style.display = '';

    const resultSection = document.querySelector('.dashboard-insight-row');
    if (resultSection) resultSection.style.display = '';
    els.dashboardContent?.classList.add('hidden');

    try {
      const supabaseClient = getSupabaseClient();
      const profile = await resolveProfile(supabaseClient, storedProfile);
      const userId = String(profile.user_id || '');

      if (!userId) {
        throw new Error('Resolved profile has no user_id.');
      }

      const rows = await fetchResultRows(supabaseClient, userId);

      if (!rows.length) {
    document.querySelector('.overview-layout')?.classList.add('hidden');

    setStatus(`
      <div class="empty-dashboard-state">
        <h3>Welcome! You haven’t taken any assessments yet.</h3>
        <p>Start your first attempt to see results here.</p>
      </div>
    `, 'success');

    els.dashboardContent?.classList.remove('hidden');
    return;
    }
        document.querySelector('.overview-layout')?.classList.remove('hidden');

      const questionTotals = await fetchQuestionTotals(supabaseClient);
      dashboardState.profile = profile;
      dashboardState.rows = rows;
      dashboardState.questionTotals = questionTotals;
      dashboardState.selectedIndex = 0;

      await renderSummary(profile, rows, questionTotals, 0);
      els.dashboardContent?.classList.remove('hidden');
      els.dashboardStatus?.classList.add('hidden');
      showToast('Dashboard loaded.');
    } catch (error) {
      console.error(error);
      setStatus(
        `Failed to load dashboard: ${escapeHtml(error.message || String(error))}`,
        'error'
      );
      showToast('Failed to load user dashboard.', true);
    }
  }

  function wire() {
    const reviewBtn = ensureReviewButton();
    reviewBtn.addEventListener('click', openSelectedAttemptReview);
    els.refreshBtn?.addEventListener('click', loadDashboard);
    els.backBtn?.addEventListener('click', () => {
      window.location.href = ASSESSMENT_PAGE;
    });
    els.goAssessmentBtn?.addEventListener('click', () => {
      window.location.href = ASSESSMENT_PAGE;
    });
    els.showDashboardBtn?.addEventListener('click', loadDashboard);
    els.logoutBtn?.addEventListener('click', goToLogin);
  }

  wire();
  bindSidebarHistoryToggle();
  loadDashboard();
})();

function setupMobileExpandPanels() {

  const cards = document.querySelectorAll(
    '.dashboard-insight-row details'
  );

  if (!cards.length) return;

  cards.forEach(card => {
    const summary = card.querySelector('summary');

    if (!summary || summary.dataset.bound === "1") return;

    summary.dataset.bound = "1";

    summary.addEventListener('click', () => {
      setTimeout(() => {
        cards.forEach(c => {
          if (c !== card) {
            c.removeAttribute("open");
            c.classList.remove("mobile-expanded");
          }
        });

        if (card.hasAttribute("open")) {
          card.classList.add("mobile-expanded");
        } else {
          card.classList.remove("mobile-expanded");
        }
      }, 20);
    });
  });
}

window.addEventListener("load", setupMobileExpandPanels);
window.addEventListener("resize", setupMobileExpandPanels);

