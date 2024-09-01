require("dotenv").config();
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");

const User = require("../models/user.model");

exports.signup = async (req, res, next) => {
  // Check validation of request body
  const validationRes = validationResult(req);
  if (!validationRes.isEmpty()) {
    let resErrors = [];
    validationRes.errors.forEach((e) => {
      resErrors.push({
        field: e.param,
        error: e.msg,
      });
    });

    if (
      validationRes.errors.some((e) => e.msg === "Email address already exist")
    ) {
      return res.status(422).json({ msg: "Email address already exists" });
    }

    return res
      .status(400)
      .json({ msg: "User not registered", errors: resErrors });
  }

  // Extract params from request body
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const phone = req.body.phone;

  // Save a new user w/ hashed pwd to db
  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const userId = uuid.v4();
    const userDetails = {
      id: userId,
      name: name,
      email: email,
      password: hashedPassword,
      phone: phone,
    };

    await User.save(userDetails);

    res.status(201).json({ msg: "user created" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  // Extract params from request body
  const email = req.body.email;
  const password = req.body.password;

  // Find user by email in db
  try {
    const user = await User.findByEmail(email);

    // Check whether user is found. If not -> throw an error
    if (user[0].length !== 1) {
      const error = new Error("User with this email not found");
      error.statusCode = 401;
      throw error;
    }

    // Extract user from db
    const storedUser = user[0][0];

    // Check whether stored and supplied pwds are equal
    const isEqual = await bcrypt.compare(password, storedUser.password);

    // Throw an error if pwds are not equal
    if (!isEqual) {
      const error = new Error("Wrong password");
      error.statusCode = 401;
      throw error;
    }

    // Generate jwt
    const token = jwt.sign(
      {
        id: storedUser.id,
        name: storedUser.name,
        email: storedUser.email,
        role: storedUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );
    res.status(200).json({
      token: token,
      user: {
        id: storedUser.id,
        name: storedUser.name,
        email: storedUser.email,
        role: storedUser.role,
      },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.verifyToken = async (req, res, next) => {
  // Extract jwt from request body
  const token = req.body.token;

  // If jwt is not provided -> return 401 Unauthorized
  if (!token) {
    res.status(401).end();
    return;
  }

  // Verify jwt
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    res.status(401).end();
    return;
  }

  // If jwt is not valid -> return 401 Unauthorized
  if (!decodedToken) {
    res.status(401).end();
    return;
  }

  res.status(200).json({
    user: {
      id: decodedToken.id,
      name: decodedToken.name,
      email: decodedToken.email,
      role: decodedToken.role,
    },
  });
};

// Check whether user has teacher rights
exports.verifyTeacherRole = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    err.statusCode = 401;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }
  if (decodedToken.role !== "teacher") {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }
};
