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

class Announcements extends Component {
  constructor(props) {
    super(props);
    this.state = { moduleAnnouncements: [] };
  }

  componentDidMount() {
    console.log(this.props.module_code);
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
            <h1 className="mt-5">{this.props.module_code} Announcements</h1>
            <ListGroup>
              {this.state.moduleAnnouncements.map(announcement => (
                <ListGroupItem action tag="button">
                  <ListGroupItemHeading>
                    <Link to="/">{announcement.title}</Link>
                  </ListGroupItemHeading>
                  <ListGroupItemText>{announcement.content}</ListGroupItemText>
                  <ListGroupItemText>
                    {announcement.timestamp.substring(0, 10)} |{" "}
                    {announcement.name}
                  </ListGroupItemText>
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Announcements;
