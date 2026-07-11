(function () {
  // ---------- Mobile nav toggle ----------
  var navToggle = document.getElementById('navToggle');
  var navMobile = document.getElementById('navMobile');
  if (navToggle && navMobile) {
    navToggle.addEventListener('click', function () {
      var willOpen = navMobile.classList.contains('hidden');
      navMobile.classList.toggle('hidden');
      navMobile.classList.toggle('flex');
      navToggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });
    navMobile.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navMobile.classList.add('hidden');
        navMobile.classList.remove('flex');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---------- Reveal / focus-pull animations (pure class toggling) ----------
  var HIDE_CLASSES = [
    'opacity-0', 'pointer-events-none',
    'translate-y-4', 'translate-y-3', 'translate-y-2',
    'blur-md', 'blur-lg', 'scale-105', 'scale-101'
  ];
  function reveal(el) {
    HIDE_CLASSES.forEach(function (c) { el.classList.remove(c); });
  }
  var reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          reveal(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(reveal);
  }

  // ---------- Lightbox ----------
  var overlay = document.getElementById('lightbox');
  if (!overlay) return;

  var groups = {};
  document.querySelectorAll('[data-lightbox-group]').forEach(function (el) {
    var g = el.getAttribute('data-lightbox-group');
    if (!groups[g]) groups[g] = [];
    var img = el.querySelector('img');
    groups[g].push({ src: img.getAttribute('src'), alt: img.getAttribute('alt') || '' });
    el.setAttribute('data-lightbox-index', groups[g].length - 1);
  });

  var imgEl = document.getElementById('lightboxImg');
  var captionEl = document.getElementById('lightboxCaption');
  var counterEl = document.getElementById('lightboxCounter');
  var closeBtn = document.getElementById('lightboxClose');
  var prevBtn = document.getElementById('lightboxPrev');
  var nextBtn = document.getElementById('lightboxNext');
  var currentGroup = null, currentIndex = 0, lastFocused = null;

  function render() {
    var items = groups[currentGroup];
    var item = items[currentIndex];
    imgEl.src = item.src;
    imgEl.alt = item.alt;
    captionEl.textContent = item.alt;
    var multi = items.length > 1;
    counterEl.textContent = multi ? (currentIndex + 1) + ' / ' + items.length : '';
    prevBtn.classList.toggle('hidden', !multi);
    nextBtn.classList.toggle('hidden', !multi);
  }
  function onKey(e) {
    if (e.key === 'Escape') { close(); }
    else if (e.key === 'ArrowRight') { step(1); }
    else if (e.key === 'ArrowLeft') { step(-1); }
    else if (e.key === 'Tab') {
      var focusable = Array.prototype.slice.call(overlay.querySelectorAll('button'))
        .filter(function (b) { return !b.classList.contains('hidden'); });
      var idx = focusable.indexOf(document.activeElement);
      if (e.shiftKey && idx === 0) { e.preventDefault(); focusable[focusable.length - 1].focus(); }
      else if (!e.shiftKey && idx === focusable.length - 1) { e.preventDefault(); focusable[0].focus(); }
    }
  }
  function open(groupName, index) {
    currentGroup = groupName; currentIndex = index;
    lastFocused = document.activeElement;
    render();
    overlay.classList.remove('opacity-0', 'pointer-events-none');
    overlay.classList.add('opacity-100', 'pointer-events-auto');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
    document.addEventListener('keydown', onKey);
  }
  function close() {
    overlay.classList.add('opacity-0', 'pointer-events-none');
    overlay.classList.remove('opacity-100', 'pointer-events-auto');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }
  function step(dir) {
    var items = groups[currentGroup];
    currentIndex = (currentIndex + dir + items.length) % items.length;
    render();
  }

  document.querySelectorAll('[data-lightbox-group]').forEach(function (el) {
    el.addEventListener('click', function () {
      open(el.getAttribute('data-lightbox-group'), parseInt(el.getAttribute('data-lightbox-index'), 10));
    });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
    });
  });
  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', function () { step(-1); });
  nextBtn.addEventListener('click', function () { step(1); });
  overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
})();
