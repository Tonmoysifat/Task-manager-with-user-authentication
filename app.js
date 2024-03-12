const express = require("express");
const router = require("./src/route/api");
const app = express();
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");
const cors = require("cors");
const mongoose = require("mongoose");

app.use(cors());
app.use(helmet());
app.use(hpp());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
});
app.use(limiter);

// let URL = "mongodb://localhost:27017/TaskManager";
let URL = "mongodb+srv://Tonmoy_Ahammed_Sifat:SifatMogo10DB@atlascluster.ufe1snn.mongodb.net/TaskManager";
let OPTION = { user: "", pass: "", autoIndex: true };
mongoose
  .connect(URL, OPTION)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

app.use("/api", router);
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
