import axios from 'axios'

// Load in config
const environment = process.env.NODE_ENV||'development'
// Check to see if an incorrect environment has been set
if ( !(environment!='production'||environment!='staging'||environment!='development')){
    throw `ENVIROMENT NOT RECOGNISED ${environment}`
}

console.log('ENVIROMENT: ', environment)

let baseURL, hardwareURL
switch (environment) {
    case 'production':
        baseURL = 'https://henrymunro.com/RoboBarTender/'
        hardwareURL = 'https://146.198.253.171/'
        break
    case 'staging':
        baseURL = 'https://stg.henrymunro.com/RoboBarTender/'
        hardwareURL = 'https://146.198.253.171/'
        break
    case 'development':
        baseURL = 'http://localhost:3000/'
        hardwareURL = 'http://192.168.1.2:3000/'
        break
}

console.log('BASE URL: ', baseURL)

export default function reducer (state = {
    axios: {
      request: axios.create({
        // baseURL: baseURL,
        timeout: 5000

        }),
        URLS: {
        // Log
        logError: baseURL+'log/browserError',
        // Drinks
        getDrinks: baseURL+'drinks',
        getDrinkHistory: baseURL+'drinks/drinkHistory',
        deleteDrink: baseURL+'drinks/delete',
        orderDrink: baseURL+'drinks/order',
        createDrink: baseURL+'drinks/createDrink',
        getDrinkIngredients: 'drinks/getDrinkIngredients',
        // Pumps
        getPumps: baseURL+'pump',
        pollPump: baseURL+'pump/poll',
        addPump: baseURL+'pump/addPump',
        ceasePump: baseURL+'pump/ceasePump',
        pumpsForNewDrink: baseURL+'pump/pumpsForNewDrink',
        // Kill pumps goes staight to hardware
        killAllPumps: baseURL+'pump/killAllPumps'
        }
    },
    config: {
        environment: environment
    }
  } , action) {
  return state
}
