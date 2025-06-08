import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import CreatePostModal from "../../../../src/components/CreatePostModal";
import CommunityPost from "../../../../src/components/CommunityPost";

function AdminHub() {
  const theme = useTheme();
  const [openModal, setOpenModal] = React.useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const samplePosts = [
    {
      avatarSrc: "https://via.placeholder.com/40", 
      userName: "ADMIN",
      timestamp: "07/04/2025 2:00 PM",
      title: "BASKETBALL TOURNAMENT",
      content: "Join us for our annual basketball tournament! Sign up now and show off your skills on the court. All community members are welcome to participate or cheer on their favorite teams.",
      images: [
        "https://via.placeholder.com/164x100?text=Image+1",
        "https://via.placeholder.com/164x100?text=Image+2",
        "https://via.placeholder.com/164x100?text=Image+3",
        "https://via.placeholder.com/164x100?text=Image+4",
        "https://via.placeholder.com/164x100?text=Image+5",
      ],
    },
    {
      avatarSrc: "https://via.placeholder.com/40", 
      userName: "Announcement",
      timestamp: "07/03/2025 10:30 AM",
      // title: "Community Meeting Reminder",
      content: "A friendly reminder that our monthly community meeting will be held tomorrow at 7 PM in the main hall. We will be discussing upcoming events and community improvements. Your input is valuable!",
      images: [], 
    },
    {
      avatarSrc: "https://via.placeholder.com/40", 
      userName: "ADMIN",
      timestamp: "07/02/2025 04:45 PM",
      // title: "New Park Hours",
      content: "Please note that the park hours have been updated. The park will now be open from 6 AM to 9 PM daily. We appreciate your cooperation in keeping our park clean and safe for everyone.",
      images: [
        "https://via.placeholder.com/164x100?text=Park+Image",
      ],
    },
    {
      avatarSrc: "https://via.placeholder.com/40", 
      userName: "Announcement",
      timestamp: "07/01/2025 09:00 AM",
      // title: "Trash Collection Schedule Change",
      content: "Due to the upcoming holiday, trash collection for this week will be shifted by one day. Please refer to the updated schedule on the community board for specific details. Thank you for your understanding.",
      images: [], 
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenModal}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            px: 2,
            py: 1,
            borderRadius: 1,
            boxShadow: 2,
            '&:hover': {
              boxShadow: 3,
            },
            '&:focus': {
              outline: 'none',
              boxShadow: 2,
            },
            '&:focus-visible': {
              outline: 'none',
              boxShadow: 2,
            }
          }}
        >
          Create Community Post
        </Button>
      </Box>
      {samplePosts.map((post, index) => (
        <CommunityPost key={index} {...post} />
      ))}
      <CreatePostModal open={openModal} handleClose={handleCloseModal} />
    </Box>
  );
}

export default AdminHub; 