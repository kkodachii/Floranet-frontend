import * as React from "react";
import {
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Badge,
  Typography,
  Divider,
} from "@mui/material";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import MenuButton from "./MenuButton";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTheme } from "@mui/material/styles";
import { ThemeContext } from "../ThemeContext";
import Search from "./Search";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import axios from "axios";
import config from "../config/env";
import apiService from "../services/api";

export default function Header({ children }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notifAnchor, setNotifAnchor] = React.useState(null);
  const [notifications, setNotifications] = React.useState([]);
  const [unreadCount, setUnreadCount] = React.useState(0);

  const theme = useTheme();
  const colorMode = React.useContext(ThemeContext);
  const navigate = useNavigate();
  const { token, logout: authLogout, user } = useAuth();

  // Fetch notifications from Laravel API
  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const res = await apiService.getNotifications(user.id);

      const unread = res.filter((n) => !n.read_at);

      setNotifications(unread.slice(0, 5)); // only top 5 unread
      setUnreadCount(unread.length);
    } catch (err) {
      console.error("❌ Error fetching notifications:", err);
    }
  };

  const markNotification = async (id) => {
    if (!token) return;

    const notif = notifications.find((n) => n.id === id);

    try {
      if (!notif?.read_at) {
        await apiService.markAsRead(id);

        setNotifications((prev) =>
          prev.map((n) =>
            n.id === id ? { ...n, read_at: new Date().toISOString() } : n
          )
        );

        setUnreadCount((prev) => Math.max(prev - 1, 0));
      }
    } catch (err) {
      console.error("❌ Error reading notification:", err);
    }
  };

  React.useEffect(() => {
    fetchNotifications();
  }, [token]);

  // Profile menu handlers
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Notification dropdown handlers
  const handleNotifClick = (event) => {
    setNotifAnchor(event.currentTarget);
  };
  const handleNotifClose = () => {
    setNotifAnchor(null);
  };

  // Logout handler
  const handleLogout = async () => {
    handleClose();

    try {
      if (token) {
        console.log("📡 Making logout API call...");
        await axios.post(
          config.ENDPOINTS.LOGOUT,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("✅ Logout API call successful");
      } else {
        console.log("⚠️ No token found, skipping API call");
      }
    } catch (error) {
      console.error("❌ Logout API error:", error);
      console.log("📋 Error details:", {
        status: error.response?.status,
        message: error.response?.data?.message,
        data: error.response?.data,
      });
      // Continue with logout even if API call fails
    } finally {
      console.log("🧹 Logging out...");
      // Use AuthContext logout function
      authLogout();
      navigate("/login");
    }
  };

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: theme.palette.primary.main,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <Toolbar>
        {children}
        <Search />
        <Box sx={{ flexGrow: 1 }} />
        {/* Theme toggle */}
        <IconButton
          sx={{ ml: 1 }}
          onClick={colorMode.toggleColorMode}
          color="inherit"
        >
          {theme.palette.mode === "dark" ? (
            <Brightness7Icon />
          ) : (
            <Brightness4Icon />
          )}
        </IconButton>

        {/* Notifications button */}
        <IconButton color="inherit" onClick={handleNotifClick}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsRoundedIcon />
          </Badge>
        </IconButton>

        {/* Notifications dropdown */}
        <Menu
          anchorEl={notifAnchor}
          open={Boolean(notifAnchor)}
          onClose={handleNotifClose}
          PaperProps={{
            style: { maxHeight: 400, width: "300px" },
          }}
        >
          <Typography variant="h6" sx={{ px: 2, pt: 1 }}>
            Notifications
          </Typography>
          <Divider />
          {notifications.length === 0 ? (
            <MenuItem>
              <Typography variant="body2">No notifications</Typography>
            </MenuItem>
          ) : (
            notifications.map((notif, index) => (
              <MenuItem
                key={index}
                onClick={() => {
                  markNotification(notif.id);
                  handleNotifClose();
                }}
                sx={{
                  bgcolor: notif.read_at ? "background.paper" : "action.hover",
                  "&:hover": {
                    bgcolor: "action.selected",
                  },
                }}
              >
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: notif.read_at ? "normal" : "bold" }}
                  >
                    {notif.data?.title || "Notification"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontStyle: notif.read_at ? "italic" : "normal" }}
                  >
                    {notif.data?.message || notif.created_at}
                  </Typography>
                </Box>
              </MenuItem>
            ))
          )}
          <Divider />
          <MenuItem
            onClick={() => {
              handleNotifClose();
              navigate("/notifications");
            }}
          >
            <Typography variant="body2" color="primary">
              View More
            </Typography>
          </MenuItem>
        </Menu>

        {/* Profile avatar */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton color="inherit" onClick={handleMenu} sx={{ ml: 1 }}>
            <Avatar
              src={
                user?.profile_picture
                  ? `${config.API_BASE_URL}/storage/${user.profile_picture}`
                  : "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"
              }
            />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem
              onClick={() => {
                handleClose();
                navigate("/settings");
              }}
            >
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
