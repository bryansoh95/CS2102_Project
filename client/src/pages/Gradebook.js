import React, { Component } from "react";
import { Link } from "react-router-dom";

class Gradebook extends Component {
  render() {
    return (
      <div>
        Gradebook page for mod: {this.props.moduleCode} for{" "}
        {this.props.username}
      </div>
    );
  }
}

export default Gradebook;
