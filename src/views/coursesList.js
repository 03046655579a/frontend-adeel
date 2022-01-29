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

class CoursesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: false,
      ordersData: "",
      isFetchingCategories: true,
      isUpdate: false,
      SignName: "",
      SignType: "",
      category: "",
      description: "",
      description2: "",
      description3: "",
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
    this.handleDescription = this.handleDescription.bind(this);
    this.handleDescription2 = this.handleDescription2.bind(this);
    this.handleDescription3 = this.handleDescription3.bind(this);
    this.handleSignType = this.handleSignType.bind(this);
    this.onDropdownSelected = this.onDropdownSelected.bind(this);
    this.handleProductDescription = this.handleProductDescription.bind(this);
    this.getChckeboxValue = this.getChckeboxValue.bind(this);
    this.addProduct = this.addProduct.bind(this);
  }

  componentDidMount() {
    this.getOrdersFromDatabase();
  }

  onDropdownSelected(e) {
    console.log("THE VAL", e.target.value);
    this.setState({
     category: e.target.value
   });
 }

 getChckeboxValue(e) {
  this.setState({
       language  : !this.state.language
  }, () => {
    console.log("language", this.state.language)
  })
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

  handleDescription2(event) {
    this.setState({
      description2: event.target.value,
    });
  }

  handleDescription3(event) {
    this.setState({
      description3: event.target.value,
    });
  }

  singleFileUploadHandler = (  ) => {
    this.setState({
      isLoading: true
    })
    if (
      this.state.description.length <= 0 
    ) {
      this.errorText = "Please add course description *";
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
    }   else if (this.state.description.length <= 0) {
      this.errorText = "Description is Required";
      this.successText = "";
      this.setState({
        error: true,
        isLoading: false
      });
    } else {
      const data = new FormData();
    if ( this.state.selectedFile  != null) {
      var url = 'https://drive-now.herokuapp.com/quiz/api/uploadImage';
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
      this.addProduct()
    }
  }  
  };

  addProduct() {
      axios
        .post(
          "https://drive-now.herokuapp.com/quiz/api/updateSpecificCourse",
          {
            id: this.state.recordId,
            description: this.state.description,
            url: this.state.uploadedImageUrl,
            category: this.state.category,
            description2: this.state.description2,
            description3: this.state.description3,
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
          if (res.data.status === 200) {
            this.errorText = "";
            this.successText = "Course Update successfully *";
            this.setState({
              register: true,
              SignName: "",
              SignType: "",
              description: "",
              selectedFile: null,
              isLoading: false,
              isUpdate: false,
              description2: "",
              description3: "",
            });
            this.getOrdersFromDatabase()
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
          this.errorText = "Something went wrong *";
          this.setState({
            error: true,
            isLoading: false
          });
        });
  }

  //end

  getOrdersFromDatabase() {
    axios
      .get("https://drive-now.herokuapp.com/quiz/api/getAllCourses")
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
          this.productStatus = "No Course Exist";
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
          style={{width: 100, height:80}}
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
         category: this.state.ordersData.data.feed[index].category,
         description: this.state.ordersData.data.feed[index].description,
         description2: this.state.ordersData.data.feed[index].description2,
         description3: this.state.ordersData.data.feed[index].description3,
         uploadedImageUrl: this.state.ordersData.data.feed[index].url,
         recordId: this.state.ordersData.data.feed[index].id,
         language: this.state.ordersData.data.feed[index].language,
     });
  };

  delete = (index) => {
    axios
      .post(
        "https://drive-now.herokuapp.com/quiz/api/deleteSpecificCourse",
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
            <th style={{ textAlign: "center" }}>Sign Image</th>
            <th style={{ textAlign: "center" }}>Description</th>
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
                <td style={{ textAlign: "center" }}>
                  {this.showSignImage(url)}
                </td>
                <td style={{ textAlign: "center" }}>{description}</td>
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
               <h5 className="title">Update Course</h5>
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
                        {/* <FormGroup style={{marginLeft: 20}}>
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
                       <label>Select Course Category *</label>
                       <Input type="text" 
                       style={{height: 50}}  
                       disabled
                       value={this.state.category}
                       >
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
                      <Col className="pr-1" md="12">
                        <FormGroup>
                          <label>Course Description Paragraph 1 *</label>
                          <Input
                            placeholder="Paragraph 1"
                            type="text"
                            value={this.state.description}
                            onChange={this.handleDescription}
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col className="pr-1" md="12">
                        <FormGroup>
                          <label>Course Description Paragraph 2 *</label>
                          <Input
                            placeholder="Paragraph 2"
                            type="text"
                            value={this.state.description2}
                            onChange={this.handleDescription2}
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col className="pr-1" md="12">
                        <FormGroup>
                          <label>Course Description Paragraph 3 *</label>
                          <Input
                            placeholder="Paragraph 3"
                            type="text"
                            value={this.state.description3}
                            onChange={this.handleDescription3}
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
                     {this.state.isLoading
                     ? <Col className="pr-1" md="4">
                     <FormGroup>
                     <br/>
                     <br/>
                     <Loader
                     style={{textAlign: "center",  marginLeft :100}}
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
                       Update Course
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
                 :     this.state.uploadedImageUrl != null  
                 ?  <img
                      alt="..."
                      className="avatar border-gray"
                      src={this.state.uploadedImageUrl}
                       />
                       :  <img
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
     :   <>
     <PanelHeader size="sm" />
     <div className="content">
       <Row>
         <Col xs={12}>
           <Card>
             <CardHeader>
               <CardTitle tag="h4">View Courses</CardTitle>
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

export default CoursesList;
