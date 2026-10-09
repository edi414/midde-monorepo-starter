---
name: design-system
description: Configura a identidade visual da sua própria empresa (na primeira vez) ou de um cliente seu (nas vezes seguintes): lê o que a pessoa tiver (guia de identidade em HTML, site no ar, print da logo) ou pergunta o que faltar, e preenche um tokens.css com as cores, a fonte e as formas da marca. Use quando ela disser "/design-system", "configurar a identidade visual", "usar as cores da minha empresa", "tenho um cliente novo", "colocar a marca certa", "tenho o manual da marca aqui", ou quando perceber que um tokens.css ainda está com os valores provisórios em cinza.
disable-model-invocation: true
---

# Configurar a identidade visual

Preenche um `tokens.css` com a marca real de uma empresa. Enquanto isso não roda, essa marca está
em tons de cinza provisórios, e toda página daquela marca sai sem identidade.

Este repositório guarda mais de uma marca: a **sua**, na raiz (`design-system/`, usada pelo seu
`index.html`), e a de cada **cliente seu**, dentro de `clientes/<nome-do-cliente>/design-system/`.
A primeira coisa que esta skill decide é qual das duas é a vez agora.

A pessoa do outro lado provavelmente não sabe dizer "escala de cor" nem "peso tipográfico". Ela
sabe qual é a cor da empresa (a dela, ou a do cliente dela), e talvez tenha um arquivo. Trabalhe a
partir disso.

## Regras da conversa

Valem aqui e não são negociáveis:

1. **Uma pergunta por vez.** Nunca um bloco de cinco.
2. **Toda pergunta carrega a sua recomendação.** "Vi laranja e azul-marinho no seu guia. Vou usar
   o laranja como cor de botão, porque ele aparece nos destaques. Prefere o contrário?" Pergunta
   sem recomendação devolve o trabalho para quem menos consegue fazê-lo.
3. **Nunca pergunte o que você mesmo pode descobrir.** Se o arquivo tem a cor, leia o arquivo.
4. **Pare em 5 perguntas.** Se faltar informação, decida você, diga em uma frase o que decidiu, e
   siga. Dá para ajustar depois; travar a pessoa numa entrevista, não.

## Processo

1. **Decida o alvo.** Olhe `design-system/tokens.css` na raiz:
   - Se ele ainda está provisório (comentários "PROVISÓRIO"), **é a primeira vez**: o alvo é a sua
     própria marca, na raiz. Não pergunte, é óbvio pelo estado do projeto.
   - Se ele já está preenchido, a raiz já tem dono. Pergunte: "Isso é a identidade da sua própria
     empresa, ou de um cliente seu?" Se for cliente, o alvo vira `clientes/<slug>/design-system/`
     (crie a pasta se não existir), nunca a raiz.

   Chame o alvo de **"raiz"** ou de **"pasta do cliente"** no resto deste processo.

2. **Se o alvo é um cliente, descubra o nome dele**, se ainda não estiver óbvio pelo material que
   ela mandar (um guia de identidade quase sempre tem o nome da empresa na capa ou no rodapé:
   extraia dali antes de perguntar). Derive um slug curto do nome (`padaria-sol`, `estudio-ene`) para o nome da
   pasta. Isso vira o primeiro fato do `IDENTIDADE.md` do cliente, no passo 6: é o que faz o resto
   do projeto (`/pagina-privada`, por exemplo) saber de quem é aquela pasta, sem ter que perguntar
   de novo numa conversa futura que não tem memória desta.

3. **Descubra o que ela tem.** Pergunte uma coisa só: "Você tem algum material da marca? Pode ser
   um manual de identidade, o link do site de vocês, ou até um print da logo. Se não tiver nada à
   mão, também resolvo perguntando."

4. **Extraia o máximo antes de perguntar qualquer coisa**, conforme o que ela mandar:

   | O que ela mandou | O que fazer |
   |---|---|
   | HTML de guia de identidade | **Não leia o arquivo inteiro**: um guia de identidade costuma passar de 200 KB e quase tudo é exemplo visual. Busque dentro dele, nesta ordem: o bloco `:root` (a paleta inteira em variáveis CSS, o caso mais rico), `font-family`, o `<link>` ou `@import` da fonte, e os `border-radius`. Só leia trechos maiores se a busca não achar nada. |
   | HTML de site, ou uma URL no ar | Leia o CSS embutido e os hex mais frequentes. Cor de fundo, cor de texto e cor de botão costumam ser as três mais repetidas. Confirme com ela antes de assumir. |
   | Imagem (print, logo, foto do manual) | Leia a imagem e descreva as cores que vê. **Não invente hex exato a partir de imagem**: proponha um valor aproximado e diga que é aproximado, pedindo o código exato se ela tiver. |
   | Nada | Vá para o passo 5 direto. |

5. **Pergunte só o que faltou**, na ordem de importância. Pare assim que tiver o suficiente:
   - A cor principal da marca (a que vai no botão).
   - A fonte, se houver uma da marca. Se ela não souber, use a do sistema e diga que usou.
   - Se a marca é mais "quadrada e sóbria" ou "arredondada e leve". Isso define o raio dos cantos,
     e é uma pergunta que ela consegue responder, diferente de "qual border-radius você quer".

6. **Escreva `tokens.css` no alvo decidido no passo 1** (raiz ou `clientes/<slug>/design-system/`).
   Se o alvo é uma pasta de cliente que ainda não existe, crie-a agora, copiando a estrutura do
   `design-system/tokens.css` da raiz como ponto de partida. Mantenha a estrutura do arquivo
   intacta: primitivos, semânticos, forma e espaço, tipografia, papéis de texto. Troque só os
   valores.
   - **Gere a escala inteira a partir da cor principal** (50 a 950), clareando e escurecendo. Não
     deixe degraus faltando: a página usa vários.
   - Se ela deu só uma cor, derive os neutros dela com uma pitada do matiz da marca, em vez de
     cinza puro. Cinza puro ao lado de uma marca colorida parece descuido.
   - **Apague os comentários de "PROVISÓRIO"** das linhas que você preencheu. Deixá-los faz a
     pessoa achar que o comando não rodou.
   - Se a fonte for do Google Fonts e o alvo for a raiz, acrescente o `<link>` no `index.html` e
     ponha um fallback real na pilha (`'Figtree', system-ui, sans-serif`), nunca a fonte sozinha. Se
     o alvo for um cliente, isso entra na página daquele cliente quando ela for escrita, não aqui.

7. **Escreva `IDENTIDADE.md` no mesmo alvo** (`design-system/IDENTIDADE.md` na raiz, ou
   `clientes/<slug>/IDENTIDADE.md`). A primeira linha, quando o alvo é um cliente, é sempre
   `Cliente: <nome>`. Depois disso, registre para cada valor: qual é, e **de onde veio** (extraído
   do arquivo X / informado por ela / derivado por você). Isso é o que evita a pergunta "de onde
   saiu esse laranja?" três semanas depois, sem ninguém saber responder.

8. **Mostre o resultado, não descreva.** Se o alvo é a raiz, abra o `index.html` no navegador e
   tire um screenshot. Se o alvo é um cliente, mostre a paleta e a fonte escolhidas (ainda não há
   página daquele cliente para abrir, a menos que já exista uma em `clientes/<slug>/privado/`). Um
   screenshot ela julga em dois segundos; uma lista de hex, não. Pergunte se está com a cara da
   marca, e ajuste o que ela apontar.

## Nunca faça

- **Inventar cor que ninguém deu.** Se não sabe, pergunte ou use o cinza provisório e diga que
  ficou provisório.
- **Afirmar hex exato tirado de imagem.** Print tem compressão e a tela altera a cor. Diga que é
  aproximado e peça o código se ela tiver.
- **Quebrar a estrutura do `tokens.css`.** Trocar valor, sim. Reorganizar ou remover camada, não:
  o resto do projeto depende dos nomes semânticos.
- **Espalhar hex pela página.** Toda cor entra aqui e é usada como `var(--acao)`. Se você se pegar
  escrevendo `#FF7C25` dentro do `index.html`, pare: é sinal de que falta um token.
- **Trocar a marca por conta própria depois.** Se a pessoa pedir "deixa esse botão verde", pergunte
  antes se é para mudar a marca inteira ou só ali. Cor de marca é decisão de marca, não de estilo.

## Referência

- `design-system/tokens.css`, a marca do próprio aluno, com a estrutura comentada.
- `clientes/<slug>/design-system/tokens.css`, a marca de um cliente, mesma estrutura.
- `design-system/IDENTIDADE.md` e `clientes/<slug>/IDENTIDADE.md`, o registro de onde veio cada valor.
- `guias/05-identidade-visual.md`, a versão para a pessoa ler sozinha.
