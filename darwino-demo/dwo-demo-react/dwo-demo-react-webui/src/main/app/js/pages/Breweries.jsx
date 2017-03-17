import React from "react";

import Brewery from "../components/Brewery.jsx";

export default class Breweries extends React.Component {
    constructor() {
        super();
        
        this.state = {
            breweries: []
        };
        
        // Fetch the breweries
        $.ajax({
            url: "$darwino-jstore/databases/dwodemoreact/stores/breweries/entries",
            dataType: 'json',
            success: function(breweries) {
                this.setState({breweries: breweries})
            }.bind(this)
        })
    }
    
    getBreweries() {
        return this.state.breweries.map(
                (brewery) => <Brewery brewery={brewery.value} key={brewery.unid}/>
        );
    }
    
    render() {
        return (
          <div>
            <div class="row">{this.getBreweries()}</div>
          </div>
        );
  }
}