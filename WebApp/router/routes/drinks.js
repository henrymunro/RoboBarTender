const debug = require('debug')('Drinks')

//Load in router class
const Router = require('../router')
const router = new Router().router

//Load in database connection
const pool = require('../databaseConnection')
const databaseProcedures = require('../functions/databaseProcedures')
const   { callProcUPDATE, callProcGET } = databaseProcedures


debug('Startup: Loading in DRINKS routes')

// Test route
router.get('/', (req, res)=>{
  debug('Request RECIEVED: To get drinks')
  const procedure = 'call sp_GetDrinks();'
  pool.getConnection()
         .then((conn) => {
         	debug('Calling procedure: '+procedure)
           const result = conn.query(procedure)
           conn.release()
           return result;
         })
         .then((result) => {
          debug('Request SUCCESS: ' + procedure)
          console.log(result[0])
          const drinks = result[0][0]
          const ingredients = result[0][1]
          res.send(result[0][0])
         }).catch((err)=>{
          debug('Request ERROR: ' + procedure + ', error: ' +  err)
          res.send('An Error has occoured')
         })
  // res.status(200).send('SUCCESS')
})

router.post('/order', (req,res)=>{
  const Drink_id = req.body
  debug('Request RECIEVED to order Drink: ', Drink_id)
  res.send('ORDERD')
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
