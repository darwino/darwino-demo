import React from "react";

export default class Brewery extends React.Component {
  render() {
    const brewery = this.props.brewery;

    return (
      <div class="col-md-4">
        <h4>{brewery.title}</h4>
        <address>{brewery.address}</address>
      </div>
    );
  }
}