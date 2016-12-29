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