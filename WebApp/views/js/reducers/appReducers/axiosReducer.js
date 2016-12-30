import axios from 'axios'

export default function reducer (state = {
    axios: {
      request: axios.create({
        baseURL: 'http://localhost:3000/',
        timeout: 5000

        }),
        URLS: {
        baseURL: 'http://localhost:3000/',
        // Log
        logError: 'log/browserError',
        // Drinks
        getDrinks: 'drinks',
        orderDrink: 'drinks/order',
        // Pumps
        getPumps: 'pump',
        pollPump: 'pump/poll',
        addPump: 'pump/addPump',
        ceasePump: 'pump/ceasePump',
        pumpsForNewDrink: 'pump/pumpsForNewDrink'
        }
    }
  } , action) {
  return state
}
