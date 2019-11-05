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

class Tutors extends Component {
  constructor(props) {
    super(props);
    this.state = { tutors: [] };
  }

  componentDidMount() {
    axios
      .post("/course/tutors", { module_code: this.props.module_code })
      .then(res => this.setState({ tutors: res.data }))
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
            <h1 className="mt-5">{this.props.module_code} Tutors</h1>
            <ListGroup className="mr-5">
              {this.state.tutors.map(tutor => (
                <ListGroupItem>
                  <Row>
                    <Col>
                      <ListGroupItemHeading>{tutor.name}</ListGroupItemHeading>
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

export default Tutors;
