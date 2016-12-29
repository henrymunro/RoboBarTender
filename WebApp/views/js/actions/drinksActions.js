export function getDrinks (axios) {
  return {
    type: 'GET_DRINKS',
    payload: axios.request.get(axios.URLS.getDrinks)
  }
}

