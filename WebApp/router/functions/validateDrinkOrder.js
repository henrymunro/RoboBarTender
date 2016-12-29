const debug = require('debug')('ValidateDrinkOrder')


//Load in database connection
const pool = require('../databaseConnection')

debug('Startup: Loading in VALIDATE_DRINK_ORDER functions')

function validateNewDrinkOrder(Drink_id, Volume){
  return new Promise((resolve, reject)=>{
  		// Set default values for request (default to request killing values, then update to allow requests)
  		let requestDetails = {
  			KillSwitch: 1, // 1 kills request (manual overide) 
  			Pumping: 1, // 1 kills current request
  			pumpDetails: [],
  			CanMake: 0, 
  			IngredientsVolumeRatio: 0.0,
  			ingredientDetails: []
  		}
  		gatherApplicationInfo().then((result)=>{
  			requestDetails.KillSwitch = result.KillSwitch
			requestDetails.Pumping = result.Pumping
  			return gatherPumpInfo()
  		}).then((result)=>{
			requestDetails.pumpDetails = result
			return gatherDrinkInfo(Drink_id)
		}).then((result)=>{
			requestDetails.CanMake = result.CanMake
			requestDetails.IngredientsVolumeRatio = result.IngredientsVolumeRatio 
			requestDetails.ingredientDetails = result.ingredientDetails
			console.log(requestDetails)
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

	         	const {CanMake, IngredientsVolumeRatio} = drinkDetails
	          debug('Request SUCCESS: ' + operation)
	          const sendResult =  { ingredientDetails: ingredientDetails,
	          			CanMake: CanMake,
	          			IngredientsVolumeRatio: IngredientsVolumeRatio
	          		}
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



