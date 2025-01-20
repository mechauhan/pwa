// const joi = require("joi");

const joi = require("@hapi/joi");

exports.sendOtp = (req, res, next) => {
  const schema = joi.object({
    field: [joi.string().email().lowercase(), joi.string().min(7).max(13)],
  });
  const validation = schema.validate(req.body);
  let { error } = validation;

  if (error) {
    error.status = 422;
    next(error);
  }
  next();
};


exports.login = (req, res, next) => {
    const schema = joi.object({
      field: [joi.string().email().lowercase(), joi.string().min(7).max(13)],
      otp:joi.string().required().length(6)
    });
    const validation = schema.validate(req.body);
    let { error } = validation;
  
    if (error) {
      error.status = 422;
      next(error);
    }
    next();
  };
  