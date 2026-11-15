/* Destaca no menu a seção visível na tela (aria-current), via IntersectionObserver. */
(function () {
  if (!('IntersectionObserver' in window)) return;

  const linkById = new Map();
  document.querySelectorAll('.nav__link[href^="#"]').forEach((a) => {
    linkById.set(a.getAttribute('href').slice(1), a);
  });

  const sections = [...linkById.keys()]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        linkById.forEach((a) => a.removeAttribute('aria-current'));
        linkById.get(entry.target.id).setAttribute('aria-current', 'true');
      });
    },
    // Faixa fina no meio da viewport: só uma seção por vez a cruza.
    { rootMargin: '-45% 0px -50% 0px' }
  );

  sections.forEach((s) => observer.observe(s));
})();
