import React, { useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import Select from "react-select";
import { useSelector, useDispatch } from "react-redux";
import { fetchItems } from "../../../services/itemService";
import { formatNumber } from "../../../utils/formatNumber";

import {
  setOrderDetails,
  updateOrderDetail,
  deleteOrderDetail,
  addOrderDetail,
  setItems,
} from "../../../redux/orderSlice";

function OrderDetails() {
  const dispatch = useDispatch();
  const orderDetails = useSelector((state) => state.order.orderDetails);
  const items = useSelector((state) => state.order.items);

  // Fetch items on component mount
  useEffect(() => {
    fetchItems().then((data) => {
      dispatch(setItems(data)); // ✅ Correctly store items
    });
  }, [dispatch]);

  // Initialize with an empty row if orderDetails is empty
  useEffect(() => {
    if (orderDetails.length === 0) {
      dispatch(
        addOrderDetail({ itemcode: "", quantity: 1, rate: 0, discount: 10 })
      );
    }
  }, [orderDetails.length, dispatch]);

  const handleItemChange = (index, selectedItem) => {
    dispatch(
      updateOrderDetail({
        index,
        field: "itemcode",
        value: selectedItem.itemcode,
      })
    );
    dispatch(
      updateOrderDetail({ index, field: "rate", value: selectedItem.rate })
    );
    dispatch(updateOrderDetail({ index, field: "discount", value: 10 }));

    // Add a new empty row if the last row is filled
    if (orderDetails[orderDetails.length - 1].itemcode) {
      dispatch(
        addOrderDetail({ itemcode: "", quantity: 1, rate: 0, discount: 0 })
      );
    }
  };

  const handleInputChange = (index, field, value) => {
    dispatch(updateOrderDetail({ index, field, value }));
  };

  const handleDeleteRow = (index) => {
    dispatch(deleteOrderDetail(index));
  };

  const totalQuantity = (orderDetails || []).reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );
  const totalAmount = (orderDetails || []).reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.rate || 0),
    0
  );
  const totalDiscount = (orderDetails || []).reduce(
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
        <thead
          className="table-secondary"
          style={{ position: "sticky", top: 0, zIndex: 2 }}
        >
          <tr>
            <th>#</th>
            <th>Item</th>
            <th className="text-end">Quantity</th>
            <th className="text-end">Rate</th>
            <th className="text-end">Disc.%</th>
            <th className="text-end">Disc. Amt</th>
            <th className="text-end">Net Amt</th>
            <th></th>
          </tr>
        </thead>
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
                    getOptionLabel={(e) => `${e.itemcode} - ${e.itemname}`}
                    getOptionValue={(e) => e.itemcode}
                    value={
                      items.find((opt) => opt.itemcode === item.itemcode) ||
                      null
                    }
                    placeholder="Select Item..."
                    onChange={(selected) => handleItemChange(index, selected)}
                    menuPortalTarget={document.body}
                    isClearable={false}
                    components={{
                      DropdownIndicator: () => null,
                      IndicatorSeparator: () => null,
                    }}
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: "31px",
                        height: "31px",
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
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control form-control-sm text-end border-0"
                    value={item.quantity}
                    onChange={(e) =>
                      handleInputChange(index, "quantity", e.target.value)
                    }
                  />
                </td>
                <td className="text-end border-0">{item.rate}</td>
                <td>
                  <input
                    type="number"
                    className="form-control form-control-sm text-end border-0"
                    value={item.discount}
                    onChange={(e) =>
                      handleInputChange(index, "discount", e.target.value)
                    }
                  />
                </td>
                <td className="text-end border-0">
                  {formatNumber(discountAmount)}
                </td>
                <td className="text-end border-0">{formatNumber(netAmount)}</td>
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
