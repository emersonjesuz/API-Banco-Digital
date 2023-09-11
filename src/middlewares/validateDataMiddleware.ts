import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { analyzingVariableTyping } from "../utils";

type FormAccount = {
  name: string;
  cpf: string;
  email: string;
  telephone: string;
  password: string;
};

export const valideteFormAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, cpf, email, telephone, password }: FormAccount = req.body;

  const verifyingToPossesCharacterCpf = isNaN(+cpf);

  if (verifyingToPossesCharacterCpf && cpf) {
    return res.status(400).json({ message: "Formato do CPF Incorreto!" });
  }

  try {
    const valideteInput = Joi.object({
      name: Joi.string().required().messages({
        "any.required": "O campo Nome precisa ser preencido !",
        "string.empty": "O campo Nome precisa ser preencido !",
      }),
      email: Joi.string().email().required().messages({
        "any.required": "O campo Email precisa ser preencido !",
        "string.empty": "O campo Email precisa ser preencido !",
        "string.email": "Formato do Email Incorreto!",
      }),
      telephone: Joi.string().min(9).max(11).required().messages({
        "any.required": "O campo Telefone precisa ser preencido !",
        "string.empty": "O campo Telefone precisa ser preencido !",
        "string.min": "O Telefone Precisa ter no minimo 9 caracteres!",
        "string.max": "O Telefone precisa ter no maximo 11 caracteres!",
      }),
      cpf: Joi.string().length(11).required().messages({
        "any.required": "O campo CPF precisa ser preencido !",
        "string.empty": "O campo CPF precisa ser preencido !",
        "string.length": "Formato do CPF Incorreto!",
      }),
      password: Joi.string().min(8).required().messages({
        "any.required": "O campo Senha precisa ser preencido !",
        "string.empty": "O campo Senha precisa ser preencido !",
        "string.length": "Senha precisa ter no minimo 8 caracteres!",
      }),
    });

    await valideteInput.validateAsync({
      name,
      cpf,
      email,
      telephone,
      password,
    });

    next();
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

type transferForm = {
  numberAccountOrigin: number;
  numberAccountDestiny: number;
  passwordAccountOrigin: string;
  value: number;
};

export const checkingTransferForm = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    numberAccountOrigin,
    numberAccountDestiny,
    passwordAccountOrigin,
    value,
  }: transferForm = req.body;

  const analisandoFormulario =
    !numberAccountOrigin ||
    !numberAccountDestiny ||
    !passwordAccountOrigin ||
    value <= 0;

  if (analisandoFormulario) {
    return res
      .status(400)
      .json({ message: "dados da transferencia invalidos" });
  }

  const TypingDataTransfer =
    analyzingVariableTyping(
      "string",
      numberAccountDestiny,
      numberAccountOrigin,
      passwordAccountOrigin
    ) || analyzingVariableTyping("number", value);

  if (!TypingDataTransfer) {
    return res
      .status(400)
      .json({ message: "dados da transferencia invalidos" });
  }

  next();
};
