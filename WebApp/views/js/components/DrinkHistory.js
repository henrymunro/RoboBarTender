import React from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import Dialog from 'material-ui/Dialog'
import Divider from 'material-ui/Divider'
import FlatButton from 'material-ui/FlatButton'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import moment from 'moment'


import { getDrinkHistory, openDrinkHistoryModal, closeDrinkHistoryModal } from 'js/actions/drinksActions'

import baseStyles from 'styles/base.css'



export default class DrinkHistory extends React.Component {
  componentWillMount () {
      this.props.dispatch(getDrinkHistory(this.props.axios))
  }

  componentDidMount () {
     
  }

  refreshHistory(){
    this.props.dispatch(getDrinkHistory(this.props.axios))
  }

  closeDrinkHistoryModal(){
    this.props.dispatch(closeDrinkHistoryModal())
  }



  render () {
    
    const { value, pending, modalOpen } = this.props.drinkHistory


    /* value = [{
    Count:1
    Date:"2017-02-15T00:00:00.000Z"
    DistinctUser:1
    DrinkImage:"Rum_and_coke.jpg"
    DrinkName:"Rum and Coke"
    Status:"fail"
    Volume:"250" }]
     */
    const drinkHistoryTableBody = value.filter((hist)=> hist.Status=='success')
                                    .map((hist, key)=>{
                                      const { Count, Date, DistinctUser, DrinkImage, DrinkName, Volume } = hist
                                      return <TableRow key={key}>
                                              <TableRowColumn className='hide-on-med-and-down'>{moment(Date).format('ddd Do MMM')}</TableRowColumn>
                                              <TableRowColumn className='hide-on-med-and-down'>{DrinkName}</TableRowColumn>
                                              <TableRowColumn className='hide-on-med-and-down'>{Count}</TableRowColumn>
                                              <TableRowColumn className='hide-on-med-and-down'>{Volume}ml</TableRowColumn>
                                              <TableRowColumn className='hide-on-large-only'>{`${moment(Date).format('l')} - ${DrinkName} - ${Count}`}</TableRowColumn>
                                            </TableRow>
                                    })


    

    const actions = [
      <FlatButton
        label="Refresh"
        secondary={true}
        onTouchTap={this.refreshHistory.bind(this)}
      />,
      <FlatButton
        label="Close"
        primary={true}
        onTouchTap={this.closeDrinkHistoryModal.bind(this)}
      />
    ]

    return  <div>              
              <Dialog
                actions={actions}
                modal={false}
                title="Drink Leader Board"
                open={modalOpen}
                onRequestClose={this.closeDrinkHistoryModal.bind(this)}
                autoScrollBodyContent={true}
              >
               <Table height={'300px'}>
                <TableHeader adjustForCheckbox={false}
                              displaySelectAll={false}>
                  <TableRow className='hide-on-med-and-down'>
                    <TableHeaderColumn>Date</TableHeaderColumn>
                    <TableHeaderColumn>Drink</TableHeaderColumn>
                    <TableHeaderColumn>Count</TableHeaderColumn>                    
                    <TableHeaderColumn>Total Volume</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                  {drinkHistoryTableBody}
                </TableBody>
              </Table>
                
              </Dialog>
           </div>

  }
}
