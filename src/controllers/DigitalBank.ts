import { Request, Response } from "express";
import { database } from "../database";
import { BadRequestError } from "../helpers/api-error";
import { AccountType, User } from "../types/accountType";
import { criarExtrato } from "../utils";

export class DigitalBank {
  listAccounts(req: Request, res: Response) {
    const { senha_banco: password } = req.query;

    const checkPassword = password === database.bank.password;

    if (!checkPassword) throw new BadRequestError("Senha do banco incorreta");

    return res.status(200).json(database.accounts);
  }

  createAccount(req: Request, res: Response) {
    const { name, cpf, email, telephone, password }: User = req.body;
    const checkData = !!database.accounts.find(
      (account) => account.user.email === email || account.user.cpf === cpf
    );

    if (checkData) {
      throw new BadRequestError(" Essa conta ja existe !");
    }

    const newAccount: AccountType = {
      number: database.accounts.length ?? 1,
      balance: 0,
      user: {
        name,
        cpf,
        telephone,
        email,
        password,
      },
    };
    database.accounts.push(newAccount);

    newAccount.user.password = "";
    res.status(200).json(newAccount);
  }

  updateAccount(req: Request, res: Response) {
    const { numeroDaConta: numberAccount } = req.params;
    const { name, cpf, telephone, email, password }: User = req.body;

    const checkAccountExistence = database.accounts.find(
      (account) => account.number === +numberAccount
    );

    if (!checkAccountExistence) {
      throw new BadRequestError("Conta não encontrada");
    }

    const checkData = !!database.accounts.find(
      (account) => account.user.email === email || account.user.cpf === cpf
    );

    if (checkData) {
      throw new BadRequestError("Essa conta já existe");
    }

    const newUpdateAccount: AccountType = {
      ...checkAccountExistence,
      user: {
        name,
        cpf,
        telephone,
        email,
        password,
      },
    };

    const positionAccount = database.accounts.indexOf(checkAccountExistence);

    database.accounts.splice(positionAccount, 1, newUpdateAccount);

    res.status(200).json({ mensagem: "Conta atualizada com sucesso!" });
  }

  deleteAccount(req: Request, res: Response) {
    const { numberAccount } = req.params;

    const verificarConta = database.accounts.find(
      (account) => account.number === +numberAccount
    );

    if (!verificarConta) {
      throw new BadRequestError("Essa conta não existe");
    }

    if (verificarConta.balance !== 0) {
      throw new BadRequestError(
        "Sua conta nessecita estar zerada para que seja excluida"
      );
    }

    const filterLootThatRemains = database.accounts.filter(
      (account) => account.number !== +numberAccount
    );

    const filterLootsThatRemain = database.withdrawals.filter(
      (withdrawal) => withdrawal.numberAccount !== +numberAccount
    );

    const filterDepositsThatRemain = database.deposits.filter(
      (deposit) => deposit.numberAccount !== +numberAccount
    );

    const filterTransfersThatRemain = database.transfers.filter(
      (transfer) => transfer.numberAccountOrigin !== +numberAccount
    );

    const novodatabase = {
      ...database,
      accounts: filterLootThatRemains ?? [],
      withdrawals: filterLootsThatRemain ?? [],
      deposits: filterDepositsThatRemain ?? [],
      transfers: filterTransfersThatRemain ?? [],
    };

    Object.assign(database, novodatabase);

    res.json("Conta excluida com sucesso!");
  }

  balance(req: Request, res: Response) {
    const { numero_conta: numberAccount, senha: password } = req.query;

    if (!numberAccount || !password)
      throw new BadRequestError("os campos precisam ser preenchidos!");

    const checkAccout = database.accounts.find(
      (account) => account.number === +numberAccount
    );

    if (!checkAccout) {
      throw new BadRequestError("numero da conta incorreto");
    }

    const checkPassword = checkAccout.user.password === password;
    if (!checkPassword) {
      throw new BadRequestError("senha da conta incorreta");
    }

    return res.status(200).json({ balance: `${checkAccout.balance}` });
  }

  extract(req: Request, res: Response) {
    const { numero_conta: numberAccount, senha: password } = req.query;

    if (!numberAccount || !password) {
      throw new BadRequestError("Os campos precisam ser preenchido!");
    }

    const checkAccout = database.accounts.find(
      (account) => account.number === +numberAccount
    );

    if (!checkAccout) {
      throw new BadRequestError("numero da conta incorreto");
    }

    const checkPassword = checkAccout.user.password === password;

    if (!checkPassword) {
      throw new BadRequestError("senha da conta incorreta");
    }
    return res.status(200).json(criarExtrato(+numberAccount));
  }
}
