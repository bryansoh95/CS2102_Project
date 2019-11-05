import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Navbar from "./components/NavigationBar";
import Landing from "./pages/Landing";
import Module from "./pages/Module";
import Gradebook from "./pages/Gradebook";
import Tutors from "./pages/Tutors";
import Announcements from "./pages/Announcements";
import Forum from "./pages/Forum";
import Threads from "./pages/Threads";
import Login from "./pages/Login";
import PastModules from "./pages/PastModules";
import { Provider } from "react-redux";
import store from "./store";
import axios from "axios";
import ModuleRequests from "./pages/ModuleRequests";
import SearchResults from "./pages/SearchResults";

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
                exact path="/modules/:module_code/announcements"
                render={props => (
                  <Announcements
                    {...props}
                    module_code={props.match.params.module_code}
                  />
                )}
              />
              <Route
                path="/modules/:module_code/forum/search"
                render={props => (
                  <SearchResults
                    {...props}
                    module_code={props.match.params.module_code}
                  />
                )}
              />
              <Route
                exact path="/modules/:module_code/forum"
                render={props => (
                  <Forum
                    {...props}
                    module_code={props.match.params.module_code}
                  />
                )}
              />
              <Route
                path="/modules/:module_code/forum/:category"
                render={props => (
                  <Threads
                    {...props}
                    module_code={props.match.params.module_code}
                    category={props.match.params.category}
                  />
                )}
              />
              <Route
                exact path="/modules/:module_code/gradebook"
                render={props => (
                  <Gradebook
                    {...props}
                    module_code={props.match.params.module_code}
                  />
                )}
              />
              <Route
                path="/modules/:module_code/tutors"
                render={props => (
                  <Tutors
                    {...props}
                    module_code={props.match.params.module_code}
                  />
                )}
              />
              <Route
                path="/modules/:module_code/requests"
                render={props => (
                  <ModuleRequests
                    {...props}
                    module_code={props.match.params.module_code}
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
