import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { getCustomers } from "../../api/customerAPI";
import { getItems } from "../../api/itemAPI";
import { getOrderById, updateOrder } from "../../api/orderAPI";
import "./add-order.css"; // reuse same styles

function EditOrder() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [customers, setCustomers] = useState([]);
  const [itemsList, setItemsList] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState([{ id: 1, itemId: "", qty: 1, price: 0 }]);
  const [paidAmount, setPaidAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // fetch master data + order
  useEffect(() => {
    fetchData();
    if (id) loadOrder();
  }, [id]);

  const fetchData = async () => {
    try {
      const [customersRes, itemsRes] = await Promise.all([
        getCustomers(),
        getItems()
      ]);
      setCustomers(customersRes.data);
      setItemsList(itemsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to load customers or items",
        confirmButtonColor: "#1f3a8a"
      });
    }
  };

  const loadOrder = async () => {
    setIsLoading(true);
    try {
      const resp = await getOrderById(id);
      const ord = resp.data;
      if (ord) {
        setSelectedCustomer(ord.customer.customerId);
        setOrderDate(new Date(ord.orderDate).toISOString().split('T')[0]);
        setPaidAmount(ord.paidAmount || 0);
        if (ord.items && ord.items.length) {
          setItems(
            ord.items.map((it, idx) => ({
              id: Date.now() + idx,
              itemId: it.itemId,
              qty: it.qty,
              price: it.price
            }))
          );
        }
      }
    } catch (error) {
      console.error("Error loading order", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to load order details",
        confirmButtonColor: "#1f3a8a"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), itemId: "", qty: 1, price: 0 }]);
  };

  const updateItem = (id, field, value) => {
    setItems(
      items.map(item => {
        if (item.id === id) {
          if (field === "itemId") {
            const selectedItem = itemsList.find(i => i._id === value);
            return { ...item, itemId: value, price: selectedItem?.price || 0 };
          }
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const deleteItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    } else {
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: "Order must have at least one item",
        confirmButtonColor: "#1f3a8a"
      });
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
  const remainingAmount = subtotal - paidAmount;

  const handleSubmit = async () => {
    if (!selectedCustomer) {
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: "Please select a customer",
        confirmButtonColor: "#1f3a8a"
      });
      return;
    }

    if (items.some(item => !item.itemId || item.qty <= 0)) {
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: "Please select items and enter valid quantities",
        confirmButtonColor: "#1f3a8a"
      });
      return;
    }

    const selectedCustomerObj = customers.find(c => c._id === selectedCustomer);

    const orderData = {
      customer: {
        customerId: selectedCustomer,
        name: selectedCustomerObj?.name
      },
      orderDate: new Date(orderDate),
      items: items.map(item => ({
        itemId: item.itemId,
        qty: item.qty
      })),
      paidAmount: paidAmount
    };

    setIsLoading(true);
    try {
      await updateOrder(id, orderData);
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Order updated successfully",
        confirmButtonColor: "#1f3a8a",
        timer: 2000,
        timerProgressBar: true
      }).then(() => {
        navigate("/details");
      });
    } catch (error) {
      console.error("Error updating order:", error);
      const errorMsg = error.response?.data?.error || error.message || "Failed to update order";
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: errorMsg,
        confirmButtonColor: "#1f3a8a"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    // reload original order
    if (id) loadOrder();
  };

  return (
    <div className="container-fluid mt-3">
      <div className="row">
        <div className="col-12 mb-3">
          <h4 className="border-bottom pb-2 text">Edit Order</h4>
        </div>

        {/* Customer & Date */}
        <div className="col-12 mb-2">
          <div className="row g-3">
            <div className="col-md-6 col-12">
              <select 
                className="form-select form-control"
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
              >
                <option value="">Select Customer*</option>
                {customers.map(customer => (
                  <option key={customer._id} value={customer._id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 col-12">
              <input 
                type="date" 
                className="form-control"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="col-12 table-responsive">
          <table className="table item-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Sr No</th>
                <th>Item Name</th>
                <th>QTY</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id}>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => deleteItem(item.id)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                  <td>{index + 1}</td>
                  <td>
                    <select 
                      className="form-select form-select-sm form-control"
                      value={item.itemId}
                      onChange={(e) => updateItem(item.id, "itemId", e.target.value)}
                    >
                      <option value="">Select Item</option>
                      {itemsList.map(itm => (
                        <option key={itm._id} value={itm._id}>
                          {itm.name} (₹{itm.price})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={item.qty}
                      onChange={(e) =>
                        updateItem(item.id, "qty", Number(e.target.value))
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={item.price}
                      onChange={(e) =>
                        updateItem(item.id, "price", Number(e.target.value))
                      }
                    />
                  </td>
                  <td>₹ {(item.qty * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-12 text-end">
          <button className="btn btn-primary mt-2"  onClick={addItem}>
            + Add Item
          </button>
        </div>
      
        {/* Summary */}
        <div className="col-12 mt-3 p-3 bg-light">
          <div className="d-flex justify-content-between fw-bold">
            <span>Subtotal (Qty: {totalQty})</span>
            <span>₹ {subtotal.toFixed(2)}</span>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <label className="fw-bold">Paid Amount</label>
            <input
              type="number"
              className="form-control w-25"
              value={paidAmount}
              onChange={(e) => setPaidAmount(Number(e.target.value))}
            />
          </div>
          

          <div className="d-flex justify-content-between mt-3 text-danger fw-bold">
            <span>Unpaid Amount</span>
            <span>₹ {remainingAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="col-12 mt-4 mb-5">
          <div className="row g-2">
            <div className="col-6">
              <button 
                className="btn btn-danger w-100"
                onClick={handleReset}
                disabled={isLoading}
              >
                Reset
              </button>
            </div>
            <div className="col-6">
              <button 
                className="btn btn-primary w-100"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditOrder;
