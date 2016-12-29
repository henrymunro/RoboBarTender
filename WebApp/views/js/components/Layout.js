import React from 'react'
import { connect } from 'react-redux'
import { StickyContainer, Sticky } from 'react-sticky'

import baseStyles from 'styles/base.css'

import { getUsername } from 'js/actions/layoutActions'


@connect((store) => {
  return {
    username: store.layout.username
  }
})
export default class Layout extends React.Component {
  componentWillMount () {
      setTimeout(()=>{this.props.dispatch(getUsername())}, 1000)
  }


  render () {
    const {username} = this.props
    const welocomeMessage = 'Welcome to your new app ' + username.value
    const message = username.pending ?  'Loading ... ': welocomeMessage

    return <div>
              <h1> {message} </h1>
           </div>
  }
}
