import React from "react";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
// reactstrap components
import { Route, Switch, Redirect } from "react-router-dom";
// core components
import DemoNavbar from "components/Navbars/DemoNavbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";
// import routes from "../routes.js";
import adminroutes from "../adminroutes.js";
import { reactLocalStorage } from "reactjs-localstorage";
import TableList from "views/TableList.js";
import UserPage from "views/UserPage.js";
import AddSign from "views/addSign.js";
import AddQuizCategory from "views/addQuizCategory.js";
import AddQuizSeries from "views/addQuizSeries.js";
import AddQuestion from "views/addQuestion.js";
import AddCourse from "views/addCourse.js";
import AddCourseCategory from "views/addCourseCategory.js";
import AddSignCategory from "views/addSignCategory.js";

import QuizCategoryList from "views/quizCategoryList.js";
import QuizSeriesList from "views/quizSeriesList.js"
import QuestionsList from "views/questionList.js"
import signCategoryList from "views/signCategoryList.js"
import CoursesList from "views/coursesList.js";
import CourseCategoryList from "views/courseCategoryList.js";
import signList from "views/signList.js";

var ps;

class Dashboard extends React.Component {
  state = {
    backgroundColor: "blue",
    render: false,
  };
  mainPanel = React.createRef();
  componentDidMount() {
    console.log("StorageAdminPanel", reactLocalStorage.get("currentuser"));
    if (reactLocalStorage.get("currentuser") === "admin") {
      this.routes = [
        {
          path: "/addQuizCategory",
          name: "Add Quiz Category",
          icon: "arrows-1_cloud-upload-94",
          component: AddQuizCategory,
          layout: "/admin",
        },
        {
          path: "/viewQuizCategories",
          name: "View Quiz Categories",
          icon: "arrows-1_cloud-upload-94",
          component: QuizCategoryList,
          layout: "/admin",
        },
        {
          path: "/addQuizSeries",
          name: "Add Quiz Series",
          icon: "arrows-1_cloud-upload-94",
          component: AddQuizSeries,
          layout: "/admin",
        },
        {
          path: "/viewQuizSeries",
          name: "View Quiz Series",
          icon: "arrows-1_cloud-upload-94",
          component: QuizSeriesList,
          layout: "/admin",
        },{
          path: "/AddQuestion",
          name: "Add Questions",
          icon: "arrows-1_cloud-upload-94",
          component: AddQuestion,
          layout: "/admin",
        },{
          path: "/viewQuestions",
          name: "View Questions",
          icon: "arrows-1_cloud-upload-94",
          component: QuestionsList,
          layout: "/admin",
        },
        {
          path: "/addTrafficSignCategories",
          name: "Add Sign Category",
          icon: "arrows-1_cloud-upload-94",
          component: AddSignCategory,
          layout: "/admin",
        },{
          path: "/viewTrafficSignCategories",
          name: "View Sign Categories",
          icon: "arrows-1_cloud-upload-94",
          component: signCategoryList,
          layout: "/admin",
        },
        {
          path: "/addSign",
          name: "Add Signs",
          icon: "arrows-1_cloud-upload-94",
          component: AddSign,
          layout: "/admin",
        },{
          path: "/viewSign",
          name: "View Signs",
          icon: "arrows-1_cloud-upload-94",
          component: signList,
          layout: "/admin",
        },
        {
          path: "/addCourseCategory",
          name: "Add Course Category",
          icon: "arrows-1_cloud-upload-94",
          component: AddCourseCategory,
          layout: "/admin",
        },
        {
          path: "/viewCourseCategory",
          name: "View Course Categories",
          icon: "arrows-1_cloud-upload-94",
          component: CourseCategoryList,
          layout: "/admin",
        },
        {
          path: "/addNewCourse",
          name: "Add Course",
          icon: "arrows-1_cloud-upload-94",
          component: AddCourse,
          layout: "/admin",
        }, {
          path: "/viewCourses",
          name: "View Courses",
          icon: "arrows-1_cloud-upload-94",
          component: CoursesList,
          layout: "/admin",
        },
      ];
      this.path = "/admin/addQuizCategory";
      this.setState({
        render: true,
      });
    }

    // if (navigator.platform.indexOf("Win") > -1) {
    //   ps = new PerfectScrollbar(this.mainPanel.current);
    //   document.body.classList.toggle("perfect-scrollbar-on");
    // }
  }
  componentWillUnmount() {
    // if (navigator.platform.indexOf("Win") > -1) {
    //   ps.destroy();
    //   document.body.classList.toggle("perfect-scrollbar-on");
    // }
  }
  componentDidUpdate(e) {
    if (e.history.action === "PUSH") {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      this.mainPanel.current.scrollTop = 0;
    }
  }
  handleColorClick = (color) => {
    this.setState({ backgroundColor: color });
  };
  render() {
    return (
      <div>
        {this.state.render ? (
          <div className="wrapper">
            <Sidebar
              {...this.props}
              routes={this.routes}
              backgroundColor={this.state.backgroundColor}
            />
            <div className="main-panel" ref={this.mainPanel}>
              <DemoNavbar {...this.props} />
              <Switch>
                {this.routes.map((prop, key) => {
                  return (
                    <Route
                      path={prop.layout + prop.path}
                      component={prop.component}
                      key={key}
                    />
                  );
                })}
                <Redirect from="/admin" to={this.path} />
              </Switch>
              <Footer fluid />
            </div>
          </div>
        ) : (
          <h1>wait</h1>
        )}
      </div>
    );
  }
}

export default Dashboard;
