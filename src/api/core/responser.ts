import { Response } from "express";
import { ERROR_MESSAGE } from "../constants";

class Responser {
  static success(
    res: Response,
    status: boolean,
    message: string,
    data: any,
    statusCode = 200
  ) {
    return res.status(statusCode).json({ status, message, data });
  }

  static error(res: Response, status: boolean, error: any) {
    const statusCode = error.statusCode || 500;
    const message =
      statusCode === 500
        ? error.message || ERROR_MESSAGE.GENERAL_ERROR
        : error.message;
    const responseData: any = { status, message };
    if (
      typeof error.data === "object" &&
      Object.keys(error.data).length !== 0
    ) {
      responseData.data = error.data;
    }
    console.log(responseData)
    return res.status(statusCode).json(responseData);
  }
}

export default Responser;
