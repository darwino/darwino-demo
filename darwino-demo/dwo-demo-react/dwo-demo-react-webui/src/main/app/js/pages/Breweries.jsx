import React, { Component, PropTypes } from "react";
import { connect } from 'react-redux'
import { fetchEntriesIfNeeded, darwinoToStoreKey } from "../actions/darwinoEntryStoreActions.jsx"

import BreweryRow from "../components/BreweryRow.jsx";

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
                (brewery) => <BreweryRow brewery={brewery.value} key={brewery.unid}/>
        );
    }
    
    render() {
        const { breweries, isFetching, lastUpdated } = this.props;
        const isEmpty = breweries.length === 0;
        
        return (
          <div>
            <table class="table table-striped table-bordered table-condensed">
                <thead>
                    <tr>
                        <th>Brewey</th>
                        <th>Address</th>
                        <th>Tags</th>
                    </tr>
                </thead>
                <tbody>
                    {this.getBreweries()}
                </tbody>
            </table>
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
    } = entries[darwinoToStoreKey("dwodemoreact", "breweries")] || {
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