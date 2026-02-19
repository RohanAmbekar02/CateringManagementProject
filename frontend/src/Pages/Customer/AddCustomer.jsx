import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Stack, useMediaQuery, useTheme } from "@mui/material";
import { Person, Phone, Save, RotateLeft, CheckCircle } from "@mui/icons-material";
import Swal from "sweetalert2";
import { addCustomer, updateCustomer } from "../../api/customerAPI";

const AddCustomer = ({ onClose, editData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState({ customerName: "", mobileNumber: "" });
  const [errors, setErrors] = useState({ customerName: "", mobileNumber: "" });
  const [isLoading, setIsLoading] = useState(false);

  // ⭐ LOAD DATA FOR EDIT
  useEffect(() => {
    if (editData) {
      console.log("Loading edit data:", editData);
      setFormData({ customerName: editData.name, mobileNumber: editData.contact });
    } else {
      setFormData({ customerName: "", mobileNumber: "" });
    }
  }, [editData]);

  const { customerName, mobileNumber } = formData;
  const setCustomerName = (value) => setFormData(prev => ({ ...prev, customerName: value }));
  const setMobileNumber = (value) => setFormData(prev => ({ ...prev, mobileNumber: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = { customerName: "", mobileNumber: "" };
    let isValid = true;

    if (!customerName.trim()) {
      newErrors.customerName = "Name is required";
      isValid = false;
    }
    if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
      newErrors.mobileNumber = "Valid 10-digit number is required";
      isValid = false;
    }

    setErrors(newErrors);
    if (!isValid) return;

    // API Call
    setIsLoading(true);
    try {
      if (editData) {
        await updateCustomer(editData._id, { name: customerName, contact: mobileNumber });
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Customer updated successfully",
          confirmButtonColor: "#1f3a8a",
          timer: 2000,
          timerProgressBar: true
        });
      } else {
        await addCustomer({ name: customerName, contact: mobileNumber });
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Customer added successfully",
          confirmButtonColor: "#1f3a8a",
          timer: 2000,
          timerProgressBar: true
        });
      }
      handleReset();
      if (onClose) onClose();
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to save customer";
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: errorMessage,
        confirmButtonColor: "#1f3a8a"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ customerName: "", mobileNumber: "" });
    setErrors({ customerName: "", mobileNumber: "" });
  };

  // Modern Input Wrapper Style
  const inputWrapperStyle = (hasError, isSuccess) => ({
    display: "flex",
    alignItems: "center",
    border: `2px solid ${hasError ? "#ef4444" : isSuccess ? "#22c55e" : "#e5e7eb"}`,
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
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
      <Typography variant="body2" sx={{ mb: 4, color: "#6b7280", fontStyle: "italic" }}>
        Enter customer details to register them in the system.
      </Typography>

      <Stack direction={isMobile ? "column" : "row"} spacing={3}>
        
        {/* Customer Name */}
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: "13px", fontWeight: "700", mb: 1, color: "#1f2937", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Full Name
          </Typography>
          <Box sx={inputWrapperStyle(errors.customerName, customerName.length > 2)}>
            <Person sx={{ color: errors.customerName ? "#ef4444" : "#9ca3af", mr: 1 }} />
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Pooja Deshmukh"
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
            {customerName.length > 2 && !errors.customerName && <CheckCircle sx={{ color: "#22c55e", fontSize: "18px" }} />}
          </Box>
          {errors.customerName && <Typography sx={{ color: "#ef4444", fontSize: "11px", mt: 0.5, fontWeight: "600" }}>{errors.customerName}</Typography>}
        </Box>

        {/* Mobile Number */}
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: "13px", fontWeight: "700", mb: 1, color: "#1f2937", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Mobile Number
          </Typography>
          <Box sx={inputWrapperStyle(errors.mobileNumber, /^\d{10}$/.test(mobileNumber))}>
            <Phone sx={{ color: errors.mobileNumber ? "#ef4444" : "#9ca3af", mr: 1 }} />
            <input
              type="tel"
              maxLength="10"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="10-digit number"
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
            {/^\d{10}$/.test(mobileNumber) && <CheckCircle sx={{ color: "#22c55e", fontSize: "18px" }} />}
          </Box>
          {errors.mobileNumber && <Typography sx={{ color: "#ef4444", fontSize: "11px", mt: 0.5, fontWeight: "600" }}>{errors.mobileNumber}</Typography>}
        </Box>
      </Stack>

      {/* Action Buttons */}
      <Box sx={{ 
        display: "flex", 
        gap: 2, 
        mt: 5, 
        justifyContent: "flex-end", 
        flexDirection: isMobile ? "column-reverse" : "row" 
      }}>
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
            "&:hover": { bgcolor: "#1e40af", boxShadow: "0 20px 25px -5px rgba(31, 58, 138, 0.4)" },
            "&:disabled": { bgcolor: "#9ca3af", cursor: "not-allowed" }
          }}
        >
          {isLoading ? "Saving..." : "Save Customer Details"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddCustomer;