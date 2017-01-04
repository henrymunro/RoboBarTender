export function getUsername (axios) {
  return {
    type: 'GET_USER_FULFILLED', //'GET_USER' if using axios
    payload: 'your name'//axios.request.get(axios.URLS.accounts)
  }
}


// Gets the pump layout stored in the DB
export function getPumps(axios){
	return {
		type:'GET_PUMPS',
		payload: axios.request.get(axios.URLS.getPumps) 
	}
}


/********************* EDIT PUMPS ********************************/

export function openEditPumpDialog(){
	return {
		type: 'OPEN_EDIT_PUMP_DIALOG',
		payload: true
	}
}

export function closeEditPumpDialog(){
	return {
		type: 'CLOSE_EDIT_PUMP_DIALOG',
		payload: false
	}
}


export function updateSelectedEditPump(pump_id){
	return{
		type: 'UPDATE_SELECTED_EDIT_PUMP',
		payload: pump_id
	}
}

export function updateEditPumpName(Name){
	return{
		type:'UPDATE_EDIT_PUMP_NAME',
		payload: Name
	}
}

export function updateEditPumpDisplayName(DisplayName){
	return{
		type:'UPDATE_EDIT_PUMP_DISPLAY_NAME',
		payload: DisplayName
	}
}

export function updateEditPumpPercentage(Percentage){
	return{
		type:'UPDATE_EDIT_PUMP_PERCENTAGE',
		payload: Percentage
	}
}


// Gets the pump layout stored in the DB
export function addPump(name, displayName, percentage, pumpNumber, axios){
	return {
		type:'ADD_PUMPS',
		payload: axios.request.post(axios.URLS.addPump, {name:name, 
														displayName:displayName, 
														percentage: percentage, 
														pumpNumber: pumpNumber
													}) 
	}
}

// Gets the pump layout stored in the DB
export function ceasePump(pumpNumber, axios){
	return {
		type:'CEASE_PUMP',
		payload: axios.request.post(axios.URLS.ceasePump, {pumpNumber: pumpNumber}) 
	}
}