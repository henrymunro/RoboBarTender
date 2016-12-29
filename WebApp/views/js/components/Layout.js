import React from 'react'
import { connect } from 'react-redux'
import { StickyContainer, Sticky } from 'react-sticky'

import Drinks from 'js/components/Drinks'
import Pumps from 'js/components/Pumps'

import baseStyles from 'styles/base.css'

import { getUsername, getPumps } from 'js/actions/layoutActions'
import { getDrinks } from 'js/actions/drinksActions'


@connect((store) => {
  return {
    username: store.layout.username,
    drinksStore: store.drinks,
    axios: store.axios.axios,
    pumps: store.layout.pumps,
    pumpLayout: store.layout.pumpLayout
  }
})
export default class Layout extends React.Component {
  componentWillMount () {
      setTimeout(()=>{this.props.dispatch(getUsername())}, 1000)
  }

  componentDidMount(){
    this.props.dispatch(getDrinks(this.props.axios))
    this.props.dispatch(getPumps(this.props.axios))
  }


  render () {
    const {username, drinksStore, pumps, pumpLayout} = this.props
    const { drinks, selectedDrink } = drinksStore
    const welocomeMessage = 'Welcome to your new app ' + username.value
    const message = username.pending ?  'Loading ... ': welocomeMessage

    return <div>
              <h1 className={baseStyles.cf}> {message} </h1>
              <Pumps pumps={pumps.value} pumpLayout={pumpLayout} dispatch={this.props.dispatch} /> 
              <Drinks drinks={drinks.value} dispatch={this.props.dispatch} /> 
           </div>
  }
}
