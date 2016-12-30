import React from 'react'
import { StickyContainer, Sticky } from 'react-sticky'

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'
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

  render () {

    const actions = [
      <FlatButton
        label='Cancel'
        primary={true}
        onTouchTap={this.closeNewDrinkModal.bind(this)}
        />
    ]
    
    const { createNewDrink } = this.props

    const style = {
      height: 100,
      width: 100,
      margin: 5,
      textAlign: 'center',
      display: 'inline-block',
    };

    const{ description, image, name, pump } = createNewDrink.contents
    const pumpsElements = pump.map((element, key)=>{
      console.log('ELM: ', element)

      const pumpEl = <div className="valign-wrapper">
          <div className="valign">
            <var data-pump-id={element.Pump_id}>
              <Slider 
              style={{height: 100}} 
              axis="y" 
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

      return <div className="col l2" key={key}>          
          <Card>          
          <CardMedia children={pumpEl}>
          </CardMedia>
          <CardTitle subtitle={element.DisplayName} />
          </Card>
        </div>
    })

    console.log('OPENING MODELLL: ', createNewDrink)
    return <div >
              <Dialog title='Create New Concoction'
                    actions={actions}
                    modal={false} //Will be dismissed if user clicks outside the area
                    open={createNewDrink.modalOpen}
                    onRequestClose={this.closeNewDrinkModal.bind(this)}
                    >
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
                          Ingredients
                      </div>
                    </div>
                    <div className="row">
                      {pumpsElements}
                    </div>
              </Dialog>

           </div>
  }
}
