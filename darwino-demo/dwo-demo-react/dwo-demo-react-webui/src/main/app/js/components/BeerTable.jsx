import React, { Component, PropTypes } from "react";
import { connect } from 'react-redux'
import { fetchEntriesIfNeeded, darwinoToStoreKey } from "../actions/darwinoEntryStoreActions.jsx"

import BeerRow from "./BeerRow.jsx";

export class BeerTable extends Component {
    static propTypes = {
        beers: PropTypes.array.isRequired,
        isFetching: PropTypes.bool.isRequired,
        lastUpdated: PropTypes.number,
        dispatch: PropTypes.func.isRequired,
        breweryId: PropTypes.number
    }
    
    componentDidMount() {
        const { dispatch, breweryId } = this.props;
        console.log("got brewery", this.props)
        const query = breweryId ? JSON.stringify({brewery_id: breweryId}) : '';
        dispatch(fetchEntriesIfNeeded("dwodemoreact", "beers", query));
    }
    
    getBeers() {
        const { beers } = this.props;
        return beers.map(
                (beer) => <BeerRow beer={beer.value} key={beer.unid}/>
        );
    }
    
    render() {
        const { beers, isFetching, lastUpdated } = this.props;
        const isEmpty = beers.length === 0;
        
        return (
            <table class="table table-striped table-bordered table-condensed">
                <thead>
                    <tr>
                        <th>Beer</th>
                        <th>Tags</th>
                    </tr>
                </thead>
                <tbody>
                    {this.getBeers()}
                </tbody>
            </table>
        );
  }
}

const mapStateToProps = (state, props) => {
    const { entries } = state;
    const { params } = props;
    const breweryId = params.breweryId;
    const query = breweryId ? JSON.stringify({brewery_id: breweryId}) : '';
    
    const {
        isFetching,
        lastUpdated,
        items: beers
    } = entries[darwinoToStoreKey("dwodemoreact", "beers", query)] || {
        isFetching: true,
        items: []
    }
    
    return {
        beers,
        isFetching,
        lastUpdated
    }
}

export default connect(mapStateToProps)(BeerTable)