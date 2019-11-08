import React, { Component } from "react";
import { Link } from "react-router-dom";
import SideNav from "../components/SideNav";
import {
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText
} from "reactstrap";
import axios from "axios";
import { connect } from "react-redux";

class ProjectGroupsStudent extends Component {
  constructor(props) {
    super(props);
    this.state = { moduleProjectGroupStudents: [], projectGroup: "" };
  }

  componentDidMount() {
    axios // find student's project group for this mod
      .post("/course/group/project/student", {
        module_code: this.props.module_code,
        username: this.props.user.username
      })
      .then(res => this.setState({ projectGroup: res.data[0].project_group }))
      .then(res =>
        axios // get all students in this project group
          .post("/course/group/project/allStudents", {
            module_code: this.props.module_code,
            project_group: this.state.projectGroup
          })
          .then(res => this.setState({ moduleProjectGroupStudents: res.data }))
          .catch(err => console.log(err))
      )
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
        <Row>
          <Col xs="3">
            <SideNav module_code={this.props.module_code} />
          </Col>
          <Col>
            <h1 className="mt-5">
              {this.props.module_code} Project Group {this.state.projectGroup}
            </h1>
            <p
              style={{
                display: this.state.projectGroup ? "none" : "block"
              }}
              className="ml-1 mt-3"
            >
              You have yet to be assigned to any project group for this module.
            </p>
            <ListGroup className="mr-5">
              {this.state.moduleProjectGroupStudents.map(student => (
                <ListGroupItem>
                  <Row>
                    <i className="small material-icons">account_circle</i>
                    <Col>
                      <ListGroupItemHeading>
                        {student.name}
                      </ListGroupItemHeading>
                    </Col>
                  </Row>
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(ProjectGroupsStudent);
