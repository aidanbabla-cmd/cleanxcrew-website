/* CleanXCrew — script.js — Full animation suite */
(function () {
  'use strict';

  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const isTouch = window.matchMedia('(pointer:coarse)').matches;
  const ease = t => 1 - Math.pow(1 - t, 4);

  /* ══════════════════
     LOADER
  ══════════════════ */
  const loader = $('#loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('out');
      heroReveal();
    }, 1200);
  });

  /* ══════════════════
     CURSOR
  ══════════════════ */
  const dot   = $('#cursor-dot');
  const ring  = $('#cursor-ring');
  const label = $('#cursor-label');

  if (!isTouch && dot && ring) {
    let mx = -200, my = -200, rx = -200, ry = -200, lx = -200, ly = -200;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    const tickCursor = () => {
      dot.style.left   = mx + 'px';
      dot.style.top    = my + 'px';
      rx += (mx - rx) * .12;
      ry += (my - ry) * .12;
      ring.style.left  = rx + 'px';
      ring.style.top   = ry + 'px';
      lx += (mx - lx) * .1;
      ly += (my - ly) * .1;
      label.style.left = (lx + 30) + 'px';
      label.style.top  = (ly + 30) + 'px';
      requestAnimationFrame(tickCursor);
    };
    tickCursor();

    // Expand on interactive els
    $$('a,button,[data-magnetic],.gi,.svc,.review-card').forEach(el => {
      el.addEventListener('mouseenter', () => { dot.classList.add('big'); ring.classList.add('big'); });
      el.addEventListener('mouseleave', () => { dot.classList.remove('big'); ring.classList.remove('big'); });
    });
    // Show VIEW label on gallery items
    $$('.gi,.svc').forEach(el => {
      el.addEventListener('mouseenter', () => label.classList.add('show'));
      el.addEventListener('mouseleave', () => label.classList.remove('show'));
    });
    document.addEventListener('mouseleave', () => { dot.classList.add('hide'); ring.classList.add('hide'); });
    document.addEventListener('mouseenter', () => { dot.classList.remove('hide'); ring.classList.remove('hide'); });
  }

  /* ══════════════════
     HERO GLOW (cursor-following sphere)
  ══════════════════ */
  const heroSection = $('#hero');
  const heroGlow    = $('#hero-glow');

  if (!isTouch && heroSection && heroGlow) {
    heroSection.addEventListener('mouseenter', () => { heroGlow.style.opacity = '1'; });
    heroSection.addEventListener('mouseleave', () => { heroGlow.style.opacity = '0'; });
    heroSection.addEventListener('mousemove', e => {
      const r = heroSection.getBoundingClientRect();
      heroGlow.style.left = (e.clientX - r.left) + 'px';
      heroGlow.style.top  = (e.clientY - r.top)  + 'px';
    });
  }

  /* ══════════════════
     SCROLL PROGRESS
  ══════════════════ */
  const scrollBar = $('#scroll-bar');
  const nav       = $('#nav');
  const stbtn     = $('#scroll-top');

  const onScroll = () => {
    const y   = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollBar) scrollBar.style.width = ((y / max) * 100) + '%';
    if (nav)   nav.classList.toggle('scrolled', y > 40);
    if (stbtn) stbtn.classList.toggle('show', y > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (stbtn) stbtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ══════════════════
     SMOOTH ANCHORS
  ══════════════════ */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ══════════════════
     BURGER
  ══════════════════ */
  const burger   = $('#burger');
  const navLinks = $('#nav-links');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const o = navLinks.classList.toggle('open');
      burger.classList.toggle('open', o);
      document.body.style.overflow = o ? 'hidden' : '';
    });
    $$('a', navLinks).forEach(a => a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  /* ══════════════════
     HERO REVEAL
  ══════════════════ */
  function heroReveal() {
    const tag   = $('#hero-tag');
    const hw1   = $('#hw1');
    const hw2   = $('#hw2');
    const hw3   = $('#hw3');
    const sub   = $('#hero-sub');
    const acts  = $('#hero-actions');
    const strip = $('#hero-strip');
    const hpBack  = $('#hp-back');
    const hpFront = $('#hp-front');
    const hpBadge = $('#hp-badge');
    const hpPill  = $('#hp-pill');

    const show = (el, delay) => { if (!el) return; setTimeout(() => el.classList.add('in'), delay); };

    show(tag, 80);
    show(hw1, 200);
    show(hw2, 340);
    show(hw3, 480);
    show(sub,  640);
    show(acts, 760);
    show(strip, 880);
    show(hpBack,  300);
    show(hpFront, 460);
    show(hpBadge, 620);
    show(hpPill,  740);
  }

  /* ══════════════════
     HERO PARALLAX (video + photos)
  ══════════════════ */
  const heroBg  = $('#hero-parallax');
  const heroContent = $('#hero-content');

  if (heroBg) {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) window.addEventListener('scroll', doParallax, { passive: true });
      else window.removeEventListener('scroll', doParallax);
    });
    io.observe(heroBg);
  }
  function doParallax() {
    const y = window.scrollY;
    if (heroBg) heroBg.style.transform = `translateY(${y * 0.3}px)`;
    if (heroContent) heroContent.style.transform = `translateY(${y * 0.08}px)`;
  }

  /* ══════════════════
     FLOATING PHOTOS MOUSE PARALLAX
  ══════════════════ */
  if (!isTouch) {
    const hpBack2  = $('#hp-back');
    const hpFront2 = $('#hp-front');
    const hpBadge2 = $('#hp-badge');
    const hpPill2  = $('#hp-pill');

    document.addEventListener('mousemove', e => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      if (hpBack2)  hpBack2.style.transform  = `rotate(3deg) translate(${dx * 18}px, ${dy * 14}px)`;
      if (hpFront2) hpFront2.style.transform = `rotate(-3deg) translate(${dx * 28}px, ${dy * 22}px)`;
      if (hpBadge2) hpBadge2.style.transform = `translate(${dx * -10}px, ${dy * -12}px)`;
      if (hpPill2)  hpPill2.style.transform  = `translate(${dx * -14}px, ${dy * -10}px) translateY(0)`;
    });
  }

  /* ══════════════════
     SCROLL REVEAL
  ══════════════════ */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -50px 0px' });
  $$('.reveal').forEach(el => revealObs.observe(el));

  /* ══════════════════
     3D TILT ON CARDS
  ══════════════════ */
  if (!isTouch) {
    $$('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r  = card.getBoundingClientRect();
        const x  = e.clientX - r.left;
        const y  = e.clientY - r.top;
        const cx = r.width  / 2;
        const cy = r.height / 2;
        const rx =  ((y - cy) / cy) * 5;
        const ry = -((x - cx) / cx) * 5;
        card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
      });
      card.addEventListener('mouseenter', () => { card.style.transition = 'transform .12s ease'; });
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform .6s cubic-bezier(.22,1,.36,1)';
        card.style.transform = '';
      });
    });
  }

  /* ══════════════════
     MAGNETIC BUTTONS
  ══════════════════ */
  if (!isTouch) {
    $$('[data-magnetic]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r  = el.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width  / 2) * .28;
        const dy = (e.clientY - r.top  - r.height / 2) * .28;
        el.style.transform = `translate(${dx}px,${dy}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transition = 'transform .5s cubic-bezier(.22,1,.36,1)';
        el.style.transform  = '';
        setTimeout(() => el.style.transition = '', 500);
      });
    });
  }

  /* ══════════════════
     ODOMETER COUNTERS
  ══════════════════ */
  const odoObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const end = parseInt(el.dataset.odometer);
      const suf = el.dataset.suffix || '';
      const pre = el.dataset.prefix || '';
      const dur = 2000;
      const t0  = performance.now();

      const tick = now => {
        const p  = Math.min((now - t0) / dur, 1);
        const ep = ease(p);
        el.textContent = pre + Math.round(ep * end) + suf;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      odoObs.unobserve(el);
    });
  }, { threshold: .5 });
  $$('[data-odometer]').forEach(el => odoObs.observe(el));

  /* ══════════════════
     HORIZONTAL GALLERY DRAG
  ══════════════════ */
  const scroller = $('#gal-scroller');
  const track    = $('#gal-track');
  const progFill = $('#gal-prog-fill');

  if (scroller && track) {
    // On touch devices use native scroll, on desktop use custom drag with inertia
    if (isTouch) {
      // Native horizontal scroll — just update progress bar
      scroller.style.overflowX = 'auto';
      scroller.style.webkitOverflowScrolling = 'touch';
      const updateProg = () => {
        if (!progFill) return;
        const max = scroller.scrollWidth - scroller.clientWidth;
        progFill.style.width = max > 0 ? ((scroller.scrollLeft / max) * 100) + '%' : '0%';
      };
      scroller.addEventListener('scroll', updateProg, { passive: true });
    } else {
      // Desktop: custom drag with inertia
      scroller.style.overflowX = 'hidden';
      let isDragging = false;
      let startX, scrollX = 0, velX = 0, lastX2 = 0;
      let animID = null;

      const getMax = () => track.scrollWidth - scroller.clientWidth;
      const clamp = (v, mn, mx) => Math.max(mn, Math.min(mx, v));

      const setX = x => {
        scrollX = clamp(x, 0, getMax());
        track.style.transform = `translateX(${-scrollX}px)`;
        if (progFill) progFill.style.width = ((scrollX / getMax()) * 100) + '%';
      };
      const inertia = () => {
        if (Math.abs(velX) < 0.5) { velX = 0; return; }
        velX *= .92;
        setX(scrollX + velX);
        animID = requestAnimationFrame(inertia);
      };
      const onStart = x => {
        isDragging = true; startX = x; lastX2 = x; velX = 0;
        if (animID) cancelAnimationFrame(animID);
        scroller.classList.add('grabbing');
        track.style.transition = 'none';
      };
      const onMove = x => {
        if (!isDragging) return;
        velX = x - lastX2; lastX2 = x;
        setX(scrollX - (x - startX)); startX = x;
      };
      const onEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        scroller.classList.remove('grabbing');
        inertia();
      };
      scroller.addEventListener('mousedown', e => { e.preventDefault(); onStart(e.pageX); });
      document.addEventListener('mousemove', e => onMove(e.pageX));
      document.addEventListener('mouseup', onEnd);
      scroller.addEventListener('wheel', e => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { e.preventDefault(); setX(scrollX + e.deltaX); }
      }, { passive: false });
      window.addEventListener('resize', () => setX(scrollX));

      // Hover plays video
      $$('.gi-vid', track).forEach(v => {
        const cell = v.closest('.gi');
        if (!cell) return;
        cell.addEventListener('mouseenter', () => !isDragging && v.play().catch(()=>{}));
        cell.addEventListener('mouseleave', () => { v.pause(); v.currentTime = 0; });
      });
    }

    // Touch: play videos on entering viewport
    if (isTouch) {
      const touchVidObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          const v = e.target.querySelector('.gi-vid');
          if (!v) return;
          if (e.isIntersecting) v.play().catch(()=>{});
          else { v.pause(); v.currentTime = 0; }
        });
      }, { threshold: .4 });
      $$('.gi').forEach(gi => touchVidObs.observe(gi));
    }
  }

  /* ══════════════════
     GALLERY LIGHTBOX
  ══════════════════ */
  const lb     = $('#lb');
  const lbBg   = $('#lb-bg');
  const lbVid  = $('#lb-vid');
  const lbClose = $('#lb-close');

  const openLB = src => {
    lbVid.src = src;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    lbVid.play().catch(()=>{});
  };
  const closeLB = () => {
    lb.classList.remove('open');
    lbVid.pause();
    lbVid.src = '';
    document.body.style.overflow = '';
  };
  if (lbClose) lbClose.addEventListener('click', closeLB);
  if (lbBg)    lbBg.addEventListener('click', closeLB);
  document.addEventListener('keydown', e => e.key === 'Escape' && closeLB());

  $$('.gi').forEach(gi => {
    gi.addEventListener('click', () => {
      const src = gi.dataset.vid || gi.dataset.src;
      if (src) openLB(src);
    });
  });

  /* ══════════════════
     ABOUT PHOTOS PARALLAX
  ══════════════════ */
  if (!isTouch) {
    const aphotos = $$('.about-photos .ap-main img, .about-photos .ap-sec img, .about-photos .ap-small img');
    const photoObs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) window.addEventListener('scroll', doPhotoParallax, { passive: true });
      else window.removeEventListener('scroll', doPhotoParallax);
    });
    const aSection = $('#about');
    if (aSection) photoObs.observe(aSection);

    function doPhotoParallax() {
      const r  = aSection.getBoundingClientRect();
      const p  = -r.top / (window.innerHeight + r.height);
      if (aphotos[0]) aphotos[0].style.transform = `translateY(${p * 30}px)`;
      if (aphotos[1]) aphotos[1].style.transform = `translateY(${p * -20}px)`;
      if (aphotos[2]) aphotos[2].style.transform = `translateY(${p * 40}px)`;
    }
  }

  /* ══════════════════
     SIMPLE FORM
  ══════════════════ */
  const qform   = $('#qform');
  const success = $('#form-success');
  const doneName = $('#done-name');

  const shake = () => {
    const sh = $('.form-shell');
    if (!sh) return;
    sh.style.animation = 'none'; void sh.offsetWidth;
    sh.style.animation = 'shake .4s ease';
  };
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = '@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-10px)}60%{transform:translateX(8px)}80%{transform:translateX(-5px)}}';
  document.head.appendChild(shakeStyle);

  if (qform) {
    qform.addEventListener('submit', e => {
      e.preventDefault();

      // Require at least one service
      if (!$$('input[name="service"]:checked').length) { shake(); return; }

      // Require name, address, email
      const req = ['f-fn', 'f-addr', 'f-ph'];
      let ok = true;
      req.forEach(id => {
        const f = $(`#${id}`);
        if (!f || !f.value.trim()) {
          if (f) { f.style.borderColor = 'var(--orange)'; f.style.boxShadow = '0 0 0 3px rgba(255,85,0,.12)'; f.addEventListener('input', () => { f.style.borderColor=''; f.style.boxShadow=''; }, { once: true }); }
          ok = false;
        }
      });
      if (!ok) return;

      const btn = $('.btn-submit');
      if (btn) { btn.disabled = true; $('.sub-txt', btn).textContent = 'Sending…'; }

      const services = $$('input[name="service"]:checked').map(i => i.value).join(', ');
      const name     = ($('#f-fn')   || {}).value || '';
      const address  = ($('#f-addr') || {}).value || '';
      const phone    = ($('#f-ph')   || {}).value || '';
      const email    = ($('#f-em')   || {}).value || '';

      const FORMSPREE_ID = 'meevjbqr';

      const payload = {
        'Service(s) Requested': services,
        'Name':    name,
        'Address': address,
        'Phone':   phone,
        'Email':   email,
        '_subject':  `New Quote Request from ${name} — CleanXCrew`,
        '_replyto':  email,
      };

      const showSuccess = () => {
        qform.style.display = 'none';
        if (success) {
          success.classList.add('show');
          if (doneName) doneName.textContent = name ? `Talk soon, ${name.split(' ')[0]}.` : '';
          setTimeout(() => {
            const circle = $('.sc-circle', success);
            const check  = $('.sc-check',  success);
            if (circle) circle.classList.add('go');
            if (check)  check.classList.add('go');
          }, 150);
          // After 3s fade out and scroll to top
          setTimeout(() => {
            success.style.transition = 'opacity .6s ease';
            success.style.opacity = '0';
            setTimeout(() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setTimeout(() => {
                success.style.opacity = '';
                success.style.transition = '';
                success.classList.remove('show');
                qform.style.display = '';
              }, 800);
            }, 600);
          }, 3000);
        }
      };

      fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body:    JSON.stringify(payload),
      })
      .then(() => { if (window.fbq) fbq('track', 'Lead'); showSuccess(); })
      .catch(() => { showSuccess(); console.warn('Formspree error'); });
    });
  }

  /* ══════════════════
     VIDEO AUTOPLAY IN VIEW
  ══════════════════ */
  const vidObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.play().catch(()=>{});
      else e.target.pause();
    });
  }, { threshold: .2 });
  $$('.hero-vid, .cta-vid').forEach(v => vidObs.observe(v));

  /* ══════════════════
     MARQUEE
  ══════════════════ */
  const mqTrack = $('.mq-track');
  if (mqTrack) {
    mqTrack.parentElement.addEventListener('mouseenter', () => mqTrack.style.animationPlayState = 'paused');
    mqTrack.parentElement.addEventListener('mouseleave', () => mqTrack.style.animationPlayState = 'running');
  }

  /* ══════════════════
     BUTTON RIPPLE on click
  ══════════════════ */
  $$('.btn-primary, .btn-ghost, .btn-submit, .nav-cta').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const r   = this.getBoundingClientRect();
      const rip = document.createElement('span');
      const size = Math.max(r.width, r.height) * 1.5;
      rip.className = 'ripple';
      rip.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size/2}px;top:${e.clientY - r.top - size/2}px`;
      this.appendChild(rip);
      setTimeout(() => rip.remove(), 700);
    });
  });

  /* ══════════════════
     NAV LINK TEXT SCRAMBLE
  ══════════════════ */
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&';
  $$('.nl-link').forEach(link => {
    const original = link.textContent.trim();
    link.innerHTML = original.split('').map(c => `<span class="scramble-char">${c}</span>`).join('');
    const spans = $$('.scramble-char', link);

    link.addEventListener('mouseenter', () => {
      spans.forEach((sp, i) => {
        let iter = 0;
        const interval = setInterval(() => {
          sp.textContent = iter >= i ? original[i] : CHARS[Math.floor(Math.random() * CHARS.length)];
          if (++iter > i + 4) clearInterval(interval);
        }, 40);
      });
    });
  });

  /* ══════════════════
     CURSOR CONTEXT — DRAG in gallery, VIEW on cards
  ══════════════════ */
  if (!isTouch && label) {
    const galScroller = $('#gal-scroller');
    if (galScroller) {
      galScroller.addEventListener('mouseenter', () => {
        label.textContent = 'DRAG';
        label.classList.add('show');
        dot.classList.add('drag');
        ring.classList.add('drag');
      });
      galScroller.addEventListener('mouseleave', () => {
        label.textContent = 'VIEW';
        label.classList.remove('show');
        dot.classList.remove('drag');
        ring.classList.remove('drag');
      });
    }
  }

  /* ══════════════════
     SECTION ENTRANCE — skew reset on reveal
     (already handled by CSS skewY in .reveal)
  ══════════════════ */

  /* ══════════════════
     HERO BG SUBTLE COLOR PULSE
  ══════════════════ */
  const heroScrim = document.querySelector('.hero-scrim');
  if (heroScrim) {
    let tick = 0;
    const pulseScrim = () => {
      tick += 0.004;
      const alpha = 0.88 + Math.sin(tick) * 0.04;
      heroScrim.style.opacity = alpha;
      requestAnimationFrame(pulseScrim);
    };
    pulseScrim();
  }

  /* ══════════════════
     WORD REVEAL on section titles
  ══════════════════ */
  const titleObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.dataset.wordDone) return;
      el.dataset.wordDone = '1';

      // Split HTML into words, preserving tags and <br>.
      let wordIdx = 0;
      const processed = el.innerHTML.replace(/(<br\s*\/?>)|(<[^>]+>)|([^<]+)/gi,
        (m, br, tag, text) => {
          if (br)  return br;
          if (tag) return tag;
          return text.replace(/(\S+)|(\s+)/g, (tok, word, space) => {
            if (space) return space;
            return `<span class="stitle-w" style="--wi:${wordIdx++}">${word}</span>`;
          });
        }
      );
      el.innerHTML = processed;

      $$('.stitle-w', el).forEach(w => w.classList.add('stitle-in'));
      titleObs.unobserve(el);
    });
  }, { threshold: 0.2 });

  $$('.section-title').forEach(t => titleObs.observe(t));


})();
