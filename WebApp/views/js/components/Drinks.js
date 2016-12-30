import React from 'react'
import { StickyContainer, Sticky } from 'react-sticky'
import RaisedButton from 'material-ui/RaisedButton'

import Drink from 'js/components/Drink'
import CreateNewDrink from 'js/components/CreateNewDrink'

import { openNewDrinkModal } from 'js/actions/drinksActions'

import baseStyles from 'styles/base.css'



export default class Drinks extends React.Component {
  componentWillMount () {
      
  }

  componentDidMount () {
     
  }

  openNewDrinkModal(){
    this.props.dispatch(openNewDrinkModal())
  }


  render () {
    
    const { drinks, createNewDrink } = this.props

    const drinksComponent = drinks.map((drink, key)=>{
        return <Drink drink={drink} key={key} index={key} dispatch={this.props.dispatch} />
    })

    console.log('DRINKS: ', drinks)

    return <div>
              <RaisedButton label="Create New Drink" fullWidth={true} onClick={this.openNewDrinkModal.bind(this)}/>
              <CreateNewDrink createNewDrink={createNewDrink} axios={this.props.axios} dispatch={this.props.dispatch} /> 
              <h4> 'DRINKS'</h4>
              {drinksComponent}
           </div>
  }
}
