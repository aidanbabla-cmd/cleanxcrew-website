'use strict';
const referralApi = 'https://outline-crm.aidanbabla.workers.dev';
const panels = { referral: document.getElementById('refer-panel'), join: document.getElementById('join-panel') };
const widgets = {};
let widgetKey = '';
let challengeReady = false;

function showChoice(kind) {
  for (const [key, panel] of Object.entries(panels)) {
    panel.hidden = key !== kind;
    document.querySelector(`[data-choice="${key === 'referral' ? 'refer' : key}"]`).setAttribute('aria-expanded', String(key === kind));
  }
  if (kind) {
    panels[kind].scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    renderChallenge(kind);
  }
}

document.querySelectorAll('[data-choice]').forEach(button => button.addEventListener('click', () => showChoice(button.dataset.choice === 'refer' ? 'referral' : 'join')));
document.querySelectorAll('.ref-panel-close').forEach(button => button.addEventListener('click', () => showChoice('')));

function renderChallenge(kind) {
  if (!challengeReady || !widgetKey || widgets[kind] !== undefined) return;
  const target = document.querySelector(`[data-turnstile="${kind}"]`);
  widgets[kind] = window.turnstile.render(target, { sitekey: widgetKey, theme: 'light', 'expired-callback': () => { target.dataset.token = ''; }, callback: token => { target.dataset.token = token; } });
}

async function loadChallenge() {
  try {
    const response = await fetch(referralApi + '/referral-config', { headers: { Accept: 'application/json' } });
    const config = await response.json();
    if (!response.ok || !config.enabled || !config.siteKey) throw new Error('Forms are not available yet. Please text or call us.');
    widgetKey = config.siteKey;
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = () => { challengeReady = true; for (const [kind, panel] of Object.entries(panels)) if (!panel.hidden) renderChallenge(kind); };
    script.onerror = () => { document.querySelectorAll('.ref-status').forEach(status => { status.textContent = 'Verification could not load. Please refresh or text us.'; }); };
    document.head.appendChild(script);
  } catch (error) {
    document.querySelectorAll('.ref-status').forEach(status => { status.textContent = error.message || 'Forms are not available yet. Please text or call us.'; });
  }
}
loadChallenge();

for (const form of document.querySelectorAll('form[data-kind]')) {
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const kind = form.dataset.kind, status = form.querySelector('.ref-status'), button = form.querySelector('button[type="submit"]');
    const token = form.querySelector('[data-turnstile]').dataset.token || '';
    if (!token) { status.textContent = 'Complete the verification above, then try again.'; renderChallenge(kind); return; }
    const data = Object.fromEntries(new FormData(form));
    const payload = { ...data, kind, consent: data.consent === 'on', turnstile: token };
    button.disabled = true;
    const original = button.innerHTML;
    button.textContent = 'Sending…';
    status.textContent = 'Saving your details…';
    try {
      const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 15000);
      let response;
      try { response = await fetch(referralApi + '/referral-intake', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: controller.signal }); }
      finally { clearTimeout(timeout); }
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || 'Could not save this right now. Please try again.');
      status.textContent = kind === 'join' ? (result.alreadyJoined ? 'You’re already registered. Thanks for being part of Outline.' : 'You’re on the list. Thanks for joining Outline.') : 'Your referral is in. Our team will review it and follow up.';
      form.reset();
    } catch (error) {
      status.textContent = error.name === 'AbortError' ? 'This took too long. Please check with our team before trying again.' : (error.message || 'Could not save this right now. Please try again.');
    } finally {
      button.disabled = false;
      button.innerHTML = original;
      form.querySelector('[data-turnstile]').dataset.token = '';
      if (widgets[kind] !== undefined) window.turnstile.reset(widgets[kind]);
    }
  });
}
