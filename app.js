require('dotenv').config();
const express = require("express");
const jwt = require('express-jwt');
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();

// call all routes
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const eventRouter = require("./routes/event");

app.use(bodyParser.json());
app.use(cors());

// register all our routes
app.use("/", indexRouter);
app.use("/auth",authRouter);
app.use(eventRouter);


// catch 404 and show error route
app.use(function (req, res, next) {
    next(res.json({ status: "error", message: "not found" }));
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err,
    });
});

module.exports = app;