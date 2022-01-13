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

class AddSign extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      SignName: "",
      SignType: "",
      Description: "",
      Description2: "",
      Description3: "",
      category: "",
      uploadedImageUrl: null,
      error: false,
      register: false,
      selectedFile: null,
      file : null,
      isLoading: false,
      ordersData: null,
      categoryError: '',
      language: false
    };
    this.fileField = React.createRef();
    this.handleSignName = this.handleSignName.bind(this);
    this.handleSignType = this.handleSignType.bind(this);
    this.onDropdownSelected = this.onDropdownSelected.bind(this);
    this.handleProductDescription = this.handleProductDescription.bind(this);
    this.handleProductDescription2 = this.handleProductDescription2.bind(this);
    this.handleProductDescription3 = this.handleProductDescription3.bind(this);
    this.getChckeboxValue = this.getChckeboxValue.bind(this);
    this.addProduct = this.addProduct.bind(this);
  }

  componentDidMount() {
    this.getCategoriesFromDatabase();
  }

  getCategoriesFromDatabase() {
    axios
      .get("http://BASE_URL:3000/quiz/api/getSignCategories")
      .then((res) => {
        console.log("response : ",res);
        if (res.data.status === 200) {
          this.productStatus = "";
          var temp = [];
          for(var i = 0 ; i < res.data.feed.length ; i++ ){
            if(i == 0){
              var obj = {
                'description': 'Select Category',
                'title': 'Select Category',
                'id': 'bac23648723'
              } 
              temp.push(obj);
            }  
            temp.push(res.data.feed[i]);
          }
          console.log("temp : ",temp);
          this.setState({
            order: true,
            ordersData: [...temp],
          });
          console.log("order data  :",this.state.ordersData);
        } else {
          this.productStatus = "No Categories Exist";
          this.setState({
            categoryError: 'Create a category for this signs first *',
            order: false,
          });
        }
      })
      .catch((err) => {
        console.log("error",err);
        this.productStatus =
          " An error occured while fetching Categories List";
        this.setState({
          categoryError: 'An error occured while fetching Categories List *',
          order: false,
        });
      });
  }

  getChckeboxValue(e) {
    this.setState({
         language  : !this.state.language
    }, () => {
      console.log("language", this.state.language)
    })
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

  handleProductDescription2(event) {
    this.setState({
      Description2: event.target.value,
    });
  }

  handleProductDescription3(event) {
    this.setState({
      Description3: event.target.value,
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
      this.state.SignName.length <= 0 &&
      this.state.SignType.length <= 0 &&
      this.state.Description.length <= 0 
    ) {
      this.errorText = "Please fill all fields *";
      this.successText = "";
      this.setState({
        error: true,
        isLoading: false
      });
    } else if (this.state.SignName.length <= 0) {
      this.errorText = "Sign title is required *";
      this.successText = "";
      this.setState({
        error: true,
        isLoading: false
      });
    } else if (this.state.category.length <= 0) {
      this.errorText = "Please select category *";
      this.successText = "";
      this.setState({
        error: true,
        isLoading: false
      });
    }  else if (this.state.SignType.length <= 0) {
      this.errorText = "Sign Type is required *";
      this.successText = "";
      this.setState({
        error: true,
        isLoading: false
      });
    } else if (this.state.Description.length <= 0) {
      this.errorText = "Description is required *";
      this.successText = "";
      this.setState({
        error: true,
        isLoading: false
      });
    } else {
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
      this.errorText = "Something wrong with your connection *";
      this.setState({
        error: true,
        isLoading: false
      });
     });
    } else {
      this.errorText = "Sign image is required *";
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
          "http://BASE_URL:3000/quiz/api/addSign",
          {
            SignName: this.state.SignName,
            SignType: this.state.SignType,
            description: this.state.Description,
            imageUrl: this.state.uploadedImageUrl,
            category: this.state.category,
            description2: this.state.Description2,
            description3: this.state.Description3,
            language: this.state.language
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
            this.successText = "Sign added successfully *";
            this.setState({
              register: true,
              SignName: "",
              SignType: "",
              Description: "",
              selectedFile: null,
              isLoading: false,
              Description2: "",
              Description3: ""
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
                  <h5 className="title">Add Traffic Signs</h5>
                </CardHeader>
                <CardBody>
                  <Form>
                    <Row>
                      <Col className="pr-1" md="5">
                      <FormGroup style={{marginLeft: 20}}>
                          <Input
                            onClick={this.getChckeboxValue}
                            type="checkbox"
                            value={this.state.language}
                          />French
                        </FormGroup>
                      </Col>
                      <Col className="pr-1" md="3">
                        {/* <FormGroup >
                          <Input
                            onClick={this.getChckeboxValue}
                            type="checkbox"
                            value={this.state.language}
                          />French
                        </FormGroup> */}
                      </Col>
                      <Col className="pl-1" md="4">
                        <FormGroup></FormGroup>
                      </Col>
                    </Row>
                    <Row>
                    {
                        this.state.ordersData != null
                        ?  <Col  md="12">
                        <FormGroup>
                          <label>Select Sign Category *</label>
                          <Input type="select" 
                          style={{height: 50}}  
                          onChange={this.onDropdownSelected} 
                          >
                            {this.state.ordersData.map((e, key) => {
                              return <option key={key} value={e.title}>{e.title}</option>;
                          })}
                        </Input>
                        </FormGroup>
                      </Col>
                      : this.state.categoryError != ''
                       ? <Col className="pr-1" md="12">
                       <FormGroup>
                       <label style={{color: 'red' , textAlign: 'center'}}>{this.state.categoryError}</label>
                       </FormGroup>
                     </Col>
                     : <Col className="pr-1" md="12">
                     <FormGroup>
                     <Loader
                     style={{textAlign: "center"}}
                     type="ThreeDots"
                     color="#00BFFF"
                     height={30}
                     width={30}
                    /> 
                     </FormGroup>
                   </Col>
                      }
                    </Row>
                    <Row>
                      <Col className="pr-1" md="6">
                        <FormGroup>
                          <label>Sign Title *</label>
                          <Input
                            placeholder="stop and give way"
                            type="text"
                            value={this.state.SignName}
                            onChange={this.handleSignName}
                            maxLength={25}
                          />
                        </FormGroup>
                      </Col>
                      <Col className="pl-1" md="6">
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
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <label>Sign Description Paragraph 1 *</label>
                          <Input
                            placeholder="Paragraph 1"
                            type="text"
                            value={this.state.Description}
                            onChange={this.handleProductDescription}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <label>Sign Description Paragraph 2 *</label>
                          <Input
                            placeholder="Paragraph 2"
                            type="text"
                            value={this.state.Description2}
                            onChange={this.handleProductDescription2}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <label>Sign Description Paragraph 3 *</label>
                          <Input
                            placeholder="Paragraph 3"
                            type="text"
                            value={this.state.Description3}
                            onChange={this.handleProductDescription3}
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
                        {
                          this.state.isLoading 
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
                            Add Traffic Sign
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

export default AddSign;
