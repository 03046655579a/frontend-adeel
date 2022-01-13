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
} from "reactstrap";
import axios from "axios";
// core components
import PanelHeader from "components/PanelHeader/PanelHeader.js";

import { thead, tbody } from "variables/general";

class RegularTables extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: false,
      ordersData: "",
    };
  }

  componentDidMount() {
    this.getOrdersFromDatabase();
  }

  getOrdersFromDatabase() {
    axios
      .get("http://BASE_URL:3000/medication/api/findallorders")
      .then((res) => {
        console.log("statusTextof res", res);
        if (res.data.message.length > 0) {
          this.productStatus = "";
          this.setState({
            order: true,
            ordersData: res,
          });
        } else {
          this.productStatus = "No Order Exist";
          console.log("No product exist");
          this.setState({
            order: false,
          });
        }
      })
      .catch((err) => {
        this.productStatus = " An error occured while fetching orders";
        this.setState({
          order: false,
        });
      });
  }

  statusButton(status, index) {
    switch (status) {
      case "pending":
        return (
          <button
            type="button"
            class="btn btn-danger"
            onClick={() => this.changestatus(index)}
          >
            {status}
          </button>
        );
      case "on the way":
        return (
          <button
            type="button"
            class="btn btn-secondary"
            onClick={() => this.changestatus(index)}
          >
            {status}
          </button>
        );
      case "completed":
        return (
          <button type="button" class="btn btn-success">
            {status}
          </button>
        );
    }
  }

  changestatus = (index) => {
    var orderstatus = this.state.ordersData.data.message[index].orderstatus;
    switch (orderstatus) {
      case "pending":
        orderstatus = "on the way";
        break;
      case "on the way":
        orderstatus = "completed";
        break;
    }
    axios
      .post(
        "http://BASE_URL:3000/medication/api/changeorderstatus",
        {
          id: this.state.ordersData.data.message[index]._id,
          username: this.state.ordersData.data.message[index].username,
          orderstatus: orderstatus,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        this.setState({
          ordersData: res,
        });
      })
      .catch((err) => {});
  };

  renderTableData() {
    return (
      <Table striped bordered hover>
        <thead class="thead-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Status</th>
            <th style={{ textAlign: "center" }}>Orders</th>
          </tr>
        </thead>
        <tbody>
          {this.state.ordersData.data.message.map((order, index) => {
            const {
              username,
              phonenumber,
              address,
              orderstatus,
              orderitems,
            } = order;
            return (
              <tr>
                <td>{index}</td>
                <td>{username}</td>
                <td>{phonenumber}</td>
                <td>{address}</td>
                <td style={{ textAlign: "center" }}>
                  {this.statusButton(orderstatus, index)}
                </td>
                {orderitems.map((item, index) => {
                  const {
                    productName,
                    productPotency,
                    productQuantity,
                    storeName,
                  } = item;
                  return (
                    <tr>
                      <td>{productName}</td>
                      <td>{productPotency}</td>
                      <td>{productQuantity}</td>
                      <td>{storeName}</td>
                    </tr>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }

  render() {
    return (
      <>
        <PanelHeader size="sm" />
        <div className="content">
          <Row>
            <Col xs={12}>
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">View Orders</CardTitle>
                </CardHeader>
                <CardBody>
                  {this.state.order ? (
                    this.renderTableData()
                  ) : (
                    <span style={{ color: "red" }}>{this.productStatus}</span>
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

export default RegularTables;
