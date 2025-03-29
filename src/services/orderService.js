import ordersData from "../data/order.json";

// Fetch orders from local JSON data
export const fetchOrders = async () => {
  try {
    console.log("Fetched Orders:", ordersData);
    return ordersData;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

// Save order locally (simulating saving to database)
export const saveOrder = async (order) => {
  try {
    ordersData.push(order); // Simulating local storage or in-memory save
    console.log("Order saved locally:", order);

    return { success: true };
  } catch (error) {
    console.error("Error saving order:", error);
    return { success: false };
  }
};

// export const fetchOrders = async () => {
//   try {
//     const response = await fetch(
//       "https://my.api.mockaroo.com/sales_order.json?key=3b98d0f0"
//     );
//     const data = await response.json();
//     console.log("Fetched Orders:", data);
//     return data;
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     return [];
//   }
// };

// export const saveOrder = async (order) => {
//   try {
//     const response = await fetch(
//       "https://my.api.mockaroo.com/sales_order.json?key=3b98d0f0",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(order),
//       }
//     );

//     if (response.ok) {
//       return { success: true };
//     } else {
//       return { success: false };
//     }
//   } catch (error) {
//     console.error("Error saving order:", error);
//     return { success: false };
//   }
// };
