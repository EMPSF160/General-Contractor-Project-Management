/* ==========================================================================
   FULLSCREEN MAGNETIC MENU & PREVIEW STAGE ORCHESTRATION
   Magnetic physics, huge typography entrance, image preview switcher
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const menuBtnLabel = document.getElementById('menu-btn-label');
  const fullscreenNav = document.getElementById('fullscreen-nav');
  const fsMenuLinks = document.querySelectorAll('.fs-menu-link');
  const fsPreviewImg = document.getElementById('fs-preview-img');
  const fsPreviewTitle = document.getElementById('fs-preview-title');
  const fsPreviewTag = document.getElementById('fs-preview-tag');
  const magneticItems = document.querySelectorAll('[data-magnetic="true"]');

  // 1. Header Scroll State
  function handleScrollHeader() {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScrollHeader, { passive: true });
  handleScrollHeader();

  // 2. Fullscreen Menu Toggle
  let isMenuOpen = false;

  function toggleFullscreenMenu(forceState) {
    isMenuOpen = typeof forceState === 'boolean' ? forceState : !isMenuOpen;

    if (isMenuOpen) {
      menuToggleBtn?.classList.add('is-active');
      menuToggleBtn?.setAttribute('aria-expanded', 'true');
      if (menuBtnLabel) menuBtnLabel.textContent = 'CLOSE';
      fullscreenNav?.classList.add('is-active');
      fullscreenNav?.setAttribute('aria-hidden', 'false');
      document.body.classList.add('menu-open');

      // GSAP Entrance Animation
      if (typeof gsap !== 'undefined') {
        gsap.fromTo('.fs-menu-link', 
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: "power3.out" }
        );
        gsap.fromTo('.fs-preview-stage',
          { opacity: 0, scale: 0.94, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.6, delay: 0.15, ease: "power3.out" }
        );
        gsap.fromTo('.fs-nav-topbar, .fs-nav-footer',
          { opacity: 0 },
          { opacity: 1, duration: 0.4, delay: 0.2, ease: "power2.out" }
        );
      }
    } else {
      menuToggleBtn?.classList.remove('is-active');
      menuToggleBtn?.setAttribute('aria-expanded', 'false');
      if (menuBtnLabel) menuBtnLabel.textContent = 'MENU';
      fullscreenNav?.classList.remove('is-active');
      fullscreenNav?.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('menu-open');
    }
  }

  menuToggleBtn?.addEventListener('click', () => toggleFullscreenMenu());

  // 3. Hover Image Preview Switcher
  fsMenuLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      fsMenuLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      const newImgSrc = link.getAttribute('data-image');
      const newTitle = link.getAttribute('data-title');
      const newTag = link.getAttribute('data-tag');

      if (fsPreviewImg && newImgSrc) {
        if (typeof gsap !== 'undefined') {
          gsap.killTweensOf(fsPreviewImg);
          gsap.fromTo(fsPreviewImg, 
            { opacity: 0.4, scale: 1.08 },
            { opacity: 1, scale: 1, duration: 0.45, ease: "power2.out" }
          );
        }
        fsPreviewImg.src = newImgSrc;
      }

      if (fsPreviewTitle && newTitle) {
        fsPreviewTitle.innerHTML = newTitle;
      }

      if (fsPreviewTag && newTag) {
        fsPreviewTag.textContent = newTag;
      }
    });

    // Close and smoothly scroll on link click
    link.addEventListener('click', (e) => {
      const targetHref = link.getAttribute('href');
      if (targetHref && targetHref.startsWith('#')) {
        e.preventDefault();
        toggleFullscreenMenu(false);

        setTimeout(() => {
          const targetEl = document.querySelector(targetHref);
          if (targetEl) {
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
        }, 300);
      }
    });
  });

  // 4. Keyboard & Resize Handling
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) {
      toggleFullscreenMenu(false);
    }
  });

  // 5. Magnetic Hover Physics on Desktop Devices
  if (window.matchMedia('(pointer: fine)').matches && typeof gsap !== 'undefined') {
    magneticItems.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.35;
        const deltaY = (e.clientY - centerY) * 0.35;

        gsap.to(el, {
          x: deltaX,
          y: deltaY,
          duration: 0.25,
          ease: "power2.out",
          overwrite: "auto"
        });
      });

      el.addEventListener('mouseleave', () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.3)",
          overwrite: "auto"
        });
      });
    });
  }

  // 6. Smooth Anchor Navigation for all in-page links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '' || this.classList.contains('fs-menu-link')) return;

      const targetEl = document.querySelector(href);
      if (targetEl) {
        e.preventDefault();
        if (isMenuOpen) toggleFullscreenMenu(false);

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
});

