import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  useMediaQuery
} from "@mui/material";
import {
  Search,
  Add,
  Close,
  Edit,
  Delete,
  Call
} from "@mui/icons-material";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import { getOrders, deleteOrder, updateOrder } from "../../api/orderAPI";
import Swal from "sweetalert2";
import "./details.css";

/* ---------- COLORS (same as Items page) ---------- */
const PRIMARY = "#1f3a8a";
const PRIMARY_HOVER = "#1e40af";

export default function Details() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");

  /* ---------- STATES ---------- */
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------- FETCH ORDERS FROM BACKEND ---------- */
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getOrders();
      // ensure every order has a status field (in case of legacy data)
      const normalized = response.data.map(o => ({
        ...o,
        status: o.status || (o.unpaidAmount <= 0 ? "paid" : "pending")
      }));
      setOrders(normalized);
    } catch (error) {
      console.error("Error fetching orders:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to load orders",
        confirmButtonColor: "#1f3a8a"
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /* ---------- DELETE ORDER ---------- */
  const handleDeleteOrder = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteOrder(id);
          fetchOrders();
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Order has been deleted.",
            confirmButtonColor: "#1f3a8a",
            timer: 2000,
            timerProgressBar: true
          });
        } catch (error) {
          console.error("Error deleting order:", error);
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Failed to delete order",
            confirmButtonColor: "#1f3a8a"
          });
        }
      }
    });
  };

  /* ---------- OPEN ORDER REVIEW/BILL ---------- */
  const handleViewBill = (order) => {
    navigate("/review", { state: { order } });
  };

  /* ---------- DIAL CUSTOMER NUMBER ---------- */

  /* ---------- TOGGLE ORDER STATUS ---------- */
  const handleToggleStatus = async (order) => {
    const makePaid = order.status !== "paid";
    const newPaidAmount = makePaid ? order.subtotal : 0; // use 0 when toggling back to pending
    try {
      await updateOrder(order._id, {
        customer: {
          customerId: order.customer.customerId,
          name: order.customer.name
        },
        orderDate: order.orderDate,
        items: order.items.map(i => ({ itemId: i.itemId, qty: i.qty })),
        paidAmount: newPaidAmount
      });
      fetchOrders();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `Order marked ${makePaid ? "paid" : "pending"}`,
        confirmButtonColor: "#1f3a8a",
        timer: 1500,
        timerProgressBar: true
      });
    } catch (err) {
      console.error("Error toggling status", err);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to update order status",
        confirmButtonColor: "#1f3a8a"
      });
    }
  };
  const handleCallCustomer = (order) => {
    // Try to get customer contact from order or show error
    const customerContact = order.customer?.contact;
    if (!customerContact) {
      Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: "Customer contact number not available",
        confirmButtonColor: "#1f3a8a"
      });
      return;
    }
    // Open dial pad with customer number
    window.location.href = `tel:${customerContact}`;
  };

  /* ---------- SEARCH + FILTER ---------- */
  const filteredOrders = orders.filter(order => {
    const matchStatus = filter === "all" || order.status === filter;
    const customerName = order.customer?.name || "";
    const matchSearch = customerName
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  // const capitalizeStatus = status =>
  //   status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <Box sx={{ p: isMobile ? 2 : 3, bgcolor: "#fff", minHeight: "100vh" }}>
      
      {/* ---------- HEADER ---------- */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant={isMobile ? "h6" : "h5"}
          fontWeight={700}
          color={PRIMARY}
        >
          Orders
        </Typography>

        <Button
          startIcon={<Add />}
          variant="contained"
          onClick={() => navigate("/add-order")}
          sx={{
            bgcolor: PRIMARY,
            textTransform: "none",
            borderRadius: "10px",
            px: isMobile ? 1.5 : 2.5,
            "&:hover": { bgcolor: PRIMARY_HOVER },
          }}
        >
          {isMobile ? "Add" : "Add Order"}
        </Button>
      </Box>

      {/* ---------- SEARCH ---------- */}
      <Box sx={{ maxWidth: isMobile ? "100%" : 500, mb: 3 }}>
        <TextField
          size="small"
          fullWidth
          placeholder="Search by customer name"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setSearch(e.target.value);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "#9ca3af" }} />
              </InputAdornment>
            ),
            endAdornment: searchInput && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => {
                    setSearchInput("");
                    setSearch("");
                  }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* ---------- FILTER BUTTONS ---------- */}
      <div className="filters">
        <button
          className={`filter ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>

        <button
          className={`filter ${filter === "paid" ? "active" : ""}`}
          onClick={() => setFilter("paid")}
        >
          Paid
        </button>

        <button
          className={`filter ${filter === "pending" ? "active" : ""}`}
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>
      </div>

      {/* ---------- ORDER CARDS ---------- */}
      {loading ? (
        <Typography sx={{ mt: 3 }}>Loading orders...</Typography>
      ) : filteredOrders.length === 0 ? (
        <Typography sx={{ mt: 3 }}>No orders found</Typography>
      ) : (
        filteredOrders.map(order => (
          <div key={order._id} className="order-card shadow">
            <div>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton size="small">
                  <PersonIcon />
                </IconButton>

                {/* CUSTOMER NAME */}
                <Typography variant="subtitle1" fontWeight={600}>
                  {order.customer?.name}
                </Typography>
              </Box>

              <Typography sx={{ color: "green", mt: 1 }}>
                ₹ Total amount: ₹ {order.subtotal}.00
              </Typography>

              <Typography sx={{ color: "red" }}>
                ₹ Remaining amount: ₹ {order.unpaidAmount}.00
              </Typography>
            </div>

            <div className="actions">
              <button
                className={
                  order.status === "paid"
                    ? "status-btn paid"
                    : "status-btn pending"
                }
                onClick={() => handleToggleStatus(order)}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </button>

              <button
                className="icon book-icon"
                onClick={() => handleViewBill(order)}
              >
                <ReceiptIcon />
              </button>

              <button 
                className="icon phone-icon"
                onClick={() => handleCallCustomer(order)}
              >
                <Call />
              </button>

              <button 
                className="icon delete-icon"
                onClick={() => handleDeleteOrder(order._id)}
              >
                <Delete />
              </button>

              <button
                className="icon pencil-icon"
                onClick={() => navigate(`/edit-order/${order._id}`, { state: { order } })}
              >
                <Edit />
              </button>

              <span className="dots">...</span>
            </div>
          </div>
        ))
      )}
    </Box>
  );
}
