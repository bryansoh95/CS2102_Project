import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Button,
  CardTitle,
  CardText,
  Row,
  Col,
  Container
} from "reactstrap";

class PastModules extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentModules: ["cs2102", "cs1101", "is1103", "cs2030", "is2102"]
    };
  }

  render() {
    return (
      <div>
        <h1 className="mr-5 ml-5 mt-3">Past modules</h1>
        <Row className="mr-5 ml-5 mt-3">
          {this.state.studentModules.map(module => (
            <Col sm="4">
              <Card body>
                <CardTitle>Module code</CardTitle>
                <CardText>Module name</CardText>
                <CardText>AY_Semester</CardText>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }
}

{
  /* <div>Past modules page for: {this.props.username}</div>; */
}

export default PastModules;
