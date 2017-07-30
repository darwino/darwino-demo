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
import DEV_OPTIONS from '../util/dev';

/*
 * JSON store query builder
 */
export default class Jsql {

    constructor() {
        this.params = {};
    }

    _stringify(s) {
        return typeof s==='object' ?  JSON.stringify(s) : s;
    }

    database(database) {
        this.database = database;
        return this;
    }

    queryParams(params) {
        if(params) {
            for(let k in params) {
                if(params.hasOwnProperty(k)) {
                    if([params[k]]) {
                        this.params[k] = this._stringify(params[k])
                    } else {
                        delete this.params[k];
                    }
                }
            }
        }
        return this;
    }

    name(name) {
        return this.queryParams({name:name});
    }

    format(format) {
        return this.queryParams({format:format});
    }

    query(query) {
        return this.queryParams({query:query});
    }

    skip(skip) {
        return this.queryParams({skip:skip});
    }

    limit(limit) {
        return this.queryParams({limit:limit});
    }

    params(params) {
        return this.queryParams({params:params});
    }
    
    fetch() {
        let url = `${DEV_OPTIONS.serverPrefix}$darwino-jstore`
        if(this.database) {
            url += `/databases/${encodeURIComponent(this.database)}`
        }
        url += '/jsql'
        if(this.params) {
            url += `?${queryString.stringify(this.params)}`
        }
        return fetch(
            url, {credentials: DEV_OPTIONS.credentials}
        ).then(entries => {
            try {
                return entries.json();
            } catch(e) {
                return "Fetch JSQL result error!";
            }
        })
    }
}