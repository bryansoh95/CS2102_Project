import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ListGroup, ListGroupItem } from "reactstrap";
import axios from "axios";

class AnnouncementListingContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentModuleAnnouncements: [
        "cs2102 announcement lorem ipsum",
        "cs1101 announcement",
        "is1103 announcement",
        "cs2030 announcement",
        "is2102 announcement"
      ]
    };
  }
  render() {
    return (
      <ListGroup>
        {this.state.studentModuleAnnouncements.map(module => (
          <ListGroupItem>{module}</ListGroupItem>
        ))}
      </ListGroup>
    );
  }
}

export default AnnouncementListingContainer;
