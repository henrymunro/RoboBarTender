export function getDrinks (axios) {
  return {
    type: 'GET_DRINKS',
    payload: axios.request.get(axios.URLS.getDrinks)
  }
}

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

export function updateSelectedDrink(index){
	return{
		type: 'UPDATE_SELECTED_DRINK',
		payload: index
	}
}

export function getPumpInfoForNewDrink(axios){
	return{
		type: 'GET_PUMP_INFO_FOR_NEW_DRINK',
		payload: axios.request.post(axios.URLS.pumpsForNewDrink)
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