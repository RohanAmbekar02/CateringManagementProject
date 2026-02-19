import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Box, Typography, TextField, IconButton, Button,
  Table, TableBody, TableCell, TableHead,
  TableRow, TableContainer, Paper,
  Stack, Chip, Select, MenuItem, useMediaQuery, 
  Dialog, DialogContent, DialogTitle, InputAdornment
} from "@mui/material";
import { Search, Add, Edit, Delete, NavigateBefore, NavigateNext, Close } from "@mui/icons-material";
import AddCustomer from "./AddCustomer";
import Swal from "sweetalert2";
import { getCustomers, deleteCustomer } from "../../api/customerAPI";
import "./customer-details.css";

const PRIMARY = "#1f3a8a";
const PRIMARY_HOVER = "#1e40af";
const BORDER = "#e1e7f5";
const BG_LIGHT = "#f5f8ff";

export default function Customers() {
  const isMobile = useMediaQuery("(max-width:600px)");

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [openAddCustomer, setOpenAddCustomer] = useState(false);
  const [editData, setEditData] = useState(null);
  const [customersDataState, setCustomersDataState] = useState([]);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const fetchCustomers = useCallback(async () => {
    try {
      const response = await getCustomers();
      setCustomersDataState(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleDeleteCustomer = (id) => {
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
          await deleteCustomer(id);
          fetchCustomers();
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Customer has been deleted.",
            confirmButtonColor: "#1f3a8a",
            timer: 2000,
            timerProgressBar: true
          });
        } catch (error) {
          console.error("Error deleting customer:", error);
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Failed to delete customer",
            confirmButtonColor: "#1f3a8a"
          });
        }
      }
    });
  };

  const filteredCustomers = useMemo(
    () =>
      customersDataState.filter(customer =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.contact.includes(searchQuery)
      ),
    [searchQuery, customersDataState]
  );

  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const currentCustomers = filteredCustomers.slice(startIndex, startIndex + rowsPerPage);

  return (
    <Box sx={{ p: isMobile ? 2 : 3, bgcolor: "#fff", minHeight: "100vh" }}>
      {/* ---------- HEADER ---------- */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant={isMobile ? "h6" : "h5"} fontWeight={700} color={PRIMARY}>
          Customers
        </Typography>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setEditData(null);
            setOpenAddCustomer(true);
          }}
          sx={{
            bgcolor: PRIMARY,
            textTransform: "none",
            borderRadius: "10px",
            fontSize: isMobile ? "0.8rem" : "0.9rem",
            "&:hover": { bgcolor: PRIMARY_HOVER }
          }}
        >
          {isMobile ? "Add" : "Add Customer"}
        </Button>
      </Box>

      {/* ---------- SEARCH WITH CROSS BUTTON ---------- */}
      <Box sx={{ mb: 3, maxWidth: isMobile ? "100%" : 500 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by name or mobile"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setSearchQuery(e.target.value); // Instant search
            setPage(1);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "#9ca3af" }} />
              </InputAdornment>
            ),
            endAdornment: searchInput && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => { setSearchInput(""); setSearchQuery(""); }}>
                  <Close fontSize="small" />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>

      {/* ---------- CONTENT ---------- */}
      {!isMobile ? (
        <TableContainer component={Paper} sx={{ border: `1px solid ${BORDER}`, borderRadius: "14px" }}>
          <Table>
            <TableHead sx={{ bgcolor: BG_LIGHT }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>S.No</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: "center" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentCustomers.map((customer, i) => (
                <TableRow key={customer._id} hover>
                  <TableCell>{startIndex + i + 1}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.contact}</TableCell>
                  <TableCell align="center">
                    <IconButton sx={{ color: PRIMARY }} onClick={() => {
                      setEditData(customer);
                      setOpenAddCustomer(true);
                    }}><Edit /></IconButton>
                    <IconButton sx={{ color: "#dc2626" }} onClick={() => handleDeleteCustomer(customer._id)}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        /* ---------- MOBILE CARDS ---------- */
        <Stack spacing={2}>
          {currentCustomers.map((customer, i) => (
            <Box key={customer._id} sx={{ border: `1px solid ${BORDER}`, borderRadius: "14px", p: 2, position: "relative" }}>
              <Typography variant="caption" color="text.secondary">S.No{startIndex + i + 1}</Typography>
              <Typography fontWeight={600}>{customer.name}</Typography>
              <Typography color="text.secondary" variant="body2">📱 {customer.contact}</Typography>
              
              <Box sx={{ position: "absolute", top: 10, right: 10 }}>
                <IconButton size="small" sx={{ color: PRIMARY }} onClick={() => {
                  setEditData(customer);
                  setOpenAddCustomer(true);
                }}><Edit fontSize="small" /></IconButton>
                <IconButton size="small" sx={{ color: "#dc2626" }} onClick={() => handleDeleteCustomer(customer._id)}><Delete fontSize="small" /></IconButton>
              </Box>
            </Box>
          ))}
        </Stack>
      )}

      {/* ---------- PAGINATION ---------- */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3, mb: 4 }}>
        {!isMobile && (
          <Select size="small" value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))}>
            <MenuItem value={6}>6 Rows</MenuItem>
            <MenuItem value={12}>12 Rows</MenuItem>
          </Select>
        )}
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="caption">{page} / {totalPages || 1}</Typography>
          <IconButton size="small" disabled={page === 1} onClick={() => setPage(p => p - 1)}><NavigateBefore /></IconButton>
          <IconButton size="small" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}><NavigateNext /></IconButton>
        </Stack>
      </Box>

      {/* ---------- RESPONSIVE DIALOG ---------- */}
      <Dialog 
        open={openAddCustomer} 
        onClose={() => {
          setOpenAddCustomer(false);
          setEditData(null);
        }}
        fullWidth
        maxWidth="sm"
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#f2f2f2" }}>
          {editData ? "Edit Customer" : "Add New Customer"}
          <IconButton onClick={() => {
            setOpenAddCustomer(false);
            setEditData(null);
          }}><Close /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
          <AddCustomer onClose={() => {
            setOpenAddCustomer(false);
            setEditData(null);
            fetchCustomers();
          }} editData={editData} isDialog={true} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}