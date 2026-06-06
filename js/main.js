(function () {
  'use strict';

  // Mobile menu
  var menuToggle = document.getElementById('menuToggle');
  var menuClose = document.getElementById('menuClose');
  var mobileNav = document.getElementById('mobileNav');
  var mobileOverlay = document.getElementById('mobileOverlay');

  function toggleMobileMenu() {
    mobileNav.classList.toggle('show');
    mobileOverlay.classList.toggle('show');
    document.body.style.overflow = mobileNav.classList.contains('show') ? 'hidden' : '';
  }

  function closeMobileMenu() {
    mobileNav.classList.remove('show');
    mobileOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  if (menuToggle) menuToggle.addEventListener('click', toggleMobileMenu);
  if (menuClose) menuClose.addEventListener('click', closeMobileMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

  // Accordion
  var accordionBtns = document.querySelectorAll('.accordion-btn');
  accordionBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetId = this.getAttribute('data-target');
      var target = document.getElementById(targetId);
      if (!target) return;
      var isExpanded = this.getAttribute('aria-expanded') === 'true';

      accordionBtns.forEach(function (b) {
        b.setAttribute('aria-expanded', 'false');
      });
      document.querySelectorAll('.accordion-content').forEach(function (c) {
        c.classList.remove('show');
      });

      if (!isExpanded) {
        this.setAttribute('aria-expanded', 'true');
        target.classList.add('show');
      }
    });
  });

  // Active nav highlighting
  var currentPath = window.location.pathname.split('/').pop() || 'index.html';
  var navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    }
  });

})();
