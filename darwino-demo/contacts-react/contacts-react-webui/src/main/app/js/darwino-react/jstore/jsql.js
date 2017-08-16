/* 
 * (c) Copyright Darwino Inc. 2014-2017.
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
