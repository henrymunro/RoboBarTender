var express = require('express')
var router = require('./router')



module.exports = function (app) {
  app.use('/log', require('./routes/log')),
  app.use('/drinks', require('./routes/drinks'))

}

