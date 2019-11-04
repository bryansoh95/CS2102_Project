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

class Forum extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: ""
    };
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
            <h1 className="mt-5 mb-3">moduleCode Forum</h1>
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
            <ListGroupItem className="mr-5">
              <ListGroupItemHeading>
                <Link to="/">Thread 1</Link>
              </ListGroupItemHeading>
              <ListGroupItemText>
                Description Donec id elit non mi porta gravida at eget metus.
                Maecenas sed diam eget risus varius blandit.
              </ListGroupItemText>
            </ListGroupItem>
            <ListGroupItem className="mr-5"></ListGroupItem>
            <ListGroup className="mr-5">
              <ListGroupItem>
                <ListGroupItemHeading>
                  <Link to="/">Thread 1</Link>
                </ListGroupItemHeading>
                <ListGroupItemText>
                  Description Donec id elit non mi porta gravida at eget metus.
                  Maecenas sed diam eget risus varius blandit.
                </ListGroupItemText>
              </ListGroupItem>
              <ListGroupItem>
                <ListGroupItemHeading>
                  <Link to="/">Thread 2</Link>
                </ListGroupItemHeading>
                <ListGroupItemText>
                  Donec id elit non mi porta gravida at eget metus. Maecenas sed
                  diam eget risus varius blandit.
                </ListGroupItemText>
              </ListGroupItem>
              <ListGroupItem>
                <ListGroupItemHeading>
                  <Link to="/">Thread 3</Link>
                </ListGroupItemHeading>
                <ListGroupItemText>
                  Donec id elit non mi porta gravida at eget metus. Maecenas sed
                  diam eget risus varius blandit.
                </ListGroupItemText>
              </ListGroupItem>
            </ListGroup>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Forum;
