/* Animação de entrada: revela os elementos .reveal quando entram na tela. */
(function () {
  const items = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    // threshold 0: elementos muito altos (ex.: grade de projetos no celular) nunca
    // chegariam a 10% visíveis em telas baixas, como celular na horizontal.
    { threshold: 0, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach((el) => observer.observe(el));
})();
