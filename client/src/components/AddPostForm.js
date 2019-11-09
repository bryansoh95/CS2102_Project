import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input
} from "reactstrap";
import axios from "axios";
import { connect } from "react-redux";

class AddPostForm extends Component {
  constructor(props) {
    super(props);
    this.state = { modal: false, post_content: "" };
  }

  toggleModal = () => this.setState({ modal: !this.state.modal });

  handleSubmit = () => {
    axios
      .post("/course/forum/thread/posts/new", {
        uname: this.props.user.username,
        module_code: this.props.module_code,
        category: this.props.category,
        thread_title: this.props.thread_title,
        post_content: this.state.post_content
      })
      .then(res => {
        alert("Post submitted");
      })
      .catch(err => console.log(err));
    this.toggleModal();
  };

  handleChange = e => {
    this.setState({ post_content: e.target.value });
  };

  render() {
    return (
      <div>
        <Button color="info" onClick={this.toggleModal}>
          Post
        </Button>
        <Modal isOpen={this.state.modal} size="lg">
          <ModalHeader>Submit a Post</ModalHeader>
          <ModalBody>
            <Input
              type="textarea"
              id="postContent"
              value={this.state.postContent}
              onChange={this.handleChange}
              placeholder="Write a post"
              rows={5}
            />
          </ModalBody>
          <ModalFooter style={{ background: "rgb(255, 255, 255)" }}>
            <Button color="primary" onClick={this.handleSubmit}>
              Submit post
            </Button>{" "}
            <Button color="secondary" onClick={this.toggleModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(AddPostForm);
