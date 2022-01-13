import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import AdminLogin from "../src/adminlogin/login";
import AdminSignup from "../src/adminSignup/adminSignup";
import UserLogin from "../src/userlogin/userlogin";
import UserPanel from "../src/layouts/User";
import { Route, Link, Redirect } from "react-router-dom";
import AdminLayout from "../src/layouts/Admin";
import DeliveryBoyLogin from "../src/delivery/deliverylogin";

class App extends Component {
  state = {
    userlogin: false,
  };

  adminLogin = (e) => {
    console.log("triggere");
    this.setState({
      userlogin: true,
    });
  };

  render() {
    return (
      <div>
        <Route exact path="/" component={UserLogin} />
        <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
        <Route exact path="/adminlogin" component={AdminLogin} />
        <Route exact path="/userlogin" component={UserLogin} />
        <Route exact path="/deliverylogin" component={DeliveryBoyLogin} />
        <Route
          exact
          path="/store"
          render={(props) => <UserPanel {...props} />}
        />
      </div>
    );
  }
}

export default App;
