import React from "react";
import { Form } from "react-bootstrap";

function OrderDetailRow({ index, detail, setOrderDetails }) {
  const updateRow = (field, value) => {
    setOrderDetails((prev) => {
      const newDetails = [...prev];
      newDetails[index][field] = value;
      return newDetails;
    });
  };

  return (
    <tr>
      <td>
        <Form.Control type="text" value={detail.itemCode} onChange={(e) => updateRow("itemCode", e.target.value)} />
      </td>
      <td>
        <Form.Control type="text" value={detail.itemName} onChange={(e) => updateRow("itemName", e.target.value)} />
      </td>
      <td>
        <Form.Control type="number" value={detail.quantity} onChange={(e) => updateRow("quantity", e.target.value)} />
      </td>
      <td>
        <Form.Control type="number" value={detail.rate} onChange={(e) => updateRow("rate", e.target.value)} />
      </td>
      <td className="text-center fw-bold">{detail.quantity * detail.rate}</td>
    </tr>
  );
}

export default OrderDetailRow;
