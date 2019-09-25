const express = require('express')
const path = require('path')
const fs = require('fs')
const logger = require('morgan')

const app = express()

const discRoute = require('./routes/disc')
const rankRoute = require('./routes/rank')
const singerRoute = require('./routes/singer')
const searchRoute = require('./routes/search')
const songRoute = require('./routes/song')
const mvRoute = require('./routes/mv')
const recRoute = require('./routes/recommend')

// log
const ENV = process.env.NODE_ENV
if (ENV !== 'production') {
  // 开发环境 测试环境
  app.use(logger('dev'))
} else {
  // 线上环境
  const logFileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(logger('combined', {
    stream: writeStream
  }))
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', discRoute, rankRoute, singerRoute, searchRoute, songRoute, mvRoute, recRoute)

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
