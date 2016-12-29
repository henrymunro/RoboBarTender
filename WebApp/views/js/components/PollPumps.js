import React from 'react'
import { StickyContainer, Sticky } from 'react-sticky'
import LinearProgress from 'material-ui/LinearProgress'


import {pollPumps, resetPollPumpsCount} from 'js/actions/drinksActions'

import baseStyles from 'styles/base.css'



export default class PumpPoller extends React.Component {

  componentDidMount() {
    this.timer = setTimeout(() => this.progress(), this.props.pollPumpInterval);
  }

  componentDidUpdate() {
    const { pollPumpInterval, // ms
            pollPumpCount,
            drinkOrdered,
            pollPumpPending,
            pollPumpTime,
            drinkProgressPercentage        
    } = this.props
    if (drinkOrdered && !pollPumpPending && new Date().getTime()-pollPumpTime > pollPumpInterval && drinkProgressPercentage*1.0/5 >pollPumpCount ){
        this.timer = setTimeout(() => this.progress(), this.props.pollPumpInterval);
      }
    
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
    this.props.dispatch(resetPollPumpsCount())
  }

  progress() {
    const { pollPumpInterval, // ms
            pollPumpCount,
            drinkOrdered,
            pollPumpPending,
            pollPumpTime,
            drinkProgressPercentage
    } = this.props
    if ((drinkOrdered && !pollPumpPending && new Date().getTime()-pollPumpTime > pollPumpInterval && drinkProgressPercentage*1.0/5 >pollPumpCount )?false: true){
        this.timer = setTimeout(() => this.props.dispatch(pollPumps(this.props.axios)), this.props.pollPumpInterval);
    } else if (!drinkOrdered){
      this.props.dispatch(resetPollPumpsCount())
    }
  }

  render() {
    const { pollPumpInterval, // ms
            pollPumpCount,
            drinkOrdered,
            pollPumpPending,
            pollPumpTime,
            drinkProgressPercentage        
    } = this.props
    return (
      <div>{this.props.pollPumpCount} ,  {(drinkOrdered && !pollPumpPending && new Date().getTime()-pollPumpTime > pollPumpInterval && drinkProgressPercentage*1.0/5 >pollPumpCount )?'send':'DONT SEND'}</div>
    )
  }
}


