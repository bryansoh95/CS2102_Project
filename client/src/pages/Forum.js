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
import axios from "axios";
import { connect } from "react-redux";
import FormB from "../components/FormB";

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
    this.props.history.push({
      pathname: "/modules/" + this.props.module_code + "/forum/search",
      data: {
        module_code: this.props.module_code,
        query: this.state.query
      }
    });
  };

  hotThreadsRouteChange = () => {
    this.props.history.push(
      "/modules/" + this.props.module_code + "/forum/hot_threads/hot"
    );
  };

  handleDelete = (module_code, category) => {
    axios.post("/course/forum/delete", {
      module_code: module_code,
      category: category,
      puname: this.props.user.username
    });
    window.location.reload();
  };

  computeForumBonusMarks = () => {
    axios
      .post("/course/students", { module_code: this.props.module_code })
      .then(res => {
        for (var i = 0; i < res.data.length; i++) {
          axios
            .post("/course/forum/bonus", {
              module_code: this.props.module_code,
              uname: res.data[i].suname
            })
            .catch(err => console.log(err));
        }
      })
      .then(res => alert("Forum bonus marks computed!"))
      .catch(err => console.log(err));
  };

  render() {
    return (
      <div>
        <Row>
          <Col xs="3">
            <SideNav module_code={this.props.module_code} />
          </Col>
          <Col>
            <Row className="mt-5 mb-0">
              <Col sm={{ size: 3, order: 1 }}>
                <h1 className="mt-3">{this.props.module_code} Forum</h1>
              </Col>
              <Col
                style={{
                  display:
                    this.props.user.username.substring(0, 1) === "A"
                      ? "block"
                      : "none"
                }}
                className="mt-4"
                sm={{ size: 4, order: 2 }}
              >
                <FormB
                  postRoute="/course/forum/add"
                  data={{ module_code: this.props.module_code }}
                  buttonLabel="Create new Forum"
                  formHeader="Create new Forum"
                  field="Forum Name"
                  action="Create"
                />
              </Col>
              <Col sm={{ size: 3, order: 3 }}>
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
                          <label for="autocomplete-input">
                            Search Posts in Forum
                          </label>
                          <i class="material-icons prefix">search</i>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </Col>
            </Row>
            <ListGroup className="mr-5">
              {this.state.moduleForums.map(forum => (
                <Row>
                  <Col sm={{ size: 10 }}>
                    <Link
                      to={
                        "/modules/" +
                        forum.module_code +
                        "/forum/" +
                        forum.category
                      }
                    >
                      <ListGroupItem
                        style={{ background: "WhiteSmoke" }}
                        action
                        tag="button"
                      >
                        <ListGroupItemHeading>
                          {forum.category}
                        </ListGroupItemHeading>
                      </ListGroupItem>
                    </Link>
                  </Col>
                  <Col
                    style={{
                      display:
                        this.props.user.username.substring(0, 1) === "A"
                          ? "block"
                          : "none"
                    }}
                  >
                    <Button
                      color="danger"
                      className="mt-2"
                      onClick={() =>
                        this.handleDelete(forum.module_code, forum.category)
                      }
                    >
                      Delete
                    </Button>
                  </Col>
                </Row>
              ))}
            </ListGroup>
            <Button
              color="primary"
              className="ml-1"
              onClick={this.hotThreadsRouteChange}
            >
              View Hot Threads
            </Button>
            <Button
              style={{
                display:
                  this.props.user.username.substring(0, 1) === "A"
                    ? "inline"
                    : "none"
              }}
              color="primary"
              className="ml-1"
              onClick={this.computeForumBonusMarks}
            >
              Compute Forum Bonus Marks
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(Forum);
