import axios from "axios";

const API_URL = "http://localhost:5000/api/customers";

export const getCustomers = async () => {
  return await axios.get(API_URL);
};

export const addCustomer = async (data) => {
  return await axios.post(API_URL, data);
};

export const deleteCustomer = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};

export const updateCustomer = async (id, data) => {
  return await axios.put(`${API_URL}/${id}`, data);
};
