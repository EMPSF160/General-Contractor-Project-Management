/* ==========================================================================
   NAVIGATION & MOBILE DRAWER ORCHESTRATION
   Strict mobile/tablet overlay, sticky header, active link tracking
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileOverlay = document.querySelector('.mobile-menu-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const desktopNavLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Header Scroll State
  function handleScrollHeader() {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScrollHeader, { passive: true });
  handleScrollHeader();

  // Mobile Menu Toggle
  let isMenuOpen = false;

  function toggleMobileMenu(forceState) {
    isMenuOpen = typeof forceState === 'boolean' ? forceState : !isMenuOpen;

    if (isMenuOpen) {
      hamburgerBtn?.classList.add('is-active');
      hamburgerBtn?.setAttribute('aria-expanded', 'true');
      mobileOverlay?.classList.add('is-active');
      document.body.classList.add('menu-open');

      if (typeof gsap !== 'undefined') {
        gsap.fromTo('.mobile-nav-link', 
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: "power3.out" }
        );
      }
    } else {
      hamburgerBtn?.classList.remove('is-active');
      hamburgerBtn?.setAttribute('aria-expanded', 'false');
      mobileOverlay?.classList.remove('is-active');
      document.body.classList.remove('menu-open');
    }
  }

  hamburgerBtn?.addEventListener('click', () => toggleMobileMenu());

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) {
      toggleMobileMenu(false);
    }
  });

  // Automatically close mobile menu if resized above 1024px
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && isMenuOpen) {
      toggleMobileMenu(false);
    }
  }, { passive: true });

  // Close Mobile Menu upon clicking an internal link
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        toggleMobileMenu(false);
      }
    });
  });

  // Smooth Anchor Navigation (Lenis Compatible)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;

      const targetEl = document.querySelector(href);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 70;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerOffset;

        if (window.lenis) {
          window.lenis.scrollTo(targetPos);
        } else {
          window.scrollTo({
            top: targetPos,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Active Section Spy for Desktop Links
  function updateActiveSection() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        desktopNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveSection, { passive: true });
});
