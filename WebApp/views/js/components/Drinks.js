import React from 'react'
import { StickyContainer, Sticky } from 'react-sticky'

import baseStyles from 'styles/base.css'



export default class Drinks extends React.Component {
  componentWillMount () {
      
  }

  componentDidMount () {
     
  }


  render () {
    
    const { drinks } = this.props

    console.log('DRINKS: ', drinks)

    return <div>
              <h4> 'DRINKS'</h4>
           </div>
  }
}
