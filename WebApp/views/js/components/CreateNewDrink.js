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
  createNewDrink,
  getDrinks
   } from 'js/actions/drinksActions'


import baseStyles from 'styles/base.css'



export default class CreateNewDrink extends React.Component {
  componentWillMount () {
      this.props.dispatch(getPumpInfoForNewDrink(this.props.axios))
  }

  componentDidMount () {
    
  }

  closeNewDrinkModal(){
    this.props.dispatch(closeNewDrinkModal())
  }

  updateNewDrinkIngredientProportion(e, value){
    const pump_id = e.target.closest('var').attributes.getNamedItem('data-pump-id').value 
    this.props.dispatch(updateNewDrinkIngredientProportion(pump_id, value))
  }

  updateNewDrinkName(e){
    const name = e.target.value 
    this.props.dispatch(updateNewDrinkName(name))
  }

  updateNewDrinkDescription(e){
    const description = e.target.value 
    this.props.dispatch(updateNewDrinkDescription(description))

  }

  updateNewDrinkImage(e){
    const image = e.target.value 
    this.props.dispatch(updateNewDrinkImage(image))
  }

  createNewDrink(e){
    const {description, image, name, pump, ingredients } = this.props.createNewDrink.contents
    console.log(name, description, ingredients)
    if(name!=''&& description!='' && ingredients.length >0){
      this.props.dispatch(createNewDrink(name, description, ingredients, image, this.props.axios))
            .then((res)=>{
              console.log('DRINK CREATEDDDDD')
                this.props.dispatch(closeNewDrinkModal())
                this.props.dispatch(getDrinks(this.props.axios))
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
    const{ description, image, name, pump, ingredients } = createNewDrink.contents

    const pumpsElements = pump.map((element, key)=>{    
      return <div key={key}>
        <div className="row" style={{marginBottom:'1px'}}>
          <div className="col s4 m4 l4 valign-wrapper" style={{height: '65px'}}>
            <div className="valign">
              {element.DisplayName}
            </div>
          </div>
          <div className="col s8 m8 l8" style={{height: '65px'}}>
            <var data-pump-id={element.Pump_id}>
              <Slider 
              min={0}
              max={100}
              step={10}
              defaultValue={0}
              value={element.newDrinkProportion}
              onChange={this.updateNewDrinkIngredientProportion.bind(this)}
              data-pump-id={element.Pump_id}
              />
            </var>
          </div>
        </div>
        <Divider />
      </div>    
    })

    const ingredientsElement = ingredients.map((elm, key)=>{
      return <ListItem key={key} primaryText={elm.DisplayName} innerDivStyle={{padding:'5px 56px 5px 16px'}} rightIcon={<div>{elm.newDrinkProportion}</div>}/>
    })

    const DialogHeadElement = <div>
                    <TextField
                          hintText="Name"
                          defaultValue={createNewDrink.name}
                          onChange={this.updateNewDrinkName.bind(this)}
                          floatingLabelText="Create a new concoction"
                        />
                    <Divider />
                    <div className="row">

                      <div className='col s12 l6'>
                      <TextField
                        hintText="A short description"
                        value={createNewDrink.description}                      
                        onChange={this.updateNewDrinkDescription.bind(this)}
                      />
                      <TextField
                        hintText="Image"
                        value={createNewDrink.image}                      
                        onChange={this.updateNewDrinkImage.bind(this)}
                      />
                      </div>
                      <div className="col s12 l6">
                          <List>
                            {ingredientsElement}
                          </List>
                      </div>
                    </div>
                  </div>

    console.log('OPENING MODELLL: ', createNewDrink)
    return <div >
              <Dialog title={DialogHeadElement}
                    actions={actions}
                    modal={false} //Will be dismissed if user clicks outside the area
                    open={createNewDrink.modalOpen}
                    onRequestClose={this.closeNewDrinkModal.bind(this)}
                    autoScrollBodyContent={true}
                    contentStyle={{maxHeight:'99%'}}
                    >
                    
                    <div className="row">
                    <Paper zDepth={2}>
                      {pumpsElements}
                    </Paper>
                    </div>
              </Dialog>

           </div>
  }
}
