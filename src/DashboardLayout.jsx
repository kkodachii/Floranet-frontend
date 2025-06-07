import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
} from "@mui/icons-material";
import Header from "./components/Header";

const drawerWidth = 280;

function DashboardLayout({ children }) {
  const [openSection, setOpenSection] = React.useState(null);

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSectionClick = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const drawer = (
    <div>
      <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
        <img class="h-40  " src="/floranet_logo.png" alt="floranet logo" />
      </Box>
      <List>
        <ListItem button>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="User Management" />
        </ListItem>
        <ListItem button onClick={() => handleSectionClick("pages")}>
          <ListItemIcon>
            <SecurityIcon />
          </ListItemIcon>
          <ListItemText primary="Alerts and Security" />
          {openSection === "pages" ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openSection === "pages"} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button sx={{ pl: 4 }}>
              <ListItemText primary="Alerts" />
            </ListItem>
            <ListItem button sx={{ pl: 4 }}>
              <ListItemText primary="CCTV" />
            </ListItem>
            <ListItem button sx={{ pl: 4 }}>
              <ListItemText primary="Waste Collection" />
            </ListItem>
          </List>
        </Collapse>
        <ListItem button onClick={() => handleSectionClick("sales")}>
          <ListItemIcon>
            <PaymentIcon />
          </ListItemIcon>
          <ListItemText primary="Billing and Payment" />
          {openSection === "sales" ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openSection === "sales"} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button sx={{ pl: 4 }}>
              <ListItemText primary="Personal payment" />
            </ListItem>
            <ListItem button sx={{ pl: 4 }}>
              <ListItemText primary="Payment status" />
            </ListItem>
            <ListItem button sx={{ pl: 4 }}>
              <ListItemText primary="Collection report" />
            </ListItem>
          </List>
        </Collapse>
        <ListItem button>
          <ListItemIcon>
            <GroupsIcon />
          </ListItemIcon>
          <ListItemText primary="Community Hub" />
        </ListItem>
        <ListItem button onClick={() => handleSectionClick("auth")}>
          <ListItemIcon>
            <MessageIcon />
          </ListItemIcon>
          <ListItemText primary="Complaints" />
          {openSection === "auth" ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openSection === "auth"} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button sx={{ pl: 4 }}>
              <ListItemText primary="General Complaints" />
            </ListItem>
            <ListItem button sx={{ pl: 4 }}>
              <ListItemText primary="Service complaints" />
            </ListItem>
          </List>
        </Collapse>
      </List>
      <Divider />
      <List>
        <ListItem button>
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <HelpIcon />
          </ListItemIcon>
          <ListItemText primary="Help" />
        </ListItem>
      </List>
      <Box sx={{ position: "absolute", bottom: 0, width: "100%", p: 2 }}>
        {/* No settings or logout */}
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: "flex", bgcolor: "grey.50", minHeight: "100vh" }}>
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
          {drawer}
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
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Header></Header>
        {children}
      </Box>
    </Box>
  );
}

export default DashboardLayout;
