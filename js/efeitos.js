// Módulo de efeitos visuais (animações) feitos só com JavaScript e CSS.
// Usa a Web Animations API: elemento.animate(quadros, opções).

// Verifica se o usuário pediu "menos movimento" no sistema (acessibilidade).
// Se sim, os efeitos são pulados.
function semAnimacao() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Faz um elemento "tremer" (usado quando o formulário tem erro)
export function tremer(elemento) {
  if (semAnimacao()) return;
  elemento.animate(
    [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-8px)' },
      { transform: 'translateX(8px)' },
      { transform: 'translateX(-4px)' },
      { transform: 'translateX(0)' },
    ],
    { duration: 350, easing: 'ease-in-out' }
  );
}

// Anima a saída de um elemento. Retorna uma Promise que termina
// quando a animação acaba (assim o código espera antes de remover).
export function animarSaida(elemento) {
  if (semAnimacao()) return Promise.resolve();
  const animacao = elemento.animate(
    [
      { opacity: 1, transform: 'translateX(0)' },
      { opacity: 0, transform: 'translateX(40px)' },
    ],
    { duration: 250, easing: 'ease-in', fill: 'forwards' }
  );
  // Promise.race: termina no que vier primeiro, o fim da animação ou 400ms.
  // Garante que a remoção não trava se o navegador pausar a animação.
  const limite = new Promise((resolver) => setTimeout(resolver, 400));
  return Promise.race([animacao.finished, limite]);
}

// Solta confetes coloridos a partir de um elemento (ao concluir tarefa)
export function confete(origem) {
  if (semAnimacao()) return;

  const cores = ['#1a5fb4', '#e66100', '#26a269', '#c01c28', '#f5c211', '#9141ac'];
  const posicao = origem.getBoundingClientRect();
  const x = posicao.left + posicao.width / 2;
  const y = posicao.top + posicao.height / 2;

  for (let i = 0; i < 24; i++) {
    const pedaco = document.createElement('span');
    pedaco.className = 'confete';
    pedaco.setAttribute('aria-hidden', 'true'); // decorativo: leitor de tela ignora
    pedaco.style.left = `${x}px`;
    pedaco.style.top = `${y}px`;
    pedaco.style.background = cores[i % cores.length];
    document.body.appendChild(pedaco);

    // Direção e distância aleatórias para cada pedaço
    const angulo = Math.random() * Math.PI * 2;
    const distancia = 40 + Math.random() * 80;
    const dx = Math.cos(angulo) * distancia;
    const dy = Math.sin(angulo) * distancia - 40; // sobe um pouco antes de cair

    const animacao = pedaco.animate(
      [
        { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${dx}px, ${dy + 80}px) rotate(${Math.random() * 720}deg)`, opacity: 0 },
      ],
      { duration: 800 + Math.random() * 400, easing: 'cubic-bezier(.2,.8,.4,1)' }
    );
    animacao.onfinish = () => pedaco.remove();
    setTimeout(() => pedaco.remove(), 1500); // garantia de limpeza
  }
}

// Mostra uma notificação ("toast") no canto da tela por alguns segundos.
// É só visual: o leitor de tela já recebe a mensagem pela região aria-live.
export function mostrarToast(mensagem) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('aria-hidden', 'true');
  toast.textContent = mensagem;
  document.body.appendChild(toast);

  // Força o navegador a aplicar o estado inicial antes de adicionar a classe
  requestAnimationFrame(() => toast.classList.add('toast--visivel'));

  setTimeout(() => {
    toast.classList.remove('toast--visivel');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    // Garantia caso não haja transição (prefers-reduced-motion)
    setTimeout(() => toast.remove(), 500);
  }, 2500);
}
