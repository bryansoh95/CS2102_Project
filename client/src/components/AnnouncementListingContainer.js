import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ListGroup, ListGroupItem } from "reactstrap";
import axios from "axios";
import { connect } from "react-redux";

class AnnouncementListingContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentModuleAnnouncements: []
    };
  }
  componentDidMount() {
    axios
      .post("/course/student", {
        username: this.props.user.username
      })
      .then(res => {
        this.setState({ studentModuleAnnouncements: res.data });
      })
      .catch(err => console.log(err));
  }
  render() {
    return (
      <ListGroup>
        {this.state.studentModuleAnnouncements.map(announcement => (
          <ListGroupItem>{announcement.content}</ListGroupItem>
        ))}
      </ListGroup>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(AnnouncementListingContainer);
