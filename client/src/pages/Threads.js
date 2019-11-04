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

class Threads extends Component {
  constructor(props) {
    console.log("HELLOOO");
    super(props);
    this.state = { moduleForumThreads: [] };
  }

  componentDidMount() {
    console.log("HELLOOOO");
    axios
      .post("/course/forum/threads", {
        module_code: this.props.module_code,
        category: this.props.category
      })
      .then(res => console.log("HELLO"))
      //   .then(res => this.setState({ moduleForumThreads: res.data }))
      .catch(err => console.log(err));
  }

  handleChange = e => {
    this.setState({ query: e.target.value });
  };

  // handleSubmit = e => {
  //   e.preventDefault();
  //   const userQuery = {
  //     query: this.state.query
  //   };
  //   this.props.searchListings(userQuery);
  //   this.props.history.push("/searchResults");
  // };
  render() {
    return (
      <div>
        <Row>
          <Col xs="3">
            <SideNav module_code={this.props.module_code} />
          </Col>
          <Col>
            <h1 className="mt-5 mb-3">{this.props.module_code} Forum</h1>
            <form onSubmit={this.handleSubmit} className="ml-3">
              <div class="row">
                <div class="col">
                  <div class="row">
                    <div class="input-field">
                      <input
                        type="text"
                        id="autocomplete-input"
                        class="autocomplete"
                        value={this.state.query}
                        onChange={this.handleChange}
                      />
                      <label for="autocomplete-input">Search threads</label>
                      <i class="material-icons prefix">search</i>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            <ListGroup>
              {this.state.moduleForumThreads.map(thread => (
                <ListGroupItem action tag="button">
                  <ListGroupItemHeading>
                    <Link to="/">{thread.category}</Link>
                  </ListGroupItemHeading>
                  <ListGroupItemText>
                    {thread.timestamp.substring(0, 10)} | {thread.name}
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

export default Threads;
