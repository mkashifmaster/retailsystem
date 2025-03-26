export const fetchOrders = async () => {
  try {
    const response = await fetch(
      "https://my.api.mockaroo.com/sales_order.json?key=3b98d0f0"
    ); // Replace with actual API URL
    const data = await response.json();
    console.log("Fetched Orders:", data);
    return data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

export const saveOrder = async (order) => {
  try {
    const response = await fetch(
      "https://my.api.mockaroo.com/sales_order.json?key=3b98d0f0",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      }
    );

    if (response.ok) {
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.error("Error saving order:", error);
    return { success: false };
  }
};
