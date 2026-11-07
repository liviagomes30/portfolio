/* Menu mobile: abre/fecha o painel lateral, trava a rolagem e devolve o foco ao botão. */
(function () {
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  const scrim = document.querySelector('.nav__scrim');
  if (!toggle || !links || !scrim) return;

  function setMenu(open) {
    links.classList.toggle('open', open);
    scrim.classList.toggle('open', open);
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }

  toggle.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  scrim.addEventListener('click', () => setMenu(false));
  links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.classList.contains('open')) {
      setMenu(false);
      toggle.focus();
    }
  });

  // Ao voltar para a largura de desktop, garante que o menu fique fechado.
  window.matchMedia('(min-width: 769px)').addEventListener('change', (e) => {
    if (e.matches) setMenu(false);
  });
})();
