import React from 'react'
import { connect } from 'react-redux'
import { StickyContainer, Sticky } from 'react-sticky'


import CurrentDrink from 'js/components/CurrentDrink'
import Drinks from 'js/components/Drinks'
import DrinkProgressTimer from 'js/components/DrinkProgressTimer'
import EditPumps from 'js/components/EditPumps'

import baseStyles from 'styles/base.css'

import { getUsername, getPumps } from 'js/actions/layoutActions'
import { getDrinks, getDrinkIngredients } from 'js/actions/drinksActions'


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
        .then((res)=>{
          console.log('GOT DRINKS: ',res.value.data[0].Drink_id, res)
          this.props.dispatch(getDrinkIngredients(res.value.data[0].Drink_id, this.props.axios))
        })
    this.props.dispatch(getPumps(this.props.axios))
  }


  render () {
    const {username, drinksStore, pumps, pumpLayout} = this.props
    const { drinks, 
      selectedDrink, 
      selectedDrinkIngredients,
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

    // Props to pass to current drink compontent                                                                  
    const currentDrink = drinks.value[selectedDrink]                                                                  
    const drinkVolume = drinksStore.drinkVolume
    const errorMessage = drinksStore.errorMessage
    const currentDrinkProps = { currentDrink, selectedDrinkIngredients, drinkVolume, errorMessage}

    return <div>
              <StickyContainer>
                <div className="row">
                  <div className="col hide-on-med-and-down l3">
                    <Sticky>
                      <CurrentDrink 
                          {... currentDrinkProps}
                          axios={this.props.axios} 
                          dispatch={this.props.dispatch} />
                    </Sticky>
                  </div>
                  <div className="col s12 m12 l9">
                    {drinkOrderedComponent}
                    <Drinks 
                      currentDrinkProps= {currentDrinkProps}
                      createNewDrink={createNewDrink} 
                      drinks={drinks.value} 
                      axios={this.props.axios} 
                      dispatch={this.props.dispatch}  /> 
                  </div>
                </div>
              </StickyContainer>
           </div>
  }
}
