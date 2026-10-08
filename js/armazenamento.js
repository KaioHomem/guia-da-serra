// =============================================================
// armazenamento.js – A "MEMÓRIA" DO SITE
// Salva e carrega dados no localStorage, um espaço do navegador
// que continua guardado mesmo depois de fechar ou recarregar a página.
// =============================================================

// Nomes das "gavetas" onde cada informação fica guardada
const CHAVE_FAVORITOS = 'guia-favoritos';
const CHAVE_SUGESTOES = 'guia-sugestoes';
const CHAVE_TEMA = 'guia-tema';

// -------------------------------------------------------------
// ler: pega o que está guardado numa gaveta.
// Se a gaveta estiver vazia, devolve o "padrao".
// -------------------------------------------------------------
function ler(chave, padrao) {
  const texto = localStorage.getItem(chave); // pega o texto guardado (ou null se não tiver)
  // Operador ternário:  condição ? se_sim : se_nao
  // JSON.parse transforma o texto de volta em array/objeto
  return texto ? JSON.parse(texto) : padrao;
}

// -------------------------------------------------------------
// gravar: guarda um valor numa gaveta.
// O localStorage só aceita TEXTO, então JSON.stringify
// transforma o array/objeto em texto antes de guardar.
// -------------------------------------------------------------
function gravar(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor));
}

// Funções exportadas (usadas pelo main.js).
// Estão escritas como "arrow functions": (parametro) => resultado
export const carregarFavoritos = () => ler(CHAVE_FAVORITOS, []);          // padrão: lista vazia
export const salvarFavoritos = (favoritos) => gravar(CHAVE_FAVORITOS, favoritos);

export const carregarSugestoes = () => ler(CHAVE_SUGESTOES, []);          // padrão: lista vazia
export const salvarSugestoes = (sugestoes) => gravar(CHAVE_SUGESTOES, sugestoes);

export const carregarTema = () => ler(CHAVE_TEMA, 'claro');               // padrão: tema claro
export const salvarTema = (tema) => gravar(CHAVE_TEMA, tema);
