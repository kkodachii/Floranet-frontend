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
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Header({ children }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const theme = useTheme();
  const colorMode = React.useContext(ThemeContext);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

   const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
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
