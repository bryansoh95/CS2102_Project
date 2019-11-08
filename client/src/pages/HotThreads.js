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
import CollapseForm from "../components/CollapseForm";

class HotThreads extends Component {
  constructor(props) {
    super(props);
    this.state = { hotThreads: [] };
  }

  componentDidMount() {
    axios
      .post("/course/forum/hot", {
        module_code: this.props.module_code
      })
      .then(res => this.setState({ hotThreads: res.data }))
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
            <Row className="mt-5 mb-3">
              <Col sm={{ size: 8, order: 1 }}>
                <div>
                  <h1 className="mt-3">
                    {this.props.module_code} {this.props.category} Forum Hottest
                    Thread
                  </h1>
                </div>
              </Col>
              <Col sm={{ size: 3, order: 3 }}>
                <form onSubmit={this.handleSubmit} className="ml-3">
                  <div class="row">
                    <div class="col">
                      <div class="row mb-0"></div>
                    </div>
                  </div>
                </form>
              </Col>
            </Row>

            <ListGroup>
              {this.state.hotThreads.map(thread => (
                <ListGroupItem action tag="button">
                  <ListGroupItemHeading>
                    <Link
                      to={
                        "/modules/" +
                        thread.module_code +
                        "/forum/" +
                        thread.category +
                        "/" +
                        thread.thread_title
                      }
                    >
                      {thread.thread_title}
                    </Link>
                  </ListGroupItemHeading>
                  <ListGroupItemText>
                    Created by {thread.name} on{" "}
                    {thread.timestamp.substring(0, 10)},{" "}
                    {thread.timestamp.substring(10)}
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

export default HotThreads;
