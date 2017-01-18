import React from 'react'
import { StickyContainer, Sticky } from 'react-sticky'
import LinearProgress from 'material-ui/LinearProgress'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton';

import Pumps from 'js/components/Pumps'


import { killAllPumps } from 'js/actions/layoutActions'
import {updateDrinkTimerProgress, pollPumps, resetPollPumpsCount, setPendingTimeout } from 'js/actions/drinksActions'

import baseStyles from 'styles/base.css'



export default class DrinkTimerProgress extends React.Component {

  componentDidMount() {
    if( this.props.drinkOrdered){
      this.timer = setTimeout(() => this.progress(), this.props.drinkProgressUpdateInterval);
    }
  }

  componentDidUpdate() {
    const { timeOutPending , drinkOrdered} = this.props
    // Prevent a new time out before the old one has finished
    if (!timeOutPending && drinkOrdered) {
      this.props.dispatch(setPendingTimeout(true))
      this.progress()
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    this.props.dispatch(resetPollPumpsCount())
  }

  progress() {
    const completed = this.props.drinkProgressPercentage
    const { pourTime, // seconds
      drinkProgressUpdateInterval, // ms
      drinkOrderedTime, //ms
      pollPumpCount,
      pollPumpTotalCount,
      pollPumpPending,
      drinkVolume
    } = this.props
    
    if (completed > 100) {
      this.props.dispatch(updateDrinkTimerProgress(0, false))
      this.props.dispatch(pollPumps(this.props.axios))
            .then(()=> this.props.dispatch(resetPollPumpsCount()))      
      this.props.dispatch(setPendingTimeout(false))
    } else {
      // Calculate new value for progress bar
      const timeElaspedS = (new Date().getTime() - drinkOrderedTime)/1000
      const totalPourTime = pourTime * (drinkVolume/1000) // Pour time s/L  drinkVolume ml
      const newCompleted = 100.0 * timeElaspedS / totalPourTime
      console.log('NEW COMPLETED: ', newCompleted)
      console.log('TimeEllapsed: ', timeElaspedS)
      console.log('Total Pour Time: ', totalPourTime)
      console.log('Pour Time: ', pourTime)
      console.log('Drink drinkVolume: ', drinkVolume)

      this.timer = setTimeout(() => {
        // Clear pending timeout to allow a new one to be added
        this.props.dispatch(setPendingTimeout(false))

        //Update the progress bar
        this.props.dispatch(updateDrinkTimerProgress(newCompleted, true))

        if ((((pollPumpCount-1)*100/pollPumpTotalCount) < completed)&& !pollPumpPending){
          this.props.dispatch(pollPumps(this.props.axios))
        }
      }, this.props.drinkProgressUpdateInterval);
    }
  }

  abortDrink(){
    console.log('ABORTING DRINK!')
    this.props.dispatch(killAllPumps(this.props.axios))
          .then((result)=>{
            const { status, err } = result.data
            if (!status){
              alert('ERROR: '+ err)
            }
          })
  }
  



  render() {
    const { drinkOrdered } = this.props
     const actions = [
      <FlatButton
        label="Cancel"
        secondary={true}
        onTouchTap={this.abortDrink.bind(this)}
      />
    ]

    console.log('HASS DRINKKK BEENNN : ', drinkOrdered)

    return (
      <div>
         <Dialog
          actions={actions}
          modal={false}
          open={drinkOrdered}
          onRequestClose={this.abortDrink.bind(this)}
        >
          Drink Status
          <LinearProgress mode="determinate" value={this.props.drinkProgressPercentage} style={{marginBottom:'20px'}}/>
          <Pumps pumps={this.props.pumps.value} pumpLayout={this.props.pumpLayout} axios={this.props.axios} dispatch={this.props.dispatch} /> 
        </Dialog>
      </div>
    )
  }
}


