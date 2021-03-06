import React from 'react'
import { connect } from 'react-redux'
import { StickyContainer, Sticky } from 'react-sticky'
import RaisedButton from 'material-ui/RaisedButton'

import CurrentDrink from 'js/components/CurrentDrink'
import Drinks from 'js/components/Drinks'
import DrinkProgressTimer from 'js/components/DrinkProgressTimer'
import EditPumps from 'js/components/EditPumps'

import baseStyles from 'styles/base.css'

import { getUsername, getPumps, openEditPumpDialog, updateSelectedEditPump, killAllPumps } from 'js/actions/layoutActions'
import { getDrinks, getDrinkIngredients } from 'js/actions/drinksActions'


@connect((store) => {
  return {
    username: store.layout.username,
    drinksStore: store.drinks,
    axios: store.axios.axios,
    pumps: store.layout.pumps,
    pumpLayout: store.layout.pumpLayout,
    editPumps: store.layout.editPumps
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

  openEditPumpsDialog(){
    this.props.dispatch(updateSelectedEditPump(1))
  }

  killAllPumps(){
    this.props.dispatch(killAllPumps(this.props.axios))
          .then((result)=>{
            console.log('Result: ', result)
            const { status, err } = result.value.data
            if (!status){
              alert('ERROR: '+ err)
            }
          })
  }


  render () {
    const {username, drinksStore, pumps, pumpLayout, editPumps} = this.props
    const { drinks, 
      selectedDrink, 
      selectedDrinkIngredients,
      drinkHistory,
      drinkOrdered, 
      drinkProgressPercentage, 
      drinkProgressUpdateInterval,
      drinkOrderedTime,
      pollPumpCount,
      pollPumpPending,
      timeOutPending,
      pollPumpTotalCount,
      drinkVolume,
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
                                                                      drinkVolume={drinkVolume}
                                                                      pumpLayout={pumpLayout}
                                                                      dispatch={this.props.dispatch} /> : <div/>

    // Props to pass to current drink compontent                                                                  
    const currentDrink = drinks.value[selectedDrink] 
    const errorMessage = drinksStore.errorMessage
    const currentDrinkProps = { currentDrink, selectedDrinkIngredients, drinkVolume, errorMessage}

    //Edit Pumps props
    const editPumpsProps = {pumps, pumpLayout, editPumps}

    return <div>
              <StickyContainer>
                <div className="row" style={{marginBottom:'0'}}>
                  <div className="col hide-on-med-and-down l3" style={{height:document.body.scrollHeight+'px', background:'#eceff1', marginBottom:'0'}}>
                    <Sticky>
                      <CurrentDrink 
                          {... currentDrinkProps}
                          axios={this.props.axios} 
                          dispatch={this.props.dispatch} />
                      <div className="row" style={{marginTop: '10px'}}>
                        <div className="col s6 m6 l6">
                            <RaisedButton label='Edit Pumps' primary={true} onClick={this.openEditPumpsDialog.bind(this)} />
                            <EditPumps {...editPumpsProps} axios={this.props.axios} dispatch={this.props.dispatch} />
                        </div>
                        <div className="col s6 m6 l6">
                          <RaisedButton label='KILL PUMP' secondary={true} onClick={this.killAllPumps.bind(this)} />
                        </div>
                      </div>
                    </Sticky>
                  </div>
                  <div className="col s12 m12 l9">
                    <div className='hide-on-med-and-down'>
                      {drinkOrderedComponent}
                    </div>
                    <Drinks 
                      currentDrinkProps= {currentDrinkProps}
                      createNewDrink={createNewDrink} 
                      drinks={drinks.value} 
                      drinkHistory={drinkHistory}
                      axios={this.props.axios} 
                      dispatch={this.props.dispatch}  /> 
                  </div>
                </div>
              </StickyContainer>
           </div>
  }
}
