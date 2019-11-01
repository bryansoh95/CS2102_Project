import React, { Component } from "react";
import { Link } from "react-router-dom";
import ModuleListingContainer from "../components/ModuleListingContainer";
import AnnouncementListingContainer from "../components/AnnouncementListingContainer";
import { Container, Row, Col, Button } from "reactstrap";

class Landing extends Component {
  render() {
    return (
      <div>
        <Row className="pt-5">
          <Col sm={{ offset: 1 }}>
            <h2>Welcome, yogaman</h2>
          </Col>
          <Col sm={{ size: 5, order: 2 }}>
            <Button color="info">Request Module</Button>
          </Col>
        </Row>
        <Row className="pt-3">
          <Col sm={{ size: 5, order: 2, offset: 1 }}>
            <h2>Your Modules</h2>
            <ModuleListingContainer />
            <Link to="/modules/past">View your past modules</Link>
          </Col>
          <Col sm={{ size: 5, order: 2 }}>
            <h2>Announcements</h2>
            <AnnouncementListingContainer />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Landing;
