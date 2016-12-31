import React from 'react'
import { connect } from 'react-redux'
import { StickyContainer, Sticky } from 'react-sticky'


import CurrentDrink from 'js/components/CurrentDrink'
import Drinks from 'js/components/Drinks'
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
    const { drinks, 
      selectedDrink, 
      drinkOrdered, 
      drinkProgressPercentage, 
      drinkProgressUpdateInterval,
      drinkOrderedTime,
      pollPumpCount,
      pollPumpPending,
      timeOutPending,
      pollPumpTotalCount,
      createNewDrink
    } = drinksStore
    const welocomeMessage = 'Welcome to your new app ' + username.value
    const message = username.pending ?  'Loading ... ': welocomeMessage


    const drinkOrderedComponent = drinkOrdered ? <DrinkProgressTimer drinkProgressPercentage={drinkProgressPercentage} 
                                                                      pourTime={(drinks.value[selectedDrink]||{}).PourTime} 
                                                                      drinkProgressUpdateInterval={drinkProgressUpdateInterval} 
                                                                      drinkOrderedTime={drinkOrderedTime} 
                                                                      pollPumpCount={pollPumpCount}
                                                                      pollPumpPending={pollPumpPending}
                                                                      timeOutPending={timeOutPending}
                                                                      pollPumpTotalCount={pollPumpTotalCount}
                                                                      drinkOrdered={drinkOrdered}
                                                                      axios={this.props.axios}
                                                                      pumps={pumps}
                                                                      pumpLayout={pumpLayout}
                                                                      dispatch={this.props.dispatch} /> : <div/>


    return <div>
              <StickyContainer>
                <div className="row">
                  <div className="col s12 l3">
                    <Sticky>
                      <CurrentDrink currentDrink={drinks.value[selectedDrink]} drinkVolume={drinksStore.drinkVolume} errorMessage={drinksStore.errorMessage} axios={this.props.axios} dispatch={this.props.dispatch} />
                    </Sticky>
                  </div>
                  <div className="col s12 l9">
                    <h4 className={baseStyles.cf}> {message} </h4>
                    {drinkOrderedComponent}
                    <Drinks createNewDrink={createNewDrink} drinks={drinks.value} axios={this.props.axios} dispatch={this.props.dispatch}  /> 
                  </div>
                </div>
              </StickyContainer>
           </div>
  }
}
