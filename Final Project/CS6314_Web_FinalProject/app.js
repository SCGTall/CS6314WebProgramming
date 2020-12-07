var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var SessionStore = require('express-mysql-session');
var bodyparser = require('body-parser');
var cors = require('cors');

var db = require('./modules/database');
var indexRouter = require('./routes/index');
var shopcartRouter = require('./routes/shopcart');
var favoriteRouter = require('./routes/favorite');
var ordersRouter = require('./routes/orders');
var usersRouter = require('./routes/users');
// Transform unhashed passwrod from old version. I directed use my test code.
var transformerRouter = require('./test/test_hash');
var testStaticRouter = require('./test/test_static');
var testRouter = require('./test/test_time');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// use bodyparser
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
// use session
app.use(session({
	secret :  'secret',  // signed cookie
	name : 'token',
    resave : false,
    rolling : true,
    saveUninitialized: true,
    store : new SessionStore(db.dbOption),
    cookie : {
    	path : '/',
    	httpOnly : true,
    	secure : false,
      maxAge : 1000 * 60 * 60, // set session's valid time in ms
    }
}));

app.use('/', indexRouter);
app.use('/shopcart', shopcartRouter);
app.use('/favorite', favoriteRouter);
app.use('/orders', ordersRouter);
app.use('/users', usersRouter);
app.use('/transform', transformerRouter);
app.use('/teststatic', testStaticRouter);
app.use('/test', testRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
