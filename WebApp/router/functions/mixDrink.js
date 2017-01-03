const debug = require('debug')('MixDrink')
const gpio = require('rpi-gpio');


const RPi = true;


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
  		const { Volume, PumpNumber, GPIOPinNumber, PumpTime } = element
  		const Pump_id = pumpDetails.filter((el)=>{return el.PumpNumber == PumpNumber})[0].Pump_id
  		const IngredientVolume = (Volume/100)*IngredientsVolumeRatio*DrinkTotalVolume
  		startPumpPour(PumpNumber, GPIOPinNumber, IngredientVolume, PumpTime, Pump_id)
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

//sp_UpdatePumpStatus
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

function setGPIOPinHigh(GPIOPinNumber){
  gpio.setup(GPIOPinNumber, gpio.DIR_OUT, write);
 
  function write() {
      gpio.write(GPIOPinNumber, true, function(err) {
          if (err) throw err;
          debug('Set Pin '+GPIOPinNumber+' high')
      });
  }
}

function setGPIOPinLow(GPIOPinNumber){
  gpio.setup(GPIOPinNumber, gpio.DIR_OUT, write);
 
  function write() {
      gpio.write(GPIOPinNumber, false, function(err) {
          if (err) throw err;
          debug('Set Pin '+GPIOPinNumber+' low')
      });
  }
}



module.exports = { 
	mixNewDrink: mixNewDrink
}