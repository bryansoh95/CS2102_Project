import React, { Component } from "react";
import { Link } from "react-router-dom";
import SideNav from "../components/SideNav";
import { Row, Col } from "reactstrap";

class Gradebook extends Component {
  render() {
    return (
      <div>
        <Row>
          <Col xs="3">
            <SideNav module_code={this.props.module_code} />
          </Col>
          <Col>
            <h1 className="mt-5">moduleCode Gradebook</h1>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Gradebook;
