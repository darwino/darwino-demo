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
