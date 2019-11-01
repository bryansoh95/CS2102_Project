import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Navbar from "./components/NavigationBar";
import Landing from "./pages/Landing";
import Module from "./pages/Module";
import Gradebook from "./pages/Gradebook";
import Announcements from "./pages/Announcements";
import Forum from "./pages/Forum";
import Login from "./pages/Login";
import PastModules from "./pages/PastModules";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { isLoggedIn: false };
  }

  validateUser = userData => {
    // call backend to check
    // if email/password correct, this.setState({ isLoggedIn: true});
  };

  render() {
    return (
      <Router>
        <Navbar />
        <div className="App">
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/home" component={Landing} />
            <Route path="/modules/past" component={PastModules} />
            <Route
              path="/modules/:moduleCode/announcements"
              render={props => (
                <Announcements
                  {...props}
                  moduleCode={props.match.params.moduleCode}
                />
              )}
            />
            <Route
              path="/modules/:moduleCode/forum"
              render={props => (
                <Forum {...props} moduleCode={props.match.params.moduleCode} />
              )}
            />
            <Route
              path="/modules/:moduleCode/gradebook/:username"
              render={props => (
                <Gradebook
                  {...props}
                  moduleCode={props.match.params.moduleCode}
                  username={props.match.params.username}
                />
              )}
            />
            <Route
              path="/modules/:moduleCode"
              render={props => (
                <Module {...props} moduleCode={props.match.params.moduleCode} />
              )}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
