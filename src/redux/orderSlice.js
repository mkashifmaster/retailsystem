import { createSlice } from "@reduxjs/toolkit";

const today = new Date().toISOString().split("T")[0];

const initialState = {
  orders: [],
  selectedOrder: null,
  isNewOrder: false,
  orderHeader: {
    orderNumber: "",
    orderDate: today,
    customerCode: "",
    customerName: "",
    salesPerson: "Salman",
    shippingAddress: "",
  },
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
    setIsNewOrder: (state, action) => {
      state.isNewOrder = action.payload;
    },
    setOrderHeader: (state, action) => {
      state.orderHeader = action.payload;
    },
    updateOrderHeaderField: (state, action) => {
      const { field, value } = action.payload;
      state.orderHeader[field] = value;
    },
    resetOrderForm: (state) => {
      state.selectedOrder = null;
      state.isNewOrder = false;
      state.orderHeader = {
        orderNumber: "",
        orderDate: today,
        customerCode: "",
        customerName: "",
        salesPerson: "Salman",
        shippingAddress: "",
      };
    },
  },
});

export const {
  setOrders,
  setSelectedOrder,
  setIsNewOrder,
  setOrderHeader,
  updateOrderHeaderField,
  resetOrderForm,
} = orderSlice.actions;

export default orderSlice.reducer;
