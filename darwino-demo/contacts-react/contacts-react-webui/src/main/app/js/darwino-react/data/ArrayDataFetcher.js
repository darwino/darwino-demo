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

export default class ArrayDataFetcher {
    firstPage = 0
    pageSize = 1000000
    _array = []
    _eof = false
    _fetching = false
    _error = false
    _errorMsg = null
    constructor(props) {
        Object.assign(this,props)
    }
    init() {
        this._array = []
        this._eof = false
        this._error = false
        this._errorMsg = null
        this.loadMoreRows();
    }
    getArray() {
        return this._array
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
        return this._array[i]
    }
    getRows(skip,limit) {
        return this._array.slice(skip, limit)
    }    
    getRowCount() {
        return this._array.length
    }
    loadMoreRows() {
        if(!this._eof) {
            let num = this._array.length/this.pageSize+this.firstPage
            let pageSize = this.pageSize
            this.dataLoader(num,pageSize).then((data) => {
                this._array = this._array.concat(data);
                this._eof = data.length<pageSize
                this._fetching = false
                this._error = false
                this._errorMsg = null
                // Send an event for the content changed
                if(this.onDataLoaded) this.onDataLoaded(num-this.firstPage,pageSize);
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
}
