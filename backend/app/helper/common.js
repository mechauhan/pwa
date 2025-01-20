const randomstring = require("randomstring");

exports.catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.error(err);
    return next(err);
  });
};

exports.getOtp = async (num) => {
  return randomstring.generate({
    length: num,
    charset: "numeric",
  });
};

exports.sendResponse = (res, data, message, code) => {
  res.status(code||200).send({
    message,
    statusCode: code || 200,
    data,
  });
};

exports.sendMessageResponse = async (res, message, code) => {
  res.status(code||200).send({
    statusCode: code || 200,
    message,
  });
};
