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
import { connect } from "react-redux";

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
    axios
      .post("/course/add", {
        suname: this.state.moduleRequests[index].suname,
        module_code: this.props.module_code,
        puname: this.props.user.username
      })
      .catch(err => {
        console.log(err);
      });
    console.log(this.state.moduleRequests[index].suname);
    window.location.reload();
  };

  handleReject = index => {
    axios
      .post("/course/request/delete", {
        suname: this.state.moduleRequests[index].suname,
        module_code: this.props.module_code
      })
      .catch(err => {
        console.log(err);
      });
    console.log(this.state.moduleRequests[index].suname);
    window.location.reload();
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
                <h1>{this.props.module_code} Requests</h1>
              </Col>
            </Row>
            <ListGroup className="mr-5">
              {this.state.moduleRequests.map((request, index) => (
                <ListGroupItem style={{ background: "WhiteSmoke" }}>
                  <Row>
                    <Col xs="6">
                      <ListGroupItemHeading>
                        {request.name} ({request.suname})
                      </ListGroupItemHeading>
                      <ListGroupItemText>
                        Requested on: {request.timestamp}
                      </ListGroupItemText>
                    </Col>
                    <Col xs="6" className="text-right mt-2">
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

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(ModuleRequests);
