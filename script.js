(() => {
  const C = window.CARTA;
  const $ = (id) => document.getElementById(id);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ---------- corações flutuando no fundo ---------- */
  const bg = document.querySelector(".hearts-bg");
  const HEARTS = ["💗", "💕", "💖", "🩷", "💞", "🌸", "✨"];

  function spawnHeart() {
    const h = document.createElement("span");
    h.className = "float-heart";
    h.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
    h.style.left = Math.random() * 100 + "vw";
    h.style.fontSize = 14 + Math.random() * 22 + "px";
    const dur = 7 + Math.random() * 6;
    h.style.animationDuration = dur + "s";
    bg.appendChild(h);
    setTimeout(() => h.remove(), dur * 1000);
  }

  if (!reduceMotion) {
    for (let i = 0; i < 8; i++) setTimeout(spawnHeart, i * 300);
    setInterval(spawnHeart, 650);
  }

  /* ---------- explosão de corações ---------- */
  function burst(x, y, n = 24) {
    for (let i = 0; i < n; i++) {
      const b = document.createElement("span");
      b.className = "burst";
      b.textContent = HEARTS[i % HEARTS.length];
      const ang = Math.random() * Math.PI * 2;
      const dist = 80 + Math.random() * 160;
      b.style.left = x + "px";
      b.style.top = y + "px";
      b.style.fontSize = 16 + Math.random() * 18 + "px";
      b.style.setProperty("--dx", Math.cos(ang) * dist + "px");
      b.style.setProperty("--dy", Math.sin(ang) * dist - 60 + "px");
      b.style.setProperty("--rot", (Math.random() * 120 - 60) + "deg");
      document.body.appendChild(b);
      setTimeout(() => b.remove(), 1700);
    }
  }

  /* ---------- digitação ---------- */
  let skip = false;

  async function typeInto(el, text) {
    el.classList.add("caret");
    if (skip || reduceMotion) {
      el.textContent = text;
    } else {
      for (const ch of text) {
        if (skip) { el.textContent = text; break; }
        el.textContent += ch;
        // pausinhas charmosas na pontuação
        const extra = ".!?".includes(ch) ? 260 : ",".includes(ch) ? 120 : 0;
        await sleep(C.velocidade + extra);
      }
    }
    el.classList.remove("caret");
  }

  async function writeLetter() {
    await typeInto($("to"), C.para);
    await sleep(skip ? 0 : 300);

    const body = $("body");
    for (const par of C.paragrafos) {
      const p = document.createElement("p");
      body.appendChild(p);
      await typeInto(p, par);
      await sleep(skip ? 0 : 350);
    }

    $("sign").textContent = C.assinatura;
    $("sign").classList.add("show");

    if (C.pergunta) {
      await sleep(900);
      $("qText").textContent = C.pergunta;
      $("yes").textContent = C.botaoSim;
      $("no").textContent = C.botaoNao;
      $("question").classList.add("show");
    }
  }

  // tocar na carta durante a digitação mostra tudo de uma vez
  $("letter").addEventListener("click", (e) => {
    if (!e.target.closest(".btn")) skip = true;
  });

  /* ---------- abrir o envelope ---------- */
  let opened = false;
  $("envelope").addEventListener("click", async (e) => {
    if (opened) return;
    opened = true;

    const env = $("envelope");
    const r = env.getBoundingClientRect();
    env.classList.add("opening");
    burst(r.left + r.width / 2, r.top + r.height / 2, 16);

    await sleep(1500);
    $("stage").classList.add("gone");
    $("letter").classList.add("show");
    await sleep(600);
    writeLetter();
  });

  /* ---------- botão "Não" fugindo ---------- */
  const no = $("no");
  let tries = 0;

  function runAway(e) {
    e.preventDefault();
    const pad = 16;
    const w = no.offsetWidth;
    const h = no.offsetHeight;
    no.classList.add("running");
    no.style.left = pad + Math.random() * (window.innerWidth - w - pad * 2) + "px";
    no.style.top = pad + Math.random() * (window.innerHeight - h - pad * 2) + "px";
    no.textContent = C.fugaNao[tries % C.fugaNao.length];
    tries++;
    // o "Sim" vai crescendo a cada tentativa 😏
    $("yes").style.scale = String(Math.min(1 + tries * 0.12, 1.8));
  }

  no.addEventListener("pointerdown", runAway);
  no.addEventListener("mouseenter", runAway);
  no.addEventListener("click", (e) => e.preventDefault());

  /* ---------- "Sim" ---------- */
  $("yes").addEventListener("click", (e) => {
    $("finalTitle").textContent = C.finalTitulo;
    $("finalText").textContent = C.finalTexto;
    no.style.display = "none";
    $("final").classList.add("show");

    const shower = (k) => burst(
      window.innerWidth * (0.2 + Math.random() * 0.6),
      window.innerHeight * (0.3 + Math.random() * 0.4),
      28
    );
    shower();
    if (!reduceMotion) for (let k = 1; k < 6; k++) setTimeout(shower, k * 350);
  });
})();
