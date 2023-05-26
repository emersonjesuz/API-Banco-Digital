const { format } = require("date-fns");

function analisandoTipagemDaVariavel(tipo, ...variaveis) {
  const tipagem = variaveis.every((variavel) => typeof variavel === tipo);

  return tipagem;
}

function dataAtual(data) {
  return format(new Date(), data);
}

function criarExtrato(numeroDaConta) {
  const { depositos, saques, transferencias } = bancoDeDados;

  const filtraDepositos = depositos.filter(
    (deposito) => deposito.numeroDaConta === numeroDaConta
  );
  const filtraSaques = saques.filter(
    (saque) => saque.numeroDaConta === numeroDaConta
  );
  const filtraTransferenciaEfetuada = transferencias.filter(
    (transferencia) => transferencia.numeroDaContaOrigem === numeroDaConta
  );
  const filtraTransferenciaRecebida = transferencias.filter(
    (transferencia) => transferencia.numeroDaContaDestino === numeroDaConta
  );

  const gerarExtrato = {
    depositos: filtraDepositos ? filtraDepositos : [],
    saques: filtraSaques ? filtraSaques : [],
    transferenciasEnviadas: filtraTransferenciaEfetuada
      ? filtraTransferenciaEfetuada
      : [],
    transferenciasRecebidas: filtraTransferenciaRecebida
      ? filtraTransferenciaRecebida
      : [],
  };

  return gerarExtrato;
}

module.exports = {
  analisandoTipagemDaVariavel,
  dataAtual,
  criarExtrato,
};
