import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Nav, NavItem, NavLink } from "reactstrap";

class SideNav extends Component {
  render() {
    return (
      <div
        style={{
          background: "WhiteSmoke",
          position: "fixed",
          height: "100vh",
          width: "300px"
        }}
      >
        <Nav vertical>
          <NavItem className="mt-2 ml-5">
            <NavLink style={{ fontSize: 24 }} href="#">
              Announcements
            </NavLink>
          </NavItem>
          <NavItem className="mt-2 ml-5">
            <NavLink style={{ fontSize: 24 }} href="#">
              Forum
            </NavLink>
          </NavItem>

          <NavItem className="mt-2 ml-5">
            <NavLink style={{ fontSize: 24 }} href="#">
              Gradebook
            </NavLink>
          </NavItem>
          <hr />
        </Nav>
        <hr />
      </div>
    );
  }
}

export default SideNav;
