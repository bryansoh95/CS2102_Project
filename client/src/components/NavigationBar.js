import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from "reactstrap";
import { SSL_OP_TLS_ROLLBACK_BUG } from "constants";
import { connect } from "react-redux";
import { logout } from "../actions/authActions";

class NavigationBar extends Component {
  constructor(props) {
    super(props);
  }

  doLogout = () => {
    this.props.logout();
    this.props.history.push("/");
  };

  render() {
    return (
      <div>
        <Navbar
          fixed="top"
          style={{ background: "rgb(2, 122, 197)" }}
          light
          expand="md"
        >
          <i className="material-icons">bubble_chart</i>
          <NavbarBrand href="/home">
            <span style={{ color: "white" }}>Luminus</span>
            <span style={{ color: "orange" }}>Alpha</span>
          </NavbarBrand>
          <Nav className="ml-auto" navbar>
            <NavItem className="mt-2">
              <Link style={{ color: "white" }} to="/findMyBuddy">
                FindMyBuddy
              </Link>
            </NavItem>
            <NavItem>
              <NavLink
                className="mr-2"
                style={{ color: "white" }}
                href="https://github.com/bryansoh95/CS2102_Project"
              >
                GitHub
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink style={{ color: "white" }} onClick={this.doLogout}>
                Logout
              </NavLink>
            </NavItem>
          </Nav>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default withRouter(
  connect(
    mapStateToProps,
    { logout }
  )(NavigationBar)
);
