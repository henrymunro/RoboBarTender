const debug = require('debug')('ValidateDrinkOrder')


//Load in database connection
const pool = require('../databaseConnection')

debug('Startup: Loading in VALIDATE_DRINK_ORDER functions')

function validateNewDrinkOrder(Drink_id, Volume){
  return new Promise((resolve, reject)=>{
  		// Set default values for request (default to request killing values, then update to allow requests)
  		let requestDetails = {
  			Drink_id: Drink_id,
  			DrinkTotalVolume: Volume,
  			KillSwitch: 1, // 1 kills request (manual overide) 
  			Pumping: 1, // 1 kills current request
  			pumpDetails: [],
  			CanMake: 0, 
  			drinkNotRecognised: true,
  			CupInPlace: 0,
  			IngredientsVolumeRatio: 0.0,
  			ingredientDetails: []
  		}
  		gatherApplicationInfo().then((result)=>{
  			requestDetails.KillSwitch = result.KillSwitch
			requestDetails.Pumping = result.Pumping
			requestDetails.CupInPlace = result.CupInPlace
  			return gatherPumpInfo()
  		}).then((result)=>{
			requestDetails.pumpDetails = result
			return gatherDrinkInfo(Drink_id)
		}).then((result)=>{
			// console.log('COIH: ', result)
			requestDetails.CanMake = result.CanMake
			requestDetails.IngredientsVolumeRatio = result.IngredientsVolumeRatio 
			requestDetails.ingredientDetails = result.ingredientDetails
			requestDetails.drinkNotRecognised = result.drinkNotRecognised			
			resolve(requestDetails)
		}).catch((err)=>{
			reject(err)
		})
  })
}


function gatherApplicationInfo (){
  return new Promise((resolve, reject)=>{
	  let operation = 'drink ordered, pulling APPLICATION STATUS details'
	  const procedure = 'call sp_GetApplicationStatus();'
	  debug('Request RECIEVED: '+ operation)
	    pool.getConnection()
	         .then((conn) => {
	           const result = conn.query(procedure)
	           conn.release()
	           return result;
	         })
	         .then((result) => {
	         	const applicationDetails = result[0][0][0]        	
	          debug('Request SUCCESS: ' + operation)
	          resolve(applicationDetails)
	         }).catch((err)=>{
	          debug('Request ERROR: ' + operation + ', error: ' +  err)
	          reject({err})
	         })
  })
}

function gatherPumpInfo (){
  return new Promise((resolve, reject)=>{
	  //Gathers Drink Information
	  let operation = 'drink ordered, pulling PUMP details'
	  const procedure = 'call sp_GetPumps();'
	  debug('Request RECIEVED: '+ operation)
	    pool.getConnection()
	         .then((conn) => {
	           const result = conn.query(procedure)
	           conn.release()
	           return result;
	         })
	         .then((result) => {
	         	const pumpDetails = result[0][0]
	          debug('Request SUCCESS: ' + operation)
	          resolve(pumpDetails)
	         }).catch((err)=>{
	          debug('Request ERROR: ' + operation + ', error: ' +  err)
	          reject({err})
	         })
  })
}

function gatherDrinkInfo (Drink_id){
  return new Promise((resolve, reject)=>{
	  //Gathers Drink Information
	  let operation = 'drink ordered, pulling DRINK details from DB [Drink_id] '
	  const procedure = 'CALL sp_GetDrinkIngredients( ?);',
	  		 parameters = [Drink_id]
	  debug('Request RECIEVED: '+ operation)
	    pool.getConnection()
	         .then((conn) => {
	           const result = conn.query(procedure, parameters)
	           conn.release()
	           return result;
	         })
	         .then((result) => {
	         	const drinkDetails = result[0][0][0],
	         			ingredientDetails = result[0][1]
	         	let sendResult
	         	if(drinkDetails){
		         	const {CanMake, IngredientsVolumeRatio} = drinkDetails
		         	sendResult =  { 
		         		drinkNotRecognised: false,
		         		ingredientDetails,
	          			CanMake,
	          			IngredientsVolumeRatio	          		
	          		}	         		
	         	} else {
	         		debug('Drink not recognised')
	         		sendResult = { 
	         			drinkNotRecognised: true,
		         		ingredientDetails: false,
	          			CanMake: false,
	          			IngredientsVolumeRatio: false
	          		}
	         	}
	          debug('Request SUCCESS: ' + operation)
	          
	          resolve(sendResult)
	         }).catch((err)=>{
	          debug('Request ERROR: ' + operation + ', error: ' +  err)
	          reject({err})
	         })
  })
}




module.exports = {
  validateNewDrinkOrder: validateNewDrinkOrder
}



