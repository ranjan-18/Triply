// server/modules/expenses/ocr.controller.js

import catchAsync from "../../utils/catchAsync.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { scanReceipt } from "./ocr.service.js";

export const scanReceiptController = catchAsync(async (req, res) => {
  if (!req.file) {
    const error = new Error("Please upload an image file");
    error.statusCode = 400;
    throw error;
  }

  const result = await scanReceipt(req.file.path);

  return res.status(200).json(
    apiResponse(true, "Receipt scanned successfully", result)
  );
});
