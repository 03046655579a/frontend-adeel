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

class AddSignCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      SignName: "",
      SignType: "",
      category: "",
      description: "",
      uploadedImageUrl: null,
      error: false,
      register: false,
      selectedFile: null,
      file : null,
      isLoading: false,
      ordersData: null,
      categoryError: ''
    };
    this.fileField = React.createRef();
    this.handleDescription = this.handleDescription.bind(this);
    this.handleSignType = this.handleSignType.bind(this);
    this.onDropdownSelected = this.onDropdownSelected.bind(this);
    this.handleProductDescription = this.handleProductDescription.bind(this);

    this.addProduct = this.addProduct.bind(this);
  }



  onDropdownSelected(e) {
    console.log("THE VAL", e.target.value);
    this.setState({
     category: e.target.value
   });
 }

  handleClick = () =>  {
    this.fileField.click();
 };

 handleDescription(event) {
    this.setState({
      description: event.target.value,
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
    this.setState({
      isLoading: true
    })
    if (
      this.state.description.length <= 0 
    ) {
      this.errorText = "Please add Sign Category title *";
      this.successText = "";
      this.setState({
        error: true,
        isLoading: false
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
            uploadedImageUrl: response.data.url,
           });
           this.addProduct();
        }
      }).catch( ( error ) => {
      console.log("error new",error);
      this.errorText = "Something went wrong *";
      this.setState({
        error: true,
        isLoading: false
      });
     });
    } else {
      this.errorText = "Sign Category image is required *";
      this.successText = "";
      this.setState({
        error: true,
        isLoading: false
      });
    }
  }  
  };

  addProduct() {
      axios
        .post(
          "http://BASE_URL:3000/quiz/api/addSignCategory",
          {
            title: this.state.description,
            url: this.state.uploadedImageUrl
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
            this.successText = "Sign Category added successfully *";
            this.setState({
              register: true,
              SignName: "",
              SignType: "",
              description: "",
              selectedFile: null,
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
          this.errorText = "Something went wrong *";
          this.setState({
            error: true,
            isLoading: false
          });
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
                  <h5 className="title">Add Sign Category</h5>
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
                      <Col className="pr-1" md="12">
                        <FormGroup>
                          <label>Sign Category Title*</label>
                          <Input
                            placeholder="Add Sign Category Title" 
                            type="text"
                            value={this.state.description}
                            onChange={this.handleDescription}
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
                        :  <FormGroup>
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
    );
  }
}

export default AddSignCategory;
