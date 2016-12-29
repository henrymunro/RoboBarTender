export function getUsername (axios) {
  return {
    type: 'GET_USER_FULFILLED', //'GET_USER' if using axios
    payload: 'your name'//axios.request.get(axios.URLS.accounts)
  }
}

