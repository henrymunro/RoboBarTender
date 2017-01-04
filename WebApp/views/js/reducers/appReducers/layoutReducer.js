export default function reducer (state = {
    username: {
      value: '',
      pending: true
    },
    pumps:{
      value: [],
      pending: true
    }, 
    pumpLayout: [{pumpNumber: 1, active: false},
                  {pumpNumber: 2, active: false},
                  {pumpNumber: 3, active: false},
                  {pumpNumber: 4, active: false},
                  {pumpNumber: 5, active: false}],
    pumping: false,
    editPumps:{
      editPumpDialogOpen: false,
      selectedEditPumpNumber: 0,
      editPumpName:'',
      editPumpDisplayName:'',
      editPumpPercrntage:undefined
    }
    
  } , action) {
  switch (action.type) {

    case 'GET_USER_FULFILLED': {
      const username = action.payload//.data
      return {...state, username: {
                                value: username, 
                                pending: false
                              }
      }
    }

    /*************************   EDIT PUMPS *********************/

    case 'OPEN_EDIT_PUMP_DIALOG':{
      return {...state, editPumps:{
                              editPumpDialogOpen: true,
                              selectedEditPumpNumber: 0,
                              editPumpName:'',
                              editPumpDisplayName:'',
                              editPumpPercrntage:undefined
                            }
          }
    }

    case 'CLOSE_EDIT_PUMP_DIALOG':{
      return {...state, editPumps:{
                              editPumpDialogOpen: false,
                              selectedEditPumpNumber: 0,
                              editPumpName:'',
                              editPumpDisplayName:'',
                              editPumpPercrntage:undefined
                            }
          }
    }


    case 'UPDATE_SELECTED_EDIT_PUMP':{
      const pumpNumber = Number(action.payload)
      const currentSelectedPump = state.pumps.value.filter((el)=>{return el.PumpNumber == pumpNumber})[0] || {}
      return {...state, editPumps:{
                              editPumpDialogOpen: true,
                              selectedEditPumpNumber: pumpNumber,
                              editPumpName:currentSelectedPump.PumpName,
                              editPumpDisplayName:currentSelectedPump.DisplayName,
                              editPumpPercrntage:currentSelectedPump.Percentage
                            }
            }
    }

    case 'UPDATE_EDIT_PUMP_NAME':{
      return {...state, editPumps:{
                              editPumpDialogOpen: true,
                              selectedEditPumpNumber: state.editPumps.selectedEditPumpNumber,
                              editPumpName:action.payload,
                              editPumpDisplayName:state.editPumps.editPumpDisplayName,
                              editPumpPercrntage:state.editPumps.editPumpPercrntage
                            }
            }
    }

    case 'UPDATE_EDIT_PUMP_DISPLAY_NAME':{
      return {...state, editPumps:{
                              editPumpDialogOpen: true,
                              selectedEditPumpNumber: state.editPumps.selectedEditPumpNumber,
                              editPumpName:state.editPumps.editPumpName,
                              editPumpDisplayName:action.payload,
                              editPumpPercrntage:state.editPumps.editPumpPercrntage
                            }
            }
    }

    case 'UPDATE_EDIT_PUMP_PERCENTAGE':{
      return {...state, editPumps:{
                              editPumpDialogOpen: true,
                              selectedEditPumpNumber: state.editPumps.selectedEditPumpNumber,
                              editPumpName:state.editPumps.editPumpName,
                              editPumpDisplayName:state.editPumps.editPumpDisplayName,
                              editPumpPercrntage:Number(action.payload)||0
                            }
            }
    }



    /************************  GENERAL PUMPS *************************/

    case 'GET_PUMPS_PENDING': {
      return {...state, pumps: {
                                value: state.pumps.value, 
                                pending: true
                              }
      }
    }
    case 'GET_PUMPS_FULFILLED': {
      const pumps = action.payload.data
      return {...state, pumps: {
                                value: pumps, 
                                pending: false
                              }
      }
    }

    case 'POLL_PUMP_STATUS_FULFILLED': {
      const pumps = action.payload.data
      return {...state, pumps: {
                                value: pumps, 
                                pending: false
                              }
      }
    }
  }

  return state
}


