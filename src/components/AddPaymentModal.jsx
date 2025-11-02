import React, { useState, useEffect } from "react";
import {
  LocalizationProvider,
  TimePicker,
  DatePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
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
  IconButton,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
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
    parkingStartDate: null,
    parkingEndDate: null,
    rentalStartTime: null,
    rentalEndTime: null,
    rentalDate: null,
  });

  // Helper function to convert to Title Case
  const toTitleCase = (str) =>
    str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );

  // Helper to calculate months between dates
  const calculateMonthsBetween = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth()) +
      1;
    return Math.max(0, months);
  };

  // Helper to calculate hours between times
  const calculateHoursBetween = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;

    let start = dayjs(startTime);
    let end = dayjs(endTime);

    // If end time is before start time, assume it's the next day
    if (end.isBefore(start)) {
      end = end.add(1, "day");
    }

    const hours = end.diff(start, "hour", true);
    return Math.max(0, Math.ceil(hours));
  };

  // Get hourly rate for rental category
  const getHourlyRate = (category) => {
    const rates = {
      "Basketball Rental": 100,
      "Swimming Pool Rental": 300,
      Clubhouse: 300,
      Gazebo: 100,
    };
    return rates[category] || 0;
  };

  useEffect(() => {
    const loadResidents = async () => {
      try {
        setLoading(true);
        const response = await apiService.getResidents(1, "", {
          per_page: 1000,
        });
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
        parkingStartDate: null,
        parkingEndDate: null,
        rentalStartTime: null,
        rentalEndTime: null,
        rentalDate: null,
      });
    }
  }, [open]);

  // Update amount when parking dates change
  useEffect(() => {
    if (
      newPayment.paymentCategory === "Parking" &&
      newPayment.parkingStartDate &&
      newPayment.parkingEndDate
    ) {
      const months = calculateMonthsBetween(
        newPayment.parkingStartDate,
        newPayment.parkingEndDate
      );
      setNewPayment((prev) => ({
        ...prev,
        amount: String(months * 100), // ₱100 per month
      }));
    }
  }, [
    newPayment.parkingStartDate,
    newPayment.parkingEndDate,
    newPayment.paymentCategory,
  ]);

  // Update amount when rental times change
  useEffect(() => {
    const rentalCategories = [
      "Basketball Rental",
      "Swimming Pool Rental",
      "Clubhouse",
      "Gazebo",
    ];

    if (
      rentalCategories.includes(newPayment.paymentCategory) &&
      newPayment.rentalStartTime &&
      newPayment.rentalEndTime
    ) {
      const hours = calculateHoursBetween(
        newPayment.rentalStartTime,
        newPayment.rentalEndTime
      );
      const hourlyRate = getHourlyRate(newPayment.paymentCategory);
      setNewPayment((prev) => ({
        ...prev,
        amount: String(hours * hourlyRate),
      }));
    }
  }, [
    newPayment.rentalStartTime,
    newPayment.rentalEndTime,
    newPayment.paymentCategory,
  ]);

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

  const steps = [
    "Resident Information",
    "Payment Information",
    "Payment Summary",
  ];

  const validateStep = () => {
    if (activeStep === 0 && !newPayment.residentId) {
      alert("Please select a resident.");
      return false;
    }
    if (activeStep === 1) {
      if (
        !newPayment.paymentCategory ||
        newPayment.paymentCategory === "placeholder"
      ) {
        alert("Please choose a payment category.");
        return false;
      }
      if (newPayment.paymentCategory === "Parking") {
        if (!newPayment.parkingStartDate || !newPayment.parkingEndDate) {
          alert("Please select both start and end dates for parking.");
          return false;
        }
        if (
          new Date(newPayment.parkingEndDate) <
          new Date(newPayment.parkingStartDate)
        ) {
          alert("End date cannot be before start date.");
          return false;
        }
      }
      if (
        [
          "Basketball Rental",
          "Swimming Pool Rental",
          "Clubhouse",
          "Gazebo",
        ].includes(newPayment.paymentCategory)
      ) {
        if (!newPayment.rentalDate) {
          alert("Please select a rental date.");
          return false;
        }
        if (!newPayment.rentalStartTime || !newPayment.rentalEndTime) {
          alert("Please select both start and end times for the rental.");
          return false;
        }
        if (newPayment.rentalEndTime.isSame(newPayment.rentalStartTime)) {
          alert("End time cannot be the same as start time.");
          return false;
        }
      }
      if (
        newPayment.paymentCategory === "Other" &&
        !newPayment.customCategory
      ) {
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
          parking_start_date:
            newPayment.paymentCategory === "Parking" &&
            newPayment.parkingStartDate
              ? newPayment.parkingStartDate.format("YYYY-MM-DD")
              : null,
          parking_end_date:
            newPayment.paymentCategory === "Parking" &&
            newPayment.parkingEndDate
              ? newPayment.parkingEndDate.format("YYYY-MM-DD")
              : null,
          rental_date:
            [
              "Basketball Rental",
              "Swimming Pool Rental",
              "Clubhouse",
              "Gazebo",
            ].includes(newPayment.paymentCategory) && newPayment.rentalDate
              ? newPayment.rentalDate.format("YYYY-MM-DD")
              : null,
          rental_start_time:
            [
              "Basketball Rental",
              "Swimming Pool Rental",
              "Clubhouse",
              "Gazebo",
            ].includes(newPayment.paymentCategory) && newPayment.rentalStartTime
              ? newPayment.rentalStartTime.format("HH:mm:ss")
              : null,
          rental_end_time:
            [
              "Basketball Rental",
              "Swimming Pool Rental",
              "Clubhouse",
              "Gazebo",
            ].includes(newPayment.paymentCategory) && newPayment.rentalEndTime
              ? newPayment.rentalEndTime.format("HH:mm:ss")
              : null,
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

  const formatDateRange = () => {
    if (!newPayment.parkingStartDate || !newPayment.parkingEndDate) return "";
    const start = new Date(newPayment.parkingStartDate);
    const end = new Date(newPayment.parkingEndDate);
    const months = calculateMonthsBetween(
      newPayment.parkingStartDate,
      newPayment.parkingEndDate
    );
    return `${start.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })} to ${end.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })} (${months} month${months !== 1 ? "s" : ""})`;
  };

  const formatTimeRange = () => {
    if (!newPayment.rentalStartTime || !newPayment.rentalEndTime) return "";
    return `${newPayment.rentalStartTime.format(
      "h:mm A"
    )} - ${newPayment.rentalEndTime.format("h:mm A")}`;
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
                getOptionLabel={(option) =>
                  `${option.resident_id} - ${option.name}`
                }
                value={
                  residents.find(
                    (resident) => resident.id === newPayment.residentId
                  ) || null
                }
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
                          {loading && (
                            <CircularProgress size={20} color="inherit" />
                          )}
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
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                sx={{ mb: 3 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Resident Name"
                value={newPayment.residentName}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Resident ID"
                value={newPayment.residentDisplayId}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Number"
                value={newPayment.residentNumber}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                value={newPayment.residentEmail}
                disabled
              />
            </Grid>
          </Grid>
        )}

        {/* Step 2: Payment Info */}
        {activeStep === 1 && (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
              sx={{
                maxHeight: "65vh",
                overflowY: "auto",
                overflowX: "hidden",
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              {/* ROW 1 */}
              <Grid container spacing={2} alignItems="center">
                <Grid
                  item
                  xs={12}
                  sm={newPayment.paymentCategory === "Other" ? 6 : 12}
                >
                  <FormControl sx={{ minWidth: 250, flexGrow: 1 }}>
                    <InputLabel>Payment Category</InputLabel>
                    <Select
                      value={newPayment.paymentCategory}
                      label="Payment Category"
                      onChange={(e) => {
                        const category = e.target.value;
                        setNewPayment((prev) => ({
                          ...prev,
                          paymentCategory: category,
                          customCategory: "",
                          parkingStartDate: null,
                          parkingEndDate: null,
                          rentalDate: null,
                          rentalStartTime: null,
                          rentalEndTime: null,
                          amount:
                            category === "Parking"
                              ? ""
                              : category === "Basketball Rental"
                              ? "200"
                              : category === "Swimming Pool Rental"
                              ? "300"
                              : category === "Clubhouse"
                              ? "600"
                              : category === "Gazebo"
                              ? "500"
                              : "",
                          additionalFee: "",
                          type: "",
                        }));
                      }}
                    >
                      <MenuItem value="Parking">Parking</MenuItem>
                      <MenuItem value="Basketball Rental">
                        Basketball Rental
                      </MenuItem>
                      <MenuItem value="Swimming Pool Rental">
                        Swimming Pool Rental
                      </MenuItem>
                      <MenuItem value="Clubhouse">Clubhouse</MenuItem>
                      <MenuItem value="Gazebo">Gazebo</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {newPayment.paymentCategory === "Other" && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Specify Category"
                      fullWidth
                      value={newPayment.customCategory}
                      onChange={(e) =>
                        setNewPayment((prev) => ({
                          ...prev,
                          customCategory: e.target.value,
                        }))
                      }
                    />
                  </Grid>
                )}
              </Grid>

              {/* ROW 2 - Parking Dates */}
              {newPayment.paymentCategory === "Parking" && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="Start Date"
                      value={newPayment.parkingStartDate}
                      onChange={(newValue) => {
                        setNewPayment((prev) => ({
                          ...prev,
                          parkingStartDate: newValue,
                        }));
                      }}
                      slotProps={{
                        popper: {
                          placement: "bottom-start",
                        },
                        textField: {
                          fullWidth: true,
                          InputProps: {
                            endAdornment: newPayment.parkingStartDate && (
                              <InputAdornment position="end">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setNewPayment((prev) => ({
                                      ...prev,
                                      parkingStartDate: null,
                                    }));
                                  }}
                                >
                                  <ClearIcon fontSize="small" />
                                </IconButton>
                              </InputAdornment>
                            ),
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="End Date"
                      value={newPayment.parkingEndDate}
                      onChange={(newValue) => {
                        setNewPayment((prev) => ({
                          ...prev,
                          parkingEndDate: newValue,
                        }));
                      }}
                      slotProps={{
                        popper: {
                          placement: "bottom-start",
                        },
                        textField: {
                          fullWidth: true,
                          InputProps: {
                            endAdornment: newPayment.parkingEndDate && (
                              <InputAdornment position="end">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setNewPayment((prev) => ({
                                      ...prev,
                                      parkingEndDate: null,
                                    }));
                                  }}
                                >
                                  <ClearIcon fontSize="small" />
                                </IconButton>
                              </InputAdornment>
                            ),
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              )}

              {/* ROW 2 - Rental Date and Times */}
              {[
                "Basketball Rental",
                "Swimming Pool Rental",
                "Clubhouse",
                "Gazebo",
              ].includes(newPayment.paymentCategory) && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <DatePicker
                      label="Reservation Date"
                      value={newPayment.rentalDate}
                      onChange={(newValue) => {
                        setNewPayment((prev) => ({
                          ...prev,
                          rentalDate: newValue,
                        }));
                      }}
                      slotProps={{
                        popper: {
                          placement: "bottom-start",
                        },
                        textField: {
                          fullWidth: true,
                          InputProps: {
                            endAdornment: newPayment.rentalDate && (
                              <InputAdornment position="end">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setNewPayment((prev) => ({
                                      ...prev,
                                      rentalDate: null,
                                    }));
                                  }}
                                >
                                  <ClearIcon fontSize="small" />
                                </IconButton>
                              </InputAdornment>
                            ),
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TimePicker
                      label="Start Time"
                      value={newPayment.rentalStartTime}
                      onChange={(val) =>
                        setNewPayment((prev) => ({
                          ...prev,
                          rentalStartTime: val,
                        }))
                      }
                      slotProps={{
                        popper: {
                          placement: "bottom-start",
                        },
                        textField: {
                          fullWidth: true,
                          InputProps: {
                            endAdornment: newPayment.rentalStartTime && (
                              <InputAdornment position="end">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setNewPayment((prev) => ({
                                      ...prev,
                                      rentalStartTime: null,
                                    }));
                                  }}
                                >
                                  <ClearIcon fontSize="small" />
                                </IconButton>
                              </InputAdornment>
                            ),
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TimePicker
                      label="End Time"
                      value={newPayment.rentalEndTime}
                      onChange={(val) =>
                        setNewPayment((prev) => ({
                          ...prev,
                          rentalEndTime: val,
                        }))
                      }
                      slotProps={{
                        popper: {
                          placement: "bottom-start",
                        },
                        textField: {
                          fullWidth: true,
                          InputProps: {
                            endAdornment: newPayment.rentalEndTime && (
                              <InputAdornment position="end">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setNewPayment((prev) => ({
                                      ...prev,
                                      rentalEndTime: null,
                                    }));
                                  }}
                                >
                                  <ClearIcon fontSize="small" />
                                </IconButton>
                              </InputAdornment>
                            ),
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              )}

              {/* ROW 3 - Amount, Additional Fee, Payment Method */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Amount"
                    type="number"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₱</InputAdornment>
                      ),
                    }}
                    value={newPayment.amount}
                    onChange={(e) =>
                      setNewPayment((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                    disabled={
                      newPayment.paymentCategory === "Parking" ||
                      [
                        "Basketball Rental",
                        "Swimming Pool Rental",
                        "Clubhouse",
                        "Gazebo",
                      ].includes(newPayment.paymentCategory)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Additional Fee"
                    type="number"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₱</InputAdornment>
                      ),
                    }}
                    value={newPayment.additionalFee}
                    onChange={(e) =>
                      setNewPayment((prev) => ({
                        ...prev,
                        additionalFee: e.target.value,
                      }))
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl sx={{ minWidth: 250, flexGrow: 1 }}>
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      value={newPayment.type}
                      label="Payment Method"
                      onChange={(e) =>
                        setNewPayment((prev) => ({
                          ...prev,
                          type: e.target.value,
                        }))
                      }
                    >
                      <MenuItem value="Cash">Cash</MenuItem>
                      <MenuItem value="GCash">GCash</MenuItem>
                      <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </LocalizationProvider>
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
                  value:
                    newPayment.paymentCategory === "Other"
                      ? toTitleCase(newPayment.customCategory)
                      : newPayment.paymentCategory,
                },
                ...(newPayment.paymentCategory === "Parking"
                  ? [
                      {
                        field: "Parking Duration",
                        value: formatDateRange(),
                      },
                    ]
                  : []),
                ...([
                  "Basketball Rental",
                  "Swimming Pool Rental",
                  "Clubhouse",
                  "Gazebo",
                ].includes(newPayment.paymentCategory)
                  ? [
                      {
                        field: "Rental Date",
                        value: newPayment.rentalDate
                          ? newPayment.rentalDate.format("MM/DD/YYYY")
                          : "",
                      },
                      {
                        field: "Rental Time",
                        value: formatTimeRange(),
                      },
                    ]
                  : []),
                {
                  field: "Amount",
                  value: `₱${Number(newPayment.amount || 0).toLocaleString()}`,
                },
                {
                  field: "Additional Fee",
                  value: `₱${Number(
                    newPayment.additionalFee || 0
                  ).toLocaleString()}`,
                },
                {
                  field: "Total Amount",
                  value: `₱${(
                    Number(newPayment.amount || 0) +
                    Number(newPayment.additionalFee || 0)
                  ).toLocaleString()}`,
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
              onPageChange={() => {}}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        {activeStep > 0 && (
          <Button onClick={handleBack} disabled={submitting}>
            Back
          </Button>
        )}
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleNext} disabled={submitting}>
          {submitting ? (
            <CircularProgress size={20} color="inherit" />
          ) : activeStep === steps.length - 1 ? (
            "Submit"
          ) : (
            "Next"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
