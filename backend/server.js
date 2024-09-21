require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

// Routes
const authRoutes = require("./routes/auth.routes");
const testRoutes = require("./routes/test.routes");
const studentRoutes = require("./routes/student.routes");
const classRoutes = require("./routes/class.routes");
const homeworkRoutes = require("./routes/homework.routes");
const dictionaryRoutes = require("./routes/dictionary.routes");
const applicationRoutes = require("./routes/application.routes");

// Middleware for errors
const errorController = require("./controllers/error.controller");

const port = process.env.PORT;

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

app.use("/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/homework", homeworkRoutes);
app.use("/api/dictionary", dictionaryRoutes);
app.use("/api/application", applicationRoutes);
app.use(errorController.get404);
app.use(errorController.get500);

app.listen(port, () => console.log(`Listening on port ${port}`));
