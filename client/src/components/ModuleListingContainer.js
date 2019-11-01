import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ListGroup, ListGroupItem } from "reactstrap";
import axios from "axios";

class ModuleListingContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentModules: ["cs2102", "cs1101", "is1103", "cs2030", "is2102"]
    };
  }
  render() {
    return (
      <ListGroup>
        {this.state.studentModules.map(module => (
          <ListGroupItem action tag="button">
            {module}
          </ListGroupItem>
        ))}
      </ListGroup>
    );
  }
}

export default ModuleListingContainer;
