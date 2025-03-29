import itemsData from "../data/items.json";

// Fetch items from local JSON data
export const fetchItems = async () => {
  try {
    console.log("Fetched Items:", itemsData);
    return Array.isArray(itemsData) ? itemsData : [];
  } catch (error) {
    console.error("Error fetching items:", error);
    return [];
  }
};

// import axios from "axios";

// const API_URL = "https://my.api.mockaroo.com/item_data.json?key=3b98d0f0"; //

// export const fetchItems = async () => {
//   try {
//     const response = await axios.get(API_URL);
//     console.log("Fetched items:", response.data);
//     return Array.isArray(response.data) ? response.data : [];
//   } catch (error) {
//     console.error("Error fetching items:", error);
//     return [];
//   }
// };
