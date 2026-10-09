# Guia 01: colocar a página no ar

Este guia assume que a sua máquina já passou pelo [guia 00](00-instalar-tudo.md) e que os cinco
comandos de versão respondem.

No fim dele, você vai ter um link público funcionando, gerado por você.

> **Os passos 1, 2 e 3 só acontecem uma vez, para sempre.** Você não vai repeti-los quando pegar um
> cliente novo: cliente novo vira uma pasta dentro deste mesmo repositório (`/design-system`,
> `/pagina-privada`), não um repositório novo nem um projeto novo na Vercel. Depois de hoje, publicar
> para um cliente novo é só conversar com o Claude Code.

---

## Passo 1: pegar o seu repositório (uma vez, para sempre)

Você não clona o repositório da MIDDE: você cria **o seu**, a partir dele. Faz isso agora, e nunca
mais: não existe um repositório novo por cliente neste modelo.

1. Abra o repositório modelo no navegador (o Edivaldo te manda o link).
2. Clique no botão verde **Use this template**, e depois em **Create a new repository**.
3. Dê um nome (por exemplo `minha-landing`), escolha **Private**, e clique em **Create repository**.

O repositório que nasce é **seu**, na sua conta, desde o primeiro commit. Ele não fica ligado ao da
MIDDE, e ninguém de fora tem acesso a ele.

**Prompt para colar no Claude Code, para trazer ele para a sua máquina:**

> Clone o meu repositório do GitHub para a pasta atual usando o GitHub CLI. Meu usuário é
> [seu-usuario] e o repositório se chama [nome-do-repo]. Depois de clonar, entre na pasta, me mostre
> os arquivos que vieram, e confirme que existe um `index.html` e uma pasta `guias`.

**O que você deve ver na tela:**

```
Cloning into 'minha-landing'...
remote: Enumerating objects: 24, done.
remote: Counting objects: 100% (24/24), done.
Receiving objects: 100% (24/24), done.
```

A partir daqui, **abra o Claude Code dentro dessa pasta**:

```bash
cd minha-landing
claude
```

---

## Passo 2: colocar a credencial no lugar (uma vez, para sempre)

O Edivaldo te envia um token da Vercel por um canal separado do link do repositório. Ele é o único
token que você vai usar, para todos os seus clientes: não tem um token por cliente neste modelo.

**Antes de colar, leia [`04-seguranca-token.md`](04-seguranca-token.md).** São 2 minutos, e evita o
erro mais caro deste material.

**Prompt para colar no Claude Code:**

> Crie o arquivo de credencial deste projeto copiando o modelo: rode `cp .env.example .env`. Depois
> me diga para eu abrir o `.env` num editor e colar o token que recebi, e confirme para mim que o
> `.env` já está no `.gitignore` e portanto nunca vai para o GitHub. Não me peça o valor do token
> aqui no chat, e não tente ler o conteúdo do `.env`.

Abra o `.env` no editor que preferir e cole o valor depois de `VERCEL_TOKEN=`, sem aspas e sem
espaço. Salve e feche.

> **Por que o Claude Code não lê esse arquivo:** ele está bloqueado de propósito nas configurações do
> projeto. Assim o token nunca entra na conversa. O efeito colateral é que, se você errar ao colar,
> ele não consegue te dizer o que está errado no arquivo. Confira você mesmo: uma linha só, começando
> com `VERCEL_TOKEN=`.

---

## Passo 3: vincular ao projeto da Vercel (uma vez, para sempre)

Dois caminhos, dependendo do que o Edivaldo te passou junto com o token:

- **Se ele já te deu o nome de um projeto**, esta pasta só precisa apontar para ele.
- **Se ele não te deu nome nenhum**, o Claude Code cria o projeto para você agora, nesta etapa. É
  o único projeto que você vai ter: todo cliente futuro publica dentro dele, como uma pasta a mais,
  não como projeto novo.

**Prompt para colar no Claude Code:**

> Vincule esta pasta a um projeto na Vercel. Carregue a credencial do `.env` por shell, sem ler o
> arquivo nem imprimir o valor. Se o Edivaldo já me passou o nome de um projeto, use
> `vercel link --project [nome-do-projeto] --yes`. Se eu não te disse nenhum nome, crie o projeto
> agora com `vercel link --yes`, sem `--project`. Depois confirme com `vercel whoami` e me diga a
> qual projeto esta pasta ficou ligada.

**O que você deve ver na tela** (o nome muda conforme o caso):

```
Vercel CLI 59.16.0
vercel link --yes
✅  Linked to sua-conta/minha-landing (created .vercel)
```

> **Por que isso só acontece uma vez.** A partir de agora, `.vercel/project.json` guarda o vínculo
> desta pasta com aquele projeto. O Claude Code nunca cria um segundo projeto depois disso: ele
> confere esse arquivo antes de decidir.

> **Nunca deixe criar um projeto novo depois que já existe um vínculo.** Se criar, você acaba com
> dois projetos, e o link que já foi enviado para alguém continua no ar apontando para a versão
> velha, sem ninguém perceber.

---

## Passo 4: ajustar o conteúdo da página

O `index.html` que veio é um exemplo. Troque pelo seu conteúdo.

**Prompt para colar no Claude Code:**

> Quero mudar o conteúdo da minha landing page. Use a skill `/nova-landing`: me pergunte o que
> é o produto, para quem é, qual a ação que a pessoa deve tomar, e 3 motivos concretos para ela
> acreditar. Depois confirme comigo o que entendeu antes de escrever a página.

Quando terminar, abra o `index.html` com dois cliques e confira no navegador. **Sem servidor
rodando.** Se abrir assim e estiver completo, está no formato certo.

---

## Passo 5: publicar

Agora o motivo de tudo isso. Digite no Claude Code:

```
/deploy
```

Não digite mais nada. Ele conduz o resto.

**O que vai acontecer, nesta ordem:**

1. Ele confere o que mudou e avisa se algo que não deveria ir junto apareceu.
2. Publica uma **prévia** e mostra um link.
3. **Para e espera você conferir.** Abra o link, olhe a página.
4. Pergunta se pode publicar em produção. Responda exatamente `sim, produção`.
5. Publica de verdade e mostra o link final.

**O que você deve ver na tela**, na etapa da prévia:

```
🔍  Inspect: https://vercel.com/sua-conta/minha-landing/ABC123 [2s]
✅  Preview: https://minha-landing-abc123.vercel.app [12s]
```

> **Por que sempre a prévia antes:** o link de produção é o que você manda para as pessoas. Depois de
> enviado, não existe "desenviar". A prévia é o único momento de conferir sem custo.

**Teste final:** abra o link de produção **no celular, usando dados móveis, fora do Wi-Fi da
empresa**. Se abrir, está público de verdade. Testar só no seu computador não prova nada, porque a
página poderia estar sendo servida da sua própria máquina.

---

## E agora?

- Quer um endereço próprio no lugar do `.vercel.app`? Veja
  [`02-dns-cloudflare.md`](02-dns-cloudflare.md).
- Publicou algo errado? Veja [`03-quando-quebra.md`](03-quando-quebra.md). Dá para voltar atrás, e é
  rápido.
- Para publicar uma mudança depois, é só isto: mude o que quiser e digite `/deploy` de novo.
- **Apareceu um cliente novo?** Não repita este guia. Vá direto para
  [`06-pagina-privada.md`](06-pagina-privada.md): ele explica como um cliente novo vira uma pasta
  dentro deste mesmo repositório, sem repositório novo nem projeto novo na Vercel.

---

## Travou?

**Prompt de diagnóstico para colar no Claude Code:**

> Não consegui concluir o passo [descreva, por exemplo: "3, vincular ao projeto da Vercel"] do guia
> 01. O que aconteceu foi: [descreva o que apareceu na tela, e cole a mensagem de erro inteira]. Me
> ajude a descobrir o que está acontecendo. Antes de mudar qualquer coisa, me explique o que você vai
> fazer e por quê. Não crie projeto novo na Vercel, não use `sudo`, e nunca me peça o valor do token.

Se não resolver, chame o Edivaldo com o comando que você rodou e o texto inteiro da tela.
