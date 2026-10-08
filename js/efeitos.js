// =============================================================
// efeitos.js – A DECORAÇÃO (ANIMAÇÕES)
// Efeitos visuais feitos só com JavaScript e CSS.
// Usa a Web Animations API: elemento.animate(quadros, opções).
//   quadros = como o elemento começa e como termina
//   opções  = duração, tipo de aceleração etc.
// =============================================================

// -------------------------------------------------------------
// semAnimacao: confere se a pessoa pediu "reduzir movimento"
// nas configurações do sistema (acessibilidade: animação pode
// causar tontura em algumas pessoas). Se sim, os efeitos são pulados.
// -------------------------------------------------------------
function semAnimacao() {
  // matchMedia testa uma media query do CSS pelo JavaScript; .matches = true ou false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// -------------------------------------------------------------
// tremer: faz um campo "tremer" para os lados (usado no erro do formulário)
// -------------------------------------------------------------
export function tremer(elemento) {
  if (semAnimacao()) return; // pediu menos movimento: não faz nada

  elemento.animate(
    [
      // Cada linha é um "quadro" da animação: posição na horizontal
      { transform: 'translateX(0)' },
      { transform: 'translateX(-8px)' }, // vai 8px para a esquerda
      { transform: 'translateX(8px)' },  // vai 8px para a direita
      { transform: 'translateX(-4px)' },
      { transform: 'translateX(0)' },    // volta ao lugar
    ],
    { duration: 350, easing: 'ease-in-out' } // dura 350 milissegundos
  );
}

// -------------------------------------------------------------
// animarSaida: faz um card sumir deslizando para a direita.
// Devolve uma PROMISE ("promessa"): algo que termina depois.
// Quem chama usa "await" para esperar a animação acabar antes de remover o card.
// -------------------------------------------------------------
export function animarSaida(elemento) {
  // Sem animação: devolve uma promessa já terminada (remove na hora)
  if (semAnimacao()) return Promise.resolve();

  const animacao = elemento.animate(
    [
      { opacity: 1, transform: 'translateX(0)' },    // começa visível, no lugar
      { opacity: 0, transform: 'translateX(40px)' },  // termina invisível, 40px para a direita
    ],
    { duration: 250, easing: 'ease-in', fill: 'forwards' } // fill: 'forwards' = fica no último quadro
  );

  // Garantia: espera no máximo 400ms, mesmo se o navegador pausar a animação
  const limite = new Promise((resolver) => setTimeout(resolver, 400));
  // Promise.race = "corrida": termina com o que acabar primeiro (animação ou limite)
  return Promise.race([animacao.finished, limite]);
}

// -------------------------------------------------------------
// confete: solta 24 pedacinhos coloridos a partir de um botão
// (usado ao favoritar um lugar)
// -------------------------------------------------------------
export function confete(origem) {
  if (semAnimacao()) return;

  // Array de cores dos pedaços
  const cores = ['#2e5e3e', '#c25e00', '#26a269', '#c0264b', '#f5c211', '#8a4b22'];

  // getBoundingClientRect = posição e tamanho do botão na tela
  const posicao = origem.getBoundingClientRect();
  const x = posicao.left + posicao.width / 2;  // centro do botão (horizontal)
  const y = posicao.top + posicao.height / 2;  // centro do botão (vertical)

  // Laço "for": repete 24 vezes, i vai de 0 até 23
  for (let i = 0; i < 24; i++) {
    // Cria um quadradinho
    const pedaco = document.createElement('span');
    pedaco.className = 'confete';
    pedaco.setAttribute('aria-hidden', 'true'); // decorativo: leitor de tela ignora
    pedaco.style.left = `${x}px`;               // começa no centro do botão
    pedaco.style.top = `${y}px`;
    pedaco.style.background = cores[i % cores.length]; // % = resto da divisão: vai repetindo as cores
    document.body.appendChild(pedaco);

    // Sorteia uma direção (ângulo) e uma distância para cada pedaço
    const angulo = Math.random() * Math.PI * 2;  // ângulo aleatório (uma volta inteira)
    const distancia = 40 + Math.random() * 80;   // entre 40 e 120 pixels
    const dx = Math.cos(angulo) * distancia;     // quanto anda na horizontal
    const dy = Math.sin(angulo) * distancia - 40; // quanto anda na vertical (-40 = sobe um pouco)

    const animacao = pedaco.animate(
      [
        { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
        // termina longe, mais para baixo (+80 = "gravidade"), girando e sumindo
        { transform: `translate(${dx}px, ${dy + 80}px) rotate(${Math.random() * 720}deg)`, opacity: 0 },
      ],
      { duration: 800 + Math.random() * 400, easing: 'cubic-bezier(.2,.8,.4,1)' } // cada um com duração diferente
    );

    // Quando a animação termina, apaga o pedaço da página
    animacao.onfinish = () => pedaco.remove();
    setTimeout(() => pedaco.remove(), 1500); // garantia de limpeza, caso a animação não termine
  }
}

// -------------------------------------------------------------
// mostrarToast: mostra uma notificação embaixo da tela por 2,5 segundos.
// É só visual: o leitor de tela já recebe a mensagem pelo aria-live.
// -------------------------------------------------------------
export function mostrarToast(mensagem) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('aria-hidden', 'true'); // evita o leitor de tela falar a mensagem duas vezes
  toast.textContent = mensagem;
  document.body.appendChild(toast);

  // requestAnimationFrame espera o navegador desenhar o toast escondido;
  // depois adiciona a classe que faz ele subir (a transição do CSS anima)
  requestAnimationFrame(() => toast.classList.add('toast--visivel'));

  // Depois de 2500ms (2,5 segundos), esconde e remove
  setTimeout(() => {
    toast.classList.remove('toast--visivel'); // faz descer
    // { once: true } = o escutador roda uma vez só
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    setTimeout(() => toast.remove(), 500); // garantia caso não haja transição
  }, 2500);
}
