

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Stack,
  Dialog,
  DialogContent,
  InputAdornment
} from "@mui/material";

import {
  Search,
  Add,
  Edit,
  Delete,
  NavigateBefore,
  NavigateNext
} from "@mui/icons-material";

import AddItem from "./add-item";
import { getItems, deleteItem } from "../../api/itemAPI";
import Swal from "sweetalert2";

export default function Items() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openAddItem, setOpenAddItem] = useState(false);
  const [editData, setEditData] = useState(null);
  const [itemsData, setItemsData] = useState([]);
  const [page, setPage] = useState(1);

  const rowsPerPage = 6;
  const BG_LIGHT = "#f5f8ff";

  const fetchItems = useCallback(async () => {
    try {
      const response = await getItems();
      setItemsData(response?.data?.data || response?.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleDeleteItem = async (id) => {
    const result = await Swal.fire({
      title: "Delete Item?",
      icon: "warning",
      showCancelButton: true
    });

    if (result.isConfirmed) {
      await deleteItem(id);
      fetchItems();
      Swal.fire("Deleted!", "", "success");
    }
  };

  const filteredItems = useMemo(
    () =>
      itemsData.filter((item) =>
        item?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery, itemsData]
  );

  const totalPages = Math.ceil(filteredItems.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const currentItems = filteredItems.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>

      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ color: "#1f3a8a" }}
        >
          Items
        </Typography>

        <Button
          startIcon={<Add />}
          onClick={() => {
            setEditData(null);
            setOpenAddItem(true);
          }}
          variant="contained"
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            px: 3,
            backgroundColor: "#1f3a8a"
          }}
        >
          Add Item
        </Button>
      </Stack>

      {/* Search */}
      <TextField
        size="small"
        placeholder="Search items"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          mb: 3,
          width: 350
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          )
        }}
      />

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: BG_LIGHT }}>
            <TableRow>
              <TableCell><b>S.No.</b></TableCell>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Price</b></TableCell>
              <TableCell align="center"><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {currentItems.map((item, i) => (
              <TableRow key={item._id} hover>
                <TableCell>{startIndex + i + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>₹{item.price}</TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() => {
                      setEditData(item);
                      setOpenAddItem(true);
                    }}
                    sx={{ color: "#1976d2" }}
                  >
                    <Edit />
                  </IconButton>

                  <IconButton
                    onClick={() => handleDeleteItem(item._id)}
                    sx={{ color: "red" }}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {currentItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No items found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Stack direction="row" spacing={1} mt={2} justifyContent="flex-end">
        <IconButton
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          <NavigateBefore />
        </IconButton>

        <IconButton
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          <NavigateNext />
        </IconButton>
      </Stack>

      {/* Dialog (FIXED - Removed DialogTitle) */}
      <Dialog
        open={openAddItem}
        onClose={() => {
          setOpenAddItem(false);
          setEditData(null);
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <AddItem
            key={editData?._id || "new"}
            editData={editData}
            onClose={() => {
              setOpenAddItem(false);
              setEditData(null);
              fetchItems();
            }}
          />
        </DialogContent>
      </Dialog>

    </Box>
  );
}
