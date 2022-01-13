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

class AddQuestion extends React.Component {
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
      seriesError: "",
      isLoading: false,
      selectedSeriesNumber: 0,
      seriesSelectionList: null,
      question: '',
      options1: '',
      options2: '',
      options3: '',
      options4: '',
      option1Key: '',
      option2Key: '',
      option3Key: '',
      option4Key: '',
      description: '',
      isResponseReceived: false,
      categoriesstatus: null,
      categoryError: '',
      questionType: '',
      language: false
    };
    this.fileField = React.createRef();
    this.onDropdownSelected = this.onDropdownSelected.bind(this);
    this.onSeriesDropdownSelected = this.onSeriesDropdownSelected.bind(this);
    this.onOption1DropdownSelected = this.onOption1DropdownSelected.bind(this);
    this.onOption2DropdownSelected = this.onOption2DropdownSelected.bind(this);
    this.onOption3DropdownSelected = this.onOption3DropdownSelected.bind(this);
    this.onOption4DropdownSelected = this.onOption4DropdownSelected.bind(this);
    this.handleOption1 = this.handleOption1.bind(this);
    this.handleOption2 = this.handleOption2.bind(this);
    this.handleOption3 = this.handleOption3.bind(this);
    this.handleOption4 = this.handleOption4.bind(this);
    this.handleQuestionTitle = this.handleQuestionTitle.bind(this);
    this.handleQuestionDescription = this.handleQuestionDescription.bind(this);
    this.handleProductDescription = this.handleProductDescription.bind(this);
    this.addProduct = this.addProduct.bind(this);
    this.getChckeboxValue = this.getChckeboxValue.bind(this);
  }

    data = [{
       'select': 'select option'
     },
    {
       'select': 'true'
    },{
       'select': 'false' 
    }]

  componentDidMount() {
    this.getCategoriesFromDatabase();
  }

  getCategoriesFromDatabase() {
    axios
      .get("http://BASE_URL:3000/quiz/api/getCategories")
      .then((res) => {
        console.log("response : ",res);
        if (res.data.status === 200) {
          var temp = [];
          for(var i = 0 ; i < res.data.feed.length ; i++ ){
            if(i == 0){
              var obj = {
                'description': 'select series',
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
            categoriesstatus: null
          });
          console.log("order data  :",this.state.ordersData);
        } else {
          this.setState({
            order: false,
            categoriesstatus: "Create a category first to add a Question *"
          });
        }
      })
      .catch((err) => {
        console.log("error",err);
        this.setState({
          order: false,
          categoriesstatus: " An error occured while fetching Categories List"
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
            var temp = [];
            for(var i = 1 ; i <= res.data.message ; i++ ){
              if(i == 1){
                var obj = {
                  'number': 'select series'
                } 
                temp.push(obj);
              }
              var obj = {
                'number': i
              } 
              temp.push(obj);
            }
            this.setState({
              seriesSelectionList: [...temp],
              seriesNumber: res.data.message,
              isLoading: false,
            },
            ()=>{
              console.log("series list :",this.state.seriesSelectionList);
            });
          } else if(res.data.code === 201){
            this.setState({
              seriesNumber: -1,
              seriesError: 'Create a series for this category first *',
              isLoading: false
            });
          } else {
            this.setState({
              seriesError: 'Server side issue',
              isLoading: false
            });
          }
        })
        .catch((err) => {
          console.log("error",err);
          this.setState({
            seriesError: 'Server side issue',
            isLoading: false
          });
        });
    }else {
      this.setState({
        seriesNumber: -1,
        seriesError: '',
        isLoading: false
      });
    }
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
    category: e.target.value,
    selectedSeriesNumber: 0
  },
  ()=>{
    this.getSeriesCount();
  });
}

onSeriesDropdownSelected(e) {
  console.log("series value : ", e.target.value);
  this.setState({
    selectedSeriesNumber: e.target.value
 });
}

onOption1DropdownSelected(e) {
  if(e.target.value != 'select option'){
    this.setState({
       option1Key: e.target.value
    })
  }else {
    this.setState({
      option1Key: ''
   })
  }
}

onOption2DropdownSelected(e) {
  if(e.target.value != 'select option'){
    this.setState({
       option2Key: e.target.value
    })
  }else {
    this.setState({
      option2Key: ''
   })
  }
}

onOption3DropdownSelected(e) {
  if(e.target.value != 'select option'){
    this.setState({
       option3Key: e.target.value
    })
  } else {
    this.setState({
      option3Key: ''
   })
  }
}

onOption4DropdownSelected(e) {
  if(e.target.value != 'select option'){
    this.setState({
       option4Key: e.target.value
    })
  }else {
    this.setState({
      option4Key: ''
   })
  }
}

setQuestionType () {
  var array = [this.state.option1Key, this.state.option2Key, this.state.option3Key, this.state.option4Key];
  console.log("array : ",array);
  var count = 0;
  for (var i = 0 ; i < 3 ; i++) {
     if(array[i] != '') {
        if(array[i] == 'true'){
          count++
        }
     }
  }
  if(count == 1){
      this.setState({
        questionType: 'single'
      })
  } else {
    this.setState({
      questionType: 'multiple'
    })
  }

}

  handleClick = () =>  {
    this.fileField.click();
 };

 handleQuestionTitle(event) {
    this.setState({
      question: event.target.value,
    });
  }

  handleQuestionDescription(event) {
    this.setState({
      description: event.target.value,
    });
  }

  handleOption1(event) {
    this.setState({
      options1: event.target.value,
    });
  }
  handleOption2(event) {
    this.setState({
      options2: event.target.value,
    });
  }
  handleOption3(event) {
    this.setState({
      options3: event.target.value,
    });
  }
  handleOption4(event) {
    this.setState({
      options4: event.target.value,
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
    this.setQuestionType()
    this.errorText = "";
      this.successText = "";
    this.setState({
      isResponseReceived: true,
    })
    if (
      this.state.category.length <= 0 &&
      this.state.selectedSeriesNumber == 0  &&
      this.state.question.length <= 0 &&
      this.state.options1.length <= 0 &&
      this.state.options2.length <= 0 &&
      this.state.option1Key.length <= 0 &&  
      this.state.option2Key.length <= 0 &&  
      this.state.description.length <= 0 
    ) {
      this.errorText = "Please fill all fields *";
      this.successText = "";
      this.setState({
        error: true,
        isResponseReceived: false
      });
    } else if (this.state.category.length <= 0 ||
         this.state.category === 'Select Category') {
      this.errorText = "Please select category *";
      this.successText = "";
      this.setState({
        error: true,
        isResponseReceived: false
      });
    } else if (this.state.description.length <= 10 ) {
      this.errorText = "Please enter description for the question *";
      this.successText = "";
      this.setState({
        error: true,
        isResponseReceived: false
      });
   } else if (this.state.selectedSeriesNumber == 0 || 
      this.state.selectedSeriesNumber === 'select series' ) {
      this.errorText = "Series number is not valid *";
      this.successText = "";
      this.setState({
        error: true,
        isResponseReceived: false
      });
    } 
    else if (this.state.question.length <= 10 ) {
      this.errorText = "Question must contain atleast 10 characters *";
      this.successText = "";
      this.setState({
        error: true,
        isResponseReceived: false
      });
    }else if (this.state.options1.length <= 0) {
      this.errorText = "Option 1 is not valid *";
      this.successText = "";
      this.setState({
        error: true,
        isResponseReceived: false
      });
    }else if (this.state.options2.length <= 0) {
      this.errorText = "Option 2 is not valid *";
      this.successText = "";
      this.setState({
        error: true,
        isResponseReceived: false
      });
    }  else if (this.state.option1Key.length <= 0) {
      this.errorText = "Select label for Option 1 *";
      this.successText = "";
      this.setState({
        error: true,
        isResponseReceived: false
      });
    }else if (this.state.option2Key.length <= 0) {
      this.errorText = "Select label for Option 2 *";
      this.successText = "";
      this.setState({
        error: true,
        isResponseReceived: false
      });
    } else if (this.state.options3.length > 0 && this.state.option3Key.length <= 0)  {
      this.errorText = "Select label for Option 3 *";
      this.successText = "";
      this.setState({
        error: true,
        isResponseReceived: false
      });
    }  else if (this.state.options4.length > 0 && this.state.option4Key.length <= 0)  {
      this.errorText = "Select label for Option 4 *";
      this.successText = "";
      this.setState({
        error: true,
        isResponseReceived: false
      });
    } else if (this.state.option1Key == 'true' && this.state.option2Key == 'true' && this.state.option3Key == 'true' && this.state.option4Key == 'true') {
      this.errorText = "One Label Must be False*";
      this.successText = "";
      this.setState({
        error: true,
        isResponseReceived: false
      });
    }else if (this.state.option1Key == 'false' && this.state.option2Key == 'false' && this.state.option3Key == 'false' && this.state.option4Key == 'false') {
      this.errorText = "One Label Must be True*";
      this.successText = "";
      this.setState({
        error: true,
        isResponseReceived: false
      });
    } else if(this.state.option1Key == 'false' && this.state.option2Key == 'false' && this.state.option3Key == '' && this.state.option4Key == '') {
      this.errorText = "One Label Must be True*";
      this.successText = "";
      this.setState({
        error: true,
        isResponseReceived: false
      });
    } else if(this.state.option1Key == 'true' && this.state.option2Key == 'true' && this.state.option3Key == '' && this.state.option4Key == '') {
      this.errorText = "One Label Must be False*";
      this.successText = "";
      this.setState({
        error: true,
        isResponseReceived: false
      });
    } else if(this.state.option1Key == 'false' && this.state.option2Key == 'false' && this.state.option3Key == 'false' && this.state.option4Key == '') {
      this.errorText = "One Label Must be True*";
      this.successText = "";
      this.setState({
        error: true,
        isResponseReceived: false
      });
    } else if(this.state.option1Key == 'true' && this.state.option2Key == 'true' && this.state.option3Key == 'true' && this.state.option4Key == '') {
      this.errorText = "One Label Must be False*";
      this.successText = "";
      this.setState({
        error: true,
        isResponseReceived: false
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
     });
    } else {
      this.errorText = "Image is required for series*";
      this.successText = "";
      this.setState({
        error: true,
        isResponseReceived: false
      });
    }
  }  
  };

  addProduct() {
      axios
        .post(
          "http://BASE_URL:3000/quiz/api/addQuestion",
          {
            category: this.state.category,
            series: this.state.selectedSeriesNumber,
            url: this.state.uploadedImageUrl,
            question: this.state.question,
            option1: this.state.options1,
            option2: this.state.options2,
            option3: this.state.options3,
            option4: this.state.options4,
            option1Key: this.state.option1Key == 'true' ? true : false,
            option2Key: this.state.option2Key == 'true' ? true : false,
            option3Key: this.state.option3Key == '' ? false : this.state.option3Key == 'true' ? true : false,    
            option4Key: this.state.option4Key == '' ? false : this.state.option4Key == 'true' ? true : false,
            questionType: this.state.questionType,
            description: this.state.description,
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
            this.successText = "Question added successfully *";
            this.setState({
              register: true,
              question: "",
              description: '',
              options1: "",
              options2: "",
              options3: "",
              options4: "",
              Description: "",
              selectedFile: null,
              isResponseReceived: false
            });
          } else if (res.data.code === 400) {
            this.successText = "";
            this.errorText = "Something went wrong *";
            this.setState({
              error: true,
              isResponseReceived: false
            });
          }
        })
        .catch((err) => {
          console.log("error", err);
          this.setState({
            isResponseReceived: false
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
                  <h5 className="title">Add Question</h5>
                </CardHeader>
                <CardBody>
                  <Form>
                    <Row>
                      <Col className="pr-1" md="3">
                        <FormGroup style={{marginLeft: 20}}>
                          <Input
                            onClick={this.getChckeboxValue}
                            type="checkbox"
                            value={this.state.language}
                          />French
                        </FormGroup>
                      </Col>
                      <Col className="px-1" md="8">
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
                            :  this.state.seriesError != ""
                               ? <Col className="px-1" md="7">
                               <FormGroup>
                               <label></label><br/>
                               <label style={{color: 'red'}}>{this.state.seriesError}</label>
                               </FormGroup>
                              </Col>
                               : <Col className="px-1" md="3">
                               <FormGroup>
                               </FormGroup>
                              </Col>
                          :  <FormGroup>
                            <label>Select Series Number *</label>
                          <Input
                              type="select"
                              style={{height: 50}}  
                              onChange={this.onSeriesDropdownSelected} 
                            >
                               {this.state.seriesSelectionList.map((e, key) => {
                              return <option key={key} value={e.number}>{e.number}</option>;
                          })}
                              </Input>
                          </FormGroup>
                          }
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
                      : this.state.categoriesstatus != null
                      ? <Col className="pr-1" md="12">
                      <FormGroup>
                      <label style={{color: 'red'}}>{this.state.categoriesstatus}</label>
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
                      <Col md="12">
                      <label>Question Title *</label>
                          <Input
                            placeholder="A red sign in the picture means ?"
                            type="text"
                            value={this.state.question}
                            onChange={this.handleQuestionTitle}
                          />
                      </Col>
                    </Row>
                    <br/>
                    <Row>
                      <Col md="12">
                      <label>Question Description *</label>
                          <Input
                            placeholder="Please enter description.."
                            type="text"
                            value={this.state.description}
                            onChange={this.handleQuestionDescription}
                          />
                      </Col>
                    </Row>
                    <br/>
                    <Row style={{marginRight: 0.5}}>
                      <Col className="pr-1" md="4">
                        <FormGroup>
                          <label > Option 1 *</label>
                          <Input
                            type="text"
                            value={this.state.options1}
                            onChange={this.handleOption1}
                            maxLength={80}
                          />
                        </FormGroup>
                      </Col>
                      <Col  className="pr-1" md="2">
                      <FormGroup>
                            <label>Label *</label>
                          <Input
                              type="select"
                              style={{height: 45}}  
                              onChange={this.onOption1DropdownSelected} 
                            >
                               {this.data.map((e, key) => {
                              return <option key={key} value={e.select}>{e.select}</option>;
                          })}
                              </Input>
                          </FormGroup>
                      </Col>
                      <Col className="px-1" md="4">
                        <FormGroup>
                          <label >Option 2* </label>
                          <Input
                            type="text"
                            value={this.state.options2}
                            onChange={this.handleOption2}
                            maxLength={80}
                          />
                        </FormGroup>
                      </Col>
                      <Col  className="pr-1" md="2">
                      <FormGroup>
                            <label>Label *</label>
                          <Input
                              type="select"
                              style={{height: 45}}  
                              onChange={this.onOption2DropdownSelected} 
                            >
                               {this.data.map((e, key) => {
                              return <option key={key} value={e.select}>{e.select}</option>;
                          })}
                              </Input>
                          </FormGroup>
                      </Col>
                      </Row>
                      <Row style={{marginRight: 0.5}}>
                      <Col className="pr-1" md="4">
                        <FormGroup>
                          <label > Option 3 *</label>
                          <Input
                            type="text"
                            value={this.state.options3}
                            onChange={this.handleOption3}
                            maxLength={80}
                          />
                        </FormGroup>
                      </Col>
                      <Col  className="pr-1" md="2">
                      <FormGroup>
                            <label>Label *</label>
                          <Input
                              type="select"
                              style={{height: 45}}  
                              onChange={this.onOption3DropdownSelected} 
                            >
                               {this.data.map((e, key) => {
                              return <option key={key} value={e.select}>{e.select}</option>;
                          })}
                              </Input>
                          </FormGroup>
                      </Col>
                      <Col className="px-1" md="4">
                        <FormGroup>
                          <label >Option 4* </label>
                          <Input
                            type="text"
                            value={this.state.options4}
                            onChange={this.handleOption4}
                            maxLength={80}
                          />
                        </FormGroup>
                      </Col>
                      <Col  className="pr-1" md="2">
                      <FormGroup>
                            <label>Label *</label>
                          <Input
                              type="select"
                              style={{height: 45}}  
                              onChange={this.onOption4DropdownSelected} 
                            >
                               {this.data.map((e, key) => {
                              return <option key={key} value={e.select}>{e.select}</option>;
                          })}
                              </Input>
                          </FormGroup>
                      </Col>
                      </Row>
                      <Row>
                      <Col className="pr-1" md="4">
                      </Col>
                      <Col className="px-1" md="4">
                      </Col>
                      <Col className="pl-1" md="4">
                        {
                          this.state.isResponseReceived 
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
                            Add Question
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

export default AddQuestion;

// BASE_URL:3000