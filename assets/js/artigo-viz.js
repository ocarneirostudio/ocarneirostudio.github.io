/* ==========================================================
   OCARNEIRO STUDIO — ilustrações interativas dos artigos
   Num artigo (.md), escreva por exemplo:
     <div class="viz" data-viz="proximidade"></div>
   Disponíveis: camadas, posicao, proximidade, enquadramento, frequencias
   ========================================================== */
(function () {
  const COR = { voz: "#d61350", efeitos: "#ff9d2e", musica: "#d1d0d7", texto: "#f1f2eb", linha: "#2a2930", fundo: "#121117", muted: "#85848d" };
  const NS = "http://www.w3.org/2000/svg";
  const menosMovimento = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const cartao = (el, eyebrow, titulo) => {
    el.classList.add("viz-card");
    el.innerHTML = `<div class="viz-topo"><span class="eyebrow">${eyebrow}</span><h4>${titulo}</h4></div><div class="viz-corpo"></div>`;
    return el.querySelector(".viz-corpo");
  };
  const polar = (cx, cy, r, ang) => [cx + r * Math.cos(ang), cy + r * Math.sin(ang)];
  const arco = (cx, cy, r1, r2, a1, a2) => {
    const [x1, y1] = polar(cx, cy, r2, a1), [x2, y2] = polar(cx, cy, r2, a2);
    const [x3, y3] = polar(cx, cy, r1, a2), [x4, y4] = polar(cx, cy, r1, a1);
    const g = a2 - a1 > Math.PI ? 1 : 0;
    return `M${x1},${y1} A${r2},${r2} 0 ${g} 1 ${x2},${y2} L${x3},${y3} A${r1},${r1} 0 ${g} 0 ${x4},${y4} Z`;
  };

  // nomes longos viram duas linhas
  const rotulo = (nome, x) => {
    const p = nome.split(" ");
    if (nome.length <= 9 || p.length < 2) return nome;
    const meio = Math.ceil(p.length / 2);
    return `<tspan x="${x}" dy="-0.6em">${p.slice(0, meio).join(" ")}</tspan><tspan x="${x}" dy="1.2em">${p.slice(meio).join(" ")}</tspan>`;
  };

  /* ---------------- 1. Camadas do som ---------------- */
  function camadas(el) {
    const corpo = cartao(el, "Mapa", "As camadas do som de um filme");
    const itens = [
      { g: "Voz", cor: COR.voz, nome: "Gravação de set", txt: "O som direto, captado durante as filmagens com boom e lapela." },
      { g: "Voz", cor: COR.voz, nome: "Edição de diálogo", txt: "Limpar, organizar e dar continuidade às falas." },
      { g: "Voz", cor: COR.voz, nome: "ADR", txt: "Regravar falas em estúdio, em sincronia com a imagem." },
      { g: "Efeitos", cor: COR.efeitos, nome: "SFX", txt: "Efeitos pontuais: captados, sintetizados ou de biblioteca." },
      { g: "Efeitos", cor: COR.efeitos, nome: "Foley", txt: "Sons do dia a dia recriados em estúdio: passos, roupas, objetos." },
      { g: "Efeitos", cor: COR.efeitos, nome: "Ambiência", txt: "A “cama” sonora que dá a sensação de lugar." },
      { g: "Música", cor: COR.musica, nome: "Trilha", txt: "A música do filme, composta ou de biblioteca." },
    ];
    const cx = 160, cy = 160, n = itens.length, gap = 0.025, ini = -Math.PI / 2;
    const segs = itens.map((it, i) => {
      const a1 = ini + (i / n) * Math.PI * 2 + gap, a2 = ini + ((i + 1) / n) * Math.PI * 2 - gap;
      const [tx, ty] = polar(cx, cy, 128, (a1 + a2) / 2);
      return `<g class="seg" data-i="${i}" tabindex="0" role="button" aria-label="${it.nome}">
        <path d="${arco(cx, cy, 100, 156, a1, a2)}" fill="${it.cor}" fill-opacity=".18" stroke="${it.cor}" stroke-width="1.5"/>
        <text x="${tx}" y="${ty}" text-anchor="middle" dominant-baseline="middle" fill="${COR.texto}" font-size="10.5" font-weight="700">${rotulo(it.nome, tx)}</text></g>`;
    }).join("");
    const barras = Array.from({ length: 36 }, (_, i) => {
      const a = (i / 36) * Math.PI * 2;
      const [x, y] = polar(cx, cy, 58, a);
      return `<line class="barra" x1="${x}" y1="${y}" x2="${x}" y2="${y}" data-a="${a}" stroke-linecap="round" stroke-width="3"/>`;
    }).join("");
    corpo.innerHTML = `<div class="viz-duas">
      <svg viewBox="-6 -6 332 332" class="viz-svg" role="img" aria-label="Mapa das camadas do som">
        ${segs}
        <circle cx="${cx}" cy="${cy}" r="92" fill="${COR.fundo}"/>
        <g class="barras">${barras}</g>
        <text class="centro" x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="middle" fill="${COR.texto}" font-size="15" font-weight="800">SOM</text>
      </svg>
      <div class="viz-info"><span class="viz-tag">Passe o mouse ou toque</span><h5>Cada camada tem um papel</h5><p>Voz, efeitos e música são produzidos separadamente e só se encontram na mixagem final.</p></div>
    </div>`;
    const info = corpo.querySelector(".viz-info"), centro = corpo.querySelector(".centro");
    let cor = COR.efeitos;
    const ativar = (i) => {
      const it = itens[i]; cor = it.cor;
      corpo.querySelectorAll(".seg").forEach((s) => s.classList.toggle("ativo", +s.dataset.i === i));
      info.innerHTML = `<span class="viz-tag" style="color:${it.cor}">${it.g}</span><h5>${it.nome}</h5><p>${it.txt}</p>`;
      centro.textContent = it.g.toUpperCase();
    };
    corpo.querySelectorAll(".seg").forEach((s) => {
      s.addEventListener("mouseenter", () => ativar(+s.dataset.i));
      s.addEventListener("click", () => ativar(+s.dataset.i));
      s.addEventListener("focus", () => ativar(+s.dataset.i));
    });
    // barras do centro "respiram" como um medidor
    const linhas = [...corpo.querySelectorAll(".barra")];
    let t = 0;
    const animar = () => {
      t += 0.04;
      linhas.forEach((l, i) => {
        const a = +l.dataset.a;
        const v = 6 + 16 * Math.abs(Math.sin(t * 1.7 + i * 0.6) * Math.cos(t * 0.9 + i * 0.23));
        const [x1, y1] = polar(cx, cy, 58, a), [x2, y2] = polar(cx, cy, 58 + v, a);
        l.setAttribute("x1", x1); l.setAttribute("y1", y1); l.setAttribute("x2", x2); l.setAttribute("y2", y2);
        l.setAttribute("stroke", cor);
      });
      if (!menosMovimento) requestAnimationFrame(animar);
    };
    animar();
  }

  /* ---------------- desenhos reutilizados ---------------- */
  const cabecaPerfil = (x, y, s = 1) => `
    <g transform="translate(${x},${y}) scale(${s})" fill="${COR.texto}" fill-opacity=".9">
      <path d="M-46,-4 C-50,-58 -6,-80 30,-62 C52,-50 58,-28 54,-12 L66,8 L54,12 L56,24 C56,34 50,40 40,40 L30,40 L28,62 L-24,62 C-28,48 -44,30 -46,-4 Z"/>
      <path d="M-40,62 C-70,70 -96,90 -104,140 L80,140 C74,96 56,74 26,62 Z"/>
    </g>`;
  const microfone = () => `
    <g class="mic">
      <rect x="-11" y="-30" width="22" height="34" rx="11" fill="#d1d0d7"/>
      <line x1="-11" y1="-18" x2="11" y2="-18" stroke="#85848d" stroke-width="1.5"/>
      <line x1="-11" y1="-10" x2="11" y2="-10" stroke="#85848d" stroke-width="1.5"/>
      <rect x="-5" y="4" width="10" height="46" rx="4" fill="#85848d"/>
    </g>`;

  /* ---------------- 2. Posição do microfone ---------------- */
  function posicao(el) {
    const corpo = cartao(el, "Experimente", "Onde fica o microfone muda a voz");
    const pos = {
      abaixo: { rot: "Abaixo da boca", x: 214, y: 214, r: 0, v: [92, 55, 40, 30], txt: "Captações abaixo da boca deixam a voz mais grave, por causa da ressonância da caixa torácica." },
      frente: { rot: "Na frente", x: 262, y: 160, r: -90, v: [70, 70, 70, 88], txt: "Apontado direto para a boca, a voz fica cheia, mas aparecem mais sibilância (S) e plosivas (P, B)." },
      acima: { rot: "Acima (nariz)", x: 230, y: 116, r: 180, v: [38, 82, 74, 55], txt: "Captações acima da boca trazem mais nasal e mais frequências médias e agudas. Evite com ator gripado." },
      fora: { rot: "Fora do eixo", x: 258, y: 112, r: -135, v: [62, 66, 58, 38], txt: "Inclinado em uns 45°, o microfone pega menos sibilância e menos estouro de ar. A voz fica mais suave." },
    };
    const nomes = ["Grave", "Nasal / médio", "Agudo", "Sibilância"];
    corpo.innerHTML = `<div class="viz-duas">
      <svg viewBox="0 0 340 300" class="viz-svg" role="img" aria-label="Pessoa de perfil e um microfone">
        <rect x="0" y="0" width="340" height="300" rx="14" fill="${COR.fundo}"/>
        ${cabecaPerfil(150, 150)}
        <circle class="boca" cx="203" cy="166" r="4" fill="${COR.efeitos}"/>
        <g class="mic-pos" style="transition: transform .6s cubic-bezier(.2,.7,.2,1)">${microfone()}</g>
      </svg>
      <div class="viz-info">
        <div class="viz-botoes">${Object.entries(pos).map(([k, p]) => `<button data-k="${k}">${p.rot}</button>`).join("")}</div>
        <p class="viz-texto"></p>
        <div class="medidores">${nomes.map((n) => `<div class="medidor"><span>${n}</span><i><b></b></i></div>`).join("")}</div>
      </div>
    </div>`;
    const mic = corpo.querySelector(".mic-pos"), texto = corpo.querySelector(".viz-texto");
    const barras = [...corpo.querySelectorAll(".medidor b")];
    const escolher = (k) => {
      const p = pos[k];
      mic.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.r}deg)`;
      texto.textContent = p.txt;
      barras.forEach((b, i) => (b.style.width = p.v[i] + "%"));
      corpo.querySelectorAll(".viz-botoes button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.k === k));
    };
    corpo.querySelectorAll(".viz-botoes button").forEach((b) => b.addEventListener("click", () => escolher(b.dataset.k)));
    escolher("abaixo");
  }

  /* ---------------- 3. Efeito de proximidade ---------------- */
  function proximidade(el) {
    const corpo = cartao(el, "Arraste", "Efeito de proximidade");
    const W = 560, H = 230, gx0 = 44, gx1 = W - 16, gy0 = 18, gy1 = H - 34;
    const fx = (f) => gx0 + (Math.log10(f / 20) / Math.log10(1000)) * (gx1 - gx0);
    const dbMax = 18, dbMin = -6;
    const fy = (db) => gy0 + ((dbMax - db) / (dbMax - dbMin)) * (gy1 - gy0);
    const grade = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000].map((f) =>
      `<line x1="${fx(f)}" y1="${gy0}" x2="${fx(f)}" y2="${gy1}" stroke="${COR.linha}"/><text x="${fx(f)}" y="${gy1 + 16}" fill="${COR.muted}" font-size="10" text-anchor="middle">${f >= 1000 ? f / 1000 + "k" : f}</text>`).join("")
      + [-6, 0, 6, 12, 18].map((d) => `<line x1="${gx0}" y1="${fy(d)}" x2="${gx1}" y2="${fy(d)}" stroke="${COR.linha}"/><text x="${gx0 - 8}" y="${fy(d) + 3}" fill="${COR.muted}" font-size="10" text-anchor="end">${d > 0 ? "+" + d : d}</text>`).join("");
    corpo.innerHTML = `
      <svg viewBox="0 0 560 170" class="viz-svg palco" role="img" aria-label="Pessoa e microfone a uma distância ajustável">
        <rect width="560" height="170" rx="14" fill="${COR.fundo}"/>
        ${cabecaPerfil(90, 82, .78)}
        <g class="mic-prox">${microfone()}</g>
        <text class="dist" x="540" y="28" text-anchor="end" fill="${COR.efeitos}" font-size="20" font-weight="800"></text>
      </svg>
      <input type="range" class="viz-range" min="2" max="60" value="30" aria-label="Distância do microfone em centímetros">
      <svg viewBox="0 0 ${W} ${H}" class="viz-svg" role="img" aria-label="Resposta de frequência">
        ${grade}
        <path class="area" fill="${COR.efeitos}" fill-opacity=".12"/>
        <path class="curva" fill="none" stroke="${COR.efeitos}" stroke-width="3" stroke-linecap="round"/>
        <text x="${gx1}" y="${H - 4}" fill="${COR.muted}" font-size="10" text-anchor="end">frequência (Hz)</text>
      </svg>
      <div class="viz-rodape"><p class="viz-texto"></p><button class="btn secundario viz-ouvir" type="button">▶ Ouvir a diferença</button></div>`;
    const range = corpo.querySelector(".viz-range"), curva = corpo.querySelector(".curva"), area = corpo.querySelector(".area");
    const mic = corpo.querySelector(".mic-prox"), dist = corpo.querySelector(".dist"), texto = corpo.querySelector(".viz-texto");
    const reforco = (d) => 15 * Math.pow(1 - (d - 2) / 58, 2.2);
    let filtro = null;
    const atualizar = () => {
      const d = +range.value, B = reforco(d);
      const pts = [];
      for (let i = 0; i <= 120; i++) {
        const f = 20 * Math.pow(1000, i / 120);
        const db = B / Math.sqrt(1 + Math.pow(f / 180, 2.4)) - 1.2 * Math.pow(f / 18000, 2);
        pts.push(`${fx(f).toFixed(1)},${fy(db).toFixed(1)}`);
      }
      curva.setAttribute("d", "M" + pts.join(" L"));
      area.setAttribute("d", `M${fx(20)},${fy(0)} L${pts.join(" L")} L${fx(20000)},${fy(0)} Z`);
      mic.setAttribute("transform", `translate(${168 + (d - 2) * 6.2}, 100) rotate(-90)`);
      dist.textContent = `${d} cm`;
      texto.innerHTML = B > 9 ? `<b>+${B.toFixed(0)} dB nos graves.</b> Bem perto, a voz fica encorpada, “de rádio”, mas pode embolar.`
        : B > 3 ? `<b>+${B.toFixed(0)} dB nos graves.</b> Distância de estúdio: presença com equilíbrio.`
        : `<b>Resposta quase plana.</b> Longe, a voz perde corpo e o ambiente aparece mais.`;
      if (filtro) filtro.gain.setTargetAtTime(B, filtro.context.currentTime, 0.05);
    };
    range.addEventListener("input", atualizar);
    atualizar();

    // som de demonstração: um "zumbido de voz" sintético passando por um filtro de graves
    const botao = corpo.querySelector(".viz-ouvir");
    let ctx = null, ganho = null;
    botao.addEventListener("click", () => {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        ctx = new AC();
        const osc = ctx.createOscillator(); osc.type = "sawtooth"; osc.frequency.value = 110;
        const vib = ctx.createOscillator(); vib.frequency.value = 5; const vibG = ctx.createGain(); vibG.gain.value = 2;
        vib.connect(vibG).connect(osc.frequency);
        const formante = ctx.createBiquadFilter(); formante.type = "bandpass"; formante.frequency.value = 700; formante.Q.value = 0.8;
        const formante2 = ctx.createBiquadFilter(); formante2.type = "peaking"; formante2.frequency.value = 1200; formante2.gain.value = 6;
        filtro = ctx.createBiquadFilter(); filtro.type = "lowshelf"; filtro.frequency.value = 220; filtro.gain.value = reforco(+range.value);
        ganho = ctx.createGain(); ganho.gain.value = 0;
        osc.connect(formante2).connect(filtro); osc.connect(formante).connect(filtro);
        filtro.connect(ganho).connect(ctx.destination);
        osc.start(); vib.start();
      }
      const tocando = ganho.gain.value > 0.001 && botao.classList.contains("tocando");
      ganho.gain.setTargetAtTime(tocando ? 0 : 0.07, ctx.currentTime, 0.05);
      if (ctx.state === "suspended") ctx.resume();
      botao.classList.toggle("tocando", !tocando);
      botao.textContent = tocando ? "▶ Ouvir a diferença" : "■ Parar som";
    });
  }

  /* ---------------- 4. Ambiência por enquadramento ---------------- */
  function enquadramento(el) {
    const corpo = cartao(el, "Escolha um plano", "Ambiência e enquadramento");
    const planos = {
      geral: { nome: "Plano geral", apelido: "“Socorro na multidão”", amb: 90, voz: 45, dist: "Microfone distante",
        itens: ["Maior ambiência (M&E)", "Distanciamento do microfone", "Importa a projeção da voz, se for a intenção"] },
      americano: { nome: "Plano americano", apelido: "“Um diálogo”", amb: 55, voz: 75, dist: "Distância média",
        itens: ["Média ambiência", "A voz tem mais destaque e volume", "Gravações diferentes devem manter volume e distância parecidos"] },
      detalhe: { nome: "Plano detalhe", apelido: "“Um segredo”", amb: 15, voz: 95, dist: "Microfone próximo",
        itens: ["Baixa ambiência", "A voz em destaque", "Proximidade do microfone", "Controle da projeção da voz"] },
    };
    const pessoa = (x, y, s, op = 1) => `<g transform="translate(${x},${y}) scale(${s})" opacity="${op}" fill="${COR.texto}"><circle cx="0" cy="-34" r="16"/><path d="M-26,40 C-26,4 -14,-14 0,-14 C14,-14 26,4 26,40 Z"/></g>`;
    const cena = {
      geral: () => Array.from({ length: 22 }, (_, i) => pessoa(30 + (i % 11) * 28 + (i > 10 ? 14 : 0), i > 10 ? 150 : 120, 0.42, 0.35)).join("") + pessoa(170, 132, 0.55, 1),
      americano: () => pessoa(120, 140, 1.5, 1) + pessoa(232, 150, 1.3, 0.5),
      detalhe: () => `<g transform="translate(170,120)" fill="${COR.texto}"><circle cx="0" cy="0" r="78"/><rect x="-20" y="22" width="40" height="8" rx="4" fill="${COR.fundo}"/></g>`,
    };
    corpo.innerHTML = `<div class="viz-botoes abas">${Object.entries(planos).map(([k, p]) => `<button data-k="${k}">${p.nome}</button>`).join("")}</div>
      <div class="viz-duas">
        <svg viewBox="0 0 340 220" class="viz-svg" role="img" aria-label="Quadro do plano"><rect width="340" height="220" rx="14" fill="${COR.fundo}"/><g class="cena"></g>
          <path d="M14,34 V14 H34 M306,14 H326 V34 M326,186 V206 H306 M34,206 H14 V186" stroke="${COR.efeitos}" stroke-width="2.5" fill="none"/></svg>
        <div class="viz-info">
          <span class="viz-tag apelido"></span><h5 class="nome"></h5>
          <div class="medidores">
            <div class="medidor"><span>Ambiência</span><i><b class="m-amb"></b></i></div>
            <div class="medidor"><span>Destaque da voz</span><i><b class="m-voz"></b></i></div>
          </div>
          <ul class="lista"></ul>
        </div>
      </div>`;
    const g = corpo.querySelector(".cena");
    const escolher = (k) => {
      const p = planos[k];
      g.innerHTML = cena[k]();
      g.animate && !menosMovimento && g.animate([{ opacity: 0, transform: "scale(.96)" }, { opacity: 1, transform: "none" }], { duration: 400, easing: "ease-out" });
      corpo.querySelector(".apelido").textContent = p.apelido;
      corpo.querySelector(".nome").textContent = `${p.nome} · ${p.dist}`;
      corpo.querySelector(".m-amb").style.width = p.amb + "%";
      corpo.querySelector(".m-voz").style.width = p.voz + "%";
      corpo.querySelector(".lista").innerHTML = p.itens.map((i) => `<li>${i}</li>`).join("");
      corpo.querySelectorAll(".abas button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.k === k));
    };
    corpo.querySelectorAll(".abas button").forEach((b) => b.addEventListener("click", () => escolher(b.dataset.k)));
    escolher("americano");
  }

  /* ---------------- 5. Frequências da voz ---------------- */
  function frequencias(el) {
    const corpo = cartao(el, "Passe o mouse", "O que cada frequência faz na voz");
    const faixas = [
      { de: 20, ate: 80, nome: "Sub", cor: "#3a3942", txt: "Quase nada útil na voz. Um filtro passa-alta (high-pass) limpa vento, trânsito e ruído de manuseio." },
      { de: 80, ate: 250, nome: "Corpo", cor: COR.voz, txt: "Peso e calor da voz. Em excesso, embola, principalmente com o microfone muito perto." },
      { de: 250, ate: 800, nome: "Abafado", cor: "#d66213", txt: "Excesso aqui soa como voz “dentro de uma caixa”. Um corte leve costuma limpar." },
      { de: 800, ate: 5000, nome: "Presença", cor: COR.efeitos, txt: "Onde a voz é entendida: inteligibilidade e presença. Perto de 1 kHz mora a nasalidade." },
      { de: 5000, ate: 10000, nome: "Sibilância", cor: "#d89b12", txt: "S, T e P: brilho e definição das consoantes. Em excesso chia, e o de-esser controla." },
      { de: 10000, ate: 20000, nome: "Ar", cor: COR.musica, txt: "Sensação de ar e abertura. Um realce sutil dá acabamento à voz." },
    ];
    const W = 600, x = (f) => 10 + (Math.log10(f / 20) / 3) * (W - 20);
    corpo.innerHTML = `
      <svg viewBox="0 0 ${W} 150" class="viz-svg" role="img" aria-label="Faixas de frequência da voz">
        <g class="eq"></g>
        ${faixas.map((f, i) => `<g class="faixa" data-i="${i}" tabindex="0" role="button" aria-label="${f.nome}">
          <rect x="${x(f.de) + 1}" y="96" width="${x(f.ate) - x(f.de) - 2}" height="26" rx="6" fill="${f.cor}" fill-opacity=".85"/>
          <text x="${(x(f.de) + x(f.ate)) / 2}" y="113" text-anchor="middle" fill="${i === 0 ? COR.texto : "#000"}" font-size="11" font-weight="800">${f.nome}</text></g>`).join("")}
        ${[20, 100, 250, 1000, 5000, 10000, 20000].map((f) => `<text x="${x(f)}" y="142" text-anchor="middle" fill="${COR.muted}" font-size="10">${f >= 1000 ? f / 1000 + "k" : f}</text>`).join("")}
      </svg>
      <div class="viz-info linha"><span class="viz-tag"></span><p></p></div>`;
    const eq = corpo.querySelector(".eq");
    const N = 60;
    eq.innerHTML = Array.from({ length: N }, (_, i) => `<rect x="${10 + i * ((W - 20) / N) + 1}" width="${(W - 20) / N - 3}" rx="2" fill="${COR.linha}"/>`).join("");
    const rects = [...eq.children];
    let ativa = 3;
    const info = corpo.querySelector(".viz-info");
    const ativar = (i) => {
      ativa = i; const f = faixas[i];
      info.querySelector(".viz-tag").textContent = `${f.nome} · ${f.de >= 1000 ? f.de / 1000 + "k" : f.de}–${f.ate >= 1000 ? f.ate / 1000 + "k" : f.ate} Hz`;
      info.querySelector(".viz-tag").style.color = f.cor;
      info.querySelector("p").textContent = f.txt;
      corpo.querySelectorAll(".faixa").forEach((g) => g.classList.toggle("ativo", +g.dataset.i === i));
    };
    corpo.querySelectorAll(".faixa").forEach((g) => {
      g.addEventListener("mouseenter", () => ativar(+g.dataset.i));
      g.addEventListener("click", () => ativar(+g.dataset.i));
      g.addEventListener("focus", () => ativar(+g.dataset.i));
    });
    ativar(3);
    // espectro animado: a faixa escolhida fica acesa
    let t = 0;
    const animar = () => {
      t += 0.05;
      rects.forEach((r, i) => {
        const f = 20 * Math.pow(1000, (i + 0.5) / N);
        const voz = Math.exp(-Math.pow(Math.log10(f / 600), 2) / 0.35);
        const h = 10 + 70 * voz * (0.6 + 0.4 * Math.abs(Math.sin(t + i * 0.45)));
        r.setAttribute("y", 90 - h); r.setAttribute("height", h);
        const fx = faixas[ativa];
        r.setAttribute("fill", f >= fx.de && f < fx.ate ? fx.cor : COR.linha);
      });
      if (!menosMovimento) requestAnimationFrame(animar);
    };
    animar();
  }

  const MAPA = { camadas, posicao, proximidade, enquadramento, frequencias };
  window.montarViz = function (raiz = document) {
    raiz.querySelectorAll(".viz[data-viz]").forEach((el) => {
      const f = MAPA[el.dataset.viz];
      if (f && !el.dataset.montado) { el.dataset.montado = "1"; f(el); }
    });
  };
})();
