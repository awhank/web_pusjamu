(function () {
  'use strict';

  var mainEl = document.getElementById('app-main');
  var navLinks = document.querySelectorAll('.nav-link');
  var currentHash = '';

  function getPageFromHash(hash) {
    var path = hash.replace(/^#\//, '').replace(/^#/, '');
    if (!path || path === '/' || path === 'beranda') return 'beranda';
    return path;
  }

  function updateNavActive(pageKey) {
    var info = PAGES[pageKey] || PAGES[DEFAULT_PAGE];
    var activeNav = info ? info.nav : DEFAULT_PAGE;
    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('data-nav') === activeNav) {
        link.classList.add('active');
      }
    });
  }

  function updateMeta(pageKey) {
    var info = PAGES[pageKey];
    if (!info) return;
    document.title = info.title;
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', info.desc);
    var ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', info.title);
    var ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', info.desc);
  }

  function initLightbox() {
    var dialog = document.getElementById('lightbox');
    var dialogImg = document.getElementById('lightbox-img');
    var closeBtn = dialog ? dialog.querySelector('.lightbox-close') : null;
    if (!dialog || !dialogImg) return;

    document.querySelectorAll('.org-chart-img').forEach(function (img) {
      img.onclick = function () {
        dialogImg.src = this.currentSrc || this.src;
        dialogImg.alt = this.alt;
        if (typeof dialog.showModal === 'function') {
          dialog.showModal();
        } else {
          dialog.setAttribute('open', '');
        }
      };
    });

    if (closeBtn) {
      closeBtn.onclick = function () { dialog.close(); };
    }

    dialog.onclick = function (e) {
      if (e.target === dialog) dialog.close();
    };
  }

  function reinitComponents() {
    // Mobile menu
    var menuToggle = document.getElementById('menuToggle');
    var menuClose = document.getElementById('menuClose');
    var mobileNav = document.getElementById('mobileNav');
    var mobileOverlay = document.getElementById('mobileOverlay');

    function closeMobileMenu() {
      if (mobileNav) mobileNav.classList.remove('show');
      if (mobileOverlay) mobileOverlay.classList.remove('show');
      document.body.style.overflow = '';
    }

    if (menuToggle) {
      menuToggle.onclick = function () {
        if (mobileNav) mobileNav.classList.add('show');
        if (mobileOverlay) mobileOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
      };
    }
    if (menuClose) {
      menuClose.onclick = closeMobileMenu;
    }
    if (mobileOverlay) {
      mobileOverlay.onclick = closeMobileMenu;
    }

    // Lightbox
    initLightbox();

    // Accordion
    document.querySelectorAll('.accordion-btn').forEach(function (btn) {
      btn.onclick = function () {
        var targetId = this.getAttribute('data-target');
        var target = document.getElementById(targetId);
        if (!target) return;
        var isExpanded = this.getAttribute('aria-expanded') === 'true';

        document.querySelectorAll('.accordion-btn').forEach(function (b) {
          b.setAttribute('aria-expanded', 'false');
        });
        document.querySelectorAll('.accordion-content').forEach(function (c) {
          c.classList.remove('show');
        });

        if (!isExpanded) {
          this.setAttribute('aria-expanded', 'true');
          target.classList.add('show');
        }
      };
    });
  }

  function renderAkreditasiPage() {
    DataLoader.load('akreditasi-institusi', 'data/akreditasi-institusi.json')
      .then(function (data) {
        var skeleton = document.getElementById('akreditasi-skeleton');
        var dataEl = document.getElementById('akreditasi-data');
        if (skeleton) skeleton.style.display = 'none';
        if (dataEl) dataEl.style.display = 'block';

        var badge = document.getElementById('akreditasi-badge');
        if (badge) badge.textContent = data.peringkat;
        var label = document.getElementById('akreditasi-label');
        if (label) label.textContent = data.label;
        var sk = document.getElementById('akreditasi-sk');
        if (sk) sk.textContent = data.sk;
        var nama = document.getElementById('akreditasi-nama');
        if (nama) nama.textContent = data.nama;
        var ringkasan = document.getElementById('akreditasi-ringkasan');
        if (ringkasan) ringkasan.textContent = data.ringkasan;

        var statTotal = document.getElementById('stat-total');
        if (statTotal) statTotal.textContent = data.statistik.prodiTerakreditasi;
        var statUnggul = document.getElementById('stat-unggul');
        if (statUnggul) statUnggul.textContent = data.statistik.unggul;
        var statBaikSekali = document.getElementById('stat-baik-sekali');
        if (statBaikSekali) statBaikSekali.textContent = data.statistik.baikSekali;
      });

    DataLoader.load('prodi', 'data/prodi.json')
      .then(function (data) {
        var tbody = document.getElementById('prodi-tbody');
        if (!tbody) return;
        tbody.innerHTML = data.items.map(function (p) {
          var badgeClass = p.akreditasi === 'Unggul' ? 'success'
                         : p.akreditasi === 'Baik' ? 'warning'
                         : 'primary';
          return '<tr>'
               + '<td>' + p.no + '</td>'
               + '<td>' + p.nama + '</td>'
               + '<td>' + p.jenjang + '</td>'
               + '<td><span class="badge-custom ' + badgeClass + '">' + p.akreditasi + '</span></td>'
               + '<td>' + p.masaBerlaku + '</td>'
               + '</tr>';
        }).join('');
      });
  }

  function loadPage(pageKey, pushState) {
    if (pageKey === currentHash) return;
    currentHash = pageKey;

    var info = PAGES[pageKey];
    if (!info) {
      loadPage(DEFAULT_PAGE, pushState);
      return;
    }

    if (mainEl) {
      mainEl.setAttribute('aria-busy', 'true');
      mainEl.style.opacity = '0.5';
    }

    var fetcher = window.fetch
      ? function (url) { return fetch(url).then(function (r) { return r.text(); }); }
      : function (url) {
          return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.onload = function () { if (xhr.status >= 200 && xhr.status < 400) resolve(xhr.responseText); else reject(xhr.status); };
            xhr.onerror = function () { reject('Network error'); };
            xhr.send();
          });
        };

    fetcher(info.file).then(function (html) {
      if (mainEl) {
        mainEl.innerHTML = html;
        mainEl.style.opacity = '1';
        mainEl.setAttribute('aria-busy', 'false');
      }
      updateNavActive(pageKey);
      updateMeta(pageKey);
      reinitComponents();

      if (pageKey === 'akreditasi') renderAkreditasiPage();

      if (pushState !== false && window.history && window.history.pushState) {
        var url = '/' + pageKey;
        if (pageKey === 'beranda') url = '/';
        window.history.pushState({ page: pageKey }, info.title, url);
      }

      document.dispatchEvent(new CustomEvent('pageLoaded', { detail: { page: pageKey } }));
    }).catch(function () {
      // Fallback: direct navigation
      window.location.href = info.file;
    });
  }

  function handleHashChange() {
    var hash = window.location.hash || '#/' + DEFAULT_PAGE;
    var pageKey = getPageFromHash(hash);
    loadPage(pageKey, false);
  }

  // Intercept all internal links
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || href.indexOf('://') > 0 || href.indexOf('http') === 0 || href.indexOf('//') === 0) return;
    if (href.indexOf('#') === 0) return;

    // Check if this links to a known page
    // Strip: ./ prefix, pages/ prefix, .html suffix, /index suffix
    var targetPage = href.replace(/^\.\//, '').replace(/^pages\//, '').replace(/\.html$/, '').replace(/\/index$/, '');

    var found = PAGES[targetPage];
    if (found) {
      e.preventDefault();
      window.location.hash = '#/' + targetPage;
    }
    // Otherwise let the link navigate normally (no-JS fallback)
  });

  // History API popstate
  window.addEventListener('popstate', function (e) {
    if (e.state && e.state.page) {
      loadPage(e.state.page, false);
    } else {
      // Parse current path
      var path = window.location.pathname.replace(/^\/|\/$/g, '') || 'beranda';
      loadPage(path, false);
    }
  });

  // Hashchange fallback for older browsers
  window.addEventListener('hashchange', handleHashChange);

  // Initial load
  (function init() {
    // Check if we have a hash route
    if (window.location.hash) {
      handleHashChange();
    } else {
      // Try to determine page from pathname
      var path = window.location.pathname.replace(/^\/|\/$/g, '').replace(/\.html$/, '') || 'beranda';
      // If it's not the root index.html, check if there's a page from path
      if (path === 'index' || path === '') path = 'beranda';

      // Also check hash-based fallback
      if (window.location.search.indexOf('_escaped_fragment_') >= 0) {
        // SEO crawl - do nothing, page is already rendered server-side
        return;
      }

      var pageKey = path;
      if (PAGES[pageKey]) {
        loadPage(pageKey, false);
        // Set the correct URL
        if (window.history && window.history.replaceState) {
          var url = '/' + pageKey;
          if (pageKey === 'beranda') url = '/';
          window.history.replaceState({ page: pageKey }, PAGES[pageKey].title, url);
        }
      } else {
        // Try pages from path with subdirectories
        // e.g., /tentang/struktur-organisasi
        var subPath = window.location.pathname.replace(/^\//, '').replace(/\.html$/, '');
        if (PAGES[subPath]) {
          loadPage(subPath, false);
          if (window.history && window.history.replaceState) {
            window.history.replaceState({ page: subPath }, PAGES[subPath].title, window.location.pathname);
          }
        } else {
          loadPage(DEFAULT_PAGE, false);
        }
      }
    }

    // Set initial nav active state
    updateNavActive(currentHash || DEFAULT_PAGE);
  })();

})();
