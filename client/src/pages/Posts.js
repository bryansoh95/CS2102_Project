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
import { connect } from "react-redux";
import FormB from "../components/FormB";

class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: []
    };
  }
  componentDidMount() {
    axios
      .post("/course/forum/thread/posts", {
        module_code: this.props.module_code,
        category: this.props.category,
        thread_title: this.props.thread_title
      })
      .then(res => {
        this.setState({ posts: res.data });
      })
      .catch(err => console.log(err));
  }

  handleDelete = index => {
    axios
      .post("/course/forum/thread/posts/delete", {
        module_code: this.props.module_code,
        category: this.props.category,
        thread_title: this.props.thread_title,
        post_id: this.state.posts[index].post_id,
        uname: this.props.user.username
      })
      .then(res => {
        alert("delete success!");
        window.location.reload();
      })
      .catch(err => {
        console.log(err);
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
            <Row sm={{ size: 7, order: 1 }} className="mt-5 mb-5">
              <Col className="mt-3">
                <h1>
                  {this.props.module_code} {this.props.category} Forum:{" "}
                  {this.props.thread_title}
                </h1>
              </Col>
              <Col sm={{ size: 4, order: 2 }} className="mt-4">
                <FormB
                  postRoute="/course/forum/thread/posts/new"
                  buttonLabel="Add new Post"
                  formHeader="Add new Post"
                  field="Post Content"
                  action="Post"
                  data={{
                    module_code: this.props.module_code,
                    category: this.props.category,
                    thread_title: this.props.thread_title
                  }}
                />
              </Col>
            </Row>
            <ListGroup className="mr-5">
              {this.state.posts.map((post, index) => (
                <ListGroupItem style={{ background: "WhiteSmoke" }}>
                  <ListGroupItemHeading>
                    {post.thread_title}
                    <hr />
                  </ListGroupItemHeading>
                  <Row>
                    <Col sm={{ size: 8 }}>
                      <ListGroupItemText>{post.post_content}</ListGroupItemText>
                      <ListGroupItemText>
                        {post.name} posted on {post.timestamp}
                      </ListGroupItemText>
                    </Col>
                    <Col
                      xs="text-xs-right"
                      style={{
                        display:
                          this.props.user.username === post.uname
                            ? "block"
                            : "none"
                      }}
                    >
                      <FormB
                        postRoute="/course/forum/thread/posts/edit"
                        data={{
                          module_code: this.props.module_code,
                          post_id: post.post_id,
                          thread_title: post.thread_title,
                          category: post.category
                        }}
                        buttonLabel="Edit Post"
                        formHeader="Edit Post"
                        field="Post Content"
                        action="Post"
                      />
                    </Col>
                    <Col
                      className="ml-2"
                      xs="text-xs-left"
                      style={{
                        display:
                          this.props.user.username === post.uname
                            ? "block"
                            : "none"
                      }}
                    >
                      <Button
                        color="danger"
                        onClick={() => this.handleDelete(index)}
                      >
                        Delete
                      </Button>{" "}
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

export default connect(mapStateToProps)(Posts);
