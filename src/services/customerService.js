import axios from "axios";

const API_URL = "https://jsonplaceholder.typicode.com/users";  

export const fetchCustomers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.map(user => ({
      customerCode: `CUST${user.id}`,
      customerName: user.name
    }));
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
};
