import React, { Component } from "react";
import { ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import axios from "axios";
import { connect } from "react-redux";

class PostsListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      pages: []
    };
  }
  componentDidMount() {
    axios
      .post('/course/abc/forum/abc/thread/abc/post', {
        module_code: 'CS2040',
        category: 'General',
        thread_title: 'Hello everyone'
      })
      .then(res => {
        this.setState({ posts: res.data });
        for (var i = 1; i <= res.data.length / 10; i++) {
            this.state.pages.push(i)
        }
      })
      .catch(err => console.log(err));
  }
  render() {
    return (
        <div>
        <ListGroup>
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
      <Pagination>
      <PaginationItem>
          <PaginationLink first href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink previous href="#" />
        </PaginationItem>
        {this.state.pages.map(page => (
        <PaginationItem>
            <PaginationLink href="#">
              1
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationLink next href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink last href="#" />
        </PaginationItem>
      </Pagination>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(PostsListing);