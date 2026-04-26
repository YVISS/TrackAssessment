(function () {
  if (document.body?.dataset?.page !== 'user-assessment') return;

  const LOGIN_PAGE = 'login.html';
  const DASHBOARD_PAGE = 'user-dashboard.html';
  const QUESTIONS_TABLE = 'Table_Questions';
  const RESULTS_TABLE = 'student_results';
  const BACKEND_BASE = `${location.protocol}//${location.hostname}:8000`;
  const PROGRESS_PREFIX = 'msa_category_progress:';
  const RESULT_ID_KEY = 'msa_current_result_id';
  const REVIEW_PREFIX = 'msa_review_attempt:';

  const CATEGORY_ORDER = ['VA', 'NA', 'ST', 'IST', 'ET', 'LR', 'MA', 'CA'];
  const CATEGORY_LABELS = {
    VA: 'Verbal Ability',
    NA: 'Numerical Ability',
    ST: 'Science Test',
    IST: 'Interpersonal Skills Test',
    ET: 'Entrepreneurship Test',
    LR: 'Logical Reasoning',
    MA: 'Mechanical Ability',
    CA: 'Clerical Ability'
  };
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
    'verbal_ability',
    'numerical_ability',
    'science_test',
    'clerical_ability',
    'interpersonal_skills_test',
    'logical_reasoning',
    'entrepreneurship_test',
    'mechanical_ability'
  ];

  const els = {
    toast: document.getElementById('toast'),
    welcomeText: document.getElementById('welcomeText'),
    sidebarAvatar: document.getElementById('sidebarAvatar'),
    showDashboardBtn: document.getElementById('showDashboardBtn'),
    showAssessmentBtn: document.getElementById('showAssessmentBtn'),
    logoutBtn: document.getElementById('logoutBtn'),
    refreshAssessmentBtn: document.getElementById('refreshAssessmentBtn'),
    backToDashboardBtn: document.getElementById('backToDashboardBtn'),
    assessmentStatus: document.getElementById('assessmentStatus'),
    assessmentContent: document.getElementById('assessmentContent'),
    tableBadge: document.getElementById('tableBadge'),
    sectionBadge: document.getElementById('sectionBadge'),
    progressCounter: document.getElementById('progressCounter'),
    progressBar: document.getElementById('progressBar'),
    progressText: document.getElementById('progressText'),
    answeredText: document.getElementById('answeredText'),
    currentCategoryTitle: document.getElementById('currentCategoryTitle'),
    currentCategoryCountBadge: document.getElementById('currentCategoryCountBadge'),
    currentCategorySummary: document.getElementById('currentCategorySummary'),
    categoryStepper: document.getElementById('categoryStepper'),
    categoryQuestionsContainer: document.getElementById('categoryQuestionsContainer'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    submitBtn: document.getElementById('submitBtn'),
    quizMessage: document.getElementById('quizMessage'),
    resumeModal: document.getElementById('resumeModal'),
    resumeBtn: document.getElementById('resumeBtn'),
    restartBtn: document.getElementById('restartBtn'),
    submitModal: document.getElementById('submitModal'),
    submitModalText: document.getElementById('submitModalText'),
    confirmSubmitBtn: document.getElementById('confirmSubmitBtn'),
    cancelSubmitBtn: document.getElementById('cancelSubmitBtn'),
    backConfirmModal: document.getElementById('backConfirmModal'),
    confirmBackBtn: document.getElementById('confirmBackBtn'),
    cancelBackBtn: document.getElementById('cancelBackBtn')
  };

  const state = {
    profile: null,
    userId: '',
    allQuestions: [],
    groupedQuestions: {},
    categories: [],
    categoryIndex: 0,
    answers: {},
    invalidQuestionIds: new Set(),
    loaded: false
  };

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function showToast(message, isError = false) {
    if (!els.toast) return;

    els.toast.textContent = message || '';
    els.toast.classList.remove('hidden', 'error', 'show', 'toast-out');

    if (isError) {
      els.toast.classList.add('error');
    }

    requestAnimationFrame(() => {
      els.toast.classList.add('show');
    });

    clearTimeout(showToast._hideTimer);
    clearTimeout(showToast._cleanupTimer);

    showToast._hideTimer = setTimeout(() => {
      els.toast.classList.remove('show');
      els.toast.classList.add('toast-out');
    }, 4600);

    showToast._cleanupTimer = setTimeout(() => {
      els.toast.classList.add('hidden');
      els.toast.classList.remove('toast-out', 'error');
      els.toast.textContent = '';
    }, 5000);
  }

  function setStatus(html, mode = '') {
    if (!els.assessmentStatus) return;
    els.assessmentStatus.innerHTML = html;
    els.assessmentStatus.classList.remove('hidden', 'is-error', 'is-success');
    if (mode === 'error') els.assessmentStatus.classList.add('is-error');
    if (mode === 'success') els.assessmentStatus.classList.add('is-success');
  }

  function setMessage(message, mode = '') {
    const isError = mode === 'error';
    showToast(message, isError);
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

    if (!url || !anonKey || /YOUR-PROJECT-REF|YOUR_SUPABASE_ANON_KEY/i.test(`${url} ${anonKey}`)) {
      throw new Error('Supabase config not found in supabase-config.js');
    }

    window.supabaseClient = window.supabase.createClient(url, anonKey);
    return window.supabaseClient;
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

  function clearSessionAndGoLogin() {
    sessionStorage.removeItem('user_profile');
    sessionStorage.removeItem('user_id');
    sessionStorage.removeItem('user_email');
    sessionStorage.removeItem('user_name');
    sessionStorage.removeItem(RESULT_ID_KEY);
    window.location.href = LOGIN_PAGE;
  }

  function setSidebarUser(profile) {
    const displayName = profile?.name || profile?.email || 'User';
    if (els.welcomeText) els.welcomeText.textContent = displayName;
    if (els.sidebarAvatar) {
      els.sidebarAvatar.textContent = String(displayName).trim().charAt(0).toUpperCase() || 'U';
    }
  }

  function normalizeAnswerToken(value) {
    const raw = String(value ?? '').trim();
    if (!raw) return '';
    const simplified = raw.replace(/^option\s*/i, '').replace(/[).:]/g, '').trim();
    if (/^[A-E]$/i.test(simplified)) return simplified.toUpperCase();
    return raw.trim().toLowerCase();
  }

  function extractCategoryCode(questionId) {
    const raw = String(questionId || '').trim().toUpperCase();
    if (!raw) return '';
    for (const code of CATEGORY_ORDER) {
      if (raw === code) return code;
      if (raw.startsWith(code)) return code;
    }
    return '';
  }

  function looksLikeImage(value) {
    const v = String(value || '').trim();
    if (!v) return false;

    if (/^data:image\//i.test(v)) return true;

    return /^https?:\/\//i.test(v) &&
      (
        /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(v) ||
        /\/storage\/v1\/object\/public\//i.test(v)
      );
  }

  function parseQuestion(row, index) {
    const id = String(row.id ?? row.uuid ?? row.question_id ?? index + 1);
    const questionId = String(row.question_id || '').trim();
    const categoryCode = extractCategoryCode(questionId);

    const questionMain = String(row.question || '').trim();
    const questionLong = String(row.long_text || '').trim();
    const imageUrl = String(row.image_url || '').trim();

    const mainIsImage = looksLikeImage(questionMain);
    const longIsImage = looksLikeImage(questionLong);
    const imageUrlIsImage = looksLikeImage(imageUrl);

    const text =
      !mainIsImage && questionMain ? questionMain :
      !longIsImage && questionLong ? questionLong :
      `Question ${index + 1}`;

    const image =
      imageUrlIsImage ? imageUrl :
      mainIsImage ? questionMain :
      longIsImage ? questionLong :
      '';

    const options = [
      { key: 'A', value: row.opt_a },
      { key: 'B', value: row.opt_b },
      { key: 'C', value: row.opt_c },
      { key: 'D', value: row.opt_d },
      { key: 'E', value: row.opt_e }
    ]
      .map(opt => {
        const raw = String(opt.value || '').trim();
        if (!raw) return null;

        const isImage = looksLikeImage(raw);

        return {
          key: opt.key,
          text: isImage ? '' : raw,
          image: isImage ? raw : ''
        };
      })
      .filter(Boolean);

    return {
      id,
      order: index + 1,
      questionId,
      categoryCode,
      categoryLabel: CATEGORY_LABELS[categoryCode] || 'Unknown Category',
      text,
      image,
      options,
      correctToken: normalizeAnswerToken(row.answer),
      raw: row
    };
  }

  async function resolveProfile(supabaseClient, storedProfile) {
    const directUserId = storedProfile.user_id || sessionStorage.getItem('user_id') || '';
    if (directUserId) {
      return {
        user_id: String(directUserId).trim(),
        email: storedProfile.email || sessionStorage.getItem('user_email') || '',
        name: storedProfile.name || sessionStorage.getItem('user_name') || ''
      };
    }

    const email = storedProfile.email || sessionStorage.getItem('user_email') || '';
    if (!email) throw new Error('No user_id or email found in sessionStorage.');

    const { data, error } = await supabaseClient
      .from('users_profile')
      .select('user_id, email, name')
      .eq('email', email)
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!data?.user_id) throw new Error('Could not resolve the current user from users_profile.');

    sessionStorage.setItem('user_id', String(data.user_id));
    sessionStorage.setItem('user_email', data.email || email);
    if (data.name) sessionStorage.setItem('user_name', data.name);
    sessionStorage.setItem('user_profile', JSON.stringify(data));
    return data;
  }

  async function fetchQuestions(supabaseClient) {
    const { data, error } = await supabaseClient
      .from(QUESTIONS_TABLE)
      .select('id, question_id, question, long_text, opt_a, opt_b, opt_c, opt_d, opt_e, answer, created_at, created_by, image_url, uuid')
      .order('id', { ascending: true });

    if (error) throw error;

    const rows = (data || [])
      .map(parseQuestion)
      .filter(q => q.categoryCode && (q.text || q.image) && q.options.length);

    const grouped = {};
    for (const code of CATEGORY_ORDER) {
      grouped[code] = rows.filter(q => q.categoryCode === code);
    }

    return { rows, grouped };
  }

  function currentCategoryCode() {
    return state.categories[state.categoryIndex] || '';
  }

  function currentCategoryQuestions() {
    return state.groupedQuestions[currentCategoryCode()] || [];
  }

  function getProgressKey() {
    return PROGRESS_PREFIX + String(state.userId || 'guest');
  }

  function saveProgress() {
    const payload = {
      categoryIndex: state.categoryIndex,
      answers: state.answers,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(getProgressKey(), JSON.stringify(payload));
  }

  function clearProgress() {
    localStorage.removeItem(getProgressKey());
  }

  function loadSavedProgress() {
    const raw = localStorage.getItem(getProgressKey());
    if (!raw) return false;
    try {
      const parsed = JSON.parse(raw);
      state.categoryIndex = Math.max(0, Math.min(Number(parsed.categoryIndex) || 0, Math.max(state.categories.length - 1, 0)));
      state.answers = parsed.answers || {};
      return true;
    } catch {
      return false;
    }
  }

  function getAnsweredCountForCategory(categoryCode) {
    const questions = state.groupedQuestions[categoryCode] || [];
    return questions.filter(question => !!state.answers[question.id]).length;
  }

  function getOverallAnsweredCount() {
    return state.allQuestions.filter(question => !!state.answers[question.id]).length;
  }

  function updateProgressUi() {
    const categoryCode = currentCategoryCode();
    const categoryQuestions = currentCategoryQuestions();
    const totalCategories = state.categories.length;
    const answeredInCategory = getAnsweredCountForCategory(categoryCode);
    const totalInCategory = categoryQuestions.length;
    const overallAnswered = getOverallAnsweredCount();
    const overallTotal = state.allQuestions.length;
    const percent = overallTotal ? Math.round((overallAnswered / overallTotal) * 100) : 0;

    if (els.tableBadge) els.tableBadge.textContent = QUESTIONS_TABLE;
    if (els.sectionBadge) els.sectionBadge.textContent = `${categoryCode} · ${CATEGORY_LABELS[categoryCode] || ''}`;
    if (els.progressCounter) els.progressCounter.textContent = `Category ${state.categoryIndex + 1} of ${totalCategories}`;
    if (els.progressText) els.progressText.textContent = `Current category: ${answeredInCategory} of ${totalInCategory} answered`;
    if (els.answeredText) els.answeredText.textContent = `Overall: ${overallAnswered} of ${overallTotal} answered`;
    if (els.progressBar) els.progressBar.style.width = `${percent}%`;

    if (els.currentCategoryTitle) {
      els.currentCategoryTitle.textContent = CATEGORY_LABELS[categoryCode] || 'Assessment Category';
    }
    if (els.currentCategoryCountBadge) {
      els.currentCategoryCountBadge.textContent = `${totalInCategory} Question${totalInCategory === 1 ? '' : 's'}`;
    }
    if (els.currentCategorySummary) {
      els.currentCategorySummary.textContent = `Answer every question in ${CATEGORY_LABELS[categoryCode] || categoryCode} before continuing to the next category.`;
    }

    if (els.prevBtn) {
      els.prevBtn.disabled = state.categoryIndex === 0;
    }

    const atLastCategory = state.categoryIndex === totalCategories - 1;

    if (els.nextBtn) {
      els.nextBtn.classList.toggle('hidden', atLastCategory);
      els.nextBtn.textContent = 'Next Category';
    }

    if (els.submitBtn) {
      els.submitBtn.classList.toggle('hidden', !atLastCategory);
    }
  }

  function renderCategoryStepper() {
    if (!els.categoryStepper) return;
    const currentCode = currentCategoryCode();

    els.categoryStepper.innerHTML = state.categories.map((code, index) => {
      const total = (state.groupedQuestions[code] || []).length;
      const answered = getAnsweredCountForCategory(code);
      const classes = ['category-step'];

      if (code === currentCode) classes.push('is-active');
      if (answered === total && total > 0) classes.push('is-complete');
      if (index > state.categoryIndex) classes.push('is-locked');

      return `
        <div class="${classes.join(' ')}" aria-current="${code === currentCode ? 'step' : 'false'}">
          <div class="category-step-name">${escapeHtml(code)} · ${escapeHtml(CATEGORY_LABELS[code] || code)}</div>
          <div class="category-step-meta">${answered} / ${total} answered</div>
        </div>
      `;
    }).join('');
  }

  function renderOptions(question, selectedKey) {
    return question.options.map(option => {
      const checked = selectedKey === option.key;
      return `
        <label class="option-item${checked ? ' selected' : ''}">
          <input
            class="option-radio"
            type="radio"
            name="question-${escapeHtml(question.id)}"
            value="${escapeHtml(option.key)}"
            ${checked ? 'checked' : ''}
          />
          <span class="option-marker">${escapeHtml(option.key)}</span>
          <span class="option-content">
            ${
              option.image
                ? `<img class="option-image" src="${escapeHtml(option.image)}" alt="Option ${escapeHtml(option.key)}" />`
                : `<span class="option-text">${escapeHtml(option.text)}</span>`
            }
          </span>
        </label>
      `;
    }).join('');
  }

  function renderCategoryQuestions() {
    if (!els.categoryQuestionsContainer) return;

    const questions = currentCategoryQuestions();
    const categoryCode = currentCategoryCode();

    if (!questions.length) {
      els.categoryQuestionsContainer.innerHTML = `
        <section class="card question-card">
          <div class="question-title-row">
            <h3>No questions found</h3>
          </div>
          <p class="question">No questions were found for ${escapeHtml(CATEGORY_LABELS[categoryCode] || categoryCode)}.</p>
        </section>
      `;
      return;
    }

    els.categoryQuestionsContainer.innerHTML = questions.map((question, index) => {
      const answer = state.answers[question.id] || {};
      const isUnanswered = state.invalidQuestionIds.has(question.id);

      return `
        <section
          id="question-card-${escapeHtml(question.id)}"
          class="card question-card${isUnanswered ? ' unanswered' : ''}"
          data-question-id="${escapeHtml(question.id)}"
        >
          <div class="question-title-row">
            <h3>${escapeHtml(question.categoryCode)} · Question ${index + 1}</h3>
            ${isUnanswered ? '<span class="question-required-badge">Unanswered question</span>' : `<span class="pill">${question.options.length} choices</span>`}
          </div>
          <p class="question">${escapeHtml(question.text)}</p>
          ${question.image && looksLikeImage(question.image)
            ? `<img class="question-image" src="${escapeHtml(question.image)}" alt="Question illustration" />`
            : ''}
          <div class="options" role="radiogroup" aria-label="Answer choices for question ${index + 1}">
            ${renderOptions(question, answer.choiceKey || '')}
          </div>
        </section>
      `;
    }).join('');

    questions.forEach(question => {
      const questionEl = els.categoryQuestionsContainer.querySelector(`[data-question-id="${CSS.escape(question.id)}"]`);
      if (!questionEl) return;

      const radios = questionEl.querySelectorAll('input.option-radio');
      radios.forEach(radio => {
        radio.addEventListener('change', () => {
          const option = question.options.find(item => item.key === radio.value);
          if (!option) return;

          state.answers[question.id] = {
            categoryCode: question.categoryCode,
            choiceKey: option.key,
            choiceText: option.text || '',
            updatedAt: new Date().toISOString()
          };

          state.invalidQuestionIds.delete(question.id);
          saveProgress();
          renderCategory();
        });
      });
    });
  }

  function renderCategory() {
    const categoryCode = currentCategoryCode();
    if (!categoryCode) {
      setStatus('No assessment categories are available.', 'error');
      return;
    }

    updateProgressUi();
    renderCategoryStepper();
    renderCategoryQuestions();
  }

  function openResumeModal() {
    els.resumeModal?.classList.remove('hidden');
    document.body.classList.add('modal-open');
  }

  function closeResumeModal() {
    els.resumeModal?.classList.add('hidden');
    if (els.submitModal?.classList.contains('hidden') && els.backConfirmModal?.classList.contains('hidden')) {
      document.body.classList.remove('modal-open');
    }
  }

  function openSubmitModal() {
    const totalQuestions = state.allQuestions.length;
    const answered = getOverallAnsweredCount();
    if (els.submitModalText) {
      els.submitModalText.textContent = `You answered ${answered} of ${totalQuestions} questions. Submit final results?`;
    }
    els.submitModal?.classList.remove('hidden');
    document.body.classList.add('modal-open');
  }

  function closeSubmitModal() {
    els.submitModal?.classList.add('hidden');
    if (els.resumeModal?.classList.contains('hidden') && els.backConfirmModal?.classList.contains('hidden')) {
      document.body.classList.remove('modal-open');
    }
  }

  function openBackConfirmModal() {
    els.backConfirmModal?.classList.remove('hidden');
    document.body.classList.add('modal-open');
  }

  function closeBackConfirmModal() {
    els.backConfirmModal?.classList.add('hidden');
    if (els.resumeModal?.classList.contains('hidden') && els.submitModal?.classList.contains('hidden')) {
      document.body.classList.remove('modal-open');
    }
  }

  function scrollToQuestion(questionId) {
    const selector = `#question-card-${CSS.escape(questionId)}`;
    const el = document.querySelector(selector);
    if (!el) return;

    el.classList.remove('flash-unanswered');
    void el.offsetWidth;
    el.classList.add('flash-unanswered');

    el.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }

  function scrollPageToTop() {
    const target = document.querySelector('.assessment-shell') || document.querySelector('.page') || document.body;

    try {
      target?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } catch {}

    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      window.scrollTo(0, 0);
    }

    requestAnimationFrame(() => {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {
        window.scrollTo(0, 0);
      }
    });
  }

  function validateCurrentCategory() {
    const questions = currentCategoryQuestions();
    const unanswered = questions.filter(question => !state.answers[question.id]);

    state.invalidQuestionIds = new Set(unanswered.map(question => question.id));

    if (unanswered.length) {
      renderCategory();
      showToast(`Please answer all unanswered questions in ${CATEGORY_LABELS[currentCategoryCode()]}.`, true);
      scrollToQuestion(unanswered[0].id);
      return false;
    }

    renderCategory();
    return true;
  }

  function normalizeMatch(text) {
    return String(text ?? '').trim().toLowerCase();
  }

  function isCorrect(question, savedAnswer) {
    if (!question.correctToken || !savedAnswer) return false;
    if (/^[A-E]$/.test(question.correctToken)) {
      return savedAnswer.choiceKey === question.correctToken;
    }
    return normalizeMatch(savedAnswer.choiceText) === normalizeMatch(question.correctToken);
  }

  function computeCategoryScore(categoryCode) {
    const questions = state.groupedQuestions[categoryCode] || [];
    let correct = 0;
    for (const q of questions) {
      if (isCorrect(q, state.answers[q.id])) correct += 1;
    }
    return correct;
  }

  function computeAllScores() {
    const scores = Object.fromEntries(FIELDS.map(field => [field, 0]));
    for (const code of state.categories) {
      const field = CATEGORY_TO_FIELD[code];
      if (!field) continue;
      scores[field] = computeCategoryScore(code);
    }
    return scores;
  }

  function generateResultId() {
    try {
      if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    } catch {}
    return `res_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }

  function toNumber(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  function getProfileComponentsFromScores(scores) {
    return [
      { code: 'N', value: toNumber(scores.numerical_ability), order: 0 },
      { code: 'C', value: toNumber(scores.clerical_ability), order: 1 },
      { code: 'I', value: toNumber(scores.interpersonal_skills_test), order: 2 },
      {
        code: 'L',
        value: (toNumber(scores.science_test) + toNumber(scores.logical_reasoning)) / 2,
        order: 3
      },
      {
        code: 'E',
        value: (toNumber(scores.verbal_ability) + toNumber(scores.entrepreneurship_test)) / 2,
        order: 4
      },
      { code: 'M', value: toNumber(scores.mechanical_ability), order: 5 }
    ];
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

  function deriveGroupCodes(scores) {
    const components = getProfileComponentsFromScores(scores);

    const ranked = [...components].sort((a, b) => {
      if (b.value !== a.value) return b.value - a.value;
      return a.order - b.order;
    });

    const positive = ranked.filter(item => item.value > 0);
    const topComponents = (positive.length ? positive : ranked.slice(0, 1)).slice(0, 3);

    // Final arrangement must always follow the fixed order:
    // N -> C -> I -> L -> E -> M
    // Example: strongest I, E, L becomes ordered I, L, E.
    const arranged = [...topComponents].sort((a, b) => a.order - b.order);

    // Return all ordered group variants:
    // I, L, E, IL, IE, LE, ILE
    return buildOrderedGroupVariants(arranged);
  }


  function getReviewStorageKey(resultId) {
    return REVIEW_PREFIX + String(resultId || '').trim();
  }

  function findCorrectOptionForSnapshot(question) {
    const options = Array.isArray(question?.options) ? question.options : [];
    const token = String(question?.correctToken || '').trim();
    if (!token) return null;

    if (/^[A-E]$/i.test(token)) {
      return options.find(option => String(option?.key || '').trim().toUpperCase() === token.toUpperCase()) || null;
    }

    const normalized = normalizeMatch(token);
    return options.find(option => normalizeMatch(option?.text || '') === normalized) || null;
  }

  function buildAttemptReviewSnapshot(resultId, submittedAt, scores, groupCodes, careers) {
    const snapshotCategories = state.categories.map((categoryCode, categoryIndex) => {
      const questions = (state.groupedQuestions[categoryCode] || []).map((question, questionIndex) => {
        const savedAnswer = state.answers[question.id] || {};
        const selectedOption = question.options.find(option => option.key === savedAnswer.choiceKey) || null;
        const correctKey = /^[A-E]$/i.test(String(question.correctToken || '').trim())
          ? String(question.correctToken || '').trim().toUpperCase()
          : '';

        return {
          id: question.id,
          order: questionIndex + 1,
          question_id: question.questionId,
          category_code: categoryCode,
          category_label: CATEGORY_LABELS[categoryCode] || categoryCode,
          text: question.text || '',
          image: question.image || '',
          options: question.options.map(option => ({
            key: option.key,
            text: option.text || '',
            image: option.image || '',
            is_correct: !!(correctKey && String(option.key || '').trim().toUpperCase() === correctKey)
          })),
          answered_choice_key: savedAnswer.choiceKey || '',
          answered_choice_text: savedAnswer.choiceText || selectedOption?.text || '',
          answered_choice_image: selectedOption?.image || '',
          answered_display: savedAnswer.choiceKey
            ? `${savedAnswer.choiceKey}${savedAnswer.choiceText ? ` - ${savedAnswer.choiceText}` : ''}`
            : (savedAnswer.choiceText || ''),
          correct_choice_key: correctKey,
          correct_choice_text: '',
          correct_choice_image: '',
          is_correct: isCorrect(question, savedAnswer)
        };
      });

      return {
        code: categoryCode,
        label: CATEGORY_LABELS[categoryCode] || categoryCode,
        index: categoryIndex,
        question_count: questions.length,
        answered_count: questions.filter(item => item.answered_choice_key || item.answered_choice_text).length,
        correct_count: questions.filter(item => item.is_correct === true).length,
        questions
      };
    });

    return {
      result_id: resultId,
      user_id: state.userId,
      submitted_at: submittedAt || new Date().toISOString(),
      saved_at: new Date().toISOString(),
      group_codes: Array.isArray(groupCodes) ? groupCodes : [],
      careers: Array.isArray(careers) ? careers : [],
      scores: { ...scores },
      categories: snapshotCategories
    };
  }

  function saveAttemptReviewSnapshot(resultId, submittedAt, scores, groupCodes, careers) {
    if (!resultId) return;
    try {
      const snapshot = buildAttemptReviewSnapshot(resultId, submittedAt, scores, groupCodes, careers);
      localStorage.setItem(getReviewStorageKey(resultId), JSON.stringify(snapshot));
    } catch (error) {
      console.warn('Could not save local review snapshot for attempt:', error);
    }
  }

  async function fetchCareersForGroup(groupCode) {
    if (!groupCode) return [];

    try {
      const res = await fetch(`${BACKEND_BASE}/group-careers/${encodeURIComponent(groupCode)}`);
      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      return [...new Set(
        (Array.isArray(data.careers) ? data.careers : [])
          .map(item => String(item || '').trim())
          .filter(Boolean)
      )];
    } catch (error) {
      console.warn('Could not load careers for group during assessment submit:', error);
      return [];
    }
  }

  async function ensureResultRow(supabaseClient) {
    const cachedResultId = String(sessionStorage.getItem(RESULT_ID_KEY) || '').trim();

    if (cachedResultId) {
      const { data, error } = await supabaseClient
        .from(RESULTS_TABLE)
        .select('result_id')
        .eq('result_id', cachedResultId)
        .eq('user_id', state.userId)
        .limit(1)
        .maybeSingle();

      if (!error && data?.result_id) {
        return cachedResultId;
      }
    }

    const resultId = generateResultId();
    const insertPayload = {
      id: resultId,
      result_id: resultId,
      user_id: state.userId,
      submitted_at: new Date().toISOString(),
      verbal_ability: 0
    };

    const { error } = await supabaseClient
      .from(RESULTS_TABLE)
      .insert(insertPayload);

    if (error) throw error;

    sessionStorage.setItem(RESULT_ID_KEY, resultId);
    return resultId;
  }

  async function saveCurrentCategoryToResults(supabaseClient) {
    const categoryCode = currentCategoryCode();
    const field = CATEGORY_TO_FIELD[categoryCode];
    if (!field) return;

    const resultId = await ensureResultRow(supabaseClient);
    const scores = computeAllScores();

    const updatePayload = {
      submitted_at: new Date().toISOString(),
      [field]: scores[field],
      va_et: (scores.verbal_ability + scores.entrepreneurship_test) / 2,
      st_lr: (scores.science_test + scores.logical_reasoning) / 2
    };

    const { error } = await supabaseClient
      .from(RESULTS_TABLE)
      .update(updatePayload)
      .eq('result_id', resultId);

    if (error) {
      const fallbackPayload = { ...updatePayload };
      delete fallbackPayload.va_et;
      delete fallbackPayload.st_lr;
      const fallback = await supabaseClient
        .from(RESULTS_TABLE)
        .update(fallbackPayload)
        .eq('result_id', resultId);

      if (fallback.error) throw fallback.error;
    }
  }

  async function goNext() {
    if (!validateCurrentCategory()) return;

    const atLastCategory = state.categoryIndex === state.categories.length - 1;
    if (atLastCategory) {
      openSubmitModal();
      return;
    }

    // Do not write partial category progress into student_results.
    // Unfinished work stays in localStorage only and is written to Supabase
    // only during the real final submit.
    state.invalidQuestionIds = new Set();
    state.categoryIndex += 1;
    saveProgress();
    renderCategory();
    showToast(`Moving to ${CATEGORY_LABELS[currentCategoryCode()]}.`);
    scrollPageToTop();
  }

  function goPrevious() {
    if (state.categoryIndex <= 0) return;
    state.invalidQuestionIds = new Set();
    state.categoryIndex -= 1;
    saveProgress();
    renderCategory();
    scrollPageToTop();
  }

  function findFirstUnansweredAcrossAll() {
    for (let categoryIndex = 0; categoryIndex < state.categories.length; categoryIndex += 1) {
      const code = state.categories[categoryIndex];
      const questions = state.groupedQuestions[code] || [];
      const first = questions.find(question => !state.answers[question.id]);
      if (first) {
        return { categoryIndex, questionId: first.id, categoryCode: code };
      }
    }
    return null;
  }

  async function submitFinalResults() {
    closeSubmitModal();

    const firstUnanswered = findFirstUnansweredAcrossAll();
    if (firstUnanswered) {
      state.categoryIndex = firstUnanswered.categoryIndex;
      state.invalidQuestionIds = new Set([firstUnanswered.questionId]);
      saveProgress();
      renderCategory();
      showToast(`Please complete ${CATEGORY_LABELS[firstUnanswered.categoryCode]} before submitting.`, true);
      scrollToQuestion(firstUnanswered.questionId);
      return;
    }

    const supabaseClient = getSupabaseClient();
    const resultId = await ensureResultRow(supabaseClient);
    const scores = computeAllScores();

    const groupCodes = deriveGroupCodes(scores);
    const primaryGroupCode = groupCodes[groupCodes.length - 1] || '';
    const careers = await fetchCareersForGroup(primaryGroupCode);

    const finalPayload = {
      submitted_at: new Date().toISOString(),
      verbal_ability: scores.verbal_ability,
      numerical_ability: scores.numerical_ability,
      science_test: scores.science_test,
      clerical_ability: scores.clerical_ability,
      interpersonal_skills_test: scores.interpersonal_skills_test,
      logical_reasoning: scores.logical_reasoning,
      entrepreneurship_test: scores.entrepreneurship_test,
      mechanical_ability: scores.mechanical_ability,
      va_et: (scores.verbal_ability + scores.entrepreneurship_test) / 2,
      st_lr: (scores.science_test + scores.logical_reasoning) / 2,
      group: groupCodes.join(', ') || null
    };

    const { error } = await supabaseClient
      .from(RESULTS_TABLE)
      .update(finalPayload)
      .eq('result_id', resultId);

    if (error) {
      const fallbackPayload = { ...finalPayload };
      delete fallbackPayload.va_et;
      delete fallbackPayload.st_lr;
      const fallback = await supabaseClient
        .from(RESULTS_TABLE)
        .update(fallbackPayload)
        .eq('result_id', resultId);

      if (fallback.error) throw fallback.error;
    }

    saveAttemptReviewSnapshot(resultId, finalPayload.submitted_at, scores, groupCodes, careers);
    clearProgress();
    sessionStorage.removeItem(RESULT_ID_KEY);
    sessionStorage.setItem(
      'latest_assessment_submission',
      JSON.stringify({
        result_id: resultId,
        careers,
        ...finalPayload
      })
    );
    setMessage('Assessment submitted successfully. Redirecting to dashboard...', 'success');
    showToast('Assessment submitted.');
    setTimeout(() => {
      window.location.href = DASHBOARD_PAGE;
    }, 1200);
  }

  async function boot() {
    try {
      const storedProfile = getStoredProfile();
      if (!storedProfile.email && !storedProfile.user_id) {
        clearSessionAndGoLogin();
        return;
      }

      const supabaseClient = getSupabaseClient();
      const profile = await resolveProfile(supabaseClient, storedProfile);
      state.profile = profile;
      state.userId = String(profile.user_id || '').trim();
      setSidebarUser(profile);

      // Clear any stale draft result id from the previous partial-save behavior.
      // This page now keeps unfinished progress locally until final submit.
      sessionStorage.removeItem(RESULT_ID_KEY);

      setStatus('Loading questions from <strong>Table_Questions</strong>...');
      const { rows, grouped } = await fetchQuestions(supabaseClient);

      if (!rows.length) {
        setStatus('No valid question rows were found in <strong>Table_Questions</strong>.', 'error');
        showToast('No assessment questions found.', true);
        return;
      }

      state.allQuestions = rows;
      state.groupedQuestions = grouped;
      state.categories = CATEGORY_ORDER.filter(code => Array.isArray(grouped[code]) && grouped[code].length > 0);
      state.loaded = true;

      if (!state.categories.length) {
        setStatus('Questions were loaded, but no valid categories were available.', 'error');
        showToast('No assessment categories found.', true);
        return;
      }

      if (loadSavedProgress()) {
        openResumeModal();
      } else {
        renderCategory();
      }

      els.assessmentContent?.classList.remove('hidden');
      els.assessmentStatus?.classList.add('hidden');
      showToast('Assessment loaded.');
    } catch (error) {
      console.error(error);
      setStatus(`Failed to load assessment: ${escapeHtml(error.message || String(error))}`, 'error');
      showToast('Failed to load assessment.', true);
    }
  }

  function wire() {
    els.showDashboardBtn?.addEventListener('click', () => {
      openBackConfirmModal();
    });
    els.showAssessmentBtn?.addEventListener('click', () => {
      window.location.href = 'user-assessment.html';
    });
    els.logoutBtn?.addEventListener('click', clearSessionAndGoLogin);
    els.backToDashboardBtn?.addEventListener('click', () => {
      openBackConfirmModal();
    });
    els.refreshAssessmentBtn?.addEventListener('click', () => window.location.reload());

    els.prevBtn?.addEventListener('click', () => {
      goPrevious();
    });

    els.nextBtn?.addEventListener('click', () => {
      goNext().catch(error => {
        console.error(error);
        setMessage(`Could not move to next category: ${error.message || error}`, 'error');
        showToast('Next category save failed.', true);
      });
    });

    els.submitBtn?.addEventListener('click', () => {
      if (!validateCurrentCategory()) return;
      openSubmitModal();
    });

    els.confirmSubmitBtn?.addEventListener('click', () => {
      submitFinalResults().catch(error => {
        console.error(error);
        setMessage(`Submit failed: ${error.message || error}`, 'error');
        showToast('Submit failed.', true);
      });
    });

    els.cancelSubmitBtn?.addEventListener('click', closeSubmitModal);

    els.confirmBackBtn?.addEventListener('click', () => {
      window.location.href = DASHBOARD_PAGE;
    });
    els.cancelBackBtn?.addEventListener('click', closeBackConfirmModal);

    els.backConfirmModal?.addEventListener('click', (event) => {
      if (event.target === els.backConfirmModal) {
        closeBackConfirmModal();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeSubmitModal();
        closeResumeModal();
        closeBackConfirmModal();
      }
    });

    els.resumeBtn?.addEventListener('click', () => {
      closeResumeModal();
      renderCategory();
      setMessage('Resumed your unfinished attempt.', 'success');
    });

    els.restartBtn?.addEventListener('click', () => {
      clearProgress();
      sessionStorage.removeItem(RESULT_ID_KEY);
      state.answers = {};
      state.categoryIndex = 0;
      state.invalidQuestionIds = new Set();
      closeResumeModal();
      renderCategory();
      setMessage('Started a fresh attempt.', 'success');
    });
  }

  wire();
  boot();
})();