import Dashboard from "views/Dashboard.js";
import Notifications from "views/Notifications.js";
import Icons from "views/Icons.js";
import Typography from "views/Typography.js";
import TableList from "views/TableList.js";
import Maps from "views/Maps.js";
import Upgrade from "views/Upgrade.js";
import UserPage from "views/UserPage.js";

var dashRoutes = [
  {
    path: "/admin-store",
    name: "View Orders",
    icon: "files_paper",
    component: TableList,
    layout: "/admin",
  },
  {
    path: "/user-store",
    name: "Add Product",
    icon: "users_single-02",
    component: UserPage,
    layout: "/admin",
  },
];
export default dashRoutes;
