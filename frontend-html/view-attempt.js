(function () {
  if (document.body?.dataset?.page !== 'view-attempt') return;

  const REVIEW_PREFIX = 'msa_review_attempt:';

  const els = {
    pageTitle: document.getElementById('pageTitle'),
    pageSubtitle: document.getElementById('pageSubtitle'),
    categoryCountValue: document.getElementById('categoryCountValue'),
    answeredCountValue: document.getElementById('answeredCountValue'),
    categoryToolbar: document.getElementById('categoryToolbar'),
    reviewContent: document.getElementById('reviewContent'),
    emptyState: document.getElementById('emptyState'),
    emptyMessage: document.getElementById('emptyMessage'),
    backToTopBtn: document.getElementById('backToTopBtn')
  };

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function formatDateTime(value) {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString();
  }

  function getResultIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return String(params.get('result_id') || '').trim();
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

  function showEmpty(message) {
    els.reviewContent.classList.add('hidden');
    els.emptyState.classList.remove('hidden');
    els.emptyMessage.innerHTML = message;
    els.pageTitle.textContent = 'View Attempt';
    els.pageSubtitle.textContent = 'No local review snapshot was found for this attempt.';
    els.categoryCountValue.textContent = '-';
    els.answeredCountValue.textContent = '-';
    els.categoryToolbar.innerHTML = '';
  }

  function getQuestionResultState(question) {
    if (typeof question?.is_correct === 'boolean') {
      return question.is_correct ? 'correct' : 'wrong';
    }
    return 'neutral';
  }

  function findCorrectOption(question) {
    const options = Array.isArray(question?.options) ? question.options : [];
    const explicitKey = String(
      question?.correct_choice_key ??
      question?.correct_answer_key ??
      question?.correct_key ??
      ''
    ).trim().toUpperCase();

    if (explicitKey) {
      return options.find(option => String(option?.key || '').trim().toUpperCase() === explicitKey) || null;
    }

    return options.find(option =>
      option?.is_correct === true ||
      option?.correct === true ||
      option?.isCorrect === true
    ) || null;
  }

  function buildCorrectAnswerHtml(question) {
    const correctKey = String(
      question?.correct_choice_key ??
      question?.correct_answer_key ??
      question?.correct_key ??
      ''
    ).trim().toUpperCase();

    return `
      <div class="answer-box">
        <p class="answer-label">Correct Answer</p>
        <p class="answer-value">
          ${correctKey ? `<span class="answer-key">${escapeHtml(correctKey)}</span>` : 'Correct answer letter was not saved for this question.'}
        </p>
      </div>
    `;
  }

  function renderChoiceList(question) {
    const options = Array.isArray(question?.options) ? question.options : [];
    const selectedKey = String(question?.answered_choice_key || '').trim().toUpperCase();
    const correctOption = findCorrectOption(question);
    const correctKey = String(correctOption?.key || '').trim().toUpperCase();
    const questionState = getQuestionResultState(question);

    if (!options.length) {
      return '<div class="choice-list"><div class="choice-item"><div class="choice-text">No choices were saved for this question.</div></div></div>';
    }

    return `
      <div class="choice-list">
        ${options.map(option => {
          const optionKey = String(option?.key || '').trim().toUpperCase();
          const isSelected = optionKey === selectedKey;
          const isCorrectAnswer = correctKey && optionKey === correctKey;

          const classes = ['choice-item'];
          if (isSelected) classes.push('selected');
          if (isSelected && questionState === 'correct') classes.push('selected-correct');
          if (isSelected && questionState === 'wrong') classes.push('selected-wrong');
          if (isCorrectAnswer) classes.push('correct-answer');

          const tags = [];
          if (isSelected) {
            tags.push(`<span class="choice-tag selected">Your answer</span>`);
            if (questionState === 'correct') {
              tags.push(`<span class="choice-tag correct">Correct</span>`);
            } else if (questionState === 'wrong') {
              tags.push(`<span class="choice-tag wrong">Wrong</span>`);
            }
          }
          if (isCorrectAnswer && !isSelected) {
            // keep the correct choice styling, but do not add a separate "Correct answer" tag
          }

          return `
            <div class="${classes.join(' ')}">
              <div class="choice-head">
                <span class="choice-key">${escapeHtml(option?.key || '-')}</span>
                <div class="choice-tags">
                  ${tags.join('')}
                </div>
              </div>
              <div class="choice-text">${escapeHtml(option?.text || (option?.image ? 'Image choice' : 'No choice text'))}</div>
              ${option?.image ? `<img class="answer-image" src="${escapeHtml(option.image)}" alt="Choice image" />` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  function renderSnapshot(snapshot) {
    const categories = Array.isArray(snapshot?.categories) ? snapshot.categories : [];
    if (!categories.length) {
      showEmpty('This attempt has no saved category data to review.');
      return;
    }

    const totalQuestions = categories.reduce((sum, category) => sum + Number(category?.question_count || 0), 0);
    const totalCorrect = categories.reduce((sum, category) => {
      const questions = Array.isArray(category?.questions) ? category.questions : [];
      return sum + questions.filter(question => question?.is_correct === true).length;
    }, 0);

    els.emptyState.classList.add('hidden');
    els.reviewContent.classList.remove('hidden');

    const submittedLabel = formatDateTime(snapshot.submitted_at);
    els.pageTitle.textContent = submittedLabel && submittedLabel !== '-' ? `View Attempt (${submittedLabel})` : 'View Attempt';
    els.pageSubtitle.textContent = 'Review grouped by category showing the question, choices, correct answer letter, and your highlighted selection.';
    els.categoryCountValue.textContent = `${categories.length}`;
    els.answeredCountValue.textContent = `${totalCorrect}/${totalQuestions}`;

    els.categoryToolbar.innerHTML = categories.map(category => `
      <a class="chip" href="#review-cat-${escapeHtml(category.code)}">${escapeHtml(category.label)}</a>
    `).join('');

    els.reviewContent.innerHTML = categories.map(category => {
      const questions = Array.isArray(category?.questions) ? category.questions : [];
      const correctCount = questions.filter(question => question?.is_correct === true).length;

      return `
        <section id="review-cat-${escapeHtml(category.code)}" class="section">
          <div class="section-head">
            <h2 class="section-title">${escapeHtml(category.label)}</h2>
            <div class="section-meta">${correctCount} / ${escapeHtml(String(category.question_count || questions.length || 0))} correct</div>
          </div>
          <div class="question-list">
            ${questions.map(question => `
              <article class="question-card">
                <div class="question-head">
                  <span class="question-order">Question ${escapeHtml(String(question.order || '-'))}</span>
                  <span class="question-id">${escapeHtml(question.question_id || '')}</span>
                </div>
                <p class="question-text">${escapeHtml(question.text || 'Untitled question')}</p>
                ${question.image ? `<img class="question-image" src="${escapeHtml(question.image)}" alt="Question image" />` : ''}
                ${renderChoiceList(question)}
                ${buildCorrectAnswerHtml(question)}
              </article>
            `).join('')}
          </div>
        </section>
      `;
    }).join('');
  }

  function updateBackToTopVisibility() {
    if (!els.backToTopBtn) return;
    const shouldShow = window.scrollY > 320;
    els.backToTopBtn.classList.toggle('show', shouldShow);
  }

  function bindBackToTop() {
    if (!els.backToTopBtn || els.backToTopBtn.dataset.bound === '1') return;
    els.backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('scroll', updateBackToTopVisibility, { passive: true });
    updateBackToTopVisibility();
    els.backToTopBtn.dataset.bound = '1';
  }

  function init() {
    bindBackToTop();

    const resultId = getResultIdFromUrl();
    if (!resultId) {
      showEmpty('No attempt id was provided. Open this page from the <strong>Review Attempt</strong> button in the dashboard.');
      return;
    }

    const snapshot = readAttemptReviewSnapshot(resultId);
    if (!snapshot) {
      showEmpty('No saved review snapshot was found for this attempt on this browser. Only attempts submitted after the review feature was installed can be opened here.');
      return;
    }

    renderSnapshot(snapshot);
    updateBackToTopVisibility();
  }

  init();
})();