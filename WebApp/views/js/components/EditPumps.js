import React from 'react'
import { StickyContainer, Sticky } from 'react-sticky'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import Dialog from 'material-ui/Dialog'
import Divider from 'material-ui/Divider'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import cx from 'classnames'

import { addPump, 
  ceasePump, 
  getPumps, 
  closeEditPumpDialog, 
  updateSelectedEditPump,
  updateEditPumpName,
  updateEditPumpDisplayName,
  updateEditPumpPercentage
} from 'js/actions/layoutActions'

import { getPumpInfoForNewDrink } from 'js/actions/drinksActions'

import baseStyles from 'styles/base.css'
import styles from 'styles/components/pumps.css'





export default class EditPumps extends React.Component {
  componentWillMount () {
      
  }

  componentDidMount () {
     
  }


  ceasePump(e){
    const pumpNumber = e.target.closest('button').attributes.getNamedItem('data-pump-number').value
    this.props.dispatch(ceasePump(pumpNumber, this.props.axios))
        .then(this.props.dispatch(getPumps(this.props.axios)))
  }

  closeEditPumpsDialog(){
    this.props.dispatch(closeEditPumpDialog())
  }

  updateSelectedEditPump(e){
    const pump_id = e.target.closest('var').attributes.getNamedItem('data-pump-number').value
    this.props.dispatch(updateSelectedEditPump(pump_id))
  }

  updateEditPumpName(e, value){
    console.log('Value: ', value)
    console.log('Event: ', e.target.value)
    this.props.dispatch(updateEditPumpName(value))
  }

  updateEditPumpDisplayName(e, value){
    this.props.dispatch(updateEditPumpDisplayName(value))
  }

  updateEditPumpPercentage(e, value){
    this.props.dispatch(updateEditPumpPercentage(value))
  }
  
  saveNewPump(e){
    const { editPumps } = this.props
    const { editPumpName, editPumpDisplayName, editPumpPercrntage, selectedEditPumpNumber } =editPumps
    this.props.dispatch(addPump(editPumpName, editPumpDisplayName, editPumpPercrntage, selectedEditPumpNumber, this.props.axios))
        .then(()=>{
          this.props.dispatch(getPumps(this.props.axios))
          this.props.dispatch(getPumpInfoForNewDrink(this.props.axios))
        })
  }



  render () {
    
    const { pumps, pumpLayout, editPumps } = this.props

     const { editPumpDialogOpen,
            selectedEditPumpNumber,
            editPumpName,
            editPumpDisplayName,
            editPumpPercrntage
      } = editPumps

    console.log('PUMPS: ', pumps.value)

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.closeEditPumpsDialog.bind(this)}
      />
    ]


    const pumpLayoutMap = pumpLayout.map((value, key)=>{
        const { pumpNumber, active } = value
        const currentPump = pumps.value.filter((el)=>{return el.PumpNumber == pumpNumber})[0] || {}
        const pumpActive = currentPump.PumpStatus ===1
        const pumpStyle = cx({
            [styles.pumpEmpty]: !currentPump.DisplayName,
            [styles.pumpInactive]: !pumpActive && currentPump.DisplayName,
            [styles.pumpActive]: pumpActive

        })

        // Change the style of the currently selected pump
        const pumpSelectedToEdit = (selectedEditPumpNumber === pumpNumber)?styles.pumpSelectedToEdit: ''


        const ceasePumpButton = (!pumpActive && currentPump.DisplayName)?  <RaisedButton label="Delete" data-pump-number={pumpNumber} fullWidth={true} onClick={this.ceasePump.bind(this)}/> : <div/>


        return <div key={key} 
                    className={pumpStyle+' '+baseStyles.cf}
                    
                    onClick={this.updateSelectedEditPump.bind(this)}>
              <var data-pump-number={pumpNumber} key={key} >
                <div className={"row "+ pumpSelectedToEdit} style={{'paddingTop':'5px', paddingBottom:'5px', margin:'0'}}>
                  <div className={pumpSelectedToEdit} style={{'minHeight':'40px'}}>
                    <div className={"col s8 m8 l8 "+ pumpSelectedToEdit}>
                        {currentPump.DisplayName||'Empty'}
                    </div>
                    <div className={"col s4 m4 l4 "+ pumpSelectedToEdit}>
                        {ceasePumpButton}
                    </div>
                  </div>
                </div>
              </var>
              <Divider />
            </div>
    })

    const currentPumpElement = <div className="col s6 m6 l6">
                  <TextField
                    value={editPumpName||''}
                    onChange={this.updateEditPumpName.bind(this)}
                    floatingLabelText="Alcohol Name"
                  /><br />
                  <TextField
                    value={editPumpDisplayName||''}
                    onChange={this.updateEditPumpDisplayName.bind(this)}
                    floatingLabelText="Display Name"
                  /><br />
                  <TextField
                    value={editPumpPercrntage==0?'0':editPumpPercrntage||''}
                    onChange={this.updateEditPumpPercentage.bind(this)}
                    floatingLabelText="Alcohol Percentage"
                  /><br />
                  <RaisedButton 
                      label={ "Save Pump " + selectedEditPumpNumber}
                      primary={true}
                      onTouchTap={this.saveNewPump.bind(this)} />
                </div>

    return <div>              
              <Dialog
                actions={actions}
                modal={false}
                title="Edit Pump Configuration"
                open={editPumpDialogOpen}
                onRequestClose={this.closeEditPumpsDialog.bind(this)}
                autoScrollBodyContent={true}
              >
                <div className="row" style={{'marginTop':'20px'}}>
                  <div className="col s6 m6 l6">
                    {currentPumpElement}
                  </div>
                  <div className="col s6 m6 l6">
                    {pumpLayoutMap}
                  </div>
                </div>
              </Dialog>
           </div>
  }
}
//editPumpDialogOpen