import React from 'react'
import { StickyContainer, Sticky } from 'react-sticky'
import Slider from 'material-ui/Slider'
import RaisedButton from 'material-ui/RaisedButton'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import {List, ListItem} from 'material-ui/List'
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


    const errorMessage = this.props.errorMessage===''?false:this.props.errorMessage
    let displayError = errorMessage? <h4 style={{backgroud:'red'}}>{errorMessage}</h4>:<div/>

    const { drinkVolume } = this.props

    const { selectedDrinkIngredients } = this.props
    const mappedIngredients = selectedDrinkIngredients.map((ingredient,key)=>{
      const { Name, Volume } = ingredient
      return <ListItem key={key} 
            innerDivStyle={{padding:'5px 56px 0px 16px'}}
            primaryText={<div className="row" style={{marginBottom:'10px'}}>
                            <div className="col s8 m8 l8">
                              {Name}
                            </div>
                            <div className="col s4 m4 l4"> 
                              {Math.round(Volume*drinkVolume/(Number(IngredientsVolumeRatio)*100))}ml 
                            </div>
                          </div>} />
    })

    const re = new RegExp("^(http|https)://", "i")
      const URLMatch = re.test(DrinkImage)
      const adjustedImagePath = URLMatch? DrinkImage: "images/"+'henry.jpg'

    const drinkIngredients = <Card>
                          <CardHeader
                            title="Details"
                            avatar={adjustedImagePath}
                          />
                           <CardMedia
                              children={<List> {mappedIngredients} </List>}
                            >
                              
                            </CardMedia>
                            
                          </Card>



    return <div>
              <h4>{DrinkName}</h4>
              <p>{DrinkDescription}</p>
              <p>Created by: {AddedBy}</p>
              <p>Created at: {moment(DrinkStartDate).format('DD-MM-YYYY')}</p>
              <p>Percentage: {AlcoholPercentage}%</p>
              {drinkIngredients}
              <Slider
                min={0}
                max={500}
                step={10}
                value={drinkVolume}
                onChange={this.updateDrinkVolume.bind(this)}
              />
              <p> {drinkVolume} ml </p>
              {displayError}
              <RaisedButton label="Order" fullWidth={true} onClick={this.orderDrink.bind(this)}/>
           </div>
  }
}


