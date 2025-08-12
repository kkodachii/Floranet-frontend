import * as React from "react";
import { Avatar, Menu, MenuItem, IconButton, Box } from "@mui/material";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import MenuButton from "./MenuButton";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTheme } from "@mui/material/styles";
import { ThemeContext } from "../ThemeContext";
import Search from "./Search";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../config/env";

export default function Header({ children }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const theme = useTheme();
  const colorMode = React.useContext(ThemeContext);
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    
    try {
      const token = localStorage.getItem("token");
      
      if (token) {
        console.log('📡 Making logout API call...');
        await axios.post(config.ENDPOINTS.LOGOUT, {}, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('✅ Logout API call successful:', response.data);
      } else {
        console.log('⚠️ No token found, skipping API call');
      }
    } catch (error) {
      console.error('❌ Logout API error:', error);
      console.log('📋 Error details:', {
        status: error.response?.status,
        message: error.response?.data?.message,
        data: error.response?.data
      });
      // Continue with logout even if API call fails
    } finally {
      console.log('🧹 Clearing local storage...');
      // Clear local storage and redirect regardless of API call success
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.replace("/login");
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
        <MenuButton showBadge aria-label="Open notifications" color="inherit">
          <NotificationsRoundedIcon />
        </MenuButton>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton color="inherit" onClick={handleMenu} sx={{ ml: 1 }}>
            <Avatar src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}