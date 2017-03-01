var express = require('express');
var adminRouter = express.Router();
var mongodb = require('mongodb').MongoClient;

var router = function (nav) {

    var books = [
    {
        title: 'All the Light We Cannot See',
        genre: 'Drama',
        author: 'Anthony Doerr',
        bookId: 18143977,
        read: false
    }, {
        title: 'The Nightingale',
        genre: 'Fiction',
        author: 'Kristin Hannah',
        bookId: 21853621,
        read: false
    }, {
        title: 'The Revenant: A Novel of Revenge',
        genre: 'Action',
        author: 'Michael Punke',
        read: false
    }, {
        title: 'Secrets of a Charmed Life',
        genre: 'Romance',
        author: 'Wilma Ready',
        read: false
    }, {
        title: 'Romance: Dangerous Secrets',
        genre: 'Romance',
        author: 'Julia Regan',
        read: false
    }, {
        title: 'Ordinary Grace',
        genre: 'Fiction',
        author: 'William Kent Krueger',
        read: false
     }];
    
    adminRouter.route('/addBooks')
        .get(function (req, res) {
            var url = 'mongodb://localhost:27017/libraryApp';
            mongodb.connect(url, function (err, db) {
                var collection = db.collection('books');
                collection.insertMany(books, function (err, results) {
                    res.send(results);
                    db.close();
                });
            });
            //res.send('inserting books');
        });
    return adminRouter;
};


module.exports = router;