/* ==========================================================================
   MAIN APPLICATION SCRIPT
   Form validation, telemetry timestamp clock, Lucide icon hydration
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. Real-time Telemetry UTC Clock
  const clockElements = document.querySelectorAll('[data-live-clock]');
  function updateClock() {
    const now = new Date();
    const utcString = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    clockElements.forEach(el => {
      el.textContent = utcString;
    });
  }
  updateClock();
  setInterval(updateClock, 1000);

  // 3. Contact Form Submission Handling (Static/Demo Safe)
  const contactForm = document.getElementById('project-brief-form');
  const formFeedback = document.getElementById('form-feedback-message');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = contactForm.querySelector('#client-name');
      const email = contactForm.querySelector('#client-email');
      const type = contactForm.querySelector('#project-type');

      let isValid = true;

      // Simple validation
      [name, email].forEach(input => {
        if (!input.value.trim()) {
          input.classList.add('error');
          isValid = false;
        } else {
          input.classList.remove('error');
        }
      });

      if (!isValid) {
        formFeedback.textContent = "ATTENTION: Please complete all mandatory project fields.";
        formFeedback.className = "form-feedback-msg";
        formFeedback.style.display = "block";
        formFeedback.style.borderColor = "#E74C3C";
        formFeedback.style.color = "#E74C3C";
        return;
      }

      // Simulated static dispatch
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>DISPATCHING BRIEF...</span>`;

      setTimeout(() => {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        formFeedback.textContent = "✓ PROJECT BRIEF SIMULATION LOGGED: Technical team will initiate constructability review within 24 hours.";
        formFeedback.className = "form-feedback-msg success";
        formFeedback.style.display = "block";
      }, 900);
    });
  }

  // 4. Global Escape Key Listener for Modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-overlay.is-active');
      if (activeModal) {
        activeModal.classList.remove('is-active');
        document.body.style.overflow = '';
      }

      const mobileMenu = document.querySelector('.mobile-menu-overlay.is-active');
      if (mobileMenu) {
        document.querySelector('.hamburger-btn')?.click();
      }
    }
  });
});
