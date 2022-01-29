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
import { FileInput, SVGIcon } from 'react-md';
import Loader from 'react-loader-spinner';

class AddCourseCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      catTitle: "",
      SignType: "",
      Description: "",
      uploadedImageUrl: null,
      error: false,
      register: false,
      selectedFile: null,
      file : null,
      isLoading: false
    };
    this.fileField = React.createRef();
    this.handleSignName = this.handleSignName.bind(this);
    this.handleSignType = this.handleSignType.bind(this);
    this.handleProductDescription = this.handleProductDescription.bind(this);
    this.addProduct = this.addProduct.bind(this);
  }

  handleClick = () =>  {
    this.fileField.click();
 };

  handleSignName(event) {
    this.setState({
      catTitle: event.target.value,
    });
  }
  handleSignType(event) {
    this.setState({
      SignType: event.target.value,
    });
  }
  handleProductDescription(event) {
    this.setState({
      Description: event.target.value,
    });
  }
  singleFileChangedHandler = ( event ) => {
  this.setState({
   selectedFile:   URL.createObjectURL(event.target.files[0]),
   file:  event.target.files[0]
  });
  }

  singleFileUploadHandler = (  ) => {
    this.successText = "";
    this.errorText = "";
    this.setState({
      isLoading: true
    })
    if (this.state.catTitle.length <= 0) {
      this.errorText = "Sign title is required *";
      this.successText = "";
      this.setState({
        error: true,
        isLoading: false
      });
    } else {
     this.addProduct();
    }  
  };

  addProduct() {
      axios
        .post(
          "https://drive-now.herokuapp.com/quiz/api/addCourseCategory",
          {
            title: this.state.catTitle,
          },
          {
            headers: {
              "Access-Control-Allow-Origin": "http://localhost:3000",
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          console.log("ServerResponse", res);
          if (res.data.code === 200) {
            this.errorText = "";
            this.successText = "Category added successfully *";
            this.setState({
              register: true,
              catTitle: "",
              Description: "",
              isLoading: false
            });
          } else if (res.data.code === 201) {
            this.successText = "";
            this.errorText = "Category already exist *";
            this.setState({
              error: true,
              isLoading: false
            });
          } else if (res.data.code === 400) {
            this.successText = "";
            this.errorText = "Something went wrong *";
            this.setState({
              error: true,
              isLoading: false
            });
          }
        })
        .catch((err) => {
          console.log("error", err);
          this.setState({
            isLoading: false
          })
        });
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
                  <h5 className="title">Add Course Category</h5>
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
                        <FormGroup></FormGroup>
                      </Col>
                      <Col className="pl-1" md="4">
                        <FormGroup></FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col  md="12">
                        <FormGroup>
                          <label>Course Category Title *</label>
                          <Input
                            placeholder="Title"
                            type="text"
                            value={this.state.catTitle}
                            onChange={this.handleSignName}
                            maxLength={50}
                          />
                        </FormGroup>
                      </Col>
                      {/* <Col className="pl-1" md="6">
                        <FormGroup>
                          <label>Sign Type*</label>
                          <Input
                            placeholder="warning"
                            type="text"
                            value={this.state.SignType}
                            onChange={this.handleSignType}
                            maxLength={10}
                          />
                        </FormGroup>
                      </Col> */}
                    </Row>
                    <Row>
                      {/* <Col md="12">
                        <FormGroup>
                          <label>Quiz Description *</label>
                          <Input
                            placeholder="Description"
                            type="text"
                            value={this.state.Description}
                            onChange={this.handleProductDescription}
                            maxLength={120}
                          />
                        </FormGroup>
                      </Col> */}
                    </Row>
                    <Row>
                      <Col className="pr-1" md="4">
                        <FormGroup>
                          {/* <label>Mobile Number *</label>
                          <Input
                            placeholder="1231235435"
                            type="text"
                            value={this.state.BarCode}
                            onChange={this.handleProductBarCode}
                            maxLength={20}
                          /> */}
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
                        {this.state.isLoading
                        ? <Col className="pr-1" md="4">
                        <FormGroup>
                        <br/>
                        <br/>
                        <Loader
                        style={{textAlign: "center"}}
                        type="ThreeDots"
                        color="#00BFFF"
                        height={30}
                        width={30}
                       /> 
                        </FormGroup>
                      </Col>
                        : <FormGroup>
                        <label></label>
                        <Button
                          style={{
                            marginLeft: 50,
                            marginTop: 100,
                          }}
                          // onClick={this.addProduct}
                          onClick={this.singleFileUploadHandler}
                        >
                          Add Category
                        </Button>
                      </FormGroup>
                        }
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
           
          </Row>
        </div>
      </>
    );
  }
}

export default AddCourseCategory;
