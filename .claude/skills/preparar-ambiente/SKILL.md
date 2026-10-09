---
name: preparar-ambiente
description: Prepara a máquina para publicar uma landing page: confere e instala git, Node e GitHub CLI, configura a identidade do git e valida que tudo responde. Use quando a pessoa disser "/preparar-ambiente", "prepara meu ambiente", "não tenho git", "acabei de instalar o Claude Code e não sei o que fazer", "command not found", "não consigo rodar o deploy" ou similar.
disable-model-invocation: true
---

# Preparar a máquina

Esta skill existe para tirar do caminho a parte que mais trava quem está começando: instalar as
ferramentas. Quem está do outro lado pode nunca ter aberto um terminal antes. Conduza com calma,
explicando o que cada passo faz antes de fazer.

## Processo

1. **Faça o diagnóstico antes de instalar qualquer coisa.** Descubra o sistema operacional e rode,
   um por um, `git --version`, `node --version`, `npm --version`, `gh --version` e
   `vercel --version`. Monte uma lista simples do que já existe e do que falta, e mostre antes de
   agir. Motivo: instalar por cima do que já funciona é a forma mais fácil de quebrar algo que
   estava certo.

2. **Confirme que a pessoa consegue instalar programas nesta máquina.** Em notebook de empresa é
   comum não haver permissão de administrador. Se um passo de instalação pedir senha de
   administrador e ela não tiver, **pare**. Não tente contornar. Explique que o time de TI precisa
   liberar, e liste exatamente o que precisa ser instalado. Motivo: esse é o motivo número 1 de uma
   sessão inteira ser perdida, e contornar acaba deixando a máquina num estado pior.

3. **Instale só o que falta**, usando o gerenciador do sistema: Homebrew no Mac, winget no Windows,
   apt ou dnf no Linux. Explique o que vai rodar antes de rodar.

4. **Cuidado específico do Mac com o git.** No Mac, instalar o git pode abrir uma janela gráfica
   pedindo para instalar as Command Line Tools. **Você não consegue clicar nessa janela.** Avise a
   pessoa, peça que ela clique em Instalar e aceite os termos, e **espere ela confirmar que
   terminou** antes de seguir. Não tente contornar a janela.

5. **Cuidado específico do Node.** Instale de um jeito que não exija `sudo` para instalar pacotes
   globais depois: Homebrew no Mac, winget no Windows, nvm ou o repositório oficial no Linux. Peça
   a versão 20 ou maior. Motivo: se o Node vier do instalador oficial em pasta de sistema, a
   instalação do Vercel CLI falha com erro de permissão, e a "solução" com `sudo` deixa arquivos de
   administrador na pasta do npm e quebra a próxima instalação. **Nunca use `sudo` aqui.**

6. **Configure a identidade do git.** Pergunte o nome completo e o e-mail, e rode
   `git config --global user.name` e `git config --global user.email` com esses valores. Mostre
   `git config --global --list` no fim. Não altere nenhuma outra configuração global. Motivo: todo
   commit precisa de um autor, e sem isso o primeiro commit falha com uma mensagem confusa.

7. **Autentique no GitHub** com `gh auth login`: conta GitHub.com, protocolo HTTPS, autenticar o git
   com as credenciais do GitHub, e login pelo navegador. Avise **na hora exata** em que a pessoa
   precisa copiar o código de 8 caracteres e aprovar no navegador, e espere ela confirmar. Confirme
   no fim com `gh auth status`.

8. **Instale o Vercel CLI** com `npm install -g vercel` e confirme com `vercel --version`. Se der
   erro de permissão, volte ao passo 5: o problema é onde o Node foi instalado, e a correção é
   ajustar o prefixo do npm para uma pasta do usuário, nunca `sudo`.

9. **Configure o Chrome DevTools MCP, se o Google Chrome estiver instalado.** É opcional, e a
   ausência dele não trava nada: sem ele, a página é conferida abrindo com dois cliques, como
   sempre foi. Com ele, é você quem abre a página e tira o print, em vez de pedir para a pessoa
   abrir e descrever o que vê. Rode `claude mcp add chrome-devtools -- npx -y chrome-devtools-mcp@latest`
   e confirme com `claude mcp list` que `chrome-devtools` aparece conectado. Se o Chrome não
   estiver instalado, ou o comando falhar, siga sem ele: **não é bloqueante**, e não insista.

10. **Feche com a lista final na tela.** Rode os cinco comandos de versão de novo e mostre o
    resultado. Depois diga exatamente qual é o próximo passo: abrir `guias/01-primeiro-deploy.md`,
    ou digitar `/deploy` se o `.env` já estiver configurado.

## Nunca faça

- **Usar `sudo` para resolver erro de permissão do npm.** Pare e corrija a causa.
- **Contornar uma janela gráfica** pedindo a instalação. Peça o clique humano e espere.
- **Desinstalar uma versão de Node que já exista** sem perguntar antes.
- **Continuar quando falta permissão de administrador.** Pare e escale para o TI.
- **Instalar coisas que ninguém pediu.** Só git, Node, GitHub CLI e Vercel CLI.

## Referência

- `guias/00-instalar-tudo.md`, os mesmos passos em formato de leitura, com o que aparece na tela.
- `guias/01-primeiro-deploy.md`, o que fazer depois que a máquina estiver pronta.
