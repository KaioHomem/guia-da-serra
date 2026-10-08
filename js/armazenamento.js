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
// SEGURANÇA: o que está no localStorage pode ter sido alterado por qualquer
// pessoa no próprio navegador (F12 > Application). Se estiver quebrado,
// o JSON.parse dá erro e o site inteiro parava de funcionar.
// try/catch = "tenta; se der erro, faz outra coisa em vez de travar".
// -------------------------------------------------------------
function ler(chave, padrao) {
  try {
    const texto = localStorage.getItem(chave); // pega o texto guardado (ou null se não tiver)
    // Operador ternário:  condição ? se_sim : se_nao
    // JSON.parse transforma o texto de volta em array/objeto
    return texto ? JSON.parse(texto) : padrao;
  } catch {
    // Texto corrompido ou navegador bloqueando o localStorage: usa o padrão
    return padrao;
  }
}

// -------------------------------------------------------------
// gravar: guarda um valor numa gaveta.
// O localStorage só aceita TEXTO, então JSON.stringify
// transforma o array/objeto em texto antes de guardar.
// try/catch: em aba anônima ou com o armazenamento cheio, setItem dá erro;
// aí o site continua funcionando, só não lembra depois de recarregar.
// -------------------------------------------------------------
function gravar(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    // não conseguiu salvar: ignora sem travar o site
  }
}

// Funções exportadas (usadas pelo main.js).
// Estão escritas como "arrow functions": (parametro) => resultado
export const carregarFavoritos = () => ler(CHAVE_FAVORITOS, []);          // padrão: lista vazia
export const salvarFavoritos = (favoritos) => gravar(CHAVE_FAVORITOS, favoritos);

export const carregarSugestoes = () => ler(CHAVE_SUGESTOES, []);          // padrão: lista vazia
export const salvarSugestoes = (sugestoes) => gravar(CHAVE_SUGESTOES, sugestoes);

export const carregarTema = () => ler(CHAVE_TEMA, 'claro');               // padrão: tema claro
export const salvarTema = (tema) => gravar(CHAVE_TEMA, tema);
