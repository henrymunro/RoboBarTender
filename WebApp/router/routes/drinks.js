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
const { mixNewDrink, logDrinkRequestInDB } = require('../functions/mixDrink')

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
  const user = 'UNKNOWN'
  const source = 'UNKONWN'

  validateNewDrinkOrder(Drink_id, Volume).then((response)=>{
    const { KillSwitch, Pumping, CanMake, CupInPlace, drinkNotRecognised } = response

    console.log(response)
    // Switching block to deal with validation failures 
    if ( drinkNotRecognised ){
      debug('Request REJECTED drinkNotRecognised = 1')
      logDrinkRequestInDB(Drink_id, Volume, user, source, 'fail', 'drink not recognised')
      res.send({orderPlaced: false, msg:'drink_not_recognised', errorMessage:'The drink has not been recognised!'})
    } else if (CanMake ===0 ){
      debug('Request REJECTED CanMake = 0')
      logDrinkRequestInDB(Drink_id, Volume, user, source, 'fail', 'ingredients')
      res.send({orderPlaced: false, msg:'no_ingredients', errorMessage:'Don\'t have the necessary ingredients, time to go to the shops!'})
    } else if(KillSwitch === 1 ){
      debug('Request REJECTED KillSwitch = 1')
      logDrinkRequestInDB(Drink_id, Volume, user, source, 'fail', 'kill switch')
      res.send({orderPlaced: false, msg:'bar_tender_off', errorMessage:'Machine is off, give it some power!'})
    } else if (Pumping ===1 ){
      debug('Request REJECTED Pumping = 1')
      logDrinkRequestInDB(Drink_id, Volume, user, source, 'fail', 'pumping')
      res.send({orderPlaced: false, msg:'bar_tender_busy', errorMessage:'Machine is already making a drink, cool your horses!'})
    } else if (CupInPlace === 0){
      debug('Request REJECTED CupInPlace = 0')
      logDrinkRequestInDB(Drink_id, Volume, user, source, 'fail', 'no cup')
      res.send({orderPlaced: false, msg:'no_cup', errorMessage:'There is no cup present, please place on in the bar tender'})
    } else {
      debug('Request ACCEPTED')
      res.send({orderPlaced: true})
      logDrinkRequestInDB(Drink_id, Volume, user, source, 'success', '')
      debug('Sending Request to MIX DRINK')
      mixNewDrink(response)
    }
  }).catch((err)=>{
    debug('ERROR with request for drink: '+ Drink_id + '   '+ err)
  })
})



router.post('/getDrinkIngredients', (req, res)=>{
  const { Drink_id } = req.body 
  debug('Request RECIEVED: To get drink ingredients Drink_id: '+ Drink_id)
  const params = [Drink_id]
  const procedure = 'call sp_GetDrinkIngredients(?);'
  pool.getConnection()
         .then((conn) => {
          debug('Calling procedure: '+procedure)
           const result = conn.query(procedure, params)
           conn.release()
           return result;
         })
         .then((result) => {
          debug('Request SUCCESS: ' + procedure)
          res.send(result[0][1])
         }).catch((err)=>{
          debug('Request ERROR: ' + procedure + ', error: ' +  err)
          res.send('An Error has occoured')
         })
})

router.post('/delete', (req, res)=>{
  const { Drink_id } = req.body 
  debug('Request RECIEVED: To delete drink ingredients Drink_id: '+ Drink_id)
  const params = [Drink_id]
  const procedure = 'call sp_DeleteDrink(?);'
  pool.getConnection()
         .then((conn) => {
          debug('Calling procedure: '+procedure)
           const result = conn.query(procedure, params)
           conn.release()
           return result;
         })
         .then((result) => {
          debug('Request SUCCESS: ' + procedure)
          res.send('SUCCESS')
         }).catch((err)=>{
          debug('Request ERROR: ' + procedure + ', error: ' +  err)
          res.send('An Error has occoured')
         })
})





router.post('/createDrink', (req, res)=>{
  debug('Request recieved to save file')
  const { name, description, ingredients, image } = req.body
  debug('Saving new drink to DB: ' + name)
   pool.getConnection()
         .then((conn) => {
          const procedure1 = 'CALL sp_CreateDrink(?,?,?);'
          const params1 = [name, description, image]
          debug('Calling procedure: '+procedure1)
           const result = conn.query(procedure1, params1)
           conn.release()
           return result;
         })
         .then((result) => {
            const ID = result[0][0][0].ID
            debug('Inserting Ingredients from new drink: ' + name+', ID: '+ID)
            return ingredients.map((ing, key)=>{
              const {PumpName, newDrinkProportion} = ing
              return new Promise((resolve, reject)=>{
                pool.query({sql: 'CALL sp_AddDrinkIngredient( ?, ?, ?);', values: [ID, PumpName, newDrinkProportion]}, (err, rows, files)=>{
                  if (err){
                    debug('Error adding row: ', err)
                    reject(err)
                  } else {
                    debug('Ingredient sucessfully added')
                     resolve()
                  }
                })
              })
            })
          })
         .then((result)=>{
            Promise.all(result).then((result)=>{
              debug('Drink sucessfully added: '+name)
              res.send('SUCCESS')
            }).catch((err)=>{
              debug('ERROR when adding drink: '+name)
              res.send('An Error has occoured')
            })
            
         }).catch((err)=>{
          debug('Request ERROR creating drink: '+name +' ' +  err)
          res.send('An Error has occoured')
         })
  })




module.exports = router;
