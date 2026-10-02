// Set these public values after the referral wording is approved. Never put the CRM access key here.
const REFERRAL_ENDPOINT = '';
const TURNSTILE_SITE_KEY = '';

let turnstileToken = '';
if (TURNSTILE_SITE_KEY) {
  const script = document.createElement('script');
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
  script.async = true;
  script.onload = () => window.turnstile.render('#turnstile', { sitekey: TURNSTILE_SITE_KEY, callback: token => { turnstileToken = token; }, 'expired-callback': () => { turnstileToken = ''; } });
  document.head.append(script);
}

document.querySelector('#referral-form').addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget, status = document.querySelector('#status'), button = form.querySelector('button[type="submit"]');
  if (!REFERRAL_ENDPOINT || !TURNSTILE_SITE_KEY) { status.textContent = 'This referral page is awaiting launch. Please contact Outline directly for now.'; return; }
  if (!turnstileToken) { status.textContent = 'Please finish the verification first.'; return; }
  const fields = Object.fromEntries(new FormData(form));
  const contact = value => String(value || '').trim();
  const person = contact(fields.referrerContact), lead = contact(fields.leadContact);
  const payload = {
    referrerName: contact(fields.referrerName), referrerPhone: person.includes('@') ? '' : person, referrerEmail: person.includes('@') ? person : '',
    leadName: contact(fields.leadName), leadPhone: lead.includes('@') ? '' : lead, leadEmail: lead.includes('@') ? lead : '',
    leadAddress: contact(fields.leadAddress), service: contact(fields.service), note: contact(fields.note), website: contact(fields.website), turnstile: turnstileToken
  };
  button.disabled = true; button.textContent = 'Sending…'; status.textContent = '';
  try {
    const response = await fetch(REFERRAL_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.error || 'Please try again.');
    form.reset(); status.textContent = 'Thanks — your referral is in. We’ll review it and be in touch if we need anything else.';
  } catch (error) { status.textContent = error.message || 'Could not send. Please try again.'; }
  finally { button.disabled = false; button.textContent = 'Send referral ↗'; turnstileToken = ''; window.turnstile?.reset(); }
});
