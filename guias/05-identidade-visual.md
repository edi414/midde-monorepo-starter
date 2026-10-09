# Guia 05: colocar a identidade da sua empresa

Enquanto este passo não for feito, o projeto está em tons de cinza provisórios. A página funciona,
mas não tem cara da sua empresa.

**Faça isto antes de montar a página.** Trocar a identidade depois dá retrabalho, porque a escolha
dos blocos muda conforme a marca é sóbria ou expressiva.

---

## O comando

```
/design-system
```

Ele vai perguntar o que você tem. Qualquer uma destas respostas serve:

| O que você tem | O que acontece |
|---|---|
| Um manual ou guia de identidade visual (arquivo HTML) | Melhor caso. Ele lê as cores, a fonte e as formas direto do arquivo e quase não pergunta nada. |
| O endereço do site da empresa | Ele olha o site e propõe as cores que encontrou, para você confirmar. |
| Um print da logo, ou uma imagem da marca | Ele descreve as cores que vê e propõe valores **aproximados**. Se você tiver o código exato da cor, mande. |
| Nada à mão | Ele pergunta. São 3 ou 4 perguntas, e todas você consegue responder sem ser designer. |

Se for um arquivo, diga onde ele está. Por exemplo:

> /design-system
>
> O manual da marca está em ~/Downloads/guia-de-identidade.html

---

## As perguntas que ele pode fazer

Todas vêm com uma sugestão junto, então você pode só concordar se não tiver preferência.

- **Qual é a cor principal da marca?** É a cor que vai nos botões. Se a empresa tem duas cores,
  costuma ser a mais forte, não a do fundo.
- **A marca usa alguma fonte específica?** Se você não souber, ele usa uma fonte neutra e avisa.
- **A marca é mais sóbria e quadrada, ou mais leve e arredondada?** Isso define o quanto os cantos
  são arredondados. É uma pergunta sobre a personalidade da empresa, não sobre design.

---

## O que você deve ver no fim

Duas coisas:

1. **Um screenshot da sua página** já com as cores novas. Confira se está com a cara da empresa. Se
   não estiver, diga o que está estranho: "o azul está mais claro que o nosso" resolve.
2. **Um arquivo `design-system/IDENTIDADE.md`** listando cada valor e de onde ele veio. Vale abrir
   uma vez: é o que responde, daqui a três semanas, a pergunta "de onde saiu esse laranja?".

---

## Depois disso, a página inteira acompanha sozinha

Todas as cores, fontes e formas da página apontam para o `design-system/`. Então, quando a marca
mudar, muda num lugar só e a página inteira acompanha.

É por isso que o Claude Code **avisa** se você pedir uma cor solta numa parte da página. Não é
implicância: é o que impede a página de virar uma colcha de retalhos ao longo dos meses.

Se você realmente precisar de uma exceção, ele sabe como fazer, e vai registrar o motivo junto.

---

## Mudou a marca depois?

Rode `/design-system` de novo. Ele entende que já existe uma identidade configurada e pergunta só o
que mudou, em vez de recomeçar do zero.

**Isto aqui é sempre a sua própria marca**, a que aparece no seu `index.html`. Quando a identidade
for a de um cliente seu, não a sua, `/design-system` identifica isso sozinho e guarda a marca dele
à parte, dentro de `clientes/<nome-do-cliente>/`, sem misturar com a sua. Veja
[`06-pagina-privada.md`](06-pagina-privada.md).

---

## Travou?

**Texto para colar no Claude Code:**

> Tentei configurar a identidade visual da minha empresa com /design-system e [descreva o que
> aconteceu]. O material que eu tenho é [descreva: um arquivo, um site, um print]. Me ajude a
> resolver, e se não der para extrair do material, me pergunte as cores direto.
