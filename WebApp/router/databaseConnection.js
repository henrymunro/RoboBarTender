const debug = require('debug')('databaseConnection')


debug('Startup: Loading in DATABASE CONNECTION')

const pool = require('mysql2/promise').createPool({
	host:'localhost', 
	user: 'root', 
	database: 'RoboBarTender'
}); 

module.exports = pool