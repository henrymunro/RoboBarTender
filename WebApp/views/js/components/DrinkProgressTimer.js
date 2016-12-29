import React from 'react'
import { StickyContainer, Sticky } from 'react-sticky'
import LinearProgress from 'material-ui/LinearProgress'


import {updateDrinkTimerProgress } from 'js/actions/drinksActions'

import baseStyles from 'styles/base.css'



export default class DrinkTimerProgress extends React.Component {

  componentDidMount() {
    this.timer = setTimeout(() => this.progress(), this.props.drinkProgressUpdateInterval);
  }

  componentDidUpdate() {
    this.timer = setTimeout(() => this.progress(), this.props.drinkProgressUpdateInterval);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  progress() {
    const completed = this.props.drinkProgressPercentage
    const { pourTime, // seconds
      drinkProgressUpdateInterval // ms
    } = this.props
    if (completed > 100) {
      this.props.dispatch(updateDrinkTimerProgress(100, false))
    } else {
      const diff = 100.0 * (drinkProgressUpdateInterval/1000) / pourTime
      this.timer = setTimeout(() => this.props.dispatch(updateDrinkTimerProgress(completed + diff, true)), this.props.drinkProgressUpdateInterval);
    }
  }

  render() {
    return (
      <LinearProgress mode="determinate" value={this.props.drinkProgressPercentage} />
    )
  }
}


