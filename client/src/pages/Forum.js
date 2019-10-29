import React, { Component } from "react";
import { Link } from "react-router-dom";

class Forum extends Component {
  render() {
    return <div>Forum page for mod: {this.props.moduleCode}</div>;
  }
}

export default Forum;
