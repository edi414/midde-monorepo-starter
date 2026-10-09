# Guia 03: quando quebra

Vai quebrar em algum momento, e isso é normal. O que separa um susto de um problema é saber que
**quase tudo aqui é reversível**, e que reverter é mais rápido do que consertar.

---

## A regra que resolve 90 por cento dos casos

**Publicou algo errado? Não tente consertar com pressa. Volte para a versão anterior primeiro.**

Consertar com pressa, com o site errado no ar, é como trocar o pneu com o carro andando. Voltar leva
menos de 1 minuto, tira a pressão, e aí você conserta com calma.

**Prompt para colar no Claude Code:**

> Publiquei uma versão errada em produção. Quero voltar para a publicação anterior, que estava certa.
> Liste as últimas publicações deste projeto na Vercel, me mostre a data e a hora de cada uma para eu
> escolher, e me explique como promover a anterior para produção. Não apague nada e não publique
> nada novo até eu confirmar qual é a versão certa.

No painel da Vercel isso também é possível pela tela de **Deployments**: encontre a publicação boa e
use a opção de promover para produção. Todas as publicações anteriores continuam existindo, nenhuma é
apagada quando você publica por cima.

---

## Os quatro problemas que acontecem de verdade

### 1. A página está no ar, mas com o conteúdo errado

O mais comum, e o menos grave tecnicamente. Volte para a publicação anterior com o prompt acima,
corrija com calma, e publique de novo passando pela prévia.

Se o link já foi enviado para alguém, avise essa pessoa. O link não muda quando você corrige, então
ela vai ver a versão certa ao abrir de novo.

### 2. A página abre em branco

Quase sempre um arquivo foi renomeado ou apagado, ou o `index.html` tem um erro que quebra a
renderização.

**Teste rápido:** abra o `index.html` da sua pasta com dois cliques, sem servidor. Se abrir em branco
aí também, o problema está no arquivo, não na publicação.

> Minha página está abrindo em branco. Abra o `index.html` e procure o que está quebrando a
> renderização. Me explique o que encontrou antes de corrigir. Se não achar nada no arquivo, compare
> com a versão do último commit que estava funcionando.

### 3. O deploy falha e nada vai ao ar

A boa notícia: se o deploy falhou, o site antigo continua no ar. Nada foi perdido.

Leia a mensagem de erro inteira, não só a última linha. Os três motivos mais comuns:

- **Credencial expirada.** O token tem data de validade. Peça um novo ao Edivaldo.
- **`.env` faltando ou mal preenchido.** Confira que o arquivo existe e tem uma linha só, começando
  com `VERCEL_TOKEN=`.
- **Pasta não vinculada.** A pasta `.vercel` sumiu. Rode `vercel link` e vincule ao projeto
  existente, nunca criando um novo.

### 4. Publicou no projeto errado

Esse é o erro silencioso: o comando dá sucesso, e o site errado é atualizado.

Acontece quando a pasta `.vercel` aponta para outro projeto, ou quando alguém rodou o deploy de
dentro da pasta errada. Confira em qual projeto você está antes de publicar:

> Me diga em qual projeto da Vercel esta pasta está vinculada e com qual conta eu estou autenticado.

---

## O que nunca fazer para "resolver mais rápido"

- **`git push --force` ou `git reset --hard`.** Apagam o histórico, que é a única coisa que permite
  voltar atrás. Depois disso o problema deixa de ser reversível.
- **Apagar o projeto na Vercel.** O link morre para sempre, e qualquer pessoa que tenha recebido
  passa a ver erro.
- **Resolver erro de permissão com `sudo`.** Deixa arquivos de administrador na pasta do npm e
  quebra a próxima instalação, de um jeito bem mais difícil de consertar.
- **Criar um projeto novo na Vercel** porque o antigo "está estranho". Você acaba com dois, e o link
  que já foi enviado continua apontando para o velho.
- **Colar o token no chat** para o Claude Code "conferir". Se ele aparecer, precisa ser revogado.
  Veja [`04-seguranca-token.md`](04-seguranca-token.md).

---

## Prompt de diagnóstico

Serve para qualquer situação deste guia:

> Aconteceu um problema com a minha landing page. O que eu tentei fazer foi: [descreva]. O que
> aconteceu foi: [descreva o que apareceu na tela, e **cole a mensagem de erro inteira**, não só a
> última linha]. Me ajude a descobrir o que está acontecendo. Antes de mudar qualquer coisa, me
> explique o que você vai fazer e por quê. Não apague nada, não use `git push --force` nem
> `git reset --hard`, não crie projeto novo na Vercel, e não me peça o valor do token.

## Quando chamar o Edivaldo

Chame quando: o token expirou, você acha que o token vazou, o problema envolve DNS ou domínio, ou
você já tentou o prompt acima e não avançou.

Mande junto, sempre:

1. O comando que você rodou, ou o que você digitou no Claude Code.
2. **O texto inteiro que apareceu na tela.** Não só "deu erro".
3. O link do projeto, se já existir.

Só "não funcionou" não dá para diagnosticar, e a ida e volta pedindo essas informações custa mais
tempo do que o próprio conserto.
