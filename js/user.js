/* ── USER ACCOUNT SYSTEM ── */
const USER_KEY = 'ai901_username';

function getUsername() {
  return localStorage.getItem(USER_KEY) || null;
}

function setUsername(name) {
  const clean = name.trim().replace(/[^a-zA-Z0-9_-]/g, '');
  if (!clean) return false;
  localStorage.setItem(USER_KEY, clean);
  return clean;
}

function generateUsername() {
  return 'user' + Math.floor(10000 + Math.random() * 90000);
}

function getScoreKey(topicIdx) {
  const u = getUsername();
  return u ? `ai901_score_${u}_${topicIdx}` : null;
}

function saveScore(topicIdx, correct, total) {
  const key = getScoreKey(topicIdx);
  if (!key) return;
  localStorage.setItem(key, JSON.stringify({ correct, total, pct: Math.round((correct / total) * 100), ts: Date.now() }));
}

function loadScore(topicIdx) {
  const key = getScoreKey(topicIdx);
  if (!key) return null;
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

function loadAllScores() {
  const u = getUsername();
  if (!u) return {};
  const scores = {};
  for (let i = 0; i < 28; i++) {
    const s = loadScore(i);
    if (s) scores[i] = s;
  }
  return scores;
}

/* Render username widget into element with id="user-widget" */
function renderUserWidget() {
  const el = document.getElementById('user-widget');
  if (!el) return;
  const u = getUsername() || '—';
  el.innerHTML = `
    <span class="user-widget-label">Logged in as</span>
    <span class="user-pill" onclick="openUserModal()" title="Click to change username">${u}</span>`;
}

/* Modal */
function openUserModal() {
  let overlay = document.getElementById('user-modal');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'user-modal';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-box">
        <div class="modal-title">Your Study Account</div>
        <div class="modal-desc">Your username ties your quiz scores to your device. No password needed — just remember your username to keep progress consistent.</div>
        <input class="modal-input" id="modal-uname-input" type="text" placeholder="e.g. user12345" maxlength="20" autocomplete="off">
        <div class="modal-hint" id="modal-hint"></div>
        <div class="modal-actions">
          <button class="quiz-btn" onclick="closeUserModal()">Cancel</button>
          <button class="quiz-btn primary" onclick="saveUsernameFromModal()">Save</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeUserModal(); });
  }
  const input = document.getElementById('modal-uname-input');
  input.value = getUsername() || '';
  document.getElementById('modal-hint').textContent = '';
  overlay.style.display = 'flex';
  setTimeout(() => input.focus(), 50);
}

function closeUserModal() {
  const overlay = document.getElementById('user-modal');
  if (overlay) overlay.style.display = 'none';
}

function saveUsernameFromModal() {
  const val = document.getElementById('modal-uname-input').value;
  const saved = setUsername(val);
  if (!saved) {
    document.getElementById('modal-hint').textContent = 'Username must contain only letters, numbers, _ or -';
    return;
  }
  closeUserModal();
  renderUserWidget();
  if (typeof onUsernameSet === 'function') onUsernameSet(saved);
}

/* On load: prompt if no username, then render widget */
function initUser(requireAccount) {
  renderUserWidget();
  if (!getUsername()) {
    const overlay = document.getElementById('user-modal') || null;
    // Show modal but with no cancel if requireAccount = true
    openUserModal();
    if (requireAccount) {
      // Hide cancel button and clicking outside won't dismiss
      setTimeout(() => {
        const btn = document.querySelector('#user-modal .quiz-btn:not(.primary)');
        if (btn) btn.style.display = 'none';
        const input = document.getElementById('modal-uname-input');
        if (input) input.value = generateUsername();
      }, 60);
    }
  }
}
