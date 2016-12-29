export default function reducer (state = {
    username: {
      value: '',
      pending: true
    },
    pumps:{
      value: [],
      pending: true
    }, 
    pumpLayout: [{pumpNumber: 1, active: false},
                  {pumpNumber: 2, active: false},
                  {pumpNumber: 3, active: false},
                  {pumpNumber: 4, active: false},
                  {pumpNumber: 5, active: false}],
    pumping: false
  } , action) {
  switch (action.type) {

    case 'GET_USER_FULFILLED': {
      const username = action.payload//.data
      return {...state, username: {
                                value: username, 
                                pending: false
                              }
      }
    }

    case 'GET_PUMPS_PENDING': {
      return {...state, pumps: {
                                value: state.pumps.value, 
                                pending: true
                              }
      }
    }
    case 'GET_PUMPS_FULFILLED': {
      const pumps = action.payload.data
      return {...state, pumps: {
                                value: pumps, 
                                pending: false
                              }
      }
    }

    case 'POLL_PUMP_STATUS_FULFILLED': {
      const pumps = action.payload.data
      return {...state, pumps: {
                                value: pumps, 
                                pending: false
                              }
      }
    }
  }

  return state
}


