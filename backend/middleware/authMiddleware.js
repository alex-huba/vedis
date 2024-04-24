require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // Extract authorization header
  const authHeader = req.get("Authorization");

  // If authorization header is not provided -> return 401 Unauthorized
  if (!authHeader) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }

  // Extract jwt from authorization header
  const token = authHeader.split(" ")[1];
  
  // Verify jwt
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    err.statusCode = 401;
    throw err;
  }

  // If jwt is not valid -> return 401 Unauthorized
  if (!decodedToken) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }

  req.isLoggedIn = true;
  req.userId = decodedToken.userId;
  req.email = decodedToken.email;
  next();
};
