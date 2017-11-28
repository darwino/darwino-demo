/*!COPYRIGHT HEADER! - CONFIDENTIAL 
 *
 * Darwino Inc Confidential.
 *
 * (c) Copyright Darwino Inc. 2014-2017.
 *
 * Notice: The information contained in the source code for these files is the property 
 * of Darwino Inc. which, with its licensors, if any, owns all the intellectual property 
 * rights, including all copyright rights thereto.  Such information may only be used 
 * for debugging, troubleshooting and informational purposes.  All other uses of this information, 
 * including any production or commercial uses, are prohibited. 
 */

import { LOAD_ENTRIES, LOAD_DOCUMENT, DELETE_DOCUMENT, darwinoToStoreKey } from "../actions/jsonStoreActions.jsx"

const QUERY_INITIAL_STATE = { };

export const DarwinoQueryStoreReducer = (state=QUERY_INITIAL_STATE, action) => {
    switch(action.type) {
        case LOAD_ENTRIES:
            // Update the store for the specified query
            // TODO make sure this deals with caches
            const newState = { ...state };
            const queryKey = darwinoToStoreKey(action.meta.database, action.meta.store, action.meta.params);
            newState[queryKey] = action.payload;
            return newState;
        default:
            return state;
    }
}

const DOCUMENTS_INITIAL_STATE = { };

export const DarwinoDocumentStoreReducer = (state=DOCUMENTS_INITIAL_STATE, action) => {
    let newState, documentKey;
    switch(action.type) {
        case LOAD_DOCUMENT:
            newState = { ...state };
            documentKey = darwinoToStoreKey(action.meta.database, action.meta.store, action.meta.unid);
            newState[documentKey] = action.payload;
            return newState;
        case DELETE_DOCUMENT:
            newState = { ...state };
            documentKey = darwinoToStoreKey(action.meta.database, action.meta.store, action.meta.unid);
            delete newState[documentKey];
            return newState;
        default:
            return state;
    }
}
