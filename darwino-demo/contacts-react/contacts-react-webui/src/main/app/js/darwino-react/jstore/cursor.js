/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
import queryString from 'query-string';
import DEV_OPTIONS from '../util/dev';

/*
 * JSON store cursor.
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

    database(database) {
        this.database = database;
        return this;
    }

    store(store) {
        this.store = store;
        return this;
    }

    query(query) {
        return this.queryParams({query:query});
    }

    orderby(orderBy,descending) {
        let o = {orderby:orderBy}
        if(descending) o.descending=true
        return this.queryParams(o);
    }

    ftsearch(ftsearch) {
        return this.queryParams({ftsearch:ftsearch});
    }

    extract(extract) {
        return this.queryParams({extract:extract});
    }

    aggregator(aggregator) {
        return this.queryParams({aggregator:aggregator});
    }

    skip(skip) {
        return this.queryParams({skip:skip});
    }

    limit(limit) {
        return this.queryParams({limit:limit});
    }

    name(name) {
        return this.queryParams({name:name});
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
                return entry.json;
            })
        })                
    }

    getDataLoader(transform) {
        return (num,pagesize) => {
            this.skip(num*pagesize)
            this.limit(pagesize)
            return this.fetchEntries().then(json => {
                return transform ? json.map(transform) : json;
            })                
        }
    }
}
