import React, { useEffect, useState } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import Select from "react-select";
import OrderHeader from "./OrderHeader";
import OrderDetails from "./OrderDetails";
import { fetchOrders, saveOrder } from "../../../services/orderService";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector, useDispatch } from "react-redux";
import {
  setOrders,
  setSelectedOrder,
  setIsNewOrder,
  setOrderHeader,
  resetOrderForm,
  setOrderDetails,
} from "../../../redux/orderSlice";

function SalesOrderForm() {
  //const [orderDetails, setOrderDetails] = useState([]);

  const dispatch = useDispatch();
  const { orders, selectedOrder, isNewOrder, orderHeader, orderDetails } =
    useSelector((state) => state.order);

  useEffect(() => {
    fetchOrders().then((data) => dispatch(setOrders(data)));
  }, [dispatch]);

  const handleOrderSelect = (selectedOption) => {
    dispatch(setSelectedOrder(selectedOption));
    dispatch(setIsNewOrder(false));

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
      dispatch(resetOrderForm());
    }
  };

  const handleNewOrder = () => {
    dispatch(setIsNewOrder(true));
    dispatch(resetOrderForm());
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
      fetchOrders().then((data) => dispatch(setOrders(data)));
      dispatch(setIsNewOrder(false));
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
                    isClearable={false}
                    components={{
                      DropdownIndicator: () => null,
                      IndicatorSeparator: () => null,
                    }}
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

            <OrderHeader />
            {/* Order Details Section */}
            <div className="flex-grow-1 overflow-auto">
              <OrderDetails />
            </div>
          </div>

          <Row className="mt-3 w-80 mx-auto">
            <Col className="text-start">
              <Button
                variant="secondary"
                onClick={() => dispatch(resetOrderForm())}
              >
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
