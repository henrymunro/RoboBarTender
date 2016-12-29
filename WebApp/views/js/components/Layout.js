import React from 'react'
import { connect } from 'react-redux'
import { StickyContainer, Sticky } from 'react-sticky'

import Drinks from 'js/components/Drinks'

import baseStyles from 'styles/base.css'

import { getUsername } from 'js/actions/layoutActions'
import { getDrinks } from 'js/actions/drinksActions'


@connect((store) => {
  return {
    username: store.layout.username,
    drinksStore: store.drinks,
    axios: store.axios.axios
  }
})
export default class Layout extends React.Component {
  componentWillMount () {
      setTimeout(()=>{this.props.dispatch(getUsername())}, 1000)
  }

  componentDidMount(){
    this.props.dispatch(getDrinks(this.props.axios))
  }


  render () {
    const {username, drinksStore} = this.props
    const { drinks, selectedDrink } = drinksStore
    const welocomeMessage = 'Welcome to your new app ' + username.value
    const message = username.pending ?  'Loading ... ': welocomeMessage

    return <div>
              <h1 className={baseStyles.cf}> {message} </h1>
              <Drinks drinks={drinks.value} dispatch={this.props.dispatch} /> 
           </div>
  }
}
