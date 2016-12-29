import { combineReducers } from 'redux'


import layout from './layoutReducer'

import axios from './axiosReducer'
import drinks from './drinksReducer'


export default combineReducers({
  layout,
	axios, 
	drinks
})
