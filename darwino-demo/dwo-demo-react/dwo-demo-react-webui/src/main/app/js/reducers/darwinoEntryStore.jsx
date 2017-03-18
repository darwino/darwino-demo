import { combineReducers } from 'redux'
import {
    REQUEST_ENTRIES, RECEIVE_ENTRIES
} from "../actions/darwinoEntryStoreActions.jsx"

/** Model: The per-key container of entries */
const entryList = (state = {
    isFetching: false,
    didInvalidate: false,
    items: []
}, action) => {
    switch(action.type) {
    case REQUEST_ENTRIES:
        var newState = Object.assign({}, state);
        newState.isFetching = true;
        newState.didInvalidate = true;
        return newState;
    case RECEIVE_ENTRIES:
        var newState = Object.assign({}, state);
        newState.isFetching = false;
        newState.didInvalidate = false;
        newState.items = action.entries;
        newState.lastUpdated = action.receivedAt;
        return newState;
    default:
        return state;
    }
}

/** Model: the map of entry keys to entryLists */
const entries = (state = {}, action) => {
    switch(action.type) {
    case RECEIVE_ENTRIES:
    case REQUEST_ENTRIES:
        var newState = Object.assign({}, state);
        newState[action.database+action.store] = entryList(state[action.database+action.store], action);
        return newState;
    default:
        return state;
    }
}

// This has the side effect of putting "entries" into state
const rootReducer = combineReducers({
        entries
});

export default rootReducer