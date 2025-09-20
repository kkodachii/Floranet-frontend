import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Paper,
  TextField,
  Tooltip,
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
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import FloraTable from "../../../components/FloraTable";
import AddPaymentModal from "../../../components/AddPaymentModal";
import apiService from "../../../services/api";

function OtherPayment() {
  const [paymentData, setPaymentData] = useState([]);
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
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const [showAddForm, setShowAddForm] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [filterDate, setFilterDate] = useState(null);
  const [filterMonth, setFilterMonth] = useState("");

  // Months array for dropdown
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

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getOtherPayments();
      let data = [];
      if (Array.isArray(response.data)) data = response.data;
      else if (response.data?.data && Array.isArray(response.data.data))
        data = response.data.data;
      else if (response.data) data = [response.data];
      setPaymentData(data);
    } catch (err) {
      console.error("API Error:", err);
      setError(
        `Failed to load payments: ${err.response?.status || err.message}`
      );
      setSnackbar({
        open: true,
        message: err.response?.data?.message || err.message,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handlePaymentAdded = async () => {
    setSnackbar({
      open: true,
      message: "Payment added successfully!",
      severity: "success",
    });
    await fetchPayments();
  };

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
    setSearch(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearch("");
  };

  const filteredData = useMemo(() => {
    return paymentData.filter((payment) => {
      const residentName =
        payment.resident?.name || payment.resident_name || "";
      const residentId =
        payment.resident?.resident_id || payment.resident_id || "";
      const email = payment.resident?.email || payment.email || "";
      const phone = payment.resident?.contact_no || payment.phone_number || "";
      const method = payment.method_of_payment || "";
      const category = payment.payment_category || "";
      const date = payment.paid_at || payment.date || "";

      const searchTerm = search.toLowerCase();
      const matchesSearch =
        !search ||
        residentName.toLowerCase().includes(searchTerm) ||
        residentId.toLowerCase().includes(searchTerm) ||
        method.toLowerCase().includes(searchTerm) ||
        category.toLowerCase().includes(searchTerm) ||
        email.toLowerCase().includes(searchTerm) ||
        phone.toLowerCase().includes(searchTerm);

      const matchesType =
        filterValues.type === "all" || method === filterValues.type;
      const matchesDate = !filterValues.date || 
        (date && filterValues.date && new Date(date).toDateString() === filterValues.date.toDateString());
      const matchesMonth =
        !filterValues.month || 
        (date && new Date(date).getMonth() + 1 === parseInt(filterValues.month));
      const matchesCategory =
        filterValues.paymentCategory === "all" ||
        category === filterValues.paymentCategory;

      return (
        matchesSearch &&
        matchesType &&
        matchesDate &&
        matchesMonth &&
        matchesCategory
      );
    });
  }, [paymentData, search, filterValues]);

  const paginationInfo = useMemo(() => {
    const total = filteredData.length;
    const totalPages = Math.ceil(total / rowsPerPage);
    return {
      total,
      totalPages,
      from: (page - 1) * rowsPerPage + 1,
      to: Math.min(page * rowsPerPage, total),
    };
  }, [filteredData, page]);

  const paginatedData = useMemo(
    () => filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage),
    [filteredData, page]
  );

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

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: { xs: 0.5, sm: 1 } }}>
        <Box maxWidth="xl" mx="auto">
        <Paper elevation={3} sx={{ borderRadius: 1, p: 1, boxShadow: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1,
              mb: 1,
              alignItems: "center",
              my: 2, // Add top and bottom margins to the button container
            }}
          >
            {/* Left side: Search + filters */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, flex: 1 }}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search payments..."
                value={searchInput}
                onChange={handleSearch}
                disabled={loading}
                sx={{
                  width: { xs: "100%", sm: 250 },
                  height: 40,
                  "& .MuiInputBase-root": { height: 40 },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: searchInput && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={handleClearSearch}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
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
                    InputProps: {
                      endAdornment: filterDate && (
                        <InputAdornment position="end">
                          <IconButton 
                            size="small" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setFilterDate(null);
                              setFilterValues({
                                ...filterValues,
                                date: null,
                              });
                            }}
                          >
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                    sx: {
                      height: 40,
                      "& .MuiInputBase-root": { height: 40 },
                    }
                  }
                }}
              />

              <FormControl size="small" sx={{ minWidth: 150, height: 40 }}>
                <InputLabel id="month-filter-label">Filter by Month</InputLabel>
                <Select
                  labelId="month-filter-label"
                  value={filterMonth}
                  onChange={(e) => {
                    setFilterMonth(e.target.value);
                    setFilterDate("");
                    setFilterValues({
                      ...filterValues,
                      month: e.target.value,
                      date: "",
                    });
                  }}
                  label="Filter by Month"
                  endAdornment={
                    filterMonth && (
                      <InputAdornment position="end">
                        <IconButton 
                          size="small" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setFilterMonth("");
                            setFilterValues({
                              ...filterValues,
                              month: "",
                            });
                          }}
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                  sx={{
                    height: 40,
                    '& .MuiSelect-select': {
                      minHeight: '1.4375em',
                      padding: '16.5px 14px',
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

            {/* Right side: Add Payment button */}
            <Box sx={{ ml: "auto" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowAddForm(true)}
                sx={{
                  height: 40,
                  my: 1, // Add top and bottom margins to the Add Payment button
                }}
              >
                Add Payment
              </Button>
            </Box>
          </Box>

          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                height: 200,
                alignItems: "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <FloraTable
              columns={columns}
              rows={paginatedData}
              actions={[]}
              page={page}
              rowsPerPage={rowsPerPage}
              maxHeight={isMobile ? "40vh" : "60vh"}
              emptyMessage="No payments found."
              disableInternalPagination
              paginationInfo={paginationInfo}
              onPageChange={setPage}
              PrevIcon={<ChevronLeftIcon />}
              NextIcon={<ChevronRightIcon />}
            />
          )}
        </Paper>
      </Box>

      <AddPaymentModal
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSave={handlePaymentAdded}
      />

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
