import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { useTheme } from "@mui/material/styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiService from "../../../services/api";

export default function WasteCollection() {
  const theme = useTheme();

  const today = new Date().toISOString().split("T")[0];
  const [collectionTime, setCollectionTime] = useState("07:30");
  const [collectionDate, setCollectionDate] = useState(today);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedDay, setSelectedDay] = useState("");
  const [selectedHour, setSelectedHour] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("AM");

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await apiService.getGarbageSchedule();
        console.log("sched", response);
        if (response.success && response.data?.schedule) {
          const schedule = new Date(response.data.schedule);

          // Update manual alert inputs
          setCollectionDate(schedule.toISOString().split("T")[0]);
          setCollectionTime(schedule.toTimeString().slice(0, 5));

          // Update dropdowns
          const daysOfWeek = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];
          const dayName = daysOfWeek[schedule.getDay()];

          let hour = schedule.getHours();
          let period = "AM";
          if (hour === 0) hour = 12;
          else if (hour === 12) period = "PM";
          else if (hour > 12) {
            hour -= 12;
            period = "PM";
          }

          setSelectedDay(dayName);
          setSelectedHour(hour);
          setSelectedPeriod(period);

          console.log("Fetched schedule:", schedule);
          console.log("Dropdowns:", dayName, hour, period);
        }
      } catch (error) {
        console.error("Error fetching schedule:", error);
        toast.error("❌ Failed to fetch schedule");
      }
    };

    fetchSchedule();
  }, []);

  // Send garbage collection alert
  const handleSendAlert = async () => {
    let title = "Garbage Collection Alert";
    let content =
      "Garbage Truck is on its way! Prepare your trash bags or container outside your homes.";

    if (collectionDate && collectionTime) {
      const now = new Date();
      const [year, month, day] = collectionDate.split("-").map(Number);
      const [hours, minutes] = collectionTime.split(":").map(Number);
      const collectionDateTime = new Date(year, month - 1, day, hours, minutes);

      if (collectionDateTime.getTime() <= now.getTime()) {
        toast.warning(
          "⚠️ Collection time has already passed. Please choose a future time."
        );
        return;
      }

      const diffMinutes = Math.floor((collectionDateTime - now) / 60000);
      const formattedTime = collectionDateTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      if (diffMinutes >= 30) {
        title = "Garbage Collection on " + formattedTime;
        content =
          "Garbage Truck will arrive at " +
          formattedTime +
          " today. Prepare your trash bags or container outside your homes.";
      }
    }

    setIsLoading(true);
    try {
      const response = await apiService.sendGarbageAlert(title, content);
      if (response.success) toast.success("✅ Alert sent successfully!");
      else toast.error("❌ Failed to send alert");
    } catch (error) {
      console.error("Alert error:", error);
      toast.error("❌ Failed to send alert");
    } finally {
      setIsLoading(false);
    }
  };

  // Save weekly schedule
  const handleSaveSchedule = async () => {
    if (!selectedDay || !selectedHour || !selectedPeriod) {
      toast.warning("⚠️ Please select day, hour, and AM/PM.");
      return;
    }

    const today = new Date();
    const dayIndex = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ].indexOf(selectedDay);

    const daysToAdd = (dayIndex + 7 - today.getDay()) % 7 || 7;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysToAdd);

    let hour = parseInt(selectedHour, 10);
    if (selectedPeriod === "PM" && hour < 12) hour += 12;
    if (selectedPeriod === "AM" && hour === 12) hour = 0;

    targetDate.setHours(hour, 0, 0, 0);
    const combinedDateTime = targetDate.toISOString();

    setIsLoading(true);
    try {
      console.log("sched", combinedDateTime);
      const response = await apiService.saveGarbageSchedule(combinedDateTime);
      if (response.success) toast.success("✅ Schedule saved successfully!");
      else toast.error("❌ Failed to save schedule");
    } catch (error) {
      console.error("Save schedule error:", error);
      toast.error("❌ Failed to save schedule");
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel collection
  const handleSendCancellation = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.cancelGarbageCollection(
        "Garbage collection has been cancelled."
      );
      if (response.success)
        toast.success("✅ Garbage collection cancelled successfully!");
      else toast.error("❌ Failed to cancel garbage collection");
    } catch (error) {
      console.error("Cancel error:", error);
      toast.error("❌ Failed to cancel garbage collection");
    } finally {
      setIsLoading(false);
    }
  };

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: theme.palette.background.default,
        p: { xs: 2, sm: 4 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          maxWidth: 800,
          width: "100%",
          mx: "auto",
          p: { xs: 4, sm: 8 },
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 4px 32px rgba(0,0,0,0.40)"
              : "0 4px 32px rgba(0,0,0,0.10)",
          border: "1.5px solid",
          borderColor: theme.palette.divider,
          textAlign: "center",
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Stack spacing={5} alignItems="center">
          <Box
            sx={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.primary.dark
                  : theme.palette.primary.light,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1,
            }}
          >
            <DeleteSweepIcon
              sx={{ fontSize: 70, color: theme.palette.primary.main }}
            />
          </Box>

          <Typography
            variant="h4"
            fontWeight={800}
            color="text.primary"
            gutterBottom
          >
            Waste Collection Management
          </Typography>

          {/* Weekly Schedule */}
          <Box sx={{ width: "100%" }}>
            <Typography variant="h5" gutterBottom>
              Set Weekly Schedule
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Day</InputLabel>
                <Select
                  value={selectedDay}
                  label="Day"
                  onChange={(e) => setSelectedDay(e.target.value)}
                >
                  {daysOfWeek.map((day) => (
                    <MenuItem key={day} value={day}>
                      {day}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 100 }}>
                <InputLabel>Hour</InputLabel>
                <Select
                  value={selectedHour}
                  label="Hour"
                  onChange={(e) => setSelectedHour(e.target.value)}
                >
                  {hours.map((h) => (
                    <MenuItem key={h} value={h}>
                      {h}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 100 }}>
                <InputLabel>AM/PM</InputLabel>
                <Select
                  value={selectedPeriod}
                  label="AM/PM"
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                >
                  <MenuItem value="AM">AM</MenuItem>
                  <MenuItem value="PM">PM</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveSchedule}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Schedule"}
              </Button>
            </Stack>
          </Box>

          {/* Send Alert */}
          <Box>
            <Typography variant="h5" gutterBottom>
              Send Garbage Alert
            </Typography>
            <TextField
              type="time"
              value={collectionTime}
              onChange={(e) => setCollectionTime(e.target.value)}
              inputProps={{ step: 60 }}
              sx={{ minWidth: 150, mr: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleSendAlert}
              color="success"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Alert"}
            </Button>
          </Box>

          {/* Cancel Collection */}
          <Box>
            <Typography variant="h5" gutterBottom>
              Cancel Collection
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={handleSendCancellation}
              sx={{ mt: 2 }}
            >
              Send cancellation alert
            </Button>
          </Box>
        </Stack>
      </Paper>

      {/* Toast container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Box>
  );
}
