import React from 'react'
import { StickyContainer, Sticky } from 'react-sticky'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import Dialog from 'material-ui/Dialog'
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

import baseStyles from 'styles/base.css'
import styles from 'styles/components/pumps.css'





export default class Pumps extends React.Component {
  componentWillMount () {
      
  }

  componentDidMount () {
     
  }

  addPump(e){
    const pumpNumber = e.target.closest('button').attributes.getNamedItem('data-pump-number').value
    const name = 'test name'
    const displayName = 'test displayName'
    const percentage = '60'
    this.props.dispatch(addPump(name, displayName, percentage, pumpNumber, this.props.axios))
        .then(this.props.dispatch(getPumps(this.props.axios)))
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
        .then(this.props.dispatch(getPumps(this.props.axios)))
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
        const currentDrink = pumps.value.filter((el)=>{return el.PumpNumber == pumpNumber})[0] || {}
        const pumpActive = currentDrink.PumpStatus ===1
        const pumpStyle = cx({
            [styles.pumpEmpty]: !currentDrink.DisplayName,
            [styles.pumpInactive]: !pumpActive && currentDrink.DisplayName,
            [styles.pumpActive]: pumpActive

        })


        const ceasePumpButton = (!pumpActive && currentDrink.DisplayName)?  <RaisedButton label="Delete" data-pump-number={pumpNumber} fullWidth={true} onClick={this.ceasePump.bind(this)}/> : <div/>
        const addPumpButton = (!currentDrink.DisplayName)?<RaisedButton label="Add" data-pump-number={pumpNumber} fullWidth={true} onClick={this.addPump.bind(this)}/> :<div/>


        return <var data-pump-number={pumpNumber} key={key}>
              <Card key={key}>
                    <CardHeader
                      subtitle={currentDrink.DisplayName||'Empty'}
                      className={pumpStyle}
                      onClick={this.updateSelectedEditPump.bind(this)}
                    /> 
                    {ceasePumpButton}
                    {addPumpButton}
                </Card>
              </var>
    })


    return <div>              
              <Dialog
                title="Edit Pumps"
                actions={actions}
                modal={false}
                open={editPumpDialogOpen}
                onRequestClose={this.closeEditPumpsDialog.bind(this)}
              >
              <div className="row">
                <div className="col s6 m6 l6">
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
                </div>
                <div className="col s6 m6 l6">
                  <RaisedButton 
                      label="Save"
                      primary={true}
                      onTouchTap={this.saveNewPump.bind(this)} />

                </div>

              </div>

                {pumpLayoutMap}
              </Dialog>
           </div>
  }
}
//editPumpDialogOpen