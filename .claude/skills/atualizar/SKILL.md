---
name: atualizar
description: Traz para este projeto as melhorias do modelo da MIDDE (comandos, blocos e guias novos) sem tocar no conteúdo da pessoa. Use quando ela disser "/atualizar", "tem versão nova?", "quero as melhorias novas", "meu repositório está desatualizado", ou quando você notar que o modelo tem uma versão maior que a de `.versao-template`.
disable-model-invocation: true
---

# Atualizar a partir do modelo

Este projeto nasceu de um modelo público da MIDDE, que continua evoluindo. Esta skill traz o que
melhorou de lá para cá, **sem tocar em nada que a pessoa escreveu**.

## A fronteira, e ela não se negocia

| Chassi, é atualizado | Conteúdo, nunca é tocado |
|---|---|
| `.claude/` (comandos, regras, hooks) | `index.html` e demais páginas |
| `blocos/` | `design-system/tokens.css` e `IDENTIDADE.md`, na raiz e dentro de cada `clientes/<slug>/` |
| `guias/`, `scripts/` | imagens, logos, textos |
| `CLAUDE.md`, `.versao-template` | `.env`, toda a pasta `clientes/` (inclui `privado/` e `PAGINAS.md` de cada cliente), e qualquer pasta de página protegida (`<hash>/`) |

Na dúvida sobre um arquivo, **trate como conteúdo e não toque.** Perder uma melhoria do chassi custa
uma atualização a mais. Sobrescrever o trabalho de alguém custa a confiança no comando.

## Processo

1. **Confirme que o trabalho atual está salvo.** Rode `git status`. Se houver mudança não commitada,
   **pare e avise**: atualizar por cima de trabalho não salvo é o jeito mais fácil de perder coisa.
   Ofereça fazer o commit antes.

2. **Descubra a diferença de versão.** Leia `.versao-template` daqui e o do modelo em
   `https://github.com/edi414/midde-monorepo-starter`. Se forem iguais, diga que já está em dia e
   pare: não invente trabalho.

3. **Diga o que vai mudar, antes de mudar.** Liste em português o que veio de novo (um comando novo,
   um bloco novo, uma regra nova), e deixe claro que a página e a identidade visual não serão
   tocadas. **Espere a confirmação.**

4. **Atualize só o chassi**, copiando os arquivos da tabela acima a partir do modelo. Use comandos de
   shell para copiar, não as ferramentas de edição: o hook `protege-chassi.sh` bloqueia edição
   direta de `.claude/`, e é assim mesmo que deve ser.

5. **Atualize o `.versao-template`** para o número novo.

6. **Confira que nada quebrou.** Abra a página no navegador e veja se continua igual. Se a
   atualização trouxe bloco ou regra nova, diga como usar, em uma frase.

7. **Faça o commit** separado, só da atualização, com mensagem dizendo de que versão para qual
   versão foi. Assim dá para desfazer sem levar junto o trabalho de conteúdo.

## Nunca faça

- **Tocar em `index.html`, em `design-system/` ou em qualquer imagem.** Nem "só para arrumar".
- Atualizar com mudança não commitada na pasta.
- Atualizar sem dizer antes o que vai mudar.
- Misturar atualização e conteúdo no mesmo commit.
- Inventar que há atualização quando as versões são iguais.

## Referência

- `.versao-template`, o número da versão do modelo em que este projeto está.
- `CLAUDE.md`, as regras que vieram do modelo.
