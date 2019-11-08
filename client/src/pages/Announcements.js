import React, { Component } from "react";
import { Link } from "react-router-dom";
import SideNav from "../components/SideNav";
import {
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText
} from "reactstrap";
import axios from "axios";
import FormA from "../components/FormA";
import { connect } from "react-redux";

class Announcements extends Component {
  constructor(props) {
    super(props);
    this.state = { moduleAnnouncements: [] };
  }

  componentDidMount() {
    console.log(this);
    axios
      .post("/course/announcements", {
        module_code: this.props.module_code
      })
      .then(res => {
        console.log(res.data);
        this.setState({ moduleAnnouncements: res.data });
      })
      .catch(err => console.log(err));
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
              <Col sm={{ size: 5, order: 1 }}>
                <h1>{this.props.module_code} Announcements</h1>
              </Col>
              <Col
                style={{
                  display:
                    this.props.user.username.substring(0, 1) === "A"
                      ? "block"
                      : "none"
                }}
                sm={{ size: 4, order: 1 }}
                className="mt-2"
              >
                <FormA
                  firstPostRoute="/course/announcements/new"
                  buttonLabel="Add new Announcement"
                  formHeader="Add new Announcement"
                  firstField="Announcement Title"
                  secondField="Announcement Details"
                  action="Post"
                  data={{ module_code: this.props.module_code }}
                />
              </Col>
            </Row>
            <ListGroup>
              {this.state.moduleAnnouncements.map(announcement => (
                <ListGroupItem>
                  <Row>
                    <Col>
                      <ListGroupItemHeading>
                        {announcement.title}
                        <hr />
                      </ListGroupItemHeading>
                      <ListGroupItemText>
                        {announcement.content}
                      </ListGroupItemText>
                      <ListGroupItemText>
                        {announcement.timestamp} | {announcement.name}
                      </ListGroupItemText>
                    </Col>
                    <Col></Col>
                    <Col></Col>
                    <Col></Col>
                    <Col>
                      <FormA
                        firstPostRoute="/course/announcements/edit"
                        buttonLabel="EDIT"
                        formHeader="Edit Announcement"
                        firstField="Announcement Title"
                        secondField="Announcement Details"
                        action="Post"
                        data={{
                          module_code: this.props.module_code,
                          old_title: announcement.title
                        }}
                      />
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

export default connect(mapStateToProps)(Announcements);
