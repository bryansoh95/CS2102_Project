import React, { Component } from "react";
import { Link } from "react-router-dom";
import SideNav from "../components/SideNav";
import { Row, Col, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from "reactstrap";
import { connect } from "react-redux";
import axios from "axios"

class Gradebook extends Component {
  constructor(props) {
    super(props)
    this.state = {
      moduleScores: []
    }
  }
  componentDidMount() {
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
  }
  render() {
    return (
      <div>
        <Row>
          <Col xs="3">
            <SideNav module_code={this.props.module_code} />
          </Col>
          <Col>
            <h1 className="mt-5">{this.props.module_code} Gradebook</h1>
            <ListGroup className="mr-5">
              {this.state.moduleScores.map(scores => (
                <ListGroupItem>
                  <Row>
                    <Col>
                      <ListGroupItemHeading>{scores.title}</ListGroupItemHeading>
                      <ListGroupItemText className='mb-0'>Marks for {scores.title.toLowerCase()}</ListGroupItemText>
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
