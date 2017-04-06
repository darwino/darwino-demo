export const REQUEST_ENTRIES = "REQUEST_ENTRIES";
export const RECEIVE_ENTRIES = "RECEIVE_ENTRIES";

export function darwinoToStoreKey(database, store, query) {
    return database+store+(query?query:'');
}

/** Action representing a request for entries */
export const requestEntries = (database, store, query) => ({
	type: REQUEST_ENTRIES,
	database,
	store,
    query
})

/** Action representing the receipt of entries */
export const receiveEntries = (database, store, query, json) => ({
    type: RECEIVE_ENTRIES,
    database,
    store,
    query,
    entries: json,
    receivedAt: Date.now()
})

const fetchEntries = (database, store, query) => dispatch => {
    dispatch(requestEntries(database, store, query));
    return fetch(`$darwino-jstore/databases/${database}/stores/${store}/entries?query=${query ? query : ''}`, {
            credentials: 'same-origin'
        })
        .then(response => response.json())
        .then(json => dispatch(receiveEntries(database, store, query, json)))
}

const shouldFetchEntries = (state, database, store, query) => {
    const entries = state.entries[darwinoToStoreKey(database,store,query)];
    if(!entries) {
        return true;
    }
    if(entries.isFetching) {
        return false;
    }
    return entries.didInvalidate;
}

export const fetchEntriesIfNeeded = (database, store, query) => (dispatch, getState) => {
    if(shouldFetchEntries(getState(), database, store, query)) {
        return dispatch(fetchEntries(database, store, query));
    }
}