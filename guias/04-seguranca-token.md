# Guia 04: a sua credencial, o que ela permite e o que nunca fazer

Leia antes de colar o token no `.env`. São 2 minutos, e evita o erro mais caro deste material.

---

## O que você recebeu

Um **token da Vercel**, que é a credencial que permite publicar. Ele é como uma chave: quem tem,
entra. Ele não é uma senha que você escolheu, e não dá para "trocar": se vazar, ele é **revogado** e
você recebe outro.

Ao contrário de um token escopado a um único projeto, **este token enxerga a sua conta inteira na
Vercel.** É assim de propósito neste modelo: ele precisa conseguir criar o primeiro projeto sozinho,
na primeira vez que você rodar `/deploy` (guia 01, passo 3), sem você precisar saber de antemão qual
vai ser o nome dele.

A única coisa que limita o estrago se algo der errado é:

- **Ele tem data de validade.** Depois dela, para de funcionar sozinho.

Não existe mais a contenção de "fora daquele projeto, ele não serve para nada". **Leia a próxima
seção com atenção redobrada por causa disso.**

## O que ele permite, na conta inteira

Seja realista sobre isso:

- Publicar uma versão nova, **em qualquer projeto da conta**, não só no seu.
- **Criar e apagar projetos.**
- Ver as publicações anteriores de qualquer projeto.

E uma consequência que vale entender: **todo deploy feito com esse token aparece como sendo de quem
o criou, não de quem rodou o comando.** Se várias pessoas usarem o mesmo token, não é possível saber
depois quem publicou o quê. É um custo aceito de propósito, para reduzir a fricção do primeiro dia,
mas é um custo.

Neste modelo, o projeto que você usa carrega o material de **todos** os seus clientes, não só de um.
Vazar este token tem um raio de alcance maior do que um token escopado teria: quem tiver o token
consegue publicar ou apagar qualquer coisa na sua conta inteira da Vercel, não só o seu projeto. É o
motivo de as cinco regras abaixo valerem com mais força ainda aqui do que valeriam com um token
escopado.

---

## As cinco regras

**1. O token vive só no arquivo `.env`, e em nenhum outro lugar.**
O `.env` já está no `.gitignore` deste projeto, então ele nunca vai para o GitHub sozinho. Não
remova essa linha.

**2. Nunca cole o token no chat do Claude Code.**
Nem para "ele conferir se está certo". O Claude Code está configurado para não conseguir ler o
`.env` justamente por isso, e ele carrega a credencial sem nunca ver o valor.

**3. Nunca passe o token na linha de comando.**
Nada de `vercel --token=vcp_...`. Tudo o que você digita no terminal fica salvo no histórico do
shell, e continua lá depois. A CLI da Vercel lê o `VERCEL_TOKEN` do ambiente sozinha.

**4. Nunca mande o token por um canal onde ele fique registrado.**
Isso inclui mensagem de grupo, e-mail encaminhado, card de tarefa, documento compartilhado e print
de tela. Print de tela é o mais esquecido: a imagem fica no rolo da câmera e no backup da nuvem.

**5. Se o token aparecer em qualquer lugar além do `.env`, avise.**
Não tente apagar e seguir. Apagar uma mensagem não desfaz quem já leu, e apagar um commit não remove
o token do histórico do git. O conserto certo é **revogar e gerar outro**, e isso leva 1 minuto.
Avisar não dá problema. Não avisar, sim.

---

## O caso que acontece de verdade

O erro mais comum não é alguém mal-intencionado: é commitar o `.env` sem perceber, num repositório
que depois vira público.

Existem robôs que varrem o GitHub procurando credencial exposta, o tempo todo. O prazo entre um token
aparecer num repositório público e ele ser encontrado é medido em **minutos**, não em dias. Não
adianta apagar depois: o histórico do git guarda tudo o que já foi commitado, mesmo que o arquivo
tenha sido removido em seguida.

Por isso a proteção é em três camadas, e não em uma:

1. O `.env` está no `.gitignore`.
2. O Claude Code está proibido de ler o `.env`.
3. A skill `/deploy` para e avisa se um arquivo com cara de segredo aparecer no que está indo junto.

---

## Achou que vazou? Faça isto

1. **Avise o Edivaldo imediatamente.** Antes de tentar consertar.
2. Não apague nada por conta própria. Apagar atrapalha descobrir o que aconteceu, e não resolve.
3. O token é revogado e um novo é gerado. Você troca o valor no `.env` e segue trabalhando.

Levar 5 minutos para avisar custa quase nada. Descobrir uma semana depois custa muito.
