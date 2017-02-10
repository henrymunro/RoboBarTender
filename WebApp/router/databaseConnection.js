const debug = require('debug')('databaseConnection')
const config = require('./config')

console.log('CONFIG!: ', config)

debug('Startup: Loading in DATABASE CONNECTION')

const { host, username, password, database } = config.database

const pool = require('mysql2/promise').createPool({
	host: host, 
	user: username, 
	password: password,
	database: database
}); 

module.exports = pool