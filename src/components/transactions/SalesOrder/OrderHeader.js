import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { setOrderHeader } from "../../../redux/orderSlice";

function OrderHeader() {
  const orderHeader = useSelector((state) => state.order.orderHeader);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setOrderHeader({ ...orderHeader, [name]: value }));
  };

  return (
    <Form className="mb-3">
      <Row className="mb-2">
        <Col md={4}>
          <Form.Group controlId="orderNumber">
            <Form.Label>Order Number</Form.Label>
            <Form.Control
              type="text"
              name="orderNumber"
              value={orderHeader.orderNumber}
              onChange={handleChange}
              disabled
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="orderDate">
            <Form.Label>Order Date</Form.Label>
            <Form.Control
              type="date"
              name="orderDate"
              value={orderHeader.orderDate}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="salesPerson">
            <Form.Label>Sales Person</Form.Label>
            <Form.Control
              type="text"
              name="salesPerson"
              value={orderHeader.salesPerson}
              onChange={handleChange}
              disabled
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-2">
        <Col md={6}>
          <Form.Group controlId="customerCode">
            <Form.Label>Customer Code</Form.Label>
            <Form.Control
              type="text"
              name="customerCode"
              value={orderHeader.customerCode}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="customerName">
            <Form.Label>Customer Name</Form.Label>
            <Form.Control
              type="text"
              name="customerName"
              value={orderHeader.customerName}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group controlId="shippingAddress">
            <Form.Label>Shipping Address</Form.Label>
            <Form.Control
              as="textarea"
              name="shippingAddress"
              value={orderHeader.shippingAddress}
              onChange={handleChange}
              rows={2}
            />
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
}

export default OrderHeader;
