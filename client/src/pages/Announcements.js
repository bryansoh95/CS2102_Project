import React, { Component } from "react";
import SideNav from "../components/SideNav";
import {
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  Button
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
    axios
      .post("/course/announcements", {
        module_code: this.props.module_code
      })
      .then(res => {
        this.setState({ moduleAnnouncements: res.data });
      })
      .catch(err => console.log(err));
  }

  handleClick = title => {
    axios.post("/course/announcements/delete", {
      module_code: this.props.module_code,
      title: title,
      puname: this.props.user.username
    });
    window.location.reload();
  };

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
            <ListGroup className="mr-5">
              {this.state.moduleAnnouncements.map(announcement => (
                <ListGroupItem style={{ background: "WhiteSmoke" }}>
                  <Row>
                    <Col>
                      <ListGroupItemHeading>
                        {announcement.title}
                        <hr />
                      </ListGroupItemHeading>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={{ size: 10 }}>
                      <ListGroupItemText>
                        {announcement.content}
                      </ListGroupItemText>
                      <ListGroupItemText>
                        {announcement.timestamp} | {announcement.name}
                      </ListGroupItemText>
                    </Col>
                    <Col
                      xs="text-xs-right"
                      style={{
                        display:
                          this.props.user.username.substring(0, 1) === "A"
                            ? "block"
                            : "none"
                      }}
                    >
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
                    <Col
                      xs="text-xs-left"
                      style={{
                        display:
                          this.props.user.username.substring(0, 1) === "A"
                            ? "block"
                            : "none"
                      }}
                      className="ml-2"
                    >
                      <Button
                        color="danger"
                        onClick={() => this.handleClick(announcement.title)}
                      >
                        Delete
                      </Button>
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
