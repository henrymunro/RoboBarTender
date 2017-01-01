import React from 'react'
import { StickyContainer, Sticky } from 'react-sticky'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import cx from 'classnames'

import { addPump, ceasePump, getPumps } from 'js/actions/layoutActions'

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


  render () {
    
    const { pumps, pumpLayout } = this.props


    const pumpLayoutMap = pumpLayout.map((value, key)=>{
        const { pumpNumber, active } = value
        const currentDrink = pumps.filter((el)=>{return el.PumpNumber == pumpNumber})[0] || {}
        const pumpActive = currentDrink.PumpStatus ===1
        const pumpStyle = cx({
            [styles.pumpEmpty]: !currentDrink.DisplayName,
            [styles.pumpInactive]: !pumpActive && currentDrink.DisplayName,
            [styles.pumpActive]: pumpActive

        })


        const ceasePumpButton = (!pumpActive && currentDrink.DisplayName)?  <RaisedButton label="Delete" data-pump-number={pumpNumber} fullWidth={true} onClick={this.ceasePump.bind(this)}/> : <div/>
        const addPumpButton = (!currentDrink.DisplayName)?<RaisedButton label="Add" data-pump-number={pumpNumber} fullWidth={true} onClick={this.addPump.bind(this)}/> :<div/>


        return <Card key={key}>
                    <CardHeader
                      subtitle={currentDrink.DisplayName||'Empty'}
                      className={pumpStyle}
                    /> 
                    {ceasePumpButton}
                    {addPumpButton}
                </Card>
    })


    return <div>
              <h4> 'pumps'</h4>
              {pumpLayoutMap}
           </div>
  }
}
