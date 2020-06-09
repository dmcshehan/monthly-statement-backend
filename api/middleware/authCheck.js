const chalk = require('chalk');

module.exports = (req, res, next) => {
	if (res.locals.user) {
		next();
	} else {
		const error = new Error('Unauthorized User');
		error.code = 401;
		next(error);
	}
};
