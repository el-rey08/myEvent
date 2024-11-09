const validation = require('@hapi/joi')
exports.singUpValidation = async (req, res, next)=>{
    const Schema = validation.object({
        userName: validation.string().required().trim().min(4).regex(/^[A-Za-z]+(?:[-' ]?[A-Za-z]+)*$/).message({
            "any.required": "Please provide fullName",
            "string.empty": "FullName cannot be empty",
            "string.min": "The minimum name must be at least 3 characters long",
            "string.pattern.base": "Full name should only contain letters, spaces, hyphens, or apostrophes",
        }),
        email: validation
    .string()
    .email()
    .min(7)
    .required()
    .messages({
      "any.required": "please provide your email address",
      "string.empty": "email cannot be empty",
      "string.email":
        "invalid email format. please enter a valid email address",
    }),
    password: validation
      .string()
      .required()
      .min(8)
      .max(50)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{8,50}$/
      )
      .messages({
        "any.required": "Please enter school password",
        "string.pattern.base":
          "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
        "string.empty": "Password cannot be empty",
        "string.min": "Password must be at least 8 characters long",
        "string.max": "Password cannot be longer than 50 characters",
      }),
      picture: validation
      .string()
    })
    const { error } = Schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }
  next();
};

exports.logInValidator = async (req, res, next) => {
    const Schema = validation.object({
    email: validation
        .string()
        .email()
        .lowercase()
        .min(7)
        .required()
        .messages({
          "any.required": "Please provide school email address",
          "string.empty": "Email cannot be empty",
          "string.email": "Invalid email format. Please enter a valid email address",
        }),
      password: validation
        .string()
        .required()
        .min(8)
        .max(50)
        .messages({
          "any.required": "Please enter school password",
          "string.empty": "Password cannot be empty",
          "string.min": "Password must be at least 8 characters long",
          "string.max": "Password cannot be longer than 50 characters",
        }),
    });
  
    const { error } = Schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    next();
  };