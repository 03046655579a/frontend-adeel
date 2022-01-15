import React from "react";

// reactstrap components
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Table,
  Row,
  Col,
  Input,
  Button,
  FormGroup,
  Form,
} from "reactstrap";
import axios from "axios";
// core components
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import Loader from 'react-loader-spinner';
import { thead, tbody } from "variables/general";

class CourseCategoryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: false,
      ordersData: "",
      isFetchingCategories: true,
      isUpdate: false,
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

  componentDidMount() {
    this.getOrdersFromDatabase();
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
      this.errorText = "Category is required *";
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
          "http://34.227.47.234:5000/quiz/api/updateSpecificCourseCategory",
          {
            id: this.state.recordId,  
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
          if (res.data.status === 200) {
            this.errorText = "";
            this.successText = "Category added successfully *";
            this.setState({
              register: true,
              catTitle: "",
              Description: "",
              isLoading: false,
              isUpdate: false
            });
            this.getOrdersFromDatabase()
          } else if (res.data.status === 201) {
            this.successText = "";
            this.errorText = "Category already exist *";
            this.setState({
              error: true,
              isLoading: false
            });
          } else if (res.data.status === 400) {
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

  //end

  getOrdersFromDatabase() {
    axios
      .get("http://34.227.47.234:5000/quiz/api/getCourseCategories")
      .then((res) => {
        console.log("response : ",res);
        if (res.data.status === 200) {
          this.productStatus = "";
          this.setState({
            order: true,
            ordersData: res,
          });
          console.log("order data  :",this.state.ordersData);
        } else {
          this.productStatus = "No Courses Exist";
          this.setState({
            order: false,
            isFetchingCategories: false
          });
        }
      })
      .catch((err) => {
        this.productStatus =
          " An error occured while fetching Courses List";
        this.setState({
          order: false,
          isFetchingCategories: false
        });
      });
  }

  showSignImage(url) {
    return (
          <img
          style={{width: 80, height:80}}
          alt="..."
          src={url}
        />
    );
  }

  deleteButton(index) {
    return (
      <button
        type="button"
        class="btn btn-danger"
        onClick={() => this.delete(index)}
      >
        Delete
      </button>
    );
  }

  updateButton(index) {
    return (
      <button
        type="button"
        class="btn btn-primary"
        onClick={() => this.update(index)}
      >
        Update
      </button>
    );
  }

  cancelUpdate = () => {
    this.setState({
        isUpdate : false,
        isLoading: false
    })
  }

  update = (index) => {
    this.errorText = "";
    this.successText = "";
     this.setState({
         isUpdate: true,
         catTitle: this.state.ordersData.data.feed[index].title,
         recordId: this.state.ordersData.data.feed[index].id
     });

  };

  delete = (index) => {
    axios
      .post(
        "http://34.227.47.234:5000/quiz/api/deleteSpecificCourseCategory",
        {
          id: this.state.ordersData.data.feed[index].id,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if(res.data.status == 200){
          this.getOrdersFromDatabase();
        }
      })
      .catch((err) => {});
  };

  renderTableData() {
    return (
      <Table striped bordered hover>
        <thead class="thead-dark">
          <tr>
            <th style={{ textAlign: "center" }}>#</th>
            <th style={{ textAlign: "center" }}>Title</th>
            <th style={{ textAlign: "center" }}>Update</th>
            <th style={{ textAlign: "center" }}>Remove</th>
          </tr>
        </thead>
        <tbody>
          {this.state.ordersData.data.feed.map((order, index) => {
            const { title, signType, description, url } = order;
            return (
              <tr>
                <td style={{ textAlign: "center" }}>{index + 1}</td>
                <td style={{ textAlign: "center" }}> {title}</td>
                <td style={{ textAlign: "center" }}>
                  {this.updateButton(index)}
                </td>
                <td style={{ textAlign: "center" }}>
                  {this.deleteButton(index)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }

  render() {
    return (
      this.state.isUpdate
      ?   <>
      <PanelHeader size="sm" />
      <div className="content">
        <Row>
          <Col md="8">
            <Card>
              <CardHeader>
                <h5 className="title">Update Course Category</h5>
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
                      style={{textAlign: "center", marginLeft :100}}
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
                        Update Category
                      </Button>
                    </FormGroup>
                      }
                       <button
                            type="button"
                            class="btn btn-primary"
                            onClick={this.cancelUpdate}
                              style={{
                                marginTop: - 108,
                                marginLeft: -50
                              }}
                              // onClick={this.addProduct}
                            >
                              Cancel 
                            </button>
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
      : <>
      <PanelHeader size="sm" />
      <div className="content">
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <CardTitle tag="h4">View Course Categories</CardTitle>
              </CardHeader>
              <CardBody>
                {this.state.order ? (
                  this.renderTableData()
                ) : (
                <div>
                  <span style={{ color: "red" }}>{this.productStatus}</span>
                  {this.state.isFetchingCategories
                  ? <Loader
                  style={{textAlign: "center"}}
                  type="ThreeDots"
                  color="#00BFFF"
                  height={30}
                  width={30}
                 />
                  :  <span></span>
                  } 
                </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
    );
  }
}

export default CourseCategoryList;
