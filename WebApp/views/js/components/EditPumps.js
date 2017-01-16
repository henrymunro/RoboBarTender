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
        const currentDrink = pumps.value.filter((el)=>{return el.PumpNumber == pumpNumber})[0] || {}
        const pumpActive = currentDrink.PumpStatus ===1
        const pumpStyle = cx({
            [styles.pumpEmpty]: !currentDrink.DisplayName,
            [styles.pumpInactive]: !pumpActive && currentDrink.DisplayName,
            [styles.pumpActive]: pumpActive

        })


        const ceasePumpButton = (!pumpActive && currentDrink.DisplayName)?  <RaisedButton label="Delete" data-pump-number={pumpNumber} fullWidth={true} onClick={this.ceasePump.bind(this)}/> : <div/>


        return <div key={key}>
            <var data-pump-number={pumpNumber} key={key}>
              <Card key={key}>
                    <CardHeader
                      subtitle={currentDrink.DisplayName||'Empty'}
                      className={pumpStyle}
                      onClick={this.updateSelectedEditPump.bind(this)}
                    /> 
                    <div>
                      {ceasePumpButton}
                    </div>
                </Card>
              </var>
            </div>
    })

    const dialogHead = <div className="row">
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
                </div>
                <div className="col s6 m6 l6">
                  <TextField
                    value={editPumpPercrntage==0?'0':editPumpPercrntage||''}
                    onChange={this.updateEditPumpPercentage.bind(this)}
                    floatingLabelText="Alcohol Percentage"
                  /><br />
                  <div className="container">
                    <RaisedButton 
                        label={ "Save Pump " + selectedEditPumpNumber}
                        primary={true}
                        onTouchTap={this.saveNewPump.bind(this)} />
                  </div>

                </div>
              </div>

    return <div>              
              <Dialog
                title={dialogHead}
                actions={actions}
                modal={false}
                open={editPumpDialogOpen}
                onRequestClose={this.closeEditPumpsDialog.bind(this)}
                autoScrollBodyContent={true}
              >

                {pumpLayoutMap}
              </Dialog>
           </div>
  }
}
//editPumpDialogOpen