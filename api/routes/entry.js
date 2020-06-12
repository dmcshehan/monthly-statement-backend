const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
var moment = require('moment'); // require

//models
const Entry = require('../models/entry');

//custom modules
var getCorrectMonth = require('../helpers/getCorrectMonth');

router.get('/', (req, res, next) => {
	var autheticatedUser = res.locals.user;

	var startOfMonth = moment().startOf('month').format('YYYY-MM-DDTHH:mm:ss');
	var endOfMonth = moment().endOf('month').format('YYYY-MM-DDTHH:mm:ss');

	Entry.find({ uid: autheticatedUser.uid, date: { $gte: startOfMonth, $lte: endOfMonth } }).exec(
		(error, entries) => {
			if (error) {
				//ERROR
				next(error);
			}
			res.status(200).json(entries);
		}
	);
});

router.post('/', (req, res, next) => {
	var { uid } = res.locals.user;

	var entry = new Entry({
		_id: mongoose.Types.ObjectId(),
		uid,
		...req.body,
		date: moment(req.body.daye).format('YYYY-MM-DDTHH:mm:ssZ'),
	});

	entry
		.save()
		.then((entry) => {
			res.status(201).json({
				message: 'Entry Successfully Added',
				entry,
			});
		})
		.catch((error) => {
			//ERROR
			next(error);
		});
});

router.delete('/', (req, res, next) => {
	var { uid } = res.locals.user;
	var { entryId } = req.body;

	Entry.deleteOne({ _id: entryId, uid }).exec((error, entry) => {
		if (error) {
			next(error);
		}

		res.status(202).json({
			message: 'Entry Successfully Deleted',
			entry,
		});
	});
});

//---- Done

router.get('/month/:yearMonth', (req, res, next) => {
	var uid = req.body.uid;
	var date = new Date(req.params.yearMonth);

	var year = date.getFullYear();
	var month = date.getMonth();
	var lastDate = new Date(year, month + 1, 0).getDate();

	var firstDate = `${year}-${getCorrectMonth(month)}-01T00:00:00.000Z`;
	var lastDate = `${year}-${getCorrectMonth(month)}-${lastDate}T00:00:00.000Z`;

	Entry.find({ uid, date: { $gte: firstDate, $lte: lastDate } }).exec((error, entries) => {
		if (error) {
			//ERROR
			console.log(error);
		}
		res.status(200).json(entries);
	});
});

router.put('/', (req, res, next) => {
	Entry.findOneAndUpdate({ _id: req.body._id, uid: req.body.uid }, req.body).then((entry) => {
		res.status(202).json({
			message: 'Entry Successfully Updated',
			entry,
		});
	});
});

module.exports = router;
