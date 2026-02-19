import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  useMediaQuery,
  useTheme,
  IconButton,
  Divider
} from "@mui/material";
import {
  Inventory,
  CurrencyRupee,
  Save,
  RotateLeft,
  CheckCircle,
  Close
} from "@mui/icons-material";
import { addItem, updateItem } from "../../api/itemAPI";
import Swal from "sweetalert2";

const AddItem = ({ onClose, editData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [itemName, setItemName] = useState(editData?.name || "");
  const [price, setPrice] = useState(editData?.price || "");
  const [errors, setErrors] = useState({ itemName: "", price: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = { itemName: "", price: "" };
    let isValid = true;

    if (!itemName.trim()) {
      newErrors.itemName = "Item name is required";
      isValid = false;
    }

    if (!price || Number(price) <= 0) {
      newErrors.price = "Valid price is required";
      isValid = false;
    }

    setErrors(newErrors);
    if (!isValid) return;

    setIsLoading(true);

    try {
      if (editData) {
        await updateItem(editData._id, {
          name: itemName,
          price: Number(price)
        });

        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Item updated successfully",
          confirmButtonColor: "#1f3a8a",
          timer: 2000,
          timerProgressBar: true
        });
      } else {
        await addItem({
          name: itemName,
          price: Number(price)
        });

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Item added successfully",
          confirmButtonColor: "#1f3a8a",
          timer: 2000,
          timerProgressBar: true
        });
      }

      handleReset();
      if (onClose) onClose();

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Something went wrong",
        confirmButtonColor: "#1f3a8a"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setItemName("");
    setPrice("");
    setErrors({ itemName: "", price: "" });
  };

  const inputWrapperStyle = (hasError, isSuccess) => ({
    display: "flex",
    alignItems: "center",
    border: `2px solid ${
      hasError ? "#ef4444" : isSuccess ? "#22c55e" : "#e5e7eb"
    }`,
    borderRadius: "12px",
    padding: "6px 14px",
    backgroundColor: "#fcfcfc",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: isSuccess ? "0 0 8px rgba(34, 197, 94, 0.1)" : "none",
    "&:focus-within": {
      borderColor: hasError ? "#ef4444" : "#1f3a8a",
      backgroundColor: "#fff",
      boxShadow: "0 0 0 4px rgba(31, 58, 138, 0.1)",
      transform: "translateY(-1px)"
    }
  });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: "100%",
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
      }}
    >

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          py: 2,
          backgroundColor: "#f9fafb",
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px"
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {editData ? "Update Item" : "Add New Item"}
        </Typography>

        <IconButton onClick={onClose}>
          <Close sx={{ color: "#6b7280" }} />
        </IconButton>
      </Box>

      <Divider />

      {/* Body */}
      <Box sx={{ px: 3, py: 3 }}>

        <Typography
          variant="body2"
          sx={{ mb: 4, color: "#6b7280", fontStyle: "italic" }}
        >
          Enter item details to register them in the system.
        </Typography>

        <Stack direction={isMobile ? "column" : "row"} spacing={3}>

          {/* Item Name */}
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: "700",
                mb: 1,
                color: "#1f2937",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}
            >
              Item Name
            </Typography>

            <Box sx={inputWrapperStyle(errors.itemName, itemName.length > 2)}>
              <Inventory
                sx={{
                  color: errors.itemName ? "#ef4444" : "#9ca3af",
                  mr: 1
                }}
              />

              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Mixing Bowl"
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  fontSize: "15px",
                  fontWeight: "500",
                  padding: "10px 0",
                  color: "#111827",
                  background: "transparent"
                }}
              />

              {itemName.length > 2 && !errors.itemName && (
                <CheckCircle sx={{ color: "#22c55e", fontSize: "18px" }} />
              )}
            </Box>

            {errors.itemName && (
              <Typography
                sx={{
                  color: "#ef4444",
                  fontSize: "11px",
                  mt: 0.5,
                  fontWeight: "600"
                }}
              >
                {errors.itemName}
              </Typography>
            )}
          </Box>

          {/* Price */}
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: "700",
                mb: 1,
                color: "#1f2937",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}
            >
              Price (₹)
            </Typography>

            <Box sx={inputWrapperStyle(errors.price, Number(price) > 0)}>
              <CurrencyRupee
                sx={{
                  color: errors.price ? "#ef4444" : "#9ca3af",
                  mr: 1
                }}
              />

              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  fontSize: "15px",
                  fontWeight: "500",
                  padding: "10px 0",
                  color: "#111827",
                  background: "transparent"
                }}
              />

              {Number(price) > 0 && !errors.price && (
                <CheckCircle sx={{ color: "#22c55e", fontSize: "18px" }} />
              )}
            </Box>

            {errors.price && (
              <Typography
                sx={{
                  color: "#ef4444",
                  fontSize: "11px",
                  mt: 0.5,
                  fontWeight: "600"
                }}
              >
                {errors.price}
              </Typography>
            )}
          </Box>

        </Stack>

        {/* Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mt: 5,
            justifyContent: "flex-end",
            flexDirection: isMobile ? "column-reverse" : "row"
          }}
        >
          <Button
            onClick={handleReset}
            variant="text"
            startIcon={<RotateLeft />}
            sx={{
              color: "#6b7280",
              textTransform: "none",
              fontWeight: "600",
              borderRadius: "10px",
              "&:hover": { backgroundColor: "#f3f4f6" }
            }}
          >
            Clear Form
          </Button>

          <Button
            type="submit"
            variant="contained"
            startIcon={<Save />}
            disabled={isLoading}
            sx={{
              bgcolor: "#1f3a8a",
              borderRadius: "12px",
              textTransform: "none",
              px: 5,
              py: 1.5,
              fontWeight: "600",
              fontSize: "15px",
              boxShadow: "0 10px 15px -3px rgba(31, 58, 138, 0.3)",
              "&:hover": {
                bgcolor: "#1e40af",
                boxShadow: "0 20px 25px -5px rgba(31, 58, 138, 0.4)"
              }
            }}
          >
            {isLoading
              ? "Saving..."
              : editData
              ? "Update Item"
              : "Save Item"}
          </Button>
        </Box>

      </Box>
    </Box>
  );
};

export default AddItem;
