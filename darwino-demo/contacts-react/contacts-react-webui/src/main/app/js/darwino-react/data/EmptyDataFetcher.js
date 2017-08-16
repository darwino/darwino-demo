/* 
 * (c) Copyright Darwino Inc. 2014-2017.
 */
export default class EmptyDataFetcher {
    constructor(props) {
        Object.assign(this,props)
    }
    init() {
    }
    getRow(i) {
        return null
    }
    getRowCount() {
        return 0
    }
}
