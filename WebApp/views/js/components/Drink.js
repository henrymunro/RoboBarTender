import React from 'react'
import { StickyContainer, Sticky } from 'react-sticky'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import {updateSelectedDrink, setDrinkImageToDefault, getDrinkIngredients } from 'js/actions/drinksActions'

import CurrentDrink from 'js/components/CurrentDrink'

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
    
    const { drink, index, currentDrinkProps} = this.props
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

    const cantMakeElement = (CanMake==0?<CardHeader title="Can't make!" subtitle="Please add the correct ingredients" />:<div/>)

    const drinkCard = <div>
                  <Card onClick={this.onCardClick.bind(this)} style={{marginBottom:'20px'}}>
                    {cantMakeElement}
                    <div className="hide-on-med-and-up">                        
                      <CardMedia                        
                          overlay={<div><CardHeader subtitle={DrinkName}/></div>}
                        >
                        <img src={adjustedImagePath} style={{height:"160px"}}/>
                      </CardMedia>
                    </div>
                    <div className="hide-on-small-only">
                      <CardMedia                        
                          overlay={<div><CardHeader subtitle={DrinkName}/></div>}
                          >
                        <img src={adjustedImagePath} style={{height:"228px"}}/>
                      </CardMedia>
                    </div> 
                </Card>
              </div>

    const selectedDrinkCard = <Card>                                          
                      <CardMedia style={{marginBottom:'20px', marginRight:'10px', marginLeft:'10px', paddingTop:'4px', paddingBotton:'10px'}}>
                        <CurrentDrink 
                          {... currentDrinkProps}
                          axios={this.props.axios} 
                          dispatch={this.props.dispatch} />
                      </CardMedia>
                </Card>

    const isDrinkSelected = (currentDrinkProps.currentDrink.Drink_id==Drink_id)

    return <div className='col s12 m6 l6'>
              <div className="hoverable">
                <div className="hide-on-large-only">
                    {isDrinkSelected?selectedDrinkCard:drinkCard}
                </div>
                <div className="hide-on-med-and-down">
                  {drinkCard}
                </div>
              </div>
           </div>
  }
}
