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

class TutorialGroupsStudent extends Component {
  constructor(props) {
    super(props);
    this.state = { moduleTutorialGroupStudents: [], tutorialGroup: "" };
  }

  componentDidMount() {
    if (this.props.location.state) {
      this.state.tutorialGroup = this.props.location.state.tutorial_group;
      axios // get all students in this tutorial group
        .post("/course/group/tutorial/allStudents", {
          module_code: this.props.module_code,
          tutorial_group: this.props.location.state.tutorial_group
        })
        .then(res => this.setState({ moduleTutorialGroupStudents: res.data }))
        .catch(err => console.log(err));
    } else {
      axios // find student's tutorial group for this mod
        .post("/course/group/tutorial/student", {
          module_code: this.props.module_code,
          username: this.props.user.username
        })
        .then(res =>
          this.setState({ tutorialGroup: res.data[0].tutorial_group })
        )
        .then(res =>
          axios // get all students in this tutorial group
            .post("/course/group/tutorial/allStudents", {
              module_code: this.props.module_code,
              tutorial_group: this.state.tutorialGroup
            })
            .then(res =>
              this.setState({ moduleTutorialGroupStudents: res.data })
            )
            .catch(err => console.log(err))
        )
        .catch(err => console.log(err));
    }
  }

  handleDelete = index => {
    axios
      .post("/course/group/tutorial/delete", {
        module_code: this.props.module_code,
        suname: this.state.moduleTutorialGroupStudents[index].suname
      })
      .then(res => {
        alert("delete success");
        window.location.reload();
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <div>
        <Row>
          <Col xs="3">
            <SideNav module_code={this.props.module_code} />
          </Col>
          <Col className="mt-5">
            <h1>
              {this.props.module_code} Tutorial Group {this.state.tutorialGroup}
            </h1>
            <div
              style={{
                display: this.state.tutorialGroup ? "none" : "block"
              }}
              className="ml-1 mt-3"
            >
              You have yet to be assigned to any tutorial group for this module.
            </div>
            <ListGroup className="mr-5">
              {this.state.moduleTutorialGroupStudents.map((student, index) => (
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

export default connect(mapStateToProps)(TutorialGroupsStudent);
