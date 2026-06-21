import Joi from "joi";

export const createTripSchema =
  Joi.object({
    title: Joi.string()
      .min(3)
      .max(100)
      .required(),

    baseCurrency: Joi.string()
      .length(3)
      .required(),

    budget: Joi.number()
      .min(0)
      .optional(),
  });

export const joinTripSchema =
  Joi.object({
    inviteCode: Joi.string()
      .required(),
  });

export const updateTripSchema =
  Joi.object({
    title: Joi.string()
      .min(3)
      .max(100),

    budget: Joi.number().min(0),
  });