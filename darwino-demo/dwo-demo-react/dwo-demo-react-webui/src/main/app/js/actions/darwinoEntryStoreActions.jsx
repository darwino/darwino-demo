export const REQUEST_ENTRIES = "REQUEST_ENTRIES";
export const RECEIVE_ENTRIES = "RECEIVE_ENTRIES";

/** Action representing a request for entries */
export const requestEntries = (database, store) => ({
	type: REQUEST_ENTRIES,
	database,
	store
})

/** Action representing the receipt of entries */
export const receiveEntries = (database, store, json) => ({
    type: RECEIVE_ENTRIES,
    database,
    store,
    entries: json,
    receivedAt: Date.now()
})

const fetchEntries = (database, store) => dispatch => {
    dispatch(requestEntries(database, store));
    return fetch(`$darwino-jstore/databases/${database}/stores/${store}/entries`, {
            credentials: 'same-origin'
        })
        .then(response => response.json())
        .then(json => dispatch(receiveEntries(database, store, json)))
}

const shouldFetchEntries = (state, database, store) => {
    const entries = state.entries[database+store];
    if(!entries) {
        return true;
    }
    if(entries.isFetching) {
        return false;
    }
    return entries.didInvalidate;
}

export const fetchEntriesIfNeeded = (database, store) => (dispatch, getState) => {
    if(shouldFetchEntries(getState(), database, store)) {
        return dispatch(fetchEntries(database, store));
    }
}