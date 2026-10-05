/* =========================================================
   Sameer Razza — Portfolio interactions
   ========================================================= */
(function () {
  'use strict';

  const root = document.documentElement;
  root.classList.add('js'); // enables reveal animations only when JS runs

  /* ---------- Theme toggle (persisted in localStorage) ---------- */
  const themeBtn = document.getElementById('theme-toggle');
  const metaTheme = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    if (metaTheme) metaTheme.setAttribute('content', theme === 'dark' ? '#0a1628' : '#f6f8fc');
  }

  applyTheme(root.getAttribute('data-theme') || 'dark');

  themeBtn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });

  /* ---------- Mobile menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  function setMenu(open) {
    navLinks.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  hamburger.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
  navLinks.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') && !e.target.closest('.nav')) setMenu(false);
  });

  /* ---------- Navbar shadow on scroll ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Active nav link based on visible section ---------- */
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        const active = link.getAttribute('href') === '#' + entry.target.id;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach((s) => sectionObserver.observe(s));

  /* ---------- Achievements ----------
     Edit titles, issuers and dates here. `file` is the path to the PDF;
     if `title` is left empty it is generated from the file name. */
  const achievements = [
    {
      title: 'DSA Bootcamp Participation Certificate 2026',
      issuer: '[Organization]',
      date: '[Month Year]',
      file: 'certificates/DSA BOOTCAMP PARTICIPATION CERTIFICATE 2026.pdf',
    },
    {
      title: 'Project Completion Certificate',
      issuer: '[Organization]',
      date: '[Month Year]',
      file: 'certificates/Project Complition - Sameer razza.pdf',
    },
    {
      title: 'AIML Certificate',
      issuer: '[Organization]',
      date: '[Month Year]',
      file: 'certificates/Sameer razza - AIML Certificate.pdf',
    },
    {
      title: 'Student Coordinator Certificate – DSA for DeepTech',
      issuer: '[Organization]',
      date: '[Month Year]',
      file: 'certificates/STUDENT COORDINATOR CERTIFICATE - DSA FOR DEEPTECH.pdf',
    },
  ];

  // "java-course.pdf" -> "Java Course"
  function titleFromFile(path) {
    return path.split('/').pop().replace(/\.pdf$/i, '').replace(/[-_]+/g, ' ').trim()
      .replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  }

  const pdfIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h4"/></svg>';
  const eyeIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  const downloadIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>';

  // Build one card per achievement (textContent avoids HTML injection)
  const grid = document.getElementById('achievements-grid');
  achievements.forEach((item) => {
    const url = encodeURI(item.file);
    const title = item.title || titleFromFile(item.file);

    const li = document.createElement('li');
    li.className = 'achievement-card reveal';
    li.innerHTML = `
      <span class="achievement-icon">${pdfIcon}</span>
      <h3></h3>
      <p class="achievement-meta"></p>
      <div class="achievement-links">
        <a href="${url}" class="btn btn-sm btn-primary" data-view target="_blank" rel="noopener">${eyeIcon} View</a>
        <a href="${url}" class="btn btn-sm btn-outline" download>${downloadIcon} Download</a>
      </div>`;
    li.querySelector('h3').textContent = title;
    li.querySelector('.achievement-meta').textContent = `Issued by: ${item.issuer} | ${item.date}`;
    li.querySelector('[data-view]').setAttribute('aria-label', `View ${title}`);
    li.querySelector('[download]').setAttribute('aria-label', `Download ${title}`);
    li.querySelector('[data-view]').addEventListener('click', (e) => {
      // On phones/tablets let the link open the PDF in a new tab instead
      if (isMobile()) return;
      e.preventDefault();
      openPdf(url, title);
    });
    grid.appendChild(li);
  });

  /* ---------- PDF viewer modal ---------- */
  const modal = document.getElementById('pdf-modal');
  const frame = document.getElementById('pdf-modal-frame');
  const fallback = document.getElementById('pdf-fallback');

  function isMobile() {
    return window.matchMedia('(max-width: 820px), (pointer: coarse)').matches || typeof modal.showModal !== 'function';
  }

  function showFallback() {
    frame.hidden = true;
    fallback.hidden = false;
  }

  async function openPdf(url, title) {
    document.getElementById('pdf-modal-title').textContent = title;
    document.getElementById('pdf-modal-open').href = url;
    document.getElementById('pdf-fallback-link').href = url;
    frame.hidden = false;
    fallback.hidden = true;
    modal.showModal();

    // Browsers without a built-in PDF viewer can't embed it
    if (navigator.pdfViewerEnabled === false) return showFallback();

    // An iframe's load event fires even for 404s, so check the file first
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (!res.ok) throw new Error('PDF not found');
      frame.src = url;
    } catch (err) {
      showFallback();
    }
  }

  function closePdf() {
    modal.close();
  }

  // Clear the viewer whenever the dialog closes (button, Esc or backdrop)
  modal.addEventListener('close', () => frame.removeAttribute('src'));
  document.getElementById('pdf-modal-close').addEventListener('click', closePdf);
  // Clicks on the backdrop target the <dialog> itself, not its content
  modal.addEventListener('click', (e) => { if (e.target === modal) closePdf(); });
  // Esc closes a modal <dialog> natively

  /* ---------- Fade-in on scroll + skill bar fill ---------- */
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('visible');

      // Animate skill progress bar to its data-level
      if (el.dataset.level) {
        const bar = el.querySelector('.skill-bar span');
        if (bar) bar.style.width = el.dataset.level + '%';
      }
      obs.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach((el, i) => {
    // Small stagger for items within the same grid
    el.style.transitionDelay = (i % 3) * 80 + 'ms';
    revealObserver.observe(el);
  });

  /* ---------- Contact form (Netlify Forms via AJAX) ---------- */
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');
  const submitLabel = submitBtn.querySelector('.btn-label');

  function validate() {
    let ok = true;
    form.querySelectorAll('[required]').forEach((field) => {
      const valid = field.value.trim() !== '' && field.checkValidity();
      field.closest('.form-field').classList.toggle('invalid', !valid);
      field.setAttribute('aria-invalid', String(!valid));
      if (!valid) ok = false;
    });
    return ok;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.className = 'form-status';
    status.textContent = '';

    if (!validate()) {
      status.classList.add('error');
      status.textContent = 'Please fill in all fields with a valid email address.';
      return;
    }

    submitBtn.disabled = true;
    submitLabel.textContent = 'Sending…';

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString(),
      });
      if (!res.ok) throw new Error('Request failed');

      form.reset();
      status.classList.add('success');
      status.textContent = '✓ Thank you! Your message has been sent. I will get back to you soon.';
    } catch (err) {
      status.classList.add('error');
      status.textContent = 'Sorry, something went wrong. Please email me directly at samm19058@gmail.com.';
    } finally {
      submitBtn.disabled = false;
      submitLabel.textContent = 'Send Message';
    }
  });

  // Clear invalid state as the user types
  form.addEventListener('input', (e) => {
    const field = e.target.closest('.form-field');
    if (field) field.classList.remove('invalid');
  });

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
