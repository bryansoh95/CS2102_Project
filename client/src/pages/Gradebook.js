import React, { Component } from "react";
import { Link } from "react-router-dom";
import SideNav from "../components/SideNav";
import {
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  Button
} from "reactstrap";
import { connect } from "react-redux";
import axios from "axios";
import FormA from "../components/FormA";
import FormB from "../components/FormB";

class Gradebook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moduleScores: []
    };
  }
  componentDidMount() {
    if (this.props.user.username.substring(0, 1) === "E") {
      axios
        .post("/course/gradebook", {
          module_code: this.props.module_code,
          suname: this.props.user.username
        })
        .then(res => {
          this.setState({ moduleScores: res.data });
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      axios
        .post("/course/assessment/scores", {
          module_code: this.props.module_code,
          title: this.props.assessment_title
        })
        .then(res => {
          this.setState({ moduleScores: res.data });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  handleDelete = index => {
    console.log(this.state.moduleScores[index]);
    axios
      .post("/course/gradebook/delete", {
        module_code: this.state.moduleScores[index].module_code,
        title: this.state.moduleScores[index].title,
        suname: this.state.moduleScores[index].suname,
        puname: this.props.user.username
      })
      .then(res => {
        alert("delete success!");
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
          <Col>
            <Row className="mt-5">
              <Col sm={{ size: 4, order: 1 }}>
                <h1>{this.props.module_code} Gradebook</h1>
              </Col>
              <Col
                style={{
                  display:
                    this.props.user.username.substring(0, 1) === "A"
                      ? "block"
                      : "none"
                }}
                className="mt-2"
                sm={{ size: 3, order: 1 }}
              >
                <FormA
                  firstPostRoute="/course/gradebook/add"
                  data={{
                    module_code: this.props.module_code,
                    assessment_title: this.props.assessment_title
                  }}
                  buttonLabel="Enter Student Grade"
                  formHeader="Enter Student Grade"
                  firstField="Student Number"
                  secondField="Grade"
                  action="Enter"
                />
              </Col>
            </Row>
            <ListGroup className="mr-5">
              {this.state.moduleScores.map((scores, index) => (
                <ListGroupItem>
                  <Row>
                    <Col>
                      <ListGroupItemHeading>
                        {scores.title}
                      </ListGroupItemHeading>
                      <ListGroupItemText
                        style={{
                          display:
                            this.props.user.username.substring(0, 1) === "E"
                              ? "block"
                              : "none"
                        }}
                        className="mb-0"
                      >
                        Marks for {scores.title.toLowerCase()}
                      </ListGroupItemText>
                      <ListGroupItemText
                        style={{
                          display:
                            this.props.user.username.substring(0, 1) === "A"
                              ? "block"
                              : "none"
                        }}
                        className="mb-0"
                      >
                        Marks for {scores.name} ({scores.suname}){" "}
                      </ListGroupItemText>
                    </Col>
                    <Col className="ml-5 mt-1">
                      <ListGroupItemText>
                        {scores.score}/{scores.max_mark}
                      </ListGroupItemText>
                    </Col>
                    <Col
                      style={{
                        display:
                          this.props.user.username.substring(0, 1) === "A"
                            ? "block"
                            : "none"
                      }}
                      xs="text-xs-right"
                      className="ml-5 mt-1"
                    >
                      <FormB
                        postRoute="/course/gradebook/edit"
                        buttonLabel="Update Grade"
                        formHeader="Update Student Grade"
                        field="Grade"
                        action="Update"
                        data={{
                          module_code: scores.module_code,
                          title: scores.title,
                          suname: scores.suname
                        }}
                      />
                    </Col>
                    <Col
                      style={{
                        display:
                          this.props.user.username.substring(0, 1) === "A"
                            ? "block"
                            : "none"
                      }}
                      xs="text-xs-left"
                      className="mt-1 ml-2"
                    >
                      <Button
                        color="danger"
                        onClick={() => this.handleDelete(index)}
                      >
                        Delete
                      </Button>
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
