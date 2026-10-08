// Arquivo principal: junta os módulos e trata os eventos da página.

import { LUGARES } from './dados.js';
import * as armazenamento from './armazenamento.js';
import * as regras from './regras.js';
import * as ui from './interface.js';
import * as efeitos from './efeitos.js';

// ---------- Referências aos elementos do HTML ----------
const campoBusca = document.getElementById('campo-busca');
const formBusca = document.getElementById('form-busca');
const botoesCategoria = document.querySelectorAll('[data-categoria]');
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
let favoritos = armazenamento.carregarFavoritos();
let sugestoes = armazenamento.carregarSugestoes();
let tema = armazenamento.carregarTema();
let categoriaAtual = 'todas';
let soFavoritos = false;
let botaoQueAbriu = null; // para devolver o foco ao fechar a janela

// Todos os lugares = os do guia + os sugeridos pelo usuário
function todosOsLugares() {
  return [...LUGARES, ...sugestoes];
}

function buscarLugar(id) {
  return todosOsLugares().find((lugar) => lugar.id === id);
}

// Atualiza a tela inteira. Chamada após cada mudança.
function atualizar(idNovo = null) {
  const visiveis = regras.filtrarLugares(todosOsLugares(), {
    texto: campoBusca.value,
    categoria: categoriaAtual,
    soFavoritos: soFavoritos,
    favoritos: favoritos,
  });

  ui.renderizarCards(lista, vazio, visiveis, favoritos, idNovo);
  ui.atualizarResultado(resultado, visiveis.length);
  ui.marcarCategoria(botoesCategoria, categoriaAtual);
  botaoFavoritos.setAttribute('aria-pressed', String(soFavoritos));
}

// ---------- Busca e filtros ----------

// "input" dispara a cada letra digitada: a busca é instantânea
campoBusca.addEventListener('input', () => atualizar());

// Enter no campo de busca não recarrega a página
formBusca.addEventListener('submit', (evento) => evento.preventDefault());

botoesCategoria.forEach((botao) => {
  botao.addEventListener('click', () => {
    categoriaAtual = botao.dataset.categoria;
    atualizar();
  });
});

botaoFavoritos.addEventListener('click', () => {
  soFavoritos = !soFavoritos; // inverte: true vira false e vice-versa
  atualizar();
});

// ---------- Cliques nos cards (delegação de eventos) ----------
// Um único listener na <ul> trata os botões de todos os cards.
// "async" permite usar "await" para esperar a animação de saída.
lista.addEventListener('click', async (evento) => {
  const botao = evento.target.closest('[data-acao]');
  if (!botao) return;

  const id = botao.closest('li').dataset.id;
  const lugar = buscarLugar(id);

  if (botao.dataset.acao === 'detalhes') {
    botaoQueAbriu = botao;
    ui.abrirDetalhes(lugar);
  }

  if (botao.dataset.acao === 'favoritar') {
    const virouFavorito = !favoritos.includes(id);
    if (virouFavorito) {
      efeitos.confete(botao);
    }
    favoritos = regras.alternarFavorito(favoritos, id);
    armazenamento.salvarFavoritos(favoritos);
    atualizar();

    const mensagem = virouFavorito
      ? `${lugar.nome} adicionado aos favoritos.`
      : `${lugar.nome} removido dos favoritos.`;
    ui.anunciar(aviso, mensagem);
    efeitos.mostrarToast(virouFavorito ? 'Adicionado aos favoritos ♥' : 'Removido dos favoritos');

    // Mantém o foco no mesmo botão depois de redesenhar os cards
    lista.querySelector(`[data-id="${id}"] [data-acao="favoritar"]`)?.focus();
  }

  if (botao.dataset.acao === 'remover') {
    if (!confirm(`Remover "${lugar.nome}" do guia?`)) return;
    await efeitos.animarSaida(botao.closest('li')); // espera o card sumir
    sugestoes = sugestoes.filter((sugestao) => sugestao.id !== id);
    favoritos = favoritos.filter((favorito) => favorito !== id);
    armazenamento.salvarSugestoes(sugestoes);
    armazenamento.salvarFavoritos(favoritos);
    atualizar();
    ui.anunciar(aviso, `${lugar.nome} removido do guia.`);
    campoBusca.focus(); // o botão sumiu, então o foco vai para um lugar útil
  }
});

// ---------- Janela de detalhes ----------
botaoFechar.addEventListener('click', () => janela.close());

// Clicar no fundo escuro (fora do conteúdo) também fecha
janela.addEventListener('click', (evento) => {
  if (evento.target === janela) janela.close();
});

// Ao fechar (botão, Esc ou clique fora), o foco volta para o botão que abriu
janela.addEventListener('close', () => botaoQueAbriu?.focus());

// ---------- Formulário de sugestão ----------
formSugestao.addEventListener('submit', (evento) => {
  evento.preventDefault(); // impede o recarregamento da página

  // Monta um objeto com os valores digitados
  const dados = {
    nome: formSugestao.elements.nome.value,
    cidade: formSugestao.elements.cidade.value,
    categoria: formSugestao.elements.categoria.value,
    descricao: formSugestao.elements.descricao.value,
  };

  const erros = regras.validarSugestao(dados);
  ui.mostrarErros(formSugestao, erros);

  // Object.keys devolve a lista de campos com erro
  const camposComErro = Object.keys(erros);
  if (camposComErro.length > 0) {
    const primeiro = formSugestao.elements[camposComErro[0]];
    efeitos.tremer(primeiro);
    primeiro.focus(); // leva o usuário direto ao primeiro erro
    return;
  }

  const novo = regras.criarSugestao(dados);
  sugestoes.push(novo);
  armazenamento.salvarSugestoes(sugestoes);

  // Limpa filtros para o novo lugar aparecer na lista
  campoBusca.value = '';
  categoriaAtual = 'todas';
  soFavoritos = false;
  atualizar(novo.id);

  formSugestao.reset();
  ui.anunciar(aviso, `${novo.nome} adicionado ao guia.`);
  efeitos.mostrarToast('Lugar adicionado ao guia ✓');

  // Rola a tela até o card novo
  lista.querySelector(`[data-id="${novo.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// ---------- Tema claro/escuro ----------
botaoTema.addEventListener('click', () => {
  tema = tema === 'claro' ? 'escuro' : 'claro';
  ui.aplicarTema(botaoTema, tema);
  armazenamento.salvarTema(tema);
});

// ---------- Inicialização ----------
ui.aplicarTema(botaoTema, tema);
atualizar();
