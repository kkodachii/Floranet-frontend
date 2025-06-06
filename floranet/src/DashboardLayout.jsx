import React from 'react';
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
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  ExpandLess,
  ExpandMore,
  Inbox as InboxIcon,
  People as PeopleIcon,
  Dashboard as DashboardIcon,
  Message as MessageIcon,
  ShoppingCart as ShoppingCartIcon,
  Description as DescriptionIcon,
  Help as HelpIcon,
} from '@mui/icons-material';

const drawerWidth = 280;

function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openSection, setOpenSection] = React.useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSectionClick = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem button>
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="User Management" />
        </ListItem>
        <ListItem button onClick={() => handleSectionClick('pages')}>
          <ListItemIcon><InboxIcon /></ListItemIcon>
          <ListItemText primary="Alerts and Security" />
          {openSection === 'pages' ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openSection === 'pages'} timeout="auto" unmountOnExit>
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
        <ListItem button onClick={() => handleSectionClick('sales')}>
          <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
          <ListItemText primary="Billing and Payment" />
          {openSection === 'sales' ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openSection === 'sales'} timeout="auto" unmountOnExit>
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
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Community Hub" />
        </ListItem>
        <ListItem button onClick={() => handleSectionClick('auth')}>
          <ListItemIcon><PeopleIcon /></ListItemIcon>
          <ListItemText primary="Complaints" />
          {openSection === 'auth' ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openSection === 'auth'} timeout="auto" unmountOnExit>
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
          <ListItemIcon><DescriptionIcon /></ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem button>
          <ListItemIcon><HelpIcon /></ListItemIcon>
          <ListItemText primary="Help" />
        </ListItem>
      </List>
      <Box sx={{ position: 'absolute', bottom: 0, width: '100%', p: 2 }}>
        {/* No settings or logout */}
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: 'background.paper', color: 'text.primary', borderBottom: 1, borderColor: 'divider' }} elevation={1}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#2767B7', mr: 1.5 }} />
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
              Floranet
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" onClick={handleMenu} sx={{ ml: 1 }}>
              <Avatar src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
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
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` }, mt: 8 }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default DashboardLayout; 