require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

// Routes
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");

// Middleware for errors
const errorController = require("./controllers/errorController");

const ports = process.env.PORT;

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
app.use("/post", postRoutes);
app.use(errorController.get404);
app.use(errorController.get500);

app.listen(ports, () => console.log(`Listening on port ${ports}`));
