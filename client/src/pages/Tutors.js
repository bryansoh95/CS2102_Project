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
import FormA from "../components/FormA";

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

  handleDelete = index => {
    axios
      .post("/course/tutors/delete", {
        suname: this.state.tutors[index].suname,
        module_code: this.props.module_code
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
              <Col sm={{ size: 3, order: 1 }}>
                <h1>{this.props.module_code} Tutors</h1>
              </Col>
              <Col
                style={{
                  display:
                    this.props.user.username.substring(0, 1) === "A"
                      ? "block"
                      : "none"
                }}
                className="mt-2"
                sm={{ size: 8, order: 2 }}
              >
                <FormA
                  firstPostRoute="/course/tutors/add"
                  buttonLabel="Add Tutor"
                  formHeader="Add new Tutor"
                  firstField="Tutor Student Number"
                  secondField="Tutorial Group Number"
                  action="Add"
                  data={{ module_code: this.props.module_code }}
                />
              </Col>
            </Row>
            <ListGroup className="mr-5">
              {this.state.tutors.map((tutor, index) => (
                <ListGroupItem style={{ background: "WhiteSmoke" }}>
                  <Row>
                    <Col>
                      <ListGroupItemHeading>
                        Tutorial Group {tutor.tutorial_group}: {tutor.name}
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
                    </Button>{" "}
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

export default connect(mapStateToProps)(Tutors);
