import React, { Component, PropTypes } from "react";
import { connect } from 'react-redux'
import { fetchEntriesIfNeeded } from "../actions/darwinoEntryStoreActions.jsx"

import Brewery from "../components/Brewery.jsx";

export class Breweries extends Component {
    static propTypes = {
        breweries: PropTypes.array.isRequired,
        isFetching: PropTypes.bool.isRequired,
        lastUpdated: PropTypes.number,
        dispatch: PropTypes.func.isRequired
    }
    
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(fetchEntriesIfNeeded("dwodemoreact", "breweries"));
    }
    
    getBreweries() {
        const { breweries } = this.props;
        return breweries.map(
                (brewery) => <Brewery brewery={brewery.value} key={brewery.unid}/>
        );
    }
    
    render() {
        const { breweries, isFetching, lastUpdated } = this.props;
        const isEmpty = breweries.length === 0;
        
        return (
          <div>
            <div class="row">{this.getBreweries()}</div>
          </div>
        );
  }
}

const mapStateToProps = state => {
    const { entries } = state;
    
    const {
        isFetching,
        lastUpdated,
        items: breweries
    } = entries["dwodemoreact"+"breweries"] || {
        isFetching: true,
        items: []
    }
    
    return {
        breweries,
        isFetching,
        lastUpdated
    }
}

export default connect(mapStateToProps)(Breweries)