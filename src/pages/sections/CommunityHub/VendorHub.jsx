import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import CommunityPost from "../../../../src/components/CommunityPost";

function VendorHub() {
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

  const sampleVendorPosts = [
    {
      avatarSrc: "https://via.placeholder.com/40", 
      userName: "Vendor A",
      timestamp: "07/06/2025 11:00 AM",
      title: "Special Offer: Landscaping Services",
      content: "Hello Floranet residents! We are offering a 15% discount on all landscaping services booked this month. Get your gardens ready for summer!",
      images: [
        "https://via.placeholder.com/164x100?text=Landscaping+Offer",
      ],
      onBanUser: () => handleBanUser("Vendor A"),
      onVisitUser: () => handleVisitUser("Vendor A"),
      onDeletePost: () => handleDeletePost("vendor_post_1"),
    },
    {
      avatarSrc: "https://via.placeholder.com/40", 
      userName: "User3",
      timestamp: "07/05/2025 04:00 PM",
      // title: "Review for Vendor B",
      content: "Vendor B did an excellent job fixing our plumbing issue. Highly recommend their services!",
      images: [],
      onBanUser: () => handleBanUser("User3"),
      onVisitUser: () => handleVisitUser("User3"),
      onDeletePost: () => handleDeletePost("vendor_post_2"),
    },
    {
      avatarSrc: "https://via.placeholder.com/40", 
      userName: "Vendor B",
      timestamp: "07/04/2025 09:30 AM",
      // title: "Emergency Plumbing Available 24/7",
      content: "Facing a plumbing emergency? Our team is available round the clock to assist you. Fast and reliable service guaranteed.",
      images: [],
      onBanUser: () => handleBanUser("Vendor B"),
      onVisitUser: () => handleVisitUser("Vendor B"),
      onDeletePost: () => handleDeletePost("vendor_post_3"),
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

      {sampleVendorPosts.map((post, index) => (
        <CommunityPost key={index} {...post} />
      ))}
    </Box>
  );
}

export default VendorHub; 