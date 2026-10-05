'use strict';
(() => {
  const config = window.FESTIVAL || {};
  const $ = s => document.querySelector(s);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let motionPaused = reducedMotion.matches;
  document.body.classList.toggle('motion-paused', motionPaused);
  const text = (tag, value, className) => { const e = document.createElement(tag); e.textContent = value || ''; if (className) e.className = className; return e; };
  document.querySelectorAll('[data-text]').forEach(el => { if (typeof config[el.dataset.text] === 'string') el.textContent = config[el.dataset.text]; });
  const menu = $('.menu-toggle'), nav = $('#navigation');
  function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }
  menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); } });
  document.addEventListener('click', e => { if (!e.target.closest('.header')) closeMenu(); });
  if ($('#workshop-list')) (config.workshops || []).forEach((w, i) => {
    const d = document.createElement('details'), s = document.createElement('summary');
    s.append(text('span', String(i + 1).padStart(2, '0'), 'workshop-number'), text('h3', w.title), text('span', w.tag, 'workshop-tag'));
    const plus = text('span', '+', 'plus'); plus.setAttribute('aria-hidden', 'true'); s.append(plus);
    const body = document.createElement('div'); body.className = 'workshop-body'; body.append(text('p', w.description));
    d.append(s, body); $('#workshop-list').append(d);
  });
  if ($('#team-grid')) (config.team || []).forEach((m, i) => {
    const article = document.createElement('article'); article.className = 'member';
    const photo = document.createElement('div'); photo.className = 'team-photo';
    const placeholder = text('span', String(i + 1).padStart(2, '0')); placeholder.setAttribute('aria-hidden', 'true'); photo.append(placeholder);
    if (m.photo) { const img = new Image(); img.alt = m.name || m.role; img.loading = 'lazy'; img.onload = () => photo.replaceChildren(img); img.src = m.photo; }
    article.append(photo, text('p', m.role, 'role'), text('h3', m.name || 'To be announced'));
    if (m.bio) article.append(text('p', m.bio, 'bio'));
    $('#team-grid').append(article);
  });
  if ($('#gallery-grid')) {
    (config.gallery || []).forEach(g => {
      const f = document.createElement('figure'), img = new Image(); img.src = g.src; img.alt = g.alt || g.caption || 'Festival photograph'; img.loading = 'lazy';
      f.append(img, text('figcaption', g.caption)); $('#gallery-grid').append(f);
    });
    $('#gallery-empty').hidden = Boolean(config.gallery?.length);
  }
  if ($('#contact-email') && config.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email)) {
    const a = $('#contact-email'); a.textContent = config.email; a.href = 'mailto:' + config.email; a.hidden = false; $('#contact-pending').hidden = true;
  }
  function googleFormURL(value, embed = false) {
    if (!value) return null;
    try {
      const u = new URL(value);
      if (u.protocol !== 'https:') return null;
      if (!embed && u.hostname === 'forms.gle' && u.pathname.length > 1) return u.href;
      if (u.hostname !== 'docs.google.com' || !/^\/forms\/d\/(?:e\/)?[^/]+\/viewform$/.test(u.pathname)) return null;
      if (embed) u.searchParams.set('embedded', 'true'); else u.searchParams.delete('embedded');
      return u.href;
    } catch { return null; }
  }
  if ($('#form-link')) {
    const formURL = googleFormURL(config.googleFormUrl || config.googleFormEmbedUrl);
    const embedURL = googleFormURL(config.googleFormEmbedUrl || config.googleFormUrl, true);
    if (formURL) { $('#form-link').href = formURL; $('#form-link').hidden = false; $('#registration-status').textContent = 'Complete your registration through our Google Form.'; }
    if (embedURL) {
      const button = $('#embed-toggle'), panel = $('#form-panel'); button.hidden = false;
      button.addEventListener('click', () => {
        const opening = panel.hidden; panel.hidden = !opening; button.setAttribute('aria-expanded', String(opening));
        button.textContent = opening ? 'Hide embedded form' : 'Fill the form on this page';
        if (opening) { if (!$('#registration-frame').getAttribute('src')) $('#registration-frame').src = embedURL; panel.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' }); }
      });
    }
  }
  const heroVideo = $('#hero-video');
  let userPaused = motionPaused || Boolean(navigator.connection?.saveData);
  let heroVisible = true;
  function playHero() { if (heroVideo && !userPaused && heroVisible && !document.hidden) heroVideo.play().catch(() => {}); }
  if (heroVideo) {
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => { heroVisible = entries[0].isIntersecting; if (!heroVisible) heroVideo.pause(); else playHero(); }, {threshold: .1}).observe($('#home'));
    document.addEventListener('visibilitychange', () => { if (document.hidden) heroVideo.pause(); else playHero(); });
    playHero();
  }
  const progress = $('.scroll-progress'); let queued = false;
  function updateProgress() { const total = document.documentElement.scrollHeight - innerHeight; progress.style.transform = `scaleX(${total > 0 ? scrollY / total : 0})`; queued = false; }
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(updateProgress); } }, { passive: true });
  addEventListener('resize', updateProgress); updateProgress();
  // Progressive motion: everything stays visible if these enhancements cannot run.
  reducedMotion.addEventListener('change', e => {
    motionPaused = e.matches;
    document.body.classList.toggle('motion-paused', motionPaused);
    userPaused = motionPaused || Boolean(navigator.connection?.saveData);
    if (motionPaused) { heroVideo?.pause(); endIntro(); } else playHero();
  });
  const intro = $('#departure-intro'); let introTimer;
  function endIntro() {
    if (!intro || intro.hidden) return;
    clearTimeout(introTimer); intro.classList.add('out');
    document.body.classList.remove('intro-running');
    // If someone used the keyboard to skip, restore focus to the real page.
    const hadFocus = intro.contains(document.activeElement);
    intro.setAttribute('aria-hidden', 'true');
    if (hadFocus) $('.brand').focus({preventScroll:true});
    setTimeout(() => { intro.hidden = true; }, 600);
  }
  let introSeen = false;
  try { introSeen = sessionStorage.getItem('bnaf-arrival-v4') === 'seen'; } catch {}
  if (intro && !introSeen && !motionPaused && !navigator.connection?.saveData) {
    intro.hidden = false; intro.removeAttribute('aria-hidden');
    document.body.classList.add('intro-running');
    $('#skip-intro').addEventListener('click', endIntro);
    document.addEventListener('keydown', e => { if(e.key === 'Escape') endIntro(); });
    introTimer = setTimeout(endIntro, 1250);
    try { sessionStorage.setItem('bnaf-arrival-v4', 'seen'); } catch {}
  }
  if ('IntersectionObserver' in window && !motionPaused) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
    }, {threshold: .08, rootMargin: '0px 0px 25px 0px'});
    document.querySelectorAll('.destination-grid>a,.pillars article,.member,.about-visual,.workshop-list details,.boarding-pass').forEach((el,i) => {
      // Do not hide already visible content or interfere with above-fold reading.
      if (el.getBoundingClientRect().top >= innerHeight - 20) {
        el.style.setProperty('--reveal-delay', `${(i % 3) * 65}ms`);
        el.classList.add('reveal-pending'); observer.observe(el);
      }
    });
  }
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.destination-grid>a').forEach(card => {
      let pending = false, x = 50, y = 50;
      card.addEventListener('pointermove', e => {
        if (motionPaused) return;
        const b = card.getBoundingClientRect(); x = (e.clientX-b.left)/b.width*100; y = (e.clientY-b.top)/b.height*100;
        if (!pending) { pending = true; requestAnimationFrame(() => { card.style.setProperty('--mx', x+'%'); card.style.setProperty('--my', y+'%'); pending = false; }); }
      });
    });
  }
  // Both halves have identical widths, so the end of the loop is the next start.
  const ticker = $('.ticker'), tickerTrack = $('.ticker-track');
  if (ticker && tickerTrack) {
    const items = ['Workshops', 'Flight line', 'Fixed-wing', 'Gliders', 'Multirotor', 'FPV'];
    let lastTickerWidth = 0, tickerRaf = 0;
    function updateTicker(force = false) {
      const width = ticker.clientWidth;
      if (!width || (!force && width === lastTickerWidth)) return;
      lastTickerWidth = width;
      const group = document.createElement('div'); group.className = 'ticker-group';
      function addSequence() {
        items.forEach(label => {
          const item = text('span', label, 'ticker-item');
          const plane = text('span', '✈', 'ticker-plane'); plane.setAttribute('aria-hidden', 'true');
          item.append(plane); group.append(item);
        });
      }
      addSequence(); tickerTrack.replaceChildren(group);
      // Each group covers the full viewport, including ultra-wide displays.
      let repeats = 1;
      while (group.getBoundingClientRect().width < width + 120 && repeats < 30) { addSequence(); repeats++; }
      const distance = group.getBoundingClientRect().width;
      tickerTrack.append(group.cloneNode(true));
      tickerTrack.style.setProperty('--ticker-duration', (distance / 52).toFixed(2) + 's');
    }
    updateTicker(true);
    if (document.fonts?.ready) document.fonts.ready.then(() => updateTicker(true));
    addEventListener('resize', () => { cancelAnimationFrame(tickerRaf); tickerRaf = requestAnimationFrame(() => updateTicker()); }, {passive:true});
  }
  const legacy = { about: 'festival.html', workshop: 'workshops.html', workshops: 'workshops.html', gallery: 'gallery.html', team: 'team.html', contact: 'contact.html', register: 'register.html' };
  const old = location.hash.replace(/^#\/?/, '');
  if (document.body.classList.contains('theme-home') && legacy[old]) location.replace(legacy[old]);
})();
