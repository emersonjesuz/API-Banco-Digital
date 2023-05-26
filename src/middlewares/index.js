const { analisandoTipagemDaVariavel } = require("../utils");

const verificandoFormularioDaConta = (req, res, next) => {
  const { nome, cpf, email, data_nascimento, telefone, senha } = req.body;

  const analisandoDadosFormulario =
    nome && cpf && email && data_nascimento && telefone && senha;

  const tipagem = analisandoTipagemDaVariavel(
    "string",
    nome,
    cpf,
    email,
    data_nascimento,
    telefone,
    senha
  );

  if (!analisandoDadosFormulario) {
    return res
      .status(400)
      .json({ message: "preencha todos os campos do formulario" });
  }

  if (!tipagem) {
    return res
      .status(400)
      .json({ message: "dados informando são  invalido" });
  }

  const caracteresInvalidosNoCpf =
    cpf.indexOf("-") !== -1 || cpf.indexOf(".") !== -1;

  if (cpf.length < 10 || cpf.length > 11 || caracteresInvalidosNoCpf) {
    return res.status(400).json({ message: "CPF invalido" });
  }

  if (senha.length < 8) {
    return res
      .status(400)
      .json({ message: "senha precisa ter no minimo 8 caracteres" });
  }

  next();
};

const verificandoFormularioDeTransferencia = (req, res, next) => {
  const {
    numeroDaContaOrigem,
    numeroDaContaDestino,
    SenhaDaContaOrigem,
    valor,
  } = req.body;

  const analisandoFormulario =
    !numeroDaContaOrigem &&
    !numeroDaContaDestino &&
    !SenhaDaContaOrigem &&
    valor <= 0;

  if (analisandoFormulario) {
    return res
      .status(400)
      .json({ message: "dados da transferencia invalidos" });
  }

  const tipagemDoDadoTranferencia = {
    tipoString: analisandoTipagemDaVariavel(
      "string",
      numeroDaContaDestino,
      numeroDaContaOrigem,
      SenhaDaContaOrigem
    ),
    tipoNumber: analisandoTipagemDaVariavel("number", valor),
  };

  if (
    !tipagemDoDadoTranferencia.tipoString ||
    !tipagemDoDadoTranferencia.tipoNumber
  ) {
    return res
      .status(400)
      .json({ message: "dados da transferencia invalidos" });
  }

  next();
};

module.exports = {
  verificandoFormularioDaConta,
  verificandoFormularioDeTransferencia,
};
