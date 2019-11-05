import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Button,
  CardBody,
  CardHeader,
  CardText,
  Row,
  Col,
  Container
} from "reactstrap";
import { connect } from "react-redux";
import axios from "axios";

class PastModules extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentModules: []
    };
  }

  componentDidMount() {
    axios.post('/course/passed', {
      suname: this.props.user.username
    })
      .then(res =>
        this.setState({ studentModules: res.data })
      )
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
        <h1 className="mr-5 ml-5 mt-5 pt-5">Past modules</h1>
        <Row className="mr-5 ml-5 mt-3">
          {this.state.studentModules.map(module => (
            <Col sm="4">
              <Card>
                <CardHeader style={{ fontSize: 24 }}>{module.module_code}</CardHeader>
                <CardBody>
                  <CardText style={{ fontSize: 18 }}>{module.name}</CardText>
                  <CardText style={{ fontSize: 18 }}>{module.academic_year}, Semester: {module.semester}</CardText>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </div >
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(PastModules);
