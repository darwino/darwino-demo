/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2017.
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

import queryString from 'query-string';

import JstoreCursor from '../jstore/cursor';
import DEV_OPTIONS from '../util/dev';

export const LOAD_ENTRIES = "LOAD_ENTRIES";
export const LOAD_DOCUMENT = "LOAD_DOCUMENT";

export const NEW_DOCUMENT    = "NEW_DOCUMENT";
export const CREATE_DOCUMENT = "CREATE_DOCUMENT";
export const UPDATE_DOCUMENT = "UPDATE_DOCUMENT";
export const DELETE_DOCUMENT = "DELETE_DOCUMENT";
export const DELETEALL_DOCUMENTS = "DELETEALL_DOCUMENTS";
export const REMOVE_DOCUMENT = "REMOVE_DOCUMENT";

export function darwinoToStoreKey(database, store, query) {
    return database+store+(query?query:'');
}


//
// Cursor Actions
//

export const loadStoreEntries = (database, store, params) => ({
    type: LOAD_ENTRIES,
    payload: (new JstoreCursor()).database(database).store(store).queryParams(params).fetchEntries(),
    meta: {
        database,
        store,
        params
    }
})



//
// Document Actions
//
export const removeDocument = (database, store, unid) => ({
    type: DELETE_DOCUMENT,
    meta: {
        database,
        store,
        unid
    }
})
export const loadDocument = (database, store, unid) => ({
    type: LOAD_DOCUMENT,
    payload: fetch(`${DEV_OPTIONS.serverPrefix}$darwino-jstore/databases/${encodeURIComponent(database)}/stores/${encodeURIComponent(store)}/documents/${encodeURIComponent(unid)}`, {
            credentials: DEV_OPTIONS.credentials,
        })
        .then(response => response.json()),
    meta: {
        database,
        store,
        unid
    }
})
export const newDocument = (database, store) => ({
    type: NEW_DOCUMENT,
    payload: fetch(`${DEV_OPTIONS.serverPrefix}$darwino-jstore/databases/${encodeURIComponent(database)}/stores/${encodeURIComponent(store)}/newdocument`, {
            credentials: DEV_OPTIONS.credentials,
        })
        .then(response => response.json()),
})
export const createDocument = (database, store, content, unid) => ({
    type: CREATE_DOCUMENT,
    payload: fetch(`${DEV_OPTIONS.serverPrefix}$darwino-jstore/databases/${encodeURIComponent(database)}/stores/${encodeURIComponent(store)}/documents${unid?'/'+unid:''}`, {
            credentials: DEV_OPTIONS.credentials,
            method: 'POST',
            body: JSON.stringify({json: content})
        })
        .then(response => response.json())
})
export const updateDocument = (database, store, unid, content) => ({
    type: UPDATE_DOCUMENT,
    payload: fetch(`${DEV_OPTIONS.serverPrefix}$darwino-jstore/databases/${encodeURIComponent(database)}/stores/${encodeURIComponent(store)}/documents/${encodeURIComponent(unid)}`, {
            credentials: DEV_OPTIONS.credentials,
            method: 'PUT',
            body: JSON.stringify({json: content})
        })
        .then(response => response.json())
})
export const deleteDocument = (database, store, unid) => ({
    type: DELETE_DOCUMENT,
    payload: fetch(`${DEV_OPTIONS.serverPrefix}$darwino-jstore/databases/${encodeURIComponent(database)}/stores/${encodeURIComponent(store)}/documents/${encodeURIComponent(unid)}`, {
            credentials: DEV_OPTIONS.credentials,
            method: 'DELETE'
        }),
    meta: {
        database,
        store,
        unid
    }
})
export const deleteAllDocuments = (database, store) => ({
    type: DELETEALL_DOCUMENTS,
    payload: fetch(`${DEV_OPTIONS.serverPrefix}$darwino-jstore/databases/${encodeURIComponent(database)}/stores/${encodeURIComponent(store)}/documents`, {
            credentials: DEV_OPTIONS.credentials,
            method: 'DELETE'
        }),
    meta: {
        database,
        store
    }
})
