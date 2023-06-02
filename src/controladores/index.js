const bancoDeDados = require("../bancodedados");
const fsPromises = require("fs/promises");
const {
  analisandoTipagemDaVariavel,
  dataAtual,
  criarExtrato,
} = require("../utils");
const bancodedados = require("../bancodedados");

function criarIndentificardorUnico() {
  const contas = bancoDeDados.contas;

  if (!contas.length) return "1";

  const ultimoNumeroDaConta = +contas[contas.length - 1].numero;
  const novoNumeroCriado = `${ultimoNumeroDaConta + 1}`;

  return novoNumeroCriado;
}

function checarDadoUnico(atributoDoBanco, elementoPraChecar) {
  const dadoIndividual = bancoDeDados.contas.some(
    (dado) => dado.usuario[atributoDoBanco] === elementoPraChecar
  );

  return dadoIndividual;
}

async function atualizarBancoDeDados(bancoDeDados) {
  const bancoDedadosAntigo = JSON.stringify(bancoDeDados);

  const novoBancoDeDados = `module.exports = ${bancoDedadosAntigo}`;

  return await fsPromises.writeFile("./src/bancodedados.js", novoBancoDeDados);
}

function listarContas(req, res) {
  const { senha } = req.query;

  const checarSenha = senha === bancodedados.banco.senha;

  if (!checarSenha)
    return res.status(400).json({ message: "Senha da conta incorreta" });

  try {
    res.status(200).json(bancodedados.contas);
  } catch (error) {
    return res
      .status(404)
      .json({ message: "A um problema no servidor, estamos resolvendo " });
  }
}

async function criarConta(req, res) {
  const { nome, cpf, email, dataDeNascimento, telefone, senha } = req.body;
  const checarEmail = checarDadoUnico("email", email);
  const checarCpf = checarDadoUnico("cpf", cpf);

  if (checarEmail || checarCpf) {
    return res
      .status(400)
      .json({ message: "esses dados ja existe em outra conta " });
  }

  const novaConta = {
    numero: criarIndentificardorUnico(),
    saldo: 0,
    usuario: {
      nome,
      cpf,
      dataDeNascimento,
      telefone,
      email,
      senha,
    },
  };

  try {
    bancoDeDados.contas.push(novaConta);

    await atualizarBancoDeDados(bancoDeDados);

    res.status(201).json(novaConta);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "A um problema no servidor, estamos resolvendo " });
  }
}

function atualizarUsuario(req, res) {
  const { numeroDaConta } = req.params;
  const { nome, cpf, telefone, email, senha } = req.body;
  const checarCpf = checarDadoUnico("cpf", cpf);
  const checarEmail = checarDadoUnico("email", email);
  const checagemFormulario = nome || cpf || telefone || email || senha;
  const verificarNumeroConta = bancodedados.contas.find(
    (conta) => conta.numero === numeroDaConta
  );
  const formatarConta = {};

  try {
    if (!checagemFormulario) {
      res
        .status(400)
        .json({ message: "Preencha ao menos um campo da requisição" });
      return;
    }

    if (!verificarNumeroConta) {
      return res.status(400).json({ messagem: "Essa conta não existe" });
    }

    if (checarCpf || checarEmail) {
      return res
        .status(400)
        .json({ message: "Esses dados já existem em outra conta" });
    }

    for (const item of Object.entries(req.body)) {
      if (item[1]) {
        formatarConta[item[0]] = item[1];
      }
    }
    let contaAtualizada = { ...verificarNumeroConta.usuario, ...formatarConta };
    verificarNumeroConta.usuario = contaAtualizada;
    atualizarBancoDeDados(bancodedados);

    res.status(200).json({ mensagem: "Conta atualizada com sucesso!" });
  } catch (error) {
    return res
      .status(404)
      .json({ message: "A um problema no servidor, estamos resolvendo " });
  }
}

function excluirConta(req, res) {
  const { numeroDaConta } = req.params;

  const verificarConta = bancodedados.contas.find(
    (conta) => conta.numero === numeroDaConta
  );

  if (!verificarConta) {
    return res.status(400).json({ message: "Essa conta não existe" });
  }

  if (verificarConta.saldo !== 0) {
    return res.status(400).json({
      message: "Sua conta nessecita estar zerada para que seja excluida",
    });
  }

  const filtrarContasQuePermanecem = bancodedados.contas.find(
    (conta) => conta.numero !== numeroDaConta
  );

  const filtrarSaquesQuePermanecem = bancodedados.saques.find(
    (saque) => saque.numeroDaConta !== numeroDaConta
  );

  const filtrarDepositosQuePermanecem = bancodedados.depositos.find(
    (deposito) => deposito.numeroDaConta !== numeroDaConta
  );

  const filtrarTransferenciasQuePermanecem = bancodedados.transferencias.find(
    (transferencia) => transferencia.numeroDaContaOrigem !== numeroDaConta
  );

  try {
    const novoBancoDeDados = {
      ...bancodedados,
      contas: filtrarContasQuePermanecem ? filtrarContasQuePermanecem : [],
      saques: filtrarSaquesQuePermanecem ? filtrarSaquesQuePermanecem : [],
      depositos: filtrarDepositosQuePermanecem
        ? filtrarDepositosQuePermanecem
        : [],
      transferencias: filtrarTransferenciasQuePermanecem
        ? filtrarTransferenciasQuePermanecem
        : [],
    };

    atualizarBancoDeDados(novoBancoDeDados);

    res.json({ message: "Conta excluída com sucesso!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "A um problema no servidor, estamos resolvendo " });
  }
}

async function depositar(req, res) {
  const { numeroDaConta, valor } = req.body;
  const analisandoTipoDosDadosDoDeposito =
    !analisandoTipagemDaVariavel("string", numeroDaConta) ||
    !analisandoTipagemDaVariavel("number", valor);

  if (!numeroDaConta || valor <= 0 || analisandoTipoDosDadosDoDeposito)
    return res.status(400).json({ message: "dados Do deposito Invalidos!" });

  const encontrarConta = bancoDeDados.contas.find(
    (conta) => conta.numero === numeroDaConta
  );

  if (!encontrarConta)
    return res.status(400).json({ message: "numero da conta incorreto" });

  const saldoEmContaAtualizado = encontrarConta.saldo + valor;

  encontrarConta.saldo = saldoEmContaAtualizado;

  const extratoDoDeposito = {
    data: dataAtual("yyyy-dd-MM  k:m:s"),
    numeroDaConta,
    valor,
  };

  try {
    bancoDeDados.depositos.push(extratoDoDeposito);

    await atualizarBancoDeDados(bancoDeDados);

    res.status(200).json({ mensagem: "Depósito realizado com sucesso!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "A um problema no servidor, estamos resolvendo " });
  }
}

async function sacar(req, res) {
  const { numeroDaConta, valor, senha } = req.body;
  const analisandoTipoDosDadosDoSaque =
    analisandoTipagemDaVariavel("string", numeroDaConta, senha) &&
    analisandoTipagemDaVariavel("number", valor);

  const encontrarConta = bancoDeDados.contas.find(
    (conta) => conta.numero === numeroDaConta
  );

  const verificarSenha = bancoDeDados.contas.find(
    (conta) => conta.usuario.senha === senha
  );

  if (!encontrarConta)
    return res.status(400).json({ message: "Número da conta incorreto" });

  if (!verificarSenha) {
    return res.status(400).json({ message: "A senha está incorreta" });
  }

  if (encontrarConta.saldo < valor) {
    return res.status(400).json({ message: "Valor insuficiente em conta." });
  }

  if (!encontrarConta || valor <= 0 || !analisandoTipoDosDadosDoSaque)
    return res.status(400).json({ message: "Dados do saque invalidos!" });

  const saldoEmContaAtualizado = encontrarConta.saldo - valor;

  encontrarConta.saldo = saldoEmContaAtualizado;

  const extratoDoSaque = {
    data: dataAtual("yyyy-dd-MM  k:m:s"),
    numeroDaConta,
    valor,
  };

  try {
    bancoDeDados.saques.push(extratoDoSaque);

    await atualizarBancoDeDados(bancoDeDados);

    res.status(200).json({ mensagem: "Saque realizado com sucesso!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "A um problema no servidor, estamos resolvendo " });
  }
}

async function transferir(req, res) {
  const {
    numeroDaContaOrigem,
    numeroDaContaDestino,
    SenhaDaContaOrigem,
    valor,
  } = req.body;

  const contas = bancoDeDados.contas;

  const contaDeOrigem = contas.find(
    (conta) => conta.numero === numeroDaContaOrigem
  );

  const contaDeDestino = contas.find(
    (conta) => conta.numero === numeroDaContaDestino
  );

  const checarSenha = contaDeOrigem.usuario.senha === SenhaDaContaOrigem;

  const checarContaDuplicada = numeroDaContaDestino === numeroDaContaOrigem;

  if (!contaDeDestino || !contaDeOrigem || checarContaDuplicada)
    return res.status(400).json({ message: "essa conta não existe! " });

  if (!checarSenha)
    return res.status(400).json({ message: "senha incorreta !" });

  if (contaDeOrigem.saldo < valor)
    return res.status(400).json({ message: "saldo insuficiente! " });

  const extratoDeTransferencia = {
    data: dataAtual(),
    numeroDaContaOrigem,
    numeroDaContaDestino,
    valor,
  };

  try {
    contaDeOrigem.saldo -= valor;
    contaDeDestino.saldo += valor;

    bancoDeDados.transferencias.push(extratoDeTransferencia);

    await atualizarBancoDeDados(bancoDeDados);

    res.status(200).json({ mensagem: "Transferência realizada com sucesso!" });
  } catch (error) {
    res.status(500).json({ mensagem: error });
  }
}

function saldo(req, res) {
  const { numeroDaConta, senha } = req.query;

  const checarConta = bancodedados.contas.find(
    (conta) => conta.numero === numeroDaConta
  );

  if (!checarConta)
    return res.status(400).json({ message: "numero da conta incorreto" });

  const checarSenha = checarConta.usuario.senha === senha;
  if (!checarSenha)
    return res.status(400).json({ message: "senha da conta incorreta" });

  try {
    return res.status(200).json({ saldo: `${checarConta.saldo}` });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "A um problema no servidor, estamos resolvendo " });
  }
}

function extrato(req, res) {
  const { numeroDaConta, senha } = req.query;

  const checarConta = bancoDeDados.contas.find(
    (conta) => conta.numero === numeroDaConta
  );

  if (!checarConta)
    return res.status(400).json({ message: "numero da conta incorreto" });

  const checarSenha = checarConta.usuario.senha === senha;

  if (!checarSenha)
    return res.status(400).json({ message: "senha da conta incorreta" });

  try {
    return res.status(200).json(criarExtrato(numeroDaConta));
  } catch (error) {
    return res
      .status(500)
      .json({ message: "A um problema no servidor, estamos resolvendo " });
  }
}

module.exports = {
  listarContas,
  criarConta,
  atualizarUsuario,
  excluirConta,
  depositar,
  sacar,
  transferir,
  saldo,
  extrato,
};
