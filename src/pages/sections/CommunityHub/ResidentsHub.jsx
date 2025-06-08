import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import CommunityPost from "../../../../src/components/CommunityPost";

function ResidentsHub() {
  const theme = useTheme();

  const handleBanUser = (userName) => {
    console.log(`Ban user: ${userName}`);
  };

  const handleVisitUser = (userName) => {
    console.log(`Visit user profile: ${userName}`);
  };

  const handleDeletePost = (postId) => {
    console.log(`Delete post: ${postId}`);
  };

  const sampleResidentPosts = [
    {
      avatarSrc: "https://via.placeholder.com/40", 
      userName: "User1",
      timestamp: "07/05/2025 03:00 PM",
      title: "Neighborhood Potluck",
      content: "Excited for the annual neighborhood potluck this Saturday! Please bring your favorite dish to share. Looking forward to seeing everyone there!",
      images: [
        "https://via.placeholder.com/164x100?text=Potluck+Image+1",
        "https://via.placeholder.com/164x100?text=Potluck+Image+2",
      ],
      onBanUser: () => handleBanUser("User1"),
      onVisitUser: () => handleVisitUser("User1"),
      onDeletePost: () => handleDeletePost("resident_post_1"),
    },
    {
      avatarSrc: "https://via.placeholder.com/40", 
      userName: "VendorX",
      timestamp: "07/04/2025 01:00 PM",
      // title: "New Laundry Services",
      content: "VendorX is now offering convenient laundry pickup and delivery services for residents. Check out our competitive rates and flexible scheduling!",
      images: [],
      onBanUser: () => handleBanUser("VendorX"),
      onVisitUser: () => handleVisitUser("VendorX"),
      onDeletePost: () => handleDeletePost("resident_post_2"),
    },
    {
      avatarSrc: "https://via.placeholder.com/40", 
      userName: "User2",
      timestamp: "07/03/2025 11:00 AM",
      // title: "Lost Cat",
      content: "Our cat, Whiskers, went missing yesterday near the park. She's a small tabby with a white patch on her chest. Please call if you see her!",
      images: [
        "https://via.placeholder.com/164x100?text=Lost+Cat",
      ],
      onBanUser: () => handleBanUser("User2"),
      onVisitUser: () => handleVisitUser("User2"),
      onDeletePost: () => handleDeletePost("resident_post_3"),
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {sampleResidentPosts.map((post, index) => (
        <CommunityPost key={index} {...post} />
      ))}
    </Box>
  );
}

export default ResidentsHub; 