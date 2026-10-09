---
name: subir-de-nivel
description: Converte este projeto de página simples para Next.js, quando ele precisa de algo que HTML estático não faz (formulário que recebe resposta de verdade, muitas páginas, conteúdo editável sem mexer no código). Use quando a pessoa disser "/subir-de-nivel", "quero um formulário que funcione", "preciso de várias páginas", "quero poder editar o texto sem mexer no código", ou "isso não dá para fazer com HTML".
disable-model-invocation: true
---

# Subir de nível: de página simples para Next.js

Converte o projeto do modo Simples para o modo Com build. **Não rode isso por antecipação.** Rode
quando houver uma necessidade concreta que o modo Simples não atende.

## Primeiro: isso é mesmo necessário?

A maior parte dos pedidos que parecem exigir Next.js não exige. Confira antes:

| O que ela pediu | Precisa subir de nível? |
|---|---|
| "Quero um formulário" | **Não**, se for só receber mensagem. Um link de WhatsApp ou um formulário hospedado resolve, sem build. |
| "Quero mudar o texto sem mexer no código" | **Não**, ela pede a mudança ao Claude Code e publica com `/deploy`. |
| "Quero mais de uma página" | **Não** até umas 4 ou 5 páginas: vários `.html` na mesma pasta funcionam. |
| "Quero receber e guardar os dados de quem preencheu" | **Sim** |
| "Quero uma área com login" | **Sim** |
| "Quero muitas páginas geradas a partir de uma lista" | **Sim** |

Se a resposta for "não", **diga isso e resolva do jeito simples.** Subir de nível sem necessidade é
adicionar um problema que ela não tem.

## O que ela perde, e precisa saber antes

Diga isto em voz alta antes de converter, porque depois não dá para voltar sem trabalho:

1. **Acaba o teste dos dois cliques.** Hoje ela abre o arquivo e vê a página. Depois, vai precisar
   de um comando rodando para ver o resultado.
2. **Passa a existir um passo que pode falhar sozinho.** Um erro de build vira uma tela branca ou
   uma mensagem em inglês que ela não vai saber ler, e a publicação para até alguém resolver.
3. **Atualizar dependência vira manutenção.** Antes não havia nenhuma.

Se ela disser que prefere ficar no simples depois de ouvir isso, **fique**. Foi uma boa conversa,
não um trabalho perdido.

## Processo

1. **Confirme a necessidade concreta** com a tabela acima, e confirme que ela ouviu o que perde.
2. **Commite tudo antes de começar.** A conversão mexe em muita coisa; sem ponto de retorno, um
   arrependimento no meio fica caro.
3. **Crie a estrutura do Next.js** preservando o conteúdo: o texto, as imagens e a identidade visual
   continuam os mesmos.
4. **Leve `design-system/tokens.css` junto, sem reescrever.** Importe no layout raiz. A identidade
   visual não muda porque a stack mudou: se as cores mudarem na conversão, algo deu errado.
5. **Traga os blocos que a página já usava.** Eles são HTML e CSS, então funcionam dentro de um
   componente quase sem mudança. O JS de `data-count` e `data-reveal` precisa rodar depois que o
   componente montar.
6. **Verifique nas duas pontas:** `npm run dev` sobe e a página responde; e a página está visualmente
   igual à de antes, em 375px e 1440px. Mande screenshot dos dois.
7. **Atualize o `CLAUDE.md`** marcando que o projeto agora está no modo Com build.
8. **Publique uma prévia com `/deploy`** e confirme que a Vercel construiu sem erro **antes** de
   considerar a conversão pronta. Conversão que não publica não está pronta.

## Nunca faça

- Converter sem uma necessidade concreta.
- Converter sem avisar o que ela perde.
- Reescrever o design system durante a conversão.
- Adicionar banco, login ou dependência que ninguém pediu, "já que vamos converter".
- Considerar pronto sem ter publicado uma prévia que funcione.

## Referência

- `CLAUDE.md`, a tabela dos dois modos e como se verifica cada um.
- `design-system/tokens.css`, que vai junto sem ser reescrito.
