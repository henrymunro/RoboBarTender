
const debug = require('debug')('databaseProcedure')
const pool = require('../databaseConnection')

debug('Startup: Loading in DATABASE PROCEDURES')


function callProcUPDATE(procedure, parameters, operation, res){
  debug('Request RECIEVED: '+ operation)
  pool.getConnection()
       .then((conn) => {
         const result = conn.query(procedure, parameters)
         conn.release()
         return result;
       })
       .then((result) => {
        debug('Request SUCCESS: ' + operation)
        res.status(200).send('SUCCESS')
       }).catch((err)=>{
        debug('Request ERROR: ' + operation + ', error: ' +  err)
        res.status(400).send('ERROR: '+  err)
       })
}

function callProcGET(procedure, parameters, operation){
  return new Promise((resolve, reject)=>{
  debug('Request RECIEVED: '+ operation)
    pool.getConnection()
         .then((conn) => {
           const result = conn.query(procedure, parameters)
           conn.release()
           return result;
         })
         .then((result) => {
          debug('Request SUCCESS: ' + operation)
          resolve(result[0][0])
         }).catch((err)=>{
          debug('Request ERROR: ' + operation + ', error: ' +  err)
          reject({err})
         })
  })
}

module.exports = {
  callProcUPDATE: callProcUPDATE,
  callProcGET:callProcGET
}



