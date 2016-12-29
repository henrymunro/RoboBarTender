const debug = require('debug')('LOG')

//Load in router class
const Router = require('../router')
const router = new Router().router

//Load in database connection
const databaseProcedures = require('../functions/databaseProcedures')
const   { callProcUPDATE, callProcGET } = databaseProcedures


debug('Startup: Loading in LOG routes')


router.post('/browserError', (req, res)=>{
  debug('Request RECIEVED: To log browser error')
  res.status(200).send('SUCCESS')
})

// Test route
router.get('/', (req, res)=>{
  debug('Request RECIEVED: To test route')
  res.status(200).send('SUCCESS')
})

//Route to log browser errors in the DB
// router.post('/browserError', (req, res)=>{
//   debug('Request RECIEVED: To log browser error')
//   // Gathers infromation
//   let operation = 'logging browser error [user_id, message, stack, errorType] '
//   const procedure = 'CALL sp_LogError( ?, ?, ?, ?);',
//         user_id = req.session.user_id, 
//         { message, stack } = req.body
//   const  params = [user_id, message, stack, 'browser']
//   // Updates logging text
//   operation = operation + params.join(', ') 
//   // Makes DB update
//   callProcUPDATE(procedure, params, operation, res) 
// })


module.exports = router;
