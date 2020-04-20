var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var entryRoutes = require('./api/routes/entry');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

const url = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds245512.mlab.com:45512/monthly_statement`;


mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(error => {
        console.log(error);
    });


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if (req.module === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

app.use("/", entryRoutes);


module.exports = app;