---
name: pagina-privada
description: Cria uma página protegida por um código de 6 dígitos, para mandar para um cliente ou lead específico, em vez de todo mundo. Substitui o PDF ou o PPTX que você mandaria por e-mail. Use quando a pessoa disser "/pagina-privada", "quero mandar uma proposta só pra esse cliente", "isso não pode ficar público", "quero substituir o PDF que eu mando", "quero uma apresentação com senha" ou "só quem eu mandar o link pode ver".
disable-model-invocation: true
---

# Página privada (protegida por código)

Isto é o que substitui o PDF e o PPTX que normalmente vão por e-mail: a mesma página bonita e
animada do resto do projeto, mas atrás de um código de 6 dígitos, num endereço só daquele cliente.

O código não é login. Não tem conta, não tem senha por pessoa. É um número que você manda pelo
WhatsApp ou por e-mail, separado do link, e resolve o problema real: "isso não pode aparecer pra
qualquer um que adivinhar a URL".

## Antes de começar

Pergunte, se ainda não estiver claro: **essa página já existe, ou precisa ser criada?** Se
precisar, use `/nova-landing` primeiro, normalmente, para escrever o conteúdo. Só depois de o
conteúdo estar pronto é que ele é protegido. Proteger não é uma etapa de criação, é a última etapa
antes de mandar.

## Processo

1. **Descubra qual cliente é este.** Se a conversa já deixou claro (você acabou de rodar
   `/design-system` para ele, por exemplo), use isso. Senão, pergunte o nome e veja se já existe
   `clientes/<slug>/` para ele. Se não existir nenhuma pasta de cliente ainda, pare e ofereça rodar
   `/design-system` primeiro: é ele que cria `clientes/<slug>/IDENTIDADE.md` e a marca daquele
   cliente.

2. **Pergunte qual apresentação é essa** (o que muda dentro da pasta de um mesmo cliente é a
   ocasião, não quem vai receber). "Proposta inicial", "reajuste de valores", "atualização de
   escopo". Derive um identificador curto disso (`proposta-inicial`, `reajuste-2027`).

3. **Confirme onde está o conteúdo em texto claro.** Se for uma página nova, escreva (ou peça pra
   escrever com `/nova-landing`) dentro de `clientes/<slug>/privado/<ocasiao>/index.html`. Essa
   árvore é gitignored de propósito: o texto claro de algo que vai só para um cliente nunca deve
   ficar versionado sem proteção, nem por um instante.

4. **Gere um endereço público aleatório para esta apresentação**, não o nome do cliente nem da
   ocasião: um hash curto, por exemplo com
   `node -e "console.log(require('crypto').randomBytes(5).toString('hex'))"`, que serve como nome
   de pasta na raiz do repositório. **Nunca use o nome do cliente ou da ocasião no endereço
   público**: é isso que impede que `seusite.com/<nome-do-cliente>/` denuncie sozinho quem é
   cliente de quem.

5. **Rode a proteção**, usando o nome do cliente (do passo 1) no título, e o hash (do passo 4) como
   destino:

   ```bash
   node scripts/pin.js proteger clientes/<slug>/privado/<ocasiao>/index.html <hash>/index.html \
     --titulo "<nome do cliente>: proposta inicial" \
     --subtitulo "Digite o código de 6 dígitos que você recebeu para acessar."
   ```

   Isso gera um código aleatório e imprime no terminal. **Não coloque o código no chat com a
   pessoa nem em nenhum arquivo do projeto.** Ele é para ela guardar e repassar por fora.

6. **Registre o hash em `clientes/<slug>/PAGINAS.md`**, criando o arquivo se não existir: uma linha
   por apresentação, com a ocasião e o endereço (`proposta-inicial → /<hash>/`). **Nunca registre o
   código de 6 dígitos aqui**, só o endereço. Este arquivo é commitado normalmente (o repositório é
   privado): é o que permite, numa conversa futura, lembrar qual endereço é qual apresentação, sem
   isso aparecer para quem só tem o link.

7. **Diga o código pra pessoa, fora deste chat, se você não for quem vai enviar diretamente.** Se
   for você mesmo enviando ao cliente, o código vai por um canal (WhatsApp, e-mail) e o link por
   outro, nunca juntos na mesma mensagem: alguém que interceptar uma mensagem não teria as duas
   metades.

8. **Publique com `/deploy`, normalmente.** Não precisa de nada especial: a pasta `<hash>/` já vai
   junto do resto, e vira `seusite.com/<hash>/`. A sua página principal (`index.html`) continua
   pública do jeito que sempre foi.

9. **Se precisar editar depois**, confira `clientes/<slug>/PAGINAS.md` para achar o hash daquela
   ocasião, e desfaça a proteção primeiro, sempre com o mesmo código:

   ```bash
   node scripts/pin.js abrir <hash>/index.html clientes/<slug>/privado/<ocasiao>/index.html --pin <codigo>
   ```

   Edite, e proteja de novo no passo 5, usando o mesmo hash de destino. Pode reusar o mesmo código
   ou gerar um novo; se gerar novo, repasse de novo, porque o antigo para de funcionar.

## Nunca faça

- **Colocar o código no chat, num commit, ou em qualquer arquivo do projeto.** Ele só existe na
  cabeça de quem manda e de quem recebe. `PAGINAS.md` guarda o endereço, nunca o código.
- **Usar o nome do cliente ou da ocasião no endereço público.** É justamente isso que o hash
  evita.
- **Deixar o texto claro em `clientes/<slug>/privado/` sem proteger antes de fazer commit.**
  Confira `git status` antes: se aparecer algo dentro de `privado/`, o `.gitignore` está
  funcionando, mas vale checar mesmo assim.
- **Reusar a pasta de uma apresentação para o conteúdo de outra.** Cada ocasião tem o seu
  identificador, mesmo que o conteúdo seja parecido. Copiar por cima apaga o código de quem já
  recebeu o link.
- **Prometer que isto é seguro contra alguém que já tem o código.** É proteção contra acesso por
  acaso ou por adivinhação de URL, não contra a pessoa que recebeu o código de propósito
  compartilhá-lo. Para isso, não existe página estática que resolva.
- **Supor que o conteúdo de um cliente fica isolado do de outro dentro desta conversa.** Todos os
  `clientes/` moram no mesmo repositório, e o Claude Code enxerga a árvore inteira. Se você pedir
  "faz igual à proposta do outro cliente", ele vai conseguir olhar lá. Não peça isso entre clientes
  que não deveriam ver dado um do outro.

## Referência

- `scripts/pin.js`, o mecanismo. Usa só o `crypto` do próprio Node, sem dependência nova.
- `clientes/<slug>/IDENTIDADE.md`, onde está o nome do cliente (primeira linha).
- `clientes/<slug>/PAGINAS.md`, o mapa de hash para ocasião, commitado.
- `.claude/skills/nova-landing/SKILL.md`, para escrever o conteúdo antes de proteger.
- `.claude/skills/deploy/SKILL.md`, que publica a pasta protegida junto do resto, sem passo extra.
