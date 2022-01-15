import React, { Component } from "react";
import "../delivery/deliverylogin.css";
import UserPanel from "../userpanel/userpanel";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import logo from "../assets/img/logo.jpg";
import AdminLayout from "../layouts/Admin";
import { reactLocalStorage } from "reactjs-localstorage";

class DeliveryLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Email: "",
      Password: "",

      error: false,
      register: false,
    };

    this.handleStoreEmail = this.handleStoreEmail.bind(this);
    this.handleStorePassword = this.handleStorePassword.bind(this);
    this.login = this.login.bind(this);
  }

  handleStoreEmail(event) {
    this.setState({
      Email: event.target.value,
    });
  }
  handleStorePassword(event) {
    this.setState({
      Password: event.target.value,
    });
  }

  login() {
    console.log("submitted");

    if (this.state.Email.length <= 0 && this.state.Password.length <= 0) {
      this.errorText = "Please fill all fields *";
      this.setState({
        error: true,
      });
    } else if (this.state.Password.length <= 0) {
      this.errorText = "Password is required *";
      this.setState({
        error: true,
      });
    } else if (this.state.Email.length <= 0) {
      this.errorText = "Email is required *";
      this.setState({
        error: true,
      });
    } else {
      axios
        .post(
          "http://34.227.47.234:5000/medication/api/findDeliveryBoy",
          {
            email: this.state.Email,
            password: this.state.Password,
          },
          {
            headers: {
              "Access-Control-Allow-Origin": "http://localhost:3000",
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          console.log("ServerResponse", res.data.message);
          if (res.data.message === "true") {
            reactLocalStorage.set("currentuser", "deliveryboy");
            console.log("Storage", reactLocalStorage.get("currentuser"));

            this.setState(
              {
                register: true,
              },
              () => {
                console.log("Succes", this.state.register);
              }
            );
          } else if (res.data.message === "false") {
            this.errorText = "Email/Password is invalid *";
            this.setState({
              error: true,
            });
          } else if (res.data.message === "server error")
            this.errorText = "Something wrong with server *";
          this.setState({
            error: true,
          });
        })
        .catch((err) => {
          console.log("error", err);
        });
    }
  }

  render() {
    return (
      <div>
        {this.state.register ? (
          <div>
            <Redirect
              to={{
                pathname: "/admin",
                state: {
                  username: "admin",
                },
              }}
            ></Redirect>
          </div>
        ) : (
          <div class="container h-100">
            <div class="d-flex justify-content-center h-100">
              <div class="user_card">
                <div class="d-flex justify-content-center">
                  <div class="brand_logo_container">
                    <img src={logo} class="brand_logo" alt="Logo" />
                  </div>
                </div>
                <div class="d-flex justify-content-center form_container">
                  <form>
                    <div class="input-group mb-3">
                      <div class="input-group-append">
                        <span class="input-group-text">
                          <i class="fas fa-user user"></i>
                        </span>
                      </div>
                      <input
                        type="email"
                        name=""
                        class="form-control input_user"
                        value=""
                        placeholder="email"
                        value={this.state.Email}
                        onChange={this.handleStoreEmail}
                        maxLength={25}
                      />
                    </div>
                    <div class="input-group mb-2">
                      <div class="input-group-append">
                        <span class="input-group-text">
                          <i class="fas fa-key user"></i>
                        </span>
                      </div>
                      <input
                        type="password"
                        name=""
                        class="form-control input_pass"
                        value=""
                        placeholder="password"
                        value={this.state.Password}
                        onChange={this.handleStorePassword}
                        maxLength={25}
                      />
                    </div>
                    {/* <div class="form-group">
                      <div class="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          class="custom-control-input"
                          id="customControlInline"
                        />
                        <label
                          class="custom-control-label"
                          for="customControlInline"
                        >
                          Remember me
                        </label>
                      </div>
                    </div> */}
                    <div class="d-flex justify-content-center mt-3 login_container">
                      <button
                        type="button"
                        name="button"
                        class="btn login_btn"
                        onClick={this.login}
                      >
                        Login
                      </button>
                    </div>
                  </form>
                </div>

                <div class="mt-4  account">
                  <div class="d-flex justify-content-center links signuplink">
                    {this.state.error ? (
                      <h6 class="error">{this.errorText}</h6>
                    ) : (
                      <h4></h4>
                    )}
                  </div>

                  <div class="d-flex justify-content-center links"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default DeliveryLogin;
