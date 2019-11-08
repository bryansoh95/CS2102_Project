import React, { Component } from "react";
import { Link } from "react-router-dom";
import SideNav from "../components/SideNav";
import {
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  Button
} from "reactstrap";
import { connect } from "react-redux";
import axios from "axios";

class ProjectGroupProf extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moduleProjectGroups: []
    };
  }
  componentDidMount() {
    axios
      .get("/course/project/groups")
      .then(res => {
        this.setState({ moduleProjectGroups: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <div>
        <Row>
          <Col xs="3">
            <SideNav module_code={this.props.module_code} />
          </Col>
          <Col>
            <Row className="mt-5">
              <h1>{this.props.module_code} Project Groups</h1>
            </Row>
            <ListGroup className="mr-5">
              {this.state.moduleProjectGroups.map((groups, index) => (
                <ListGroupItem>
                  <Row>
                    <Col>
                      <Link
                        to=
                        {{
                          pathname: "/modules/" +
                            this.props.module_code +
                            "/group/project/student",
                          state: {
                            project_group: groups.project_group
                          }
                        }}
                      >
                        <ListGroupItemHeading>
                          Project Group: {groups.project_group}
                        </ListGroupItemHeading>
                      </Link>
                    </Col>
                  </Row>
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(ProjectGroupProf);
