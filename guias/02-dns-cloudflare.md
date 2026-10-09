# Guia 02: usar um endereço próprio (Cloudflare)

Este guia troca o `minha-landing-abc123.vercel.app` por algo como `lp.suaempresa.com.br`.

> **O registro de DNS em si, no Cloudflare (passo 2), não é feito ao vivo na sessão, e não é feito
> pelo Claude Code, nunca, sob nenhuma confirmação.** Mexer em DNS é a única coisa deste material
> que pode derrubar algo que não tem nada a ver com a sua landing, inclusive o e-mail da empresa.
> Quem cria o registro é quem já tem acesso ao Cloudflare e responde por ele. O passo 1 (registrar o
> domínio do lado da Vercel) é diferente: esse o Claude Code pode fazer, porque fica contido
> naquele projeto e é reversível sem afetar nada fora dele.

> **Você faz isto uma única vez, nunca por cliente.** O subdomínio é seu, não do cliente: cada
> cliente novo ganha um subcaminho por baixo dele (`seudominio.com.br/<hash>/`), resolvido pela
> estrutura de pastas do próprio `/deploy`, sem precisar de nenhum registro de DNS novo. Só abra
> exceção a isso se um cliente específico exigir o domínio dele próprio: aí é um projeto à parte,
> fora deste fluxo.

---

## Antes de começar, leia esta parte

**Use um subdomínio, não o domínio principal.**

- Subdomínio: `lp.suaempresa.com.br`, `promo.suaempresa.com.br`. É o que este guia cobre.
- Domínio raiz: `suaempresa.com.br`, sem nada na frente. **Não faça isso sem o time de TI.**

O motivo é concreto: o domínio raiz costuma carregar os registros de e-mail da empresa. Um registro
errado ali derruba o e-mail de todo mundo, e como o DNS leva horas para se espalhar, o estrago não
some assim que você desfaz. Um subdomínio é isolado: se der errado, só aquele endereço para de
funcionar.

---

## Passo 1: registrar o domínio no projeto da Vercel

**Prompt para colar no Claude Code:**

> Quero usar o endereço `lp.suaempresa.com.br` no lugar do `.vercel.app`. Rode
> `scripts/preparar-dominio.js` com ele, e me mostre exatamente o que sair: é o que eu vou colocar
> no Cloudflare.

**O que você deve ver na tela:**

```
Domínio "lp.suaempresa.com.br" registrado no projeto da Vercel.

Configure isto no Cloudflare (DNS > Add record), com a nuvem CINZA (DNS only):

  Type:   CNAME
  Name:   lp
  Target: cname.vercel-dns.com.

Depois de criar o registro, a propagação leva de minutos a algumas horas.
```

Guarde esses três valores (Type, Name, Target): é exatamente o que você vai colar no Cloudflare, no
próximo passo.

> **Se preferir fazer isso clicando, em vez de pelo Claude Code:** Settings do projeto na Vercel →
> **Domains** → **Add Domain** → digite o subdomínio. A tela mostra o mesmo valor que o script
> imprime.

> **Não copie um valor de tutorial da internet, nem o exemplo acima.** Em alguns projetos a Vercel
> pede um CNAME genérico (testado de verdade: `cname.vercel-dns.com.`), mas em outros pede um
> destino próprio daquele projeto, com cara de `d1d4fc829fe7bc7c.vercel-dns-017.com`. Os dois
> formatos existem. O valor certo é sempre o que apareceu **para o seu domínio**, nesta etapa.

---

## Passo 2: criar o registro no Cloudflare

No painel do Cloudflare, escolha o domínio, vá em **DNS** e depois em **Add record**:

| Campo | O que preencher |
|---|---|
| Type | o `Type` que saiu no passo 1 (quase sempre `CNAME`) |
| Name | o `Name` que saiu no passo 1 |
| Target | o `Target` que saiu no passo 1 |
| Proxy status | **DNS only** (a nuvem precisa ficar **cinza**, não laranja) |
| TTL | Auto |

Salve.

---

## Passo 3: a nuvem cinza, e por que ela importa

Esse é o erro que mais trava gente nesta etapa.

Por padrão, o Cloudflare deixa a nuvem **laranja**, que significa que ele fica no meio do caminho e
cuida do certificado de segurança. O problema é que a Vercel também emite um certificado para o
mesmo endereço. Os dois tentando fazer a mesma coisa gera erro de certificado, ou uma página que
entra em laço de redirecionamento e nunca carrega.

Duas saídas, e a primeira é mais simples:

1. **Deixar a nuvem cinza (DNS only).** O Cloudflare só aponta o caminho, e a Vercel cuida do
   certificado. É o que este guia recomenda.
2. Manter a nuvem laranja e, em **SSL/TLS**, mudar o modo para **Full (strict)**. Funciona, mas
   afeta outros registros do mesmo domínio, então só faça se souber o que já está configurado ali.

---

## Passo 4: esperar, e conferir

Leva de alguns minutos a algumas horas. Não é instantâneo, e não adianta ficar recarregando nos
primeiros 2 minutos.

Quando a Vercel reconhecer, o domínio aparece como válido em **Settings** e **Domains**.

**Comando para conferir se o DNS já se espalhou:**

```bash
dig lp.suaempresa.com.br CNAME +short
```

**O que você deve ver na tela** (o valor será o do seu projeto):

```
$ dig lp.suaempresa.com.br CNAME +short
d1d4fc829fe7bc7c.vercel-dns-017.com.
```

Se não devolver nada, ainda não se espalhou. Espere mais um pouco.

**Teste final:** abra `https://lp.suaempresa.com.br` no celular, com dados móveis. Precisa abrir a
página e mostrar o cadeado de segurança. Se abrir sem cadeado, ou com aviso de certificado, volte ao
passo 3: quase sempre é a nuvem laranja.

---

## Se der errado

Desfazer é simples e rápido: **apague o registro CNAME no Cloudflare.** O endereço próprio para de
funcionar e o link `.vercel.app` continua no ar normalmente, porque ele nunca dependeu do DNS.

| Sintoma | Causa quase certa |
|---|---|
| Erro de certificado, ou aviso de site não seguro | Nuvem laranja. Mude para DNS only. |
| A página fica recarregando sozinha, sem parar | Conflito de SSL entre Cloudflare e Vercel. Mesma correção. |
| `dig` não devolve nada | Ainda não se espalhou, ou o campo Name foi preenchido com o endereço inteiro em vez de só `lp`. |
| A Vercel diz "invalid configuration" | Já existe outro registro A, AAAA ou CNAME com o mesmo nome. Apague o antigo. |

**Prompt de diagnóstico para colar no Claude Code:**

> Configurei um CNAME no Cloudflare apontando `[seu-subdominio]` para o valor que a Vercel mostrou,
> mas [descreva o que está acontecendo]. Me ajude a diagnosticar rodando as consultas de DNS
> necessárias e comparando com o que a Vercel espera. **Não altere nenhum registro de DNS**, só me
> diga o que está errado e o que eu preciso mudar no painel.
