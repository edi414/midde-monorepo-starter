#!/usr/bin/env node
"use strict";

/**
 * Envolve ou desfaz a tela de PIN de 6 dígitos de uma página.
 *
 * Sem dependência nova: usa só o `crypto` embutido do Node. O mesmo mecanismo (AES-256-GCM, chave
 * derivada do PIN via PBKDF2, 600 mil iterações) que a MIDDE usa nas próprias propostas de cliente.
 *
 * Proteger (página aberta -> versão com PIN):
 *   node scripts/pin.js proteger privado/proposta-x/index.html paginas/proposta-x/index.html
 *   node scripts/pin.js proteger privado/proposta-x/index.html paginas/proposta-x/index.html --pin 482913
 *
 * Sem --pin, gera um código aleatório de 6 dígitos e imprime no final. Repasse esse código por um
 * canal separado do link (WhatsApp, e-mail), nunca junto do link.
 *
 * Abrir de volta, para editar (precisa do PIN usado ao proteger):
 *   node scripts/pin.js abrir paginas/proposta-x/index.html privado/proposta-x/index.html --pin 482913
 *
 * `privado/` é pasta de trabalho local, e já vem no .gitignore: o texto claro do que vai para um
 * cliente específico nunca fica versionado. O que é commitado é sempre a versão com PIN.
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ITERATIONS = 600000;

function erroSai(msg) {
  console.error(msg);
  process.exit(1);
}

function gerarPin() {
  return String(crypto.randomInt(0, 1000000)).padStart(6, "0");
}

function validarPin(pin) {
  if (!/^[0-9]{6}$/.test(pin || "")) erroSai("--pin precisa ser exatamente 6 dígitos.");
  return pin;
}

function derivarChave(pin, salt) {
  return crypto.pbkdf2Sync(pin, salt, ITERATIONS, 32, "sha256");
}

// Le design-system/tokens.css relativo ao arquivo de origem, subindo diretorios ate achar (o
// projeto pode chamar isto de uma pasta dentro de paginas/<algo>/). Se nao achar, cai num estilo
// neutro minimo: a tela de PIN nao pode quebrar so porque tokens.css nao existe.
function acharTokens(origem) {
  let dir = path.dirname(path.resolve(origem));
  for (let i = 0; i < 6; i++) {
    const candidato = path.join(dir, "design-system", "tokens.css");
    if (fs.existsSync(candidato)) return fs.readFileSync(candidato, "utf8");
    const acima = path.dirname(dir);
    if (acima === dir) break;
    dir = acima;
  }
  return null;
}

function montarHtml({ saltB64, nonceB64, cifraB64, titulo, subtitulo, tokensCss }) {
  if (titulo.includes('"') || subtitulo.includes('"')) {
    erroSai("titulo e subtitulo não podem conter aspas duplas.");
  }
  const estiloBase = tokensCss || `
    :root {
      --fundo:#f4f5f1; --fundo-cartao:#ffffff; --borda:#dce8e0;
      --texto:#1a2420; --texto-suave:#6b7c74;
      --acao:#3db07a; --acao-hover:#2d7a57; --texto-na-acao:#ffffff;
      --erro-500:#c0392b;
      --fonte: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      --raio-md:8px; --raio-lg:12px;
    }`;

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>${titulo}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<style>
${estiloBase}
*{box-sizing:border-box}
body{
  margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
  background:var(--fundo);color:var(--texto);font-family:var(--fonte);padding:24px;
}
.gate{
  width:100%;max-width:380px;background:var(--fundo-cartao);border:1.5px solid var(--borda);
  border-radius:var(--raio-lg);padding:40px 32px;text-align:center;
}
h1{font-size:22px;font-weight:600;margin:0 0 8px}
p{font-size:14px;color:var(--texto-suave);margin:0 0 24px;line-height:1.5}
input{
  width:100%;font-family:var(--fonte);font-size:24px;letter-spacing:.4em;text-align:center;
  padding:12px;border:1.5px solid var(--borda);border-radius:var(--raio-md);
  background:var(--fundo);color:var(--texto);
}
input:focus{outline:none;border-color:var(--acao)}
button{
  width:100%;margin-top:16px;padding:12px;font-family:var(--fonte);font-size:15px;font-weight:600;
  border:none;border-radius:var(--raio-md);background:var(--acao);color:var(--texto-na-acao);
  cursor:pointer;
}
button:disabled{opacity:.6;cursor:default}
button:not(:disabled):hover{background:var(--acao-hover)}
.msg{min-height:20px;font-size:13px;margin-top:12px}
.msg.error{color:var(--erro-500)}
.msg.loading{color:var(--texto-suave)}
</style>
</head>
<body>
  <div class="gate">
    <h1>${titulo}</h1>
    <p>${subtitulo}</p>
    <form id="gate-form" autocomplete="off">
      <input id="pin" inputmode="numeric" pattern="[0-9]*" maxlength="6" autofocus placeholder="------">
      <button type="submit" id="submit-btn">Acessar</button>
      <div class="msg" id="msg"></div>
    </form>
  </div>
<script>
(function() {
  const SALT_B64 = "${saltB64}";
  const NONCE_B64 = "${nonceB64}";
  const CIPHERTEXT_B64 = "${cifraB64}";
  const ITERATIONS = ${ITERATIONS};

  function b64ToBytes(b64) {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }

  const form = document.getElementById('gate-form');
  const input = document.getElementById('pin');
  const msg = document.getElementById('msg');
  const btn = document.getElementById('submit-btn');

  form.addEventListener('submit', async function(ev) {
    ev.preventDefault();
    const pin = input.value.trim();
    if (!/^[0-9]{6}$/.test(pin)) {
      msg.textContent = 'Digite os 6 dígitos do código.';
      msg.className = 'msg error';
      return;
    }
    btn.disabled = true;
    msg.textContent = 'Verificando...';
    msg.className = 'msg loading';
    try {
      const enc = new TextEncoder();
      const keyMaterial = await crypto.subtle.importKey(
        'raw', enc.encode(pin), 'PBKDF2', false, ['deriveKey']
      );
      const key = await crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt: b64ToBytes(SALT_B64), iterations: ITERATIONS, hash: 'SHA-256' },
        keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['decrypt']
      );
      const plainBuf = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: b64ToBytes(NONCE_B64) }, key, b64ToBytes(CIPHERTEXT_B64)
      );
      const html = new TextDecoder().decode(plainBuf);
      document.open();
      document.write(html);
      document.close();
    } catch (e) {
      msg.textContent = 'Código incorreto. Tente de novo.';
      msg.className = 'msg error';
      btn.disabled = false;
      input.value = '';
      input.focus();
    }
  });
})();
</script>
</body>
</html>
`;
}

const CAMPO_RE = {
  saltB64: /SALT_B64\s*=\s*"([^"]+)"/,
  nonceB64: /NONCE_B64\s*=\s*"([^"]+)"/,
  cifraB64: /CIPHERTEXT_B64\s*=\s*"([^"]+)"/,
  iterations: /ITERATIONS\s*=\s*(\d+)/,
};

function proteger(origem, destino, pinArg, titulo, subtitulo) {
  if (!fs.existsSync(origem)) erroSai(`Arquivo não encontrado: ${origem}`);
  const pin = validarPin(pinArg || gerarPin());
  const texto = fs.readFileSync(origem);
  const salt = crypto.randomBytes(16);
  const nonce = crypto.randomBytes(12);
  const chave = derivarChave(pin, salt);
  const cipher = crypto.createCipheriv("aes-256-gcm", chave, nonce);
  // Ciphertext com o tag de autenticacao no final, mesmo formato que o WebCrypto do navegador
  // espera de volta em crypto.subtle.decrypt (AES-GCM): tag colada ao fim do ciphertext.
  const cifrado = Buffer.concat([cipher.update(texto), cipher.final(), cipher.getAuthTag()]);

  const html = montarHtml({
    saltB64: salt.toString("base64"),
    nonceB64: nonce.toString("base64"),
    cifraB64: cifrado.toString("base64"),
    titulo: titulo || "Material da mentoria",
    subtitulo: subtitulo || "Digite o código de 6 dígitos que você recebeu para acessar.",
    tokensCss: acharTokens(origem),
  });

  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, html, "utf8");

  console.log(`Gerado: ${destino}`);
  console.log(`PIN: ${pin}`);
  console.log("Repasse esse PIN por um canal separado do link (nunca junto do link).");
  console.log("Guarde esse PIN em algum lugar seu (fora do git) se quiser poder editar depois.");
}

function abrir(origem, destino, pinArg) {
  if (!fs.existsSync(origem)) erroSai(`Arquivo não encontrado: ${origem}`);
  const html = fs.readFileSync(origem, "utf8");
  const campos = {};
  for (const [nome, re] of Object.entries(CAMPO_RE)) {
    const m = html.match(re);
    if (!m) erroSai(`Não encontrei ${nome} em ${origem}: é mesmo uma página gerada por 'pin.js proteger'?`);
    campos[nome] = m[1];
  }
  const pin = validarPin(pinArg);
  const salt = Buffer.from(campos.saltB64, "base64");
  const nonce = Buffer.from(campos.nonceB64, "base64");
  const cifraComTag = Buffer.from(campos.cifraB64, "base64");
  const tag = cifraComTag.subarray(cifraComTag.length - 16);
  const cifrado = cifraComTag.subarray(0, cifraComTag.length - 16);
  const iterations = parseInt(campos.iterations, 10);
  const chave = crypto.pbkdf2Sync(pin, salt, iterations, 32, "sha256");

  let texto;
  try {
    const decipher = crypto.createDecipheriv("aes-256-gcm", chave, nonce);
    decipher.setAuthTag(tag);
    texto = Buffer.concat([decipher.update(cifrado), decipher.final()]);
  } catch (e) {
    erroSai("PIN incorreto, não deu para abrir.");
  }

  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, texto);
  console.log(`Aberto: ${destino}`);
}

function main() {
  const [, , comando, origem, destino, ...resto] = process.argv;
  const pinIdx = resto.indexOf("--pin");
  const pinArg = pinIdx >= 0 ? resto[pinIdx + 1] : undefined;
  const tituloIdx = resto.indexOf("--titulo");
  const titulo = tituloIdx >= 0 ? resto[tituloIdx + 1] : undefined;
  const subtituloIdx = resto.indexOf("--subtitulo");
  const subtitulo = subtituloIdx >= 0 ? resto[subtituloIdx + 1] : undefined;

  if (comando === "proteger" && origem && destino) {
    proteger(origem, destino, pinArg, titulo, subtitulo);
  } else if (comando === "abrir" && origem && destino) {
    if (!pinArg) erroSai("Uso: node scripts/pin.js abrir <origem> <destino> --pin 123456");
    abrir(origem, destino, pinArg);
  } else {
    erroSai(
      "Uso:\n" +
        "  node scripts/pin.js proteger <origem.html> <destino.html> [--pin 123456] [--titulo \"...\"] [--subtitulo \"...\"]\n" +
        "  node scripts/pin.js abrir <origem.html> <destino.html> --pin 123456"
    );
  }
}

main();
