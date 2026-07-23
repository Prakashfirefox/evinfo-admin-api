// src/api/middlewares/validateRequest.ts
const Joi = require('joi');

export const validateRequest = (schemas: any) => {
  return (req: any, res: any, next: any) => {
    try {
      console.log("Request body:", req.body);
      console.log("Request query:", req.query);
      console.log("Request params:", req.params);
      if (schemas.body) {
        const result = schemas.body.validate(req.body, { stripUnknown: true });
        if (result.error) throw result.error;
        req.validatedBody = result.value;
      }

      if (schemas.query) {
        const result = schemas.query.validate(req.query, { stripUnknown: true });
        if (result.error) throw result.error;
        req.validatedQuery = result.value;
      }

      if (schemas.params) {
        const result = schemas.params.validate(req.params, { stripUnknown: true });
        if (result.error) throw result.error;
        req.validatedParams = result.value;
      }

      next();
    } catch (error: any) {
      return res.status(400).json({
        error: error?.details?.[0]?.message || error.message || "Validation error",
      });
    }
  };
};
