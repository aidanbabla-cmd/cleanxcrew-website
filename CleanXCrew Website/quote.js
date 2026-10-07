'use strict';
const quoteApi = 'https://outline-crm.aidanbabla.workers.dev';
const form = document.getElementById('quoteForm');
const challenge = form.querySelector('[data-turnstile]');
let widget = null;
let ready = false;

async function loadQuoteVerification() {
  const status = form.querySelector('.ref-status');
  try {
    const response = await fetch(quoteApi + '/referral-config', { headers: { Accept: 'application/json' } });
    const config = await response.json();
    if (!response.ok || !config.enabled || !config.siteKey) throw new Error('The quote form is temporarily unavailable. Please call or text us.');
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = () => {
      ready = true;
      widget = window.turnstile.render(challenge, { sitekey: config.siteKey, theme: 'light', callback: token => { challenge.dataset.token = token; }, 'expired-callback': () => { challenge.dataset.token = ''; } });
    };
    script.onerror = () => { status.textContent = 'Verification could not load. Please call or text us.'; };
    document.head.appendChild(script);
  } catch (error) { status.textContent = error.message || 'The quote form is temporarily unavailable. Please call or text us.'; }
}

loadQuoteVerification();
form.addEventListener('submit', async event => {
  event.preventDefault();
  const status = form.querySelector('.ref-status'), button = form.querySelector('button[type="submit"]');
  const token = challenge.dataset.token || '';
  if (!token) { status.textContent = ready ? 'Complete the verification above, then try again.' : 'Verification is loading. Please try again in a moment.'; return; }
  const data = Object.fromEntries(new FormData(form));
  const payload = { ...data, kind: 'quote', consent: data.consent === 'on', turnstile: token };
  const original = button.innerHTML;
  button.disabled = true; button.textContent = 'Sending…'; status.textContent = 'Saving your request…';
  try {
    const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 15000);
    let response;
    try { response = await fetch(quoteApi + '/public-intake', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: controller.signal }); }
    finally { clearTimeout(timeout); }
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.error || 'We could not save this right now. Please call or text us.');
    status.textContent = 'Thanks — we got your request. Outline will reach out about your quote.';
    form.reset();
  } catch (error) { status.textContent = error.name === 'AbortError' ? 'This took too long. Please call us to check your request.' : (error.message || 'We could not save this right now. Please try again.'); }
  finally { button.disabled = false; button.innerHTML = original; challenge.dataset.token = ''; if (widget !== null) window.turnstile.reset(widget); }
});
