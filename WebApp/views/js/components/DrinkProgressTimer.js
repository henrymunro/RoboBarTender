import React from 'react'
import { StickyContainer, Sticky } from 'react-sticky'
import LinearProgress from 'material-ui/LinearProgress'
import Dialog from 'material-ui/Dialog'


import {updateDrinkTimerProgress, pollPumps, resetPollPumpsCount, setPendingTimeout } from 'js/actions/drinksActions'

import baseStyles from 'styles/base.css'



export default class DrinkTimerProgress extends React.Component {

  componentDidMount() {
    this.timer = setTimeout(() => this.progress(), this.props.drinkProgressUpdateInterval);
  }

  componentDidUpdate() {
    const { timeOutPending } = this.props
    // Prevent a new time out before the old one has finished
    if (!timeOutPending) {
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
      pollPumpPending
    } = this.props
    
    if (completed > 100) {
      this.props.dispatch(updateDrinkTimerProgress(0, false))
      this.props.dispatch(pollPumps(this.props.axios))
            .then(()=> this.props.dispatch(resetPollPumpsCount()))      
      this.props.dispatch(setPendingTimeout(false))
    } else {
      // Calculate new value for progress bar
      const newCompleted = 100.0 * (new Date().getTime() - drinkOrderedTime) / (pourTime* 1000) 

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

  render() {
    return (
      <div>
         <Dialog
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          Discard draft?
          <LinearProgress mode="determinate" value={this.props.drinkProgressPercentage} />
        </Dialog>
      </div>
    )
  }
}


