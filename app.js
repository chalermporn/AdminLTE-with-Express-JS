var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('express-flash');
var session = require('express-session');
var expressValidator = require('express-validator')
var mongoose = require('mongoose');
var methodOverride = require('method-override');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:"rahasia1234"}));
app.use(flash());
app.use(expressValidator());
app.use(methodOverride(function(req,res){
  if(req.body && typeof req.body == 'object' && '_method' in req.body){
    var method = req.body._mehthod;
    delete req.body._method;
    return method;
  }
}));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// setting MongoDB dengan mongoose
var user = require('./models/user');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/organo');

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// development error handler
// will print stacktrace
if(app.get('env') == 'development'){
  app.use(function(err,req,res,next){
    res.status(err.status || 500);
    res.render('error',{
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktrace leaked to user
app.use(function(err,req,res,next){
  res.status(err.status || 500);
  res.render('error',{
    message: err.message,
    error: {}
  });
});

module.exports = app;
