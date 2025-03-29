import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import Select from "react-select";
import { fetchCustomers } from "../../../services/customerService";

function OrderHeader({ orderHeader, setOrderHeader }) {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers().then((data) => setCustomers(data));
  }, []);

  const handleCustomerChange = (selectedOption) => {
    setOrderHeader({
      ...orderHeader,
      customerCode: selectedOption?.value || "",
      customerName: selectedOption?.label || "",
    });
  };

  return (
    <Row className="mb-3" style={{ fontSize: "0.85rem" }}>
      <Row>
        {/* Order Number Input */}
        <Col md={3}>
          <label>Order Number</label>
          <input
            style={{ fontSize: "0.85rem" }}
            type="text"
            className="form-control"
            value={orderHeader.orderNumber}
            readOnly
            onChange={(e) =>
              setOrderHeader({ ...orderHeader, orderNumber: e.target.value })
            }
            // placeholder="Enter Order Number"
          />
        </Col>

        {/* Customer Dropdown */}
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
            isClearable={false} // 🔹 Hides the cross icon (clear option)
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
            }} // 🔹 Hides the arrow & separator
            styles={{
              menuPortal: (base) => ({
                ...base,
                zIndex: 9999,
                fontSize: "0.85rem",
              }),
            }}
          />
        </Col>

        {/* Sales Person */}
        <Col md={3}>
          <label>Sales Person</label>
          <input
            style={{ fontSize: "0.85rem" }}
            type="text"
            className="form-control"
            value={orderHeader.salesPerson}
            onChange={(e) =>
              setOrderHeader({ ...orderHeader, salesPerson: e.target.value })
            }
            placeholder="Enter Sales Person"
            readOnly
          />
        </Col>
      </Row>

      <Row>
        {/* Order Date */}
        <Col md={3}>
          <label>Order Date</label>
          <input
            style={{ fontSize: "0.85rem" }}
            type="date"
            className="form-control"
            value={orderHeader.orderDate}
            onChange={(e) =>
              setOrderHeader({ ...orderHeader, orderDate: e.target.value })
            }
          />
        </Col>

        {/* Shipping Address */}
        <Col md={6}>
          <label>Shipping Address</label>
          <input
            style={{ fontSize: "0.85rem" }}
            type="text"
            className="form-control"
            value={orderHeader.shippingAddress}
            onChange={(e) =>
              setOrderHeader({
                ...orderHeader,
                shippingAddress: e.target.value,
              })
            }
            placeholder="Enter Shipping Address"
          />
        </Col>
      </Row>
    </Row>
  );
}

export default OrderHeader;
