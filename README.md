# Sua landing page, do zero ao ar

Este repositório é o ponto de partida para você publicar, na internet, o que hoje sai como PDF ou
PPTX: uma landing page pública, ou uma apresentação para um cliente específico, protegida por
código. Usando o Claude Code. Você não precisa saber programar, e não precisa decorar comando
nenhum.

**Este repositório é seu, para a vida inteira.** Você cria ele **uma única vez** (guia 01). Cliente
novo não vira repositório novo: vira uma pasta nova dentro deste mesmo repositório, com
`/design-system` (guia 05) e `/pagina-privada` (guia 06). Isso significa que o Git e a Vercel também
são configurados **uma única vez**: depois disso, atender um cliente novo é só conversar com o
Claude Code, nunca mais mexer em GitHub ou em configuração de publicação.

O objetivo final é você digitar isto no Claude Code:

```
/deploy
```

e a sua página ir para o ar.

## Primeiro acesso: comece por aqui

Se a sua máquina ainda não tem nada instalado, siga os guias nesta ordem. Cada passo tem o comando,
o que deve aparecer na sua tela, e um texto pronto para colar no Claude Code.

1. [`guias/00-instalar-tudo.md`](guias/00-instalar-tudo.md), preparar a máquina.
2. [`guias/05-identidade-visual.md`](guias/05-identidade-visual.md), colocar as cores e a fonte da
   sua empresa. Faça antes de montar a página: mudar a identidade depois dá retrabalho.
3. [`guias/01-primeiro-deploy.md`](guias/01-primeiro-deploy.md), colocar a página no ar.

Depois que estiver no ar:

- [`guias/02-dns-cloudflare.md`](guias/02-dns-cloudflare.md), usar um endereço próprio no lugar do
  `.vercel.app`.
- [`guias/03-quando-quebra.md`](guias/03-quando-quebra.md), voltar atrás quando algo der errado.
- [`guias/04-seguranca-token.md`](guias/04-seguranca-token.md), o que a sua credencial permite, e o
  que nunca fazer com ela.
- [`guias/06-pagina-privada.md`](guias/06-pagina-privada.md), mandar uma apresentação só para um
  cliente, no lugar do PDF ou do PPTX.

## Os comandos

Digite no Claude Code, com a barra na frente:

| Comando | O que faz |
|---|---|
| `/preparar-ambiente` | Instala o que falta na sua máquina e confere se está tudo certo. |
| `/design-system` | Coloca as cores, a fonte e as formas da sua empresa no projeto. |
| `/nova-landing` | Cria a sua página, perguntando antes o que ela precisa fazer. |
| `/deploy` | Publica. Mostra uma prévia antes, e só vai ao ar com a sua confirmação. |
| `/pagina-privada` | Protege uma página com um código de 6 dígitos, para mandar só a um cliente. |
| `/atualizar` | Traz melhorias do modelo, sem tocar no que você escreveu. |
| `/subir-de-nivel` | Converte para Next.js, quando a página simples não der mais conta. |

## Blocos prontos

Abra [`blocos/index.html`](blocos/index.html) com dois cliques. É um catálogo vivo: cada bloco está
ali funcionando, animando de verdade.

Tem número que sobe sozinho, painel de sistema, conversa de WhatsApp que aparece mensagem a
mensagem, fluxo com uma partícula percorrendo as etapas, cartões e tabela.

Para usar um, peça: **"quero o bloco do celular com chat na minha página"**. O Claude Code copia e
adapta o conteúdo.

Cada bloco diz **para que prova ele serve**, e isso importa mais do que parece: um mockup de conversa
ao lado de uma afirmação sobre números lê como enfeite solto, e derruba a credibilidade do resto.

## Um cliente novo é uma pasta, não um repositório novo

Quando aparece um cliente novo, você não clona nada de novo. Diga ao Claude Code quem é o cliente, e
rode `/design-system`: ele cria `clientes/<nome-do-cliente>/`, com a marca daquele cliente dentro,
separada da sua. Cada cliente tem a identidade visual dele, mesmo todos morando no mesmo repositório.

## Uma apresentação só para um cliente, no lugar do PDF

Nem tudo que você monta aqui é para o mundo inteiro ver. Uma proposta comercial, um material que só
faz sentido para quem já está numa conversa: para isso existe `/pagina-privada`. Em vez de anexar um
PDF ou um PPTX no e-mail, você manda um link mais um código de 6 dígitos, por canais separados. A
pessoa abre, digita o código, e vê a página animada com a marca daquele cliente, endereçada a ela.

O link não tem o nome do cliente: `/pagina-privada` publica num endereço aleatório
(`seudominio.com/k7f3q9x2/`, por exemplo), e guarda em `clientes/<nome-do-cliente>/PAGINAS.md` qual
endereço é de qual apresentação, para você mesmo lembrar depois.

Não é um projeto à parte: é a mesma página, os mesmos blocos, o mesmo `/deploy`. Só muda a última
etapa, antes de mandar.

## O que tem aqui dentro

```
index.html              a sua página pública, com a sua marca. É este arquivo que vai para o ar.
design-system/          as cores, a fonte e as formas da SUA marca
clientes/<nome>/        um cliente seu: a marca dele e os rascunhos das apresentações dele
blocos/                 catálogo de blocos prontos, abre no navegador
guias/                  os passo a passo, na ordem de uso
scripts/pin.js          protege uma página com código, usado por /pagina-privada
CLAUDE.md               as regras do projeto, que o Claude Code lê sozinho
.env.example            modelo do arquivo de credencial (o de verdade nunca é enviado)
```

## Três regras que valem repetir

**Nunca coloque senha, token ou chave dentro de um arquivo do projeto.** A única exceção é o `.env`,
que fica só na sua máquina. O motivo está no [guia 04](guias/04-seguranca-token.md), e vale a leitura
de 2 minutos.

**Toda publicação passa por uma prévia antes de ir ao ar.** O `/deploy` mostra um link de teste,
espera você conferir, e só publica depois que você confirmar. O motivo é simples: o link de produção
costuma já ter sido enviado para alguém, e não existe "desenviar".

**Cor, fonte e forma saem sempre do `design-system/`.** Se você pedir uma cor diferente numa parte
da página, o Claude Code vai avisar e sugerir ajustar a identidade em vez de remendar. É isso que
mantém a página inteira parecendo uma coisa só.

## Travou?

É normal travar, principalmente na primeira vez. Cada guia tem um texto de diagnóstico no fim, feito
para você colar no Claude Code descrevendo onde parou. Se ainda assim não sair, chame o Edivaldo
mandando junto o comando que você rodou e o texto inteiro que apareceu na tela.
