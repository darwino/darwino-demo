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
