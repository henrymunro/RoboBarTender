const debug = require('debug')('MixDrink')
const wpi = require('wiring-pi')


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

  	ingredientDetails.map((element, key)=>{
  		const { Volume, PumpNumber, GPIOPinNumber, PumpTime, FlowRate } = element
  		const Pump_id = pumpDetails.filter((el)=>{return el.PumpNumber == PumpNumber})[0].Pump_id
  		const IngredientVolume = (Volume/100)*IngredientsVolumeRatio*DrinkTotalVolume
      const PumpTimeCalc = IngredientVolume/(1000*FlowRate)
  		startPumpPour(PumpNumber, GPIOPinNumber, IngredientVolume, PumpTimeCalc, Pump_id)
  // 		console.log(element)
  // 		TextRow {
  // Drink_id: 1,
  // Name: 'Coke',
  // Volume: 80,
  // PumpNumber: 2,
  // Percentage: 0,
  // GPIOPinNumber: 8,
  // FlowRate: '0.0500',
  // PumpTime: '16.00000' }

  	})

}

// Starts pump for the pre set time flow
function startPumpPour(PumpNumber, GPIOPinNumber, IngredientVolume, PumpTime, Pump_id){
	debug('Starting pour on pump '+PumpNumber+' for '+PumpTime+'s ('+IngredientVolume+'ml)')
	logPumpChangeInDB(Pump_id, 1)
  if(RPi){
    setGPIOPinHigh(GPIOPinNumber)
  }
	setTimeout(() => stopPumpPour(PumpNumber, GPIOPinNumber, Pump_id), PumpTime*1000)
}



function stopPumpPour(PumpNumber, GPIOPinNumber, Pump_id){
  debug('Stopping pour on pump '+PumpNumber)
  logPumpChangeInDB(Pump_id, 0)
  if(RPi){
    setGPIOPinLow(GPIOPinNumber)
  }
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
              const GPIOPinNumber = element.GPIOPinNumber
              wpi.digitalWrite(GPIOPinNumber, 0)
            })

            // Continue shut down process
            process.exit();

           }).catch((err)=>{
            debug('Request ERROR: ' + procedure + ', error: ' +  err)
            process.exit();
           })
    process.exit();
    
  });

} else {

  function setGPIOPinHigh(GPIOPinNumber){
    debug('Dummy set '+GPIOPinNumber+' high')
  }

  function setGPIOPinLow(GPIOPinNumber){
    debug('Dummy set '+GPIOPinNumber+' low')
  }

}







module.exports = { 
	mixNewDrink: mixNewDrink
}


