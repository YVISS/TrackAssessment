const backendBase = `${location.protocol}//${location.hostname}:8000`;
function showMessage(msg){ const el = document.getElementById('authMessage'); if(el) el.textContent = msg }

async function authWithPassword(email, password){
  try{
    const url = `${backendBase}/auth`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok){ const t = await res.text(); throw new Error(`${res.status} ${res.statusText} - ${t}`) }
    return await res.json();
  }catch(err){ console.error('Auth failed', err); return { error: err.message } }
}

function showAppView(){ document.getElementById('authView')?.classList.add('hidden'); document.getElementById('appView')?.classList.remove('hidden');
  try{
    const profile = JSON.parse(sessionStorage.getItem('user_profile')||'{}');
    const welcomeEl = document.getElementById('welcomeText');
    if(welcomeEl) welcomeEl.textContent = profile.full_name || profile.name || profile.email || '';
  }catch(e){ }
}
function showAuthView(){ document.getElementById('appView')?.classList.add('hidden'); document.getElementById('authView')?.classList.remove('hidden'); }

window.addEventListener('load', () => {
  const stored = sessionStorage.getItem('user_profile');
  if (stored) { showAppView(); return }

  // Hook login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm){
    loginForm.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const email = (document.getElementById('loginEmail')||{}).value || '';
      const password = (document.getElementById('loginPassword')||{}).value || '';
      if (!email || !password) return showMessage('Please enter email and password.');
      showMessage('Authenticating...');
      const res = await authWithPassword(email, password);
      if (!res || res.error){ showMessage('Login failed: ' + (res && res.error ? res.error : 'invalid credentials')); return }
      const user = res.user || res;
      const usertype = (user.usertype || user.user_type || user.type || 'user').toLowerCase();
      sessionStorage.setItem('user_email', email);
      sessionStorage.setItem('user_profile', JSON.stringify(user));
      if (usertype === 'admin'){
        window.location.href = 'questions-all.html';
        return;
      }
      showAppView();
    });
  }

  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn){ logoutBtn.addEventListener('click', () => { sessionStorage.removeItem('user_profile'); sessionStorage.removeItem('user_email'); showAuthView(); }) }

  // Signup / toggles (lightweight)
  document.getElementById('showSignupBtn')?.addEventListener('click', () => { document.getElementById('loginForm')?.classList.add('hidden'); document.getElementById('signupForm')?.classList.remove('hidden'); });
  document.getElementById('showLoginBtn')?.addEventListener('click', () => { document.getElementById('signupForm')?.classList.add('hidden'); document.getElementById('loginForm')?.classList.remove('hidden'); });

});
