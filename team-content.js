const situationIconNames = ["message-circle", "messages-square", "lock-keyhole", "smartphone", "shield-check", "moon", "sprout", "cloud-sun", "person-standing", "book-open", "school", "palette", "volume-2", "activity", "list-checks", "heart-handshake", "footprints", "compass", "users", "heart", "house"];
function styleNavigator(body) {
  let block = null;
  [...body.children].forEach(element => {
    const text = element.textContent.trim();
    const heading = element.tagName !== "OL" && /^(Ситуация[.:]|Почему так может происходить|Возможные причины|Что делать родителям|Алгоритм действий|Чего (?:лучше )?избегать|Когда)/.test(text);
    if (heading) {
      block = document.createElement('section');
      block.className = 'nav-block';
      if (/^Ситуация/.test(text)) block.classList.add('nav-context');
      if (/^(Что делать|Алгоритм)/.test(text)) block.classList.add('nav-actions');
      if (/^Чего избегать/.test(text)) block.classList.add('nav-avoid');
      if (/^Когда/.test(text)) block.classList.add('nav-support');
      body.insertBefore(block, element);
    }
    if (!block) {
      block = document.createElement('section');
      block.className = 'nav-block';
      body.insertBefore(block, element);
    }
    block.append(element);
    if (heading && element.tagName === 'P') {
      const match = text.match(/^([^.!?]+[.!?])/);
      if (match && match[0].length < 100) {
        const strong = document.createElement('strong');
        strong.className = 'nav-label';
        strong.textContent = match[0];
        const source = element.textContent;
        element.replaceChildren(strong, document.createTextNode(source.slice(source.indexOf(match[0]) + match[0].length)));
      }
    }
    if (/^\d+[.)]\s/.test(text)) element.classList.add('nav-step');
  });
}
const teamArticleOffset = 0;
const teamSituationOffset = 0;

renderSituation = function () {
  const situation = situations[selectedSituation];

  const buttons = document.querySelector('#situationButtons');
  buttons.replaceChildren();
  situations.forEach((item, index) => {
    const button = document.createElement('button');
    button.className = 'sit-button' + (index === selectedSituation ? ' active' : '');
    button.dataset.sit = index;
    const icon = document.createElement('span');
    icon.className = 'situation-icon';
    icon.setAttribute('aria-hidden', 'true');
    const picture = document.createElement('img');
    picture.src = 'icons/' + situationIconNames[index] + '.svg';
    picture.alt = '';
    icon.append(picture);
    const label = document.createElement('span');
    label.textContent = item.title;
    button.append(icon, label);
    buttons.append(button);
  });
  const result = document.querySelector('#situationResult');
  result.innerHTML = '<span class="eyebrow">Навигатор для родителей</span><h3></h3><div class="article-body">' + situation.body + '</div><button type="button" id="relatedArticle">Читать статью по теме ↗</button>';
  const title = result.querySelector('h3');
  title.textContent = situation.title;
  const picture = document.createElement('img');
  picture.className = 'navigator-heading-image';
  picture.src = 'icons/' + situationIconNames[selectedSituation] + '.svg';
  picture.alt = '';
  title.before(picture);
  styleNavigator(result.querySelector('.article-body'));
  document.querySelector('#relatedArticle').onclick = () => {
    activeCat = 'Все';
    renderArticles();
    document.querySelector('[data-article="' + (teamArticleOffset + situation.article) + '"]').click();
  };
};
teamArticles.forEach((article, index) => {
  const related = teamSituations.map((item, n) => ({item,n})).filter(({item}) => item.article === index);
  article.body += '<h4>Ситуации по теме</h4>' + related.map(({item,n}) => '<p><button type="button" data-team-situation="' + (teamSituationOffset+n) + '">' + item.title.replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])) + '</button></p>').join('');
});
document.querySelector('#modalContent').addEventListener('click', event => {
  const button = event.target.closest('[data-team-situation]');
  if (!button) return;
  selectedSituation = Number(button.dataset.teamSituation);
  renderSituation();
  document.querySelector('#modal').close();
  location.hash = 'situations';
  document.querySelector('#situationResult').scrollIntoView({behavior:'smooth',block:'start'});
});
renderArticles();
renderSituation();
