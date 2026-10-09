# Guia 06: um cliente novo, e uma página só para ele

Um cliente novo não vira repositório novo: vira uma pasta, `clientes/<nome-do-cliente>/`, dentro
deste mesmo repositório que você já configurou uma vez (guia 01). Nada de criar projeto na Vercel
de novo, nada de token novo.

Isto também substitui o PDF ou o PPTX que você mandaria por e-mail. Em vez de um arquivo anexado,
um link mais um código de 6 dígitos, mandados por canais separados.

---

## Cliente novo, em duas skills

1. **`/design-system`** — pergunta o nome do cliente e a marca dele, e cria
   `clientes/<nome-do-cliente>/`, com a identidade visual **daquele cliente**, separada da sua.
2. **`/pagina-privada`** — depois da marca configurada, cria a apresentação em si.

```
/pagina-privada
```

Ele te pergunta qual é a ocasião (proposta inicial, atualização, reajuste) e cuida do resto: gera um
código, protege a página num endereço aleatório, e te diz exatamente o que fazer com o código.

---

## O que acontece por trás

| Passo | O que é |
|---|---|
| Você escreve o conteúdo | Normalmente, com `/nova-landing`, dentro de `clientes/<nome>/privado/`, que nunca vai para o GitHub em texto claro |
| O Claude Code protege | Embrulha a página inteira, criptografada, atrás de uma tela que pede o código |
| O endereço público é um hash, não o nome do cliente | `seusite.com/k7f3q9x2/`, não `seusite.com/<nome-do-cliente>/`. O mapa fica em `clientes/<nome>/PAGINAS.md` |
| Você publica com `/deploy` | Igual sempre, o mesmo projeto e o mesmo token de sempre. A página protegida vai junto do resto |
| Você manda o link e o código, separados | Link por um canal, código por outro. Nunca os dois juntos |

O código não é senha de login: não tem conta, não tem "esqueci minha senha". É uma trava simples,
contra alguém que não devia estar ali chegar por acaso ou adivinhando o endereço.

---

## O limite deste modelo, com todos os clientes no mesmo repositório

Não existe uma parede técnica entre a pasta de um cliente e a de outro: o Claude Code enxerga a
árvore inteira, sempre. O hash no endereço impede que **alguém de fora** descubra quem é cliente de
quem. Ele não impede que **você**, numa conversa, peça para reaproveitar algo de um cliente no
material de outro, e isso funcione. Se isso for um problema real para os seus clientes (concorrentes
entre si, por exemplo), não peça esse tipo de reaproveitamento entre eles.

---

## Uma regra que não tem exceção

**O código nunca aparece no chat com o Claude Code, nem em nenhum arquivo do projeto.** Ele existe
só na cabeça de quem manda e de quem recebe, e no canal por onde foi enviado.

Se ele vazar (print, mensagem encaminhada por engano), gerar um novo é rápido: rode
`/pagina-privada` de novo, ele avisa que já existe uma versão e oferece trocar o código.

---

## E se eu precisar editar depois?

Diga ao Claude Code o que quer mudar. Ele sabe reabrir a versão protegida com o código, aplicar a
mudança, e proteger de novo, tudo numa conversa só. Você não precisa saber o comando por trás.

---

## Travou?

**Texto para colar no Claude Code:**

> Tentei proteger uma página com /pagina-privada e [descreva o que aconteceu]. Me ajude a
> resolver, sem me pedir o código em nenhum momento.
