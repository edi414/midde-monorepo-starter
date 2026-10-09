# Guia 04: a sua credencial

Leia antes de colar o token no `.env`. Um minuto, e evita o erro mais caro deste material.

---

## O que é

Um token da Vercel, de conta inteira (não de um projeto só): com ele dá para publicar, criar e
apagar projetos na sua conta. Não tem como "trocar" se vazar: só dá para **revogar** e gerar outro.

Ele já tem data de validade, então mesmo esquecido ele para de funcionar sozinho depois de um tempo.

## A única regra que importa de verdade

**Não deixe o token ir parar num repositório público.** Fora isso, ele vive no `.env`, que já está
no `.gitignore` e por isso não acompanha o repositório quando ele for commitado.

O motivo não é sobre o que tem no seu projeto: existem robôs varrendo o GitHub o tempo todo atrás
de token exposto, e o prazo entre aparecer e ser usado por outra pessoa é de minutos. Isso vale
mesmo que não haja nada sensível ali.

## Se desconfiar que vazou

Avise o Edivaldo. Ele revoga o token e gera outro, e você troca o valor no `.env`. Leva um minuto, e
resolve de vez — bem mais barato do que ficar tentando descobrir sozinho se vazou mesmo.
