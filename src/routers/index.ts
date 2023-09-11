import express from "express";
import { DigitalBank } from "../controllers/DigitalBank";
import { Transactions } from "../controllers/Transactions";
import {
  valideteFormAccount,
  checkingTransferForm,
} from "../middlewares/validateDataMiddleware";

const router = express.Router();
const digitalBank = new DigitalBank();
const transactions = new Transactions();
router.get("/contas", digitalBank.listAccounts);

router.get("/contas/saldo", digitalBank.balance);

router.get("/contas/extrato", digitalBank.extract);

router.post("/contas/cadastro", valideteFormAccount, digitalBank.createAccount);

router.put(
  "/contas/atualizar/:numeroDaConta",
  valideteFormAccount,
  digitalBank.updateAccount
);

router.delete("/contas/deletar/:numeroDaConta", digitalBank.deleteAccount);

router.post("/transacoes/depositar", transactions.deposit);

router.post("/transacoes/sacar", transactions.ToWithdraw);

router.post(
  "/transacoes/transferir",
  checkingTransferForm,
  transactions.transfer
);

export default router;
