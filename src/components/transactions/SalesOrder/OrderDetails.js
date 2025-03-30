import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import Select from "react-select";
import { fetchItems } from "../../../services/itemService";
import { formatNumber } from "../../../utils/formatNumber"; // Utility for formatting numbers

function OrderDetails({ orderDetails, setOrderDetails }) {
  const [items, setItems] = useState([]); // State for items list

  // Fetch items from API when the component loads
  useEffect(() => {
    fetchItems().then((data) => {
      console.log("Fetched Items:", data); // Debugging API Response
      setItems(data);
    });
  }, []);

  // Initialize with 1 empty row on first load
  useEffect(() => {
    if (orderDetails.length === 0) {
      setOrderDetails([{ itemcode: "", quantity: 1, rate: 0, discount: 10 }]);
    }
  }, [orderDetails.length, setOrderDetails]);

  // Handle item selection change in dropdown
  const handleItemChange = (index, selectedItem) => {
    const updatedDetails = [...orderDetails];

    // Update the selected row with the chosen item details
    updatedDetails[index] = {
      ...updatedDetails[index],
      itemcode: selectedItem.itemcode,
      rate: selectedItem.rate,
      discount: 10, // Reset discount when item changes
    };

    // Check if the last row is filled; if so, add a new blank row
    const lastRow = updatedDetails[updatedDetails.length - 1];
    if (lastRow.itemcode) {
      updatedDetails.push({
        itemcode: "",
        quantity: 1,
        rate: 0,
        discount: 0,
      });
    }

    setOrderDetails(updatedDetails);
  };

  // Handle input changes
  const handleInputChange = (index, field, value) => {
    const updatedDetails = [...orderDetails];
    updatedDetails[index][field] = value;
    setOrderDetails(updatedDetails);
  };

  // Delete row
  const handleDeleteRow = (index) => {
    const updatedDetails = orderDetails.filter((_, i) => i !== index);
    setOrderDetails(updatedDetails);
  };

  // Calculate totals
  const totalQuantity = orderDetails.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );
  const totalAmount = orderDetails.reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.rate || 0),
    0
  );
  const totalDiscount = orderDetails.reduce(
    (sum, item) =>
      sum +
      Number(item.quantity || 0) *
        Number(item.rate || 0) *
        (Number(item.discount || 0) / 100),
    0
  );
  const totalNetAmount = totalAmount - totalDiscount;

  return (
    <div
      style={{
        maxHeight: "300px",
        overflowY: "auto",
        border: "1px solid #ccc",
        position: "relative",
      }}
    >
      <Table
        bordered
        hover
        size="sm"
        className="mt-2"
        style={{ fontSize: "0.85rem" }}
      >
        {/* Header - Fixed Position */}
        <thead
          className="table-secondary"
          style={{ position: "sticky", top: 0, zIndex: 2 }}
        >
          <tr>
            <th style={{ width: "40px" }}>#</th>
            <th style={{ width: "200px" }}>Item</th>
            <th style={{ width: "80px" }} className="text-end">
              Quantity
            </th>
            <th style={{ width: "80px" }} className="text-end">
              Rate
            </th>
            <th style={{ width: "80px" }} className="text-end">
              Disc.%
            </th>
            <th style={{ width: "100px" }} className="text-end">
              Disc. Amt
            </th>
            <th style={{ width: "100px" }} className="text-end">
              Net Amt
            </th>
            <th style={{ width: "50px" }}></th>
          </tr>
        </thead>

        {/* Scrollable Body */}
        <tbody>
          {orderDetails.map((item, index) => {
            const amount = item.quantity * item.rate;
            const discountAmount = amount * (item.discount / 100);
            const netAmount = amount - discountAmount;

            return (
              <tr key={index} className={index % 2 === 0 ? "bg-light" : ""}>
                <td className="text-center">{index + 1}</td>
                <td>
                  <Select
                    options={items}
                    getOptionLabel={(e) => `${e.itemcode} - ${e.itemname}`} // Display only itemcode
                    getOptionValue={(e) => e.itemcode}
                    value={
                      items.find(
                        (opt) => opt.itemcode === orderDetails[index]?.itemcode
                      ) || null
                    } // Ensure selection
                    placeholder="Select Item..."
                    onChange={(selected) => handleItemChange(index, selected)}
                    menuPortalTarget={document.body}
                    isClearable={false} // 🔹 Hides the cross icon (clear option)
                    components={{
                      DropdownIndicator: () => null,
                      IndicatorSeparator: () => null,
                    }} // 🔹 Hides the arrow & separator
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: "31px",
                        height: "31px",
                        padding: "0px",
                        fontSize: "0.85rem",
                      }),
                      valueContainer: (base) => ({
                        ...base,
                        padding: "0px 8px",
                      }),
                      input: (base) => ({
                        ...base,
                        margin: "0px",
                        padding: "0px",
                      }),
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                    }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control form-control-sm text-end border-0   "
                    value={item.quantity}
                    onChange={(e) =>
                      handleInputChange(index, "quantity", e.target.value)
                    }
                  />
                </td>
                <td className="text-end border-0"> {item.rate} </td>
                <td>
                  <input
                    type="number"
                    className="form-control form-control-sm text-end border-0  "
                    value={item.discount}
                    onChange={(e) =>
                      handleInputChange(index, "discount", e.target.value)
                    }
                  />
                </td>
                <td className="text-end border-0  ">
                  {formatNumber(discountAmount)}
                </td>
                <td className="text-end border-0  ">
                  {formatNumber(netAmount)}
                </td>
                <td className="text-center">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteRow(index)}
                  >
                    🗑
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>

        {/* Footer - Always Visible */}
        <tfoot className="table-secondary">
          <tr>
            <td colSpan="2" className="text-end">
              Total:
            </td>
            <td className="text-end">{formatNumber(totalQuantity)}</td>
            <td></td>
            <td></td>
            <td className="text-end">{formatNumber(totalDiscount)}</td>
            <td className="text-end">{formatNumber(totalNetAmount)}</td>
            <td></td>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
}

export default OrderDetails;
