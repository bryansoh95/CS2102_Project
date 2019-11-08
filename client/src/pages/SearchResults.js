import React, { Component } from "react";
import { Link } from "react-router-dom";
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

class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.state = { postsResult: [] };
  }

  componentDidMount() {
    if (this.props.location.data.category) {
      axios
        .post("/course/forum/thread/search", {
          module_code: this.props.module_code,
          category: this.props.location.data.category,
          search_input: this.props.location.data.query
        })
        .then(res => {
          this.setState({ postsResult: res.data });
        })
        .catch(err => console.log(err));
    } else {
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
  }

  handleClick = () => {
    if (this.props.location.data.category) {
      this.props.history.push('/modules/' + this.props.module_code + '/forum/' + this.props.location.data.category)
    } else {
      this.props.history.push('/modules/' + this.props.module_code + '/forum')
    }
  }

  render() {
    return (
      <div>
        <Row>
          <Col xs="3">
            <SideNav module_code={this.props.module_code} />
          </Col>
          <Col style={{ display: this.state.postsResult.length !== 0 ? 'block' : 'none' }}>
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
          <Col style={{ display: this.state.postsResult.length === 0 ? 'block' : 'none' }}>
            <h1 className="mt-5 mb-5">{this.props.module_code} Forum Search Results</h1>
            Sorry, no posts with the keyword '{this.props.location.data.query}' found!
            <div className='mt-4'>
              <Button color="info" onClick={this.handleClick}>Back</Button>{' '}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default SearchResults;
