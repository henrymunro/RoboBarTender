import React from 'react'
import { StickyContainer, Sticky } from 'react-sticky'

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'

import {updateSelectedDrink } from 'js/actions/drinksActions'

import baseStyles from 'styles/base.css'



export default class Drink extends React.Component {
  componentWillMount () {
      
  }

  componentDidMount () {
     
  }

  onCardClick(e){
    this.props.dispatch(updateSelectedDrink(this.props.index))

  }


  render () {
    
    const { drink, index} = this.props
    const { AddedBy,
            AlcoholPercentage,
            CanMake,
            DrinkDescription,
            DrinkImage,
            DrinkName,
            DrinkStartDate,
            Drink_id,
            IngredientsVolumeRatio,
            PourTime
          } = drink


    return <div className='col s12 l6'>
              <Card  onClick={this.onCardClick.bind(this)}>
                    <CardHeader
                      subtitle={DrinkName}                      
                    /> 
                    <CardMedia                        
                        overlay={<CardTitle title="Overlay title" subtitle="Overlay subtitle" />}
                      >
                        <img src={"images/"+DrinkImage } />
                      </CardMedia>
                </Card>
           </div>
  }
}
