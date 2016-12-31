export default function reducer (state = {
    drinks: {
      value: [],
      pending: true
    },
    selectedDrink: 0,
    drinkVolume: 250,
    drinkOrdered: false, 
    drinkOrderedTime: '', 
    drinkOrderPending: false, 
    errorMessage: '', 
    drinkProgressPercentage: 0,
    drinkProgressUpdateInterval: 4000,
    pollPumpTotalCount: 10,
    timeOutPending: false,
    pollPumpPending: false,
    pollPumpCount: 0,
    createNewDrink:{
      modalOpen: false, 
      contents: {
        name: '',
        description: '',
        image: '',
        ingredients:[],
        pump:[]
      }
    }
  } , action) {
  switch (action.type) {

    case 'GET_DRINKS_PENDING': {
      return {...state, drinks: {
                                value: state.drinks.value, 
                                pending: true
                              }
      }
    }
    case 'GET_DRINKS_FULFILLED': {
      const drinks = action.payload.data
      return {...state, drinks: {
                                value: drinks, 
                                pending: false
                              }
      }
    }

    case 'SET_DRINK_IMAGE_TO_DEFAULT': {
      const { Drink_id, image } = action.payload
      const currentDrinks = state.drinks.value
      const index = currentDrinks.findIndex(function (obj) {return Number(obj.Drink_id) == Number(Drink_id) })
      const updatedDrink = Object.assign({}, currentDrinks[index], {DrinkImage: image})
      const newDrinksState = [
                              ...state.drinks.value.slice(0, index),
                              updatedDrink,
                              ...state.drinks.value.slice(index + 1)
                            ]
      return {...state, drinks: {
                                value: newDrinksState, 
                                pending: false
                              }
      }
    }

    /* ###################### ORDER DRINK ##############################*/


    case 'UPDATE_DRINK_VOLUME': {
      const drinkVolume = action.payload
      return {...state, drinkVolume: drinkVolume}
    }

    case 'UPDATE_SELECTED_DRINK':{
      return{ ...state, selectedDrink: action.payload}
    }


    case 'ORDER_DRINK_PENDING': {
      return {...state, drinkOrderPending: true}
    }

    case 'ORDER_DRINK_FULFILLED': {
      const { orderPlaced, errorMessage } = action.payload.data
      return {...state, 
        drinkOrderPending: false,
        drinkOrdered: orderPlaced,
        drinkOrderedTime:orderPlaced? new Date().getTime(): '',
        errorMessage: errorMessage || ''
      }
    }

    /* ################   CHECK DRINK ORDER PROCESS ACTIONS #################*/

    case 'UPDATE_DRINK_PROGRESS_TIMER': {
      const { drinkOrdered, progress } =action.payload
      return {...state, drinkProgressPercentage: progress, drinkOrdered: drinkOrdered}
    }

    case 'RESET_POLL_PUMP_COUNT':{
      return {...state, pollPumpPending: false, pollPumpCount: 0}
    }
    case 'POLL_PUMP_STATUS_FULFILLED':{
      return {...state, pollPumpPending: false, pollPumpCount: state.pollPumpCount + 1}
    }
    case 'POLL_PUMP_STATUS_PENDING':{
      return {...state, pollPumpPending: true}
    }

    case 'SET_PENDING_TIMEOUT':{
      return {...state, timeOutPending: action.payload}
    }


    /* ####################   CREATE NEW DRINK  ###############################*/  
    case 'CLOSE_NEW_DRINK_MODAL':{
      return { ...state, createNewDrink:{
                              modalOpen: false,
                              contents: state.createNewDrink.contents
                            }
      }
    }
    case 'OPEN_NEW_DRINK_MODAL':{
      return { ...state, createNewDrink:{
                              modalOpen: true,
                              contents: state.createNewDrink.contents
                            }
      }
    }

    case 'GET_PUMP_INFO_FOR_NEW_DRINK_FULFILLED':{
      return { ...state, createNewDrink:{
                              modalOpen: state.createNewDrink.modalOpen,
                              contents: {
                                name: '',
                                description: '',
                                image: '',
                                ingredients:[],
                                pump:action.payload.data
                              }
                            }
      }
    }

    case 'UPDATE_NEW_DRINK_NAME':{
      return { ...state, createNewDrink:{
                              modalOpen: state.createNewDrink.modalOpen,
                              contents: {
                                name: action.payload,
                                description: state.createNewDrink.contents.description,
                                image: state.createNewDrink.contents.image,
                                ingredients:state.createNewDrink.contents.ingredients,
                                pump:state.createNewDrink.contents.pump
                              }
                            }
      }
    }

    case 'UPDATE_NEW_DRINK_DESCRIPTION':{
      return { ...state, createNewDrink:{
                              modalOpen: state.createNewDrink.modalOpen,
                              contents: {
                                name: state.createNewDrink.contents.name,
                                description: action.payload,
                                image: state.createNewDrink.contents.image,
                                ingredients:state.createNewDrink.contents.ingredients,
                                pump:state.createNewDrink.contents.pump
                              }
                            }
      }
    }

    case 'UPDATE_NEW_DRINK_IMAGE':{
      return { ...state, createNewDrink:{
                              modalOpen: state.createNewDrink.modalOpen,
                              contents: {
                                name: state.createNewDrink.contents.name,
                                description: state.createNewDrink.contents.description,
                                image: action.payload,
                                ingredients:state.createNewDrink.contents.ingredients,
                                pump:state.createNewDrink.contents.pump
                              }
                            }
      }
    }


    case 'UPDATE_NEW_DRINK_INGREDIENET_PROPORTION':{
      const {pump_id, value } = action.payload
      const currentPumps = state.createNewDrink.contents.pump
      const index = currentPumps.findIndex(function (obj) {return Number(obj.Pump_id) == Number(pump_id) })
      const updatedPump = Object.assign({}, currentPumps[index], {newDrinkProportion: value})
      const newPumpState = [
                              ...state.createNewDrink.contents.pump.slice(0, index),
                              updatedPump,
                              ...state.createNewDrink.contents.pump.slice(index + 1)
                            ]
      const newIngredients = [...newPumpState].filter((elm)=> {return elm.newDrinkProportion > 0})
                                              .sort((a,b)=> {return (a.name > b.name) - (a.name < b.name)})
      return{ ...state, createNewDrink:{
                              modalOpen: state.createNewDrink.modalOpen,
                              contents: {
                                name: state.createNewDrink.contents.name,
                                description: state.createNewDrink.contents.description,
                                image: state.createNewDrink.contents.image,
                                ingredients: newIngredients,
                                pump: newPumpState
                              }
                            }
      }
    }


  }
  return state
}


