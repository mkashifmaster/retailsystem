import React, { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import Select from "react-select";
import OrderHeader from "./OrderHeader";
import OrderDetails from "./OrderDetails";
import { fetchOrders, saveOrder } from "../../../services/orderService";

import "bootstrap/dist/css/bootstrap.min.css";

function SalesOrderForm() {
  const today = new Date().toISOString().split("T")[0];

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isNewOrder, setIsNewOrder] = useState(false);
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
    setIsNewOrder(false);

    if (selectedOption) {
      const order = orders.find((o) => o.orderno === selectedOption.value);
      if (order) {
        setOrderHeader({
          orderNumber: order.orderno,
          orderDate: order.orderdate,
          customerCode: order.CustomerCode,
          customerName: order.CustomerName,
          salesPerson: order.SalesPerson,
          shippingAddress: order.ShippingAdress,
        });

        setOrderDetails(
          order.items.map((item) => ({
            itemcode: item.itemcode,
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

  const handleNewOrder = () => {
    setIsNewOrder(true);
    resetForm();
  };

  const resetForm = () => {
    setSelectedOrder(null);
    setOrderHeader({
      orderNumber: "",
      orderDate: today,
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
      setIsNewOrder(false);
      //resetForm();
    } else {
      alert("Failed to save order.");
    }
  };

  return (
    <Container fluid className="vh-100 d-flex flex-column align-items-center">
      <Card
        className="shadow-lg flex-grow-1 d-flex flex-column w-100"
        style={{ maxWidth: "100%", margin: "auto" }}
      >
        <Card.Header className="bg-primary text-white text-center">
          <h4>Sales Order</h4>
        </Card.Header>
        <Card.Body className="d-flex flex-column flex-grow-1">
          <div className="w-80 mx-auto" style={{ fontSize: "0.85rem" }}>
            {/* Select Order Dropdown */}
            {!isNewOrder && (
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
                    placeholder="Select Order..."
                    menuPortalTarget={document.body}
                    isClearable={false} // 🔹 Hides the cross icon (clear option)
                    components={{
                      DropdownIndicator: () => null,
                      IndicatorSeparator: () => null,
                    }} // 🔹 Hides the arrow & separator
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                </Col>
                <Col md={6} className="text-end">
                  <Button variant="success" onClick={handleNewOrder}>
                    + New Order
                  </Button>
                </Col>
              </Row>
            )}

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
              <Button
                variant="primary"
                onClick={handleSave}
                style={{ width: "130px" }}
              >
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
