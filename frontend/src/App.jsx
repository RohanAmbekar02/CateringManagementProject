import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout/Layout';
import ProtectedRoute from './Component/ProtectedRoute';

import Dashboard from './Pages/dashboard/dashboard';
import Order from './Pages/Order/details';
import Login from './Pages/Auth/Login';
import ItemDetails from './Pages/Item/item-details';
import Customer from './Pages/Customer/customer-details';
import Reviews from './Pages/Order/review';
import Details from './Pages/Order/details';
import AddItem from './Pages/Item/add-item';
import AddOrder from './Pages/Order/add-order';
import AddCustomer from './Pages/Customer/AddCustomer';
import EditOrder from './Pages/Order/edit-order';


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        {/* all routes inside Layout require authentication */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/item" element={<ItemDetails />} />
          <Route path="/order" element={<Order />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/review" element={<Reviews />} />
          <Route path="/details" element={<Details />} />
          <Route path="/add-item" element={<AddItem />} />
          <Route path="/add-order" element={<AddOrder />} />
          <Route path="/edit-order/:id" element={<EditOrder />} />
          <Route path="/add-customer" element={<AddCustomer />} />

        </Route >

        {/* catch-all redirects */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes >
    </BrowserRouter >
  );
}

export default App;