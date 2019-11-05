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
        search_input: this.props.location.data.query
      })
      .then(res => {
        this.setState({ postsResult: res.data });
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
            <h1 className="mt-5 mb-5">{this.props.module_code} Forum Search Results</h1>
            <ListGroup className='mr-5'>
                {this.state.postsResult.map(post => (
                <ListGroupItem>
                    <Link to={"/modules/" + this.props.module_code + "/forum/" + post.category + '/' + post.thread_title}>
                    <ListGroupItemHeading>
                    {post.thread_title}
                    <hr />
                    </ListGroupItemHeading>
                    </Link>
                    <ListGroupItemText>{post.post_content}</ListGroupItemText>
                    <ListGroupItemText>
                    {post.name} posted on {post.timestamp}
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

export default SearchResults;
