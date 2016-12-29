import React from 'react'
import { connect } from 'react-redux'
import { StickyContainer, Sticky } from 'react-sticky'


import CurrentDrink from 'js/components/CurrentDrink'
import Drinks from 'js/components/Drinks'
import Pumps from 'js/components/Pumps'
import DrinkProgressTimer from 'js/components/DrinkProgressTimer'

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
    const { drinks, selectedDrink, drinkOrdered, drinkProgressPercentage, drinkProgressUpdateInterval } = drinksStore
    const welocomeMessage = 'Welcome to your new app ' + username.value
    const message = username.pending ?  'Loading ... ': welocomeMessage

    const drinkOrderedComponent = drinkOrdered? <DrinkProgressTimer drinkProgressPercentage={drinkProgressPercentage} pourTime={drinks.value[selectedDrink].PourTime} drinkProgressUpdateInterval={drinkProgressUpdateInterval} dispatch={this.props.dispatch} /> : <div/>

    return <div>
              <div className="row">
                <div className="col s12 l3">
                  <CurrentDrink currentDrink={drinks.value[selectedDrink]} drinkVolume={drinksStore.drinkVolume} axios={this.props.axios} dispatch={this.props.dispatch} />
                </div>
                <div className="col s12 l9">
                  <h4 className={baseStyles.cf}> {message} </h4>
                  {drinkOrderedComponent}
                  <Pumps pumps={pumps.value} pumpLayout={pumpLayout} dispatch={this.props.dispatch} /> 
                  <Drinks drinks={drinks.value} dispatch={this.props.dispatch}  /> 
                </div>
              </div>
           </div>
  }
}
