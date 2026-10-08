// Módulo com os dados dos lugares.
// Cada lugar é um OBJETO, e todos ficam guardados num ARRAY.
// Fotos: Wikimedia Commons (licenças livres, créditos no campo "credito").

export const CATEGORIAS = {
  natureza: { nome: 'Natureza', icone: '🌲' },
  historia: { nome: 'História', icone: '🏛️' },
  gastronomia: { nome: 'Gastronomia', icone: '🍷' },
  cultura: { nome: 'Cultura e lazer', icone: '🎉' },
};

export const LUGARES = [
  {
    id: 'catedral',
    nome: 'Catedral Diocesana de Lages',
    cidade: 'Lages',
    categoria: 'historia',
    resumo: 'Igreja de pedra com duas torres, cartão-postal do centro da cidade.',
    descricao:
      'A Catedral Diocesana Nossa Senhora dos Prazeres fica no centro de Lages. Construída em pedra, tem duas torres altas e uma grande rosácea na fachada. É um dos pontos mais fotografados da cidade.',
    imagem: 'img/catedral.jpg',
    alt: 'Fachada de pedra da catedral, com duas torres pontudas e uma rosácea redonda acima da porta.',
    credito: { autor: 'Filipeschaves', licenca: 'CC BY-SA 4.0', fonte: 'https://commons.wikimedia.org/wiki/File:Catedral_Diocesana_de_Lages.jpg' },
  },
  {
    id: 'convento',
    nome: 'Convento Franciscano São José',
    cidade: 'Lages',
    categoria: 'historia',
    resumo: 'Prédio histórico de tijolos à vista, ligado aos frades franciscanos.',
    descricao:
      'Construção histórica de tijolos à vista ligada à presença dos frades franciscanos em Lages. Na frente há uma estátua de São Francisco de Assis com pombas nos braços.',
    imagem: 'img/convento.jpg',
    alt: 'Prédio de tijolos vermelhos com rosácea, porta em arco e estátua de São Francisco com pombas nos braços.',
    credito: { autor: 'Dee Becker', licenca: 'CC BY-SA 4.0', fonte: 'https://commons.wikimedia.org/wiki/File:Convento_Franciscano_S%C3%A3o_Jos%C3%A9_-_LAGES.jpg' },
  },
  {
    id: 'coxilha-rica',
    nome: 'Coxilha Rica',
    cidade: 'Lages',
    categoria: 'natureza',
    resumo: 'Campos de altitude, araucárias e os antigos caminhos dos tropeiros.',
    descricao:
      'Região rural de Lages com campos nativos e matas de araucária. Guarda marcas do tropeirismo, como os antigos caminhos das tropas e muros de pedra (taipas). Na foto aparece o viaduto ferroviário sobre o Rio Tatetos.',
    imagem: 'img/coxilha-rica.jpg',
    alt: 'Campos verdes e dourados com araucárias, um viaduto ferroviário ao fundo e céu azul com nuvens.',
    credito: { autor: 'Gibbneckel', licenca: 'CC BY-SA 4.0', fonte: 'https://commons.wikimedia.org/wiki/File:Vista_da_Coxilha_Rica,_com_destaque_para_o_Viaduto_Ferrovi%C3%A1rio_Rio_Tatetos_(02-05-2020).jpg' },
  },
  {
    id: 'pinhao',
    nome: 'Festa Nacional do Pinhão',
    cidade: 'Lages',
    categoria: 'gastronomia',
    resumo: 'A grande festa de inverno de Lages, com pratos feitos de pinhão.',
    descricao:
      'Festa tradicional de Lages realizada no inverno, época de colheita do pinhão, a semente da araucária. Tem shows, cultura gaúcha e comidas típicas como paçoca de pinhão e pinhão sapecado.',
    imagem: 'img/pinhao.jpg',
    alt: 'Pinha de araucária verde em cima de uma caixa de madeira cheia de pinhões marrons.',
    credito: { autor: 'Marcelo Träsel', licenca: 'CC BY-SA 2.0', fonte: 'https://commons.wikimedia.org/wiki/File:Pinh%C3%A3o_(Garfada).jpg' },
  },
  {
    id: 'tio-vida',
    nome: 'Estádio Vidal Ramos Júnior (Tio Vida)',
    cidade: 'Lages',
    categoria: 'cultura',
    resumo: 'Casa do Internacional de Lages, o estádio de futebol da cidade.',
    descricao:
      'Conhecido como Tio Vida, é o estádio do Esporte Clube Internacional, o Inter de Lages. Em dia de jogo, a torcida colorada lota as arquibancadas vermelhas.',
    imagem: 'img/tio-vida.jpg',
    alt: 'Gramado do estádio com arquibancada vermelha e torre de iluminação contra um pôr do sol alaranjado.',
    credito: { autor: 'Inter de Lages', licenca: 'CC BY 2.0', fonte: 'https://commons.wikimedia.org/wiki/File:3_7_2021_-_Entardecer_no_Tio_Vida_(51330130575).jpg' },
  },
  {
    id: 'rio-do-rastro',
    nome: 'Serra do Rio do Rastro',
    cidade: 'Bom Jardim da Serra',
    categoria: 'natureza',
    resumo: 'Estrada cheia de curvas descendo a serra, com mirante no topo.',
    descricao:
      'A rodovia SC-390 desce a serra em dezenas de curvas fechadas, ligando Bom Jardim da Serra a Lauro Müller. Do mirante no alto dá para ver a estrada serpenteando entre os paredões.',
    imagem: 'img/rio-do-rastro.jpg',
    alt: 'Vista do alto de montanhas verdes com uma estrada estreita fazendo curvas em zigue-zague no vale.',
    credito: { autor: 'Fernandokaiserbr', licenca: 'CC BY-SA 4.0', fonte: 'https://commons.wikimedia.org/wiki/File:Serra_do_Rio_do_Rastro_2019.jpg' },
  },
  {
    id: 'morro-da-igreja',
    nome: 'Morro da Igreja e Pedra Furada',
    cidade: 'Urubici',
    categoria: 'natureza',
    resumo: 'Um dos pontos mais altos do Sul, com vista para a Pedra Furada.',
    descricao:
      'Fica no Parque Nacional de São Joaquim, a mais de 1.800 metros de altitude. Do alto se vê a Pedra Furada, uma rocha com um buraco natural no meio. No inverno é um dos lugares mais frios do Brasil.',
    imagem: 'img/morro-da-igreja.jpg',
    alt: 'Formação de rocha cinza com um buraco no meio, no topo de um paredão coberto de mata.',
    credito: { autor: 'AlexandreMachado', licenca: 'CC BY-SA 4.0', fonte: 'https://commons.wikimedia.org/wiki/File:Morro_da_Igreja_-_Pedra_Furada_-_Zoom.jpg' },
  },
  {
    id: 'avencal',
    nome: 'Cascata do Avencal',
    cidade: 'Urubici',
    categoria: 'natureza',
    resumo: 'Cachoeira de cerca de 100 metros caindo entre paredões de pedra.',
    descricao:
      'Uma das cachoeiras mais conhecidas da Serra Catarinense. A água cai de uma altura de cerca de 100 metros, cercada por paredões de rocha e mata nativa.',
    imagem: 'img/avencal.jpg',
    alt: 'Cachoeira alta e fina caindo de um paredão de rocha, com árvores e mata na parte de baixo.',
    credito: { autor: 'Elaine Alessio', licenca: 'CC BY-SA 4.0', fonte: 'https://commons.wikimedia.org/wiki/File:Cascata_do_Avencal-_Urubici-_SC_01.jpg' },
  },
  {
    id: 'vinhedos',
    nome: 'Vinhedos de altitude',
    cidade: 'São Joaquim e região',
    categoria: 'gastronomia',
    resumo: 'Vinícolas no frio da serra, famosas pelos vinhos de altitude.',
    descricao:
      'O clima frio e a altitude da Serra Catarinense favorecem o cultivo de uvas para os chamados vinhos de altitude. Várias vinícolas da região recebem visitantes para passeios e degustações.',
    imagem: 'img/vinhedos.jpg',
    alt: 'Fileiras de parreiras cobertas por telas de proteção, com um corredor de grama no meio.',
    credito: { autor: 'Elaine Alessio', licenca: 'CC BY-SA 4.0', fonte: 'https://commons.wikimedia.org/wiki/File:Vinhedos_da_Serra_Catarinense_01.jpg' },
  },
];
