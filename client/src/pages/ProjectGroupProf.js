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
import FormA from '../components/FormA'

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
              <Col sm={{ size: 5 }}>
                <h1>{this.props.module_code} Project Groups</h1>
              </Col>
              <Col className='mt-2'>
                <FormA
                  firstPostRoute="/course/group/project/add"
                  buttonLabel="Add Student"
                  formHeader="Add Student to a Project Group"
                  firstField="Student Number"
                  secondField="Project Group"
                  action="Add"
                  data={{ module_code: this.props.module_code }}
                />
              </Col>
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
