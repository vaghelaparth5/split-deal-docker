// auth.js

// Grab elements
const authForm     = document.getElementById('authForm');
const formTitle    = document.getElementById('formTitle');
const toggleLink   = document.getElementById('toggleLink');
const toggleText   = document.getElementById('toggleText');
const submitBtn    = document.getElementById('submitBtn');
const nameField    = document.getElementById('nameField');
const confirmField = document.getElementById('confirmField');

let isLogin = true;

// Toggle between Login / Signup
toggleLink.addEventListener('click', () => {
  isLogin = !isLogin;

  formTitle.textContent     = isLogin ? 'Sign In' : 'Sign Up';
  submitBtn.textContent     = isLogin ? 'Sign In' : 'Sign Up';
  toggleText.textContent    = isLogin
    ? "Don't have an account?"
    : 'Already have an account?';
  toggleLink.textContent    = isLogin ? 'Sign Up' : 'Sign In';
  nameField.style.display    = isLogin ? 'none' : 'block';
  confirmField.style.display = isLogin ? 'none' : 'block';
});

// Form submission & validation + API calls
authForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const remember = document.getElementById('rememberMe').checked;

  // Email validation
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(email)) {
//     return alert('Please enter a valid email.');
//   }

  // Signup‑only checks
  let name, confirm;
  if (!isLogin) {
    name    = document.getElementById('name').value.trim();
    confirm = document.getElementById('confirmPassword').value;

    if (!name) {
      return alert('Please enter your name.');
    }
    if (password !== confirm) {
      return alert('Passwords do not match.');
    }
  }

  // Prepare payload
  const payload = isLogin
  ? { user_email: email, user_password: password }
  : { user_name: name, user_email: email, user_password: password };


  // Determine URL
  const url = isLogin
    ? 'http://localhost:3000/api/auth/login'
    : 'http://localhost:3000/api/auth/register';

  submitBtn.disabled = true;
  submitBtn.textContent = isLogin ? 'Signing In…' : 'Signing Up…';

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      // Assuming your API returns { error: '…' }
      throw new Error(data.error || 'Unknown error');
    }

    // Success
    console.log({
      mode: isLogin ? 'login' : 'signup',
      payload: data
    });
    alert(data.message || 'Success! Check console.');

    // Optionally store token, redirect, etc.
    // e.g. localStorage.setItem('token', data.token);

    authForm.reset();
    if (!isLogin) toggleLink.click();
  } catch (err) {
    console.error(err);
    alert(`Error: ${err.message}`);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = isLogin ? 'Sign In' : 'Sign Up';
  }
});
