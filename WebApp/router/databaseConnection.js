const debug = require('debug')('databaseConnection')
const config = require('../RoboBarTender.config')

debug('Startup: Loading in DATABASE CONNECTION')

const { host, username, password, database } = config

const pool = require('mysql2/promise').createPool({
	host: host, 
	user: username, 
	password: password,
	database: database
}); 

module.exports = pool