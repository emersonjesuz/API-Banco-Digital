export type AccountType = {
  number: number;
  balance: number;
  user: User;
};

export type User = {
  name: string;
  cpf: string;
  telephone: string;
  email: string;
  password: string;
};
