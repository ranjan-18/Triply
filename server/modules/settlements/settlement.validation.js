// server/modules/settlements/settlement.validation.js

import Joi from "joi";

export const createSettlementSchema = Joi.object({
  paidBy: Joi.string().required(),
  paidTo: Joi.string().required(),
  amount: Joi.number().positive().required(),
  currency: Joi.string().optional(),
  proofImageUrl: Joi.string().optional(),
});
