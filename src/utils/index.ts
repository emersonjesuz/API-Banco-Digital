import { database } from "../database";

import { format } from "date-fns";

export function analyzingVariableTyping(type: string, ...variables: any[]) {
  return variables.every((variable) => typeof variable === type);
}

export function currentDate(data?: string) {
  return format(new Date(), data ?? "");
}

export function criarExtrato(numberAccount: number) {
  const { deposits, withdrawals, transfers } = database;

  const filterDeposits = deposits.filter(
    (deposit) => deposit.numberAccount === numberAccount
  );
  const filterWithdrawals = withdrawals.filter(
    (withdrawal) => withdrawal.numberAccount === numberAccount
  );
  const filterTransferenceEffected = transfers.filter(
    (transfer) => transfer.numberAccountOrigin === numberAccount
  );
  const filterTransferReceived = transfers.filter(
    (transfer) => transfer.numberAccountDestiny === numberAccount
  );

  const gerarExtrato = {
    deposits: filterDeposits ?? [],
    withdrawals: filterWithdrawals ?? [],
    transferenciasEnviadas: filterTransferenceEffected ?? [],
    transferenciasRecebidas: filterTransferReceived ?? [],
  };

  return gerarExtrato;
}
