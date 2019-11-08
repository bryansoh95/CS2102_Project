import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Nav, NavItem, NavLink } from "reactstrap";
import { connect } from "react-redux";

class SideNav extends Component {
  constructor(props) {
    super(props);
  }
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
        <hr />
        <Nav vertical>
          <NavItem className="mt-2 ml-5">
            <NavLink style={{ fontSize: 24 }}>
              <Link
                to={"/modules/" + this.props.module_code + "/announcements"}
              >
                Announcements
              </Link>
            </NavLink>
          </NavItem>
          <NavItem className="mt-2 ml-5">
            <NavLink style={{ fontSize: 24 }}>
              <Link to={"/modules/" + this.props.module_code + "/forum"}>
                Forum
              </Link>
            </NavLink>
          </NavItem>
          <NavItem style={{
            display:
              this.props.user.username.substring(0, 1) === "A"
                ? "block"
                : "none"
          }} className="mt-2 ml-5">
            <NavLink style={{ fontSize: 24 }}>
              <Link to={"/modules/" + this.props.module_code + "/assessment"}>
                Assessment
              </Link>
            </NavLink>
          </NavItem>
          <NavItem style={{
            display:
              this.props.user.username.substring(0, 1) === "E"
                ? "block"
                : "none"
          }} className="mt-2 ml-5">
            <NavLink style={{ fontSize: 24 }}>
              <Link to={"/modules/" + this.props.module_code + "/gradebook"}>
                Gradebook
              </Link>
            </NavLink>
          </NavItem>
          <NavItem className="mt-2 ml-5">
            <NavLink style={{ fontSize: 24 }}>
              <Link to={"/modules/" + this.props.module_code + "/tutors"}>
                Tutors
              </Link>
            </NavLink>
          </NavItem>
          <NavItem
            className="mt-2 ml-5"
            style={{
              display:
                this.props.user.username.substring(0, 1) === "A"
                  ? "block"
                  : "none"
            }}
          >
            <NavLink style={{ fontSize: 24 }}>
              <Link to={"/modules/" + this.props.module_code + "/requests"}>
                Module Requests
              </Link>
            </NavLink>
          </NavItem>
          <NavItem className="mt-2 ml-5 mb-3">
            <NavLink style={{ fontSize: 24 }}>
              <Link
                to={"/modules/" + this.props.module_code + "/group/student"}
              >
                Tutorial Groups
              </Link>
            </NavLink>
          </NavItem>
        </Nav>
        <hr />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(SideNav);
