require("dotenv").config();
const { validationResult } = require("express-validator");
const { sendEmail } = require("../middleware/email-sender");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

exports.signup = async (req, res, next) => {
  // Check validation of request body for errors
  const validationRes = validationResult(req);
  if (!validationRes.isEmpty()) {
    let resErrors = [];
    validationRes.errors.forEach((e) => {
      resErrors.push({
        field: e.param,
        error: e.msg,
      });
    });

    return res
      .status(400)
      .json({ message: "Користувача не зареєстровано", errors: resErrors });
  }

  // Save a new user w/ hashed pwd to db
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const userDetails = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      phoneNumber: req.body.phoneNumber,
      timezone: req.body.timezone,
    };

    await User.save(userDetails);

    res.status(201).json({ msg: "Користувача створено" });
  } catch (err) {
    if (err.code == "ER_DUP_ENTRY") {
      err.statusCode = 400;
      err.message = "Профіль з такими контактними даними вже існує";
    }
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    // Check validation of request body for errors
    const validationRes = validationResult(req);
    if (!validationRes.isEmpty()) {
      const error = new Error("Некоректні дані для логіну");
      error.statusCode = 400;
      throw error;
    }

    // Find user by email in db
    const [user] = await User.findByEmail(req.body.email);

    // Check whether user is found. If not -> throw an error
    if (user.length !== 1) {
      const error = new Error("Профіль не знайдено");
      error.statusCode = 401;
      throw error;
    }

    // Extract user from db
    const storedUser = user[0];

    // Check whether stored and supplied passwords are equal
    const isEqual = await bcrypt.compare(
      req.body.password,
      storedUser.password
    );

    // Throw an error if pwds are not equal
    if (!isEqual) {
      const error = new Error("Неправильний пароль");
      error.statusCode = 401;
      throw error;
    }

    if (storedUser.role == "pending") {
      const error = new Error("Вашу заявку ще не розглянули");
      error.statusCode = 401;
      throw error;
    }

    // Generate jwt
    const token = jwt.sign(
      {
        id: storedUser.id,
        name: storedUser.name,
        email: storedUser.email,
        phoneNumber: storedUser.phoneNumber,
        role: storedUser.role,
        timezone: storedUser.timezone,
      },
      process.env.JWT_SECRET,
      { expiresIn: "60m" }
    );

    res.status(200).json({
      token: token,
      user: {
        id: storedUser.id,
        name: storedUser.name,
        email: storedUser.email,
        phoneNumber: storedUser.phoneNumber,
        role: storedUser.role,
        timezone: storedUser.timezone,
      },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Check token on the start of the app in case user re-open tab
exports.verifyToken = async (req, res, next) => {
  // If jwt is not provided -> return 401 Unauthorized
  if (!req.body.token) {
    res.status(401).end();
    return;
  }

  // Verify jwt
  let decodedToken;
  try {
    decodedToken = jwt.verify(req.body.token, process.env.JWT_SECRET);
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
      phoneNumber: decodedToken.phoneNumber,
      role: decodedToken.role,
      timezone: decodedToken.timezone,
    },
  });
};

// exports.generateLink = async (req, res, next) => {
//   // Check validation of request body for errors
//   const validationRes = validationResult(req);
//   if (!validationRes.isEmpty()) {
//     let resErrors = [];
//     validationRes.errors.forEach((e) => {
//       resErrors.push({
//         field: e.param,
//         error: e.msg,
//       });
//     });

//     return res.status(400).json({
//       msg: "Електронну пошту не надано",
//       errors: resErrors,
//     });
//   }

//   // Find user by email in db
//   try {
//     const [user] = await User.findByEmail(req.body.email);

//     // Check whether user is found. If not -> throw an error
//     if (user.length !== 1) {
//       const error = new Error(
//         "Користувача з цією електронною поштою не знайдено"
//       );
//       error.statusCode = 404;
//       throw error;
//     }

//     // Extract user from db
//     const storedUser = user[0];

//     // Create a one-time link
//     const secret = process.env.JWT_SECRET + storedUser.password;
//     const payload = {
//       id: storedUser.id,
//       email: storedUser.email,
//     };

//     const token = jwt.sign(payload, secret, {
//       expiresIn: "15m",
//     });

//     const link = `http://localhost:3001/auth/reset/password/${storedUser.id}/${token}`;

//     sendEmail(storedUser.email, link);

//     res.status(200).end();
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

// exports.resetPassword = async (req, res, next) => {
//   // Check validation of request body for errors
//   const validationRes = validationResult(req);
//   if (!validationRes.isEmpty()) {
//     let resErrors = [];
//     validationRes.errors.forEach((e) => {
//       resErrors.push({
//         field: e.param,
//         error: e.msg,
//       });
//     });

//     return res.status(400).json({
//       errors: resErrors,
//     });
//   }

//   try {
//     // Find user by id
//     const [user] = await User.findById(req.params.id);

//     if (user.length !== 1) {
//       const error = new Error("Користувача не знайдено");
//       error.statusCode = 404;
//       throw error;
//     }

//     // Extract user from db
//     const storedUser = user[0];

//     const secret = process.env.JWT_SECRET + storedUser.password;

//     const payload = jwt.verify(req.params.token, secret);

//     const hashedPassword = await bcrypt.hash(req.body.password, 12);

//     await User.changePassword(storedUser.id, hashedPassword);

//     return res.status(204).end();
//   } catch (err) {
//     if (!err.statusCode) err.statusCode = 500;
//     next(err);
//   }
// };
