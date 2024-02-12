import { validateLogin, validateRegister } from "./authvalidation.js";

const registerValidation = (request, response, next) => {

    const validationErrors = validateRegister(request.body);
  
    if (Object.keys(validationErrors).length > 0) {
        response.status(412).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors,
      });
    }
     else {
      next();
    }
  };

  const logInValidation = (request, response, next) => {
    const validationErrors = validateLogin(request.body);
  
    if (Object.keys(validationErrors).length > 0) {
        response.status(412).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors,
      });
    }
     else {
      next();
    }
  };


export {registerValidation, logInValidation}