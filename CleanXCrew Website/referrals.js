'use strict';
const outlineUrl = 'https://www.outlinehomeservices.com/';
const shareStatus = document.getElementById('shareStatus');
async function copyOutline() {
  try { await navigator.clipboard.writeText(outlineUrl); shareStatus.textContent = 'Link copied. Remind your friend to mention your name and phone number.'; }
  catch { shareStatus.textContent = 'Share this website: www.outlinehomeservices.com — and ask your friend to mention you.'; }
}
document.getElementById('copyOutline').addEventListener('click', copyOutline);
document.getElementById('shareOutline').addEventListener('click', async () => {
  if (!navigator.share) return copyOutline();
  try { await navigator.share({ title: 'Outline Home Services', text: 'Need holiday lighting? Check out Outline. Let them know I referred you when you book.', url: outlineUrl }); shareStatus.textContent = 'Thanks for spreading the word. Give your friend your name and phone number, too.'; }
  catch (error) { if (error.name !== 'AbortError') await copyOutline(); }
});
