export const database = {
  bank: {
    name: "Cubos Bank",
    number: "123",
    agency: "0001",
    password: "Cubos123Bank",
  },
  accounts: [
    {
      number: 1,
      balance: 0,
      user: {
        name: "allan",
        cpf: "12242678941",
        telephone: "75998795393",
        email: "josiemerson11013@gmail.com",
        password: "lop54321",
      },
    },
    {
      number: 2,
      balance: 13000,
      user: {
        name: "Gabriel",
        cpf: "5418545841",
        telephone: "51459419643",
        email: "gabriel@gmail.com",
        password: "lop54321",
      },
    },
  ],
  withdrawals: [{ date: "2023-04-05  15:51:42", numberAccount: 1, value: 200 }],
  deposits: [
    { date: "2023-30-04  10:23:7", numberAccount: 1, value: 10000 },
    { date: "2023-30-04  10:25:14", numberAccount: 2, value: 10000 },
  ],
  transfers: [
    {
      date: "2023-30-04  10:24:38",
      numberAccountOrigin: 1,
      numberAccountDestiny: 2,
      value: 400,
    },
    {
      date: "2023-30-04  10:24:51",
      numberAccountOrigin: 2,
      numberAccountDestiny: 1,
      value: 400,
    },
  ],
};
