
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var schema = require('./src/data/schema.js');

var session = require('express-session');
var GrapQLHTTP = require('express-graphql');




var app = express();

var port = 4000;
var nav = [{
        Link: '/Books',
        Text: 'Book'
            },
    {
        Link: '/Authors',
        Text: 'Author'
            }];

var bookRouter = require('./src/routes/bookRoutes')(nav);
var adminRouter = require('./src/routes/adminRoutes')(nav);
var authRouter = require('./src/routes/authRoutes')(nav);

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(session({
    secret: 'Croston',
    resave: true,
    saveUninitialized: true
}));
app.use('/data', GrapQLHTTP({
    schema: schema
}))
require('./src/config/passport')(app);


app.set('views', './src/views');
app.set('view engine', 'ejs');

app.use('/Books', bookRouter);
app.use('/Admin', adminRouter);
app.use('/Auth', authRouter);


app.get('/',
    function (req, res) {
        res.render('index', {
            Title: 'Hello',
            nav: nav

        });
    });

//app.get('/books', function (req, res) {
//    res.send('Hello Books');
//});

app.listen(port, function (err) {
    console.log('running server on port ' + port);
});