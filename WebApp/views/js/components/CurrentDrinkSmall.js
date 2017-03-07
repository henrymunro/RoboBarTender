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

  orderDrink(volume, e){
    const Drink_id = this.props.currentDrink.Drink_id
    this.props.dispatch(orderDrink(Drink_id, volume, this.props.axios))
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
    let displayError = errorMessage? <h4 style={{backgroud:'red'}}>{errorMessage}</h4>:<div/>

    const { drinkVolume } = this.props

    const { selectedDrinkIngredients } = this.props
    const mappedIngredients = selectedDrinkIngredients.map((ingredient,key)=>{
      const { Name, Volume } = ingredient
      return <ListItem key={key} 
            innerDivStyle={{padding:'5px 56px 0px 16px'}}
            primaryText={<div className="row" style={{marginBottom:'10px', fontSize:'x-large'}}>
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



    return <div style={{paddingBottom:'20px'}} >
                <h4>{DrinkName}</h4>
                <div className="row valign-wrapper">
                  <div className="col s6 m6 l6" style={{fontSize:'x-large'}}>
                    <div className="valign">
                      Percentage: {AlcoholPercentage}%
                    </div>
                  </div>
                  <div className="col s6 m6 l6">
                      <RaisedButton label={'Delete'} onClick={this.deleteDrink.bind(this)}/>
                  </div>
                </div>      
              <div className="row">
                <div className="col s6 m6">
                  {drinkIngredients}
                </div>
                <div className="col s6 m6">
                    <Card style={{marginBottom:'20px'}}>
                      <CardMedia>
                          <img src={adjustedImagePath} style={{height:"228px"}}/>
                      </CardMedia>
                </Card>
                </div>
              </div>         
              {displayError}
              <div className="row">
                <div className="col sm3 m3">
                  <RaisedButton 
                  labelStyle={{fontSize:'x-large'}} 
                  label={'50ml'} 
                  primary={true} 
                  fullWidth={true} 
                  onClick={this.orderDrink.bind(this, 50)}/>
                </div>
                <div className="col sm3 m3">
                  <RaisedButton 
                  labelStyle={{fontSize:'x-large'}} 
                  label={'100ml'} 
                  primary={true} 
                  fullWidth={true} 
                  onClick={this.orderDrink.bind(this, 100)}/>
                </div>
                <div className="col sm3 m3">
                  <RaisedButton 
                  labelStyle={{fontSize:'x-large'}} 
                  label={'250ml'} 
                  primary={true} 
                  fullWidth={true} 
                  onClick={this.orderDrink.bind(this, 250)}/>
                </div>
                <div className="col sm3 m3">
                  <RaisedButton 
                  labelStyle={{fontSize:'x-large'}} 
                  label={'500ml'} 
                  primary={true} 
                  fullWidth={true} 
                  onClick={this.orderDrink.bind(this, 500)}/>
                </div>
              </div>
              
           </div>
  }
}


              /*<p>Created by: {AddedBy}</p>
              <p>Created at: {moment(DrinkStartDate).format('DD-MM-YYYY')}</p>*/
