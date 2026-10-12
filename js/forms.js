/**
 * SyncPoint SaaS - Forms & Authentication Handler
 * Client-side validation, error handling, password toggles, and demo authentication.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Password Visibility Toggle
  document.querySelectorAll('.password-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.password-wrapper')?.querySelector('input');
      if (input) {
        const isPassword = input.getAttribute('type') === 'password';
        input.setAttribute('type', isPassword ? 'text' : 'password');
        btn.innerHTML = isPassword
          ? `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/></svg>`
          : `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
      }
    });
  });

  // Contact Form Validation & Submission
  const contactForm = document.getElementById('contactForm');
  const contactFeedback = document.getElementById('contactFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let hasError = false;

      const name = document.getElementById('contactName');
      const email = document.getElementById('contactEmail');
      const business = document.getElementById('contactBusiness');
      const subject = document.getElementById('contactSubject');
      const message = document.getElementById('contactMessage');

      [name, email, business, subject, message].forEach(field => {
        if (!field) return;
        const errEl = field.parentElement.querySelector('.field-error');
        if (!field.value.trim()) {
          field.classList.add('is-invalid');
          if (errEl) errEl.style.display = 'block';
          hasError = true;
        } else {
          field.classList.remove('is-invalid');
          if (errEl) errEl.style.display = 'none';
        }
      });

      // Email format check
      if (email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        email.classList.add('is-invalid');
        const errEl = email.parentElement.querySelector('.field-error');
        if (errEl) {
          errEl.textContent = 'Please enter a valid email address';
          errEl.style.display = 'block';
        }
        hasError = true;
      }

      if (!hasError && contactFeedback) {
        contactFeedback.className = 'alert alert-success d-block';
        contactFeedback.innerHTML = `<strong>Message Sent!</strong> Thank you ${name.value.trim()}. Our appointment scheduling team will respond within 2 business hours.`;
        contactForm.reset();
      }
    });
  }

  // Business Login Form (Demo Flow)
  const loginForm = document.getElementById('loginForm');
  const loginFeedback = document.getElementById('loginFeedback');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail');
      const password = document.getElementById('loginPassword');

      if (!email.value.trim() || !password.value.trim()) {
        if (loginFeedback) {
          loginFeedback.className = 'alert alert-danger d-block';
          loginFeedback.textContent = 'Please enter both your business email and password.';
        }
        return;
      }

      if (loginFeedback) {
        loginFeedback.className = 'alert alert-success d-block';
        loginFeedback.textContent = 'Logging in to SyncPoint Business Portal... Redirecting to dashboard.';
      }

      localStorage.setItem('syncpoint_user', JSON.stringify({
        email: email.value.trim(),
        name: 'Dr. Sarah Mitchell',
        role: 'Practice Administrator'
      }));

      setTimeout(() => {
        window.location.href = 'dashboard/index.html';
      }, 900);
    });
  }

  // Business Registration Form (Demo Flow)
  const registerForm = document.getElementById('registerForm');
  const registerFeedback = document.getElementById('registerFeedback');

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('regName');
      const business = document.getElementById('regBusiness');
      const email = document.getElementById('regEmail');
      const password = document.getElementById('regPassword');
      const confirm = document.getElementById('regConfirmPassword');
      const terms = document.getElementById('regTerms');

      if (!name.value.trim() || !business.value.trim() || !email.value.trim() || !password.value.trim()) {
        if (registerFeedback) {
          registerFeedback.className = 'alert alert-danger d-block';
          registerFeedback.textContent = 'Please complete all required fields.';
        }
        return;
      }

      if (password.value !== confirm.value) {
        if (registerFeedback) {
          registerFeedback.className = 'alert alert-danger d-block';
          registerFeedback.textContent = 'Passwords do not match. Please verify.';
        }
        return;
      }

      if (!terms.checked) {
        if (registerFeedback) {
          registerFeedback.className = 'alert alert-danger d-block';
          registerFeedback.textContent = 'You must agree to the Terms of Service to proceed.';
        }
        return;
      }

      if (registerFeedback) {
        registerFeedback.className = 'alert alert-success d-block';
        registerFeedback.textContent = 'Workspace created successfully! Initializing your dashboard...';
      }

      localStorage.setItem('syncpoint_user', JSON.stringify({
        email: email.value.trim(),
        name: name.value.trim(),
        business: business.value.trim(),
        role: 'Workspace Owner'
      }));

      setTimeout(() => {
        window.location.href = 'dashboard/index.html';
      }, 1000);
    });
  }
});
