// =============================================================
// regras.js – AS REGRAS DO GUIA
// Funções que só trabalham com dados: buscam, filtram, validam.
// Nenhuma delas mexe na tela (isso é trabalho do interface.js).
// =============================================================

// -------------------------------------------------------------
// normalizar: deixa o texto "limpo" para comparar.
// Exemplo: "  Urubicí " vira "urubici".
// Assim, quem digita sem acento ou em minúsculo encontra igual.
// -------------------------------------------------------------
export function normalizar(texto) {
  return texto
    .normalize('NFD')                 // separa a letra do acento: "á" vira "a" + "´"
    .replace(/[̀-ͯ]/g, '')  // apaga os acentos que ficaram soltos
    .toLowerCase()                    // deixa tudo minúsculo
    .trim();                          // tira os espaços do começo e do fim
}

// -------------------------------------------------------------
// filtrarLugares: recebe TODOS os lugares e devolve só os que
// passam nos filtros escolhidos pelo usuário.
// "filtros" é um objeto assim: { texto, categoria, soFavoritos, favoritos }
// -------------------------------------------------------------
export function filtrarLugares(lugares, filtros) {
  // Limpa o texto digitado na busca (sem acento, minúsculo)
  const busca = normalizar(filtros.texto);

  // .filter percorre a lista e fica só com quem "retornar true"
  return lugares.filter((lugar) => {
    // Condição 1 – texto da busca:
    // passa se a busca está vazia OU (||) o nome contém o texto OU a cidade contém o texto
    const combinaTexto =
      busca === '' ||
      normalizar(lugar.nome).includes(busca) ||
      normalizar(lugar.cidade).includes(busca);

    // Condição 2 – categoria:
    // passa se o filtro é "todas" OU a categoria do lugar é a escolhida
    const combinaCategoria =
      filtros.categoria === 'todas' || lugar.categoria === filtros.categoria;

    // Condição 3 – favoritos:
    // passa se o botão "Só favoritos" está desligado (!) OU o lugar está na lista de favoritos
    const combinaFavorito =
      !filtros.soFavoritos || filtros.favoritos.includes(lugar.id);

    // && = "E": o lugar só aparece se passar nas TRÊS condições
    return combinaTexto && combinaCategoria && combinaFavorito;
  });
}

// -------------------------------------------------------------
// alternarFavorito: se o lugar já é favorito, tira; se não é, coloca.
// "favoritos" é um array de ids, exemplo: ['avencal', 'catedral']
// Devolve um array NOVO (não altera o original, evita bugs).
// -------------------------------------------------------------
export function alternarFavorito(favoritos, id) {
  // .includes pergunta: "esse id está na lista?"
  if (favoritos.includes(id)) {
    // Já é favorito: devolve a lista sem ele (filter fica com todos os diferentes)
    return favoritos.filter((favorito) => favorito !== id);
  }
  // Não é favorito: "..." copia a lista antiga e coloca o id novo no fim
  return [...favoritos, id];
}

// -------------------------------------------------------------
// validarSugestao: confere o formulário "Sugira um lugar".
// Devolve um objeto com as mensagens de erro.
// Objeto vazio {} = nenhum erro = pode salvar.
// -------------------------------------------------------------
export function validarSugestao(dados) {
  const erros = {}; // começa sem erros

  // .trim() tira espaços; .length conta as letras
  if (dados.nome.trim().length < 3) {
    erros.nome = 'Digite o nome do lugar (pelo menos 3 letras).';
  }
  if (dados.cidade.trim().length < 3) {
    erros.cidade = 'Digite a cidade (pelo menos 3 letras).';
  }
  // A primeira opção do <select> ("Escolha…") tem valor vazio ''
  if (dados.categoria === '') {
    erros.categoria = 'Escolha uma categoria.';
  }
  return erros;
}

// -------------------------------------------------------------
// criarSugestao: monta o objeto de um lugar novo, sugerido pelo usuário.
// Fica no mesmo formato dos lugares do dados.js, mas sem foto.
// -------------------------------------------------------------
export function criarSugestao(dados) {
  // Se a descrição ficou vazia, o || usa o texto padrão no lugar
  const descricao = dados.descricao.trim() || 'Lugar sugerido por um visitante do guia.';

  return {
    id: `sugestao-${Date.now()}`, // Date.now() = milissegundos de agora, gera um id único
    nome: dados.nome.trim(),
    cidade: dados.cidade.trim(),
    categoria: dados.categoria,
    resumo: descricao,
    descricao: descricao,
    imagem: null,                 // null = "sem foto"
    sugerido: true,               // marca que veio do usuário (pode ser removido)
  };
}
