export default function reducer (state = {
    username: {
      value: '',
      pending: true
    }
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
  }

  return state
}


