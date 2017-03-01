var mongodb = require('mongodb').MongoClient;
var objectID = require('mongodb').ObjectID;

var bookController = function (bookService, nav) {

    var middleware = function (req, res, next) {
        //Secure all routes
        if (!req.user) {
            //    res.redirect('/');
        }
        next();
    };

    var getIndex = function (req, res) {
        var url = 'mongodb://localhost:27017/libraryApp';
        mongodb.connect(url, function (err, db) {
            var collection = db.collection('books');
            collection.find({}).toArray(function (err, results) {

                res.render('bookListView', {
                    Title: 'Books',
                    nav: nav,
                    books: results

                });

            });
        });
    };

    var getById = function (req, res) {
        var id = new objectID(req.params.id);
        var url = 'mongodb://localhost:27017/libraryApp';
        mongodb.connect(url, function (err, db) {
            var collection = db.collection('books');
            collection.findOne({
                    _id: id
                },
                function (err, results) {

                    if (results === null) {
                        res.status(404).send('Not Found');
                    } else {

                        if (results.bookId) {
                            bookService.getBookById(results.bookId,
                                function (err, book) {
                                    results.book = book;

                                    res.render('bookView', {
                                        Title: 'Books',
                                        nav: nav,
                                        book: results
                                    });
                                });
                        } else {
                            res.render('bookView', {
                                Title: 'Books',
                                nav: nav,
                                book: results
                            });

                        }
                    }
                });

        });
    };

    return {
        getIndex: getIndex,
        getById: getById,
        middleware: middleware
    };
};


module.exports = bookController;