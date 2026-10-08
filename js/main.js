// Arquivo principal: junta os módulos e trata os eventos da página.

import * as armazenamento from './armazenamento.js';
import * as regras from './tarefas.js';
import * as ui from './interface.js';
import * as efeitos from './efeitos.js';

// ---------- Referências aos elementos do HTML ----------
const form = document.getElementById('form-tarefa');
const campoTitulo = document.getElementById('campo-titulo');
const campoPrioridade = document.getElementById('campo-prioridade');
const erroTitulo = document.getElementById('erro-titulo');
const lista = document.getElementById('lista');
const vazio = document.getElementById('vazio');
const contador = document.getElementById('contador');
const botoesFiltro = document.querySelectorAll('.filtro');
const botaoLimpar = document.getElementById('botao-limpar');
const botaoTema = document.getElementById('botao-tema');
const aviso = document.getElementById('aviso');

// ---------- Estado da aplicação ----------
let tarefas = armazenamento.carregarTarefas();
let filtroAtual = 'todas';
let tema = armazenamento.carregarTema();

// Atualiza tudo na tela e salva. Chamada após cada mudança.
function atualizar(idNovo = null) {
  const visiveis = regras.ordenarPorPrioridade(
    regras.filtrarTarefas(tarefas, filtroAtual)
  );
  ui.renderizarLista(lista, vazio, visiveis, idNovo);
  ui.atualizarContador(contador, regras.contarPendentes(tarefas));
  ui.marcarFiltroAtivo(botoesFiltro, filtroAtual);
  botaoLimpar.hidden = !tarefas.some((t) => t.concluida);
  armazenamento.salvarTarefas(tarefas);
}

// ---------- Eventos ----------

// Adicionar tarefa
form.addEventListener('submit', (evento) => {
  evento.preventDefault(); // impede o recarregamento da página

  const erro = regras.validarTitulo(campoTitulo.value);
  ui.mostrarErro(campoTitulo, erroTitulo, erro);
  if (erro) {
    efeitos.tremer(campoTitulo);
    campoTitulo.focus();
    return;
  }

  const nova = regras.criarTarefa(campoTitulo.value, campoPrioridade.value);
  tarefas.push(nova);
  atualizar(nova.id); // passa o id para a nova tarefa entrar animada
  ui.anunciar(aviso, `Tarefa "${nova.titulo}" adicionada.`);
  efeitos.mostrarToast('Tarefa adicionada ✓');

  form.reset();
  campoTitulo.focus(); // facilita adicionar várias seguidas
});

// Limpa o erro assim que o usuário volta a digitar
campoTitulo.addEventListener('input', () => {
  if (campoTitulo.getAttribute('aria-invalid') === 'true') {
    ui.mostrarErro(campoTitulo, erroTitulo, '');
  }
});

// Delegação de eventos: um único listener na <ul> trata todos os itens.
// "async" permite usar "await" para esperar a animação de saída.
lista.addEventListener('click', async (evento) => {
  const alvo = evento.target.closest('[data-acao]');
  if (!alvo) return;

  const item = alvo.closest('.tarefa');
  const id = Number(item.dataset.id);
  const tarefa = tarefas.find((t) => t.id === id);

  if (alvo.dataset.acao === 'alternar') {
    // Confete só ao concluir (não ao desmarcar)
    if (!tarefa.concluida) {
      efeitos.confete(alvo);
    }
    tarefas = regras.alternarTarefa(tarefas, id);
    const estado = tarefa.concluida ? 'pendente' : 'concluída';
    ui.anunciar(aviso, `Tarefa "${tarefa.titulo}" marcada como ${estado}.`);
    atualizar();
    // Mantém o foco no mesmo checkbox depois de redesenhar
    document.getElementById(`tarefa-${id}`)?.focus();
  }

  if (alvo.dataset.acao === 'remover') {
    await efeitos.animarSaida(item); // espera o item "deslizar" para fora
    tarefas = regras.removerTarefa(tarefas, id);
    atualizar();
    ui.anunciar(aviso, `Tarefa "${tarefa.titulo}" removida.`);
    campoTitulo.focus(); // o botão sumiu, então o foco vai para um lugar útil
  }
});

// Filtros
botoesFiltro.forEach((botao) => {
  botao.addEventListener('click', () => {
    filtroAtual = botao.dataset.filtro;
    atualizar();
    ui.anunciar(aviso, `Mostrando: ${botao.textContent}.`);
  });
});

// Remover concluídas (com confirmação, para evitar erro do usuário)
botaoLimpar.addEventListener('click', async () => {
  const quantidade = tarefas.length - regras.contarPendentes(tarefas);
  if (!confirm(`Remover ${quantidade} tarefa(s) concluída(s)?`)) return;

  // Anima a saída de todas as concluídas ao mesmo tempo
  const itensConcluidos = lista.querySelectorAll('.tarefa--concluida');
  await Promise.all([...itensConcluidos].map(efeitos.animarSaida));

  tarefas = regras.removerConcluidas(tarefas);
  atualizar();
  efeitos.mostrarToast('Concluídas removidas');
  ui.anunciar(aviso, `${quantidade} tarefa(s) removida(s).`);
});

// Alternar tema claro/escuro
botaoTema.addEventListener('click', () => {
  tema = tema === 'claro' ? 'escuro' : 'claro';
  ui.aplicarTema(botaoTema, tema);
  armazenamento.salvarTema(tema);
});

// ---------- Inicialização ----------
ui.aplicarTema(botaoTema, tema);
atualizar();
