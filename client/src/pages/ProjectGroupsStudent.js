import React, { Component } from "react";
import { Link } from "react-router-dom";
import SideNav from "../components/SideNav";
import {
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  Button
} from "reactstrap";
import axios from "axios";
import { connect } from "react-redux";

class ProjectGroupsStudent extends Component {
  constructor(props) {
    super(props);
    this.state = { moduleProjectGroupStudents: [], projectGroup: "" };
  }

  handleDelete = index => {
    axios
      .post("/course/group/project/delete", {
        module_code: this.props.module_code,
        suname: this.state.moduleProjectGroupStudents[index].suname
      })
      .then(res => {
        alert("delete success!");
        window.location.reload();
      })
      .catch(err => {
        console.log(err);
      });
  };

  componentDidMount() {
    if (this.props.location.state) {
      this.state.projectGroup = this.props.location.state.project_group;
      axios // get all students in this project group
        .post("/course/group/project/allStudents", {
          module_code: this.props.module_code,
          project_group: this.state.projectGroup
        })
        .then(res => this.setState({ moduleProjectGroupStudents: res.data }))
        .catch(err => console.log(err));
    } else {
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
            .then(res =>
              this.setState({ moduleProjectGroupStudents: res.data })
            )
            .catch(err => console.log(err))
        )
        .catch(err => console.log(err));
    }
  }

  render() {
    return (
      <div>
        <Row>
          <Col xs="3">
            <SideNav module_code={this.props.module_code} />
          </Col>
          <Col className="mt-5">
            <h1>
              {this.props.module_code} Project Group {this.state.projectGroup}
            </h1>
            <div
              style={{
                display: this.state.projectGroup ? "none" : "block"
              }}
              className="ml-1 mt-3"
            >
              You have yet to be assigned to any project group for this module.
            </div>
            <ListGroup className="mr-5">
              {this.state.moduleProjectGroupStudents.map((student, index) => (
                <ListGroupItem style={{ background: "WhiteSmoke" }}>
                  <Row>
                    <i className="small material-icons">account_circle</i>
                    <Col>
                      <ListGroupItemHeading>
                        {student.name}
                      </ListGroupItemHeading>
                    </Col>
                    <Button
                      style={{
                        display:
                          this.props.user.username.substring(0, 1) === "A"
                            ? "block"
                            : "none"
                      }}
                      color="danger"
                      className="mr-3 mt-1"
                      onClick={() => this.handleDelete(index)}
                    >
                      Delete
                    </Button>
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
