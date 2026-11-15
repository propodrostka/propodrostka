(() => {
  const inputs = [...document.querySelectorAll('[name="siteRating"]')];
  const status = document.querySelector('#ratingStatus');
  function display(value) {
    inputs.forEach(input => {
      input.checked = Number(input.value) === value;
      input.parentElement.classList.toggle('selected', Number(input.value) <= value);
    });
    status.textContent = 'Спасибо! Ваша оценка — ' + value + ' из 5.';
  }
  try {
    const saved = Number(localStorage.getItem('pro_site_rating'));
    if (saved >= 1 && saved <= 5) display(saved);
  } catch {}
  inputs.forEach(input => input.addEventListener('change', () => {
    const value = Number(input.value);
    display(value);
    try { localStorage.setItem('pro_site_rating', String(value)); }
    catch { status.textContent += ' Сохранение в браузере недоступно.'; }
  }));
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
})();