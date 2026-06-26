// server/config/env.js

import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

const schema = Joi.object({
  PORT: Joi.number().required(),

  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .required(),

  MONGO_URI: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),

  JWT_REFRESH_SECRET: Joi.string().required(),

  CLIENT_URL: Joi.string().required(),

  // Add the Pexels API Key to validation
  PEXELS_API_KEY: Joi.string().required()
}).unknown();

const { error, value } = schema.validate(process.env);

if (error) {
  throw new Error(`Environment Validation Error: ${error.message}`);
}

export default value;