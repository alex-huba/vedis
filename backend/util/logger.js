const { createLogger, transports, format } = require("winston");

const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: () => new Date().toISOString().slice(0, 19),
    }),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new transports.File({ filename: "logs/app.log", level: "info" }),
    new transports.Console(),
  ],
});

module.exports = logger;
