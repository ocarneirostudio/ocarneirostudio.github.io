/* ==========================================================
   OCARNEIRO STUDIO — interações
   Discretas de propósito: luz suave na capa e uma etiqueta
   "Ver projeto" que segue o mouse sobre os trabalhos.
   Desligado em celulares e para quem pede menos movimento.
   ========================================================== */
(function () {
  const raiz = document.documentElement;
  const menosMovimento = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mouseFino = matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!mouseFino || menosMovimento) return;
  raiz.classList.add("cursor-ativo");

  const lerp = (a, b, t) => a + (b - a) * t;
  let mx = -200, my = -200, ex = mx, ey = my;
  addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });

  /* etiqueta que segue o mouse sobre trabalhos, artigos e "próximo" */
  const etiqueta = document.createElement("div");
  etiqueta.className = "cursor-etiqueta";
  document.body.appendChild(etiqueta);
  document.addEventListener("mouseover", (e) => {
    const alvo = e.target.closest(".projeto, .artigo-item, .proximo");
    if (alvo) {
      etiqueta.textContent = alvo.classList.contains("artigo-item") ? "Ler artigo" : "Ver projeto";
      etiqueta.classList.add("on");
    } else etiqueta.classList.remove("on");
  });
  document.addEventListener("mouseleave", () => etiqueta.classList.remove("on"));

  /* luz suave na capa */
  const hero = document.querySelector(".hero");

  const loop = () => {
    ex = lerp(ex, mx, 0.2); ey = lerp(ey, my, 0.2);
    etiqueta.style.transform = `translate3d(${ex + 16}px, ${ey + 16}px, 0)`;
    if (hero) {
      const r = hero.getBoundingClientRect();
      if (r.bottom > 0) {
        hero.style.setProperty("--mx", `${mx}px`);
        hero.style.setProperty("--my", `${my - r.top}px`);
      }
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
})();
