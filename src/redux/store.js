import { configureStore } from '@reduxjs/toolkit';
import orderReducer from './orderSlice';

const store = configureStore({
  reducer: {
    order: orderReducer
  },
  // Optional: Add middleware or devTools configuration
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'production'
});

export default store;