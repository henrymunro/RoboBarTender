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


    // CREATE NEW DRINK  
    case 'CLOSE_NEW_DRINK_MODAL':{
      return { ...state, createNewDrink:{
                              modalOpen: false,
                              contents: state.createNewDrink.contents
                            }
      }
    }
    case 'OPEN_NEW_DRINK_MODAL':{
      return { ...state, createNewDrink:{
                              modalOpen: false,
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
                                pump:action.payload.data
                              }
                            }
      }
    }
  }
  return state
}


