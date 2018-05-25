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
