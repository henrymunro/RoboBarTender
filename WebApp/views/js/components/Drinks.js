import React from 'react'
import { StickyContainer, Sticky } from 'react-sticky'
import RaisedButton from 'material-ui/RaisedButton'

import Drink from 'js/components/Drink'
import DrinkHistory from 'js/components/DrinkHistory'
import CreateNewDrink from 'js/components/CreateNewDrink'

import { openNewDrinkModal, openDrinkHistoryModal, getDrinkHistory } from 'js/actions/drinksActions'

import baseStyles from 'styles/base.css'



export default class Drinks extends React.Component {
  componentWillMount () {
      
  }

  componentDidMount () {
     
  }

  openNewDrinkModal(){
    this.props.dispatch(openNewDrinkModal())
  }

  openDrinkHistoryModal(){
    this.props.dispatch(getDrinkHistory(this.props.axios))
    this.props.dispatch(openDrinkHistoryModal())
  }


  render () {
    
    const { drinks, createNewDrink } = this.props

    const drinksComponent = drinks.map((drink, key)=>{
        return <Drink currentDrinkProps={this.props.currentDrinkProps} drink={drink} key={key} index={key} axios={this.props.axios} dispatch={this.props.dispatch} />
    })

    return <div>
              <div className="row">
                <div className="col s6 m6 l6">
                  <RaisedButton label="Create New Drink" fullWidth={true} onClick={this.openNewDrinkModal.bind(this)} style={{marginTop:'20px', marginBottom:'30px'}}/>
                </div>
                <div className="col s6 m6 l6">
                  <RaisedButton label="Drink History" fullWidth={true} onClick={this.openDrinkHistoryModal.bind(this)} style={{marginTop:'20px', marginBottom:'30px'}}/>
                </div>
              </div>
              <CreateNewDrink createNewDrink={createNewDrink} axios={this.props.axios} dispatch={this.props.dispatch} /> 
              <DrinkHistory drinkHistory={this.props.drinkHistory} dispatch={this.props.dispatch} axios={this.props.axios} />
              {drinksComponent}
           </div>
  }
}
