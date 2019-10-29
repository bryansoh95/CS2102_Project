import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/NavigationBar";
import Landing from "./pages/Landing";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Navbar />
          <Route exact path="/" component={Login} />
          <Route exact path="/home" component={Landing} />
          <Route
            exact
            path="/home/modules/:moduleCode"
            render={props => <Module {...props} moduleCode={":moduleCode"} />}
          />
          <Route exact path="/home/modules/past" component={PastModules} />
        </div>
      </Router>
    );
  }
}

export default App;
