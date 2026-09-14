const revealButton = document.querySelector('[data-reveal-message]');
const loveNote = document.querySelector('#love-note');

revealButton?.addEventListener('click', () => {
  loveNote.hidden = false;
  loveNote.scrollIntoView({ behavior: 'smooth', block: 'center' });
  revealButton.setAttribute('aria-expanded', 'true');
  revealButton.textContent = 'Pesan terbuka ♡';
});
