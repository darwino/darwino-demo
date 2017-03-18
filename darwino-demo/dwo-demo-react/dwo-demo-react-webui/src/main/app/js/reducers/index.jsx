import { combineReducers } from 'redux'
import {
    REQUEST_BREWERIES, RECEIVE_BREWERIES
} from "../actions/index.jsx"

const breweries = (state = {
    isFetching: false,
    didInvalidate: false,
    items: []
}, action) => {
    console.log("received action", action, state)
    switch(action.type) {
    case REQUEST_BREWERIES:
        var newState = Object.assign({}, state);
        newState.isFetching = true;
        newState.didInvalidate = true;
        return newState;
    case RECEIVE_BREWERIES:
        var newState = Object.assign({}, state);
        newState.isFetching = false;
        newState.didInvalidate = false;
        newState.items = action.breweries;
        newState.lastUpdated = action.receivedAt;
        return newState;
    default:
        return state;
    }
}

export default breweries