import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";

class FindMyBuddy extends Component {
  constructor(props) {
    super(props);
    this.state = { buddyList: [] };
  }

  componentDidMount() {
    axios
      .post("/findMyBuddy", {
        username: this.props.user.username
      })
      .then(res => this.setState({ buddyList: res.data }))
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <div
        style={{ height: "75vh" }}
        className="container valign-wrapper justify-content-center"
      >
        <div className="row">
          <div className="col s12 center-align">
            <h1 className="pl-4">FindMyBuddy™</h1>
            <hr></hr>
            <h1><span role='img' aria-label='emoji'>🙆‍</span> Here's your buddy List: <span role='img' aria-label='emoji'>🙆‍</span></h1>

            {this.state.buddyList.map(buddy => (
              <h1>
                <b>[{buddy.name}] </b>
              </h1>
            ))}
            <h4
              style={{
                display: this.state.buddyList.length ? "none" : "block"
              }}
              className="mt-3"
            >
              Nothing to see here :(
            </h4>
            <p className="mt-4" style={{ color: "grey" }}>
              Students who took the exact same modules as you in 2 consecutive
              semesters!
            </p>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(FindMyBuddy);
