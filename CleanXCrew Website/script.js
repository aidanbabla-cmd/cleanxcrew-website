(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const header = $('#site-header');
  $('#year').textContent = new Date().getFullYear();

  document.body.classList.add('js-ready');
  const intro = $('#intro-screen');
  const heroImage = $('.hero-image');
  let introTimers = [];
  let introDone = true;
  let seenIntro = false;
  try { seenIntro = sessionStorage.getItem('outlineIntroSeen') === '1'; } catch (_) {}
  function clearIntroTimers() { introTimers.forEach(clearTimeout); introTimers = []; }
  function finishIntro(immediate = false) {
    if (introDone) return;
    introDone = true;
    clearIntroTimers();
    intro.classList.add('revealing');
    const finish = () => {
      intro.hidden = true;
      document.body.classList.remove('intro-open');
      document.body.classList.add('arrived');
    };
    if (immediate || reducedMotion.matches) finish();
    else introTimers.push(setTimeout(finish, 360));
    try { sessionStorage.setItem('outlineIntroSeen', '1'); } catch (_) {}
  }
  async function runIntro(full = false) {
    clearIntroTimers();
    introDone = false;
    document.body.classList.remove('arrived');
    if (reducedMotion.matches) { finishIntro(true); return; }
    intro.hidden = false;
    intro.className = 'intro-screen';
    document.body.classList.add('intro-open');
    requestAnimationFrame(() => requestAnimationFrame(() => intro.classList.add('playing')));
    // A failed or slow image must never hold the visitor in the opening.
    await Promise.race([heroImage.decode?.().catch(() => {}) || Promise.resolve(), new Promise(resolve => setTimeout(resolve, 450))]);
    if (introDone) return;
    const short = !full && seenIntro;
    introTimers.push(setTimeout(() => intro.classList.add('logo-visible'), short ? 100 : 680));
    introTimers.push(setTimeout(() => intro.classList.add('aperture'), short ? 120 : 680));
    introTimers.push(setTimeout(() => intro.classList.add('revealing'), short ? 200 : 1040));
    introTimers.push(setTimeout(() => finishIntro(), short ? 360 : 1400));
    introTimers.push(setTimeout(() => finishIntro(true), 2500));
    seenIntro = true;
  }
  $('#skip-intro').addEventListener('click', () => finishIntro(true));
  if (location.hash && location.hash !== '#top') { document.body.classList.add('arrived'); seenIntro = true; }
  else runIntro(!seenIntro);

  const menuToggle = $('#menu-toggle');
  const menu = $('#full-menu');
  const menuClose = $('#menu-close');
  const menuLinks = $$('.menu-body nav a');
  const menuPreview = $('#menu-preview-image');
  let menuLastFocus = null;
  function openMenu() {
    menuLastFocus = document.activeElement;
    menu.hidden = false;
    document.body.classList.add('menu-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close menu');
    requestAnimationFrame(() => menu.classList.add('is-open'));
    menuClose.focus();
  }
  function closeMenu(restoreFocus = true) {
    if (menu.hidden) return;
    menu.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    menu.hidden = true;
    if (restoreFocus) menuLastFocus?.focus();
  }
  menuToggle.addEventListener('click', () => menu.hidden ? openMenu() : closeMenu());
  menuClose.addEventListener('click', () => closeMenu());
  menuLinks.forEach(link => {
    const preview = () => { if (menuPreview.getAttribute('src') !== link.dataset.preview) menuPreview.src = link.dataset.preview; };
    link.addEventListener('pointerenter', preview);
    link.addEventListener('focus', preview);
    link.addEventListener('click', () => closeMenu(false));
  });
  $('#replay-intro').addEventListener('click', () => { closeMenu(false); scrollTo({ top: 0, behavior: 'instant' }); runIntro(true); });
  menu.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const focusable = [menuClose, ...menuLinks, $('#replay-intro'), $('.menu-foot a')];
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeMenu(); if (!intro.hidden) finishIntro(true); } });
  const scene = $('.light-scene');
  const storyStops = [
    ['top', '01 / ARRIVAL'], ['holiday', '02 / THE MOMENT'], ['lookbook', '03 / THE LOOKS'],
    ['light-lab', '04 / LIGHT LAB'], ['details', '05 / DETAILS'], ['services', '06 / SERVICES'], ['contact', '07 / CONTACT']
  ];
  const details = $('.details');
  const detailPhoto = $('.details-media img');
  const detailMoments = $$('.detail-moments>div');
  const reel = $('#featured-reel');
  let scrollQueued = false;
  function syncScroll() {
    const y = scrollY;
    header.classList.toggle('scrolled', y > 40);
    const sceneRect = scene.getBoundingClientRect();
    const travel = Math.max(1, scene.offsetHeight - innerHeight);
    let progress = innerWidth <= 800
      ? Math.min(1, Math.max(0, (innerHeight - sceneRect.top) / (innerHeight + sceneRect.height * .3)))
      : Math.min(1, Math.max(0, (innerHeight - sceneRect.top) / (innerHeight + travel * .45)));
    if (reducedMotion.matches) progress = 1;
    const documentTravel = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    document.documentElement.style.setProperty('--story-progress', `${Math.min(100, y / documentTravel * 100)}%`);
    let activeLabel = storyStops[0][1];
    storyStops.forEach(([id, label]) => { if (document.getElementById(id).getBoundingClientRect().top < innerHeight * .55) activeLabel = label; });
    $('#story-progress-label').textContent = activeLabel;
    const detailRect = details.getBoundingClientRect();
    const detailProgress = Math.min(1, Math.max(0, (innerHeight - detailRect.top) / (innerHeight + Math.min(700, detailRect.height))));
    if (!reducedMotion.matches) {
      detailPhoto.style.clipPath = `inset(${(1 - detailProgress) * 8}% 0 0 0)`;
      detailPhoto.style.transform = `scale(${1.06 - detailProgress * .06})`;
    }
    detailMoments.forEach((moment, index) => moment.classList.toggle('is-current', detailProgress >= index / 3 && detailProgress < (index + 1) / 3 || index === 2 && detailProgress >= 2 / 3));
    const reelRect = reel.getBoundingClientRect();
    const reelProgress = Math.min(1, Math.max(0, (innerHeight - reelRect.top) / (innerHeight * .9)));
    reel.style.setProperty('--reel-lift', reducedMotion.matches ? '0px' : `${(1 - reelProgress) * 34}px`);
    reel.style.setProperty('--reel-tilt', reducedMotion.matches ? '0deg' : `${(1 - reelProgress) * -1.2}deg`);
    scene.style.setProperty('--scene-light', String(progress));
    scrollQueued = false;
  }
  addEventListener('scroll', () => { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(syncScroll); } }, { passive: true });
  addEventListener('resize', syncScroll);
  syncScroll();
  const heroVisual = $('.hero-visual');
  heroVisual.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || reducedMotion.matches) return;
    const rect = heroVisual.getBoundingClientRect();
    heroVisual.style.setProperty('--hero-depth', String((event.clientX - rect.left) / rect.width));
  });
  heroVisual.addEventListener('pointerleave', () => heroVisual.style.setProperty('--hero-depth', '0'));
  if ('IntersectionObserver' in window) {
    const detailObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); detailObserver.unobserve(entry.target); }
    }), { threshold: .25 });
    detailObserver.observe($('.details'));
  } else $('.details').classList.add('in-view');

  const lookCards = $$('.look-card');
  const lookTabs = $$('.look-tab');
  const archive = $('#look-archive');
  const reelCards = $$('.reel-card');
  let currentLook = 'all';
  function visibleReelCards() { return reelCards.filter(card => !card.hidden); }
  function updateReelPosition() {
    const visible = visibleReelCards();
    const middle = reel.scrollLeft + reel.clientWidth / 2;
    let index = 0, distance = Infinity;
    visible.forEach((card, i) => {
      const center = card.offsetLeft - reel.offsetLeft + card.offsetWidth / 2;
      if (Math.abs(center - middle) < distance) { distance = Math.abs(center - middle); index = i; }
    });
    $('#reel-position').textContent = `${String(index + 1).padStart(2, '0')} / ${String(visible.length).padStart(2, '0')}`;
  }
  function shiftReel(direction) {
    const visible = visibleReelCards();
    if (!visible.length) return;
    const middle = reel.scrollLeft + reel.clientWidth / 2;
    const index = visible.reduce((best, card, i) => Math.abs(card.offsetLeft - reel.offsetLeft + card.offsetWidth / 2 - middle) < Math.abs(visible[best].offsetLeft - reel.offsetLeft + visible[best].offsetWidth / 2 - middle) ? i : best, 0);
    const target = visible[Math.max(0, Math.min(visible.length - 1, index + direction))];
    reel.scrollTo({ left: target.offsetLeft - reel.offsetLeft - (reel.clientWidth - target.offsetWidth) / 2, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }
  $('#reel-prev').addEventListener('click', () => shiftReel(-1));
  $('#reel-next').addEventListener('click', () => shiftReel(1));
  reel.addEventListener('scroll', updateReelPosition, { passive: true });
  reel.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); shiftReel(event.key === 'ArrowRight' ? 1 : -1); }
  });
  let dragStart = null, dragged = false;
  reel.addEventListener('pointerdown', event => { if (event.pointerType === 'mouse') { dragStart = { x: event.clientX, left: reel.scrollLeft }; dragged = false; } });
  reel.addEventListener('pointermove', event => {
    if (!dragStart) return;
    if (Math.abs(event.clientX - dragStart.x) > 6) { dragged = true; reel.classList.add('dragging'); reel.scrollLeft = dragStart.left - (event.clientX - dragStart.x); }
  });
  addEventListener('pointerup', () => { dragStart = null; reel.classList.remove('dragging'); });
  reel.addEventListener('click', event => { if (dragged) { event.preventDefault(); event.stopPropagation(); dragged = false; } }, true);
  lookTabs.forEach(tab => tab.addEventListener('click', () => {
    const before = reducedMotion.matches ? new Map() : new Map(lookCards.filter(card => !card.hidden && card.getClientRects().length).map(card => [card, card.getBoundingClientRect()]));
    currentLook = tab.dataset.look;
    lookTabs.forEach(other => { const on = other === tab; other.classList.toggle('active', on); other.setAttribute('aria-pressed', String(on)); });
    lookCards.forEach(card => { card.hidden = currentLook !== 'all' && card.dataset.look !== currentLook && card.dataset.look !== 'all'; });
    archive.open = currentLook !== 'all';
    reel.scrollLeft = 0;
    updateReelPosition();
    if (!reducedMotion.matches) requestAnimationFrame(() => lookCards.filter(card => !card.hidden && card.getClientRects().length).forEach(card => {
      const old = before.get(card);
      const now = card.getBoundingClientRect();
      if (old && (Math.abs(old.left - now.left) > 2 || Math.abs(old.top - now.top) > 2)) {
        card.animate([{ transform: `translate(${old.left - now.left}px, ${old.top - now.top}px)` }, { transform: 'translate(0, 0)' }], { duration: 320, easing: 'cubic-bezier(.2,.75,.2,1)' });
      } else if (!old) card.animate([{ opacity: 0, transform: 'translateY(15px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 280, easing: 'ease-out' });
    }));
  }));
  updateReelPosition();

  const viewer = $('#media-viewer');
  const viewerImage = $('#viewer-image');
  const viewerVideo = $('#viewer-video');
  const viewerCaption = $('#viewer-caption');
  const viewerPrev = $('#viewer-prev');
  const viewerNext = $('#viewer-next');
  let currentCard = null;
  let lastTrigger = null;
  function openMedia(card) {
    lastTrigger = card;
    currentCard = card;
    const isVideo = Boolean(card.dataset.video);
    viewerVideo.pause(); viewerVideo.removeAttribute('src'); viewerVideo.load();
    viewerImage.hidden = isVideo;
    viewerVideo.hidden = !isVideo;
    viewerPrev.hidden = isVideo;
    viewerNext.hidden = isVideo;
    viewerCaption.textContent = card.dataset.caption || '';
    if (isVideo) { viewerVideo.src = card.dataset.video; viewerVideo.play().catch(() => {}); }
    else { viewerImage.src = card.dataset.image; viewerImage.alt = $('img', card)?.alt || ''; }
    if (!viewer.open) viewer.showModal();
    document.body.style.overflow = 'hidden';
  }
  lookCards.forEach(card => card.addEventListener('click', () => openMedia(card)));
  $$('.detail-film, .film-strip-card').forEach(card => card.addEventListener('click', () => openMedia(card)));
  function adjacent(direction) {
    const visible = lookCards.filter(card => !card.hidden && card.dataset.image);
    const index = visible.indexOf(currentCard);
    if (index >= 0) openMedia(visible[(index + direction + visible.length) % visible.length]);
  }
  viewerPrev.addEventListener('click', () => adjacent(-1));
  viewerNext.addEventListener('click', () => adjacent(1));
  function closeViewer() { if (viewer.open) viewer.close(); }
  $('#viewer-close').addEventListener('click', closeViewer);
  viewer.addEventListener('click', event => { if (event.target === viewer) closeViewer(); });
  viewer.addEventListener('close', () => {
    viewerVideo.pause(); viewerVideo.removeAttribute('src'); viewerVideo.load();
    document.body.style.overflow = '';
    lastTrigger?.focus();
  });
  document.addEventListener('keydown', event => {
    if (!viewer.open || !currentCard?.dataset.image) return;
    if (event.key === 'ArrowLeft') adjacent(-1);
    if (event.key === 'ArrowRight') adjacent(1);
  });

  // Motion enters once each chapter reaches the viewport.
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const motionTargets = $$('.section-heading, .lab-promo-copy, .lab-promo-art, .details-main, .film-strip-head, .film-strip-card, .service-card, .about-grid > div, .contact-copy, .contact-card, .look-archive');
    const motionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      motionObserver.unobserve(entry.target);
    }), { rootMargin: '0px 0px -7% 0px', threshold: .08 });
    motionTargets.forEach((target, index) => {
      target.classList.add('motion-target');
      target.style.setProperty('--motion-delay', `${index % 4 * 70}ms`);
      motionObserver.observe(target);
    });
  }
})();
