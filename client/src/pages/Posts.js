import React, { Component } from "react";
import SideNav from "../components/SideNav";
import AddPostForm from "../components/AddPostForm";
import {
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  Pagination,
  PaginationItem,
  PaginationLink
} from "reactstrap";
import axios from "axios";
import { connect } from "react-redux";

class Posts extends Component {
  constructor(props) {
    console.log("HELLO");
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
  render() {
    return (
      <div>
        <Row>
          <Col xs="3">
            <SideNav module_code={this.props.module_code} />
          </Col>
          <Col>
            <h1 className="mt-5 mb-5">
              {this.props.module_code} {this.props.category} Forum:{" "}
              {this.props.thread_title}
            </h1>
            <ListGroup className="mr-5">
              {this.state.posts.map(post => (
                <ListGroupItem>
                  <ListGroupItemHeading>
                    {post.thread_title}
                    <hr />
                  </ListGroupItemHeading>
                  <ListGroupItemText>{post.post_content}</ListGroupItemText>
                  <ListGroupItemText>
                    {post.name} posted on {post.timestamp}
                  </ListGroupItemText>
                </ListGroupItem>
              ))}
            </ListGroup>
            <AddPostForm
              module_code={this.props.module_code}
              category={this.props.category}
              thread_title={this.props.thread_title}
            />
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
