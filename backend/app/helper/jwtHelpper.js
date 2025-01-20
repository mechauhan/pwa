const jwt = require("jsonwebtoken");
const { config } = require("../Config/constant/infoConstants");

exports.jwtSign = async (userEmail) => {
  try {
    console.log("userEmail", userEmail, process.env.USER);

    let secretKey = process.env.USER;

    return jwt.sign(
      {
        userEmail,
      },
      secretKey
    );
  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.userAuth = (req, res, next) => {
  try {
    console.log(req.headers.accesstoken);

    let token = req.headers.accesstoken;
    jwt.verify(token, process.env.USER, (err, decode) => {
      if (err) return res.status(401).send({ message: "Invalid token" });
      req.user = decode;
      next();
      return;
    });
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

exports.vendorAuth = (req, res, next) => {
  try {
    let token = req.headers.accesstoken;
    jwt.verify(token, process.env.VENDOR, (err, decode) => {
      if (err) return res.status(401).send({ message: "Invalid token" });
      req.user = decode;
      next();
      return;
    });
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

exports.adminAuth = (req, res, next) => {
  try {
    let token = req.headers.accesstoken;
    jwt.verify(token, process.env.ADMIN, (err, decode) => {
      if (err) return res.status(401).send({ message: "Invalid token" });
      req.user = decode;
      next();
      return;
    });
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};
