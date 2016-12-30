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


// Gets the pump layout stored in the DB
export function addPump(name, displayName, percentage, pumpNumber, axios){
	return {
		type:'GET_PUMPS',
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
		type:'GET_PUMPS',
		payload: axios.request.post(axios.URLS.ceasePump, {pumpNumber: pumpNumber}) 
	}
}