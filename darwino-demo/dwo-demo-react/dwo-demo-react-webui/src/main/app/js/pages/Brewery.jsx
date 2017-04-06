import React, { Component, PropTypes } from "react";
import { connect } from 'react-redux'
import { fetchEntriesIfNeeded, darwinoToStoreKey } from "../actions/darwinoEntryStoreActions.jsx"

import BeerTable from "../components/BeerTable.jsx";

export class Brewery extends Component {
    static propTypes = {
        breweries: PropTypes.array.isRequired,
        isFetching: PropTypes.bool.isRequired,
        lastUpdated: PropTypes.number,
        dispatch: PropTypes.func.isRequired
    }
    
    componentDidMount() {
        const { dispatch, params } = this.props;
        const breweryId = params.breweryId;
        const query = JSON.stringify({id: breweryId});
        dispatch(fetchEntriesIfNeeded("dwodemoreact", "breweries", query));
    }
    
    getBreweryInfo() {
        const { breweries } = this.props;

        return (<div/>);
    }
    
    render() {
        const { breweries, isFetching, lastUpdated, params } = this.props;
        const breweryId = parseInt(params.breweryId, 10);
        
        return (
          <div>
            <p>Brewery ID: {breweryId}</p>
            <BeerTable breweryId={breweryId}/>
          </div>
        );
  }
}

const mapStateToProps = (state, props) => {
    const { entries } = state;
    const { params } = props;
    const breweryId = params.breweryId;
    const query = JSON.stringify({id: breweryId});
    
    const {
        isFetching,
        lastUpdated,
        items: breweries
    } = entries[darwinoToStoreKey("dwodemoreact", "breweries", query)] || {
        isFetching: true,
        items: []
    }
    
    return {
        breweries,
        isFetching,
        lastUpdated
    }
}

export default connect(mapStateToProps)(Brewery)