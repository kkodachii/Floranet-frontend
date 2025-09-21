import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Typography,
  Autocomplete,
  Box,
  CircularProgress,
} from "@mui/material";
import FloraTable from "./FloraTable";
import apiService from "../services/api";

export default function AddPaymentModal({ open, onClose, onSave }) {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedResident, setSelectedResident] = useState(null);
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [newPayment, setNewPayment] = useState({
    residentName: "",
    residentId: "",
    residentDisplayId: "",
    residentNumber: "",
    residentEmail: "",
    paymentCategory: "placeholder",
    customCategory: "",
    amount: "",
    additionalFee: "",
    type: "placeholder",
    date: new Date().toISOString().split("T")[0],
  });

  // Helper function to convert to Title Case
  const toTitleCase = (str) =>
    str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

  useEffect(() => {
    const loadResidents = async () => {
      try {
        setLoading(true);
        const response = await apiService.getResidents(1, "", { per_page: 1000 });
        setResidents(response.data || []);
      } catch (error) {
        console.error("Error fetching residents:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open) loadResidents();
  }, [open]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setActiveStep(0);
      setSelectedResident(null);
      setNewPayment({
        residentName: "",
        residentId: "",
        residentDisplayId: "",
        residentNumber: "",
        residentEmail: "",
        paymentCategory: "placeholder",
        customCategory: "",
        amount: "",
        additionalFee: "",
        type: "placeholder",
        date: new Date().toISOString().split("T")[0],
      });
    }
  }, [open]);

  const handleResidentSelect = (newValue) => {
    setSelectedResident(newValue);
    if (newValue) {
      setNewPayment((prev) => ({
        ...prev,
        residentId: newValue.id,
        residentDisplayId: newValue.resident_id,
        residentName: newValue.name,
        residentNumber: newValue.contact_no || "",
        residentEmail: newValue.email || "",
      }));
    } else {
      setNewPayment((prev) => ({
        ...prev,
        residentId: "",
        residentDisplayId: "",
        residentName: "",
        residentNumber: "",
        residentEmail: "",
      }));
    }
  };

  const steps = ["Resident Information", "Payment Information", "Payment Summary"];

  const validateStep = () => {
    if (activeStep === 0 && !newPayment.residentId) {
      alert("Please select a resident.");
      return false;
    }
    if (activeStep === 1) {
      if (!newPayment.paymentCategory || newPayment.paymentCategory === "placeholder") {
        alert("Please choose a payment category.");
        return false;
      }
      if (newPayment.paymentCategory === "Other" && !newPayment.customCategory) {
        alert("Please specify the custom category.");
        return false;
      }
      if (!newPayment.amount) {
        alert("Please enter an amount.");
        return false;
      }
      if (!newPayment.type || newPayment.type === "placeholder") {
        alert("Please select a payment method.");
        return false;
      }
    }
    return true;
  };

  const handleNext = async () => {
    if (!validateStep()) return;

    // Convert customCategory to Title Case for submission
    const finalCustomCategory =
      newPayment.paymentCategory === "Other"
        ? toTitleCase(newPayment.customCategory)
        : null;

    if (activeStep === steps.length - 1) {
      try {
        setSubmitting(true);

        const paymentData = {
          resident_id: newPayment.residentDisplayId,
          payment_category:
            newPayment.paymentCategory === "Other"
              ? finalCustomCategory
              : newPayment.paymentCategory,
          amount: parseFloat(newPayment.amount),
          additional_fee: parseFloat(newPayment.additionalFee) || 0,
          other_reason: finalCustomCategory,
          method_of_payment: newPayment.type,
          paid_at: newPayment.date,
        };

        const response = await apiService.createOtherPayment(paymentData);

        if (onSave) onSave(response.data);
        onClose();
      } catch (error) {
        console.error(error);
        alert("Failed to save payment. Please try again.");
      } finally {
        setSubmitting(false);
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Payment</DialogTitle>
      <DialogContent>
        {/* Stepper */}
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 2 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step 1: Resident Info */}
        {activeStep === 0 && (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Autocomplete
                options={residents}
                loading={loading}
                getOptionLabel={(option) => `${option.resident_id} - ${option.name}`}
                value={residents.find((resident) => resident.id === newPayment.residentId) || null}
                onChange={(event, newValue) => handleResidentSelect(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search and Select Resident (Required)"
                    placeholder="Type to search residents..."
                    helperText="Search by ID or name to auto-fill the form"
                    required
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading && <CircularProgress size={20} color="inherit" />}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Typography variant="body1" fontWeight="bold">
                        {option.resident_id} - {option.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {option.email} • {option.house?.house_number || "N/A"}
                      </Typography>
                    </Box>
                  </Box>
                )}
                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                sx={{ mb: 3 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Resident Name" value={newPayment.residentName} disabled />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Resident ID" value={newPayment.residentDisplayId} disabled />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Contact Number" value={newPayment.residentNumber} disabled />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Email Address" value={newPayment.residentEmail} disabled />
            </Grid>
          </Grid>
        )}

        {/* Step 2: Payment Info */}
        {activeStep === 1 && (
          <Grid container spacing={2} marginTop={1}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="payment-category-label">Payment Category</InputLabel>
                <Select
                  labelId="payment-category-label"
                  value={newPayment.paymentCategory}
                  onChange={(e) => {
                    const category = e.target.value;
                    setNewPayment((prev) => ({
                      ...prev,
                      paymentCategory: category,
                      amount:
                        category === "Parking"
                          ? "100"
                          : category === "Basketball Rental"
                          ? "200"
                          : category === "Swimming Pool Rental"
                          ? "300"
                          : category === "Clubhouse"
                          ? "600"
                          : category === "Gazebo"
                          ? "500"
                          : category === "Other"
                          ? ""
                          : "",
                      additionalFee: category === "Other" ? prev.additionalFee : "0",
                      customCategory: category === "Other" ? prev.customCategory : "",
                    }));
                  }}
                  label="Payment Category"
                  sx={{
                    minHeight: '56px',
                    '& .MuiSelect-select': {
                      minHeight: '1.4375em',
                      padding: '16.5px 14px',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: 'primary.main',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.87)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                      borderWidth: 2,
                    }
                  }}
                >
                  <MenuItem value="placeholder" disabled>
                    <em>Select payment category</em>
                  </MenuItem>
                  <MenuItem value="Parking">Parking</MenuItem>
                  <MenuItem value="Basketball Rental">Basketball Rental</MenuItem>
                  <MenuItem value="Swimming Pool Rental">Swimming Pool Rental</MenuItem>
                  <MenuItem value="Clubhouse">Clubhouse</MenuItem>
                  <MenuItem value="Gazebo">Gazebo</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {newPayment.paymentCategory === "Other" && (
              <Grid item xs={12}>
                <TextField
                  label="Specify Other Category"
                  fullWidth
                  value={newPayment.customCategory}
                  onChange={(e) =>
                    setNewPayment((prev) => ({
                      ...prev,
                      customCategory: e.target.value,
                    }))
                  }
                  placeholder="Enter custom category"
                  required
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                label="Amount"
                type="number"
                fullWidth
                InputProps={{ startAdornment: <InputAdornment position="start">₱</InputAdornment> }}
                value={newPayment.amount}
                onChange={(e) =>
                  setNewPayment((prev) => ({ ...prev, amount: e.target.value }))
                }
                disabled={newPayment.paymentCategory !== "Other" && newPayment.paymentCategory !== ""}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Additional Fee"
                type="number"
                fullWidth
                InputProps={{ startAdornment: <InputAdornment position="start">₱</InputAdornment> }}
                value={newPayment.additionalFee}
                onChange={(e) =>
                  setNewPayment((prev) => ({ ...prev, additionalFee: e.target.value }))
                }
                disabled={newPayment.paymentCategory === "Other"}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="payment-method-label">Method of Payment</InputLabel>
                <Select
                  labelId="payment-method-label"
                  value={newPayment.type}
                  onChange={(e) => setNewPayment((prev) => ({ ...prev, type: e.target.value }))}
                  label="Method of Payment"
                  sx={{
                    minHeight: '56px',
                    '& .MuiSelect-select': {
                      minHeight: '1.4375em',
                      padding: '16.5px 14px',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: 'primary.main',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.87)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                      borderWidth: 2,
                    }
                  }}
                >
                  <MenuItem value="placeholder" disabled>
                    <em>Select payment method</em>
                  </MenuItem>
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="GCash">GCash</MenuItem>
                  <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}

        {/* Step 3: Summary */}
        {activeStep === 2 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Payment Summary
            </Typography>
            <FloraTable
              columns={[
                {
                  id: "field",
                  label: "Field",
                  render: (value) => <strong>{value}</strong>,
                },
                {
                  id: "value",
                  label: "Value",
                },
              ]}
              rows={[
                {
                  field: "Resident Name",
                  value: newPayment.residentName,
                },
                {
                  field: "Resident ID",
                  value: newPayment.residentDisplayId,
                },
                {
                  field: "Payment Category",
                  value: newPayment.paymentCategory === "Other"
                    ? toTitleCase(newPayment.customCategory)
                    : newPayment.paymentCategory,
                },
                {
                  field: "Amount",
                  value: `₱${Number(newPayment.amount || 0).toLocaleString()}`,
                },
                {
                  field: "Additional Fee",
                  value: `₱${Number(newPayment.additionalFee || 0).toLocaleString()}`,
                },
                {
                  field: "Total Amount",
                  value: `₱${(Number(newPayment.amount || 0) + Number(newPayment.additionalFee || 0)).toLocaleString()}`,
                },
                {
                  field: "Payment Method",
                  value: newPayment.type,
                },
                {
                  field: "Date",
                  value: new Date(newPayment.date).toLocaleDateString(),
                },
              ]}
              actions={[]}
              page={1}
              rowsPerPage={10}
              maxHeight="400px"
              emptyMessage="No data to display"
              disableInternalPagination
              paginationInfo={{
                total: 8,
                totalPages: 1,
                from: 1,
                to: 8,
              }}
              onPageChange={() => {}}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        {activeStep > 0 && <Button onClick={handleBack} disabled={submitting}>Back</Button>}
        <Button onClick={onClose} disabled={submitting}>Cancel</Button>
        <Button variant="contained" onClick={handleNext} disabled={submitting}>
          {submitting ? <CircularProgress size={20} color="inherit" /> : activeStep === steps.length - 1 ? "Submit" : "Next"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
