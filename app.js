var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var sessionRouter = require('./routes/session');
var indexRouter = require('./routes/index');

var faqRouter = require('./routes/faq');
var registerRouter = require('./routes/sign_up');
var loginRouter = require('./routes/login');

var accountRouter = require('./routes/account');
var transfersRouter = require('./routes/transfers');
var paymentRouter = require('./routes/payment');
var eDocumentsRouter = require('./routes/e-documents');
var contactRouter = require('./routes/contact_us');
var cardRouter = require('./routes/digital_card');
var usersSettings = require('./routes/users_settings');
var trainRouter = require('./routes/train');
var savingsPotRouter = require('./routes/savings_pot');
var myWalletRouter  = require('./routes/my_wallet');
var eDocRouter  = require('./routes/single_e-doc');

var app = express();

// session store and cookie
const mysql = require("mysql");
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

var options = {
  host: 'sql2.freesqldatabase.com',
  port: 3306,
  user: 'sql2386191',
  password: 'lT8!wV2!',
  database: 'sql2386191'
};

var sessionStore = new MySQLStore(options);

app.use(session({
  key: 'session_cookie_name',
  secret: 'session_cookie_secret',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: { path: '/', httpOnly: true, secure: false, maxAge: 3600000 }
}));

var connection = mysql.createConnection(options);
var sessionStore = new MySQLStore({}/* session store options */, connection);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/payment', paymentRouter);
app.use('/transfers', transfersRouter);
app.use('/login', loginRouter);
app.use('/sign_up', registerRouter);
app.use('/account', accountRouter);
app.use('/contact_us', contactRouter);
app.use('/digital_card', cardRouter);
app.use('/session', sessionRouter);
app.use('/e-documents', eDocumentsRouter);
app.use('/users_settings', usersSettings);
app.use('/faq', faqRouter);
app.use('/train', trainRouter);
app.use('/savingspot', savingsPotRouter);
app.use('/myWallet', myWalletRouter);
app.use('/singleEDoc', eDocRouter);

// tranfers locals to pug from js
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

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

// db = require('./config/database/connection');

