#!/usr/bin/env bash
# =============================================================================
# Verifica um arquivo .html depois que ele foi escrito.
#
# Evento: PostToolUse. O arquivo JA foi escrito quando isto roda, entao este
# hook NAO impede a escrita. O que ele faz e sair com codigo 2, e o codigo 2
# faz o texto do stderr chegar ao Claude Code como mensagem de sistema, para
# ele corrigir na hora. Na pratica o efeito e o mesmo: o erro nao sobrevive ao
# turno.
#
# Por que isto existe: sem passo de build nao ha lint nem CI. Regra escrita em
# CLAUDE.md que nada verifica e regra que nao vale. Ja aconteceu de verdade em
# outro repositorio da MIDDE: tres documentos exigiam criptografar o material
# do cliente antes de publicar, ninguem verificava, e um arquivo foi publicado
# em texto claro com o nome do cliente dentro.
#
# O que ele recusa:
#   1. cor em hex escrita direto na pagina, em vez de var(--token)
#   2. font-family que nao vem dos tokens
#   3. border-radius fora da escala (--raio-*)
#   4. tag HTML nao fechada ou fechada fora de ordem
#   5. <script src="..."> ou <link rel="stylesheet"> externo, fora do fonts.googleapis.com
#
# Os itens 4 e 5 sao guarda-corpo de stack, nao de marca: a promessa deste
# material e HTML/CSS/JS sem build e sem dependencia. Uma tag quebrada ou um
# script de CDN puxando codigo de fora nao aparece no valida-tokens de cor,
# mas quebra a mesma promessa, e ninguem tecnico vai estar la para notar.
#
# Sai 0 quando esta tudo certo, e nao imprime nada.
# =============================================================================

set -uo pipefail

entrada=$(cat)

# Extrai o caminho com o parser JSON do Node, nunca com regex: aspas escapadas
# dentro do caminho, ou outro campo que apenas mencione "file_path", produzem
# match errado ou vazio num grep. Node esta garantido aqui porque o projeto ja
# exige Node para o Vercel CLI.
arquivo=$(HOOK_INPUT="$entrada" node -e '
try {
  const p = JSON.parse(process.env.HOOK_INPUT);
  const t = p.tool_input || {};
  process.stdout.write(t.file_path || "");
} catch (e) { process.stdout.write(""); }
' 2>/dev/null)

# Sem caminho, ou nao e HTML: nada a verificar.
[ -z "$arquivo" ] && exit 0
case "$arquivo" in
  *.html) ;;
  *) exit 0 ;;
esac
[ -f "$arquivo" ] || exit 0

# O proprio arquivo de tokens pode definir valores crus: e a funcao dele.
case "$arquivo" in
  */design-system/tokens.css) exit 0 ;;
esac

# ESCAPE HATCH, com motivo obrigatorio.
# Uma linha que termine com  /* ds-livre: <motivo> */  e ignorada por estas
# verificacoes. Existe para o caso legitimo de geometria que nao e marca: a
# moldura de um celular desenhado em CSS tem 28px de canto porque um celular
# de verdade tem, nao porque a marca escolheu.
#
# O motivo e obrigatorio de proposito. Exceção sem motivo escrito vira,
# em poucas semanas, exceção que ninguem lembra por que existe, e dai o
# guarda-corpo inteiro perde o sentido.
# O motivo precisa ter pelo menos um caractere que nao seja espaco: senao
# "/* ds-livre: */" vazio passaria, e a exigencia de motivo nao valeria nada.
sem_livres() {
  grep -vE '/\*[[:space:]]*ds-livre:[[:space:]]*[^[:space:]*][^*]*\*/'
}

problemas=""

# --- 1. hex cru -------------------------------------------------------------
# Ignora as linhas de dentro de um bloco :root (onde definir hex e correto).
hex=$(awk '
  /:root/        { dentro=1 }
  dentro && /\}/ { dentro=0; next }
  !dentro && /#[0-9a-fA-F]{3,8}([^0-9a-fA-F]|$)/ {
    if ($0 !~ /^[[:space:]]*(\/\/|\/\*|\*)/) print NR": "$0
  }
' "$arquivo" | sem_livres | grep -oE '^[0-9]+: .*#[0-9a-fA-F]{3,8}' | head -5)

if [ -n "$hex" ]; then
  problemas="${problemas}
COR ESCRITA DIRETO NA PAGINA:
$hex

  Use os tokens: var(--acao), var(--texto), var(--fundo), var(--borda).
  Se a cor que voce precisa nao existe como token, ela provavelmente nao
  deveria existir na pagina. Se for cor de marca mesmo, rode /design-system.
"
fi

# --- 2. font-family fora dos tokens ----------------------------------------
fonte=$(grep -nE 'font-family:[[:space:]]*[^v}]' "$arquivo" \
        | grep -vE 'font-family:[[:space:]]*var\(' | sem_livres | head -3)
if [ -n "$fonte" ]; then
  problemas="${problemas}
FONTE FORA DO DESIGN SYSTEM:
$fonte

  Use var(--fonte) ou var(--fonte-mono). Trocar a fonte numa parte da pagina
  e o que faz um material parecer remendado.
"
fi

# --- 3. border-radius fora da escala ---------------------------------------
raio=$(grep -nE 'border-radius:[[:space:]]*[0-9]' "$arquivo" \
       | grep -vE '50%|999px' | sem_livres | head -3)
if [ -n "$raio" ]; then
  problemas="${problemas}
CANTO ARREDONDADO FORA DA ESCALA:
$raio

  Use var(--raio-sm), var(--raio-md), var(--raio-lg) ou var(--raio-pill).
  Raios diferentes lado a lado leem como descuido, mesmo que ninguem saiba
  dizer por que. (50% e 999px sao aceitos: circulo e capsula.)
"
fi

# --- 4. estrutura HTML: tag nao fechada ou fora de ordem --------------------
# Parser minimo, de proposito: nao valida HTML inteiro, so pega o erro que
# mais quebra a pagina sem aviso nenhum (fechar </div> a mais ou a menos).
estrutura=$(HOOK_FILE="$arquivo" node -e '
const fs = require("fs");
const html = fs.readFileSync(process.env.HOOK_FILE, "utf8");
const VOID = new Set(["area","base","br","col","embed","hr","img","input",
  "link","meta","source","track","wbr"]);
const limpo = html
  .replace(/<!--[\s\S]*?-->/g, "")
  .replace(/<script[\s\S]*?<\/script>/gi, "")
  .replace(/<style[\s\S]*?<\/style>/gi, "");
const re = /<\/?([a-zA-Z][a-zA-Z0-9-]*)[^>]*?(\/?)>/g;
const pilha = [];
let m, erro = null;
while ((m = re.exec(limpo)) && !erro) {
  const tag = m[0], nome = m[1].toLowerCase(), fecha = tag[1] === "/", auto = m[2] === "/";
  if (VOID.has(nome) || auto) continue;
  if (fecha) {
    if (!pilha.length || pilha[pilha.length - 1] !== nome) {
      erro = `</${nome}> nao corresponde ao que estava aberto (${pilha[pilha.length - 1] || "nada"})`;
    } else pilha.pop();
  } else pilha.push(nome);
}
if (!erro && pilha.length) erro = `tag aberta e nunca fechada: <${pilha[pilha.length - 1]}>`;
if (erro) process.stdout.write(erro);
' 2>/dev/null)

if [ -n "$estrutura" ]; then
  problemas="${problemas}
HTML COM TAG QUEBRADA:
  $estrutura

  Uma tag fechada fora de ordem derruba o resto da pagina, e quem nao e
  tecnico ve so uma tela em branco ou torta, sem saber por onde comecar.
"
fi

# --- 5. script ou stylesheet externo, fora do allowlist ---------------------
# O unico host externo com uso legitimo aqui e o Google Fonts (ja usado pelos
# tokens). Qualquer outro <script src> ou <link rel="stylesheet"> de fora
# introduz uma dependencia de build que este material promete nao ter.
externo=$(grep -noE '<(script[^>]*src|link[^>]*rel="stylesheet"[^>]*href)="https?://[^"]*"' "$arquivo" \
          | grep -v 'fonts\.googleapis\.com\|fonts\.gstatic\.com' | sem_livres | head -5)
if [ -n "$externo" ]; then
  problemas="${problemas}
SCRIPT OU FOLHA DE ESTILO EXTERNA:
$externo

  So o Google Fonts e permitido de fora. Qualquer outra biblioteca e uma
  dependencia que este material promete nao ter. Copie o codigo pra dentro
  do proprio HTML, ou pare e pergunte se e mesmo necessario.
"
fi

if [ -n "$problemas" ]; then
  {
    echo "Verificacao falhou em: $arquivo"
    echo "$problemas"
    echo "Corrija antes de seguir. Se precisar de um valor que nao existe nos"
    echo "tokens, rode /design-system em vez de escrever o valor na pagina."
  } >&2
  exit 2
fi

exit 0
