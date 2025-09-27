import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Avatar,
  Badge,
  Paper,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AlertIcon from "@mui/icons-material/Warning";
import ComplaintIcon from "@mui/icons-material/ReportProblem";
import CctvIcon from "@mui/icons-material/Videocam";
import MessageIcon from "@mui/icons-material/Message";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import axios from "axios";
import { useAuth } from "../AuthContext";
import config from "../config/env";
import apiService from "../services/api";
import { useNavigate } from "react-router-dom";

export default function NotificationsPage() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper function to get notification icon and color
  const getNotificationIcon = (data) => {
    if (data?.type === "alert" || data?.type === "urgent" || data?.type === "incident" || data?.alertid || data?.alert_type) {
      return <AlertIcon />;
    } else if (data?.type === "complaint" || data?.complaintid || data?.category || data?.title?.toLowerCase().includes('complaint')) {
      return <ComplaintIcon />;
    } else if (data?.type === "cctv" || (data?.location && (data?.title?.toLowerCase().includes('cctv') || data?.title?.toLowerCase().includes('camera')))) {
      return <CctvIcon />;
    } else if (data?.type === "message" || data?.type === "chat") {
      return <MessageIcon />;
    }
    return <NotificationsIcon />;
  };

  const getNotificationColor = (data) => {
    if (data?.type === "alert" || data?.type === "urgent" || data?.type === "incident" || data?.alertid || data?.alert_type) {
      return "#f44336"; // Red for alerts
    } else if (data?.type === "complaint" || data?.complaintid || data?.category || data?.title?.toLowerCase().includes('complaint')) {
      return "#ff9800"; // Orange for complaints
    } else if (data?.type === "cctv" || (data?.location && (data?.title?.toLowerCase().includes('cctv') || data?.title?.toLowerCase().includes('camera')))) {
      return "#2196f3"; // Blue for CCTV
    } else if (data?.type === "message" || data?.type === "chat") {
      return "#4caf50"; // Green for messages
    }
    return "#9e9e9e"; // Gray for default
  };

  const getNotificationTypeLabel = (data) => {
    if (data?.type === "alert" || data?.type === "urgent" || data?.type === "incident" || data?.alertid || data?.alert_type) {
      return "Alert";
    } else if (data?.type === "complaint" || data?.complaintid || data?.category || data?.title?.toLowerCase().includes('complaint')) {
      return "Complaint";
    } else if (data?.type === "cctv" || (data?.location && (data?.title?.toLowerCase().includes('cctv') || data?.title?.toLowerCase().includes('camera')))) {
      return "CCTV";
    } else if (data?.type === "message" || data?.type === "chat") {
      return "Message";
    }
    return "Notification";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

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
      await apiService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read_at: new Date().toISOString() }))
      );
    } catch (err) {
      console.error("❌ Error marking all notifications as read:", err);
    }
  };

  // Handle notification click navigation
  const handleNotificationClick = (notification) => {
    const data = notification.data;
    
    // Mark as read first
    if (!notification.read_at) {
      markAsRead(notification.id);
    }

    // Navigate based on notification type
    if (data?.type === "alert" || data?.type === "urgent" || data?.type === "incident") {
      navigate("/alerts-security/alerts");
    } else if (data?.type === "complaint") {
      navigate("/complaints/general-complaints");
    } else if (data?.type === "cctv") {
      navigate("/alerts-security/cctv");
    } else if (data?.type === "message" || data?.type === "chat") {
      navigate("/community-hub");
    } else if (data?.alertid || data?.alert_type) {
      // Fallback: if it has alert-related data but no proper type, treat as alert
      navigate("/alerts-security/alerts");
    } else if (data?.complaintid || data?.category) {
      // Fallback: if it has complaint-related data but no type, treat as complaint
      navigate("/complaints/general-complaints");
    } else if (data?.location && (data?.title?.toLowerCase().includes('cctv') || data?.title?.toLowerCase().includes('camera'))) {
      // Fallback: if it looks like a CCTV notification based on title
      navigate("/alerts-security/cctv");
    } else if (data?.title?.toLowerCase().includes('complaint')) {
      // Additional fallback: if title contains "complaint"
      navigate("/complaints/general-complaints");
    }
    // If no conditions match, stay on notifications page
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
    <Box sx={{ p: { xs: 0.5, sm: 1 }, maxWidth: '100%' }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          overflow: 'visible',
          boxShadow: 'none',
          backgroundColor: 'transparent',
          maxWidth: '100%',
          mx: 'auto',
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            p: { xs: 0.75, sm: 1 },
            borderRadius: 1,
            borderColor: 'divider',
            backgroundColor: 'transparent',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' },
              justifyContent: 'space-between',
              gap: 1,
            }}
          >
            <Box>
              <Typography variant="h5" component="h1">
                Notifications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {notifications.filter(n => !n.read_at).length} unread notifications
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ overflow: 'auto', p: 0.75 }}>
          {notifications.length === 0 ? (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              py={4}
              textAlign="center"
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1.5,
                }}
              >
                <NotificationsIcon sx={{ fontSize: 24, color: theme.palette.mode === 'dark' ? theme.palette.grey[500] : '#999' }} />
              </Box>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No notifications found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You're all caught up! New notifications will appear here.
              </Typography>
            </Box>
          ) : (
            notifications.map((notif) => (
              <Card
                key={notif.id}
                elevation={notif.read_at ? 1 : 2}
                sx={{
                  mb: 2,
                  cursor: "pointer",
                  transition: "all 0.2s ease-in-out",
                  borderLeft: `4px solid ${getNotificationColor(notif.data)}`,
                  "&:hover": {
                    elevation: 3,
                    transform: "translateY(-2px)",
                  },
                  opacity: notif.read_at ? 0.7 : 1,
                }}
                onClick={() => handleNotificationClick(notif)}
              >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Box display="flex" alignItems="flex-start" gap={2}>
                    {/* Notification Icon */}
                    <Avatar
                      sx={{
                        bgcolor: getNotificationColor(notif.data),
                        width: 40,
                        height: 40,
                      }}
                    >
                      {getNotificationIcon(notif.data)}
                    </Avatar>

                    {/* Notification Content */}
                    <Box flex={1} minWidth={0}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                        <Box flex={1}>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: notif.read_at ? 400 : 600,
                              mb: 0.5,
                              lineHeight: 1.3,
                            }}
                          >
                            {notif.data?.title || "Notification"}
                          </Typography>
                          {notif.data?.message && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                mb: 1,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {notif.data.message}
                            </Typography>
                          )}
                        </Box>
                        
                        {/* Action Buttons */}
                        <Box display="flex" alignItems="center" gap={1}>
                          {!notif.read_at && (
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notif.id);
                              }}
                              sx={{ color: "primary.main" }}
                            >
                              <CheckCircleIcon fontSize="small" />
                            </IconButton>
                          )}
                          <ArrowForwardIosIcon 
                            sx={{ 
                              fontSize: 16, 
                              color: "text.secondary",
                              opacity: 0.6
                            }} 
                          />
                        </Box>
                      </Box>

                      {/* Footer with type and time */}
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" gap={1} alignItems="center">
                          <Chip
                            label={getNotificationTypeLabel(notif.data)}
                            size="small"
                            sx={{
                              bgcolor: getNotificationColor(notif.data),
                              color: "white",
                              fontSize: "0.75rem",
                              height: 20,
                            }}
                          />
                          {!notif.read_at && (
                            <Badge
                              color="error"
                              variant="dot"
                              sx={{
                                "& .MuiBadge-badge": {
                                  right: -2,
                                  top: -2,
                                },
                              }}
                            />
                          )}
                        </Box>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <AccessTimeIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(notif.created_at)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      </Paper>
    </Box>
  );
}
