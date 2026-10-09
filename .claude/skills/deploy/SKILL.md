---
name: deploy
description: Publica esta landing page na Vercel e devolve o link público, sempre passando por uma prévia antes da produção. Use quando a pessoa disser "/deploy", "deploy", "publicar", "colocar no ar", "subir o site", "publicar a landing", "manda pra produção", "atualizar o site" ou "gera um link pra eu mandar".
disable-model-invocation: true
allowed-tools: Bash(vercel whoami:*), Bash(vercel ls:*), Bash(vercel inspect:*), Bash(git status:*), Bash(git add:*), Bash(git commit:*), Bash(node scripts/liberar-acesso.js:*)
---

# Deploy (prévia primeiro, produção só com confirmação)

Esta skill publica a pasta atual na Vercel. Ela é disparada só por quem está usando o projeto, nunca
sozinha, porque publicar é uma ação com consequência fora da máquina.

O fluxo é sempre o mesmo: prévia, conferir, confirmar, produção. Nunca pule etapas, mesmo que a
pessoa peça para ir direto.

## Processo

1. **Confirme que esta pasta é publicável.** Verifique que existe `index.html` na raiz. Se não
   existir, pare e diga que esta pasta não parece um projeto de landing page, em vez de tentar
   adivinhar o que publicar.

2. **Carregue a credencial sem lê-la.** O token fica em `.env`, e você não tem permissão de leitura
   nesse arquivo, de propósito. Carregue por shell, na mesma linha do comando de deploy:

   ```bash
   set -a && . ./.env && set +a && vercel
   ```

   Se o `.env` não existir, pare e oriente: copiar `.env.example` para `.env` com
   `cp .env.example .env` e colar o valor que a MIDDE enviou. **Nunca peça o token no chat, nunca
   imprima o valor, e nunca escreva o token em nenhum arquivo.** Se ele aparecer em qualquer lugar
   além do `.env`, ele precisa ser revogado.

3. **Confira o que está indo junto.** Rode `git status` e liste, em português simples, o que mudou
   desde a última vez. Se aparecer qualquer arquivo chamado `.env`, `*.key`, `*.pem`, `credenciais*`,
   `secret*`, ou qualquer coisa dentro de `privado/`, **pare imediatamente**, avise que isso não pode
   ir para a nuvem, e ofereça acrescentar ao `.gitignore`. Não continue enquanto não estiver
   resolvido.

4. **Confirme a identidade e o projeto certo.** Rode `vercel whoami` (com a credencial carregada
   como no passo 2). Se a pasta `.vercel` já existir, já está vinculado: siga para o passo 5. Se
   não existir, é a primeira vez que este repositório publica:
   - **Se a MIDDE já passou o nome de um projeto**, use-o: `vercel link --project <nome> --yes`.
   - **Se ninguém passou nome nenhum**, crie o projeto agora mesmo, sem perguntar o nome:
     `vercel link --yes`, sem `--project`. A credencial é de conta inteira, então ela tem permissão
     para isso, e a Vercel nomeia o projeto a partir do nome da pasta. Diga à pessoa, em uma frase,
     que um projeto novo foi criado e com qual nome.
   - **Depois de vinculado uma vez, nunca repita a criação.** `.vercel/project.json` já existente é
     o sinal de que isso já aconteceu. Criar de novo gera um projeto duplicado, e o link antigo
     continua no ar com conteúdo velho, sem ninguém perceber.

5. **Logo depois do link, rode `node scripts/liberar-acesso.js`** (com a credencial ainda carregada).
   Todo projeto novo na Vercel nasce exigindo login para abrir qualquer link, mesmo o de produção.
   Isso corrige isso, uma vez, silenciosamente. Não precisa contar isso à pessoa, a menos que o
   script avise que não conseguiu: nesse caso, avise que o link pode pedir login da Vercel para
   quem não tiver acesso ao projeto, e que isso precisa ser resolvido antes de mandar para alguém de
   fora.

6. **Antes de publicar, confira se já existe algum deploy neste projeto**, com `vercel ls`. **Se a
   lista vier vazia, este vai ser o primeiro deploy do projeto, e a Vercel promove o primeiro deploy
   direto para produção, mesmo sem `--prod`.** Não existe prévia possível nesse caso específico.
   Avise isso antes de rodar, com estas palavras ou parecidas: "Este vai ser o primeiro envio deste
   projeto, então ele já sai publicado, sem prévia. Posso seguir?", e só prossiga com a confirmação
   literal `sim, produção`, igual ao passo 9. Se já existir pelo menos um deploy anterior, o próximo
   é seguro: siga para o passo 7 normalmente.

7. **Publique a prévia.** Rode o deploy sem `--prod`. Esta etapa nunca é pulada, mesmo que a pessoa
   diga "manda direto para produção".

8. **Mostre o link da prévia isolado, em uma linha só.** Depois peça, com estas palavras ou
   parecidas: "Abra esse link, confira o conteúdo, e me diga se está certo." **Pare e espere a
   resposta.** Não siga sozinho. (Se o passo 6 já publicou direto por ser o primeiro deploy, não há
   prévia para mostrar aqui: pule para o passo 10 com o link que já saiu.)

9. **Peça a confirmação de produção, e aceite só a forma literal.** Pergunte: "Publicar em produção
   agora? Responda `sim, produção`." Aceite apenas essa resposta. Um "ok", "pode ir", "manda" ou
   "isso" não vale. Motivo: o link de produção costuma já ter sido enviado a alguém, e não existe
   "desenviar".

10. **Publique em produção** com `--prod`, carregando a credencial da mesma forma. Mostre o link de
    produção isolado, com a data e a hora.

11. **Registre o ponto de retorno.** Rode `git add`, `git commit` com uma mensagem que descreva o que
    mudou, e `git push` se houver repositório remoto. Motivo: sem commit não existe versão anterior
    para voltar, e o rollback deixa de ser possível.

12. **Feche explicando o rollback.** Diga que, se algo estiver errado, basta pedir "volta para o
    deploy anterior", e aponte `guias/03-quando-quebra.md`.

## Nunca faça

- **Rodar com `--prod` sem a confirmação literal `sim, produção`.** É a regra mais importante aqui.
- **Pular a prévia.** Ela é o único momento de conferir antes de alguém de fora ver.
- **Pedir, imprimir, copiar ou escrever o token** em qualquer lugar além do `.env`. Nunca passe
  `--token` na linha de comando: isso fica gravado no histórico do shell.
- **Criar projeto novo na Vercel** quando já existe vínculo.
- **`git push --force`, `git reset --hard`, ou apagar arquivo** para resolver um problema.
- **Instalar dependência, adicionar backend, banco ou rota de API** para "fazer funcionar". Isso
  sai da stack combinada. Pare e pergunte.
- **Resolver erro de permissão com `sudo`.** Isso deixa arquivos de administrador na pasta do npm e
  quebra a próxima instalação. Pare e explique o que aconteceu.
- **Tentar outra plataforma** se a Vercel falhar. Pare e mostre o erro inteiro.

## Referência

- `scripts/liberar-acesso.js`, desliga o login obrigatório da Vercel no projeto.
- `CLAUDE.md`, as regras do projeto e o motivo de cada uma.
- `guias/01-primeiro-deploy.md`, o passo a passo da primeira publicação.
- `guias/03-quando-quebra.md`, rollback e diagnóstico.
- `guias/04-seguranca-token.md`, o que a credencial permite e o que nunca fazer com ela.
