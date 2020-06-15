var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var entryRoutes = require('./api/routes/entry');
var firebaseMiddleware = require('express-firebase-middleware');
var cors = require('cors');
var admin = require('./api/auth/firebaseAdmin'); //must have firebaseMiddleware to work properly
var authCheck = require('./api/middleware/authCheck.js');

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

const url = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds245512.mlab.com:45512/monthly_statement`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).catch((error) => {
	console.log(error);
});

app.use(cors());
app.use(firebaseMiddleware.auth);

app.use('/', authCheck, entryRoutes);

app.use(function errorHandler(err, req, res, next) {
	if (res.headersSent) {
		return next(err);
	}
	res.status(500).send(err.message);
});

module.exports = app;
