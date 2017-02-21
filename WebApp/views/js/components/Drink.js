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

    // Check to see if we can make the drink and adds a warning ribon to image if not
    const cantMakeElement = (CanMake==0?<div className={baseStyles.ribbon_red}>Can't Make</div>:<div/>)
    const ribbonImageElement = <div className={baseStyles.wrapper} style={{height:'234px'}}>
            <img src={adjustedImagePath} style={{height:'234px', width:'100%'}}/>
            <div className={baseStyles.ribbon_wrapper}>        
              {cantMakeElement}
            </div>
          </div>

    const drinkCard = <div>
                  <Card onClick={this.onCardClick.bind(this)} style={{marginBottom:'20px'}}>
                    <div className="hide-on-large-only">                        
                      <CardMedia                        
                          overlay={<div><CardHeader title={DrinkName} titleStyle={{color:'white'}}/></div>}
                        >
                        <div className={baseStyles.wrapper} style={{height:'500px'}}>
                          <img src={adjustedImagePath} style={{height:'500px', width:'100%'}}/>
                          <div className={baseStyles.ribbon_wrapper}>        
                            {cantMakeElement}
                          </div>
                        </div>  
                      </CardMedia>
                    </div>
                    <div className="hide-on-med-and-down">
                      <CardMedia                        
                          overlay={<div><CardHeader title={DrinkName} titleStyle={{color:'white'}}/></div>}
                          >
                          <div className={baseStyles.wrapper} style={{height:'234px'}}>
                            <img src={adjustedImagePath} style={{height:'234px', width:'100%'}}/>
                            <div className={baseStyles.ribbon_wrapper}>        
                              {cantMakeElement}
                            </div>
                          </div>                       
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

    return <div className='col s12 m12 l6'>
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
