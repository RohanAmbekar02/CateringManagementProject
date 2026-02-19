import axios from "axios";

const API_URL = "http://localhost:5000/api/orders";

export const addOrder = async (data) => {
  return await axios.post(API_URL, data);
};

export const getOrders = async () => {
  return await axios.get(API_URL);
};

export const getOrderById = async (id) => {
  return await axios.get(`${API_URL}/${id}`);
};

export const updateOrder = async (id, data) => {
  return await axios.put(`${API_URL}/${id}`, data);
};

export const deleteOrder = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};
