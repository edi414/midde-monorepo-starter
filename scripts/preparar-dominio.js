#!/usr/bin/env node
"use strict";

/**
 * Registra um domínio no projeto da Vercel, e imprime exatamente o que colocar no Cloudflare.
 *
 * Isto cobre só o lado da Vercel. O registro de DNS em si, no Cloudflare, continua manual, de
 * propósito: é a única etapa deste material que pode derrubar algo fora da landing, inclusive o
 * e-mail da empresa. Veja guias/02-dns-cloudflare.md.
 *
 * Uso (com a credencial já carregada, como /deploy sempre faz):
 *   node scripts/preparar-dominio.js lp.suaempresa.com.br
 */

const fs = require("fs");

function sai(msg, codigo = 1) {
  console.error(msg);
  process.exit(codigo);
}

async function main() {
  const dominio = process.argv[2];
  if (!dominio) sai("Uso: node scripts/preparar-dominio.js <dominio-completo>");

  const token = process.env.VERCEL_TOKEN;
  if (!token) sai("VERCEL_TOKEN não está no ambiente. Carregue o .env antes de rodar isto.");

  let projectId;
  try {
    const projeto = JSON.parse(fs.readFileSync(".vercel/project.json", "utf8"));
    projectId = projeto.projectId;
  } catch (e) {
    sai("Não encontrei .vercel/project.json. Rode 'vercel link' (ou /deploy uma vez) antes.");
  }

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const addResp = await fetch(`https://api.vercel.com/v10/projects/${projectId}/domains`, {
    method: "POST",
    headers,
    body: JSON.stringify({ name: dominio }),
  });
  const addCorpo = await addResp.json();
  if (!addResp.ok) {
    sai(`Não consegui registrar "${dominio}" no projeto (HTTP ${addResp.status}): ` +
        `${addCorpo.error?.message || JSON.stringify(addCorpo)}`);
  }

  const configResp = await fetch(`https://api.vercel.com/v6/domains/${dominio}/config`, {
    headers,
  });
  const config = await configResp.json();
  if (!configResp.ok) {
    sai(`Domínio registrado no projeto, mas não consegui ler a configuração de DNS ` +
        `(HTTP ${configResp.status}). Confira direto no painel da Vercel, em Settings > Domains.`);
  }

  const apex = addCorpo.apexName || dominio;
  const nome = dominio === apex ? "@" : dominio.slice(0, -(apex.length + 1));
  const cname = config.recommendedCNAME?.[0]?.value;
  const ip = config.recommendedIPv4?.[0]?.value?.[0];

  console.log(`Domínio "${dominio}" registrado no projeto da Vercel.`);
  console.log("");
  console.log("Configure isto no Cloudflare (DNS > Add record), com a nuvem CINZA (DNS only):");
  console.log("");
  if (cname) {
    console.log(`  Type:   CNAME`);
    console.log(`  Name:   ${nome}`);
    console.log(`  Target: ${cname}`);
  } else if (ip) {
    console.log(`  Type:   A`);
    console.log(`  Name:   ${nome}`);
    console.log(`  Target: ${ip}`);
  } else {
    console.log("  Não veio um valor recomendado. Confira Settings > Domains no painel da Vercel.");
  }
  console.log("");
  console.log("Depois de criar o registro, a propagação leva de minutos a algumas horas.");
}

main().catch((e) => sai(`Erro inesperado: ${e.message}`));
