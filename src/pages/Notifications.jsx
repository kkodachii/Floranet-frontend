import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import axios from "axios";
import { useAuth } from "../AuthContext";
import config from "../config/env";
import apiService from "../services/api";

export default function NotificationsPage() {
  const { token, user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await apiService.getNotifications(user.id);

      setNotifications(res);
    } catch (err) {
      console.error("❌ Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await apiService.markAsRead(id);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read_at: new Date().toISOString() } : n
        )
      );
    } catch (err) {
      console.error("❌ Error marking notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiService.markAllAsRead(user.id);
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read_at: new Date().toISOString() }))
      );
    } catch (err) {
      console.error("❌ Error marking all notifications as read:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", p: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Notifications</Typography>
        {notifications.some((n) => !n.read_at) && (
          <Button
            startIcon={<MarkEmailReadIcon />}
            onClick={markAllAsRead}
            size="small"
            variant="outlined"
          >
            Mark all as read
          </Button>
        )}
      </Box>
      <Divider />

      <List>
        {notifications.length === 0 ? (
          <Typography variant="body2" sx={{ mt: 2 }}>
            No notifications found.
          </Typography>
        ) : (
          notifications.map((notif) => (
            <React.Fragment key={notif.id}>
              <ListItem
                secondaryAction={
                  !notif.read_at && (
                    <IconButton
                      edge="end"
                      aria-label="mark as read"
                      onClick={() => markAsRead(notif.id)}
                    >
                      <CheckCircleIcon color="primary" />
                    </IconButton>
                  )
                }
                sx={{
                  bgcolor: notif.read_at ? "background.paper" : "action.hover",
                  borderRadius: 2,
                  mb: 1,
                }}
              >
                <ListItemText
                  primary={
                    <Typography
                      sx={{ fontWeight: notif.read_at ? "normal" : "bold" }}
                    >
                      {notif.data?.title || "Notification"}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontStyle: notif.read_at ? "italic" : "normal" }}
                    >
                      {notif.data?.message || notif.created_at}
                    </Typography>
                  }
                />
              </ListItem>
            </React.Fragment>
          ))
        )}
      </List>
    </Box>
  );
}
