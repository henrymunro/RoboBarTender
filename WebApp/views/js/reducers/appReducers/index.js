import { combineReducers } from 'redux'


import layout from './layoutReducer'

import axios from './axiosReducer'


export default combineReducers({
  layout,
	axios
})
