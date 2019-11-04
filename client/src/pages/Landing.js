import React, { Component } from "react";
import { Link } from "react-router-dom";
import ModuleListingContainer from "../components/ModuleListingContainer";
import HomePageAnnouncements from "../components/HomePageAnnouncements";
import { Container, Row, Col, Button } from "reactstrap";
import { connect } from "react-redux";

class Landing extends Component {
  render() {
    return (
      <div>
        <Row className="pt-5">
          <Col sm={{ offset: 1 }}>
            <h2>Welcome, {this.props.user.name}</h2>
          </Col>
          <Col sm={{ size: 5, order: 2 }}>
            <Button color="info">Request Module (if stud)</Button>
            <var> </var>
            <Button color="info">View Module Requests</Button>
          </Col>
          <Col sm={{ size: 5, order: 2 }}></Col>
        </Row>
        <Row className="pt-3">
          <Col sm={{ size: 5, order: 2, offset: 1 }}>
            <h2>Your Modules</h2>
            <ModuleListingContainer />
            <Link to="/modules/past">View your past modules</Link>
          </Col>
          <Col sm={{ size: 5, order: 2 }}>
            <h2>Announcements</h2>
            <HomePageAnnouncements />
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(Landing);
