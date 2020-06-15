const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
var moment = require('moment'); // require

//models
const Entry = require('../models/entry');

router.post('/', (req, res, next) => {
	var { uid } = res.locals.user;

	var entry = new Entry({
		_id: mongoose.Types.ObjectId(),
		uid,
		...req.body,
		date: moment(req.body.date).format('YYYY-MM-DDTHH:mm:ssZ'),
	});

	entry
		.save()
		.then((entry) => {
			res.status(200).json({
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

		res.status(200).json({
			message: 'Entry Successfully Deleted',
			entry,
		});
	});
});

router.put('/', (req, res, next) => {
	var { uid } = res.locals.user;
	var { _id } = req.body.updatedEntry;

	//next(new Error('Test Error!'));

	Entry.findOneAndUpdate({ _id, uid }, req.body.updatedEntry).exec((error, entry) => {
		if (error) {
			next(error);
		}

		res.status(200).json({
			message: 'Entry Successfully Updated',
			entry,
		});
	});
});

//---- Done

router.get('/', (req, res, next) => {
	var { uid } = res.locals.user;
	var { month } = req.query;

	var startOfMonth = moment(month).startOf('month').format('YYYY-MM-DDTHH:mm:ss');
	var endOfMonth = moment(month).endOf('month').format('YYYY-MM-DDTHH:mm:ss');

	Entry.find({ uid, date: { $gte: startOfMonth, $lte: endOfMonth } }).exec((error, entries) => {
		if (error) {
			//ERROR
			next(error);
		}
		res.status(200).json({
			entries,
		});
	});
});

module.exports = router;
