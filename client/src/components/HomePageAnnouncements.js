import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText
} from "reactstrap";
import axios from "axios";
import { connect } from "react-redux";

class HomePageAnnouncements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latestModuleAnnouncements: []
    };
  }
  componentDidMount() {
    axios
      .post("/course/student", {
        username: this.props.user.username
      })
      .then(res => {
        this.setState({ latestModuleAnnouncements: res.data });
      })
      .catch(err => console.log(err));
  }
  render() {
    return (
      <ListGroup>
        {this.state.latestModuleAnnouncements.map(announcement => (
          <ListGroupItem style={{ background: "WhiteSmoke" }}>
            <ListGroupItemHeading>
              {announcement.module_code} : {announcement.title}
              <hr />
            </ListGroupItemHeading>
            <ListGroupItemText>{announcement.content}</ListGroupItemText>
            <ListGroupItemText>
              {announcement.timestamp} | {announcement.name}
            </ListGroupItemText>
          </ListGroupItem>
        ))}
      </ListGroup>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(HomePageAnnouncements);
