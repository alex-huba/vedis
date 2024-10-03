require("dotenv").config();
const path = require("path");
const fs = require("fs");
const { validationResult } = require("express-validator");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

exports.update = async (req, res, next) => {
  // Check whether all user details are supplied
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).end();

  // Check whether user has sufficient rights
  if (!req.userId) return res.status(401).end();

  // Update user profile
  try {
    await User.update(
      req.userId,
      req.body.name,
      req.body.email,
      req.body.phoneNumber,
      req.body.timezone
    );

    // Generate a new jwt
    const token = jwt.sign(
      {
        id: req.userId,
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        role: req.body.role,
        timezone: req.body.timezone,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );

    res.status(200).json({
      token: token,
      user: {
        id: req.userId,
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        role: req.body.role,
        timezone: req.body.timezone,
      },
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.uploadPhoto = async (req, res, next) => {
  if (!req.file) return res.status(400).send("Фото не вдалося завантажити");
  res.status(204).end();
};

exports.getPhoto = async (req, res, next) => {
  let fileName = req.userId + ".png";
  let filePath = path.join(__dirname, "../uploads/avatars", fileName);

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      fileName = "default.png";
      filePath = path.join(__dirname, "../uploads/avatars", fileName);
    }

    res.sendFile(filePath, (err) => {
      if (err) return next(err);
    });
  });
};

exports.deletePhoto = async (req, res, next) => {
  const fileName = req.userId + ".png";
  let filePath = path.join(__dirname, "../uploads/avatars", fileName);

  // Check if the photo exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    // File doesn't exist, just do nothing
    if (err) return res.status(200).end();

    // File exists, delete the file
    fs.unlink(filePath, (err) => {
      if (err) return next(err);

      res.status(200).end();
    });
  });
};
