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

class Forum extends Component {
  constructor(props) {
    super(props);
    this.state = { moduleForums: [] };
  }

  componentDidMount() {
    axios
      .post("/course/forum", { module_code: this.props.module_code })
      .then(res => this.setState({ moduleForums: res.data }))
      .catch(err => console.log(err));
  }

  handleChange = e => {
    this.setState({ query: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.history.push({pathname: '/modules/' + this.props.module_code + '/forum/search', data: {
      module_code: this.props.module_code,
      query: this.state.query
    }});
  };
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
              {this.state.moduleForums.map(forum => (
                <Link
                  to={
                    "/modules/" + forum.module_code + "/forum/" + forum.category
                  }
                >
                  <ListGroupItem action tag="button">
                    <ListGroupItemHeading>
                      {forum.category}
                    </ListGroupItemHeading>
                  </ListGroupItem>
                </Link>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Forum;
