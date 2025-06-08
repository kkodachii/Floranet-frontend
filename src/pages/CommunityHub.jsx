import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Fab from "@mui/material/Fab";
import Avatar from "@mui/material/Avatar";

import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PollIcon from "@mui/icons-material/Poll";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";

function CreatePostModal({ isOpen, onClose }) {
  const [postText, setPostText] = React.useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-lg shadow-xl mx-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <h2>Create post</h2>
          <Fab
            size="small"
            aria-label="close"
            onClick={onClose}
            sx={{
              backgroundColor: "gray",
              color: "white",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#666",
                boxShadow: "none",
              },
            }}
          >
            <CloseIcon />
          </Fab>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <Avatar src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg" />
            <div>
              <div>Admin</div>
            </div>
          </div>

          <div className="mb-4">
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="What's happening in the community?"
              className="w-full bg-transparent resize-none border-none outline-none text-base"
              style={{
                fontFamily: "inherit",
                fontSize: "inherit",
                fontWeight: "inherit",
              }}
              rows="4"
            />
          </div>

          <div className="border border-gray-300 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Add to your post</span>
              <div className="flex items-center gap-3">
                <PollIcon className="text-green-600 cursor-pointer hover:text-green-800" />
                <ContentCopyIcon className="text-green-600 cursor-pointer hover:text-green-800" />
                <PhotoCameraIcon className="text-green-600 cursor-pointer hover:text-green-800" />
              </div>
            </div>
          </div>

          <button
            disabled={!postText.trim()}
            onClick={() => {
              if (postText.trim()) {
                console.log("Post:", postText);
                setPostText("");
                onClose();
              }
            }}
            className={`w-full py-2 rounded-lg transition-colors ${
              postText.trim()
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

function CommunityHub() {
  const [activeTab, setActiveTab] = React.useState("admin");
  const [isCreatePostOpen, setIsCreatePostOpen] = React.useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <Box sx={{ width: "100%", typography: "body1", mb: 4 }}>
          <TabContext value={activeTab}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={(e, newValue) => setActiveTab(newValue)}
                aria-label="community tabs"
              >
                <Tab label="Admin" value="admin" />
                <Tab label="Residents" value="residents" />
                <Tab label="Vendor" value="vendor" />
                <Tab label="Project" value="project" />
              </TabList>
            </Box>

            <TabPanel value="admin">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Admin Section
                  </h2>
                  <button
                    onClick={() => setIsCreatePostOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Community Post
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-2">
                    Recent Community Posts
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Community announcements and admin posts will appear here...
                  </p>
                </div>
              </div>
            </TabPanel>

            <TabPanel value="residents">
              <h2 className="text-xl font-semibold text-gray-800">
                Residents Section
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600">
                  Community discussions and resident updates will be displayed
                  here.
                </p>
              </div>
            </TabPanel>

            <TabPanel value="vendor">
              <h2 className="text-xl font-semibold text-gray-800">
                Vendor Section
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600">
                  Vendor announcements and services will be shown here.
                </p>
              </div>
            </TabPanel>

            <TabPanel value="project">
              <h2 className="text-xl font-semibold text-gray-800">
                Project Section
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600">
                  Community projects and updates will be displayed here.
                </p>
              </div>
            </TabPanel>
          </TabContext>
        </Box>
      </div>

      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
      />
    </div>
  );
}

export default CommunityHub;
