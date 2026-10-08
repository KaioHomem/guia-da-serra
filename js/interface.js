// Módulo que manipula o DOM (cria e atualiza os elementos na tela).

import { CATEGORIAS } from './dados.js';

// Cria o card (<li> com <article>) de um lugar
function criarCard(lugar, ehFavorito) {
  const categoria = CATEGORIAS[lugar.categoria];

  const item = document.createElement('li');
  item.dataset.id = lugar.id;

  const card = document.createElement('article');
  card.className = 'card';
  // O título do card dá nome ao <article> para o leitor de tela
  card.setAttribute('aria-labelledby', `titulo-${lugar.id}`);

  // Foto (ou um quadro com ícone, quando o lugar foi sugerido e não tem foto)
  if (lugar.imagem) {
    const img = document.createElement('img');
    img.className = 'card__imagem';
    img.src = lugar.imagem;
    img.alt = lugar.alt; // texto alternativo: descreve a foto para quem não enxerga
    img.loading = 'lazy'; // só carrega a foto quando ela chega perto da tela
    img.width = 400;
    img.height = 260;
    card.appendChild(img);
  } else {
    const semFoto = document.createElement('div');
    semFoto.className = 'card__sem-foto';
    semFoto.setAttribute('aria-hidden', 'true'); // decorativo
    semFoto.textContent = categoria.icone;
    card.appendChild(semFoto);
  }

  const corpo = document.createElement('div');
  corpo.className = 'card__corpo';

  const etiqueta = document.createElement('p');
  etiqueta.className = `etiqueta etiqueta--${lugar.categoria}`;
  etiqueta.textContent = categoria.nome;

  const titulo = document.createElement('h3');
  titulo.id = `titulo-${lugar.id}`;
  titulo.className = 'card__titulo';
  titulo.textContent = lugar.nome; // textContent evita injeção de HTML

  const cidade = document.createElement('p');
  cidade.className = 'card__cidade';
  cidade.textContent = `📍 ${lugar.cidade}`;

  const resumo = document.createElement('p');
  resumo.className = 'card__resumo';
  resumo.textContent = lugar.resumo;

  // Botões do card
  const acoes = document.createElement('div');
  acoes.className = 'card__acoes';

  const botaoDetalhes = document.createElement('button');
  botaoDetalhes.type = 'button';
  botaoDetalhes.className = 'botao botao--primario';
  botaoDetalhes.dataset.acao = 'detalhes';
  botaoDetalhes.innerHTML = `Ver detalhes <span class="sr-only">de ${lugar.nome}</span>`;

  // Botão de favorito: aria-pressed diz se está marcado
  const botaoFavorito = document.createElement('button');
  botaoFavorito.type = 'button';
  botaoFavorito.className = 'botao-favorito';
  botaoFavorito.dataset.acao = 'favoritar';
  botaoFavorito.setAttribute('aria-pressed', String(ehFavorito));
  botaoFavorito.setAttribute('aria-label', `Favoritar ${lugar.nome}`);
  botaoFavorito.innerHTML = `<span aria-hidden="true">${ehFavorito ? '♥' : '♡'}</span>`;

  acoes.append(botaoDetalhes, botaoFavorito);

  // Lugares sugeridos pelo usuário podem ser removidos
  if (lugar.sugerido) {
    const botaoRemover = document.createElement('button');
    botaoRemover.type = 'button';
    botaoRemover.className = 'botao botao--perigo';
    botaoRemover.dataset.acao = 'remover';
    botaoRemover.innerHTML = `Remover <span class="sr-only">${lugar.nome}</span>`;
    acoes.appendChild(botaoRemover);
  }

  corpo.append(etiqueta, titulo, cidade, resumo, acoes);
  card.appendChild(corpo);
  item.appendChild(card);
  return item;
}

// Redesenha todos os cards a partir do array de lugares.
// idNovo (opcional): lugar recém-adicionado, que entra com animação.
export function renderizarCards(lista, vazio, lugares, favoritos, idNovo = null) {
  lista.innerHTML = '';
  lugares.forEach((lugar) => {
    const card = criarCard(lugar, favoritos.includes(lugar.id));
    if (lugar.id === idNovo) {
      card.classList.add('card--novo');
    }
    lista.appendChild(card);
  });
  vazio.hidden = lugares.length > 0;
}

export function atualizarResultado(elemento, quantidade) {
  // Operador ternário para singular/plural
  elemento.textContent =
    quantidade === 1 ? '1 lugar encontrado' : `${quantidade} lugares encontrados`;
}

// Marca qual botão de categoria está ativo
export function marcarCategoria(botoes, categoria) {
  botoes.forEach((botao) => {
    botao.setAttribute('aria-pressed', String(botao.dataset.categoria === categoria));
  });
}

// Preenche e abre a janela de detalhes
export function abrirDetalhes(lugar) {
  const categoria = CATEGORIAS[lugar.categoria];
  const figura = document.getElementById('detalhes-figura');

  document.getElementById('detalhes-titulo').textContent = lugar.nome;
  document.getElementById('detalhes-cidade').textContent = lugar.cidade;
  document.getElementById('detalhes-categoria').textContent = categoria.nome;
  document.getElementById('detalhes-descricao').textContent = lugar.descricao;

  if (lugar.imagem) {
    figura.hidden = false;
    const img = document.getElementById('detalhes-imagem');
    img.src = lugar.imagem;
    img.alt = lugar.alt;
    // Crédito da foto, exigido pela licença Creative Commons
    const credito = document.getElementById('detalhes-credito');
    credito.innerHTML = '';
    const link = document.createElement('a');
    link.href = lugar.credito.fonte;
    link.textContent = `Foto: ${lugar.credito.autor} (${lugar.credito.licenca})`;
    credito.appendChild(link);
  } else {
    figura.hidden = true;
  }

  // Link para o Google Maps buscando o nome + cidade
  const busca = encodeURIComponent(`${lugar.nome}, ${lugar.cidade}, SC`);
  document.getElementById('detalhes-mapa').href =
    `https://www.google.com/maps/search/?api=1&query=${busca}`;

  document.getElementById('detalhes').showModal();
}

// Mostra ou limpa as mensagens de erro do formulário
export function mostrarErros(form, erros) {
  ['nome', 'cidade', 'categoria'].forEach((campo) => {
    const elemento = form.elements[campo];
    const mensagem = erros[campo] || '';
    document.getElementById(`erro-${campo}`).textContent = mensagem;
    elemento.setAttribute('aria-invalid', mensagem ? 'true' : 'false');
  });
}

// Escreve na região aria-live para o leitor de tela anunciar
export function anunciar(elemento, mensagem) {
  elemento.textContent = '';
  // pequeno atraso garante que o leitor perceba a mudança
  setTimeout(() => {
    elemento.textContent = mensagem;
  }, 50);
}

export function aplicarTema(botao, tema) {
  const escuro = tema === 'escuro';
  document.documentElement.dataset.tema = tema;
  botao.setAttribute('aria-pressed', String(escuro));
  botao.textContent = escuro ? 'Tema claro' : 'Tema escuro';
}
