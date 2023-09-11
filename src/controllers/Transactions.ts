import { Request, Response } from "express";
import { database } from "../database";
import { BadRequestError } from "../helpers/api-error";
import { analyzingVariableTyping, currentDate } from "../utils";

export class Transactions {
  deposit(req: Request, res: Response) {
    const { numberAccount, value }: { numberAccount: number; value: number } =
      req.body;

    const analyzingDepositDataType = !analyzingVariableTyping(
      "number",
      numberAccount,
      value
    );

    if (!numberAccount || +value <= 0 || analyzingDepositDataType) {
      throw new BadRequestError("dados Do deposito Invalidos!");
    }

    const accountFound = database.accounts.find(
      (account) => account.number === numberAccount
    );

    if (!accountFound) throw new BadRequestError("number da account incorreto");

    accountFound.balance += value;

    const extractFromDeposit = {
      date: currentDate("yyyy-dd-MM  k:m:s"),
      numberAccount,
      value,
    };

    database.deposits.push(extractFromDeposit);

    res.status(200).json({ mensagem: "Depósito realizado com sucesso!" });
  }

  ToWithdraw(req: Request, res: Response) {
    const {
      numberAccount,
      value,
      password,
    }: { numberAccount: number; value: number; password: string } = req.body;
    const analyzingDataTypeOfWithdrawal =
      analyzingVariableTyping("string", password) &&
      analyzingVariableTyping("number", numberAccount, value);

    const findAccount = database.accounts.find(
      (account) => account.number === numberAccount
    );

    const verifyPassword = database.accounts.find(
      (account) => account.user.password === password
    );

    if (!findAccount) throw new BadRequestError("Número da account incorreto");

    if (!verifyPassword) {
      throw new BadRequestError("A password está incorreta");
    }

    if (findAccount.balance < value) {
      throw new BadRequestError("Valor insuficiente em conta.");
    }

    if (!findAccount || value <= 0 || !analyzingDataTypeOfWithdrawal)
      throw new BadRequestError("Dados do saque invalidos!");

    findAccount.balance -= value;

    const extractFromWithdrawal = {
      date: currentDate("yyyy-dd-MM  k:m:s"),
      numberAccount,
      value,
    };

    database.withdrawals.push(extractFromWithdrawal);

    res.status(200).json({ mensagem: "Saque realizado com sucesso!" });
  }

  transfer(req: Request, res: Response) {
    const {
      numberAccountOrigin,
      numberAccountDestiny,
      passwordAccountOrigin,
      value,
    }: {
      numberAccountOrigin: number;
      numberAccountDestiny: number;
      passwordAccountOrigin: string;
      value: number;
    } = req.body;

    const accountOrigin = database.accounts.find(
      (account) => account.number === numberAccountOrigin
    );

    const accountDestiny = database.accounts.find(
      (account) => account.number === numberAccountDestiny
    );

    const checkAccountsAreEqual = numberAccountDestiny === numberAccountOrigin;

    if (!accountDestiny || !accountOrigin || checkAccountsAreEqual) {
      throw new BadRequestError("essa account não existe!");
    }

    const checkPassword = accountOrigin.user.password === passwordAccountOrigin;

    if (!checkPassword) {
      throw new BadRequestError("password incorreta !");
    }

    if (accountOrigin.balance < value) {
      throw new BadRequestError("balance insuficiente! ");
    }

    const extractTransfer = {
      date: String(new Date()),
      numberAccountOrigin,
      numberAccountDestiny,
      value,
    };

    accountOrigin.balance -= value;
    accountDestiny.balance += value;

    database.transfers.push(extractTransfer);

    res.status(200).json({ mensagem: "Transferência realizada com sucesso!" });
  }
}
