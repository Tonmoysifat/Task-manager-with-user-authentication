const jwt = require("jsonwebtoken");
exports.verifyUser = (req, res, next) => {
  let token = req.headers["token"];
  jwt.verify(token, "SecretKey123", (err, decodedData) => {
    if (err) {
      res.status(401).json({ status: "unauthorized", data: err });
    } else {
      let email = decodedData["data"];
      req.headers.email = email;
      next();
    }
  });
};
