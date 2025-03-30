import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchOrders, saveOrder } from "../services/orderService";

export const fetchOrdersAsync = createAsyncThunk(
  "order/fetchOrders",
  async () => {
    const response = await fetchOrders();
    return response;
  }
);

export const saveOrderAsync = createAsyncThunk(
  "order/saveOrder",
  async (order) => {
    const response = await saveOrder(order);
    return response;
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    selectedOrder: null,
    orderHeader: {
      orderNumber: "",
      orderDate: new Date().toISOString().split("T")[0],
      customerCode: "",
      customerName: "",
      salesPerson: "Salman",
      shippingAddress: "",
    },
    orderDetails: [], // ✅ Ensure it's an empty array
    items: [],
    loading: false,
    error: null,
  },

  reducers: {
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
    setOrderHeader: (state, action) => {
      state.orderHeader = action.payload;
    },
    setOrderDetails: (state, action) => {
      state.orderDetails = action.payload || []; // ✅ Ensure it's always an array
    },
    resetForm: (state) => {
      state.selectedOrder = null;
      state.orderHeader = {
        orderNumber: "",
        orderDate: new Date().toISOString().split("T")[0],
        customerCode: "",
        customerName: "",
        salesPerson: "Salman",
        shippingAddress: "",
      };
      state.orderDetails = [];
    },
    setItems: (state, action) => {
      state.items = action.payload;
    },
    addOrderDetail: (state, action) => {
      state.orderDetails.push(action.payload);
    },
    updateOrderDetail: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.orderDetails[index]) {
        state.orderDetails[index][field] = value;
      }
    },
    deleteOrderDetail: (state, action) => {
      state.orderDetails.splice(action.payload, 1);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrdersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrdersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(saveOrderAsync.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export const {
  setSelectedOrder,
  setOrderHeader,
  setOrderDetails,
  resetForm,
  setItems,
  addOrderDetail,
  updateOrderDetail,
  deleteOrderDetail,
} = orderSlice.actions;

export default orderSlice.reducer;
