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

export default class PagingDataFetcher {
    rowsCount = 0
    eof = false
    pages = []
    autoScroll = false
    loadedpages = []
    pagesize = 25
    maxpages = 8
    constructor(props) {
        Object.assign(this,props)
    }
    init() {
        this.loadPage(0)
    }
    getRow(i) {
        let num = Math.floor(i/this.pagesize)
        let row = this._getRow(num,i)
        // Prefetch the next page - this will also increase the count
        if(this.autoScroll && !this.eof && num==this.pages.length-1) {
            this.pages[num+1] = null
            setTimeout(() => {
                this.loadPage(num+1)
            })
        }
        return row
    }
    getRowCount() {
        return this.rowsCount
    }
    _getRow(num,i) {
        if(num<this.pages.length) {
            if(this.pages[num]) {
                let idx = i-(num*this.pagesize);
                return this.pages[num][idx];
            }
            if(this.pages[num]===undefined) {
                this.loadPage(num)
            }
        }
        return {}
    }
    loadPage(num) {
        this.pages[num] = null // null means loading, undefined means empty until we'll load it
        this.dataLoader(num,this.pagesize).then((data) => {
            this.eof = data.length<this.pagesize
            this.pages[num] = data
            this.rowsCount = Math.max(this.rowsCount,num*this.pagesize+data.length)
console.log("Loaded page #"+num+", pages="+this.pages.length); //+", ="+JSON.stringify(this.pages[num]));
            if(this.maxpages>0) {
                for(let i=0; i<this.loadedpages.length; i++) {
                    if(this.loadedpages[i]==num) {
                        this.loadedpages.splice(i,1);
                        break
                    }
                }
                this.loadedpages.push(num)
                if(this.loadedpages.length>this.maxpages) {
console.log("Discard page #"+this.loadedpages[0]);
                    this.pages[this.loadedpages[0]] = undefined;
                    this.loadedpages.splice(0,1);
                }
            }

            // Redraw the table as the data changed
            if(this.onPageLoaded) this.onPageLoaded(num);
        })
    }
}
