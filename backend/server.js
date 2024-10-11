require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const logger = require("./util/logger");

// Routes
const authRoutes = require("./routes/auth.routes");
const testRoutes = require("./routes/test.routes");
const studentRoutes = require("./routes/student.routes");
const classRoutes = require("./routes/class.routes");
const homeworkRoutes = require("./routes/homework.routes");
const dictionaryRoutes = require("./routes/dictionary.routes");
const applicationRoutes = require("./routes/application.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const userRoutes = require("./routes/user.routes");
const libraryRoutes = require("./routes/library.routes");

// Middleware for errors
const errorController = require("./controllers/error.controller");

const port = process.env.PORT;
const host = process.env.HOST;

const app = express();
app.use(bodyParser.json());

// Middleware for CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Accept, X-Custom-Header, Authorization"
  );
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// Create custom Morgan tokens for request params and body
morgan.token("params", (req) => JSON.stringify(req.params));

// Create a stream object for Morgan that writes into Winston's logger
const morganStream = {
  write: (message) => logger.info(message.trim()),
};

// Use Morgan to log HTTP requests with custom tokens
app.use(
  morgan(":method :url :status - params: :params", {
    stream: morganStream,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/homework", homeworkRoutes);
app.use("/api/dictionary", dictionaryRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/library", libraryRoutes);
app.use(errorController.get404);
app.use(errorController.get500);

app.listen(port, () => logger.info(`🚀 @ ${host}:${port}`));
