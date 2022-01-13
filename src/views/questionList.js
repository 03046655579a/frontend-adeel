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

class QuestionsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: false,
      ordersData: "",
      isFetchingQuestions: true,
      isUpdate: false,
      recordId: "",
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
      questionType: ''
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
    this.getOrdersFromDatabase();
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
  for (var i = 0 ; i < 4 ; i++) {
     if(array[i] != '') {
      if(array[i] == 'true'){
        count = count + 1
      }
     }
     console.log(i)
  }

  console.log("count",count)
  if(count == 1){
      this.setState({
        questionType: 'single'
      }, () => {
         this.addProduct()
      } )
  } else {
    this.setState({
      questionType: 'multiple'
    }, () => {
        this.addProduct()
      } )
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
    if ( this.state.selectedFile != null ) {
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
           this.setQuestionType()
        }
      }).catch( ( error ) => {
      console.log("error",error);
     });
    } else {
        this.setQuestionType();
    }
  }  
  };

  addProduct() {
      axios
        .post(
          "http://BASE_URL:3000/quiz/api/updateSpecificQuestion",
          {
            id: this.state.recordId,  
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
            description: this.state.description
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
            this.successText = "Question Updated successfully *";
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
              isResponseReceived: false,
              isUpdate: false 
            });
            this.getOrdersFromDatabase();
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

  // end

  getOrdersFromDatabase() {
    axios
      .get("http://BASE_URL:3000/quiz/api/getAllQuestions")
      .then((res) => {
        console.log("response : ",res.data.message);
        if (res.data.code === 200) {
          this.productStatus = "";
          this.setState({
            order: true,
            ordersData: res,
          });
          console.log("questions data  :",this.state.ordersData);
        } else {
          this.productStatus = "No Question Exist";
          this.setState({
            order: false,
            isFetchingQuestions: false
          });
        }
      })
      .catch((err) => {
        this.productStatus =
          " An error occured while fetching question's List";
        this.setState({
          order: false,
          isFetchingQuestions: false
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

  update = (index) => {
    this.errorText = "";
    this.successText = "";
    this.setState({
        isUpdate: true,
        category:  this.state.ordersData.data.message[index].category,
        selectedSeriesNumber:  this.state.ordersData.data.message[index].seriesNumber,
        question:   this.state.ordersData.data.message[index].title,
        description: this.state.ordersData.data.message[index].description, 
        options1:  this.state.ordersData.data.message[index].options[0].label ,
        options2:   this.state.ordersData.data.message[index].options[1].label ,
        // options3:   this.state.ordersData.data.message[index].options[2].label != null ? "" : this.state.ordersData.data.message[index].options[2].label,
        // options4:  this.state.ordersData.data.message[index].options[3].label != null ? "" : this.state.ordersData.data.message[index].options[3].label,
        uploadedImageUrl:  this.state.ordersData.data.message[index].url,
        recordId: this.state.ordersData.data.message[index].id,
    })
  };

  cancelUpdate = () => {
    this.setState({
        isUpdate : false,
        isLoading: false
    })
  }

  delete = (index) => {
    axios
      .post(
        "http://BASE_URL:3000/quiz/api/deleteSpecificQuestion",
        {
          id: this.state.ordersData.data.message[index].id,
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
            <th style={{ textAlign: "center" }}>Image</th>
            <th style={{ textAlign: "center" }}>Title</th>
            <th style={{ textAlign: "center" }}>Update</th>
            <th style={{ textAlign: "center" }}>Remove</th>
          </tr>
        </thead>
        <tbody>
          {this.state.ordersData.data.message.map((order, index) => {
            const { title, signType, description, url } = order;
            return (
              <tr>
                <td style={{ textAlign: "center" }}>{index + 1}</td>
                <td style={{ textAlign: "center" }}>
                  {this.showSignImage(url)}
                </td>
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
                <h5 className="title">Update Question</h5>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col className="pr-1" md="3">
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
                    <Col className="px-1" md="8">
                     <FormGroup>
                          <label>Series Number *</label>
                        <Input
                            disabled
                            type="text"
                            style={{height: 50}}  
                            value={this.state.selectedSeriesNumber}
                          >
                            
                            </Input>
                        </FormGroup>
                        
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
                        <label>Quiz Category *</label>
                        <Input 
                        type="text" 
                        disabled
                        style={{height: 50}}  
                        value={this.state.category}
                        >
                        
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
                        style={{textAlign: "center",  marginLeft :100}}
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
                          Update Question
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
                  :    this.state.uploadedImageUrl != null  
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
      : <>
      <PanelHeader size="sm" />
      <div className="content">
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <CardTitle tag="h4">View Questions List</CardTitle>
              </CardHeader>
              <CardBody>
                {this.state.order ? (
                  this.renderTableData()
                ) : (
                <div>
                  <span style={{ color: "red" }}>{this.productStatus}</span>
                  {this.state.isFetchingQuestions
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

export default QuestionsList;
