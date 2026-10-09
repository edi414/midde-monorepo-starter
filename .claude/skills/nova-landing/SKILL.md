---
name: nova-landing
description: Cria ou reescreve a landing page deste projeto, entrevistando a pessoa sobre o produto e escolhendo os blocos visuais certos para a prova que ela precisa dar. Use quando ela disser "/nova-landing", "criar minha landing", "quero uma landing page", "começar a página", "refazer a página", "mudar o conteúdo do site" ou "deixa a página mais bonita".
disable-model-invocation: true
---

# Nova landing page

Cria a página deste projeto. O resultado usa os tokens de `design-system/tokens.css` e os blocos de
`blocos/index.html`, e no modo Simples é um único `index.html` que abre com dois cliques.

Quem está do outro lado não sabe pedir em termos de front-end. Ela não vai dizer "quero um
mockup de dashboard com contadores animados". Ela vai dizer "quero que pareça sério" ou "quero
que tenha uns números se mexendo". Traduza isso você.

## Antes de começar

1. **Descubra o modo do projeto** (Simples ou Com build), conforme a tabela do `CLAUDE.md`. O
   conteúdo é o mesmo; muda onde os arquivos ficam e como se verifica.
2. **Veja se a identidade visual já foi configurada.** Se `design-system/tokens.css` ainda estiver
   com os valores provisórios em cinza, **pare e ofereça rodar `/design-system` antes**: construir
   a página primeiro e trocar a marca depois dá retrabalho, porque a escolha dos blocos muda
   conforme a marca é sóbria ou expressiva.

## Processo

1. **Entreviste antes de construir.** Use a skill `entrevista`. Não pule: uma pergunta que muda o
   que vai ser construído economiza uma reescrita inteira. O mínimo a saber:
   - O que é o produto ou serviço, em uma frase.
   - Para quem é, e o que essa pessoa já sabe sobre você.
   - **Qual é a única ação** que a página quer causar (mandar mensagem, preencher, agendar, ligar).
   - Como as pessoas chegam na página: link no WhatsApp, anúncio, você mostrando numa reunião. Se
     for link no WhatsApp aberto no celular, isso muda a ordem dos blocos, e muda agora, não depois.
   - 3 provas concretas. Peça exemplo real; se ela responder com adjetivo, pergunte "e o que
     aconteceu de verdade que mostra isso?".

2. **Escolha os blocos pela prova, não pela aparência.** Este é o passo que mais muda o resultado:

   | O que ela precisa provar | Bloco de `blocos/index.html` |
   |---|---|
   | Escala, volume, tempo economizado | `numeros-animados` |
   | Que existe um sistema funcionando | `painel` (com `status` e `ao-vivo` dentro) |
   | Que o atendimento resolve na conversa | `celular` |
   | Que algo roda de ponta a ponta sozinho | `fluxo` |
   | Três motivos para confiar | `cartoes` |
   | Comparação, antes contra depois | `tabela` |

   **Escolher o bloco errado para a afirmação é o erro mais comum e o mais visível.** Um mockup de
   conversa ao lado de uma afirmação sobre conferência de dados lê como enfeite solto, e derruba a
   credibilidade do resto da página.

   Não use um bloco só porque ele é bonito. Se não há prova para um bloco, não coloque o bloco.

3. **Escreva o conteúdo.** Frases curtas. Números sempre como numeral. **Zero emoji.** Nunca use
   travessão longo: prefira vírgula, dois-pontos ou parênteses, porque travessão longo é a marca
   mais visível de texto gerado por inteligência artificial. Nunca use "revolucionar", "disruptivo"
   ou superlativo vazio.

4. **Nunca invente prova.** Não escreva número de cliente, porcentagem, prêmio ou depoimento que a
   pessoa não deu. Se faltar prova para uma seção, pergunte ou tire a seção. Uma página com 3 provas
   reais funciona melhor que uma com 6, das quais 3 são inventadas e ela vai ter que sustentar
   depois numa reunião.

5. **Monte a página** copiando o HTML, o CSS e o JS dos blocos escolhidos. Use só `var(--token)`:
   nenhum hex, nenhuma fonte e nenhum raio escrito direto. O hook confere isso depois de você
   escrever e devolve o erro se escapar.

6. **Verifique de verdade, não por descrição.** Olhe a página em três larguras: 375px (celular),
   768px e 1440px. Confira que o console não tem erro. **Mande um screenshot.** Um screenshot a
   pessoa julga em dois segundos; uma lista do que você fez, não.

   Se as ferramentas `chrome-devtools` estiverem disponíveis (confira com `claude mcp list`), abra
   a própria página com elas: `navigate_page` para o `index.html` local, `resize_page` nas três
   larguras, `take_screenshot` em cada uma, e `list_console_messages` para conferir o erro. Isso
   substitui pedir para a pessoa abrir o arquivo, e funciona a cada mudança, não só no final.
   **Se não estiverem disponíveis, siga do jeito de sempre**: peça para abrir o `index.html` com
   dois cliques, sem servidor, e confira você mesmo pela descrição dela. Não trate a ausência da
   ferramenta como um problema a resolver.

7. **Faça o commit** com uma frase sobre o que mudou, e diga que o próximo passo é `/deploy`.

## Como falar sobre o que você fez

Siga `.claude/rules/RULES-conversa.md`. O resumo: uma ou duas frases por ação, no idioma dela, e
nunca mande ela rodar comando nenhum.

## Nunca faça

- Construir antes de entrevistar. "Faça uma landing bonita" sem contexto gera texto genérico, e
  genérico é o que não converte.
- Escrever cor, fonte ou raio direto na página, em vez de token.
- Usar um bloco animado sem prova por trás. Movimento sem conteúdo é o que faz parecer amador.
- Adicionar framework, `package.json`, backend, banco ou rota de API no modo Simples.
- Inventar dado, depoimento ou número.
- Dizer que está pronto sem ter aberto a página.

## Referência

- `blocos/index.html`, o catálogo. Abre com dois cliques e mostra tudo funcionando.
- `design-system/tokens.css`, as cores, fontes e formas.
- `CLAUDE.md`, os dois modos do projeto e a regra de movimento.
- `.claude/skills/entrevista/SKILL.md`, como perguntar sem virar formulário.
- `.claude/skills/preparar-ambiente/SKILL.md`, onde o Chrome DevTools MCP é configurado, se houver.
