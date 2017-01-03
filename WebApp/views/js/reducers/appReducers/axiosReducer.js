import axios from 'axios'

export default function reducer (state = {
    axios: {
      request: axios.create({
        //baseURL: 'http://localhost:3000/',  //for dev 
        baseURL: 'http://192.168.1.33:3000/', // for RPi
        timeout: 5000

        }),
        URLS: {
        baseURL: 'http://localhost:3000/',
        // Log
        logError: 'log/browserError',
        // Drinks
        getDrinks: 'drinks',
        orderDrink: 'drinks/order',
        createDrink: 'drinks/createDrink',
        getDrinkIngredients: 'drinks/getDrinkIngredients',
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
