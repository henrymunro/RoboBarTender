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