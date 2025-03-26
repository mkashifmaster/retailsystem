import React, { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import Select from "react-select";
import OrderHeader from "./OrderHeader";
import OrderDetails from "./OrderDetails";
import { fetchOrders, saveOrder } from "../../../services/orderService"; // API Service

import "bootstrap/dist/css/bootstrap.min.css";

function SalesOrderForm() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderHeader, setOrderHeader] = useState({
    orderNumber: "",
    orderDate: "",
    customerCode: "",
    customerName: "",
    salesPerson: "Salman",
    shippingAddress: "",
  });

  const [orderDetails, setOrderDetails] = useState([]);

  useEffect(() => {
    fetchOrders().then((data) => setOrders(data)); // Load orders from API
  }, []);

  const handleOrderSelect = (selectedOption) => {
    setSelectedOrder(selectedOption);
  
    if (selectedOption) {
      const order = orders.find((o) => o.orderno === selectedOption.value);
      if (order) {
        // Populate Header
        setOrderHeader({
          orderNumber: order.orderno,
          orderDate: order.orderdate,
          customerCode: order.CustomerCode,
          customerName: order.CustomerName,
          salesPerson: order.SalesPerson,
          shippingAddress: order.ShippingAdress,
        });
  
        // Populate Details
        setOrderDetails(
          order.items.map((item) => ({
            itemcode: item.itemcode, // Ensure this exists in order API
            quantity: item.quantity,
            rate: item.rate,
            discount: item.discount,
          }))
        );
      }
    } else {
      resetForm();
    }
  };
  
  const resetForm = () => {
    setSelectedOrder(null);
    setOrderHeader({
      orderNumber: "",
      orderDate: "",
      customerCode: "",
      customerName: "",
      salesPerson: "Salman",
      shippingAddress: "",
    });
    setOrderDetails([]);
  };

  const handleSave = async () => {
    const newOrder = {
      orderNumber: orderHeader.orderNumber,
      orderDate: orderHeader.orderDate,
      customerCode: orderHeader.customerCode,
      customerName: orderHeader.customerName,
      salesPerson: orderHeader.salesPerson,
      shippingAddress: orderHeader.shippingAddress,
      items: orderDetails,
    };

    const result = await saveOrder(newOrder);

    if (result.success) {
      alert("Order saved successfully!");
      fetchOrders().then((data) => setOrders(data)); // Reload orders
      resetForm();
    } else {
      alert("Failed to save order.");
    }
  };

  return (
    <Container fluid className="vh-100 d-flex flex-column align-items-center">
      <Card className="shadow-lg flex-grow-1 d-flex flex-column w-80">
        <Card.Header className="bg-primary text-white text-center">
          <h4>Sales Order</h4>
        </Card.Header>
        <Card.Body className="d-flex flex-column flex-grow-1">
          <div className="w-80 mx-auto">
            {/* Order Number Dropdown */}
            <Row className="mb-3">
              <Col md={6}>
                <label>Select Order</label>
                <Select
                  options={orders.map((order) => ({
                    value: order.orderno,
                    label: `${order.orderno} - ${order.CustomerName}`,
                  }))}
                  value={selectedOrder}
                  onChange={handleOrderSelect}
                  isClearable
                  placeholder="Select Order..."
                  menuPortalTarget={document.body}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                />
              </Col>
              <Col md={6} className="text-end">
                <Button variant="success" onClick={resetForm}>
                  + New Order
                </Button>
              </Col>
            </Row>

            {/* Order Header Section */}
            <OrderHeader
              orderHeader={orderHeader}
              setOrderHeader={setOrderHeader}
            />

            {/* Order Details Section */}
            <div className="flex-grow-1 overflow-auto">
              <OrderDetails
                orderDetails={orderDetails}
                setOrderDetails={setOrderDetails}
              />
            </div>
          </div>

          {/* Buttons */}
          <Row className="mt-3 w-80 mx-auto">
            <Col className="text-start">
              <Button variant="secondary" onClick={resetForm}>
                Reset
              </Button>
            </Col>
            <Col className="text-end">
              <Button variant="primary" onClick={handleSave}>
                Save Order
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default SalesOrderForm;
