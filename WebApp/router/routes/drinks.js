const debug = require('debug')('Drinks')

//Load in router class
const Router = require('../router')
const router = new Router().router

//Load in database connection
const pool = require('../databaseConnection')
const databaseProcedures = require('../functions/databaseProcedures')
const   { callProcUPDATE, callProcGET } = databaseProcedures

//Load in other functions 
const validateNewDrinkOrder = require('../functions/validateDrinkOrder').validateNewDrinkOrder
const mixNewDrink = require('../functions/mixDrink').mixNewDrink

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
  const {Drink_id, Volume} = req.body
  debug('Request RECIEVED to order Drink: ', Drink_id, Volume)
  validateNewDrinkOrder(Drink_id, Volume).then((response)=>{
    const { KillSwitch, Pumping, CanMake } = response

    if(KillSwitch === 1 ){
      debug('Request REJECTED KillSwitch = 1')
      res.send({orderPlaced: false, errorMessage:'Machine is off, give it some power!'})
    } else if (Pumping ===1 ){
      debug('Request REJECTED Pumping = 1')
      res.send({orderPlaced: false, errorMessage:'Machine is already making a drink, cool your horses!'})
    } 
    else if (CanMake ===0 ){
      debug('Request REJECTED CanMake = 0')
      res.send({orderPlaced: false, errorMessage:'Don\'t have the necessary ingredients, time to go to the shops!'})
    } 
    else {
      debug('Request ACCEPTED')
      res.send({orderPlaced: true})
      debug('Sending Request to MIX DRINK')
      mixNewDrink(response)
    }
  }).catch((err)=>{
    debug('ERROR with request for drink: '+ Drink_id + '   '+ err)
  })
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
