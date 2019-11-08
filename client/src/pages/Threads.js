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
import FormA from '../components/FormA'
import CollapseForm from '../components/CollapseForm'

class Threads extends Component {
  constructor(props) {
    super(props);
    this.state = { moduleForumThreads: [] };
  }

  componentDidMount() {
    axios
      .post("/course/forum/threads", {
        module_code: this.props.module_code,
        category: this.props.category
      })
      .then(res => this.setState({ moduleForumThreads: res.data }))
      .catch(err => console.log(err));
  }

  handleChange = e => {
    this.setState({ query: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.history.push({
      pathname: '/modules/' + this.props.module_code + '/forum/search', data: {
        module_code: this.props.module_code,
        query: this.state.query,
        category: this.props.category
      }
    });
  };
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
                  <h1 className='mt-3'>{this.props.module_code} {this.props.category} Forum</h1>
                </div>
                <div className='mt-4 mb-3'>
                  <FormA firstPostRoute='/course/forum/thread/new' secondPostRoute='/course/forum/thread/posts/new' data={{"module_code": this.props.module_code, "category": this.props.category}} buttonLabel='Create new Thread' formHeader='Create new Thread' firstField='Thread Title' secondField='Post Content' action='Create' />
                </div>
              </Col>
              <Col sm={{ size: 3, order: 2 }}>
                <form onSubmit={this.handleSubmit} className="ml-3">
                  <div class="row">
                    <div class="col">
                      <div class="row mb-0">
                        <div class="input-field">
                          <input
                            type="text"
                            id="autocomplete-input"
                            class="autocomplete"
                            value={this.state.query}
                            onChange={this.handleChange}
                          />
                          <label for="autocomplete-input">Search Posts in {this.props.category}</label>
                          <i class="material-icons prefix">search</i>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </Col>
            </Row>


            <ListGroup className="mr-5">
              {this.state.moduleForumThreads.map(thread => (
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
                    Created by {thread.name} on {thread.timestamp.substring(0, 10)}, {thread.timestamp.substring(10)}
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
