var express = require('express')
var router = require('./router')



module.exports = function (app) {
  app.use('/RoboBarTender/log', require('./routes/log')),
  app.use('/RoboBarTender/drinks', require('./routes/drinks')),
  app.use('/RoboBarTender/pump', require('./routes/pump'))

}

