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

  /* ---------- confete ---------- */
  function confetti(duration = 3500) {
    const cv = $("confetti");
    const ctx = cv.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    cv.width = innerWidth * dpr;
    cv.height = innerHeight * dpr;
    ctx.scale(dpr, dpr);

    const COLORS = ["#ff7aa2", "#ffb3c7", "#e2557f", "#ffd166", "#ffffff", "#c77dff"];
    const parts = [];
    const end = performance.now() + duration;

    function spawn(fromLeft) {
      const ang = (fromLeft ? -60 : -120) * Math.PI / 180 + (Math.random() - .5) * .6;
      const sp = 9 + Math.random() * 8;
      parts.push({
        x: fromLeft ? 0 : innerWidth,
        y: innerHeight * .85,
        vx: Math.cos(ang) * sp,
        vy: Math.sin(ang) * sp,
        r: Math.random() * Math.PI,
        vr: (Math.random() - .5) * .3,
        s: 6 + Math.random() * 6,
        heart: Math.random() < .15,
        c: COLORS[Math.floor(Math.random() * COLORS.length)]
      });
    }

    (function frame(t) {
      if (t < end) for (let i = 0; i < 4; i++) spawn(i % 2 === 0);
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.vy += .25;
        p.vx *= .99;
        p.x += p.vx;
        p.y += p.vy;
        p.r += p.vr;
        if (p.y > innerHeight + 30) { parts.splice(i, 1); continue; }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        if (p.heart) {
          ctx.font = p.s * 2.4 + "px serif";
          ctx.fillText("💗", -p.s, p.s);
        } else {
          ctx.fillStyle = p.c;
          ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
        }
        ctx.restore();
      }
      if (parts.length || t < end) requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, innerWidth, innerHeight);
    })(performance.now());
  }

  /* ---------- "Sim" ---------- */
  function fillFinal() {
    $("finalTitle").textContent = C.finalTitulo;
    $("finalText").textContent = C.finalTexto;

    const cv = C.convite;
    $("ticketTitle").textContent = cv.titulo;
    for (const [k, v] of cv.linhas) {
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = k;
      dd.textContent = v;
      $("ticketRows").append(dt, dd);
    }
    $("stamp").textContent = cv.carimbo;

    $("choicesQ").textContent = C.escolhaPergunta;
    const grid = $("choiceGrid");
    for (const op of C.escolhas) {
      const b = document.createElement("button");
      b.className = "choice";
      const em = document.createElement("span");
      em.textContent = op.emoji;
      b.append(em, op.texto);
      b.addEventListener("click", () => pick(b, op));
      grid.appendChild(b);
    }
  }

  function pick(btn, op) {
    document.querySelectorAll(".choice").forEach((c) => c.classList.remove("picked"));
    btn.classList.add("picked");
    $("choiceGrid").classList.add("done");
    $("choiceReply").textContent = `${op.emoji} ${C.escolhaResposta}`;
    $("choiceReply").classList.add("show");

    const r = btn.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, 14);

    if (C.whatsapp) {
      const msg = C.whatsappMsg.replace("{escolha}", op.texto.toLowerCase());
      $("wa").href = `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(msg)}`;
      $("wa").classList.add("show");
    }
  }

  let said = false;
  $("yes").addEventListener("click", async () => {
    if (said) return;
    said = true;
    no.style.display = "none";
    if (navigator.vibrate) navigator.vibrate([80, 60, 120]);

    // 1. um coração gigante cobre a tela
    const wipe = $("heartWipe");
    const r = $("yes").getBoundingClientRect();
    wipe.style.left = r.left + r.width / 2 + "px";
    wipe.style.top = r.top + r.height / 2 + "px";
    wipe.classList.add("go");
    fillFinal();

    await sleep(reduceMotion ? 0 : 650);
    $("final").classList.add("show");
    $("letter").classList.remove("show");

    // 2. confete saindo dos cantos
    await sleep(reduceMotion ? 0 : 400);
    if (!reduceMotion) confetti();

    // 3. os blocos aparecem um por um
    const items = [...document.querySelectorAll(".final-card > *")];
    const step = reduceMotion ? 0 : 450;
    for (const el of items.slice(0, 3)) { el.classList.add("in"); await sleep(step); }

    // 4. o convite chega e leva o carimbo
    $("ticket").classList.add("in");
    await sleep(reduceMotion ? 0 : 1100);
    $("stamp").classList.add("hit");
    await sleep(reduceMotion ? 0 : 330);
    $("ticket").classList.add("shake");
    if (navigator.vibrate) navigator.vibrate(40);
    const t = $("stamp").getBoundingClientRect();
    burst(t.left + t.width / 2, t.top + t.height / 2, 18);

    // 5. ela escolhe o programa
    await sleep(reduceMotion ? 0 : 1000);
    $("choices").classList.add("in");
  });
})();
