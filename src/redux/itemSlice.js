import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchItems } from "../services/itemService";

// Async Thunk to Fetch Items
export const loadItems = createAsyncThunk("items/loadItems", async () => {
  return await fetchItems();
});

const itemSlice = createSlice({
  name: "items",
  initialState: { items: [] },
  extraReducers: (builder) => {
    builder.addCase(loadItems.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export default itemSlice.reducer;
