import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  FormText
} from "reactstrap";
import axios from "axios";
import { connect } from "react-redux";

class RequestCollapseForm extends Component {
  constructor(props) {
    super(props);
    this.state = { modal: false, allModules: [], selectedOption: "" };
  }

  componentDidMount() {
    axios
      .get("/course/all")
      .then(res => {
        this.setState({
          allModules: res.data,
          selectedOption: res.data[0].module_code + " "
        });
      })
      .catch(err => console.log(err));
  }

  toggleModal = () => this.setState({ modal: !this.state.modal });

  handleSubmit = () => {
    axios
      .post("/course/all/request", {
        suname: this.props.user.username,
        module_code: this.state.selectedOption.substring(
          0,
          this.state.selectedOption.indexOf(" ")
        )
      })
      .then(res => {
        alert("module requested!");
      })
      .catch(err => console.log(err));
    this.toggleModal();
  };

  handleChange = e => {
    this.setState({ selectedOption: e.target.value });
  };

  render() {
    return (
      <div>
        <Button color="info" onClick={this.toggleModal}>
          Request Module
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggleDropdown} size="lg">
          <ModalHeader>Select a Module!</ModalHeader>
          <FormGroup>
            <Label for="exampleSelect">Select</Label>
            <Input
              type="select"
              name="select"
              id="exampleSelect"
              onChange={this.handleChange}
            >
              {this.state.allModules.map(module => (
                <option>
                  {module.module_code} {module.name}
                </option>
              ))}
            </Input>
          </FormGroup>
          <ModalFooter style={{ background: "rgb(255, 255, 255)" }}>
            <Button color="primary" onClick={this.handleSubmit}>
              Submit module request
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

export default connect(mapStateToProps)(RequestCollapseForm);
