import React, { Component } from "react";
import { Link } from "react-router-dom";
import SideNav from "../components/SideNav";
import {
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading
} from "reactstrap";
import { connect } from "react-redux";

class Groups extends Component {
  render() {
    return (
      <div>
        <Row>
          <Col xs="3">
            <SideNav module_code={this.props.module_code} />
          </Col>
          <Col>
            <Row className="mt-5">
              <Col sm={{ size: 5, order: 1 }}>
                <h1>{this.props.module_code} Groups</h1>
              </Col>
            </Row>
            <ListGroup className="mr-5">
              <Link
                to={
                  this.props.user.username.substring(0, 1) === "A"
                    ? "/modules/" +
                      this.props.module_code +
                      "/group/tutorial/prof"
                    : "/modules/" +
                      this.props.module_code +
                      "/group/tutorial/student"
                }
              >
                <ListGroupItem
                  style={{ background: "WhiteSmoke" }}
                  action
                  tag="button"
                >
                  <ListGroupItemHeading>Tutorial Groups</ListGroupItemHeading>
                </ListGroupItem>
              </Link>
              <Link
                to={
                  this.props.user.username.substring(0, 1) === "A"
                    ? "/modules/" +
                      this.props.module_code +
                      "/group/project/prof"
                    : "/modules/" +
                      this.props.module_code +
                      "/group/project/student"
                }
              >
                <ListGroupItem
                  style={{ background: "WhiteSmoke" }}
                  action
                  tag="button"
                >
                  <ListGroupItemHeading>Project Groups</ListGroupItemHeading>
                </ListGroupItem>
              </Link>
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

export default connect(mapStateToProps)(Groups);
