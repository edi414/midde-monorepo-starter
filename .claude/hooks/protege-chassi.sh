#!/usr/bin/env bash
# =============================================================================
# Impede edicao direta do "chassi" do projeto.
#
# Evento: PreToolUse. Aqui o codigo 2 BLOQUEIA de verdade: a escrita nao chega
# a acontecer. (Diferente do valida-tokens.sh, que roda depois e so avisa.)
#
# Chassi e o que veio do modelo e e atualizado por /atualizar:
#   .claude/          as skills, as regras, os proprios hooks
#   .versao-template  o numero que diz de qual versao do modelo isto veio
#
# Por que bloquear: editar o chassi a mao parece resolver na hora e cria um
# problema silencioso depois. Na proxima vez que /atualizar rodar, a edicao
# e sobrescrita sem aviso, e a pessoa perde o trabalho sem entender por que.
# Melhor recusar agora, com explicacao, do que apagar depois, em silencio.
#
# O /atualizar nao e bloqueado por isto porque ele copia arquivos por comando
# de shell, e este hook so observa as ferramentas de edicao de arquivo.
#
# NAO protege design-system/tokens.css de proposito: e a skill /design-system
# que escreve nele, e ela usa as mesmas ferramentas de edicao.
# =============================================================================

set -uo pipefail

entrada=$(cat)

# Parser JSON do Node, nunca regex: aspas escapadas dentro do caminho, ou
# outro campo que apenas mencione "file_path", dariam match errado num grep.
arquivo=$(HOOK_INPUT="$entrada" node -e '
try {
  const p = JSON.parse(process.env.HOOK_INPUT);
  const t = p.tool_input || {};
  process.stdout.write(t.file_path || t.notebook_path || "");
} catch (e) { process.stdout.write(""); }
' 2>/dev/null)

# Sem caminho legivel, nao bloqueia: um hook que trava por nao ter entendido a
# entrada e pior que a edicao que ele tentava evitar.
[ -z "$arquivo" ] && exit 0

# Fora do projeto (rascunho, memoria, pasta temporaria): liberado.
raiz="${CLAUDE_PROJECT_DIR:-$PWD}"
case "$arquivo" in
  "$raiz"/*) ;;
  /*) exit 0 ;;
esac

relativo="${arquivo#"$raiz"/}"

case "$relativo" in
  .claude/*|.versao-template)
    {
      echo "Edicao bloqueada: '$relativo' faz parte do chassi do projeto."
      echo
      echo "O chassi (a pasta .claude e o arquivo .versao-template) vem do modelo"
      echo "da MIDDE e e atualizado pelo comando /atualizar. Uma edicao feita aqui"
      echo "a mao seria sobrescrita na proxima atualizacao, sem aviso."
      echo
      echo "O que fazer, conforme o caso:"
      echo "  - quer mudar a identidade visual?      rode /design-system"
      echo "  - quer trazer melhorias do modelo?     rode /atualizar"
      echo "  - precisa mesmo mudar uma regra daqui? fale com o Edivaldo, para a"
      echo "    mudanca entrar no modelo e valer para todo mundo, nao so aqui"
    } >&2
    exit 2
    ;;
esac

exit 0
