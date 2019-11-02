import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ListGroup, ListGroupItem } from "reactstrap";
import axios from "axios";
import { connect } from "react-redux";
class ModuleListingContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentModules: []
    };
  }
  componentDidMount() {
    axios
      .post("/course", {
        username: this.props.user.username
      })
      .then(res => {
        this.setState({ studentModules: res.data });
      })
      .catch(err => console.log(err));
  }
  render() {
    return (
      <ListGroup>
        {this.state.studentModules.map(module => (
          <Link to={"/modules/" + module.module_code + "/announcements"}>
            <ListGroupItem action tag="button">
              {module.module_code}, {module.name}
            </ListGroupItem>
          </Link>
        ))}
      </ListGroup>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(ModuleListingContainer);
