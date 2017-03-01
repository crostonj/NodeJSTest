var express = require('express');
var bookRouter = express.Router();
var sql = require('mssql');

var router = function (nav) {

var books = [
    {
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

bookRouter.route('/')
    .get(function (req, res) {
        var request = new sql.Request();

        request.query('select * from books', function (err, recordSet) {
            res.render('bookListView', {
                Title: 'Books',
                nav: nav,
                books: recordSet
            });
        });

    });

bookRouter.route('/:id')
    .all(function (req, res, next) {
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
    })
.get(function (req, res) {

    res.render('bookView', {
        Title: 'Books',
        nav: nav,
        book: req.book
    });

});


return bookRouter;
};

module.exports = router;