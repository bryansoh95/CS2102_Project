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
import { Provider } from "react-redux";
import store from "./store";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider store={store}>
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
                  <Forum
                    {...props}
                    moduleCode={props.match.params.moduleCode}
                  />
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
                  <Module
                    {...props}
                    moduleCode={props.match.params.moduleCode}
                  />
                )}
              />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

// const validateUser = userData => {
//   axios.post("/login", userData).then(res => {
//     return { data: res.data };
//   });
// };

export default App;
