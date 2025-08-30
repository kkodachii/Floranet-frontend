import React, { useState } from "react";
import { Box, Paper, Typography, Button, Stack, TextField } from "@mui/material";
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { useTheme } from '@mui/material/styles';
import axios from "axios";
import config from "../../../config/env";
import apiService from "../../../services/api";

export default function WasteCollection() {
  const today = new Date().toISOString().split("T")[0];
  const [collectionTime, setCollectionTime] = useState("07:30"); // 24h format for input type="time"
  const [collectionDate, setCollectionDate] = useState(today); // yyyy-mm-dd for input type="date"
  const [isLoading, setIsLoading] = React.useState(false);
  const theme = useTheme();

  const handleSendAlert = async () => {
    let title = "Garbage Collection Alert";
    let content =
      "Garbage Truck is on its way! Prepare your trash bags or container outside your homes.";

    if (collectionDate && collectionTime) {
      const now = new Date();

      // ✅ Build local datetime from date (yyyy-mm-dd) + time (HH:mm)
      const [year, month, day] = collectionDate.split("-").map(Number);
      const [hours, minutes] = collectionTime.split(":").map(Number);
      const collectionDateTime = new Date(year, month - 1, day, hours, minutes, 0, 0);

      // ✅ Prevent sending if already passed
      if (collectionDateTime.getTime() <= now.getTime()) {
        alert("⚠️ Collection time has already passed. Please choose a future time.");
        return;
      }

      

      // ✅ Get difference in minutes
      const diffMinutes = Math.floor((collectionDateTime - now) / 60000);

      // ✅ Format into 12-hour time with AM/PM
      const formattedTime = collectionDateTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      // ✅ If at least 30 minutes ahead → change title/content
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

      if (response.success) {
        console.log("nasend na");
      }
    } catch (error) {
      console.error("Alert error:", error);
      if (error.response?.data?.message) {
        setErrorMsg({ general: error.response.data.message });
      }
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: theme.palette.background.default,
        p: { xs: 2, sm: 4 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          maxWidth: 800,
          width: '100%',
          mx: 'auto',
          p: { xs: 4, sm: 8 },
          boxShadow: theme.palette.mode === 'dark' ? '0 4px 32px rgba(0,0,0,0.40)' : '0 4px 32px rgba(0,0,0,0.10)',
          border: '1.5px solid',
          borderColor: theme.palette.divider,
          textAlign: 'center',
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Stack spacing={5} alignItems="center">
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.primary.light,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1,
            }}
          >
            <DeleteSweepIcon sx={{ fontSize: 70, color: theme.palette.primary.main }} />
          </Box>
          <Typography variant="h3" fontWeight={800} color="text.primary" gutterBottom>
            Waste Collection Alert
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            The garbage collector is on its way. Please prepare your waste for collection.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={6} justifyContent="center" alignItems="center">
            <Box>
              <Typography variant="subtitle1" color="text.secondary" mb={1}>
                Collection Time
              </Typography>
              <TextField
                type="time"
                value={collectionTime}
                onChange={e => setCollectionTime(e.target.value)}
                inputProps={{ step: 60 }}
                sx={{ minWidth: 120, bgcolor: theme.palette.background.paper }}
              />
            </Box>
          </Stack>
          <Button
            variant="contained"
            onClick={handleSendAlert}
            color="error"
            size="large"
            sx={{ mt: 2, px: 10, py: 2.5, fontWeight: 800, borderRadius: 2, textTransform: 'uppercase', letterSpacing: 2, fontSize: '1.5rem' }}
          >
            {isLoading ? "Sending Alert..." : "Send Alert"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
