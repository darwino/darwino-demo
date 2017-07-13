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

export default class PagingDataFetcher {
    autoFetch = false
    pageSize = 100
    maxPages = 8
    _rowsCount = 0
    _eof = false
    _pages = []
    _loadedPages = []
    _fetching = false
    _autoFetching = false
    _error = false
    _errorMsg = null
    constructor(props) {
        Object.assign(this,props)
    }
    init() {
        this._pages = []
        this.loadPage(0)
    }
    isFetching() {
        return this._fetching
    }
    isError() {
        return this._error
    }
    getErrorMessage() {
        return this._errorMsg
    }
    hasMoreRows() {
        return !this._error && !this._eof
    }
    getRow(i) {
        let num = Math.floor(i/this.pageSize)
        let row = this._getRow(num,i)
        // Prefetch the next page - this will also increase the count
        if(this.autoFetch && !this._autoFetching && !this._eof && num==this._pages.length-1) {
            this._autoFetching = true // Just do it once...
            setTimeout(() => {
                this.loadMoreRows()
                this._autoFetching = false // Just do it once...
            })
        }
        return row
    }
    getRows(skip,limit) {
        let a = [];
        for(let i=0; i<limit; i++) {
            a[i] = this.getRow(skip+i);
        }
        return a;
    }    
    getRowCount() {
        return this._rowsCount
    }
    _getRow(num,i) {
        if(num<this._pages.length) {
            if(this._pages[num]) {
                let idx = i-(num*this.pageSize);
                return this._pages[num][idx];
            }
            if(this._pages[num]===undefined) {
                this.loadPage(num)
            }
        }
        return {}
    }
    loadMoreRows() {
        if(!this._fetching && !this._eof) {
            let num = this._pages.length
            this.loadPage(num+1)
        }
    }
    loadPage(num) {
        this._pages[num] = null // null means loading, undefined means empty until we'll load it
        this.dataLoader(num,this.pageSize).then((data) => {
            this._eof = data.length<this.pageSize
            this._pages[num] = data
            let nc = num*this.pageSize+data.length
            this._rowsCount = this._eof ? nc : Math.max(this._rowsCount,nc)
            this._fetching = false
            this._error = false
            this._errorMsg = null
            //console.log("Loaded page #"+num+", pages="+this.pages.length); //+", ="+JSON.stringify(this.pages[num]));
            if(this.maxPages>0 && data.length) {
                for(let i=0; i<this._loadedPages.length; i++) {
                    if(this._loadedPages[i]==num) {
                        this._loadedPages.splice(i,1);
                        break
                    }
                }
                this._loadedPages.push(num)
                if(this._loadedPages.length>this.maxPages) {
                    //console.log("Discard page #"+this.loadedpages[0]);
                    this._pages[this._loadedPages[0]] = undefined;
                    this._loadedPages.splice(0,1);
                }
            }
            // Send an event for the content changed
            if(this.onDataLoaded) this.onDataLoaded(num,this.pageSize);
        }, (error) => {
            // Error
            this._fetching = false
            this._error = true
            this._errorMsg = error.toString()
            // Send an event for the content changed
            if(this.onDataLoaded) this.onDataLoaded(0,0);
        });
        this._fetching = true
    }
}
