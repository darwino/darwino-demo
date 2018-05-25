/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2018.
 *
 * Licensed under The MIT License (https://opensource.org/licenses/MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial 
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
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
