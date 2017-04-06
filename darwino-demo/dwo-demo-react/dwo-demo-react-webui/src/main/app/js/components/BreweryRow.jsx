import React from "react";
import { Link } from "react-router";

export default class BreweryRow extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object
  }

  render() {
    const brewery = this.props.brewery;
    return (
    	<tr>
        <td><Link to={'/breweries/'+brewery.id}>{brewery.title}</Link></td>
	    	<td>{brewery.address}</td>
	    	<td>{brewery._tags}</td>
    	</tr>
    );
  }
}