const debug = require('debug')('MixDrink')


const RPi = (process.env.RPi?true:false);


//Load in database connection
const pool = require('../databaseConnection')

debug('Startup: Loading in MIX_DRINK functions')



function mixNewDrink(requestDetails){
	const {
  			Drink_id,
  			DrinkTotalVolume,
  			KillSwitch, // 1 kills request (manual overide) 
  			Pumping, // 1 kills current request
  			pumpDetails,
  			CanMake, 
  			IngredientsVolumeRatio,
  			ingredientDetails        
  		} = requestDetails
  		debug('Request RECIEVED to mix drink: '+ Drink_id)



    // Set the pumping state to 1 to prevenet a subsequent order 
    debug('Pour start, logging pump status 1 in DB')
    setPumpingState(1)

    // Turn on pumps
  	const pumpPromise = ingredientDetails.map((element, key)=>{
  		const { Volume, PumpNumber, GPIOPinNumber, PumpTime, FlowRate } = element
  		const Pump_id = pumpDetails.filter((el)=>{return el.PumpNumber == PumpNumber})[0].Pump_id
  		const IngredientVolume = (Volume/100)*DrinkTotalVolume/IngredientsVolumeRatio
      const PumpTimeCalc = IngredientVolume/(1000*FlowRate)
  		return startPumpPour(PumpNumber, GPIOPinNumber, IngredientVolume, PumpTimeCalc, Pump_id)

  	})

    // Set pumping state to 0 once all pumps stopped to allow for new drink
    Promise.all(pumpPromise).then(values => { 
      debug('Pour finished, logging pump status 0 in DB')
      setPumpingState(0)
    })

}

// Starts pump for the pre set time flow
function startPumpPour(PumpNumber, GPIOPinNumber, IngredientVolume, PumpTime, Pump_id){
  return new Promise((resolve, reject)=>{
  	debug('Starting pour on pump '+PumpNumber+' for '+PumpTime+'s ('+IngredientVolume+'ml)')
  	logPumpChangeInDB(Pump_id, 1)
    if(RPi){
      setGPIOPinHigh(GPIOPinNumber)
    }
  	setTimeout(() => stopPumpPour(PumpNumber, GPIOPinNumber, Pump_id, resolve), PumpTime*1000)   
  })
}



function stopPumpPour(PumpNumber, GPIOPinNumber, Pump_id, resolve){
  debug('Stopping pour on pump '+PumpNumber)
  logPumpChangeInDB(Pump_id, 0)
  if(RPi){
    setGPIOPinLow(GPIOPinNumber)
  }
  resolve({stopPump: true})

}


function setPumpingState(pumpingState){
  // 1 = pumping (busy), 0 = not pumping (availible)
  const logPumping = pumpingState===0?0:1
  pool.getConnection()
         .then((conn) => {
           const result = conn.query('call sp_UpdatePumpingStatus(?);', [logPumping])
           conn.release()
           return result;
         })
         .then((result) => {
          debug('Sucesfully logged pumping status: ' + logPumping)
         }).catch((err)=>{
          debug('ERROR logged pumping status: '+ logPumping +', error: ' +  err)
          reject({err})
         })

}



function logPumpChangeInDB(Pump_id, Status){
	 pool.getConnection()
         .then((conn) => {
           const result = conn.query('call sp_UpdatePumpStatus(?,?);', [Pump_id, Status])
           conn.release()
           return result;
         })
         .then((result) => {
          debug('Sucesfully logged pump status in DB: ', Pump_id, ' , status: ', Status)
         }).catch((err)=>{
          debug('ERROR logged pump status in DB: ', Pump_id, ' , status: ', Status +', error: ' +  err)
          reject({err})
         })
}


//Only sets up GPIO integration if on the RPi
if (RPi) {
  const wpi = require('wiring-pi')

  debug('Startup: setting up GPIO connection with wiring-pi pin numbers')
  wpi.wiringPiSetup()

  function setGPIOPinHigh(GPIOPinNumber){
    debug('Attempting to set Pin '+GPIOPinNumber)
    wpi.pinMode(GPIOPinNumber, wpi.OUTPUT)
    
    debug('Attempting to write Pin '+GPIOPinNumber+' high')
    wpi.digitalWrite(GPIOPinNumber, 1)
  }


  function setGPIOPinLow(GPIOPinNumber){
    debug('Attempting to set Pin '+GPIOPinNumber+' low')
    wpi.pinMode(GPIOPinNumber, wpi.OUTPUT) 
   
    debug('Attempting to write Pin '+GPIOPinNumber+' low')
    wpi.digitalWrite(GPIOPinNumber, 0)
  }

  // Graceful shut down on CTRL-C
  process.on('SIGINT', function () { 
    debug('Gracefully shutting off pins, bye bye!')
    killAllPumps().then((res)=>{
      // Continue shut down process
      process.exit();

     }).catch((err)=>{
            debug('Request ERROR: ' +  err)
            process.exit();
    })
    //process.exit();
    
  });

} else {

  function setGPIOPinHigh(GPIOPinNumber){
    debug('Dummy set '+GPIOPinNumber+' high')
  }

  function setGPIOPinLow(GPIOPinNumber){
    debug('Dummy set '+GPIOPinNumber+' low')
  }

}




function killAllPumps(){
  debug('REQUEST RECIEVED TO KILL ALL PUMPS')
  return new Promise((resolve, reject)=>{
   pool.getConnection()
         .then((conn) => {
           const result = conn.query('call sp_GetPumps();')
           conn.release()
           return result;
         })
         .then((result) => {
            result[0][0].map((element)=>{
              const { PumpNumber, GPIOPinNumber } = element
              debug('Shutting down pump '+ PumpNumber)
              setGPIOPinLow(GPIOPinNumber)
            })
            setPumpingState(0)
            resolve()
         }).catch((err)=>{
          debug('ERROR KILLING PUMPS: '+ err)
          reject(err)
         })
    
  })

}



function logDrinkRequestInDB(drink_id, volume, user, source, status, statusReason){
  return new Promise((resolve, reject)=>{
      debug('Logging drink request')

       pool.getConnection()
         .then((conn) => {
           const result = conn.query('call sp_LogDrinkRequest(?,?,?,?,?,?);', [drink_id, volume, user, source, status, statusReason])
           conn.release()
           return result;
         }).then((result)=>{
            debug('Sucesfully logged drink request in DB')
            resolve()
         }).catch((err)=>{
            debug('ERROR: ', err)
            reject()
         })    
  })
}




module.exports = { 
	mixNewDrink: mixNewDrink,
  killAllPumps: killAllPumps,
  logDrinkRequestInDB: logDrinkRequestInDB
}


