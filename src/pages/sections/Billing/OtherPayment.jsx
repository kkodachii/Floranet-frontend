import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  useMediaQuery,
  Snackbar,
  Alert,
  CircularProgress,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import VisibilityIcon from "@mui/icons-material/Visibility";

import FloraTable from "../../../components/FloraTable";
import AddPaymentModal from "../../../components/AddPaymentModal";
import apiService from "../../../services/api";

function OtherPayment() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filterValues, setFilterValues] = useState({
    type: "all",
    date: "",
    month: "",
    paymentCategory: "all",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [payments, setPayments] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [filterDate, setFilterDate] = useState(null);
  const [filterMonth, setFilterMonth] = useState("");

  const months = [
    { value: "", label: "All Months" },
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchPayments = async (page = 1, searchTerm = "", filters = {}) => {
    try {
      setLoading(true);
      const response = await apiService.getOtherPayments(
        page,
        searchTerm,
        filters
      );
      const result = (await response.json) ? await response.json() : response;

      setPayments(result.data || []);
      setPagination({
        current_page: result.current_page || 1,
        last_page: result.last_page || 1,
        total: result.total || 0,
        per_page: result.per_page || 10,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching payments:", error);
      setError("Failed to load payments");
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchPayments(1, search, filterValues);
  }, []);

  // Fetch when search or filters change
  useEffect(() => {
    fetchPayments(1, search, filterValues);
  }, [search, filterValues]);

  const handlePaymentAdded = async () => {
    setSnackbar({
      open: true,
      message: "Payment added successfully!",
      severity: "success",
    });
    await fetchPayments(pagination.current_page, search, filterValues);
  };

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
    setSearch(e.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      fetchPayments(newPage, search, filterValues);
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearch("");
  };

  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedPayment(null);
  };

  const formatDateRange = (payment) => {
    if (!payment?.parking_start_date || !payment?.parking_end_date) return "-";
    const start = new Date(payment.parking_start_date);
    const end = new Date(payment.parking_end_date);

    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth()) +
      1;

    return `${start.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })} to ${end.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })} (${months} month${months !== 1 ? "s" : ""})`;
  };

  const formatTimeRange = (payment) => {
    if (!payment?.rental_start_time || !payment?.rental_end_time) return "-";

    const formatTime = (timeString) => {
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    };

    return `${formatTime(payment.rental_start_time)} - ${formatTime(
      payment.rental_end_time
    )}`;
  };

  const { current_page, last_page, total, per_page } = pagination;
  const from = total === 0 ? 0 : (current_page - 1) * per_page + 1;
  const to = Math.min(current_page * per_page, total);

  const columns = [
    {
      id: "resident_name",
      label: "Resident Name",
      render: (value, row) => row.resident?.name || value || "-",
    },
    {
      id: "resident_id",
      label: "Resident ID",
      render: (value, row) => row.resident?.resident_id || value || "-",
    },
    {
      id: "email",
      label: "Email",
      render: (value, row) => row.resident?.email || value || "-",
    },
    {
      id: "phone_number",
      label: "Phone Number",
      render: (value, row) => row.resident?.contact_no || value || "-",
    },
    {
      id: "payment_category",
      label: "Payment Category",
      render: (value, row) =>
        value === "Other" && row.other_reason ? row.other_reason : value || "-",
    },
    {
      id: "amount",
      label: "Amount",
      align: "center",
      render: (v) => `₱${Number(v || 0).toLocaleString()}`,
    },
    { id: "method_of_payment", label: "Payment Method" },
    {
      id: "paid_at",
      label: "Date",
      render: (v) => (v ? new Date(v).toLocaleDateString() : "-"),
    },
  ];

  const actions = [
    {
      label: "View",
      icon: <VisibilityIcon fontSize="small" />,
      color: "primary",
      sx: { "&:hover": { bgcolor: "primary.main", color: "#fff" } },
      onClick: (row) => handleViewPayment(row),
    },
  ];

  const getViewModalRows = () => {
    if (!selectedPayment) return [];

    const payment = selectedPayment;
    const isRentalType = [
      "Basketball Rental",
      "Swimming Pool Rental",
      "Clubhouse",
      "Gazebo",
    ].includes(payment.payment_category);
    const isParkingType = payment.payment_category === "Parking";

    return [
      { field: "Resident Name", value: payment.resident?.name || "-" },
      { field: "Resident ID", value: payment.resident?.resident_id || "-" },
      { field: "Email", value: payment.resident?.email || "-" },
      { field: "Phone Number", value: payment.resident?.contact_no || "-" },
      {
        field: "Payment Category",
        value:
          payment.payment_category === "Other" && payment.other_reason
            ? payment.other_reason
            : payment.payment_category || "-",
      },
      ...(isParkingType
        ? [{ field: "Parking Duration", value: formatDateRange(payment) }]
        : []),
      ...(isRentalType
        ? [
            {
              field: "Rental Date",
              value: payment.rental_date
                ? new Date(payment.rental_date).toLocaleDateString()
                : "-",
            },
            { field: "Rental Time", value: formatTimeRange(payment) },
          ]
        : []),
      {
        field: "Amount",
        value: `₱${Number(payment.amount || 0).toLocaleString()}`,
      },
      {
        field: "Additional Fee",
        value: `₱${Number(payment.additional_fee || 0).toLocaleString()}`,
      },
      {
        field: "Total Amount",
        value: `₱${(
          Number(payment.amount || 0) + Number(payment.additional_fee || 0)
        ).toLocaleString()}`,
      },
      { field: "Payment Method", value: payment.method_of_payment || "-" },
      {
        field: "Date Paid",
        value: payment.paid_at
          ? new Date(payment.paid_at).toLocaleDateString()
          : "-",
      },
    ];
  };

  const tableMaxHeight = isMobile ? "40vh" : "60vh";

  if (loading && payments.length === 0) {
    return (
      <Box sx={{ p: { xs: 0.5, sm: 1 } }}>
        <Box maxWidth="xl" mx="auto">
          <Paper
            elevation={3}
            sx={{
              borderRadius: 1,
              overflow: "hidden",
              p: { xs: 0.5, sm: 1 },
              boxShadow: 3,
              minHeight: 300,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 200,
              }}
            >
              <CircularProgress color="primary" />
            </Box>
          </Paper>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: { xs: 0.5, sm: 1 } }}>
        <Box maxWidth="xl" mx="auto">
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: { xs: 0.5, sm: 1 } }}>
        <Box maxWidth="xl" mx="auto">
          <Paper
            elevation={3}
            sx={{
              borderRadius: 1,
              overflow: "hidden",
              p: { xs: 0.5, sm: 1 },
              boxShadow: 3,
              minHeight: 300,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
                mb: 1,
                px: 1,
                py: 0.5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  width: { xs: "100%", sm: "auto" },
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search payments..."
                  value={searchInput}
                  onChange={handleSearch}
                  sx={{
                    width: { xs: "100%", sm: 320 },
                    m: 0,
                    height: 40,
                    "& .MuiInputBase-root": {
                      height: 40,
                      minHeight: 40,
                      py: 0,
                    },
                    "& .MuiOutlinedInput-root": {
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: search && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={handleClearSearch}
                          sx={{ p: 0 }}
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: { py: 0 },
                  }}
                />

                <DatePicker
                  label="Filter by Date"
                  value={filterDate}
                  onChange={(newValue) => {
                    setFilterDate(newValue);
                    setFilterMonth("");
                    setFilterValues({
                      ...filterValues,
                      date: newValue,
                      month: "",
                    });
                  }}
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: {
                        width: { xs: "100%", sm: 200 },
                        height: 40,
                        "& .MuiInputBase-root": { height: 40 },
                      },
                    },
                  }}
                />

                <FormControl
                  size="small"
                  sx={{ width: { xs: "100%", sm: 200 } }}
                >
                  <InputLabel>Filter by Month</InputLabel>
                  <Select
                    value={filterMonth}
                    label="Filter by Month"
                    onChange={(e) => {
                      setFilterMonth(e.target.value);
                      setFilterDate(null);
                      setFilterValues({
                        ...filterValues,
                        month: e.target.value,
                        date: "",
                      });
                    }}
                    sx={{
                      height: 40,
                      "& .MuiSelect-select": {
                        py: 0,
                        display: "flex",
                        alignItems: "center",
                      },
                    }}
                  >
                    {months.map((month) => (
                      <MenuItem key={month.value} value={month.value}>
                        {month.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ ml: "auto" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setShowAddForm(true)}
                  sx={{ height: 40 }}
                >
                  Add Payment
                </Button>
              </Box>
            </Box>

            {/* Active filters summary */}
            {(search || filterDate || filterMonth) && (
              <Box sx={{ px: 1, py: 0.5, mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {search && `Search: "${search}"`}
                  {search && (filterDate || filterMonth) && " | "}
                  {filterDate && `Date: ${filterDate.toLocaleDateString()}`}
                  {filterMonth &&
                    `Month: ${
                      months.find((m) => m.value === filterMonth)?.label
                    }`}
                </Typography>
              </Box>
            )}

            <FloraTable
              columns={columns}
              rows={payments}
              actions={actions}
              page={current_page}
              rowsPerPage={per_page}
              maxHeight={tableMaxHeight}
              emptyMessage="No payments found."
              loading={loading}
              disableInternalPagination={true}
            />

            {/* Manual Pagination Controls */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", md: "center" },
                p: 1,
                gap: 1,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  whiteSpace: "nowrap",
                  display: "inline-flex",
                  alignItems: "center",
                  minHeight: 32,
                }}
              >
                {total === 0 ? "0 of 0" : `${from}–${to} of ${total}`}
              </Typography>
              <Box
                width="100%"
                display="flex"
                justifyContent={{ xs: "center", md: "flex-end" }}
              >
                <IconButton
                  onClick={() => handlePageChange(current_page - 1)}
                  disabled={current_page <= 1}
                  sx={{
                    border: "1.5px solid",
                    borderColor: current_page <= 1 ? "divider" : "primary.main",
                    borderRadius: 2,
                    mx: 0.5,
                    bgcolor: "background.paper",
                    color: current_page <= 1 ? "text.disabled" : "primary.main",
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor:
                        current_page <= 1 ? "background.paper" : "primary.main",
                      color: current_page <= 1 ? "text.disabled" : "#fff",
                      borderColor:
                        current_page <= 1 ? "divider" : "primary.main",
                      "& .MuiSvgIcon-root": {
                        color: current_page <= 1 ? "text.disabled" : "#fff",
                      },
                    },
                  }}
                  size="small"
                >
                  <ChevronLeftIcon
                    sx={{
                      color:
                        current_page <= 1 ? "text.disabled" : "primary.main",
                    }}
                  />
                </IconButton>
                <IconButton
                  onClick={() => handlePageChange(current_page + 1)}
                  disabled={current_page >= last_page}
                  sx={{
                    border: "1.5px solid",
                    borderColor:
                      current_page >= last_page ? "divider" : "primary.main",
                    borderRadius: 2,
                    mx: 0.5,
                    bgcolor: "background.paper",
                    color:
                      current_page >= last_page
                        ? "text.disabled"
                        : "primary.main",
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor:
                        current_page >= last_page
                          ? "background.paper"
                          : "primary.main",
                      color:
                        current_page >= last_page ? "text.disabled" : "#fff",
                      borderColor:
                        current_page >= last_page ? "divider" : "primary.main",
                      "& .MuiSvgIcon-root": {
                        color:
                          current_page >= last_page ? "text.disabled" : "#fff",
                      },
                    },
                  }}
                  size="small"
                >
                  <ChevronRightIcon
                    sx={{
                      color:
                        current_page >= last_page
                          ? "text.disabled"
                          : "primary.main",
                    }}
                  />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        </Box>

        <AddPaymentModal
          open={showAddForm}
          onClose={() => setShowAddForm(false)}
          onSave={handlePaymentAdded}
        />

        <Dialog
          open={showViewModal}
          onClose={handleCloseViewModal}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Payment Details</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <FloraTable
                columns={[
                  {
                    id: "field",
                    label: "Field",
                    render: (value) => <strong>{value}</strong>,
                  },
                  { id: "value", label: "Value" },
                ]}
                rows={getViewModalRows()}
                actions={[]}
                page={1}
                rowsPerPage={20}
                maxHeight="500px"
                emptyMessage="No data to display"
                disableInternalPagination={true}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseViewModal} variant="contained">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            severity={snackbar.severity}
            sx={{ width: "100%" }}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
}

export default OtherPayment;
