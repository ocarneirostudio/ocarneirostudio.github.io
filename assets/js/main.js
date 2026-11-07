/* ==========================================================
   OCARNEIRO STUDIO — scripts do site
   O conteúdo vem dos arquivos em /conteudo (JSON e Markdown).
   ========================================================== */

const CATEGORIAS = {
  design: "Design",
  ilustracao: "Ilustração",
  motion: "Motion & Animação",
  cinema: "Cinema",
  som: "Sound Design",
};

const MENU = [
  { href: "index.html#trabalhos", texto: "Trabalhos", pagina: "inicio" },
  { href: "audiovisual.html", texto: "Audiovisual", pagina: "audiovisual" },
  { href: "artigos.html", texto: "Artigos", pagina: "artigos" },
  { href: "index.html#sobre", texto: "Sobre", pagina: "sobre" },
];

const pagina = document.body.dataset.pagina || "";
let SITE = {};

/* ---------- utilidades ---------- */
const $ = (sel, el = document) => el.querySelector(sel);
const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
async function carregar(url) {
  const r = await fetch(url, { cache: "no-cache" });
  if (!r.ok) throw new Error(url + " (" + r.status + ")");
  return url.endsWith(".json") ? r.json() : r.text();
}
function formatarData(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).replace(".", "");
}
function formatarTempo(s) {
  if (!isFinite(s)) return "0:00";
  return Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0");
}

/* ---------- links de contato a partir do site.json ---------- */
function linksContato() {
  const l = [];
  if (SITE.email) l.push({ rotulo: "E-mail", valor: SITE.email, href: "mailto:" + SITE.email });
  if (SITE.instagram) l.push({ rotulo: "Instagram", valor: "@" + SITE.instagram.replace(/^@/, ""), href: "https://instagram.com/" + SITE.instagram.replace(/^@/, "") });
  if (SITE.whatsapp) {
    const n = SITE.whatsapp.replace(/\D/g, "");
    const bonito = n.length === 13 ? `(${n.slice(2, 4)}) ${n.slice(4, 9)}-${n.slice(9)}` : SITE.whatsapp;
    l.push({ rotulo: "WhatsApp", valor: bonito, href: "https://wa.me/" + n });
  }
  if (SITE.youtube) l.push({ rotulo: "YouTube", valor: "Canal no YouTube", href: SITE.youtube });
  if (SITE.spotify) l.push({ rotulo: "Spotify", valor: "Ouvir no Spotify", href: SITE.spotify });
  if (SITE.behance) l.push({ rotulo: "Behance", valor: "Behance", href: SITE.behance });
  if (SITE.linkedin) l.push({ rotulo: "LinkedIn", valor: "André Ferreira Carneiro", href: SITE.linkedin });
  if (SITE.lattes) l.push({ rotulo: "Lattes", valor: "Currículo Lattes", href: SITE.lattes });
  return l;
}

/* ---------- cabeçalho e rodapé ---------- */
function montarTopo() {
  const el = $("#topo");
  if (!el) return;
  el.outerHTML = `
  <header class="topo" id="cabecalho">
    <div class="container">
      <a class="marca" href="index.html" aria-label="Ocarneiro Studio — início">
        <img src="assets/img/logo-mark.svg" alt="" width="44" height="31">
        <span class="nome"><b>OCARNEIRO</b><small>AUDIOVISUAL E CRIATIVIDADE</small></span>
      </a>
      <button class="botao-menu" aria-label="Abrir menu" aria-expanded="false"><span></span><span></span></button>
      <nav class="menu" aria-label="Principal">
        ${MENU.map((m) => `<a href="${m.href}" class="${m.pagina === pagina ? "ativo" : ""}">${m.texto}</a>`).join("")}
        <a class="contato-topo ${pagina === "contato" ? "ativo" : ""}" href="contato.html">Contato</a>
      </nav>
    </div>
  </header>`;

  const cab = $("#cabecalho");
  const botao = $(".botao-menu", cab);
  botao.addEventListener("click", () => {
    const aberto = document.body.classList.toggle("menu-aberto");
    botao.setAttribute("aria-expanded", aberto);
  });
  cab.querySelectorAll(".menu a").forEach((a) => a.addEventListener("click", () => document.body.classList.remove("menu-aberto")));
  const aoRolar = () => cab.classList.toggle("rolou", window.scrollY > 20);
  aoRolar();
  window.addEventListener("scroll", aoRolar, { passive: true });
}

function montarRodape() {
  const el = $("#rodape");
  if (!el) return;
  const ano = new Date().getFullYear();
  const redes = linksContato().filter((l) => !["E-mail", "WhatsApp"].includes(l.rotulo));
  const email = linksContato().find((l) => l.rotulo === "E-mail");
  const whats = linksContato().find((l) => l.rotulo === "WhatsApp");
  el.outerHTML = `
  <footer class="rodape">
    <div class="container">
      <div class="rodape-colunas">
        <div>
          <h4>Contato</h4>
          ${email ? `<a href="${email.href}">${esc(email.valor)}</a>` : ""}
          ${whats ? `<a href="${whats.href}" target="_blank" rel="noopener">${esc(whats.valor)}</a>` : ""}
          <span>${esc(SITE.cidade || "")} · <span class="relogio" style="display:inline;padding:0">--:--</span></span>
        </div>
        <div>
          <h4>Páginas</h4>
          ${MENU.map((m) => `<a href="${m.href}">${m.texto}</a>`).join("")}
          <a href="contato.html">Contato</a>
        </div>
        <div>
          <h4>Redes</h4>
          ${redes.slice(0, 4).map((l) => `<a href="${l.href}" target="_blank" rel="noopener">${l.rotulo}</a>`).join("")}
        </div>
        <div>
          <h4>Mais</h4>
          ${redes.slice(4).map((l) => `<a href="${l.href}" target="_blank" rel="noopener">${l.rotulo}</a>`).join("")}
        </div>
      </div>
      <div class="rodape-gigante" aria-hidden="true">OCARNEIRO</div>
      <div class="copy">
        <span>© ${ano} Ocarneiro Studio</span>
        <span>Audiovisual e criatividade</span>
      </div>
    </div>
  </footer>`;
}

/* ---------- relógio local (Minas Gerais) ---------- */
function relogio() {
  const atualizar = () => {
    const h = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });
    document.querySelectorAll(".relogio").forEach((r) => (r.textContent = h + " (BRT)"));
  };
  atualizar();
  setInterval(atualizar, 15000);
}

/* ---------- capas do YouTube: se não houver versão HD, usa a padrão ---------- */
function corrigirCapasYoutube(raiz = document) {
  raiz.querySelectorAll('img[src*="maxresdefault"]').forEach((img) => {
    const trocar = () => { img.src = img.src.replace("maxresdefault", "hqdefault"); };
    img.addEventListener("error", trocar, { once: true });
    img.addEventListener("load", () => { if (img.naturalWidth <= 120) trocar(); }, { once: true });
  });
}

/* ---------- revelar ao rolar ---------- */
const observador = "IntersectionObserver" in window
  ? new IntersectionObserver((itens) => itens.forEach((i) => { if (i.isIntersecting) { i.target.classList.add("visivel"); observador.unobserve(i.target); } }), { rootMargin: "0px 0px -8% 0px" })
  : null;
function revelar(raiz = document) {
  raiz.querySelectorAll(".revelar:not(.visivel)").forEach((el) => (observador ? observador.observe(el) : el.classList.add("visivel")));
}

/* ---------- vídeo no hover dos cards ---------- */
function ativarVideosHover(raiz) {
  raiz.querySelectorAll(".projeto").forEach((card) => {
    const v = $("video", card);
    if (!v) return;
    card.addEventListener("mouseenter", () => {
      if (!v.src) v.src = v.dataset.src;
      v.play().then(() => v.classList.add("pronto")).catch(() => {});
    });
    card.addEventListener("mouseleave", () => { v.pause(); v.classList.remove("pronto"); });
  });
}

/* ==========================================================
   INÍCIO — grade de trabalhos com filtros
   ========================================================== */
async function paginaInicio() {
  const grade = $("#grade-trabalhos");
  if (!grade) return;
  let trabalhos = [];
  try { trabalhos = await carregar("conteudo/trabalhos.json"); }
  catch (e) { grade.innerHTML = `<p class="vazio">Não foi possível carregar os trabalhos.</p>`; return; }

  // cada trabalho vira uma linha com até 3 imagens (capa + galeria)
  const imagensDe = (t) => {
    const lista = [t.capa];
    (t.galeria || []).forEach((g) => {
      if (g.src) lista.push(g.src);
      else if (g.youtube) lista.push(`https://i.ytimg.com/vi/${idYoutube(g.youtube)}/hqdefault.jpg`);
    });
    return [...new Set(lista)].filter(Boolean).slice(0, 3);
  };
  grade.innerHTML = trabalhos.map((t, i) => {
    const imgs = imagensDe(t);
    const classe = imgs.length === 1 ? "uma" : imgs.length === 2 ? "duas" : "";
    const cats = (t.categorias || []).map((c) => CATEGORIAS[c] || c).join(", ");
    return `
    <a class="projeto revelar" href="trabalho.html?id=${encodeURIComponent(t.id)}" data-categorias="${esc((t.categorias || []).join(" "))}">
      <div class="tira ${classe}">
        ${imgs.map((src, k) => `<div class="quadro"><img src="${esc(src)}" alt="${k === 0 ? esc(t.titulo) : ""}" loading="${i < 2 ? "eager" : "lazy"}">
          ${k === 0 && t.video ? `<video data-src="${esc(t.video)}" muted loop playsinline preload="none"></video>` : ""}</div>`).join("")}
      </div>
      <div class="info">
        <h3>${esc(t.titulo)}</h3>
        <span class="meta">${esc(cats)}${t.ano ? ` · ${esc(t.ano)}` : ""}</span>
        <span class="ver">Ver projeto →</span>
      </div>
    </a>`;
  }).join("");

  // filtros: só mostra categorias que têm trabalhos
  const usadas = new Set(trabalhos.flatMap((t) => t.categorias || []));
  const filtros = $("#filtros");
  const conta = (k) => trabalhos.filter((t) => (t.categorias || []).includes(k)).length;
  filtros.innerHTML = `<button aria-pressed="true" data-cat="">Todos<sup>${trabalhos.length}</sup></button>` +
    Object.entries(CATEGORIAS).filter(([k]) => usadas.has(k)).map(([k, v]) => `<button aria-pressed="false" data-cat="${k}">${v}<sup>${conta(k)}</sup></button>`).join("");
  filtros.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    filtros.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b));
    const cat = b.dataset.cat;
    grade.classList.toggle("filtrado", !!cat);
    const vt = grade.nextElementSibling;
    if (vt && vt.classList.contains("ver-todos")) vt.hidden = !!cat;
    grade.querySelectorAll(".projeto").forEach((c) => {
      const ok = !cat || c.dataset.categorias.split(" ").includes(cat);
      c.classList.toggle("escondido", !ok);
      if (ok) c.classList.add("visivel");
    });
  });

  // mostra só os primeiros na página inicial; o resto aparece no botão "Ver todos"
  const LIMITE = 8;
  const cards = [...grade.querySelectorAll(".projeto")];
  if (cards.length > LIMITE) {
    cards.slice(LIMITE).forEach((c) => c.classList.add("extra"));
    grade.classList.add("recolhida");
    grade.insertAdjacentHTML("afterend", `<div class="ver-todos"><button class="btn secundario">Ver todos os ${cards.length} trabalhos</button></div>`);
    const botaoTodos = grade.nextElementSibling.querySelector("button");
    botaoTodos.addEventListener("click", () => {
      grade.classList.remove("recolhida");
      botaoTodos.parentElement.remove();
      revelar(grade);
    });
  }

  ativarVideosHover(grade);
  corrigirCapasYoutube(grade);
  revelar(grade);
}

/* ==========================================================
   TRABALHO — página de um projeto
   ========================================================== */
async function paginaTrabalho() {
  const alvo = $("#trabalho");
  if (!alvo) return;
  const id = new URLSearchParams(location.search).get("id");
  let trabalhos = [];
  try { trabalhos = await carregar("conteudo/trabalhos.json"); } catch (e) {}
  const idx = trabalhos.findIndex((t) => t.id === id);
  const t = trabalhos[idx];
  if (!t) {
    alvo.innerHTML = `<section class="trabalho-topo container"><a class="voltar" href="index.html#trabalhos">← Todos os trabalhos</a><h1>Trabalho não encontrado</h1></section>`;
    return;
  }
  document.title = `${t.titulo} — Ocarneiro Studio`;
  const prox = trabalhos[(idx + 1) % trabalhos.length];
  const cats = (t.categorias || []).map((c) => CATEGORIAS[c] || c).join(", ");

  alvo.innerHTML = `
    <section class="trabalho-topo container">
      <a class="voltar" href="index.html#trabalhos">← Todos os trabalhos</a>
      <h1>${esc(t.titulo)}</h1>
      ${(t.descricao || []).map((p) => `<p class="lead">${esc(p)}</p>`).join("")}
      ${t.link ? `<p style="margin-top:1.4rem"><a class="btn" href="${esc(t.link.href)}">${esc(t.link.texto)} →</a></p>` : ""}
      <dl class="ficha">
        ${t.papel ? `<div><dt>Papel</dt><dd>${esc(t.papel)}</dd></div>` : ""}
        ${cats ? `<div><dt>Área</dt><dd>${esc(cats)}</dd></div>` : ""}
        ${t.cliente ? `<div><dt>Cliente</dt><dd>${esc(t.cliente)}</dd></div>` : ""}
        ${t.ano ? `<div><dt>Ano</dt><dd>${esc(t.ano)}</dd></div>` : ""}
      </dl>
    </section>
    <section class="container">
      <div class="galeria">
        ${(t.galeria || []).map((g) => `
          <figure class="${g.meia ? "meia" : ""} revelar">
            ${g.video
              ? `<video src="${esc(g.video)}" autoplay muted loop playsinline preload="metadata"></video>`
              : (g.youtube || g.embed)
                ? iframeVideo(g.youtube ? "https://www.youtube-nocookie.com/embed/" + idYoutube(g.youtube) : g.embed, g.legenda || t.titulo)
                : `<img src="${esc(g.src)}" alt="${esc(g.legenda || t.titulo)}" loading="lazy">`}
            ${g.legenda ? `<figcaption>${esc(g.legenda)}</figcaption>` : ""}
          </figure>`).join("")}
      </div>
    </section>
    ${prox && prox !== t ? `<a class="proximo" href="trabalho.html?id=${encodeURIComponent(prox.id)}"><div class="container"><small>Próximo trabalho</small><strong>${esc(prox.titulo)} →</strong></div></a>` : ""}`;
  revelar(alvo);
}

/* ==========================================================
   AUDIOVISUAL — vídeos (YouTube ou arquivo) e sons
   ========================================================== */
function iframeVideo(src, titulo) {
  return `<div class="iframe-16x9"><iframe src="${esc(src)}" title="${esc(titulo)}" loading="lazy" allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`;
}

function idYoutube(v = "") {
  const m = String(v).match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? m[1] : v;
}

async function paginaAudiovisual() {
  const canal = $("#canal");
  if (canal) {
    const links = [];
    if (SITE.youtube) links.push(`<a class="btn" href="${esc(SITE.youtube)}" target="_blank" rel="noopener">YouTube ↗</a>`);
    if (SITE.spotify) links.push(`<a class="btn secundario" href="${esc(SITE.spotify)}" target="_blank" rel="noopener">Spotify ↗</a>`);
    if (SITE.instagram) links.push(`<a class="btn secundario" href="https://instagram.com/${esc(SITE.instagram)}" target="_blank" rel="noopener">Instagram ↗</a>`);
    canal.innerHTML = links.join("");
  }

  const blocos = document.querySelectorAll("[data-videos]");
  if (blocos.length) {
    let videos = [];
    try { videos = await carregar("conteudo/videos.json"); } catch (e) {}
    const cartao = (v) => {
      const yt = v.youtube ? idYoutube(v.youtube) : "";
      const vertical = v.formato === "vertical";
      const capa = vertical ? `https://i.ytimg.com/vi/${esc(yt)}/oardefault.jpg` : `https://i.ytimg.com/vi/${esc(yt)}/hqdefault.jpg`;
      const tela = yt
        ? `<button class="capa-yt" data-yt="${esc(yt)}" aria-label="Assistir ${esc(v.titulo)}"><img src="${capa}" alt="" loading="lazy" onerror="this.onerror=null;this.src='https://i.ytimg.com/vi/${esc(yt)}/hqdefault.jpg'"></button>`
        : v.embed
          ? `<iframe src="${esc(v.embed)}" title="${esc(v.titulo)}" loading="lazy" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`
          : `<video src="${esc(v.arquivo)}" autoplay muted loop playsinline preload="metadata"></video>`;
      return `<article class="video-card revelar">
        <div class="tela">${tela}</div>
        <div class="txt"><h3>${esc(v.titulo)}</h3>${v.descricao ? `<p>${esc(v.descricao)}</p>` : ""}</div>
      </article>`;
    };
    blocos.forEach((bloco) => {
      const itens = videos.filter((v) => (v.secao || "producoes") === bloco.dataset.videos);
      const verticais = itens.filter((v) => v.formato === "vertical");
      const horizontais = itens.filter((v) => v.formato !== "vertical");
      bloco.innerHTML = !itens.length ? `<p class="vazio">Em breve.</p>` : `
        ${verticais.length ? `<div class="videos vertical">${verticais.map(cartao).join("")}</div>` : ""}
        ${horizontais.length ? `<div class="videos" ${verticais.length ? 'style="margin-top:48px"' : ""}>${horizontais.map(cartao).join("")}</div>` : ""}`;
      // o player do YouTube só carrega quando a pessoa clica (site mais leve)
      bloco.addEventListener("click", (e) => {
        const b = e.target.closest(".capa-yt");
        if (!b) return;
        b.outerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${b.dataset.yt}?autoplay=1" title="Vídeo do YouTube" allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
      });
      revelar(bloco);
    });
  }

  // músicas em arquivo (sons.json) e o player do Spotify
  const listas = document.querySelectorAll("[data-secao]");
  if (listas.length) {
    let sons = [];
    try { sons = await carregar("conteudo/sons.json"); } catch (e) {}
    listas.forEach((lista) => {
      const audios = sons.filter((s) => (s.secao || "sound-design") === lista.dataset.secao && s.arquivo);
      let html = "";
      if (lista.dataset.secao === "musica" && SITE.spotify) {
        const id = (SITE.spotify.match(/artist\/([A-Za-z0-9]+)/) || [])[1];
        if (id) html += `<div class="spotify revelar"><iframe src="https://open.spotify.com/embed/artist/${id}?utm_source=generator&theme=0" height="352" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" title="Ocarneiro Studio no Spotify"></iframe></div>`;
      }
      if (audios.length) html += `<div class="faixas" style="margin-top:32px">${audios.map((s) => `
          <div class="faixa-som revelar">
            <button class="tocar" aria-label="Tocar ${esc(s.titulo)}">${ICONE_PLAY}</button>
            <div class="meio">
              <div class="cabeca"><h3>${esc(s.titulo)}</h3><div class="meta">${esc(s.descricao || "")}</div></div>
              <div class="onda" role="slider" aria-label="Posição" tabindex="0">${(s.ondas || Array(60).fill(0.5)).map((h) => `<i style="height:${Math.max(8, h * 100)}%"></i>`).join("")}</div>
            </div>
            <span class="tempo">0:00</span>
            <audio src="${esc(s.arquivo)}" preload="none"></audio>
          </div>`).join("")}</div>`;
      lista.innerHTML = html;
      if (html) lista.style.marginBottom = "48px";
      lista.querySelectorAll(".faixa-som").forEach(montarPlayer);
      revelar(lista);
    });
  }
}

const ICONE_PLAY = `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
const ICONE_PAUSA = `<svg viewBox="0 0 24 24"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>`;
let audioAtual = null;

function montarPlayer(el) {
  const audio = $("audio", el), botao = $(".tocar", el), onda = $(".onda", el), tempo = $(".tempo", el);
  const barras = [...onda.children];
  const atualizar = () => {
    const p = audio.duration ? audio.currentTime / audio.duration : 0;
    const n = Math.round(p * barras.length);
    barras.forEach((b, i) => b.classList.toggle("tocado", i < n));
    tempo.textContent = formatarTempo(audio.currentTime) + " / " + formatarTempo(audio.duration);
  };
  botao.addEventListener("click", () => {
    if (audio.paused) {
      if (audioAtual && audioAtual !== audio) audioAtual.pause();
      audioAtual = audio;
      audio.play();
    } else audio.pause();
  });
  audio.addEventListener("play", () => { botao.innerHTML = ICONE_PAUSA; el.classList.add("tocando"); });
  audio.addEventListener("pause", () => { botao.innerHTML = ICONE_PLAY; el.classList.remove("tocando"); });
  audio.addEventListener("timeupdate", atualizar);
  audio.addEventListener("loadedmetadata", atualizar);
  const pular = (frac) => {
    const ir = () => { audio.currentTime = frac * audio.duration; atualizar(); };
    if (audio.duration) ir(); else { audio.preload = "auto"; audio.addEventListener("loadedmetadata", ir, { once: true }); audio.load(); }
  };
  onda.addEventListener("click", (e) => {
    const r = onda.getBoundingClientRect();
    pular(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
  });
  onda.addEventListener("keydown", (e) => {
    if (!audio.duration) return;
    if (e.key === "ArrowRight") audio.currentTime += 5;
    if (e.key === "ArrowLeft") audio.currentTime -= 5;
  });
}

/* ==========================================================
   ARTIGOS — lista e leitura
   ========================================================== */
async function paginaArtigos() {
  const lista = $("#lista-artigos");
  if (!lista) return;
  let artigos = [];
  try { artigos = await carregar("conteudo/artigos.json"); } catch (e) {}
  artigos.sort((a, b) => (b.data || "").localeCompare(a.data || ""));
  lista.innerHTML = artigos.length ? artigos.map((a) => `
    <a class="artigo-item revelar" href="artigo.html?slug=${encodeURIComponent(a.slug)}">
      <time datetime="${esc(a.data)}">${formatarData(a.data)}</time>
      <div>
        <h2>${esc(a.titulo)}</h2>
        ${a.resumo ? `<p>${esc(a.resumo)}</p>` : ""}
        ${a.tags ? `<div class="tags">${a.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>` : ""}
      </div>
      <div class="capa">${a.capa ? `<img src="${esc(a.capa)}" alt="" loading="lazy">` : ""}</div>
    </a>`).join("") : `<p class="vazio">Os primeiros artigos chegam em breve.</p>`;
  revelar(lista);
}

async function paginaArtigo() {
  const alvo = $("#artigo");
  if (!alvo) return;
  const slug = new URLSearchParams(location.search).get("slug") || "";
  let artigos = [];
  try { artigos = await carregar("conteudo/artigos.json"); } catch (e) {}
  const a = artigos.find((x) => x.slug === slug);
  if (!a) { alvo.innerHTML = `<a class="voltar" href="artigos.html">← Artigos</a><h1>Artigo não encontrado</h1>`; return; }
  document.title = `${a.titulo} — Ocarneiro Studio`;
  let md = "";
  try { md = await carregar(`conteudo/artigos/${encodeURIComponent(a.slug)}.md`); }
  catch (e) { md = "*Não foi possível carregar o texto deste artigo.*"; }
  const html = window.marked ? window.marked.parse(md) : `<pre>${esc(md)}</pre>`;
  alvo.innerHTML = `
    <a class="voltar" href="artigos.html">← Artigos</a>
    <h1>${esc(a.titulo)}</h1>
    <div class="meta">
      <time datetime="${esc(a.data)}">${formatarData(a.data)}</time>
      ${(a.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}
    </div>
    ${a.capa ? `<div class="capa"><img src="${esc(a.capa)}" alt=""></div>` : ""}
    <div class="texto">${html}</div>`;
  if (window.montarViz) window.montarViz(alvo);
  revelar(alvo);
}

/* ==========================================================
   CONTATO
   ========================================================== */
function paginaContato() {
  const alvo = $("#links-contato");
  if (!alvo) return;
  const links = linksContato();
  alvo.innerHTML = links.map((l) => `
    <a class="contato-link" href="${esc(l.href)}" ${l.href.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>
      <span><small>${esc(l.rotulo)}</small><strong>${esc(l.valor)}</strong></span>
      <span class="seta">↗</span>
    </a>`).join("");

  // O formulário abre o e-mail da pessoa já preenchido. Só aparece se houver e-mail no site.json.
  const form = $("#form-contato");
  if (!form) return;
  if (!SITE.email) { form.hidden = true; alvo.parentElement.style.gridTemplateColumns = "1fr"; return; }
  form.hidden = false;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const assunto = `[Site] ${d.get("tipo")} — ${d.get("nome")}`;
    const corpo = `${d.get("mensagem")}\n\n— ${d.get("nome")}`;
    location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
  });
}

/* ---------- iniciar ---------- */
(async function iniciar() {
  montarTopo();
  try { SITE = await carregar("conteudo/site.json"); } catch (e) { SITE = {}; }
  montarRodape();
  relogio();
  const li = $("#link-linkedin");
  if (li && SITE.linkedin) { li.href = SITE.linkedin; li.hidden = false; }
  const cta = $("#cta-email");
  if (cta && SITE.email) { cta.href = "mailto:" + SITE.email; cta.textContent = SITE.email + " ↗"; }
  revelar();
  paginaInicio();
  paginaTrabalho();
  paginaAudiovisual();
  paginaArtigos();
  paginaArtigo();
  paginaContato();
})();
