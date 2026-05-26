/* =====================================================================
   LOGO FALLBACK — show text square if logo.jpg fails to load
   ===================================================================== */
const brandLogo = document.getElementById('brandLogo');
const brandSq   = document.getElementById('brandSq');

if (brandLogo) {
  brandLogo.addEventListener('error', () => {
    brandLogo.style.display = 'none';
    if (brandSq) brandSq.classList.add('show');
  });
}

/* =====================================================================
   MODAL WIRING
   ===================================================================== */
const modalEl    = document.getElementById('supportModal');
const bsModal    = new bootstrap.Modal(modalEl);
const closeBtn   = document.getElementById('closeBtn');
const modalClose = document.getElementById('modalCloseBtn');

closeBtn.addEventListener('click',   () => bsModal.hide());
modalClose.addEventListener('click', () => bsModal.hide());

// reset form when modal closes
modalEl.addEventListener('hidden.bs.modal', () => {
  resetForm();
});

/* =====================================================================
   FORM VALIDATION — REAL-TIME
   ===================================================================== */
const form        = document.getElementById('supportForm');
const fieldName   = document.getElementById('fieldName');
const fieldEmail  = document.getElementById('fieldEmail');
const fieldCat    = document.getElementById('fieldCategory');
const fieldMsg    = document.getElementById('fieldMessage');
const nameFb      = document.getElementById('nameFeedback');
const emailFb     = document.getElementById('emailFeedback');
const msgFb       = document.getElementById('msgFeedback');
const charCounter = document.getElementById('charCounter');
const successMsg  = document.getElementById('successMsg');
const submitBtn   = document.getElementById('submitBtn');

// char counter for message
fieldMsg.addEventListener('input', () => {
  const len = fieldMsg.value.length;
  charCounter.textContent = len + ' / 20 min';
  charCounter.className = 'char-counter';
  if (len >= 20)      charCounter.classList.add('ready');
  else if (len >= 10) charCounter.classList.add('warn');
  if (form.classList.contains('was-validated')) validateField(fieldMsg);
});

// real-time validation on blur + input after first submit attempt
[fieldName, fieldEmail, fieldCat].forEach(f => {
  f.addEventListener('blur',  () => { if (form.classList.contains('was-validated')) validateField(f); });
  f.addEventListener('input', () => { if (form.classList.contains('was-validated')) validateField(f); });
});
fieldMsg.addEventListener('blur', () => { if (form.classList.contains('was-validated')) validateField(fieldMsg); });

function validateField(input) {
  const v = input.value.trim();

  if (input === fieldName) {
    if (!v) { setInvalid(input, nameFb, 'Name is required.'); return false; }
    if (v.length < 3) { setInvalid(input, nameFb, 'Name must be at least 3 characters.'); return false; }
    setValid(input); return true;
  }

  if (input === fieldEmail) {
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!v) { setInvalid(input, emailFb, 'Email is required.'); return false; }
    if (!emailRx.test(v)) { setInvalid(input, emailFb, 'Enter a valid email address.'); return false; }
    setValid(input); return true;
  }

  if (input === fieldCat) {
    if (!v) { input.classList.add('is-invalid'); input.classList.remove('is-valid'); return false; }
    input.classList.remove('is-invalid'); input.classList.add('is-valid'); return true;
  }

  if (input === fieldMsg) {
    if (!v) { setInvalid(input, msgFb, 'Message is required.'); return false; }
    if (input.value.length < 20) { setInvalid(input, msgFb, 'Message must be at least 20 characters.'); return false; }
    setValid(input); return true;
  }
}

function setInvalid(input, fb, msg) {
  input.classList.remove('is-valid');
  input.classList.add('is-invalid');
  fb.textContent = msg;
}
function setValid(input) {
  input.classList.remove('is-invalid');
  input.classList.add('is-valid');
}

/* =====================================================================
   FORM SUBMIT
   ===================================================================== */
form.addEventListener('submit', (e) => {
  e.preventDefault();
  form.classList.add('was-validated');

  const ok = [fieldName, fieldEmail, fieldCat, fieldMsg].every(f => validateField(f));
  if (!ok) return;

  // show success
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting…';

  setTimeout(() => {
    form.style.display = 'none';
    successMsg.style.display = 'block';
    submitBtn.textContent = '✓ Submitted';
  }, 800);
});

/* =====================================================================
   RESET
   ===================================================================== */
function resetForm() {
  form.reset();
  form.classList.remove('was-validated');
  form.style.display = '';
  successMsg.style.display = 'none';
  submitBtn.disabled = false;
  submitBtn.textContent = 'Submit Ticket →';
  charCounter.textContent = '0 / 20 min';
  charCounter.className = 'char-counter';
  [fieldName, fieldEmail, fieldCat, fieldMsg].forEach(f => {
    f.classList.remove('is-valid', 'is-invalid');
  });
}