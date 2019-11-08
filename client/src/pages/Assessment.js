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
import { connect } from "react-redux";
import axios from "axios";
import FormA from "../components/FormA";

class Assessment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moduleAssessments: []
    };
  }
  componentDidMount() {
    axios
      .post("/course/assessment", {
        module_code: this.props.module_code
      })
      .then(res => {
        this.setState({ moduleAssessments: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  }

  handleClick = index => {
    axios
      .post("/course/assessment/delete", {
        module_code: this.props.module_code,
        title: this.state.moduleAssessments[index].title,
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
                <h1>{this.props.module_code} Assessment</h1>
              </Col>
              <Col className="mt-2" sm={{ size: 3, order: 2 }}>
                <FormA
                  firstPostRoute="/course/assessment/add"
                  data={{ module_code: this.props.module_code }}
                  buttonLabel="Create Assessment"
                  formHeader="Create Assessment"
                  firstField="Assessment Title"
                  secondField="Max Marks"
                  action="Create"
                />
              </Col>
            </Row>
            <ListGroup className="mr-5">
              {this.state.moduleAssessments.map((assessment, index) => (
                <ListGroupItem>
                  <Row>
                    <Col>
                      <Link
                        to={
                          "/modules/" +
                          this.props.module_code +
                          "/assessment/" +
                          assessment.title
                        }
                      >
                        <ListGroupItemHeading>
                          {assessment.title}
                        </ListGroupItemHeading>
                      </Link>
                    </Col>

                    <Button
                      color="danger"
                      className="mr-3 mt-1"
                      onClick={() => this.handleClick(index)}
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

export default connect(mapStateToProps)(Assessment);
