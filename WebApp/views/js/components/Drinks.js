import React from 'react'
import { StickyContainer, Sticky } from 'react-sticky'

import Drink from 'js/components/Drink'

import baseStyles from 'styles/base.css'



export default class Drinks extends React.Component {
  componentWillMount () {
      
  }

  componentDidMount () {
     
  }


  render () {
    
    const { drinks } = this.props

    const drinksComponent = drinks.map((drink, key)=>{
        return <Drink drink={drink} key={key} index={key} dispatch={this.props.dispatch} />
    })

    console.log('DRINKS: ', drinks)

    return <div>
              <h4> 'DRINKS'</h4>
              {drinksComponent}
           </div>
  }
}
