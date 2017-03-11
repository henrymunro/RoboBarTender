const debug = require('debug')('Pump')

//Load in router class
const Router = require('../router')
const router = new Router().router

//Load in database connection
const pool = require('../databaseConnection')
const databaseProcedures = require('../functions/databaseProcedures')
const { killAllPumps } = require('../functions/mixDrink')
const   { callProcUPDATE, callProcGET } = databaseProcedures

const RPi = (process.env.RPi?true:false)


debug('Startup: Loading in PUMP routes')

// Test route
router.get('/', (req, res)=>{
  debug('Request RECIEVED: To get pumps')
  const procedure = 'call sp_GetPumps();'
  pool.getConnection()
         .then((conn) => {
         	debug('Calling procedure: '+procedure)
           const result = conn.query(procedure)
           conn.release()
           return result;
         })
         .then((result) => {
          debug('Request SUCCESS: ' + procedure)
          res.send(result[0][0])
         }).catch((err)=>{
          debug('Request ERROR: ' + procedure + ', error: ' +  err)
          res.send('An Error has occoured')
         })
  // res.status(200).send('SUCCESS')
})

// Test route
router.get('/pumpsForNewDrink', (req, res)=>{
  debug('Request RECIEVED: To get pumps')
  const procedure = 'call sp_GetPumps();'
  pool.getConnection()
         .then((conn) => {
          debug('Calling procedure: '+procedure)
           const result = conn.query(procedure)
           conn.release()
           return result;
         })
         .then((result) => {
          debug('Request SUCCESS: ' + procedure)
          const resultSend = result[0][0].map((element)=>{
            element.newDrinkProportion = 0
            return element
          })
          res.send(resultSend)
         }).catch((err)=>{
          debug('Request ERROR: ' + procedure + ', error: ' +  err)
          res.send('An Error has occoured')
         })
  // res.status(200).send('SUCCESS')
})


// Test route
router.get('/poll', (req, res)=>{
  debug('Request RECIEVED: To poll pumps status')
  const procedure = 'call sp_GetPumpsStatus();'
  pool.getConnection()
         .then((conn) => {
          debug('Calling procedure: '+procedure)
           const result = conn.query(procedure)
           conn.release()
           return result;
         })
         .then((result) => {
          debug('Request SUCCESS: ' + procedure)
          res.send(result[0][0])
         }).catch((err)=>{
          debug('Request ERROR: ' + procedure + ', error: ' +  err)
          res.send('An Error has occoured')
         })
})

router.post('/addPump', (req, res)=>{
  debug('Request RECIEVED: To add pumps')
  const { name, displayName, percentage, pumpNumber } = req.body
  const params = [name, displayName, percentage, pumpNumber]
  const procedure = 'call sp_AddNewPump(?,?,?,?);'
  pool.getConnection()
         .then((conn) => {
          debug('Calling procedure: '+procedure)
           const result = conn.query(procedure, params)
           conn.release()
           return result;
         })
         .then((result) => {
          debug('Request SUCCESS: ' + procedure)
          const errorMessage = result[0][0][0].ErrorMessage || ''
          res.send({errorMessage: errorMessage})
         }).catch((err)=>{
          debug('Request ERROR: ' + procedure + ', error: ' +  err)
          res.send('An Error has occoured')
         })
})

router.post('/ceasePump', (req, res)=>{
  debug('Request RECIEVED: To cease pumps')
  const { pumpNumber } = req.body
  const params = [pumpNumber]
  const procedure = 'call sp_CeasePump(?);'
  pool.getConnection()
         .then((conn) => {
          debug('Calling procedure: '+procedure)
           const result = conn.query(procedure, params)
           conn.release()
           return result;
         })
         .then((result) => {
          debug('Request SUCCESS: ' + procedure)
          const errorMessage = result[0][0][0].ErrorMessage || ''
          res.send({errorMessage: errorMessage})
         }).catch((err)=>{
          debug('Request ERROR: ' + procedure + ', error: ' +  err)
          res.send('An Error has occoured')
         })
})


router.get('/killAllPumps', (req, res)=>{
  debug('Request RECIEVED to kill all pumps')
  if( RPi ){
    killAllPumps().then((result)=>{
    debug('Request to kill all pumps sucessful')
        res.send({status: true})
      }).catch((err)=>{
        deubg('Request to kill all pumps FAILED, retrying')
        killAllPumps().then((result)=>{debug('Second attempt to kill pumps sucessful')})
                      .catch((err)=>{
                          debug('Second attempt to kill pumps FAILED, NOT RETRYING')
                          res.send({status: false, error: err})
                        })
      })
    } else {
      debug(`Sending Kill Request to hardware ${config.HardwareHost}`)
      axios.get(`${config.HardwareHost}/killAllPumps`)
            .then((hardwareResponse)=>{
                if (hardwareResponse.data.status){
                  res.send({status: true})
                } else {
                  res.send({status: false, error: 'error sending to hardware'})
                }
              }).catch((err)=>{
                res.send({status: false, error: err})
              })
    }
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
