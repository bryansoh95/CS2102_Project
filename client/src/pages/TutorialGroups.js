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

class TutorialGroups extends Component {
  constructor(props) {
    super(props);
    this.state = { moduleTutorialGroupStudents: [], tutorialGroup: "" };
  }

  componentDidMount() {
    axios // find student's tutorial group for this mod
      .post("/course/group/student", {
        module_code: this.props.module_code,
        username: this.props.user.username
      })
      .then(res => this.setState({ tutorialGroup: res.data[0].tutorial_group }))
      .then(res =>
        axios // get all students in this tutorial group
          .post("/course/group/allStudents", {
            module_code: this.props.module_code,
            tutorial_group: this.state.tutorialGroup
          })
          .then(res => this.setState({ moduleTutorialGroupStudents: res.data }))
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
              {this.props.module_code} Tutorial Group {this.state.tutorialGroup}
            </h1>
            <ListGroup className="mr-5">
              {this.state.moduleTutorialGroupStudents.map(student => (
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

export default connect(mapStateToProps)(TutorialGroups);
