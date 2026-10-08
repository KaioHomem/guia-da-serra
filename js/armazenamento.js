// Módulo responsável por salvar e carregar dados do navegador (localStorage).
// Assim as tarefas não somem ao recarregar a página.

const CHAVE_TAREFAS = 'tarefas';
const CHAVE_TEMA = 'tema';

export function carregarTarefas() {
  const texto = localStorage.getItem(CHAVE_TAREFAS);
  // Se não houver nada salvo, começa com lista vazia
  return texto ? JSON.parse(texto) : [];
}

export function salvarTarefas(tarefas) {
  // localStorage só guarda texto, então convertemos o array para JSON
  localStorage.setItem(CHAVE_TAREFAS, JSON.stringify(tarefas));
}

export function carregarTema() {
  return localStorage.getItem(CHAVE_TEMA) || 'claro';
}

export function salvarTema(tema) {
  localStorage.setItem(CHAVE_TEMA, tema);
}
