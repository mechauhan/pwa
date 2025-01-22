const jwt = require("jsonwebtoken");
const { config } = require("../Config/constant/infoConstants");

exports.jwtSign = async (userEmail) => {
  try {
    console.log("userEmail", userEmail, process.env.USER);

    let secretKey = process.env.USER;

    return jwt.sign(
      userEmail,
      secretKey
    );
  } catch (error) {
    console.log(error);
    return false;
  }
};

exports.userAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; // Look for 'Authorization' header

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .send({ message: "Authorization header missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.USER, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Invalid token" });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
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
