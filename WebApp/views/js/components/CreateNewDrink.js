import React from 'react'
import { StickyContainer, Sticky } from 'react-sticky'

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'

import {List, ListItem} from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
import Divider from 'material-ui/Divider'
import Paper from 'material-ui/Paper'
import Slider from 'material-ui/Slider'
import TextField from 'material-ui/TextField'

import {updateSelectedDrink, 
  getPumpInfoForNewDrink, 
  closeNewDrinkModal, 
  updateNewDrinkIngredientProportion,
  updateNewDrinkName,
  updateNewDrinkDescription,
  updateNewDrinkImage,
  updateNewDrinkImageElement, 
  createNewDrink,
  getDrinks
   } from 'js/actions/drinksActions'

import { getPumps } from 'js/actions/layoutActions'


import baseStyles from 'styles/base.css'



export default class CreateNewDrink extends React.Component {
  componentWillMount () {
      this.props.dispatch(getPumpInfoForNewDrink(this.props.axios))
      this.props.dispatch(getPumps(this.props.axios))
  }

  componentDidMount () {
    
  }

  closeNewDrinkModal(){
    this.props.dispatch(closeNewDrinkModal())
  }

  updateNewDrinkIngredientProportion(pump_id, e, value){
    this.props.dispatch(updateNewDrinkIngredientProportion(pump_id, value))
  }

  updateNewDrinkName(e){
    const name = e.target.value 
    this.props.dispatch(updateNewDrinkName(name))
  }

  //Not in use any more
  updateNewDrinkDescription(e){
    const description = e.target.value 
    this.props.dispatch(updateNewDrinkDescription(description))

  }

  updateNewDrinkImage(e){
    const image = e.target.value 
    this.props.dispatch(updateNewDrinkImage(image))
  }

  checkImageExists(imageSrc) {
    console.log('CHECKING NEW IMAGE')
    var img = new Image();
    img.onload = ()=>{this.props.dispatch(updateNewDrinkImageElement(imageSrc))}
    img.onerror = ()=>{alert('Could not load image')}
    img.src = imageSrc;    
  }

  createNewDrink(e){
    const { image, name, pump, ingredients } = this.props.createNewDrink.contents
    console.log(name, ingredients)
    if(name!='' && ingredients.length >0){
      const imageSend = (!image||image=='')?'default.jpg':image
      this.props.dispatch(createNewDrink(name, 'default', ingredients, imageSend, this.props.axios))
            .then((res)=>{
              console.log('DRINK CREATEDDDDD')
                this.props.dispatch(closeNewDrinkModal())
                this.props.dispatch(getDrinks(this.props.axios))
                this.props.dispatch(getPumpInfoForNewDrink(this.props.axios))
            })
    } else {
      alert('Populate all fields')
    }
  }

  render () {

    const actions = [
      <FlatButton
        label='Cancel'
        onTouchTap={this.closeNewDrinkModal.bind(this)}
        />,
        <FlatButton
        label='CREATE'
        primary={true}
        onTouchTap={this.createNewDrink.bind(this)}
        />
    ]
    
    const { createNewDrink } = this.props
    const{ description, image, name, pump, ingredients, imageElement } = createNewDrink.contents

    const pumpsElements = pump.map((element, key)=>{    
      return <div key={key}>
        <div className="row" style={{marginBottom:'1px'}}>
          <div className="col s4 m4 l4 valign-wrapper" style={{height: '65px'}}>
            <div className="valign">
              {element.DisplayName}
            </div>
          </div>
          <div className="col s8 m8 l8" style={{height: '65px'}}>
              <Slider 
              min={0}
              max={100}
              step={5}
              defaultValue={0}
              value={element.newDrinkProportion}
              onChange={this.updateNewDrinkIngredientProportion.bind(this, element.Pump_id)}
              data-pump-id={element.Pump_id}
              />
          </div>
        </div>
        <Divider />
      </div>    
    })

    const ingredientsElement = ingredients.map((elm, key)=>{
      return <ListItem key={key} primaryText={elm.DisplayName} innerDivStyle={{padding:'5px 56px 5px 16px'}} rightIcon={<div>{elm.newDrinkProportion}</div>}/>
    })

    // Check to see if drink image exists 
    if(image!='' && image!=imageElement){
      this.checkImageExists(image)
    }

    const NewDrinkInfo = <div>
                    <TextField     
                          fullWidth={true}                 
                          defaultValue={createNewDrink.name}
                          onChange={this.updateNewDrinkName.bind(this)}
                          floatingLabelText="Drink Name"
                        />
                      <TextField
                        fullWidth={true}       
                        defaultValue={createNewDrink.image}                      
                        onChange={this.updateNewDrinkImage.bind(this)}
                        floatingLabelText="Image URL"
                      />
                      <img src={imageElement} style={{width:"100%", height:"100%", objectFit:'contain'}} /> 
                  </div>


    return <div >
              <Dialog title={'Create New Drink'}
                    actions={actions}
                    modal={false} //Will be dismissed if user clicks outside the area
                    open={createNewDrink.modalOpen}
                    onRequestClose={this.closeNewDrinkModal.bind(this)}
                    autoScrollBodyContent={true}
                    contentStyle={{maxHeight:'99%', width: '90%',  maxWidth: 'none',}}
                    >
                    <div className="row">
                      <div className="col s4 m4 l4" style={{backgroud:'green'}}>
                        {NewDrinkInfo}
                      </div>
                      <div className="col s8 m8 l8" style={{marginTop:"20px", paddingLeft:"30px"}}>
                        {pumpsElements}
                      </div>
                    </div>
              </Dialog>

           </div>
  }
}
