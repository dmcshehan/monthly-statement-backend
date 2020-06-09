const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
var moment = require('moment'); // require

//models
const Entry = require('../models/entry');

//custom modules
var getCorrectMonth = require('../helpers/getCorrectMonth');

router.get('/', (req, res, next) => {
	var todaysDate = moment();

	const startOfMonth = moment().startOf('month').format();
	const endOfMonth = moment().endOf('month').format();

	console.log(startOfMonth, endOfMonth);

	// var year = todaysDate.getFullYear();
	// var month = todaysDate.getMonth();

	// var firstDate = `${year}-${getCorrectMonth(month)}-01T00:00:00.000Z`;
	// var lastDate = `${year}-${getCorrectMonth(month)}-${lastDate}T00:00:00.000Z`;

	// Entry.find({ uid: req.body.uid, date: { $gte: firstDate, $lte: lastDate } }).exec(
	// 	(error, entries) => {
	// 		if (error) {
	// 			//ERROR
	// 			console.log(error);
	// 		}
	// 		res.status(200).json(entries);
	// 	}
	// );

	res.json({
		cool: ':D',
	});
});

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

router.post('/', (req, res, next) => {
	var entry = new Entry({
		_id: mongoose.Types.ObjectId(),
		...req.body,
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
			console.log(error);
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

router.delete('/:id', (req, res, next) => {
	var uid = req.body.uid;

	Entry.deleteOne({ _id: req.params.id, uid }).exec((error, entry) => {
		res.status(200).json({
			message: 'Entry Successfully Deleted',
			entry,
		});
	});
});

module.exports = router;
