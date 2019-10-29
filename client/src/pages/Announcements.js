import React, { Component } from "react";
import { Link } from "react-router-dom";

class Announcements extends Component {
  render() {
    return <div>Announcements page for mod: {this.props.moduleCode}</div>;
  }
}

export default Announcements;
