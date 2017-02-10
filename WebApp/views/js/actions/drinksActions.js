export function getDrinks (axios) {
  return {
    type: 'GET_DRINKS',
    payload: axios.request.get(axios.URLS.getDrinks)
  }
}

export function setDrinkImageToDefault(Drink_id, image){
	return{
		type:'SET_DRINK_IMAGE_TO_DEFAULT',
		payload: {Drink_id: Drink_id, image: image}
	}
}

export function updateSelectedDrink(index){
	return{
		type: 'UPDATE_SELECTED_DRINK',
		payload: index
	}
}

export function getDrinkIngredients(Drink_id, axios){
	return{
		type: 'GET_DRINK_INGREDIENTS',
		payload: axios.request.post(axios.URLS.getDrinkIngredients, {Drink_id: Drink_id})
	}
}

/* ###################### ORDER DRINK ##############################*/

export function updateDrinkVolume(volume){
	return{
		type: 'UPDATE_DRINK_VOLUME',
		payload: volume
	}
}

export function orderDrink(Drink_id, Volume, axios){
	return{
		type: 'ORDER_DRINK',
		payload: axios.request.post(axios.URLS.orderDrink, {Drink_id: Drink_id, Volume: Volume})
	}
}


/* ################   CHECK DRINK ORDER PROCESS ACTIONS #################*/
export function updateDrinkTimerProgress( progress, drinkOrdered){
	return{
		type: 'UPDATE_DRINK_PROGRESS_TIMER', 
		payload: {progress: progress, drinkOrdered:drinkOrdered}
	}
}

export function pollPumps( axios){
	return{
		type: 'POLL_PUMP_STATUS', 
		payload: axios.request.get(axios.URLS.pollPump)
	}
}

export function resetPollPumpsCount(){
	return{
		type: 'RESET_POLL_PUMP_COUNT', 
		payload: 0
	}
}

//used to prevent run away time out loops being triggered upon DrinkProgressTimerUpdate
export function setPendingTimeout(value){
	return{
		type: 'SET_PENDING_TIMEOUT',
		payload: value
	}
}




/*  #########################    CREATE NEW DRINK ACTIONS #########################*/
export function getPumpInfoForNewDrink(axios){
	return{
		type: 'GET_PUMP_INFO_FOR_NEW_DRINK',
		payload: axios.request.get(axios.URLS.pumpsForNewDrink)
	}
}

export function closeNewDrinkModal(){
	return{
		type: 'CLOSE_NEW_DRINK_MODAL', 
		payload: false
	}
}

export function openNewDrinkModal(){
	return{
		type: 'OPEN_NEW_DRINK_MODAL', 
		payload: true
	}
}

export function updateNewDrinkIngredientProportion(pump_id, value){
	return{
		type: 'UPDATE_NEW_DRINK_INGREDIENET_PROPORTION',
		payload: { value: value, pump_id: pump_id}
	}
}

export function updateNewDrinkName(name){
	return{
		type: 'UPDATE_NEW_DRINK_NAME',
		payload: name
	}
}
export function updateNewDrinkDescription(description){
	return{
		type: 'UPDATE_NEW_DRINK_DESCRIPTION',
		payload: description
	}
}

export function updateNewDrinkImage(image){
	return{
		type: 'UPDATE_NEW_DRINK_IMAGE',
		payload: image
	}
}


export function createNewDrink( name, description, ingredients, image, axios ){
	return {
		type: 'CREATE_NEW_DRINK',
		payload: axios.request.post(axios.URLS.createDrink, {name: name, image:image, description: description, ingredients: ingredients})
	}
}