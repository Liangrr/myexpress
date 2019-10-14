var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var serveFavicon = require('serve-favicon');
var bodyParser = require('body-parser'); //body-parser 用来解析post请求的参数
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
const Token = require('./token/token.js')
var app = express();

mongoose.connect('mongodb://localhost/lrr')     //连接本地数据库blog 

var db = mongoose.connection;

// 连接成功
db.on('open', function () {
  console.log('MongoDB Connection Successed');
});
// 连接失败
db.on('error', function () {
  console.log('MongoDB Connection Error');
});

// 设置允许跨域
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header('Access-Control-Allow-Headers', 'Content-Type,token');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/x-www-form-urlencoded');
  next();
});

// 使用body.json模版
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', function (req, res, next) {
  // 获取token
  const token = req.headers['token']
  let data = null
  if (token) {
    data = Token.checkToken(token) //检查token
    // data = Token.decodeToken(token)  //解析token
  }
  if (req.url === '/login') {
    next();
  } else if (!data) {
    res.send({
      code: 401,
      data: {},
      message: '访问超时，请重新登录！'
    })
  } else {
    next();
  }
})

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

console.log('启动成功')

module.exports = app;
