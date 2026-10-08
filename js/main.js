// =============================================================
// main.js – O "CHEFE" DO SITE
// É o primeiro arquivo que o index.html carrega.
// Ele importa os outros módulos, guarda o estado da página
// e fica ESCUTANDO os cliques e o que o usuário digita.
// =============================================================

// ---------- Importa os outros arquivos (módulos) ----------
import { LUGARES } from './dados.js';                // a lista de lugares
import * as armazenamento from './armazenamento.js'; // "* as" = pega tudo e chama de armazenamento
import * as regras from './regras.js';               // usado como regras.filtrarLugares(...)
import * as ui from './interface.js';                // usado como ui.renderizarCards(...)
import * as efeitos from './efeitos.js';             // usado como efeitos.confete(...)

// ---------- Pega os elementos do HTML pelo id ----------
// Assim o JS consegue ler e mudar essas partes da página.
const campoBusca = document.getElementById('campo-busca');
const formBusca = document.getElementById('form-busca');
const botoesCategoria = document.querySelectorAll('[data-categoria]'); // querySelectorAll = pega TODOS os botões de categoria
const botaoFavoritos = document.getElementById('botao-favoritos');
const resultado = document.getElementById('resultado');
const lista = document.getElementById('lista-lugares');
const vazio = document.getElementById('vazio');
const formSugestao = document.getElementById('form-sugestao');
const janela = document.getElementById('detalhes');
const botaoFechar = document.getElementById('fechar-detalhes');
const botaoTema = document.getElementById('botao-tema');
const aviso = document.getElementById('aviso');

// ---------- Estado da aplicação ----------
// "let" = variável que PODE mudar. É tudo que o site precisa lembrar.
// SEGURANÇA: o que vem do localStorage passa pelas funções "limpar" antes de ser usado
let favoritos = regras.limparFavoritos(armazenamento.carregarFavoritos()); // ids favoritados
let sugestoes = regras.limparSugestoes(armazenamento.carregarSugestoes()); // lugares sugeridos
// Tema só pode ser 'escuro' ou 'claro'; qualquer outro valor vira 'claro'
let tema = armazenamento.carregarTema() === 'escuro' ? 'escuro' : 'claro';
let categoriaAtual = 'todas';                      // filtro de categoria escolhido
let soFavoritos = false;                           // botão "Só favoritos" ligado?
let botaoQueAbriu = null;                          // botão que abriu a janela (para devolver o foco)

// Junta os lugares do guia com os sugeridos. "..." espalha as duas listas numa só.
function todosOsLugares() {
  return [...LUGARES, ...sugestoes];
}

// Acha um lugar pelo id. .find devolve o PRIMEIRO item que combina.
function buscarLugar(id) {
  return todosOsLugares().find((lugar) => lugar.id === id);
}

// -------------------------------------------------------------
// atualizar: A FUNÇÃO MAIS IMPORTANTE.
// Filtra os lugares e redesenha a tela.
// É chamada depois de QUALQUER mudança (busca, filtro, favorito...).
// -------------------------------------------------------------
function atualizar(idNovo = null) {
  // 1. Pede para o regras.js filtrar, mandando um objeto com os filtros atuais
  const visiveis = regras.filtrarLugares(todosOsLugares(), {
    texto: campoBusca.value,    // o que está digitado na busca
    categoria: categoriaAtual,
    soFavoritos: soFavoritos,
    favoritos: favoritos,
  });

  // 2. Pede para o interface.js desenhar
  ui.renderizarCards(lista, vazio, visiveis, favoritos, idNovo); // os cards
  ui.atualizarResultado(resultado, visiveis.length);             // "X lugares encontrados"
  ui.marcarCategoria(botoesCategoria, categoriaAtual);           // botão de categoria ativo
  botaoFavoritos.setAttribute('aria-pressed', String(soFavoritos)); // botão "Só favoritos"
}

// =============================================================
// EVENTOS – "quando o usuário fizer X, execute Y"
// addEventListener('evento', função) fica escutando o evento.
// =============================================================

// ---------- Busca ----------
// "input" acontece a cada letra digitada: a busca é instantânea
campoBusca.addEventListener('input', () => atualizar());

// Apertar Enter na busca "envia" o formulário e recarregaria a página.
// preventDefault() cancela esse comportamento padrão.
formBusca.addEventListener('submit', (evento) => evento.preventDefault());

// ---------- Botões de categoria ----------
// Coloca um "escutador" em cada botão de categoria
botoesCategoria.forEach((botao) => {
  botao.addEventListener('click', () => {
    categoriaAtual = botao.dataset.categoria; // lê o data-categoria do botão clicado
    atualizar();
  });
});

// ---------- Botão "Só favoritos" ----------
botaoFavoritos.addEventListener('click', () => {
  soFavoritos = !soFavoritos; // "!" inverte: true vira false e false vira true
  atualizar();
});

// ---------- Cliques nos cards (DELEGAÇÃO DE EVENTOS) ----------
// Em vez de colocar um escutador em cada botão de cada card,
// coloca UM só na lista <ul>. Quando qualquer botão dentro dela é clicado,
// o clique "sobe" até a lista e é tratado aqui.
// "async" permite usar "await" (esperar a animação terminar) lá embaixo.
lista.addEventListener('click', async (evento) => {
  // evento.target = o elemento clicado. closest procura o botão com data-acao mais próximo
  const botao = evento.target.closest('[data-acao]');
  if (!botao) return; // clicou fora de um botão: não faz nada

  const id = botao.closest('li').dataset.id; // descobre de qual card é o botão
  const lugar = buscarLugar(id);             // pega o objeto completo do lugar

  // --- Botão "Ver detalhes" ---
  if (botao.dataset.acao === 'detalhes') {
    botaoQueAbriu = botao;   // guarda para devolver o foco quando fechar
    ui.abrirDetalhes(lugar); // abre a janela
  }

  // --- Botão de favorito (coração) ---
  if (botao.dataset.acao === 'favoritar') {
    const virouFavorito = !favoritos.includes(id); // se NÃO era favorito, agora vai virar
    if (virouFavorito) {
      efeitos.confete(botao); // confete só ao favoritar (não ao desfavoritar)
    }
    favoritos = regras.alternarFavorito(favoritos, id); // coloca ou tira da lista
    armazenamento.salvarFavoritos(favoritos);           // salva no navegador
    atualizar();                                        // redesenha a tela

    // Mensagem para o leitor de tela (ternário escolhe qual)
    const mensagem = virouFavorito
      ? `${lugar.nome} adicionado aos favoritos.`
      : `${lugar.nome} removido dos favoritos.`;
    ui.anunciar(aviso, mensagem);
    // Mensagem visual (toast) no rodapé da tela
    efeitos.mostrarToast(virouFavorito ? 'Adicionado aos favoritos ♥' : 'Removido dos favoritos');

    // Os cards foram redesenhados, então o foco do teclado se perdeu.
    // Aqui ele volta para o mesmo coração. "?." = só chama focus() se o botão existir.
    // CSS.escape protege o seletor caso o id tenha aspas ou símbolos (segurança)
    lista.querySelector(`[data-id="${CSS.escape(id)}"] [data-acao="favoritar"]`)?.focus();
  }

  // --- Botão "Remover" (só nos lugares sugeridos) ---
  if (botao.dataset.acao === 'remover') {
    // confirm abre uma caixa "OK / Cancelar". Se cancelar, para aqui.
    if (!confirm(`Remover "${lugar.nome}" do guia?`)) return;

    await efeitos.animarSaida(botao.closest('li')); // await = ESPERA a animação de saída terminar

    // filter fica com todos MENOS o removido
    sugestoes = sugestoes.filter((sugestao) => sugestao.id !== id);
    favoritos = favoritos.filter((favorito) => favorito !== id);
    armazenamento.salvarSugestoes(sugestoes);
    armazenamento.salvarFavoritos(favoritos);
    atualizar();
    ui.anunciar(aviso, `${lugar.nome} removido do guia.`);
    campoBusca.focus(); // o botão sumiu, então o foco vai para a busca
  }
});

// ---------- Janela de detalhes ----------
// Botão ✕ fecha a janela
botaoFechar.addEventListener('click', () => janela.close());

// Clicar no fundo escuro também fecha.
// Se o clique foi na própria <dialog> (e não no conteúdo dentro dela), foi no fundo.
janela.addEventListener('click', (evento) => {
  if (evento.target === janela) janela.close();
});

// Quando a janela fecha (pelo ✕, pelo Esc ou clicando fora),
// o foco volta para o botão "Ver detalhes" que abriu. Importante para quem usa teclado.
janela.addEventListener('close', () => botaoQueAbriu?.focus());

// ---------- Formulário "Sugira um lugar" ----------
formSugestao.addEventListener('submit', (evento) => {
  evento.preventDefault(); // não deixa a página recarregar

  // Junta o que foi digitado num objeto. form.elements.nome = campo com name="nome".
  // SEGURANÇA: .slice corta no tamanho máximo. O maxlength do HTML pode ser
  // removido pelo F12, então o limite é garantido também aqui no JavaScript.
  const dados = {
    nome: formSugestao.elements.nome.value.slice(0, 60),
    cidade: formSugestao.elements.cidade.value.slice(0, 40),
    categoria: formSugestao.elements.categoria.value,
    descricao: formSugestao.elements.descricao.value.slice(0, 200),
  };

  // Valida e mostra os erros na tela
  const erros = regras.validarSugestao(dados);
  ui.mostrarErros(formSugestao, erros);

  // Object.keys devolve os nomes dos campos com erro, ex.: ['nome', 'cidade']
  const camposComErro = Object.keys(erros);
  if (camposComErro.length > 0) {
    const primeiro = formSugestao.elements[camposComErro[0]]; // primeiro campo errado
    efeitos.tremer(primeiro); // efeito de "tremida"
    primeiro.focus();         // leva o cursor direto para o erro
    return;                   // para aqui: não salva nada
  }

  // Sem erros: cria o lugar novo e guarda
  const novo = regras.criarSugestao(dados);
  sugestoes.push(novo);                      // push = coloca no fim da lista
  armazenamento.salvarSugestoes(sugestoes);

  // Limpa busca e filtros para o lugar novo aparecer com certeza
  campoBusca.value = '';
  categoriaAtual = 'todas';
  soFavoritos = false;
  atualizar(novo.id); // manda o id para o card novo entrar animado

  formSugestao.reset(); // limpa os campos do formulário
  ui.anunciar(aviso, `${novo.nome} adicionado ao guia.`);
  efeitos.mostrarToast('Lugar adicionado ao guia ✓');

  // Rola a página suavemente até o card novo
  lista.querySelector(`[data-id="${CSS.escape(novo.id)}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// ---------- Botão de tema claro/escuro ----------
botaoTema.addEventListener('click', () => {
  tema = tema === 'claro' ? 'escuro' : 'claro'; // se é claro vira escuro, e vice-versa
  ui.aplicarTema(botaoTema, tema);
  armazenamento.salvarTema(tema); // lembra a escolha para a próxima visita
});

// =============================================================
// INÍCIO – roda uma vez quando a página abre
// =============================================================
ui.aplicarTema(botaoTema, tema); // aplica o tema salvo
atualizar();                     // desenha os cards pela primeira vez
