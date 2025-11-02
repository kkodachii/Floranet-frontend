import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import AdminHub from "./sections/CommunityHub/AdminHub";
import ResidentsHub from "./sections/CommunityHub/ResidentsHub";
import VendorHub from "./sections/CommunityHub/VendorHub";
import ProjectHub from "./sections/CommunityHub/ProjectHub";
import ArchivedPosts from "./sections/CommunityHub/ArchivedPosts";

function CommunityHub() {
  const [activeTab, setActiveTab] = React.useState("admin");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ p: { xs: 0.5, sm: 1 } }}>
      <Box maxWidth="xl" mx="auto">
        <Paper 
          elevation={3} 
          sx={{ 
            borderRadius: 1, 
            overflow: 'hidden', 
            p: { xs: 0.5, sm: 1 }, 
            boxShadow: 3, 
            minHeight: 300,
            backgroundColor: theme.palette.background.paper
          }}
        >
          <Box sx={{ width: "100%", typography: "body1", mb: 4 }}>
            <TabContext value={activeTab}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={(e, newValue) => setActiveTab(newValue)}
                  aria-label="community tabs"
                  sx={{
                    '& .MuiTab-root': {
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      fontSize: '1rem',
                      minWidth: 0,
                      px: { xs: 2, sm: 3 },
                      py: 1.5,
                      '&.Mui-selected': {
                        color: 'primary.main',
                      },
                    },
                  }}
                >
                  <Tab label="Admin" value="admin" />
                  <Tab label="Residents" value="residents" />
                  <Tab label="Vendor" value="vendor" />
                  <Tab label="Project" value="project" />
                  <Tab label="Archived" value="archived" />
                </TabList>
              </Box>

              <TabPanel value="admin" sx={{ p: { xs: 1, sm: 2 } }}>
                <AdminHub />
              </TabPanel>

              <TabPanel value="residents" sx={{ p: { xs: 1, sm: 2 } }}>
                <ResidentsHub />
              </TabPanel>

              <TabPanel value="vendor" sx={{ p: { xs: 1, sm: 2 } }}>
                <VendorHub />
              </TabPanel>

              <TabPanel value="project" sx={{ p: { xs: 1, sm: 2 } }}>
                <ProjectHub />
              </TabPanel>

              <TabPanel value="archived" sx={{ p: { xs: 1, sm: 2 } }}>
                <ArchivedPosts />
              </TabPanel>
            </TabContext>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default CommunityHub;
