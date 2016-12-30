import React from 'react'
import { StickyContainer, Sticky } from 'react-sticky'

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import {FlatButton} from 'material-ui/FlatButton'
import {Dialog} from 'material-ui/Dialog'

import {updateSelectedDrink, getPumpInfoForNewDrink, closeNewDrinkModal } from 'js/actions/drinksActions'

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


  render () {

    const actions = [
      <FlatButton
        label='Cancel'
        primary={true}
        onTouchTap={this.closeNewDrinkModal.bind(this)}
        />
    ]
    
    const { createNewDrink } = this.props

    return <div >
              <Dialog title='Create New Concoction'
                    actions={actions}
                    modal={true} //Will be dismissed if user clicks outside the area
                    open={createNewDrink.modalOpen}
                    onRequestClose={this.closeNewDrinkModal.bind(this)}
                    >
                    CREATE NEW DRINKS WOOO 
              </Dialog>

           </div>
  }
}
