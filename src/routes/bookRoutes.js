var express = require('express');
var bookRouter = express.Router();
var mongodb = require('mongodb').MongoClient;
var objectID = require('mongodb').ObjectID;

var router = function (nav) {
    var bookService = require('../Services/goodreadsService')();
    var bookContoller = require('../controllers/bookController')(bookService, nav);
    bookRouter.use(bookContoller.middleware);
    //Secure all routes

    bookRouter.route('/')
        .get(bookContoller.getIndex);

    bookRouter.route('/:id')
        .get(bookContoller.getById);

    return bookRouter;

};

module.exports = router;