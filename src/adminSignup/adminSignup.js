import React, { Component } from "react";
import "../adminSignup/adminSignup.css";
import { useHistory, Link, Redirect } from "react-router-dom";
import UserPanel from "../userpanel/userpanel";
import UserLogin from "../userlogin/userlogin";
import axios from "axios";

class AdminSignup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      StoreName: "",
      proprieterName: "",
      Email: "",
      Password: "",
      Address: "",
      City: "",
      Description: "",
      PhoneNumber: "",
      error: false,
      register: false,
    };

    this.handleStoreName = this.handleStoreName.bind(this);
    this.handleProprieterName = this.handleProprieterName.bind(this);
    this.handleStoreEmail = this.handleStoreEmail.bind(this);
    this.handleStorePassword = this.handleStorePassword.bind(this);
    this.handleStoreAddress = this.handleStoreAddress.bind(this);
    this.handleStoreCity = this.handleStoreCity.bind(this);
    this.handleStoreDescription = this.handleStoreDescription.bind(this);
    this.handleStorePhoneNumber = this.handleStorePhoneNumber.bind(this);
    this.register = this.register.bind(this);
  }

  handleStoreName(event) {
    this.setState({
      StoreName: event.target.value,
    });
  }
  handleProprieterName(event) {
    this.setState({
      proprieterName: event.target.value,
    });
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
  handleStoreAddress(event) {
    this.setState({
      Address: event.target.value,
    });
  }
  handleStoreCity(event) {
    this.setState({
      City: event.target.value,
    });
  }
  handleStoreDescription(event) {
    this.setState({
      Description: event.target.value,
    });
  }
  handleStorePhoneNumber(event) {
    this.setState({
      PhoneNumber: event.target.value,
    });
  }

  register() {
    console.log("submitted");

    if (this.state.StoreName.length <= 0) {
      this.errorText = "Store Name is required *";
      this.setState({
        error: true,
      });
    } else if (this.state.Email.length <= 0) {
      this.errorText = "Email is required *";
      this.setState({
        error: true,
      });
    } else if (
      this.state.PhoneNumber.length > 0 &&
      !Number(this.state.PhoneNumber)
    ) {
      this.errorText = "Phone Number is incorrect *";
      this.setState({
        error: true,
      });
    } else if (
      this.state.StoreName.length <= 0 ||
      this.state.proprieterName.length <= 0 ||
      this.state.City.length <= 0 ||
      this.state.Password.length <= 0 ||
      this.state.Address.length <= 0 ||
      this.state.Description.length <= 0 ||
      this.state.Email.length <= 0 ||
      this.state.PhoneNumber.length <= 0
    ) {
      this.errorText = "Please fill all fields *";
      this.setState({
        error: true,
      });
    } else {
      axios
        .post(
          "http://BASE_URL:3000/medication/api/adduser",
          {
            storeName: this.state.StoreName,
            proprieterName: this.state.proprieterName,
            Description: this.state.Description,
            City: this.state.City,
            Address: this.state.Address,
            phoneNumber: this.state.PhoneNumber,
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
          if (res.data.message === "success") {
            this.setState(
              {
                register: true,
              },
              () => {
                console.log("Succes", this.state.register);
              }
            );
          } else if (
            res.data.message === "error" ||
            res.data.message === "false"
          ) {
            this.errorText = "Something wrong with server *";
            this.setState({
              error: true,
            });
          } else if (res.data.message === "already exists") {
            this.errorText = "User Already Exists *";
            this.setState({
              error: true,
            });
          }
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
          <Redirect from="/" to="/userlogin" />
        ) : (
          <div class="container register">
            <div class="row">
              <div class="col-md-3 register-left">
                <img src="https://image.ibb.co/n7oTvU/logo_white.png" alt="" />
                <h3>Welcome</h3>
                <p>You are 30 seconds away from earning your own money!</p>

                <Link to="/userlogin">
                  {" "}
                  <input type="submit" name="" value="Store Login" />
                </Link>
                <Link to="/deliverylogin">
                  {" "}
                  <input type="submit" name="" value=" Delivery Login" />
                </Link>
              </div>
              <div class="col-md-9 register-right">
                <ul
                  class="nav nav-tabs nav-justified"
                  id="myTab"
                  role="tablist"
                >
                  <li class="nav-item">
                    <a
                      class="nav-link active"
                      id="home-tab"
                      data-toggle="tab"
                      role="tab"
                      aria-controls="home"
                      aria-selected="true"
                    >
                      Store
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      id="profile-tab"
                      data-toggle="tab"
                      role="tab"
                      aria-controls="profile"
                      aria-selected="false"
                    >
                      <Link class="nav-link" to="/adminlogin">
                        Admin
                      </Link>
                    </a>
                  </li>
                </ul>
                <div class="tab-content" id="myTabContent">
                  <div
                    class="tab-pane fade show active"
                    id="home"
                    role="tabpanel"
                    aria-labelledby="home-tab"
                  >
                    <h3 class="register-heading">Apply as a Medical Store</h3>
                    <div class="row register-form">
                      <div class="col-md-6">
                        <div class="form-group">
                          <input
                            type="text"
                            class="form-control"
                            placeholder="Store Name *"
                            value={this.state.StoreName}
                            onChange={this.handleStoreName}
                            maxLength={15}
                          />
                        </div>
                        <div class="form-group">
                          <input
                            type="text"
                            class="form-control"
                            placeholder="Owner Name *"
                            value={this.state.proprieterName}
                            onChange={this.handleProprieterName}
                            maxLength={15}
                          />
                        </div>
                        <div class="form-group">
                          <input
                            type="password"
                            class="form-control"
                            placeholder="Password *"
                            value={this.state.Password}
                            onChange={this.handleStorePassword}
                            maxLength={10}
                          />
                        </div>
                        <div class="form-group">
                          <input
                            type="text"
                            class="form-control"
                            placeholder="City *"
                            value={this.state.City}
                            onChange={this.handleStoreCity}
                            maxLength={15}
                          />
                        </div>
                        <div class="form-group">
                          {this.state.error ? (
                            <span class="error">{this.errorText}</span>
                          ) : (
                            <h4 class="error"></h4>
                          )}
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <input
                            type="email"
                            class="form-control"
                            placeholder="Your Email *"
                            value={this.state.Email}
                            onChange={this.handleStoreEmail}
                            maxLength={25}
                          />
                        </div>
                        <div class="form-group">
                          <input
                            type="text"
                            name="txtEmpPhone"
                            class="form-control"
                            placeholder="Your Phone *"
                            value={this.state.PhoneNumber}
                            onChange={this.handleStorePhoneNumber}
                            maxLength={15}
                          />
                        </div>
                        <div class="form-group">
                          <input
                            type="text"
                            class="form-control"
                            placeholder="Store Address *"
                            value={this.state.Address}
                            onChange={this.handleStoreAddress}
                            maxLength={25}
                          />
                        </div>
                        <div class="form-group">
                          <input
                            type="text"
                            class="form-control"
                            placeholder="Store Description *"
                            value={this.state.Description}
                            onChange={this.handleStoreDescription}
                            maxLength={50}
                          />
                        </div>
                        <input
                          type="submit"
                          class="btnRegister"
                          value="Register"
                          onClick={this.register}
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    class="tab-pane fade show"
                    id="profile"
                    role="tabpanel"
                    aria-labelledby="profile-tab"
                  >
                    <h3 class="register-heading">Apply as a Hirer</h3>
                    <div class="row register-form">
                      <div class="col-md-6">
                        <div class="form-group">
                          <input
                            type="text"
                            class="form-control"
                            placeholder="First Name *"
                            value=""
                          />
                        </div>
                        <div class="form-group">
                          <input
                            type="text"
                            class="form-control"
                            placeholder="Last Name *"
                            value=""
                          />
                        </div>
                        <div class="form-group">
                          <input
                            type="email"
                            class="form-control"
                            placeholder="Email *"
                            value=""
                          />
                        </div>
                        <div class="form-group">
                          <input
                            type="text"
                            maxlength="10"
                            minlength="10"
                            class="form-control"
                            placeholder="Phone *"
                            value=""
                          />
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-group">
                          <input
                            type="password"
                            class="form-control"
                            placeholder="Password *"
                            value=""
                          />
                        </div>
                        <div class="form-group">
                          <input
                            type="password"
                            class="form-control"
                            placeholder="Confirm Password *"
                            value=""
                          />
                        </div>
                        <div class="form-group">
                          <select class="form-control">
                            <option class="hidden" selected disabled>
                              Please select your Sequrity Question
                            </option>
                            <option>What is your Birthdate?</option>
                            <option>What is Your old Phone Number</option>
                            <option>What is your Pet Name?</option>
                          </select>
                        </div>
                        <div class="form-group">
                          <input
                            type="text"
                            class="form-control"
                            placeholder="`Answer *"
                            value=""
                          />
                        </div>
                        <input
                          type="submit"
                          class="btnRegister"
                          value="Register"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default AdminSignup;
