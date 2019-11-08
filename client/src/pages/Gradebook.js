import React, { Component } from "react";
import { Link } from "react-router-dom";
import SideNav from "../components/SideNav";
import { Row, Col, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from "reactstrap";
import { connect } from "react-redux";
import axios from "axios"
import FormA from '../components/FormA'

class Gradebook extends Component {
  constructor(props) {
    super(props)
    this.state = {
      moduleScores: []
    }
  }
  componentDidMount() {
    if (this.props.user.username.substring(0, 1) === 'E') {
      axios.post('/course/gradebook', {
        module_code: this.props.module_code,
        suname: this.props.user.username
      })
        .then(res => {
          this.setState({ moduleScores: res.data })
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      axios.post('/course/assessment/scores', {
        module_code: this.props.module_code,
        title: this.props.assessment_title
      })
        .then(res => {
          this.setState({ moduleScores: res.data })
        })
        .catch(err => {
          console.log(err)
        })
    }
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
              <Col sm={{ size: 4, order: 1 }}>
                <h1>{this.props.module_code} Gradebook</h1>
              </Col>
              <Col style={{
                display:
                  this.props.user.username.substring(0, 1) === "A"
                    ? "block"
                    : "none"
              }} className='mt-2' sm={{ size: 3, order: 1 }}>
                <FormA firstPostRoute='/course/gradebook/add' data={{ "module_code": this.props.module_code, 'assessment_title': this.props.assessment_title }} buttonLabel='Enter Student Grade' formHeader='Enter Student Grade' firstField='Student Number' secondField='Grade' action='Enter' />
              </Col>
            </Row>
            <ListGroup className="mr-5">
              {this.state.moduleScores.map(scores => (
                <ListGroupItem>
                  <Row>
                    <Col>
                      <ListGroupItemHeading>{scores.title}</ListGroupItemHeading>
                      <ListGroupItemText style={{
                        display:
                          this.props.user.username.substring(0, 1) === "E"
                            ? "block"
                            : "none"
                      }} className='mb-0'>Marks for {scores.title.toLowerCase()}</ListGroupItemText>
                      <ListGroupItemText style={{
                        display:
                          this.props.user.username.substring(0, 1) === "A"
                            ? "block"
                            : "none"
                      }} className='mb-0'>Marks for {scores.name} ({scores.suname}) </ListGroupItemText>
                    </Col>
                    <Col>
                      <ListGroupItemText>{scores.score}/{scores.max_mark}</ListGroupItemText>
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

export default connect(mapStateToProps)(Gradebook);
