// Módulo com as regras do guia (lógica pura, não mexe no HTML).

// Tira acentos e deixa tudo minúsculo.
// Assim, buscar "cascata" encontra "Cascata" e "urubici" encontra "Urubici".
export function normalizar(texto) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // remove os acentos
    .toLowerCase()
    .trim();
}

// Recebe todos os lugares e devolve só os que passam nos filtros.
// "filtros" é um objeto: { texto, categoria, soFavoritos, favoritos }
export function filtrarLugares(lugares, filtros) {
  const busca = normalizar(filtros.texto);

  return lugares.filter((lugar) => {
    // && = "E": o lugar precisa passar em TODAS as condições
    const combinaTexto =
      busca === '' ||
      normalizar(lugar.nome).includes(busca) ||
      normalizar(lugar.cidade).includes(busca);

    const combinaCategoria =
      filtros.categoria === 'todas' || lugar.categoria === filtros.categoria;

    const combinaFavorito =
      !filtros.soFavoritos || filtros.favoritos.includes(lugar.id);

    return combinaTexto && combinaCategoria && combinaFavorito;
  });
}

// Coloca ou tira um id da lista de favoritos.
// Devolve um NOVO array, sem alterar o original.
export function alternarFavorito(favoritos, id) {
  if (favoritos.includes(id)) {
    return favoritos.filter((favorito) => favorito !== id);
  }
  return [...favoritos, id];
}

// Valida o formulário de sugestão.
// Devolve um objeto com as mensagens de erro (vazio = tudo certo).
export function validarSugestao(dados) {
  const erros = {};

  if (dados.nome.trim().length < 3) {
    erros.nome = 'Digite o nome do lugar (pelo menos 3 letras).';
  }
  if (dados.cidade.trim().length < 3) {
    erros.cidade = 'Digite a cidade (pelo menos 3 letras).';
  }
  if (dados.categoria === '') {
    erros.categoria = 'Escolha uma categoria.';
  }
  return erros;
}

// Cria o objeto de um lugar sugerido pelo usuário (sem foto)
export function criarSugestao(dados) {
  const descricao = dados.descricao.trim() || 'Lugar sugerido por um visitante do guia.';
  return {
    id: `sugestao-${Date.now()}`,
    nome: dados.nome.trim(),
    cidade: dados.cidade.trim(),
    categoria: dados.categoria,
    resumo: descricao,
    descricao: descricao,
    imagem: null,
    sugerido: true,
  };
}
