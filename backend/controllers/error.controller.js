const logger = require("../util/logger");

exports.get404 = (req, res, next) => {
  const error = new Error("Нічого не знайдено");
  error.statusCode = 404;
  next(error);
};

exports.get500 = (error, req, res, next) => {
  logger.warn(`${error.statusCode || 500} - ${error.message}`);
  res.status(error.statusCode || 500);
  res.json({ message: error.message });
};
