/* Mascote "Byte": acompanha a rolagem, olha para o cursor, comenta cada seção
   e reage ao que o visitante faz (cliques, rolagem rápida, ociosidade, passar o mouse...).
   Todo o DOM é criado aqui, então sem JavaScript o site fica exatamente como antes. */
(function () {
  const STORAGE_KEY = 'mascot-hidden';
  try {
    if (localStorage.getItem(STORAGE_KEY) === '1') return;
  } catch (e) {
    /* localStorage indisponível: segue sem persistir */
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Falas ---------- */

  // Comentário de cada seção (chave = id da seção ou, sem id, a classe).
  const LINES = {
    hero: 'Oi! Eu sou o Byte. Vem comigo?',
    sobre: 'Aqui você conhece a Lívia!',
    habilidades: 'Essa é a stack dela.',
    stats: 'Olha só esses números.',
    projetos: 'Os projetos mais legais!',
    process: 'Assim ela trabalha.',
    experiencia: 'Já passou por 4 empresas.',
    merito: '4× a melhor média!',
    formacao: 'Sempre estudando.',
    contato: 'Bora conversar?',
  };

  // Piadas e curiosidades para os cliques (sorteadas sem repetir até acabar).
  const TIPS = [
    'Ela começou no suporte técnico e hoje é full-stack.',
    'Microsserviços, DDD e muito café.',
    'Dica: o AlocaCreche é um projeto de arquitetura bem completo.',
    'Funciona na minha máquina ¯\\_(ツ)_/¯',
    'Existem 10 tipos de pessoas: as que entendem binário e as que não.',
    'Bug bom é bug que o teste pegou primeiro.',
    'Eu sou feito de HTML, CSS e um pouquinho de JS.',
    '4× a melhor média do termo. Eu só observo, impressionado.',
    'Commit pequeno, vida longa.',
    'Dica: abre o repositório dos projetos, tem coisa boa lá.',
  ];

  // Reações ao passar o mouse sobre partes da página (só com mouse).
  const HOVERS = [
    ['.btn--primary', 'Ver projetos? Boa escolha!', 'wink'],
    ['.project-card__link', 'Código aberto no GitHub!', 'wow'],
    ['.contact__link', 'Manda um oi!', 'love'],
    ['.about__photo', 'Essa é a Lívia!', 'wink'],
    ['.stat', 'Cada número tem uma história.', 'wow'],
    ['.honor-card', 'Mérito de verdade!', 'love'],
    ['.skill-card', 'Ela manja disso!', 'wink'],
  ];

  const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? 'Bom dia!' : h < 18 ? 'Boa tarde!' : 'Boa noite!';
  };

  /* ---------- DOM ---------- */

  const SVG = `
    <svg class="mascot__svg" viewBox="0 0 72 80" aria-hidden="true" focusable="false">
      <!-- antena -->
      <path class="mascot__antenna" d="M36 14V6"/>
      <circle class="mascot__bulb" cx="36" cy="5" r="4"/>
      <!-- "orelhas" em formato de chaves { } -->
      <path class="mascot__brace" d="M9 30q-5 0-5 5v4q0 3-3 3 3 0 3 3v4q0 5 5 5"/>
      <path class="mascot__brace" d="M63 30q5 0 5 5v4q0 3 3 3-3 0-3 3v4q0 5-5 5"/>
      <!-- cabeça + tela do rosto -->
      <rect class="mascot__head" x="9" y="14" width="54" height="50" rx="14"/>
      <rect class="mascot__screen" x="15" y="22" width="42" height="34" rx="9"/>

      <!-- olhos normais (piscam e seguem o cursor) -->
      <g class="mascot__blink eyes--normal">
        <g class="eye-l">
          <circle class="mascot__eye" cx="27" cy="36" r="7"/>
          <circle class="mascot__pupil" data-pupil cx="27" cy="36" r="3.2"/>
        </g>
        <g class="eye-r">
          <circle class="mascot__eye" cx="45" cy="36" r="7"/>
          <circle class="mascot__pupil" data-pupil cx="45" cy="36" r="3.2"/>
        </g>
      </g>
      <!-- piscadinha, dormindo, tonto, apaixonado -->
      <path class="mascot__lid mascot__wink" d="M39 37q6-6 12 0"/>
      <g class="mascot__lids">
        <path class="mascot__lid" d="M21 36q6 5 12 0"/>
        <path class="mascot__lid" d="M39 36q6 5 12 0"/>
      </g>
      <g class="mascot__xs">
        <path class="mascot__lid" d="M22 31l10 10M32 31l-10 10"/>
        <path class="mascot__lid" d="M40 31l10 10M50 31l-10 10"/>
      </g>
      <g class="mascot__hearts">
        <path class="mascot__heart" d="M27 42c-9-6-6-14 0-9 6-5 9 3 0 9z"/>
        <path class="mascot__heart" d="M45 42c-9-6-6-14 0-9 6-5 9 3 0 9z"/>
      </g>

      <circle class="mascot__cheek" cx="21" cy="47" r="3.5"/>
      <circle class="mascot__cheek" cx="51" cy="47" r="3.5"/>
      <!-- bocas -->
      <path class="mascot__mouth mascot__mouth--smile" d="M30 47q6 5 12 0"/>
      <path class="mascot__mouth mascot__mouth--open" d="M30 46h12q-1 7-6 7t-6-7z"/>
      <ellipse class="mascot__mouth mascot__mouth--o" cx="36" cy="49" rx="3" ry="3.6"/>
      <!-- pezinhos -->
      <rect class="mascot__foot mascot__foot--l" x="19" y="66" width="12" height="8" rx="4"/>
      <rect class="mascot__foot mascot__foot--r" x="41" y="66" width="12" height="8" rx="4"/>
    </svg>`;

  const root = document.createElement('aside');
  root.className = 'mascot';
  root.setAttribute('aria-label', 'Byte, mascote do portfólio');
  root.innerHTML = `
    <p class="mascot__bubble" aria-hidden="true"></p>
    <button type="button" class="mascot__figure" aria-label="Byte, o mascote. Clique para ouvir uma dica ou piada">
      ${SVG}
      <span class="mascot__zzz" aria-hidden="true">z<b>z</b><i>Z</i></span>
    </button>
    <button type="button" class="mascot__close" aria-label="Esconder o mascote">×</button>`;
  document.body.appendChild(root);

  const bubble = root.querySelector('.mascot__bubble');
  const figure = root.querySelector('.mascot__figure');
  const pupils = root.querySelectorAll('[data-pupil]');

  /* ---------- Humores e animações ---------- */

  let moodTimer;
  let sleeping = false;

  // Humores: wink, wow, love, dizzy, sleep. Sem argumento volta ao normal.
  function setMood(mood, ms) {
    clearTimeout(moodTimer);
    if (mood) root.dataset.mood = mood;
    else delete root.dataset.mood;
    if (mood && ms) moodTimer = setTimeout(() => setMood(sleeping ? 'sleep' : null), ms);
  }

  // Animações pontuais: do-flip, do-jump, do-shake.
  function play(cls) {
    if (reduceMotion.matches) return;
    figure.classList.remove(cls);
    void figure.offsetWidth; // reinicia a animação
    figure.classList.add(cls);
    figure.addEventListener('animationend', () => figure.classList.remove(cls), { once: true });
  }

  const COLORS = ['#1D71B8', '#36A9E1', '#FFBD2E', '#FF5F56', '#27C93F'];

  function confetti() {
    if (reduceMotion.matches) return;
    const r = figure.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    for (let i = 0; i < 18; i++) {
      const el = document.createElement('i');
      el.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;width:7px;height:7px;` +
        `border-radius:2px;pointer-events:none;z-index:95;background:${COLORS[i % COLORS.length]}`;
      document.body.appendChild(el);
      const a = Math.PI * (0.55 + Math.random() * 0.9); // espalha para a esquerda/cima
      const d = 70 + Math.random() * 90;
      el.animate(
        [
          { transform: 'translate(0,0) rotate(0)', opacity: 1 },
          {
            transform: `translate(${Math.cos(a) * d}px, ${-Math.sin(a) * d + 50}px) rotate(${Math.random() * 540}deg)`,
            opacity: 0,
          },
        ],
        { duration: 900 + Math.random() * 500, easing: 'cubic-bezier(.15,.8,.3,1)' }
      ).onfinish = () => el.remove();
    }
  }

  /* ---------- Fala ---------- */

  let talkTimer;
  let current = 'hero';
  let walkX = 0; // destino atual do passeio (px para a esquerda do cantinho)

  let quietUntil = 0; // reações especiais não são atropeladas pelo comentário da seção

  // Posição (px da borda esquerda) onde o Byte vai estar quando terminar de andar.
  function finalLeft() {
    const r = figure.getBoundingClientRect();
    const tx = parseFloat(getComputedStyle(root).translate) || 0;
    return r.left + (-walkX - tx);
  }

  function say(text, ms, asked, special) {
    if (special) quietUntil = Date.now() + (ms || 3200);
    bubble.textContent = text;
    // Perto da borda esquerda (inclusive no ponto de chegada de um passeio) o balão
    // passa para o lado direito, para não sair da tela.
    root.classList.toggle('bubble-right', finalLeft() < bubble.offsetWidth + 24);
    root.classList.add('is-talking');
    clearTimeout(talkTimer);
    talkTimer = setTimeout(() => root.classList.remove('is-talking'), ms || 3200);
  }

  const bag = [];
  function nextTip() {
    if (!bag.length) {
      bag.push(...TIPS);
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
    }
    return bag.pop();
  }

  /* ---------- Atividade / sono ---------- */

  let lastActive = Date.now();

  function wake() {
    if (!sleeping) return;
    sleeping = false;
    setMood('wow', 1600);
    play('do-jump');
    say('Ah! Eu estava cochilando…', 2800);
  }

  function activity() {
    lastActive = Date.now();
    wake();
  }

  ['pointermove', 'pointerdown', 'keydown', 'scroll', 'touchstart'].forEach((ev) =>
    window.addEventListener(ev, activity, { passive: true })
  );

  setInterval(() => {
    if (!sleeping && Date.now() - lastActive > 25000 && !document.hidden) {
      sleeping = true;
      root.classList.remove('is-talking');
      setMood('sleep');
    }
  }, 4000);

  // Volta à aba depois de um tempo fora.
  let hiddenAt = 0;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      hiddenAt = Date.now();
    } else if (hiddenAt && Date.now() - hiddenAt > 6000) {
      lastActive = Date.now();
      setMood('wink', 2500);
      say('Voltou! Senti sua falta.', 3200);
    }
  });

  /* ---------- Comenta cada seção ---------- */

  const sections = [...document.querySelectorAll('main > section')];
  const keyOf = (el) => el.id || [...el.classList].find((c) => LINES[c]) || null;

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const key = keyOf(entry.target);
          if (!key || !LINES[key] || key === current) return;
          current = key;
          if (sleeping || Date.now() < quietUntil) return;
          say(LINES[key]);
          if (key === 'merito') setMood('love', 2200);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => io.observe(s));
  }

  // Saudação inicial, pouco depois da animação de entrada da hero.
  setTimeout(() => {
    say(`${greeting()} Eu sou o Byte. Vem comigo?`, 4200);
    setMood('wink', 1800);
  }, 1800);

  /* ---------- Cliques ---------- */

  let clicks = 0;
  let clickReset;
  let useContext = true;

  figure.addEventListener('click', () => {
    if (suppressClick) return; // o clique que sobra ao soltar depois de arrastar
    activity();
    clicks++;
    clearTimeout(clickReset);
    clickReset = setTimeout(() => (clicks = 0), 3500);

    if (clicks === 6) {
      setMood('dizzy', 2200);
      play('do-shake');
      say('Ei, isso faz cócegas!', 2600, true);
    } else if (clicks >= 12) {
      clicks = 0;
      setMood('love', 3000);
      play('do-flip');
      confetti();
      say('Você achou o segredo do Byte!', 3600, true);
    } else {
      play('do-jump');
      setMood('wow', 700);
      say(useContext ? LINES[current] || LINES.hero : nextTip(), 4200, true);
      useContext = !useContext;
    }
  });

  figure.addEventListener('dblclick', () => {
    play('do-flip');
    setMood('love', 1500);
  });

  // Piscadinha ao passar o mouse.
  figure.addEventListener('pointerenter', (e) => {
    if (e.pointerType === 'mouse' && !sleeping) setMood('wink', 1400);
  });

  /* ---------- Reage ao mouse em partes da página ---------- */

  let hoverCooldown = 0;
  let lastHoverEl = null;

  document.addEventListener('pointerover', (e) => {
    if (e.pointerType !== 'mouse' || sleeping || Date.now() < hoverCooldown) return;
    if (root.contains(e.target)) return;
    for (const [sel, text, mood] of HOVERS) {
      const el = e.target.closest && e.target.closest(sel);
      if (el && el !== lastHoverEl) {
        lastHoverEl = el;
        hoverCooldown = Date.now() + 7000;
        setMood(mood, 1800);
        say(text, 2600);
        return;
      }
    }
  });

  // Agradece quem clicar no e-mail.
  document.addEventListener('click', (e) => {
    const mail = e.target.closest && e.target.closest('a[href^="mailto:"]');
    if (!mail) return;
    confetti();
    setMood('love', 2500);
    say('Obrigado por escrever!', 3200);
  });

  /* ---------- Passeios pela tela ---------- */
  // De tempos em tempos o Byte sai do cantinho, caminha até um ponto da tela,
  // comenta alguma coisa e volta. Não passeia dormindo, com o menu aberto ou com movimento reduzido.

  const SPEED = 140; // px por segundo
  const WALK_LINES = ['Vou dar uma voltinha!', 'Deixa eu esticar as pernas.', 'Já volto!'];
  const ARRIVE_LINES = [
    'Daqui a vista é boa.',
    'Estou de olho em você.',
    'Posso ficar aqui um pouquinho?',
    'Passeando e lendo o portfólio.',
  ];
  const BACK_LINES = ['Voltando pro meu cantinho!', 'Já deu minha voltinha.'];
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  let away = false; // true entre sair do cantinho e voltar
  let walkEnd;
  let strollTimer;
  let walkGen = 0; // muda quando algo interrompe o passeio (ex.: o visitante pega o Byte)
  let dragging = false;

  function setAway(v) {
    away = v;
    root.classList.toggle('is-away', v);
  }

  function walkTo(dist, onArrive) {
    const delta = dist - walkX;
    const ms = (Math.abs(delta) / SPEED) * 1000;
    const goingLeft = delta > 0; // o cantinho fica à direita
    root.style.setProperty('--walk-dur', `${ms / 1000}s`);
    root.style.setProperty('--lean', `${goingLeft ? -6 : 6}deg`);
    root.classList.add('is-walking');
    root.classList.remove('is-talking');
    pupils.forEach((p) => (p.style.transform = `translate(${goingLeft ? -2.4 : 2.4}px, 0)`));
    root.style.setProperty('--walk-x', `${-dist}px`);
    walkX = dist;
    clearTimeout(walkEnd);
    walkEnd = setTimeout(() => {
      root.classList.remove('is-walking');
      root.style.setProperty('--lean', '0deg');
      pupils.forEach((p) => (p.style.transform = ''));
      if (onArrive) onArrive();
    }, ms + 80);
  }

  function canStroll() {
    return (
      !away &&
      !dragging &&
      !sleeping &&
      !root.hidden &&
      !document.hidden &&
      !reduceMotion.matches &&
      !document.querySelector('.nav__links.open') &&
      Date.now() >= quietUntil
    );
  }

  function stroll() {
    scheduleStroll();
    if (!canStroll()) return;
    const gen = ++walkGen;
    setAway(true);
    const vw = window.innerWidth;
    const dist = Math.min(vw * (0.3 + Math.random() * 0.4), 760);
    say(pick(WALK_LINES), 2200, false, true);
    setTimeout(() => {
      if (gen !== walkGen) return;
      if (sleeping) return returnHome(gen);
      walkTo(dist, () => {
        if (gen !== walkGen) return;
        setMood('wow', 1200);
        play('do-jump');
        say(pick(ARRIVE_LINES), 3200);
        setTimeout(() => returnHome(gen), 5000 + Math.random() * 3000);
      });
    }, 1400);
  }

  function returnHome(gen) {
    if (gen !== walkGen) return;
    say(pick(BACK_LINES), 2200);
    setTimeout(() => {
      if (gen !== walkGen) return;
      root.style.setProperty('--drag-y', '0px');
      walkTo(0, () => {
        if (gen !== walkGen) return;
        setAway(false);
        setMood('wink', 1200);
      });
    }, 1200);
  }

  function scheduleStroll(first) {
    clearTimeout(strollTimer);
    strollTimer = setTimeout(stroll, first ? 9000 + Math.random() * 4000 : 22000 + Math.random() * 14000);
  }
  scheduleStroll(true);

  /* ---------- Arrastar o Byte ---------- */
  // O visitante pode pegar o Byte (mouse ou toque) e levar para qualquer lugar da tela.
  // Ele reage: se assusta, balança as perninhas, e ao soltar cai (ou é lançado, se soltar rápido).
  // Depois de alguns segundos ele volta sozinho para o cantinho.

  const PICK_LINES = ['Ei! Pra onde vamos?', 'Uau, estou voando!', 'Cuidado comigo!', 'Me segura direito!'];
  const DROP_LINES = ['Aqui está bom!', 'Boa aterrissagem!', 'Gostei daqui.', 'Obrigado pela carona!'];
  const THROW_LINES = ['Uuuui, que lançamento!', 'Quase passei mal!', 'Ufa! Aterrissei.'];
  const DRAG_PAD = 4;

  let dragStart = null; // { x, y, id } enquanto o botão/dedo está pressionado
  let grab = { x: 0, y: 0 }; // onde, dentro do Byte, o visitante pegou
  let dockLeft = 0; // borda esquerda do Byte no cantinho
  let dragY = 0;
  let suppressClick = false;
  let homeTimer;
  let drags = 0;
  let dragsReset;
  const trail = []; // [tempo, x, y] dos últimos instantes, para calcular a velocidade ao soltar

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  // Posiciona o Byte com a borda esquerda/topo em (left, top), limitado à tela.
  function placeAt(left, top) {
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const l = clamp(left, DRAG_PAD, vw - figure.offsetWidth - DRAG_PAD);
    const t = clamp(top, 72, vh - figure.offsetHeight - DRAG_PAD);
    walkX = dockLeft - l;
    root.style.setProperty('--walk-x', `${-walkX}px`);
    dragY = t - (parseFloat(root.style.getPropertyValue('--mascot-y')) || 0);
    root.style.setProperty('--drag-y', `${dragY}px`);
    return [l, t];
  }

  function startDrag(e) {
    dragging = true;
    suppressClick = true;
    walkGen++; // cancela qualquer passeio em andamento
    clearTimeout(walkEnd);
    clearTimeout(homeTimer);
    setAway(true);
    root.classList.remove('is-walking', 'is-talking');
    root.classList.add('is-dragging');
    const r = figure.getBoundingClientRect();
    dockLeft =
      document.documentElement.clientWidth - parseFloat(getComputedStyle(root).right) - root.offsetWidth;
    grab = { x: dragStart.x - r.left, y: dragStart.y - r.top };
    placeAt(r.left, r.top);
    setMood('wow');
    say(pick(PICK_LINES), 2600, false, true);
  }

  function moveDrag(e) {
    const [l, t] = placeAt(e.clientX - grab.x, e.clientY - grab.y);
    const now = performance.now();
    trail.push([now, l, t]);
    while (trail.length && trail[0][0] < now - 100) trail.shift();
    if (trail.length > 1) {
      const a = trail[0];
      const b = trail[trail.length - 1];
      const vx = (b[1] - a[1]) / Math.max(1, b[0] - a[0]);
      root.style.setProperty('--lean', `${clamp(vx * 12, -22, 22)}deg`); // balança conforme o movimento
      pupils.forEach((p) => (p.style.transform = `translate(${clamp(vx * 3, -2.4, 2.4)}px, 2px)`));
    }
    root.classList.toggle('bubble-right', l < bubble.offsetWidth + 24);
  }

  function endDrag() {
    dragging = false;
    setTimeout(() => (suppressClick = false), 60);
    root.classList.remove('is-dragging');
    root.style.setProperty('--lean', '0deg');
    pupils.forEach((p) => (p.style.transform = ''));

    // Velocidade no momento de soltar (px/ms) -> inércia do lançamento.
    let vx = 0;
    let vy = 0;
    if (trail.length > 1) {
      const a = trail[0];
      const b = trail[trail.length - 1];
      const dt = Math.max(16, b[0] - a[0]);
      vx = (b[1] - a[1]) / dt;
      vy = (b[2] - a[2]) / dt;
    }
    trail.length = 0;
    const speed = Math.hypot(vx, vy);
    const r = figure.getBoundingClientRect();
    root.style.setProperty('--walk-dur', '.45s');
    placeAt(r.left + (speed > 0.6 ? vx * 180 : 0), r.top + (speed > 0.6 ? vy * 180 : 0));
    play('do-land');

    clearTimeout(dragsReset);
    drags++;
    dragsReset = setTimeout(() => (drags = 0), 60000);
    if (drags === 5) {
      setMood('love', 2500);
      say('Já vi que você gosta de me carregar!', 3600, false, true);
    } else if (speed > 1.6) {
      setMood('dizzy', 1800);
      say(pick(THROW_LINES), 2600, false, true);
    } else {
      setMood('love', 1800);
      say(pick(DROP_LINES), 2600, false, true);
    }

    // Depois de um tempo, volta sozinho para o cantinho.
    homeTimer = setTimeout(() => {
      if (dragging) return;
      returnHome(++walkGen);
    }, 10000 + Math.random() * 4000);
  }

  figure.addEventListener('pointerdown', (e) => {
    if (e.button > 0) return;
    // Evita que o navegador comece a selecionar texto / arrastar a imagem (o que cancelaria o gesto).
    if (e.pointerType === 'mouse') e.preventDefault();
    dragStart = { x: e.clientX, y: e.clientY, id: e.pointerId };
    // Captura já no clique: movimentos rápidos para fora do Byte continuam chegando aqui.
    try {
      figure.setPointerCapture(e.pointerId);
    } catch (err) {
      /* ok */
    }
  });

  figure.addEventListener('dragstart', (e) => e.preventDefault());

  figure.addEventListener('pointermove', (e) => {
    if (!dragStart || e.pointerId !== dragStart.id) return;
    if (!dragging) {
      if (Math.hypot(e.clientX - dragStart.x, e.clientY - dragStart.y) < 6) return; // ainda é só um clique
      startDrag(e);
    }
    moveDrag(e);
  });

  ['pointerup', 'pointercancel'].forEach((ev) =>
    figure.addEventListener(ev, () => {
      const was = dragging;
      dragStart = null;
      if (was) endDrag();
    })
  );

  /* ---------- Acompanha a rolagem ---------- */

  const PAD_TOP = 84; // abaixo do nav
  const PAD_BOTTOM = 24;
  let ticking = false;
  let lastY = window.scrollY;
  let tiltTimer;
  let reachedEnd = false;
  let dizzyUntil = 0;
  const history = [];

  function update() {
    ticking = false;
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / max));
    const h = figure.offsetHeight || 80;
    const range = Math.max(0, window.innerHeight - PAD_TOP - PAD_BOTTOM - h);
    root.style.setProperty('--mascot-y', `${PAD_TOP + progress * range}px`);

    // Inclina levemente para o sentido da rolagem.
    if (!reduceMotion.matches) {
      const dir = Math.sign(window.scrollY - lastY);
      if (dir) {
        root.style.setProperty('--mascot-tilt', `${dir * 7}deg`);
        clearTimeout(tiltTimer);
        tiltTimer = setTimeout(() => root.style.setProperty('--mascot-tilt', '0deg'), 160);
      }
    }
    lastY = window.scrollY;

    // Rolagem muito rápida: fica tonto.
    const now = performance.now();
    history.push([now, window.scrollY]);
    while (history.length && history[0][0] < now - 400) history.shift();
    if (history.length > 1 && Math.abs(window.scrollY - history[0][1]) > 2200 && now > dizzyUntil) {
      dizzyUntil = now + 9000;
      setMood('dizzy', 2200);
      say('Calma! Estou ficando tonto!', 2800, false, true);
    }

    // Chegou ao fim da página: comemora.
    if (progress > 0.985 && !reachedEnd) {
      reachedEnd = true;
      setMood('love', 3200);
      play('do-jump');
      confetti();
      say('Chegamos ao fim! Bora conversar?', 4000, false, true);
    } else if (progress < 0.9) {
      reachedEnd = false;
    }
  }

  function requestUpdate() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  update();

  /* ---------- Olhos seguem o cursor ---------- */

  const MAX_OFFSET = 2.6;
  let moveTick = false;

  window.addEventListener(
    'pointermove',
    (e) => {
      if (reduceMotion.matches || e.pointerType === 'touch' || moveTick) return;
      moveTick = true;
      requestAnimationFrame(() => {
        moveTick = false;
        const r = figure.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const dist = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, dist / 160) * MAX_OFFSET;
        const tx = (dx / dist) * k;
        const ty = (dy / dist) * k;
        pupils.forEach((p) => (p.style.transform = `translate(${tx}px, ${ty}px)`));
      });
    },
    { passive: true }
  );

  /* ---------- Esconder ---------- */

  root.querySelector('.mascot__close').addEventListener('click', () => {
    root.hidden = true;
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch (e) {
      /* ignora */
    }
  });
})();
