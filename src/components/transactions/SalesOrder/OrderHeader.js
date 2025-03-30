import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import Select from "react-select";
import { fetchCustomers } from "../../../services/customerService";
import { useSelector, useDispatch } from "react-redux";
import {
  updateOrderHeaderField,
  setOrderHeader,
} from "../../../redux/orderSlice";

function OrderHeader() {
  const dispatch = useDispatch();
  const { orderHeader } = useSelector((state) => state.order);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers().then((data) => setCustomers(data));
  }, []);

  const handleCustomerChange = (selectedOption) => {
    dispatch(
      setOrderHeader({
        ...orderHeader,
        customerCode: selectedOption?.value || "",
        customerName: selectedOption?.label || "",
      })
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateOrderHeaderField({ field: name, value }));
  };

  return (
    <Row className="mb-3" style={{ fontSize: "0.85rem" }}>
      <Row>
        <Col md={3}>
          <label>Order Number</label>
          <input
            style={{ fontSize: "0.85rem" }}
            type="text"
            className="form-control"
            name="orderNumber"
            value={orderHeader.orderNumber}
            readOnly
            onChange={handleInputChange}
          />
        </Col>

        <Col md={3}>
          <label>Customer</label>
          <Select
            options={customers.map((customer) => ({
              value: customer.customerCode,
              label: `${customer.customerCode} - ${customer.customerName}`,
            }))}
            value={
              orderHeader.customerCode
                ? {
                    value: orderHeader.customerCode,
                    label: orderHeader.customerName,
                  }
                : null
            }
            onChange={handleCustomerChange}
            placeholder="Select Customer..."
            menuPortalTarget={document.body}
            isClearable={false}
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
            }}
            styles={{
              menuPortal: (base) => ({
                ...base,
                zIndex: 9999,
                fontSize: "0.85rem",
              }),
            }}
          />
        </Col>

        <Col md={3}>
          <label>Sales Person</label>
          <input
            style={{ fontSize: "0.85rem" }}
            type="text"
            className="form-control"
            name="salesPerson"
            value={orderHeader.salesPerson}
            onChange={handleInputChange}
            placeholder="Enter Sales Person"
            readOnly
          />
        </Col>
      </Row>

      <Row>
        <Col md={3}>
          <label>Order Date</label>
          <input
            style={{ fontSize: "0.85rem" }}
            type="date"
            className="form-control"
            name="orderDate"
            value={orderHeader.orderDate}
            onChange={handleInputChange}
          />
        </Col>

        <Col md={6}>
          <label>Shipping Address</label>
          <input
            style={{ fontSize: "0.85rem" }}
            type="text"
            className="form-control"
            name="shippingAddress"
            value={orderHeader.shippingAddress}
            onChange={handleInputChange}
            placeholder="Enter Shipping Address"
          />
        </Col>
      </Row>
    </Row>
  );
}

export default OrderHeader;
