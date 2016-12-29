const debug = require('debug')('MixDrink')


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
  		const IngredientVolume = (Volume/100)*IngredientsVolumeRatio*DrinkTotalVolume
  		startPumpPour(PumpNumber, GPIOPinNumber, IngredientVolume, PumpTime)
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


function startPumpPour(PumpNumber, GPIOPinNumber, IngredientVolume, PumpTime){
	debug('Starting pour on pump '+PumpNumber+' for '+PumpTime+'s ('+IngredientVolume+'ml)')
	setTimeout(() => stopPumpPour(PumpNumber, GPIOPinNumber), PumpTime*1000)
}

function stopPumpPour(PumpNumber, GPIOPinNumber){
	debug('Stopping pour on pump '+PumpNumber)
}


module.exports = { 
	mixNewDrink: mixNewDrink
}