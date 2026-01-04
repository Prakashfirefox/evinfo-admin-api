import { ERROR_MESSAGE } from "../constants";


class AppError extends Error {
  statusCode: number;
  data: any;
 
  constructor(
    message: string,
    data = {},
    statusCode = 500,
    
  ) {
    super(message);
    if (statusCode === 500) {
      this.message = ERROR_MESSAGE.GENERAL_ERROR;
    }
    if (typeof data === "object" && Object.keys(data).length !== 0) {
      this.data = data;
    }

    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
 
  }
}

export default AppError;
