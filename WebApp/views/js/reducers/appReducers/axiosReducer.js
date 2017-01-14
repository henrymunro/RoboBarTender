import axios from 'axios'

const RPi = (process.env.RPi?true:false)

let baseURL = RPi?'http://192.168.1.33:3000/':'http://localhost:3000/'
baseURL = '51.6.194.23'

console.log('BASE URL: ', baseURL)

export default function reducer (state = {
    axios: {
      request: axios.create({
        // baseURL: baseURL,
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
