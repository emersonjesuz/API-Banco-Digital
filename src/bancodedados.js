module.exports = {
  banco: {
    nome: "Cubos Bank",
    numero: "123",
    agencia: "0001",
    senha: "Cubos123Bank",
  },
  contas: [
    {
      numero: "1",
      saldo: 0,
      usuario: {
        nome: "allan",
        cpf: "12242678941",
        telefone: "75998795393",
        email: "josiemerson11013@gmail.com",
        senha: "lop54321",
      },
    },
    {
      numero: "2",
      saldo: 13000,
      usuario: {
        nome: "Gabriel",
        cpf: "5418545841",
        telefone: "51459419643",
        email: "gabriel@gmail.com",
        senha: "lop54321",
      },
    },
  ],
  saques: [{ data: "2023-04-05  15:51:42", numeroDaConta: "1", valor: 200 }],
  depositos: [
    { data: "2023-30-04  10:23:7", numeroDaConta: "1", valor: 10000 },
    { data: "2023-30-04  10:25:14", numeroDaConta: "2", valor: 10000 },
  ],
  transferencias: [
    {
      data: "2023-30-04  10:24:38",
      numeroDaContaOrigem: "1",
      numeroDaContaDestino: "2",
      valor: 400,
    },
    {
      data: "2023-30-04  10:24:51",
      numeroDaContaOrigem: "2",
      numeroDaContaDestino: "1",
      valor: 400,
    },
  ],
};
