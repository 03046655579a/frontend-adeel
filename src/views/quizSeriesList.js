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

class QuizSeriesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: false,
      ordersData: "",
      isFetchingCategories: true,
      isUpdate: false,
      SignName: "",
      SignType: "",
      recordId: "",
      Description: "",
      category: "",
      uploadedImageUrl: null,
      error: false,
      register: false,
      selectedFile: null,
      file : null,
      order: false,
      ordersData: null,
      seriesNumber: -1,
      seriesError: '',
      isLoading: false,
      isaddingseries: false,
      categoryError: ''
    };

    this.fileField = React.createRef();
    this.onDropdownSelected = this.onDropdownSelected.bind(this);
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

 onDropdownSelected(e) {
    console.log("THE VAL", e.target.value);
    this.setState({
     category: e.target.value
   })
   
    
    //here you will see the current selected value of the select input
 }

  handleSignName(event) {
    this.setState({
      SignName: event.target.value,
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
    if(this.state.category != 'Select Category'){
      this.errorText = "";
      this.successText = "";
    this.setState({
      isaddingseries: true
    })
    if (
      this.state.category.length <= 0 &&
      this.state.seriesNumber == -1 
    ) {
      this.errorText = "Please fill all fields *";
      this.successText = "";
      this.setState({
        error: true,
        isaddingseries: false
      });
    } else if (this.state.category.length <= 0) {
      this.errorText = "Please select category *";
      this.successText = "";
      this.setState({
        error: true,
        isaddingseries: false
      });
    } else if (this.state.seriesNumber == -1) {
      this.errorText = "Series number is not valid *";
      this.successText = "";
      this.setState({
        error: true,
        isaddingseries: false
      });
    }  else {
      const data = new FormData();
    if ( this.state.selectedFile ) {
      var url = 'http://BASE_URL:3000/quiz/api/uploadImage';
      data.append('File', this.state.file );
      axios.post( url, data, {
      headers: {
       'Access-Control-Allow-Origin': 'http://localhost:3000',
       'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      }
     })
      .then( ( response ) => {
        console.log("response : ",response);
        if(response.data.code == 200){
           this.setState({
            uploadedImageUrl: response.data.url
           });
           this.addProduct();
        }
      }).catch( ( error ) => {
      console.log("error",error);
     });
    } else {
      this.errorText = "Image is required for series*";
      this.successText = "";
      this.setState({
        error: true,
        isaddingseries: false
      });
    }
  }  
 }
};

  addProduct() {
      axios
        .post(
          "http://BASE_URL:3000/quiz/api/updateSpecificSeries",
          {
            id: this.state.recordId,  
            category: this.state.category,
            number: this.state.seriesNumber,
            url: this.state.uploadedImageUrl,
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
            this.successText = "Series Updated successfully *";
            this.setState({
              register: true,
              SignName: "",
              SignType: "",
              Description: "",
              selectedFile: null,
              isaddingseries: false,
              isUpdate: false
            });
           this.getOrdersFromDatabase()
          } else if (res.data.status === 400) {
            this.successText = "";
            this.errorText = "Something went wrong *";
            this.setState({
              error: true,
              isaddingseries: false
            });
          }
        })
        .catch((err) => {
          console.log("error", err);
          this.setState({
            isaddingseries: false
          })
        });
  }

  getOrdersFromDatabase() {
    axios
      .get("http://BASE_URL:3000/quiz/api/getAllSeries")
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
          this.productStatus = "No Series Exist";
          this.setState({
            order: false,
            isFetchingCategories: false
          });
        }
      })
      .catch((err) => {
        this.productStatus =
          " An error occured while fetching series List";
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

  update = (index) => {
    this.errorText = "";
    this.successText = "";
     this.setState({
         isUpdate: true,
         recordId: this.state.ordersData.data.feed[index].id,
         category: this.state.ordersData.data.feed[index].category,
         seriesNumber: this.state.ordersData.data.feed[index].number,
     });

  };

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

  delete = (index) => {
    axios
      .post(
        "http://BASE_URL:3000/quiz/api/deleteSpecificSeries",
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

  cancelUpdate = () => {
    this.setState({
        isUpdate : false,
        isLoading: false
    })
  }

  renderTableData() {
    return (
      <Table striped bordered hover>
        <thead class="thead-dark">
          <tr>
            <th style={{ textAlign: "center" }}>#</th>
            <th style={{ textAlign: "center" }}>Series Image</th>
            <th style={{ textAlign: "center" }}>Category</th>
            <th style={{ textAlign: "center" }}>Series Number</th>
            <th style={{ textAlign: "center" }}>Update</th>
            <th style={{ textAlign: "center" }}>Delete</th>
          </tr>
        </thead>
        <tbody>
          {this.state.ordersData.data.feed.map((order, index) => {
            const { category, number, description, url } = order;
            return (
              <tr>
                <td style={{ textAlign: "center" }}>{index + 1}</td>
                <td style={{ textAlign: "center" }}>
                  {this.showSignImage(url)}
                </td>
                <td style={{ textAlign: "center" }}> {category}</td>
                <td style={{ textAlign: "center" }}>{number}</td>
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
      ? <>
      <PanelHeader size="sm" />
      <div className="content">
        <Row>
          <Col md="8">
            <Card>
              <CardHeader>
                <h5 className="title">Update Quiz Series</h5>
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
                      {/* <FormGroup>
                        {this.state.seriesNumber == -1 
                        ? <Col className="px-1" md="3">
                        <FormGroup>
                        </FormGroup>
                       </Col>
                        :  <FormGroup>
                          <label>New Series Number</label>
                        <Input
                            defaultValue={this.state.seriesNumber}
                            disabled
                            type="text"
                          />
                        </FormGroup>
                        }
                      </FormGroup> */}
                    </Col>
                    <Col className="pl-1" md="4">
                      <FormGroup></FormGroup>
                    </Col>
                  </Row>
                  <Row>
                  <Col  md="12">
                      <FormGroup>
                        <label>Category *</label>
                        <Input 
                        disabled
                        type="text" 
                        style={{height: 50}}  
                        value={this.state.category}
                        >
                      </Input>
                      </FormGroup>
                    </Col>
                    
                  </Row>
                  <Row>
                    <Col md="4">
                    <FormGroup>
                          <label>Series Number</label>
                        <Input
                            defaultValue={this.state.seriesNumber}
                            disabled
                            type="text"
                          />
                        </FormGroup>
                        </Col>
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
                      {this.state.isaddingseries
                      ? <Col className="pr-1" md="4">
                      <FormGroup>
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
                        Update Series
                      </Button>
                    </FormGroup> }
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
          <Col md="4">
            <Card className="card-user">
              <div className="image">
                {/* <img alt="..." src={require("assets/img/bg5.jpg")} /> */}
              </div>
              <CardBody>
                <div className="author">
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    
                    {this.state.selectedFile != null 
                    ?   <img
                          alt="..."
                          className="avatar border-gray"
                          // src={require("assets/img/bg5.jpg")}
                          src={this.state.selectedFile}
                       />
                  :    <img
                        alt="..."
                        className="avatar border-gray"
                        src={require("assets/img/bg5.jpg")}
                    />
                  }
                    <h5 className="title">
                      {/* {reactLocalStorage.get("storename")} */}
                    </h5>
                  </a>
                  <p className="description">
                    {/* {reactLocalStorage.get("email")} */}
                  </p>
                </div>
                <div className="description text-center" >
                  <Button type="button" onClick={this.handleClick} class="btn btn-outline-secondary">Upload File</Button>
                  <input
                      ref={input => this.fileField = input}
                      type="file"
                      style={{ display: "none" }}
                      onChange={this.singleFileChangedHandler}
                      accept=".jpg,.jpeg,.png"
                    />
                </div>
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
                <CardTitle tag="h4">View Quiz Series</CardTitle>
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

export default QuizSeriesList;
