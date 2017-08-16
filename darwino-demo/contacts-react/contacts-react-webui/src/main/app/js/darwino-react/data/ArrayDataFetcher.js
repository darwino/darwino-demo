/* 
 * (c) Copyright Darwino Inc. 2014-2017.
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
