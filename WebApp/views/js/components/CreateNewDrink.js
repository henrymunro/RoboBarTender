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
  updateNewDrinkDescription
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
    this.props.dispatch(updateNewDrinkName(description))

  }

  createNewDrink(e){

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
        <div className="row">
          <div className="col s3 m3 l3">
            {element.DisplayName}
          </div>
          <div className="col s9 m9 l9">
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
                    Create New Concoction
                    <Divider />
                    <div className="row">

                      <div className='col s12 l6'>
                        <TextField
                          value={createNewDrink.name}
                          onChange={this.updateNewDrinkName.bind(this)}
                          floatingLabelText="Name"
                        />
                      <TextField
                        value={createNewDrink.description}                      
                        onChange={this.updateNewDrinkDescription.bind(this)}
                        floatingLabelText="Description"
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