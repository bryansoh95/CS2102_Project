import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { SSL_OP_TLS_ROLLBACK_BUG } from "constants";

class NavigationBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Navbar style={{ background: "rgb(2, 122, 197)" }} light expand="md">
          <NavbarBrand style={{ color: "white" }} href="/home">
            Luminus2.0
          </NavbarBrand>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink style={{ color: "white" }} href="/components/">
                NavItem1
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                style={{ color: "white" }}
                href="https://github.com/bryansoh95/CS2102_Project"
              >
                GitHub
              </NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle style={{ color: "white" }} nav caret>
                Logout
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>Option 1</DropdownItem>
                <DropdownItem>Option 2</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>Reset</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Navbar>
      </div>
    );
  }
}

export default NavigationBar;
