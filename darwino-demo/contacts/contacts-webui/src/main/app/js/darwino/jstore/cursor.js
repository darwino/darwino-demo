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
import DEV_OPTIONS from '../util/dev';

/*
 * JSON store query builder
 */
export default class JstoreCursor {

    constructor() {
        this.params = {};
    }

    _stringify(s) {
        return typeof s==='object' ?  JSON.stringify(s) : s;
    }

    queryParams(params) {
        if(params) {
            for(let k in params) {
                if(params.hasOwnProperty(k)) {
                    this.params[k] = this._stringify(params[k])
                }
            }
        }
        return this;
    }

    database(database) {
        this.database = database;
        return this;
    }

    store(store) {
        this.store = store;
        return this;
    }

    query(query) {
        this.params.query = this._stringify(query);
        return this;
    }

    extract(extract) {
        this.params.extract = this._stringify(extract);
        return this;
    }

    aggregator(aggregator) {
        this.params.aggregator = this._stringify(aggregator);
        return this;
    }

    skip(skip) {
        this.params.skip = this._stringify(skip);
        return this;
    }

    limit(limit) {
        this.params.limit = this._stringify(limit);
        return this;
    }

    fetchEntries() {
        let url = `${DEV_OPTIONS.serverPrefix}$darwino-jstore/databases/${encodeURIComponent(this.database)}`
        if(this.store) {
            url += `/stores/${encodeURIComponent(this.store)}`
        }
        url += '/entries'
        if(this.params) {
            url += `?${queryString.stringify(this.params)}`
        }
        return fetch(
            url, {credentials: DEV_OPTIONS.credentials}
        ).then(entries => {
            try {
                return entries.json();
            } catch(e) {
                return "Fetch JSON entries error!";
            }
        })
    }

    lookup() {
        return this.fetchEntries().then(json => {
            return json.map(entry => {
                return entry.value;
            })
        })                
    }

    getDataLoader() {
        return (num,pagesize) => {
            this.skip(num*pagesize)
            this.limit(pagesize)
            return this.fetchEntries().then(json => {
                return json.map(entry => {
                    return {...entry.value, __meta: entry};
                })
            })                
        }
    }
}
