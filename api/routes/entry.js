const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Entry = require('../models/entry');
var getCorrectMonth = require('../helpers/getCorrectMonth');


router.get("/", (req, res, next) => {

    var todaysDate = new Date();
    var year = todaysDate.getFullYear();
    var month = todaysDate.getMonth();
    var lastDate = new Date(year, month + 1, 0).getDate()

    var firstDate = `${year}-${getCorrectMonth(month)}-01`;
    var lastDate = `${year}-${getCorrectMonth(month)}-${lastDate}`;


    Entry.find({ date: { $gte: firstDate, $lte: lastDate } })
        .exec((error, entries) => {
            if (error) {
                //ERROR
                console.log(error);
            }
            res.status(200).json(entries);
        });
});

router.post("/", (req, res, next) => {
    console.log(req.body);
    var entry = new Entry({
        _id: mongoose.Types.ObjectId(),
        ...req.body
    })

    entry.save()
        .then(result => {
            res.status(201).json({
                message: "Entry Successfully Added",
                entry: result
            });
        })
        .catch(error => {
            //ERROR
            console.log(error);
        });

});

router.put("/", (req, res, next) => {
    Entry.findOne().exec((error, entry) => { });
});

router.delete("/", (req, res, next) => {
    Entry.findByIdAndDelete().exec((error, entry) => { });
});

module.exports = router;