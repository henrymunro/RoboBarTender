import React from 'react'
import { StickyContainer, Sticky } from 'react-sticky'
import Slider from 'material-ui/Slider'
import RaisedButton from 'material-ui/RaisedButton'
import moment from 'moment'

import {updateDrinkVolume, orderDrink } from 'js/actions/drinksActions'

import baseStyles from 'styles/base.css'



export default class CurrentDrink extends React.Component {
  componentWillMount () {
      
  }

  componentDidMount () {
     
  }

  updateDrinkVolume(e, value){
    this.props.dispatch(updateDrinkVolume(value))
  }

  orderDrink(e){
    const Drink_id = this.props.currentDrink.Drink_id
    const { drinkVolume } = this.props
    this.props.dispatch(orderDrink(Drink_id, drinkVolume, this.props.axios))
  }


  render () {
    
    const { AddedBy, 
      AlcoholPercentage,  
      CanMake,
      DrinkDescription,
      DrinkImage,
      DrinkName,
      DrinkStartDate,
      PourTime,
      IngredientsVolumeRatio,
      Drink_id
    } = this.props.currentDrink || {}

    const { drinkVolume } = this.props

    return <div>
              <h4>{DrinkName}</h4>
              <p>{DrinkDescription}</p>
              <p>Created by: {AddedBy}</p>
              <p>Created at: {moment(DrinkStartDate).format('DD-MM-YYYY')}</p>
              <p>Percentage: {AlcoholPercentage}%</p>
              <Slider
                min={0}
                max={500}
                step={10}
                value={drinkVolume}
                onChange={this.updateDrinkVolume.bind(this)}
              />
              <p> {drinkVolume} ml </p>
              <RaisedButton label="Order" fullWidth={true} onClick={this.orderDrink.bind(this)}/>
           </div>
  }
}


