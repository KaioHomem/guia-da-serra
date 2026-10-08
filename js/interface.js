// =============================================================
// interface.js – QUEM DESENHA NA TELA
// Cria e atualiza os elementos HTML (cards, janela, mensagens).
// Manipular a página pelo JavaScript se chama "manipular o DOM".
// =============================================================

// import = pega a variável CATEGORIAS que o dados.js exportou
import { CATEGORIAS } from './dados.js';

// -------------------------------------------------------------
// criarCard: monta o HTML de UM lugar.
// Resultado: <li> <article> foto + textos + botões </article> </li>
// "ehFavorito" é true ou false.
// -------------------------------------------------------------
function criarCard(lugar, ehFavorito) {
  // Pega o objeto da categoria, ex.: { nome: 'Natureza', icone: '🌲' }
  const categoria = CATEGORIAS[lugar.categoria];

  // document.createElement cria uma tag nova (ainda fora da tela)
  const item = document.createElement('li');
  item.dataset.id = lugar.id; // vira o atributo data-id="..." no HTML; usado para saber qual card foi clicado

  const card = document.createElement('article'); // <article> = conteúdo independente (semântico)
  card.className = 'card';                         // classe CSS do card
  // aria-labelledby: o leitor de tela usa o título do card como nome do <article>
  card.setAttribute('aria-labelledby', `titulo-${lugar.id}`);

  // ----- Foto -----
  if (lugar.imagem) {
    // O lugar tem foto: cria a <img>
    const img = document.createElement('img');
    img.className = 'card__imagem';
    img.src = lugar.imagem;  // caminho do arquivo da foto
    img.alt = lugar.alt;     // texto alternativo: descreve a foto para quem não enxerga
    img.loading = 'lazy';    // só baixa a foto quando ela chega perto da tela (mais rápido)
    img.width = 400;         // largura e altura evitam que a página "pule" ao carregar
    img.height = 260;
    card.appendChild(img);   // appendChild = coloca a foto dentro do card
  } else {
    // Lugar sugerido pelo usuário: não tem foto, mostra o ícone da categoria
    const semFoto = document.createElement('div');
    semFoto.className = 'card__sem-foto';
    semFoto.setAttribute('aria-hidden', 'true'); // só decoração: o leitor de tela ignora
    semFoto.textContent = categoria.icone;
    card.appendChild(semFoto);
  }

  // ----- Parte de texto do card -----
  const corpo = document.createElement('div');
  corpo.className = 'card__corpo';

  // Etiqueta da categoria (ex.: "Natureza")
  const etiqueta = document.createElement('p');
  etiqueta.className = `etiqueta etiqueta--${lugar.categoria}`; // `...${}` = template string, junta texto com variável
  etiqueta.textContent = categoria.nome;

  // Título do card
  const titulo = document.createElement('h3');
  titulo.id = `titulo-${lugar.id}`;    // id usado pelo aria-labelledby lá em cima
  titulo.className = 'card__titulo';
  titulo.textContent = lugar.nome;     // textContent coloca TEXTO puro (se alguém digitar <script>, não executa)

  // Cidade
  const cidade = document.createElement('p');
  cidade.className = 'card__cidade';
  cidade.textContent = `📍 ${lugar.cidade}`;

  // Resumo
  const resumo = document.createElement('p');
  resumo.className = 'card__resumo';
  resumo.textContent = lugar.resumo;

  // ----- Botões do card -----
  const acoes = document.createElement('div');
  acoes.className = 'card__acoes';

  // Botão "Ver detalhes"
  const botaoDetalhes = document.createElement('button');
  botaoDetalhes.type = 'button';
  botaoDetalhes.className = 'botao botao--primario';
  botaoDetalhes.dataset.acao = 'detalhes'; // data-acao="detalhes": o main.js usa isso para saber o que fazer
  // O <span class="sr-only"> é invisível na tela, mas o leitor de tela lê:
  // "Ver detalhes de Cascata do Avencal" (sem isso, todos os botões teriam o mesmo nome)
  botaoDetalhes.innerHTML = `Ver detalhes <span class="sr-only">de ${lugar.nome}</span>`;

  // Botão de favorito (coração)
  const botaoFavorito = document.createElement('button');
  botaoFavorito.type = 'button';
  botaoFavorito.className = 'botao-favorito';
  botaoFavorito.dataset.acao = 'favoritar';
  // aria-pressed="true/false": o leitor de tela diz se o botão está ligado ou desligado
  botaoFavorito.setAttribute('aria-pressed', String(ehFavorito));
  // aria-label: nome do botão para o leitor de tela (o coração sozinho não diz nada)
  botaoFavorito.setAttribute('aria-label', `Favoritar ${lugar.nome}`);
  // Ternário: se é favorito mostra coração cheio ♥, se não, coração vazio ♡
  botaoFavorito.innerHTML = `<span aria-hidden="true">${ehFavorito ? '♥' : '♡'}</span>`;

  // append = coloca os dois botões dentro da área de ações
  acoes.append(botaoDetalhes, botaoFavorito);

  // Só lugares sugeridos pelo usuário ganham o botão "Remover"
  if (lugar.sugerido) {
    const botaoRemover = document.createElement('button');
    botaoRemover.type = 'button';
    botaoRemover.className = 'botao botao--perigo';
    botaoRemover.dataset.acao = 'remover';
    botaoRemover.innerHTML = `Remover <span class="sr-only">${lugar.nome}</span>`;
    acoes.appendChild(botaoRemover);
  }

  // Monta tudo: textos e botões dentro do corpo, corpo dentro do card, card dentro do <li>
  corpo.append(etiqueta, titulo, cidade, resumo, acoes);
  card.appendChild(corpo);
  item.appendChild(card);
  return item; // devolve o <li> pronto
}

// -------------------------------------------------------------
// renderizarCards: apaga a lista e desenha todos os cards de novo.
// "idNovo" (opcional) = lugar recém-adicionado, que entra com animação.
// "= null" quer dizer: se ninguém mandar esse valor, ele vale null.
// -------------------------------------------------------------
export function renderizarCards(lista, vazio, lugares, favoritos, idNovo = null) {
  lista.innerHTML = ''; // apaga os cards antigos

  // forEach = "para cada lugar da lista, faça..."
  lugares.forEach((lugar) => {
    const card = criarCard(lugar, favoritos.includes(lugar.id)); // includes: é favorito?
    if (lugar.id === idNovo) {
      card.classList.add('card--novo'); // classe que ativa a animação de entrada no CSS
    }
    lista.appendChild(card); // coloca o card na tela
  });

  // Se não sobrou nenhum lugar, mostra "Nenhum lugar encontrado"
  vazio.hidden = lugares.length > 0;
}

// -------------------------------------------------------------
// atualizarResultado: escreve "9 lugares encontrados".
// Esse parágrafo tem aria-live, então o leitor de tela lê quando muda.
// -------------------------------------------------------------
export function atualizarResultado(elemento, quantidade) {
  // Ternário para singular/plural: 1 lugar / 2 lugares
  elemento.textContent =
    quantidade === 1 ? '1 lugar encontrado' : `${quantidade} lugares encontrados`;
}

// -------------------------------------------------------------
// marcarCategoria: liga o botão da categoria escolhida e desliga os outros.
// -------------------------------------------------------------
export function marcarCategoria(botoes, categoria) {
  botoes.forEach((botao) => {
    // Comparação dá true ou false; String() transforma em texto "true"/"false"
    botao.setAttribute('aria-pressed', String(botao.dataset.categoria === categoria));
  });
}

// -------------------------------------------------------------
// abrirDetalhes: preenche a janela <dialog> com as informações
// de um lugar e abre ela na tela.
// -------------------------------------------------------------
export function abrirDetalhes(lugar) {
  const categoria = CATEGORIAS[lugar.categoria];
  const figura = document.getElementById('detalhes-figura'); // getElementById = acha a tag pelo id

  // Preenche os textos da janela
  document.getElementById('detalhes-titulo').textContent = lugar.nome;
  document.getElementById('detalhes-cidade').textContent = lugar.cidade;
  document.getElementById('detalhes-categoria').textContent = categoria.nome;
  document.getElementById('detalhes-descricao').textContent = lugar.descricao;

  if (lugar.imagem) {
    figura.hidden = false; // mostra a área da foto
    const img = document.getElementById('detalhes-imagem');
    img.src = lugar.imagem;
    img.alt = lugar.alt;

    // Crédito da foto (a licença Creative Commons exige mostrar o autor)
    const credito = document.getElementById('detalhes-credito');
    credito.innerHTML = '';                    // limpa o crédito do lugar anterior
    const link = document.createElement('a');  // cria um link <a>
    link.href = lugar.credito.fonte;           // endereço da foto original
    link.textContent = `Foto: ${lugar.credito.autor} (${lugar.credito.licenca})`;
    credito.appendChild(link);
  } else {
    figura.hidden = true; // lugar sem foto: esconde a área da foto
  }

  // Link do Google Maps buscando "nome, cidade, SC".
  // encodeURIComponent troca espaços e acentos por códigos que funcionam em endereço de site.
  const busca = encodeURIComponent(`${lugar.nome}, ${lugar.cidade}, SC`);
  document.getElementById('detalhes-mapa').href =
    `https://www.google.com/maps/search/?api=1&query=${busca}`;

  // showModal abre a janela por cima da página, prende o foco dentro dela e deixa fechar com Esc
  document.getElementById('detalhes').showModal();
}

// -------------------------------------------------------------
// mostrarErros: escreve (ou apaga) as mensagens de erro do formulário.
// "erros" é o objeto que veio do validarSugestao.
// -------------------------------------------------------------
export function mostrarErros(form, erros) {
  // Repete o mesmo processo para os 3 campos obrigatórios
  ['nome', 'cidade', 'categoria'].forEach((campo) => {
    const elemento = form.elements[campo];  // pega o campo pelo atributo name
    const mensagem = erros[campo] || '';    // se não tem erro, usa texto vazio
    document.getElementById(`erro-${campo}`).textContent = mensagem;
    // aria-invalid="true" avisa o leitor de tela que o campo está errado (e o CSS pinta a borda de vermelho)
    elemento.setAttribute('aria-invalid', mensagem ? 'true' : 'false');
  });
}

// -------------------------------------------------------------
// anunciar: escreve uma mensagem na área invisível com aria-live.
// O leitor de tela fala a mensagem em voz alta (ex.: "Adicionado aos favoritos").
// -------------------------------------------------------------
export function anunciar(elemento, mensagem) {
  elemento.textContent = ''; // limpa primeiro
  // setTimeout = espera 50 milissegundos e depois executa.
  // Esse pequeno atraso faz o leitor perceber a mudança, mesmo se a mensagem for repetida.
  setTimeout(() => {
    elemento.textContent = mensagem;
  }, 50);
}

// -------------------------------------------------------------
// aplicarTema: troca entre tema claro e escuro.
// -------------------------------------------------------------
export function aplicarTema(botao, tema) {
  const escuro = tema === 'escuro';            // true se o tema é escuro
  document.documentElement.dataset.tema = tema; // coloca data-tema="..." no <html>; o CSS troca as cores
  botao.setAttribute('aria-pressed', String(escuro));
  botao.textContent = escuro ? 'Tema claro' : 'Tema escuro'; // texto do botão mostra a outra opção
}
