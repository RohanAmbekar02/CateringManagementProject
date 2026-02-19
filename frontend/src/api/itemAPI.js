import axios from "axios";

const API_URL = "http://localhost:5000/api/items";

export const getItems = async () => {
  return await axios.get(API_URL);
};

export const addItem = async (data) => {
  return await axios.post(API_URL, data);
};

export const deleteItem = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};

export const updateItem = async (id, data) => {
  return await axios.put(`${API_URL}/${id}`, data);
};
