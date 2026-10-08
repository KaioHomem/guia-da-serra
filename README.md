# Gerenciador de Tarefas

Gerenciador de tarefas acessível e responsivo, feito somente com **HTML, CSS e JavaScript puro** (sem frameworks e sem bibliotecas).

Projeto da **Avaliação 02 – Desenvolvimento Web** do **IFSC Câmpus Lages** (2026/2).

![Tela do Gerenciador de Tarefas](docs/screenshot.jpg)

## Funcionalidades

- Adicionar tarefas com prioridade (alta, média ou baixa)
- Marcar como concluída e remover tarefas
- Filtrar por todas, pendentes ou concluídas
- Contador de tarefas pendentes
- Ordenação automática por prioridade
- Tarefas salvas no navegador (`localStorage`): continuam lá depois de recarregar a página
- Tema claro e escuro
- Efeitos visuais: confete ao concluir, animação de entrada e saída, aviso flutuante

## Tecnologias

| Tecnologia | Uso |
|---|---|
| HTML5 | Estrutura semântica e atributos ARIA |
| CSS3 | Variáveis, Flexbox, Grid, media queries, animações |
| JavaScript (ES Modules) | Lógica, manipulação do DOM, eventos, Web Animations API |

## Como executar

O projeto usa módulos JavaScript (`import`/`export`). Por isso **não funciona abrindo o `index.html` com duplo clique**: o navegador bloqueia módulos em arquivos locais (`file://`). É preciso um servidor local.

**Opção 1 – VS Code:** instale a extensão *Live Server*, clique com o botão direito no `index.html` e escolha *Open with Live Server*.

**Opção 2 – Terminal (Python):**

```bash
python -m http.server 5500
```

Depois abra http://localhost:5500 no navegador.

## Estrutura do projeto

```
├── index.html            Estrutura da página
├── css/
│   └── style.css         Estilos, temas e responsividade
├── js/
│   ├── main.js           Ponto de entrada: eventos e estado da aplicação
│   ├── tarefas.js        Regras das tarefas (não mexe na tela)
│   ├── interface.js      Cria e atualiza os elementos na tela
│   ├── armazenamento.js  Salva e carrega no localStorage
│   └── efeitos.js        Animações e efeitos visuais
└── docs/
    ├── screenshot.jpg
    └── apresentacao.md   Roteiro da apresentação
```

Cada arquivo JavaScript é um **módulo** com uma responsabilidade só. Todos têm comentários em português explicando o código.

## Requisitos da avaliação

### Usabilidade e acessibilidade (WCAG)

- Link "Pular para o conteúdo principal", visível ao navegar com Tab
- Foco sempre visível (`:focus-visible`)
- Interface inteira utilizável só com teclado
- Todos os campos com `<label>`
- Mensagem de erro ligada ao campo (`aria-describedby` e `aria-invalid`)
- Região `aria-live`: o leitor de tela anuncia cada ação ("Tarefa adicionada")
- `aria-label` no botão de remover (ícone ✕) e `aria-pressed` nos filtros e no botão de tema
- Prioridade indicada por texto, não só por cor
- Botões com área mínima de 44px para toque
- Confirmação antes de remover várias tarefas
- Animações desligadas quando o sistema pede menos movimento (`prefers-reduced-motion`)

### HTML semântico

`header`, `main`, `section` com `aria-labelledby`, `nav`, `ul`/`li`, `form`, `label`, `footer`; títulos em ordem (`h1` > `h2`); `lang="pt-BR"`.

### Design responsivo

- Mobile-first: o CSS base é para celular
- `@media (min-width: 600px)`: formulário em uma linha
- `@media (min-width: 900px)`: duas colunas com CSS Grid
- Fontes em `rem`, respeitando o zoom do usuário

### JavaScript

- Variáveis (`const`, `let`) e operadores (`===`, `!`, ternário, spread `...`)
- Funções e arrow functions
- Objetos (cada tarefa é um objeto) e arrays (`map`, `filter`, `sort`, `find`, `some`)
- Módulos ES (`import` / `export`)
- Manipulação do DOM e delegação de eventos
- `localStorage` com JSON
- `async` / `await` e Promises nas animações

## Avaliação de acessibilidade

| Ferramenta / técnica | Resultado |
|---|---|
| axe-core 4.10 (motor da extensão axe DevTools) | 0 violações, 43 regras aprovadas (WCAG 2.0/2.1 A e AA) |
| Contraste – texto principal | 15.8:1 (claro) e 13.6:1 (escuro). Mínimo: 4.5:1 |
| Contraste – botão principal | 6.3:1 (claro) e 8.5:1 (escuro) |
| Contraste – bordas dos campos | Acima de 4.2:1. Mínimo: 3:1 (critério 1.4.11) |
| Teclado | Tab, Shift+Tab, Enter e Espaço funcionam em toda a interface |
| Responsivo | Testado em 375px (celular) e em desktop |

## Autor

**Kaio Homem** – [@KaioHomem](https://github.com/KaioHomem)

Instituto Federal de Santa Catarina – Câmpus Lages

## Licença

Distribuído sob a licença MIT. Veja o arquivo [LICENSE](LICENSE).
