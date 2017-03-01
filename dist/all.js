'use strict';

var passport = require('passport');

module.exports = function (app) {
    app.use(passport.initialize());
    app.use(passport.session());
    passport.serializeUser(function (user, done) {

        done(null, user);
    });
    passport.deserializeUser(function (user, done) {

        done(null, user);
    });
    require('./strategies/local.strategy.js')();
};
'use strict';

var mongodb = require('mongodb').MongoClient;
var objectID = require('mongodb').ObjectID;

var bookController = function bookController(bookService, nav) {

    var middleware = function middleware(req, res, next) {
        //Secure all routes
        if (!req.user) {
            //    res.redirect('/');
        }
        next();
    };

    var getIndex = function getIndex(req, res) {
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

    var getById = function getById(req, res) {
        var id = new objectID(req.params.id);
        var url = 'mongodb://localhost:27017/libraryApp';
        mongodb.connect(url, function (err, db) {
            var collection = db.collection('books');
            collection.findOne({
                _id: id
            }, function (err, results) {

                if (results === null) {
                    res.status(404).send('Not Found');
                } else {

                    if (results.bookId) {
                        bookService.getBookById(results.bookId, function (err, book) {
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
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _graphql = require('graphql');

//import{
//    GraphQLSchema,
//    GraphQLObjectType,
//     GraphQLInt
//} from 'graphql';

var schema = new _graphql.GraphQLSchema({
    query: new _graphql.GraphQLObjectType({
        name: 'Query',
        fields: function fields() {
            return {
                counter: {
                    type: _graphql.GraphQLInt,
                    resolve: function resolve() {
                        return function () {
                            return 42;
                        };
                    }
                }
            };
        }
    })

    //mutation: ...
}); /*jshint esnext: true */
//var GraphQLSchema = require("graphql").GraphQLSchema;
//var GraphQLObjectType = require("graphql").GraphQLObjectType;
//var GraphQLInt = require("graphql").GraphQLInt;

exports.default = schema;
'use strict';

var express = require('express');
var adminRouter = express.Router();
var mongodb = require('mongodb').MongoClient;

var router = function router(nav) {

    var books = [{
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

    adminRouter.route('/addBooks').get(function (req, res) {
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
'use strict';

var express = require('express');
var authRouter = express.Router();
var mongodb = require('mongodb').MongoClient;
var passport = require('passport');

var router = function router(nav) {
    authRouter.route('/signUp').post(function (req, res) {
        var url = 'mongodb://localhost:27017/libraryApp';
        mongodb.connect(url, function (err, db) {
            var collection = db.collection('users');
            var user = {
                username: req.body.username,
                password: req.body.password
            };

            collection.insert(user, function (err, results) {
                req.login(results.ops[0], function () {
                    res.redirect('/Auth/profile');
                });
            });
        });
    });
    authRouter.route('/signIn').post(passport.authenticate('local', {
        failureRedirect: '/'
    }), function (req, res) {
        res.redirect('/Books');
    }).get(function (req, res) {
        res.send('hmmm......');
    });

    authRouter.route('/profile').all(function (req, res, next) {
        if (!req.user) {
            res.redirect('/');
        }
        next();
    }).get(function (req, res) {
        res.json(req.user);
    });

    return authRouter;
};

module.exports = router;
'use strict';

var express = require('express');
var bookRouter = express.Router();
var mongodb = require('mongodb').MongoClient;
var objectID = require('mongodb').ObjectID;

var router = function router(nav) {
    var bookService = require('../Services/goodreadsService')();
    var bookContoller = require('../controllers/bookController')(bookService, nav);
    bookRouter.use(bookContoller.middleware);
    //Secure all routes

    bookRouter.route('/').get(bookContoller.getIndex);

    bookRouter.route('/:id').get(bookContoller.getById);

    return bookRouter;
};

module.exports = router;
'use strict';

var express = require('express');
var bookRouter = express.Router();
var sql = require('mssql');

var router = function router(nav) {

    var books = [{
        title: 'All the Light We Cannot See',
        genre: 'Drama',
        author: 'Anthony Doerr',
        read: false
    }, {
        title: 'The Nightingale',
        genre: 'Fiction',
        author: 'Kristin Hannah',
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

    bookRouter.route('/').get(function (req, res) {
        var request = new sql.Request();

        request.query('select * from books', function (err, recordSet) {
            res.render('bookListView', {
                Title: 'Books',
                nav: nav,
                books: recordSet
            });
        });
    });

    bookRouter.route('/:id').all(function (req, res, next) {
        var id = req.params.id;
        var ps = new sql.PreparedStatement();
        ps.input('id', sql.Int);
        ps.prepare('select * from books where id = @id', function (err) {
            ps.execute({
                id: req.params.id
            }, function (err, recordSet) {
                if (recordSet.length === 0) {
                    res.status(404).send('Not Found');
                } else {
                    req.book = recordSet[0];
                    next();
                }
            });
        });
    }).get(function (req, res) {

        res.render('bookView', {
            Title: 'Books',
            nav: nav,
            book: req.book
        });
    });

    return bookRouter;
};

module.exports = router;
'use strict';

var express = require('express');
var dataRouter = express.Router();
var graphql = require("graphql");
var GrapQLHTTP = require('express-graphql');

var router = function router(nav) {
    dataRouter.route('/data').get(function (req, res) {});
};

module.exports = router;
'use strict';

var http = require('http');
var xml2json = require('xml2js');
var parser = xml2json.Parser({
    explicitArray: false
});

var goodreadsService = function goodreadsService() {

    var getBookById = function getBookById(id, cb) {
        var options = {
            host: 'www.goodreads.com',
            path: '/book/show/' + id + '?format=xml&key=bJU4WwEpv8QaM42iR586YA'
        };

        var callback = function callback(response) {
            var str = '';

            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {
                console.log(str);

                parser.parseString(str, function (err, result) {
                    cb(null, result.GoodreadsResponse.book);
                });
            });
        };

        http.request(options, callback).end();
    };

    return {
        getBookById: getBookById
    };
};

module.exports = goodreadsService;
'use strict';

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    mongodb = require('mongodb').MongoClient;

module.exports = function () {
    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, function (username, password, done) {
        var url = 'mongodb://localhost:27017/libraryApp';
        mongodb.connect(url, function (err, db) {
            var collection = db.collection('users');
            collection.findOne({
                username: username
            }, function (err, results) {
                if (err === null) {
                    if (results.password === password) {
                        var user = results;
                        done(null, user);
                    } else {
                        done(null, false, { message: 'Bad Password' });
                    }
                } else {
                    console.log(err);
                    done(null, false, { message: 'Username not found' });
                }
            });
        });
    }));
};
//# sourceMappingURL=all.js.map
