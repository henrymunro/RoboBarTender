import React from 'react'
import { StickyContainer, Sticky } from 'react-sticky'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import cx from 'classnames'

import baseStyles from 'styles/base.css'
import styles from 'styles/components/pumps.css'





export default class Pumps extends React.Component {
  componentWillMount () {
      
  }

  componentDidMount () {
     
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
        return <Card key={key}>
                    <CardHeader
                      subtitle={currentDrink.DisplayName||'Empty'}
                      className={pumpStyle}
                    /> 
                </Card>
    })


    return <div>
              <h4> 'pumps'</h4>
              {pumpLayoutMap}
           </div>
  }
}
