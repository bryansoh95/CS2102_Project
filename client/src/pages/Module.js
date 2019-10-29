import React, { Component } from "react";
import { Link } from "react-router-dom";

class Module extends Component {
  render() {
    return <div>Module page for mod: {this.props.moduleCode}</div>;
  }
}

export default Module;
