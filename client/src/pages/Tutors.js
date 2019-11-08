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
import FormA from '../components/FormA'

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
            <Row className="mt-5">
              <Col>
                <h1>{this.props.module_code} Tutors</h1>
              </Col>
              <Col>
                <FormA firstPostRoute='/course/tutors/add' buttonLabel='Add Tutor' formHeader='Add new Tutor' firstField='Tutor Student Number' secondField='Tutorial Group Number' action='Add' data={{ 'module_code': this.props.module_code }} />
              </Col>
            </Row>
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

const mapStateToProps = state => ({
  user: state.user
})

export default connect(mapStateToProps)(Tutors);
