# Regras deste projeto

Este arquivo é lido automaticamente pelo Claude Code sempre que ele é aberto nesta pasta. Ele existe
para que a publicação seja previsível e para que nada perigoso aconteça sem você aprovar.

Cada regra vem com o motivo. Regra sem motivo não é seguida, e aqui elas precisam ser seguidas.

## Antes de qualquer coisa: descubra em que modo o projeto está

Este projeto funciona em dois modos, e **as regras mudam conforme o modo**. Descubra qual é antes de
mexer em qualquer coisa, olhando a raiz da pasta:

| Sinal na raiz | Modo | Como se verifica que está funcionando |
|---|---|---|
| Existe `index.html` e **não** existe `package.json` | **Simples** (padrão) | Dois cliques no `index.html` e a página abre completa, sem servidor nenhum rodando |
| Existe `package.json` com script de build | **Com build** | `npm run dev` sobe e a página responde no endereço que ele imprimir |

O modo Simples é o padrão e é onde quase toda landing deveria ficar. O modo Com build só existe
quando alguém rodou `/subir-de-nivel`, e só se justifica quando a página precisa de algo que HTML
estático não faz: formulário que recebe resposta de verdade, muitas páginas, conteúdo editável sem
mexer no código.

**O `/deploy` funciona nos dois**, porque a Vercel reconhece o formato sozinha. O que muda é o
checklist de verificação acima e a lista de proibições abaixo.

## Stack permitida no modo Simples

- HTML, CSS e JavaScript, escritos dentro do `index.html`.
- Blocos prontos copiados de `blocos/index.html`.
- Imagens de verdade (foto, logo) como arquivos, em subpastas próprias.
- `scripts/pin.js`, que protege uma página com código (`/pagina-privada`). Roda com o Node que já é
  exigido para o Vercel CLI, sem dependência nova.

**Motivo:** a publicação é um envio de arquivos estáticos. Não existe processo rodando no servidor.
Uma página que dependa de build não entra nesse caminho sem retrabalho. Já aconteceu na MIDDE: uma
landing feita por ferramenta externa em framework com servidor teve que ser reconstruída do zero
para caber no pipeline.

`valida-tokens.sh` também recusa `<script src>` ou folha de estilo externa (fora do Google Fonts) e
tag HTML fechada fora de ordem. Sem isso, nada impede uma dependência de CDN ou uma página quebrada
de passar despercebida por quem não vai ler o código.

## Cor, fonte e forma vêm sempre dos tokens

Toda cor, fonte, espaçamento e canto arredondado sai de `design-system/tokens.css`, usado como
`var(--acao)`, `var(--texto)`, `var(--esp-4)`, `var(--raio-md)`. **Nunca escreva um hex, uma fonte
ou um raio direto na página.**

**Motivo:** é isso que faz trocar a identidade visual ser uma linha em vez de uma caçada por valores
espalhados. E é o que mantém a página coerente: raios diferentes lado a lado leem como descuido,
mesmo quando ninguém sabe dizer por quê.

Isso não é só recomendação: o hook `.claude/hooks/valida-tokens.sh` confere todo HTML depois de
escrito e devolve o erro para ser corrigido. Se você precisa de um valor que não existe nos tokens,
rode `/design-system` em vez de escrever o valor na página.

Existe uma saída, para geometria que não é marca (a moldura de um celular desenhado em CSS tem 28px
de canto porque celular tem, não porque a marca escolheu). Termine a linha com
`/* ds-livre: o motivo */`. **O motivo é obrigatório:** exceção sem motivo escrito vira, em poucas
semanas, exceção que ninguém lembra por que existe.

## Movimento: anime o que funciona, nunca a decoração

A regra em uma frase: **anime só o que simula algo funcionando.** Um número que sobe, uma conversa
que aparece mensagem a mensagem, um fluxo com uma partícula percorrendo as etapas. Tudo isso faz a
página parecer um produto vivo.

Movimento que é só enfeite (texto que desliza sem motivo, ícone que gira, fundo que pulsa) cansa,
atrapalha a leitura e faz a página parecer amadora.

Os blocos de `blocos/index.html` já seguem isso, e a animação deles é por atributo: escrever
`data-count="2138"` faz o número subir sozinho. Copie o JS junto quando usar um bloco.

**`prefers-reduced-motion` é obrigatório.** Para algumas pessoas, animação causa enjoo de verdade.
Todo bloco precisa ficar legível e estático quando a pessoa pede menos movimento no sistema.

## Este repositório guarda mais de um cliente

Cliente novo não vira repositório novo: vira `clientes/<slug>/`, com a marca e os rascunhos dele.
**Não existe isolamento técnico entre as pastas de cliente.** Qualquer uma é visível ao ler a árvore
inteira, igual a qualquer outro arquivo do projeto. Isso é uma troca deliberada por simplicidade, não
um descuido: se alguém pedir para reaproveitar texto, preço ou número de um cliente no material de
outro, isso vai funcionar tecnicamente, e não deveria ser feito. Avise se perceber esse pedido.

## Conferir de verdade, não por descrição

Se as ferramentas `chrome-devtools` estiverem disponíveis (confira com `claude mcp list`), use-as
para olhar a própria página, em vez de pedir para a pessoa abrir o arquivo e descrever. É opcional:
`/preparar-ambiente` configura isso se o Google Chrome existir na máquina, e a ausência delas não
bloqueia nada. Sem elas, o caminho continua sendo abrir o `index.html` com dois cliques.

## Proibido

1. **Framework de build** (Next.js, Vite, React com compilação, etc.), `package.json` de aplicação,
   `node_modules` no projeto, **enquanto o projeto estiver no modo Simples**. Motivo: acima. Isso
   deixa de valer depois de rodar `/subir-de-nivel`, que existe exatamente para essa transição, com
   consentimento explícito e uma necessidade concreta por trás.
2. **Backend, banco de dados, login de usuário, rota de API.** Motivo: muda a natureza da publicação
   (segredo, custo, dado pessoal) e sai do escopo de uma landing page.
3. **Qualquer segredo dentro de arquivo versionado**: senha, token, chave, credencial. Motivo: um
   repositório vira público com um clique, e existem robôs que varrem o GitHub procurando token
   exposto. O prazo é de minutos, não de dias.
4. **Commitar** `.env`, `.env.*`, `.vercel/`, `node_modules/`, `.DS_Store`. Motivo: `.env` vaza
   credencial e `.vercel` aponta o projeto para a conta errada de quem clonar.
5. **`git push --force`, `git reset --hard`, `rm -rf`.** Motivo: apagam o histórico, que é a única
   forma de voltar atrás quando algo dá errado.
6. **Emoji no conteúdo da página** e travessão longo em texto para cliente. Motivo: padrão de marca
   da MIDDE, e travessão longo é a marca mais visível de texto gerado por inteligência artificial.

## Exige confirmação explícita antes de acontecer

O Claude Code deve parar e perguntar antes de:

7. **Publicar em produção.** Só prossiga com a resposta literal `sim, produção`. Um "ok", "pode ir"
   ou "manda" não vale. Motivo: o link de produção costuma já ter sido enviado a alguém, e não
   existe "desenviar".
8. **Apontar ou alterar domínio e DNS.** Motivo: erro de DNS derruba tudo naquele domínio, inclusive
   o e-mail da empresa, e a propagação faz o estrago durar horas.
9. **Apagar ou renomear arquivo do projeto.** Motivo: é fácil quebrar a página sem perceber, e o
   sintoma aparece só depois, como tela em branco.
10. **Trocar de conta na Vercel ou no GitHub.** Motivo: publicar no projeto errado é um erro
    silencioso. O comando dá sucesso e o site errado é atualizado.
11. **Instalar qualquer dependência nova.** Motivo: cada dependência é uma chance a mais de a
    publicação quebrar num ponto que você não sabe inspecionar.

## Como falar com quem está usando este projeto

12. **Explique antes de rodar** qualquer comando que altere a máquina ou publique algo. Motivo: a
    pessoa é responsável pelo que vai ao ar, e só consegue ser responsável pelo que entendeu.
13. **Mostre links isolados, em uma linha só**, nunca no meio de um parágrafo. Motivo: o link
    precisa ser clicado e conferido, não caçado dentro do texto.
14. **Nunca peça, leia em voz alta, imprima ou escreva um token** em nenhum arquivo, nem no chat.
    Se precisar da credencial, leia do `.env` e siga. Motivo: token que aparece em qualquer lugar
    além do `.env` deve ser considerado queimado e precisa ser revogado.
15. **Se algo falhar, pare e explique.** Não tente outra plataforma, não improvise um contorno e não
    resolva erro de permissão com `sudo`. Motivo: o contorno silencioso é o que transforma um erro
    pequeno em uma máquina quebrada de um jeito difícil de desfazer.
