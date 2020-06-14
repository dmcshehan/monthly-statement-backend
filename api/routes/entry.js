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

router.put('/', (req, res, next) => {
	var { uid } = res.locals.user;
	var { _id } = req.body.updatedEntry;

	console.log(uid, _id);

	Entry.findOneAndUpdate({ _id, uid }, req.body.updatedEntry).then((entry) => {
		res.status(204).json({
			message: 'Entry Successfully Updated',
			entry,
		});
	});
});

//---- Done

router.get('/month', (req, res, next) => {
	var { uid } = res.locals.user;
	var { month } = req.query;

	var startOfMonth = moment(month).startOf('month').format('YYYY-MM-DDTHH:mm:ss');
	var endOfMonth = moment(month).endOf('month').format('YYYY-MM-DDTHH:mm:ss');

	Entry.find({ uid, date: { $gte: startOfMonth, $lte: endOfMonth } }).exec((error, entries) => {
		if (error) {
			//ERROR
			next(error);
		}
		res.status(200).json(entries);
	});
});

module.exports = router;
