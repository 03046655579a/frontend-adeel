import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";
import { reactLocalStorage } from "reactjs-localstorage";
// core components
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import axios from "axios";

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ProductName: "",
      Potency: "",
      Description: "",
      BarCode: "",

      error: false,
      register: false,
    };

    this.handleProductName = this.handleProductName.bind(this);
    this.handleProductPotency = this.handleProductPotency.bind(this);
    this.handleProductDescription = this.handleProductDescription.bind(this);
    this.handleProductBarCode = this.handleProductBarCode.bind(this);

    this.addProduct = this.addProduct.bind(this);
  }

  handleProductName(event) {
    this.setState({
      ProductName: event.target.value,
    });
  }
  handleProductPotency(event) {
    this.setState({
      Potency: event.target.value,
    });
  }
  handleProductDescription(event) {
    this.setState({
      Description: event.target.value,
    });
  }
  handleProductBarCode(event) {
    this.setState({
      BarCode: event.target.value,
    });
  }

  addProduct() {
    console.log("submitted");

    if (
      this.state.ProductName.length <= 0 &&
      this.state.Potency.length <= 0 &&
      this.state.Description.length <= 0 &&
      this.state.BarCode.length <= 0
    ) {
      this.errorText = "Please fill all fields *";
      this.successText = "";
      this.setState({
        error: true,
      });
    } else if (this.state.ProductName.length <= 0) {
      this.errorText = "Product Name is required *";
      this.successText = "";
      this.setState({
        error: true,
      });
    } else if (this.state.Potency.length <= 0) {
      this.errorText = "Potency is required *";
      this.successText = "";
      this.setState({
        error: true,
      });
    } else if (this.state.Description.length <= 0) {
      this.errorText = "Description is required *";
      this.successText = "";
      this.setState({
        error: true,
      });
    } else if (this.state.BarCode.length <= 0) {
      this.errorText = "Barcode is required *";
      this.successText = "";
      this.setState({
        error: true,
      });
    } else if (!Number(this.state.BarCode)) {
      this.errorText = "Barcode must be a Number *";
      this.successText = "";
      this.setState({
        error: true,
      });
    } else {
      axios
        .post(
          "http://34.227.47.234:5000/medication/api/AddProduct",
          {
            productName: this.state.ProductName,
            potency: this.state.Potency,
            description: this.state.Description,
            barCode: this.state.BarCode,
            storeName: reactLocalStorage.get("storename"),
            storeEmail: reactLocalStorage.get("email"),
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
            this.errorText = "";
            this.successText = "Product added successfully *";
            this.setState({
              register: true,
              ProductName: "",
              Potency: "",
              Description: "",
              BarCode: "",
            });
          } else if (res.data.message === "false") {
            this.successText = "";
            this.errorText = "Something went wrong *";
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
      <>
        <PanelHeader size="sm" />
        <div className="content">
          <Row>
            <Col md="8">
              <Card>
                <CardHeader>
                  <h5 className="title">Add Product</h5>
                </CardHeader>
                <CardBody>
                  <Form>
                    <Row>
                      <Col className="pr-1" md="5">
                        <FormGroup>
                          <label>Company (disabled)</label>
                          <Input
                            defaultValue="Creative Code Inc."
                            disabled
                            placeholder="Company"
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col className="px-1" md="3">
                        <FormGroup>
                          <label>Store Name</label>
                          <Input
                            disabled
                            placeholder={reactLocalStorage.get("storename")}
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col className="pl-1" md="4">
                        <FormGroup>
                          <label htmlFor="exampleInputEmail1">
                            Email address
                          </label>
                          <Input
                            disabled
                            placeholder={reactLocalStorage.get("email")}
                            type="email"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="pr-1" md="6">
                        <FormGroup>
                          <label>Product Name *</label>
                          <Input
                            placeholder="Panadol"
                            type="text"
                            value={this.state.ProductName}
                            onChange={this.handleProductName}
                            maxLength={25}
                          />
                        </FormGroup>
                      </Col>
                      <Col className="pl-1" md="6">
                        <FormGroup>
                          <label>Product Potency *</label>
                          <Input
                            placeholder="50 mg"
                            type="text"
                            value={this.state.Potency}
                            onChange={this.handleProductPotency}
                            maxLength={10}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <label>Product Description *</label>
                          <Input
                            placeholder="Description"
                            type="text"
                            value={this.state.Description}
                            onChange={this.handleProductDescription}
                            maxLength={80}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="pr-1" md="4">
                        <FormGroup>
                          <label>Bar Code *</label>
                          <Input
                            placeholder="1231235435"
                            type="text"
                            value={this.state.BarCode}
                            onChange={this.handleProductBarCode}
                            maxLength={20}
                          />
                        </FormGroup>
                      </Col>
                      <Col className="px-1" md="4">
                        <FormGroup>
                          {/* <label>Country</label>
                          <Input
                            defaultValue="Andrew"
                            placeholder="Country"
                            type="text"
                          /> */}
                        </FormGroup>
                      </Col>
                      <Col className="pl-1" md="4">
                        <FormGroup>
                          <label></label>
                          <Button
                            style={{
                              marginLeft: 100,
                              marginTop: 100,
                            }}
                            onClick={this.addProduct}
                          >
                            Add Product
                          </Button>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <label>
                            {" "}
                            {this.state.error ? (
                              <label class="error" style={{ color: "red" }}>
                                {this.errorText}
                              </label>
                            ) : (
                              <h4></h4>
                            )}
                            {this.state.register ? (
                              <label class="error" style={{ color: "green" }}>
                                {this.successText}
                              </label>
                            ) : (
                              <h4></h4>
                            )}
                          </label>
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
            <Col md="4">
              <Card className="card-user">
                <div className="image">
                  <img alt="..." src={require("assets/img/bg5.jpg")} />
                </div>
                <CardBody>
                  <div className="author">
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      <img
                        alt="..."
                        className="avatar border-gray"
                        src={require("assets/img/logo.jpg")}
                      />
                      <h5 className="title">
                        {reactLocalStorage.get("storename")}
                      </h5>
                    </a>
                    <p className="description">
                      {reactLocalStorage.get("email")}
                    </p>
                  </div>
                  <p className="description text-center">
                    "Add Products <br />
                    to your store and <br />
                    start earning "
                  </p>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default User;
