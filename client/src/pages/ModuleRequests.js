import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  Button
} from "reactstrap";
import axios from "axios";
import SideNav from "../components/SideNav";

class ModuleRequests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moduleRequests: []
    };
  }
  componentDidMount() {
    axios
      .post("/course/requests", {
        module_code: this.props.module_code
      })
      .then(res => {
        this.setState({ moduleRequests: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  }

  handleAccept = index => {
    console.log(this.state.moduleRequests[index].suname);
  };

  handleReject = index => {
    console.log(this.state.moduleRequests[index].suname);
  };

  render() {
    return (
      <div>
        <Row>
          <Col xs="3">
            <SideNav module_code={this.props.module_code} />
          </Col>
          <Col>
            <h1 className="mt-5">{this.props.module_code} Requests</h1>
            <ListGroup className="mr-5">
              {this.state.moduleRequests.map((request, index) => (
                <ListGroupItem style={{ background: "WhiteSmoke" }}>
                  <Row>
                    <Col>
                      <ListGroupItemHeading>
                        {request.name} ({request.suname})
                      </ListGroupItemHeading>
                      <ListGroupItemText>
                        Requested on: {request.timestamp}
                      </ListGroupItemText>
                    </Col>
                    <Col></Col>
                    <Col></Col>
                    <Col></Col>
                    <Col className="mt-4">
                      <Button
                        color="success"
                        onClick={() => this.handleAccept(index)}
                      >
                        Accept
                      </Button>{" "}
                      <Button
                        color="danger"
                        onClick={() => this.handleReject(index)}
                      >
                        Reject
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

export default ModuleRequests;
