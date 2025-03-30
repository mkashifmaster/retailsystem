import React, { useEffect } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchOrdersAsync,
  setSelectedOrder,
  setOrderHeader,
  setOrderDetails,
  resetForm,
  saveOrderAsync,
} from "../../../redux/orderSlice";
import OrderHeader from "./OrderHeader";
import OrderDetails from "./OrderDetails";

import "bootstrap/dist/css/bootstrap.min.css";

function SalesOrderForm() {
  const dispatch = useDispatch();
  const { orders, selectedOrder, orderHeader, orderDetails } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrdersAsync());
  }, [dispatch]);

  const handleOrderSelect = (selectedOption) => {
    dispatch(setSelectedOrder(selectedOption));

    if (selectedOption) {
      const order = orders.find((o) => o.orderno === selectedOption.value);
      if (order) {
        dispatch(
          setOrderHeader({
            orderNumber: order.orderno,
            orderDate: order.orderdate,
            customerCode: order.CustomerCode,
            customerName: order.CustomerName,
            salesPerson: order.SalesPerson,
            shippingAddress: order.ShippingAdress,
          })
        );

        dispatch(
          setOrderDetails(
            order.items.map((item) => ({
              itemcode: item.itemcode,
              quantity: item.quantity,
              rate: item.rate,
              discount: item.discount,
            }))
          )
        );
      }
    } else {
      dispatch(resetForm());
    }
  };

  const handleNewOrder = () => {
    dispatch(resetForm());
  };

  const handleSave = async () => {
    const newOrder = {
      ...orderHeader,
      items: orderDetails,
    };

    dispatch(saveOrderAsync(newOrder));
  };

  return (
    <Container fluid className="vh-100 d-flex flex-column align-items-center">
      <Card className="shadow-lg flex-grow-1 d-flex flex-column w-100">
        <Card.Header className="bg-primary text-white text-center">
          <h4>Sales Order</h4>
        </Card.Header>
        <Card.Body className="d-flex flex-column flex-grow-1">
          {!selectedOrder && (
            <Row className="mb-3">
              <Col md={6}>
                <Select
                  options={orders.map((order) => ({
                    value: order.orderno,
                    label: `${order.orderno} - ${order.CustomerName}`,
                  }))}
                  value={selectedOrder}
                  onChange={handleOrderSelect}
                  placeholder="Select Order..."
                />
              </Col>
              <Col md={6} className="text-end">
                <Button variant="success" onClick={handleNewOrder}>
                  + New Order
                </Button>
              </Col>
            </Row>
          )}

          <OrderHeader />
          <OrderDetails />

          <Row className="mt-3">
            <Col className="text-start">
              <Button variant="secondary" onClick={() => dispatch(resetForm())}>
                Reset
              </Button>
            </Col>
            <Col className="text-end">
              <Button variant="primary" onClick={handleSave} style={{ width: "130px" }}>
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
