const express = require("express");
const {
  listarContas,
  criarConta,
  atualizarUsuario,
  excluirConta,
  depositar,
  sacar,
  transferir,
  saldo,
  extrato,
} = require("../controladores");
const {
  verificandoFormularioDaConta,
  verificandoFormularioDeTransferencia,
} = require("../middlewares");

const rotas = express();

rotas.get("/contas", listarContas);

rotas.post("/contas", verificandoFormularioDaConta, criarConta);

rotas.put("/contas/:numeroDaConta/usuario", atualizarUsuario);

rotas.delete("/contas/:numeroDaConta", excluirConta);

rotas.post("/transacoes/depositar", depositar);

rotas.post("/transacoes/sacar", sacar);

rotas.post(
  "/transacoes/transferir",
  verificandoFormularioDeTransferencia,
  transferir
);

rotas.get("/contas/saldo", saldo);

rotas.get("/contas/extrato", extrato);

module.exports = rotas;
