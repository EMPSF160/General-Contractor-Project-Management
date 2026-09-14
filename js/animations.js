/* ==========================================================================
   GSAP, SCROLLTRIGGER & LENIS INTEGRATION
   Engineering HUD animations, counter tickers, timeline activation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Check reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Initialize Lenis Smooth Scroll
  let lenisInstance = null;
  if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    window.lenis = lenisInstance;

    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis with GSAP ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
      lenisInstance.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenisInstance.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }

  // 2. Initialize GSAP & ScrollTrigger Animations
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Entry Animation
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
    heroTl
      .from('.hero-title', { opacity: 0, y: 50, duration: 1, delay: 0.2 })
      .from('.hero-lead', { opacity: 0, y: 30, duration: 0.8 }, "-=0.6")
      .from('.hero-actions', { opacity: 0, y: 20, duration: 0.6 }, "-=0.5")
      .from('.hero-hud-panel', { opacity: 0, x: 40, duration: 1 }, "-=0.8");

    // Project 07 Signature Dashboard ScrollTrigger
    const proj07Section = document.getElementById('project-07-control');
    if (proj07Section) {
      ScrollTrigger.create({
        trigger: proj07Section,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          // Animate percentage count from 0 to 68
          const pctEl = document.getElementById('proj07-main-counter');
          if (pctEl) {
            const counterObj = { val: 0 };
            gsap.to(counterObj, {
              val: 68,
              duration: 2.2,
              ease: "power2.out",
              onUpdate: () => {
                pctEl.textContent = Math.round(counterObj.val);
              }
            });
          }

          // Animate Stage Progress Bars
          document.querySelectorAll('.stage-bar-fill').forEach(fill => {
            const targetWidth = fill.getAttribute('data-target-width') || '0%';
            fill.style.width = targetWidth;
          });
        }
      });
    }

    // Process Timeline Step Activation on Scroll
    const processSteps = document.querySelectorAll('.process-step-item');
    processSteps.forEach((step, index) => {
      ScrollTrigger.create({
        trigger: step,
        start: 'top 80%',
        onEnter: () => {
          step.classList.add('active');
        }
      });
    });

    // Numerical Statistics Counters
    const statsSection = document.getElementById('statistics');
    if (statsSection) {
      ScrollTrigger.create({
        trigger: statsSection,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          document.querySelectorAll('[data-counter-target]').forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-counter-target'));
            const decimals = parseInt(counter.getAttribute('data-counter-decimals') || '0', 10);
            const obj = { val: 0 };

            gsap.to(obj, {
              val: target,
              duration: 2,
              ease: "power2.out",
              onUpdate: () => {
                counter.textContent = decimals > 0 ? obj.val.toFixed(decimals) : Math.round(obj.val);
              }
            });
          });
        }
      });
    }

    // Safety Counters
    const safetySection = document.getElementById('safety');
    if (safetySection) {
      ScrollTrigger.create({
        trigger: safetySection,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          document.querySelectorAll('[data-safety-counter]').forEach(counter => {
            const target = parseInt(counter.getAttribute('data-safety-counter'), 10);
            const obj = { val: 0 };

            gsap.to(obj, {
              val: target,
              duration: 1.8,
              ease: "power2.out",
              onUpdate: () => {
                counter.textContent = Math.round(obj.val);
              }
            });
          });
        }
      });
    }

    // Project Pipeline Bars
    const pipelineSection = document.getElementById('pipeline');
    if (pipelineSection) {
      ScrollTrigger.create({
        trigger: pipelineSection,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          document.querySelectorAll('.pipeline-card .progress-fill').forEach(fill => {
            const w = fill.getAttribute('data-width') || '0%';
            fill.style.width = w;
          });
        }
      });
    }
  } else {
    // Fallback: Immediate values if GSAP or JS animations are skipped
    document.querySelectorAll('.stage-bar-fill').forEach(fill => {
      fill.style.width = fill.getAttribute('data-target-width') || '0%';
    });
    document.querySelectorAll('.pipeline-card .progress-fill').forEach(fill => {
      fill.style.width = fill.getAttribute('data-width') || '0%';
    });
  }

  // 3. Initialize Swiper Testimonials Slider
  if (typeof Swiper !== 'undefined') {
    new Swiper('.testimonials-swiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 6000,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: '.swiper-btn-next',
        prevEl: '.swiper-btn-prev',
      },
      breakpoints: {
        768: {
          slidesPerView: 1,
        },
        1024: {
          slidesPerView: 1,
        }
      }
    });
  }
});
