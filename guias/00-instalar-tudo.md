# Guia 00: preparar a máquina

Este guia leva a sua máquina do zero até estar pronta para publicar. Você não precisa saber terminal
de cor: a partir do passo 1, cada etapa tem um prompt pronto para colar no Claude Code, que descobre
sozinho se você está no Mac, no Windows ou no Linux.

Cada passo tem três partes: o comando, **o que você deve ver na tela**, e o prompt para colar.

Travar aqui é normal, principalmente na primeira vez. Não tente resolver por conta própria mexendo
em pasta de sistema: é o caminho mais comum de travar de novo, pior.

---

## Antes de tudo: você consegue instalar programas nesta máquina?

Se o notebook é da empresa, pode não haver permissão de administrador. Descobrir isso agora poupa
uma hora perdida depois.

**Prompt para colar no Claude Code** (depois do passo 0, quando ele já existir):

> Faça um diagnóstico da minha máquina para publicar uma landing page. Me diga qual é o meu sistema
> operacional e a versão, e verifique se eu tenho `git`, `node`, `npm`, `gh` e `vercel` instalados,
> rodando o comando de versão de cada um. Depois teste se eu tenho permissão de administrador para
> instalar programas, sem instalar nada ainda. Me devolva uma lista simples do que já existe, do que
> falta, e se eu vou precisar pedir alguma liberação para o time de TI. Não instale nada nesta etapa.

Se a resposta for que falta permissão de administrador, **pare e fale com o TI da sua empresa**
antes de continuar. Leve a lista que o Claude Code montou: é exatamente o que precisa ser liberado.

---

## Passo 0: instalar o Claude Code

Este é o único passo sem prompt para colar, porque você ainda não tem onde colar.

Abra o terminal. No Mac, é o aplicativo chamado **Terminal**. No Windows, é o **PowerShell**.

**Mac, Linux ou WSL:**

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows (PowerShell):**

```powershell
irm https://claude.ai/install.ps1 | iex
```

Confirme que funcionou:

```bash
claude --version
```

**O que você deve ver na tela:**

```
$ claude --version
2.1.224 (Claude Code)
```

O número da versão pode ser diferente, e tudo bem. O que importa é aparecer um número, e não um erro
tipo `command not found`.

Agora abra o Claude Code e faça o login pelo navegador:

```bash
claude
```

A partir daqui, tudo é prompt colado.

---

## Passo 1: instalar o git

O git é o que guarda o histórico do seu projeto. É ele que permite voltar atrás quando algo quebra.

**Comando para checar se você já tem:**

```bash
git --version
```

**O que você deve ver na tela** (se já tiver):

```
$ git --version
git version 2.50.1
```

Se aparecer `command not found: git` (Mac ou Linux) ou `'git' não é reconhecido...` (Windows), você
ainda não tem.

**Prompt para colar no Claude Code:**

> Verifique se eu tenho o git instalado rodando `git --version`. Se não tiver, instale para o meu
> sistema operacional, detectando automaticamente se é Mac, Windows ou Linux, usando o gerenciador
> de pacotes apropriado (Homebrew no Mac, winget no Windows, apt ou dnf no Linux). Se no Mac abrir
> uma janela pedindo para instalar as Command Line Tools, me avise para eu clicar em Instalar e
> espere eu confirmar que terminou, não tente contornar essa janela. Depois que o git estiver
> funcionando, configure minha identidade: pergunte meu nome completo e meu e-mail, e rode
> `git config --global user.name` e `git config --global user.email` com esses valores. Me mostre o
> resultado de `git config --global --list` no final. Não altere nenhuma outra configuração global.

> **Atenção no Mac:** a janela das Command Line Tools é gráfica, e o Claude Code não consegue clicar
> nela. Quando ela aparecer, clique em Instalar, aceite os termos, espere terminar, e só então diga
> ao Claude Code que pode seguir.

---

## Passo 2: instalar o Node

O Node é o que faz o programa de publicação da Vercel funcionar.

**Comandos para checar:**

```bash
node --version
npm --version
```

**O que você deve ver na tela:**

```
$ node --version
v24.6.0
$ npm --version
11.5.1
```

O número precisa começar com `v20` ou maior. Se for menor, ou se der `command not found`, use o
prompt abaixo.

**Prompt para colar no Claude Code:**

> Verifique se eu tenho o Node.js instalado e qual a versão, rodando `node --version` e
> `npm --version`. Preciso da versão 20 ou superior. Se não tiver, ou se for menor que 20, instale
> para o meu sistema operacional, detectando automaticamente se é Mac, Windows ou Linux.
> Importante: instale de um jeito que **não** exija `sudo` para instalar pacotes globais depois (no
> Mac prefira Homebrew, no Windows winget, no Linux nvm ou o repositório oficial do NodeSource),
> porque eu vou instalar o Vercel CLI globalmente em seguida e não quero erro de permissão. No
> final, confirme que `node --version` e `npm --version` respondem, e me diga qual pasta o npm usa
> para pacotes globais rodando `npm config get prefix`. Não desinstale nenhuma versão de Node que já
> exista sem me perguntar antes, e nunca use `sudo`.

---

## Passo 3: instalar e autenticar o GitHub CLI

O GitHub é onde o seu projeto fica guardado. O `gh` é o programa que conecta a sua máquina à sua
conta.

Você precisa de uma **conta no GitHub**. Se ainda não tem, crie em
[github.com/signup](https://github.com/signup). Serve qualquer e-mail, inclusive o da empresa, e não
precisa ser Gmail. O GitHub vai pedir verificação em duas etapas, então **tenha o celular por
perto**.

**Comando para checar:**

```bash
gh --version
```

**O que você deve ver na tela:**

```
$ gh --version
gh version 2.81.0 (2025-09-30)
https://github.com/cli/cli/releases/tag/v2.81.0
```

**Prompt para colar no Claude Code:**

> Verifique se eu tenho o GitHub CLI (`gh`) instalado rodando `gh --version`. Se não tiver, instale
> para o meu sistema operacional, detectando automaticamente qual é. Depois rode `gh auth login` e
> me guie pelas perguntas: conta GitHub.com, protocolo HTTPS, autenticar o git com as credenciais do
> GitHub, e login pelo navegador. Me avise na hora exata em que eu preciso copiar o código e abrir o
> navegador, e espere eu confirmar que aprovei. No final, rode `gh auth status` e me mostre o
> resultado.

**O que você deve ver na tela** no fim do `gh auth login`:

```
! First copy your one-time code: XXXX-XXXX
Press Enter to open github.com in your browser...
✓ Authentication complete.
✓ Logged in as seu-usuario
```

---

## Passo 4: instalar o Vercel CLI

A Vercel é onde a sua página vai ficar hospedada.

**Comandos:**

```bash
npm install -g vercel
vercel --version
```

**O que você deve ver na tela:**

```
$ vercel --version
Vercel CLI 59.16.0
59.16.0
```

**Prompt para colar no Claude Code:**

> Instale o Vercel CLI globalmente com `npm install -g vercel` e confirme com `vercel --version`. Se
> der erro de permissão (`EACCES`), **não** resolva com `sudo`: me explique o que aconteceu e ajuste
> o prefixo do npm para uma pasta do meu usuário, ou reinstale o Node por Homebrew ou nvm. Depois
> me diga qual é o próximo passo.

> **Por que nunca `sudo` aqui:** resolver esse erro com `sudo` deixa arquivos de administrador dentro
> da pasta do npm. A instalação até funciona naquele momento, mas a próxima quebra de um jeito bem
> mais difícil de consertar.

---

## Conferência final

Rode tudo de uma vez, num terminal **recém-aberto** (feche e abra de novo, para garantir que as
instalações continuam valendo):

```bash
git --version && node --version && npm --version && gh --version && vercel --version
```

Se os cinco responderem com um número, a sua máquina está pronta.

Próximo passo: [`01-primeiro-deploy.md`](01-primeiro-deploy.md).

---

## Travou em algum passo?

**Prompt de diagnóstico para colar no Claude Code:**

> Não consegui concluir o passo [descreva o passo, por exemplo: "3, autenticar com gh auth login"] do
> guia 00 de preparação da máquina. O que aconteceu foi: [descreva o que apareceu na tela, e cole a
> mensagem de erro inteira]. Me ajude a descobrir o que está acontecendo e como resolver. Antes de
> mudar qualquer coisa na minha máquina, me explique o que você vai fazer e por quê. Não use `sudo`
> e não desinstale nada sem me perguntar.

Se ainda assim não resolver, chame o Edivaldo mandando junto o comando que você rodou e o texto
inteiro que apareceu na tela. Só "não funcionou" não dá para diagnosticar.
