// Módulo com as regras das tarefas (lógica pura, sem mexer no HTML).

// Objeto que traduz o valor da prioridade para o texto exibido
export const PRIORIDADES = {
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
};

// Cria um objeto tarefa
export function criarTarefa(titulo, prioridade) {
  return {
    id: Date.now(),          // número único baseado na data/hora
    titulo: titulo.trim(),
    prioridade: prioridade,
    concluida: false,
  };
}

// Valida o texto digitado. Retorna uma mensagem de erro ou string vazia.
export function validarTitulo(titulo) {
  const texto = titulo.trim();
  if (texto === '') {
    return 'Digite a descrição da tarefa.';
  }
  if (texto.length < 3) {
    return 'A descrição precisa ter pelo menos 3 caracteres.';
  }
  return '';
}

// Inverte o estado concluída/pendente de uma tarefa.
// Usa map para devolver um NOVO array, sem alterar o original.
export function alternarTarefa(tarefas, id) {
  return tarefas.map((tarefa) =>
    tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa
  );
}

export function removerTarefa(tarefas, id) {
  return tarefas.filter((tarefa) => tarefa.id !== id);
}

export function removerConcluidas(tarefas) {
  return tarefas.filter((tarefa) => !tarefa.concluida);
}

// Retorna só as tarefas que combinam com o filtro escolhido
export function filtrarTarefas(tarefas, filtro) {
  if (filtro === 'pendentes') {
    return tarefas.filter((tarefa) => !tarefa.concluida);
  }
  if (filtro === 'concluidas') {
    return tarefas.filter((tarefa) => tarefa.concluida);
  }
  return tarefas; // "todas"
}

// Ordena: alta > média > baixa
export function ordenarPorPrioridade(tarefas) {
  const peso = { alta: 0, media: 1, baixa: 2 };
  return [...tarefas].sort((a, b) => peso[a.prioridade] - peso[b.prioridade]);
}

export function contarPendentes(tarefas) {
  return tarefas.filter((tarefa) => !tarefa.concluida).length;
}
