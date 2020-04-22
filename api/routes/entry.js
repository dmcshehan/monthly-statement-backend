const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Entry = require('../models/entry');
const userCheck = require('../middleware/usercheck');
var getCorrectMonth = require('../helpers/getCorrectMonth');


router.get("/", userCheck, (req, res, next) => {

    var todaysDate = new Date();
    var year = todaysDate.getFullYear();
    var month = todaysDate.getMonth();
    var lastDate = new Date(year, month + 1, 0).getDate()

    var firstDate = `${year}-${getCorrectMonth(month)}-01T00:00:00.000Z`;
    var lastDate = `${year}-${getCorrectMonth(month)}-${lastDate}T00:00:00.000Z`;


    Entry.find({ uid: req.body.uid, date: { $gte: firstDate, $lte: lastDate } })
        .exec((error, entries) => {
            if (error) {
                //ERROR
                console.log(error);
            }
            res.status(200).json(entries);
        });
});

router.get("/month/:yearMonth", userCheck, (req, res, next) => {

    var uid = req.body.uid;
    var date = new Date(req.params.yearMonth);

    var year = date.getFullYear();
    var month = date.getMonth();
    var lastDate = new Date(year, month + 1, 0).getDate()

    var firstDate = `${year}-${getCorrectMonth(month)}-01T00:00:00.000Z`;
    var lastDate = `${year}-${getCorrectMonth(month)}-${lastDate}T00:00:00.000Z`;

    console.log(lastDate);

    Entry.find({ uid, date: { $gte: firstDate, $lte: lastDate } })
        .exec((error, entries) => {
            if (error) {
                //ERROR
                console.log(error);
            }
            res.status(200).json(entries);
        });
});

router.post("/", userCheck, (req, res, next) => {

    var entry = new Entry({
        _id: mongoose.Types.ObjectId(),
        ...req.body
    })

    entry.save()
        .then(entry => {
            res.status(201).json({
                message: "Entry Successfully Added",
                entry
            });
        })
        .catch(error => {
            //ERROR
            console.log(error);
        });

});

// router.get("/", (req, res, next) => {
//     console.log("Inside put");

//     //Entry.findOne().exec((error, entry) => { });

//     res.send({})
// });

router.delete("/:id", userCheck, (req, res, next) => {
    var uid = req.body.uid;

    Entry.deleteOne({ _id: req.params.id, uid }).exec((error, entry) => {
        res.status(200).json({
            message: "Entry Successfully Deleted",
            entry
        });
    });
});

module.exports = router;