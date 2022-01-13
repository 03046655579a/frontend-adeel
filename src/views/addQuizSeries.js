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

class AddQuizSeries extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      SignName: "",
      SignType: "",
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
    this.getCategoriesFromDatabase();
  }

  getCategoriesFromDatabase() {
    axios
      .get("http://BASE_URL:3000/quiz/api/getCategories")
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
            categoryError: 'Create a category for this series first *',
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

  getSeriesCount() {
    if(this.state.category != 'Select Category'){
      this.setState({
        seriesNumber: -1,
        isLoading: true
      });
      axios
        .post("http://BASE_URL:3000/quiz/api/getSeriesCount",{
          category: this.state.category,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log("response : ",res);
          if (res.data.code === 200) {
            this.setState({
              seriesNumber: res.data.message + 1,
              isLoading: false
            });
          } else if(res.data.code === 201){
            this.setState({
              seriesNumber: 1,
              isLoading: false
            });
          } else {
            this.setState({
              seriesError: 'Server issue',
              isLoading: false
            });
          }
        })
        .catch((err) => {
          console.log("error",err);
          this.setState({
            seriesError: 'Server issue',
            isLoading: false
          });
        });
    }
  }
 
onDropdownSelected(e) {
   console.log("THE VAL", e.target.value);
   this.setState({
    category: e.target.value
  },
  ()=>{
    this.getSeriesCount();
  })
  
   
   //here you will see the current selected value of the select input
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
          "http://BASE_URL:3000/quiz/api/addSeries",
          {
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
          if (res.data.code === 200) {
            this.errorText = "";
            this.successText = "Series added successfully *";
            this.setState({
              register: true,
              SignName: "",
              SignType: "",
              Description: "",
              selectedFile: null,
              isaddingseries: false
            });
            this.getSeriesCount()
          } else if (res.data.code === 400) {
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

  

  render() {
    return (
      <>
        <PanelHeader size="sm" />
        <div className="content">
          <Row>
            <Col md="8">
              <Card>
                <CardHeader>
                  <h5 className="title">Add Quiz Series</h5>
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
                      {
                        this.state.ordersData != null
                        ?  <Col  md="12">
                        <FormGroup>
                          <label>Select Quiz Category *</label>
                          <Input 
                          type="select" 
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
                      <Col md="4">
                      {this.state.seriesNumber == -1 
                          ? 
                            this.state.isLoading 
                            ? <Col className="pr-1" md="3">
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
                            :  <Col className="px-1" md="3">
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
                          Add Quiz Series
                        </Button>
                      </FormGroup> }
                        
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

export default AddQuizSeries;
