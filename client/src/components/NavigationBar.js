import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
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
  }

  render() {
    return (
      <div>
        <Navbar style={{ background: "rgb(2, 122, 197)" }} light expand="md">
          <NavbarBrand style={{ color: "white" }} href="/home">
            LuminusAlpha
          </NavbarBrand>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink
                style={{ color: "white" }}
                href="https://github.com/bryansoh95/CS2102_Project"
              >
                GitHub
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                style={{ color: "white" }}
                onClick={this.doLogout}
              >
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

export default withRouter(connect(
  mapStateToProps, 
  { logout }
)(NavigationBar));
