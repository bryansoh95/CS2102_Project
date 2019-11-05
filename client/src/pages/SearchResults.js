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

class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.state = { postsResult: [] };
  }

  componentDidMount() {
    axios
      .post("/course/forum/search", {
        module_code: this.props.module_code,
        search_input: this.props.search_input
      })
      .then(res => {
        console.log(res.data);
        this.setState({ postsResult: res.data });
      })
      .catch(err => console.log(err));
      console.log(this.state.postsResult);
  }

  render() {
    return (
      <div>
        <Row>
          <Col xs="3">
            <SideNav module_code={this.props.module_code} />
          </Col>
          <Col>
            hello
          </Col>
        </Row>
      </div>
    );
  }
}

export default SearchResults;
