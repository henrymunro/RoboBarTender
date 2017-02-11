import React from 'react'

export default function reducer (state = {
    drinks: {
      value: [],
      pending: true
    },
    selectedDrink: 0,
    selectedDrinkIngredients: [],
    drinkVolume: 250,
    drinkOrdered: false, 
    drinkOrderedTime: '', 
    drinkOrderPending: false, 
    errorMessage: '', 
    drinkProgressPercentage: 0,
    drinkProgressUpdateInterval: 250,
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
        pump:[],
        imageElement: "images/default.jpg"
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

    case 'GET_DRINK_INGREDIENTS_FULFILLED': {
      return { ...state, selectedDrinkIngredients: action.payload.data}
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

    case 'KILL_ALL_PUMPS_FULFILLED': {
      return {...state, 
        drinkOrderPending: false,
        drinkOrdered: false,
        drinkOrderedTime: '',
        errorMessage: ''
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
                                pump:action.payload.data,
                                imageElement: state.createNewDrink.contents.imageElement
                              }
                            }
      }
    }

    case 'UPDATE_NEW_DRINK_NAME':{
      return { ...state, createNewDrink:{
                              modalOpen: state.createNewDrink.modalOpen,
                              contents: {
                                ...state.createNewDrink.contents,
                                name: action.payload
                              }
                            }
      }
    }

    case 'UPDATE_NEW_DRINK_DESCRIPTION':{
      return { ...state, createNewDrink:{
                              modalOpen: state.createNewDrink.modalOpen,
                              contents: {
                                ...state.createNewDrink.contents,
                                description: action.payload
                              }
                            }
      }
    }

    case 'UPDATE_NEW_DRINK_IMAGE':{
      return { ...state, createNewDrink:{
                              modalOpen: state.createNewDrink.modalOpen,
                              contents: {
                                ...state.createNewDrink.contents,
                                image: action.payload
                              }
                            }
      }
    }

    case 'UPDATE_NEW_DRINK_IMAGE_ELEMENT':{
      return { ...state, createNewDrink:{
                              modalOpen: state.createNewDrink.modalOpen,
                              contents: {
                                ...state.createNewDrink.contents,
                                imageElement: action.payload
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
                                ...state.createNewDrink.contents,
                                pump: newPumpState,
                                ingredients: newIngredients
                              }
                            }
      }
    }


  }
  return state
}


