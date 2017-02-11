const path = require('path')

// Load in config
const environment = process.env.NODE_ENV||'development'
// Check to see if an incorrect environment has been set
if ( !(environment!='production'||environment!='staging'||environment!='development')){
    throw `ENVIROMENT NOT RECOGNISED ${environment}`
}

module.exports = require(path.join(__dirname, `../config/${environment}.robobartender.config.json`))


