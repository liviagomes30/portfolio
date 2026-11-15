/* Avatar 3D da hero: acompanha o cursor com uma leve inclinação (efeito de "olhar").
   Só roda em telas grandes e com mouse; sem isso o avatar fica parado. */
(function () {
  const avatar = document.querySelector('.hero__avatar');
  if (!avatar) return;
  const img = avatar.querySelector('img');
  const big = window.matchMedia('(min-width: 1200px) and (min-height: 700px)');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  const MAX = 9; // graus
  let tick = false;

  window.addEventListener(
    'pointermove',
    (e) => {
      if (!big.matches || reduce.matches || e.pointerType !== 'mouse' || tick) return;
      tick = true;
      requestAnimationFrame(() => {
        tick = false;
        const r = avatar.getBoundingClientRect();
        if (!r.width) return; // removido (arquivo ausente) ou oculto
        const dx = (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2);
        const clamp = (v) => Math.max(-1, Math.min(1, v));
        img.style.setProperty('--avatar-ry', `${clamp(dx) * MAX}deg`);
        img.style.setProperty('--avatar-rx', `${-clamp(dy) * MAX * 0.7}deg`);
      });
    },
    { passive: true }
  );
})();
