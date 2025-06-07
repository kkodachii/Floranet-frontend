import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
} from "@mui/material";
import {
  Security as SecurityIcon,
  Person as PersonIcon,
  Message as MessageIcon,
  Payment as PaymentIcon,
  Description as DescriptionIcon,
  Help as HelpIcon,
  Groups as GroupsIcon,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import { lighten, darken } from '@mui/system';

const sidebarItems = [
  {
    label: "User Management",
    icon: <PersonIcon />,
    section: "user-management",
    children: [
      { label: "Residents", to: "/user-management/residents" },
      { label: "Vendors", to: "/user-management/vendors" },
    ],
  },
  {
    label: "Alerts and Security",
    icon: <SecurityIcon />,
    section: "pages",
    children: [
      { label: "Alerts", to: "/alerts-security/alerts" },
      { label: "CCTV", to: "/alerts-security/cctv" },
      { label: "Waste Collection", to: "/alerts-security/waste-collection" },
    ],
  },
  {
    label: "Billing and Payment",
    icon: <PaymentIcon />,
    section: "sales",
    children: [
      { label: "Personal payment", to: "/billing-payment/personal-payment" },
      { label: "Payment status", to: "/billing-payment/payment-status" },
      { label: "Collection report", to: "/billing-payment/collection-report" },
    ],
  },
  {
    label: "Community Hub",
    icon: <GroupsIcon />,
    to: "/community-hub",
  },
  {
    label: "Complaints",
    icon: <MessageIcon />,
    section: "auth",
    children: [
      { label: "General Complaints", to: "/complaints/general-complaints" },
      { label: "Service complaints", to: "/complaints/service-complaints" },
    ],
  },
];

const bottomItems = [
  {
    label: "Settings",
    icon: <DescriptionIcon />,
    to: "/settings",
  },
];

const Sidebar = ({ openSection, handleSectionClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const getHoverColor = () => theme.palette.mode === 'dark'
    ? darken(theme.palette.primary.main, 0.4)
    : lighten(theme.palette.primary.main, 0.85);

  // Returns true if the current path matches the given path
  const isActive = (to) => location.pathname === to;
  // Returns true if any child matches the current path
  const isAnyChildActive = (children) => children.some(child => isActive(child.to));

  return (
    <div>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexGrow: 1 }}>
        <img className="h-24" src="/floranet_logo.png" alt="floranet logo" />
      </Box>
      <List>
        {sidebarItems.map((item) => {
          if (item.children) {
            return (
              <React.Fragment key={item.label}>
                <ListItem
                  sx={{
                    width: 'calc(100% - 16px)',
                    mx: 'auto',
                    my: 0.5,
                    cursor: 'pointer',
                    borderRadius: theme.shape.borderRadius,
                    '&:hover': !isActive(item.to) ? { bgcolor: getHoverColor(), borderRadius: theme.shape.borderRadius } : {},
                  }}
                  onClick={() => handleSectionClick(item.section)}
                >
                  <ListItemIcon sx={{ color: theme.palette.secondary.main }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                  {openSection === item.section ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={openSection === item.section} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child) => (
                      <ListItem
                        key={child.label}
                        sx={{
                          width: 'calc(100% - 16px)',
                          mx: 'auto',
                          my: 0.5,
                          pl: 4,
                          cursor: 'pointer',
                          bgcolor: isActive(child.to) ? theme.palette.primary.main : undefined,
                          color: isActive(child.to) ? theme.palette.primary.contrastText : undefined,
                          borderRadius: theme.shape.borderRadius,
                          '&:hover': !isActive(child.to) ? { bgcolor: getHoverColor(), borderRadius: theme.shape.borderRadius } : {},
                        }}
                        onClick={() => navigate(child.to)}
                      >
                        <ListItemText primary={child.label} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            );
          } else {
            return (
              <ListItem
                key={item.label}
                sx={{
                  width: 'calc(100% - 16px)',
                  mx: 'auto',
                  my: 0.5,
                  cursor: 'pointer',
                  bgcolor: isActive(item.to) ? theme.palette.primary.main : undefined,
                  color: isActive(item.to) ? theme.palette.primary.contrastText : undefined,
                  borderRadius: theme.shape.borderRadius,
                  '&:hover': !isActive(item.to) ? { bgcolor: getHoverColor(), borderRadius: theme.shape.borderRadius } : {},
                }}
                onClick={() => navigate(item.to)}
              >
                <ListItemIcon
                  sx={{ color: isActive(item.to) ? theme.palette.primary.contrastText : theme.palette.secondary.main }}
                >{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            );
          }
        })}
      </List>
      <Divider />
      <List>
        {bottomItems.map((item) => (
          <ListItem
            key={item.label}
            sx={{
              width: 'calc(100% - 16px)',
              mx: 'auto',
              my: 0.5,
              cursor: 'pointer',
              bgcolor: isActive(item.to) ? theme.palette.primary.main : undefined,
              color: isActive(item.to) ? theme.palette.primary.contrastText : undefined,
              borderRadius: theme.shape.borderRadius,
              '&:hover': !isActive(item.to) ? { bgcolor: getHoverColor(), borderRadius: theme.shape.borderRadius } : {},
            }}
            onClick={() => navigate(item.to)}
          >
            <ListItemIcon
              sx={{ color: isActive(item.to) ? theme.palette.primary.contrastText : theme.palette.secondary.main }}
            >{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ position: "absolute", bottom: 0, width: "100%", p: 2 }}>
        {/* No settings or logout */}
      </Box>
    </div>
  );
};

export default Sidebar; 