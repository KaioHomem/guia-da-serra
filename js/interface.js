// Módulo que manipula o DOM (cria e atualiza elementos na tela).

import { PRIORIDADES } from './tarefas.js';

// Cria o <li> de uma tarefa
function criarItem(tarefa) {
  const item = document.createElement('li');
  item.className = 'tarefa';
  if (tarefa.concluida) {
    item.classList.add('tarefa--concluida');
  }
  item.dataset.id = tarefa.id;

  const idCheckbox = `tarefa-${tarefa.id}`;

  // Checkbox com <label> associado: o leitor de tela lê o nome da tarefa
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = idCheckbox;
  checkbox.checked = tarefa.concluida;
  checkbox.dataset.acao = 'alternar';

  const label = document.createElement('label');
  label.htmlFor = idCheckbox;
  label.className = 'tarefa__texto';
  label.textContent = tarefa.titulo; // textContent evita injeção de HTML

  const etiqueta = document.createElement('span');
  etiqueta.className = `etiqueta etiqueta--${tarefa.prioridade}`;
  etiqueta.textContent = PRIORIDADES[tarefa.prioridade];

  // Botão com ícone "✕": o aria-label diz o que ele faz
  const remover = document.createElement('button');
  remover.type = 'button';
  remover.className = 'tarefa__remover';
  remover.dataset.acao = 'remover';
  remover.setAttribute('aria-label', `Remover tarefa: ${tarefa.titulo}`);
  remover.innerHTML = '<span aria-hidden="true">✕</span>';

  item.append(checkbox, label, etiqueta, remover);
  return item;
}

// Redesenha a lista inteira a partir do array de tarefas.
// idNovo (opcional): tarefa recém-adicionada, que recebe animação de entrada.
export function renderizarLista(elementoLista, elementoVazio, tarefas, idNovo = null) {
  elementoLista.innerHTML = '';
  tarefas.forEach((tarefa) => {
    const item = criarItem(tarefa);
    if (tarefa.id === idNovo) {
      item.classList.add('tarefa--nova');
    }
    elementoLista.appendChild(item);
  });
  elementoVazio.hidden = tarefas.length > 0;
}

export function atualizarContador(elemento, quantidade) {
  // Operador ternário para singular/plural
  const palavra = quantidade === 1 ? 'tarefa pendente' : 'tarefas pendentes';
  elemento.textContent = `${quantidade} ${palavra}`;
}

export function marcarFiltroAtivo(botoes, filtro) {
  botoes.forEach((botao) => {
    const ativo = botao.dataset.filtro === filtro;
    botao.setAttribute('aria-pressed', String(ativo));
  });
}

export function mostrarErro(campo, elementoErro, mensagem) {
  elementoErro.textContent = mensagem;
  campo.setAttribute('aria-invalid', mensagem ? 'true' : 'false');
}

// Escreve na região aria-live para o leitor de tela anunciar
export function anunciar(elemento, mensagem) {
  elemento.textContent = '';
  // pequeno atraso garante que o leitor perceba a mudança
  setTimeout(() => {
    elemento.textContent = mensagem;
  }, 50);
}

export function aplicarTema(botao, tema) {
  const escuro = tema === 'escuro';
  document.documentElement.dataset.tema = tema;
  botao.setAttribute('aria-pressed', String(escuro));
  botao.textContent = escuro ? 'Tema claro' : 'Tema escuro';
}
