export const REQUEST_BREWERIES = "REQUEST_BREWERIES";
export const RECEIVE_BREWERIES = "RECEIVE_BREWERIES";

export const requestBreweries = () => ({
	type: REQUEST_BREWERIES
})

export const receiveBreweries = (json) => ({
    type: RECEIVE_BREWERIES,
    breweries: json,
    receivedAt: Date.now()
})

const fetchBreweries = () => dispatch => {
    dispatch(requestBreweries());
    return fetch("$darwino-jstore/databases/dwodemoreact/stores/breweries/entries", {
            credentials: 'same-origin'
        })
        .then(response => response.json())
        .then(json => dispatch(receiveBreweries(json)))
}

const shouldFetchBreweries = (state) => {
    const breweries = state.breweries;
    if(!breweries) {
        return true;
    }
    if(breweries.isFetching) {
        return false;
    }
    return true;
}

export const fetchBreweriesIfNeeded = () => (dispatch, getState) => {
    if(shouldFetchBreweries(getState())) {
        return dispatch(fetchBreweries());
    }
}