# Guia 02: usar um endereço próprio (Cloudflare)

Este guia troca o `minha-landing-abc123.vercel.app` por algo como `lp.suaempresa.com.br`.

> **Este passo não é feito ao vivo na sessão, e não é feito pelo Claude Code.** Mexer em DNS é a
> única coisa deste material que pode derrubar algo que não tem nada a ver com a sua landing,
> inclusive o e-mail da empresa. Quem executa é quem já tem acesso ao Cloudflare e responde por ele.
> Este guia existe para essa pessoa ter o passo a passo exato.

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

## Passo 1: adicionar o domínio no painel da Vercel

1. Abra o projeto na Vercel, vá em **Settings** e depois em **Domains**.
2. Clique em **Add Domain** e digite o subdomínio completo, por exemplo `lp.suaempresa.com.br`.
3. A Vercel vai mostrar o registro que você precisa criar. **Copie o valor que aparece na tela.**

> **Não copie um valor de tutorial da internet.** Em alguns projetos a Vercel pede um CNAME genérico
> (testado de verdade: `cname.vercel-dns.com.`), mas em outros pede um destino próprio daquele
> projeto, com cara de `d1d4fc829fe7bc7c.vercel-dns-017.com`. Os dois formatos existem. O valor
> certo é sempre o que o painel do **seu** projeto está mostrando, nunca o que você viu num
> tutorial ou neste guia.

---

## Passo 2: criar o registro no Cloudflare

No painel do Cloudflare, escolha o domínio, vá em **DNS** e depois em **Add record**:

| Campo | O que preencher |
|---|---|
| Type | `CNAME` |
| Name | só a parte da frente, por exemplo `lp` (não o endereço inteiro) |
| Target | o valor que você copiou do painel da Vercel |
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
