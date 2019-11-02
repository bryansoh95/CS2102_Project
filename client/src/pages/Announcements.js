import React, { Component } from "react";
import { Link } from "react-router-dom";
import SideNav from "../components/SideNav";
import { Row, Col } from "reactstrap";

class Announcements extends Component {
  render() {
    return (
      <div>
        <Row>
          <Col xs="3">
            <SideNav />
          </Col>
          <Col>
            <h1 className="mt-5">moduleCode Announcements</h1>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Announcements;
