/* ============================================
   Quantilus Innovation — Main JS
   Mobile nav, scroll animations, tabs, form
   ============================================ */

(function () {
  'use strict';

  // --- Mobile Navigation ---
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('open');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close nav when clicking a link
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Header scroll effect ---
  const header = document.querySelector('.header');
  if (header) {
    function onScroll() {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- Scroll fade-in animations ---
  var fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length > 0 && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all elements immediately
    fadeEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // --- Tabs ---
  var tabBtns = document.querySelectorAll('.tab-btn');
  if (tabBtns.length > 0) {
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tabId = btn.getAttribute('data-tab');
        // Deactivate all
        tabBtns.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        document.querySelectorAll('.tab-panel').forEach(function (panel) {
          panel.classList.remove('active');
        });
        // Activate clicked
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        var panel = document.getElementById(tabId);
        if (panel) panel.classList.add('active');
      });
    });
  }

  // --- Contact Form Validation & Submission ---
  var form = document.getElementById('contact-form');
  if (form) {
    var statusEl = document.getElementById('form-status');

    form.addEventListener('submit', function (e) {
      // Basic client-side validation
      var name = form.querySelector('#name');
      var email = form.querySelector('#email');
      var message = form.querySelector('#message');
      var valid = true;

      [name, email, message].forEach(function (field) {
        field.style.borderColor = '';
      });

      if (!name.value.trim()) {
        name.style.borderColor = '#ED1C25';
        valid = false;
      }
      if (!email.value.trim() || !email.value.includes('@')) {
        email.style.borderColor = '#ED1C25';
        valid = false;
      }
      if (!message.value.trim()) {
        message.style.borderColor = '#ED1C25';
        valid = false;
      }

      if (!valid) {
        e.preventDefault();
        if (statusEl) {
          statusEl.style.display = 'block';
          statusEl.style.color = '#ED1C25';
          statusEl.textContent = 'Please fill in all required fields.';
        }
        return;
      }

      // If using Formspree, let the form submit naturally.
      // For demo/static, we prevent default and show success.
      if (form.action.includes('your-form-id')) {
        e.preventDefault();
        if (statusEl) {
          statusEl.style.display = 'block';
          statusEl.style.color = '#58327D';
          statusEl.textContent = 'Thank you! Your message has been received. We\'ll be in touch soon.';
        }
        form.reset();
      }
    });
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
