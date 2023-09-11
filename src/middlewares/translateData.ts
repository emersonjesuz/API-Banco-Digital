import { NextFunction, Request, Response } from "express";

type Data = {
  nome?: string;
  telefone?: string;
  valor?: number;
  senha?: string;
  numeroDaConta?: number;
  numeroDaContaDestino?: number;
  numeroDaContaOrigem?: number;
  senhaDaContaOrigem?: string;
};

export function translateData(req: Request, res: Response, next: NextFunction) {
  const data: Data = req.body;
  const translate = {
    name: "nome",
    telephone: "telefone",
    value: "valor",
    password: "senha",
    numberAccount: "numeroDaConta",
    numberAccountDestiny: "numeroDaContaDestino",
    numberAccountOrigin: "numeroDaContaOrigem",
    passwordAccountOrigin: "senhaDaContaOrigem",
  };

  let translateKeysToENG = {};

  if (!Object.keys(data).length) {
    next();
  }

  for (let item of Object.entries(data)) {
    const itenTranslating = Object.entries(translate).find(
      (value) => value[1] === item[0]
    );

    if (itenTranslating) {
      translateKeysToENG = {
        ...translateKeysToENG,
        [itenTranslating[0]]: item[1],
      };
    }

    translateKeysToENG = {
      ...translateKeysToENG,
      [item[0]]: item[1],
    };
  }

  req.body = translateKeysToENG;

  next();
}
