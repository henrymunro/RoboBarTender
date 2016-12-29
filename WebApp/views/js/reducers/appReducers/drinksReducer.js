export default function reducer (state = {
    drinks: {
      value: [],
      pending: true
    },
    selectedDrink: 0,
    drinkVolume: 250
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
  }

  return state
}


