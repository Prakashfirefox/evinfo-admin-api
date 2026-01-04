import { ValidationError } from "class-validator";
import AppError from "./error-handler";

class ValidationErrorHandler {
  static handlerError(
    errors: ValidationError[],
    errMsg: string,
    statusCode: number = 400
  ) {
    if (errors.length !== 0) {
      let modifiedErrResponse = errors.map((err: ValidationError) => {
        const { property, constraints } = err;
        
        // Check if constraints exist and has at least one key
        if (!constraints || Object.keys(constraints).length === 0) {
          return {
            parameter: property,
            message: "Validation error"
          };
        }

        // Get the first constraint message
        const firstConstraintKey = Object.keys(constraints)[0];
        const message = constraints[firstConstraintKey];
        
        return {
          parameter: property,
          message: message || "Validation error"
        };
      });

      throw new AppError(errMsg, modifiedErrResponse, statusCode);
    }
  }
}

export default ValidationErrorHandler;