import React from 'react'
import { StickyContainer, Sticky } from 'react-sticky'

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'

import {updateSelectedDrink, setDrinkImageToDefault, getDrinkIngredients } from 'js/actions/drinksActions'

import baseStyles from 'styles/base.css'



export default class Drink extends React.Component {
  componentWillMount () {
      
  }

  componentDidMount () {
      const {DrinkImage} = this.props.drink
      // Checks to see if image is a URL or if it needs a relative file path
      const re = new RegExp("^(http|https)://", "i")
      const URLMatch = re.test(DrinkImage)
      const adjustedImagePath = URLMatch? DrinkImage: "images/"+DrinkImage
      this.checkImageExists(adjustedImagePath)
  }

  onCardClick(e){
    this.props.dispatch(updateSelectedDrink(this.props.index))
    this.props.dispatch(getDrinkIngredients(this.props.drink.Drink_id, this.props.axios))

  }

  checkImageExists(imageSrc) {
    const defaultImage = 'default.jpg'
      var img = new Image();
      img.onload = ()=>{}
      img.onerror = ()=>{this.props.dispatch(setDrinkImageToDefault(this.props.drink.Drink_id, defaultImage))}
      img.src = imageSrc;    

  }

  imageExists(){

  }

  imageDoesntExist(){
    

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


    // Checks to see if image is a URL or if it needs a relative file path
    const re = new RegExp("^(http|https)://", "i")
    const URLMatch = re.test(DrinkImage)
    const adjustedImagePath = URLMatch? DrinkImage: "images/"+DrinkImage

    return <div className='col s12 l6'>
              <div className="hoverable">
                <Card onClick={this.onCardClick.bind(this)} style={{marginBottom:'20px'}}>
                    <CardHeader
                      subtitle={DrinkName}                      
                    /> 
                    <CardMedia                        
                        overlay={(CanMake==0?<CardTitle title="Can't make!" subtitle="Please add the correct ingredients" />:<div/>)}

                      >
                        <img src={adjustedImagePath} style={{height:"228px"}}/>
                      </CardMedia>
                </Card>
              </div>
           </div>
  }
}
