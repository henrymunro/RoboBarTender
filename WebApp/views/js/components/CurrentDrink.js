import React from 'react'
import { StickyContainer, Sticky } from 'react-sticky'
import Slider from 'material-ui/Slider'
import RaisedButton from 'material-ui/RaisedButton'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import {List, ListItem} from 'material-ui/List'
import moment from 'moment'

import {updateDrinkVolume, orderDrink, getDrinkIngredients, deleteDrink, getDrinks, updateSelectedDrink } from 'js/actions/drinksActions'

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

  deleteDrink(){
    const Drink_id = this.props.currentDrink.Drink_id
    this.props.dispatch(deleteDrink(Drink_id, this.props.axios))
        .then(()=>{
            return this.props.dispatch(getDrinks(this.props.axios))
        }).then((res)=>{
          console.log('GOT DRINKS: ',res.value.data[0].Drink_id, res)
          this.props.dispatch(updateSelectedDrink(0))
          this.props.dispatch(getDrinkIngredients(res.value.data[0].Drink_id, this.props.axios))
        })
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
    let displayError = errorMessage? <h6 style={{backgroud:'red'}}>{errorMessage}</h6>:<div/>

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
      const adjustedImagePath = URLMatch? DrinkImage: "images/"+DrinkImage

    const drinkIngredients = <Card>
                           <CardMedia
                              children={<div><List> {mappedIngredients} </List></div>}
                            >
                              
                            </CardMedia>
                            
                          </Card>



    return <div>
              <div className="hide-on-med-and-down">
                <h4>{DrinkName}</h4>
                <div className="row valign-wrapper">
                  <div className="col s6 m6 l6" style={{fontSize:'small'}}>
                    <div className="valign">
                      Percentage: {AlcoholPercentage}%
                    </div>
                  </div>
                  <div className="col s6 m6 l6">
                      <RaisedButton label={'Delete'} onClick={this.deleteDrink.bind(this)}/>
                  </div>
                </div>                
              </div>
              <div className="hide-on-large-only">
                <h5>{DrinkName}</h5>
              </div>
              <div className="hide-on-med-and-down">
                <Card style={{marginBottom:'20px'}}>
                      <CardMedia>
                          <img src={adjustedImagePath} style={{height:"228px"}}/>
                      </CardMedia>
                </Card>
              </div>
              {drinkIngredients}
              <Slider
                min={0}
                max={500}
                step={10}
                value={drinkVolume}
                onChange={this.updateDrinkVolume.bind(this)}
              />
              <p>  </p>
              {displayError}
              <RaisedButton label={'Order '+drinkVolume+'ml'} fullWidth={true} onClick={this.orderDrink.bind(this)}/>
           </div>
  }
}


              /*<p>Created by: {AddedBy}</p>
              <p>Created at: {moment(DrinkStartDate).format('DD-MM-YYYY')}</p>*/
