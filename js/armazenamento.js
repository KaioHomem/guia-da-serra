// Módulo responsável por salvar e carregar dados do navegador (localStorage).
// Assim os favoritos e as sugestões não somem ao recarregar a página.

const CHAVE_FAVORITOS = 'guia-favoritos';
const CHAVE_SUGESTOES = 'guia-sugestoes';
const CHAVE_TEMA = 'guia-tema';

// Função "ajudante": lê um valor e converte de JSON.
// Se não houver nada salvo, devolve o valor padrão.
function ler(chave, padrao) {
  const texto = localStorage.getItem(chave);
  return texto ? JSON.parse(texto) : padrao;
}

// localStorage só guarda texto, então convertemos para JSON
function gravar(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor));
}

export const carregarFavoritos = () => ler(CHAVE_FAVORITOS, []);
export const salvarFavoritos = (favoritos) => gravar(CHAVE_FAVORITOS, favoritos);

export const carregarSugestoes = () => ler(CHAVE_SUGESTOES, []);
export const salvarSugestoes = (sugestoes) => gravar(CHAVE_SUGESTOES, sugestoes);

export const carregarTema = () => ler(CHAVE_TEMA, 'claro');
export const salvarTema = (tema) => gravar(CHAVE_TEMA, tema);
