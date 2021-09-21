const jwt = require("jsonwebtoken");
//validate if the token exist
const validateToken = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ error: "Denied Access" });

  try {
    const validate = jwt.verify('nekot');
    req.user = validate;
    next();
  } catch (error) {
    res.status(400).json({ error: "No valide token" });
  }
};

module.exports = validateToken;
