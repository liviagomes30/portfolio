/* Contagem animada dos números da seção "Trajetória": sobe de 0 até o valor
   quando a seção aparece. Sem JS (ou com movimento reduzido) o número final já está no HTML. */
(function () {
  const items = document.querySelectorAll('[data-count]');
  if (!items.length) return;
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const format = (el, n) =>
    (el.dataset.prefix || '') + n + (el.dataset.suffix || '');

  function run(el) {
    const target = Number(el.dataset.count);
    const duration = 1100;
    const start = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // desacelera no final
      el.textContent = format(el, Math.round(target * eased));
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        run(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );

  items.forEach((el) => {
    el.textContent = format(el, 0);
    observer.observe(el);
  });
})();
