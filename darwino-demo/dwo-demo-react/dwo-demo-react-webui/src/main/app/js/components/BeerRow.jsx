import React from "react";

export default class BeerRow extends React.Component {
  render() {
    const beer = this.props.beer;

    return (
    	<tr>
	    	<td>{beer.title}</td>
	    	<td>{beer._tags}</td>
    	</tr>
    );
  }
}