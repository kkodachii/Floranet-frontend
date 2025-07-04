import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  MenuItem,
  Menu,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  CssBaseline,
  Avatar,
  Collapse,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Message as MessageIcon,
  Payment as PaymentIcon,
  Description as DescriptionIcon,
  Help as HelpIcon,
  Groups as GroupsIcon,
  Report as ReportIcon,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import Header from "./components/Header";
import NavbarBreadcrumbs from "./components/NavbarBreadcrumbs";
import Sidebar from "./components/Sidebar";

const drawerWidth = 300;

function MainLayout({ children }) {
  const [openSection, setOpenSection] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSectionClick = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <Box sx={{ 
      display: "flex", 
      minHeight: "100vh",
      bgcolor: theme.palette.mode === 'light' ? 'grey.50' : 'background.default',
      transition: 'background-color 0.3s ease-in-out'
    }}>
      <CssBaseline />

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          <Sidebar openSection={openSection} handleSectionClick={handleSectionClick} />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          <Sidebar openSection={openSection} handleSectionClick={handleSectionClick} />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          bgcolor: theme.palette.mode === 'light' ? 'grey.50' : 'background.default',
          transition: 'background-color 0.3s ease-in-out'
        }}
      >
        <Header>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Header>

        <Box
          sx={{
            px: 3,
            py: 2,
            bgcolor: theme.palette.mode === 'light' ? 'grey.50' : 'background.default',
            transition: 'background-color 0.3s ease-in-out'
          }}
        >
          <NavbarBreadcrumbs />
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default MainLayout;
