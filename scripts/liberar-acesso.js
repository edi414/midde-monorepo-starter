#!/usr/bin/env node
"use strict";

/**
 * Desliga a Vercel Authentication (ssoProtection) do projeto ligado a esta pasta.
 *
 * Por que isto existe: todo projeto novo na Vercel nasce com essa proteção ligada, o que exige
 * login numa conta com acesso ao projeto para abrir qualquer link .vercel.app, preview ou
 * produção. Sem desligar, o link que a skill /deploy mostra não abre para ninguém de fora, o que
 * quebra a promessa central deste material (um link que qualquer um pode abrir).
 *
 * Roda sozinho, dentro da skill /deploy, logo depois do `vercel link`. Não precisa ser chamado à
 * mão.
 *
 * Uso (com a credencial já carregada, como a skill /deploy sempre faz):
 *   node scripts/liberar-acesso.js
 *
 * Idempotente: rodar de novo quando já está desligado não faz mal nenhum, então roda em todo
 * /deploy, sem custo de conferir antes.
 */

const fs = require("fs");

function sai(msg, codigo = 1) {
  console.error(msg);
  process.exit(codigo);
}

function main() {
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    // Não é erro fatal: a skill que chama isto já confere a credencial antes. Se chegou aqui sem
    // token, algo na ordem dos passos mudou, e o certo é avisar sem travar tudo.
    sai("VERCEL_TOKEN não está no ambiente. Pulei a liberação de acesso.", 0);
  }

  let projectId;
  try {
    const projeto = JSON.parse(fs.readFileSync(".vercel/project.json", "utf8"));
    projectId = projeto.projectId;
  } catch (e) {
    sai("Não encontrei .vercel/project.json. Rode 'vercel link' antes.", 0);
  }
  if (!projectId) sai("`.vercel/project.json` não tem projectId.", 0);

  fetch(`https://api.vercel.com/v9/projects/${projectId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ssoProtection: null }),
  })
    .then(async (r) => {
      if (!r.ok) {
        // Não trava o deploy por isto: o pior caso e o mesmo de hoje sem esta correcao. So avisa.
        console.error(
          `Aviso: não consegui confirmar a liberação de acesso (HTTP ${r.status}). ` +
            "Se alguém disser que o link pede login da Vercel para abrir, isso é o motivo."
        );
        process.exit(0);
      }
      console.log("Acesso liberado: o link não vai pedir login da Vercel.");
    })
    .catch(() => {
      console.error(
        "Aviso: não consegui confirmar a liberação de acesso (sem resposta da Vercel). " +
          "Se alguém disser que o link pede login da Vercel para abrir, isso é o motivo."
      );
      process.exit(0);
    });
}

main();
