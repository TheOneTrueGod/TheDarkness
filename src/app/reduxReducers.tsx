import { combineReducers } from 'redux'
import {
  SET_LOCATION,
  setLocationResult,
} from './reduxActions'

const locationInitialState = {
    href: window.location.href,
};

function location(state = locationInitialState, action: setLocationResult) {
  switch (action.type) {
    case SET_LOCATION:
      return action.location;
    default:
      return state;
  }
}

const darknessReducers = combineReducers({
  location
});

export default darknessReducers;