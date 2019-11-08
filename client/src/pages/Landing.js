import React, { Component } from "react";
import { Link } from "react-router-dom";
import ModuleListingContainer from "../components/ModuleListingContainer";
import HomePageAnnouncements from "../components/HomePageAnnouncements";
import RequestCollapseForm from "../components/RequestCollapseForm";
import { Container, Row, Col, Button } from "reactstrap";
import { connect } from "react-redux";

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showComponent: false
    };
    // this._onButtonClick = this._onButtonClick.bind(this);
  }

  // _onButtonClick() {
  //   this.setState({
  //     showComponent: true
  //   });
  // }

  render() {
    return (
      <div>
        <Row className="pt-5">
          <Col sm={{ offset: 1 }}>
            <h2>Welcome, {this.props.user.name}</h2>
          </Col>
          <Col sm={{ size: 5, order: 2 }}>
            {/* {this.state.showComponent ? <CollapseForm /> : null} */}
            <RequestCollapseForm />
          </Col>
        </Row>
        <Row className="pt-3">
          <Col sm={{ size: 5, order: 2, offset: 1 }}>
            <h2>Your Modules</h2>
            <ModuleListingContainer />
            <Link style={{
              display:
                this.props.user.username.substring(0, 1) === "E"
                  ? "block"
                  : "none"
            }} to="/modules/past">View your past modules</Link>
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
