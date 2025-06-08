import * as React from "react";
import { Box, Typography, Avatar, ImageList, ImageListItem, IconButton, Button, Menu, MenuItem } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTheme, useMediaQuery } from "@mui/material";

function CommunityPost({
  avatarSrc,
  userName,
  timestamp,
  title,
  images,
  content,
  onBanUser, 
  onVisitUser, 
  onDeletePost,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [liked, setLiked] = React.useState(false);
  const [disliked, setDisliked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(0);
  const [dislikeCount, setDislikeCount] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleBan = () => {
    onBanUser();
    handleMenuClose();
  };

  const handleVisit = () => {
    onVisitUser();
    handleMenuClose();
  };

  const handleDelete = () => {
    onDeletePost();
    handleMenuClose();
  };

  const handleLike = () => {
    setLiked(!liked);
    setDisliked(false);
    setLikeCount(prevCount => liked ? prevCount - 1 : prevCount + 1);
    if (disliked) {
      setDislikeCount(prevCount => prevCount - 1);
    }
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    setLiked(false);
    setDislikeCount(prevCount => disliked ? prevCount - 1 : prevCount + 1);
    if (liked) {
      setLikeCount(prevCount => prevCount - 1);
    }
  };

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        p: 2,
        backgroundColor: theme.palette.background.paper,
        boxShadow: 1,
        position: 'relative', // For positioning the dropdown
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Avatar src={avatarSrc} sx={{ width: 40, height: 40, mr: 1.5 }} />
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            {userName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {timestamp}
          </Typography>
        </Box>
        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={openMenu ? 'long-menu' : undefined}
            aria-expanded={openMenu ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleMenuClick}
            size="small"
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="long-menu"
            MenuListProps={{
              'aria-labelledby': 'long-button',
            }}
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            PaperProps={{
              style: {
                maxHeight: 48 * 4.5,
                width: '20ch',
              },
            }}
          >
            {onBanUser && (
              <MenuItem 
                onClick={handleBan}
                sx={{
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                    color: theme.palette.primary.main,
                  },
                }}
              >
                Ban User
              </MenuItem>
            )}
            {onVisitUser && (
              <MenuItem 
                onClick={handleVisit}
                sx={{
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                    color: theme.palette.primary.main,
                  },
                }}
              >
                Visit User
              </MenuItem>
            )}
            {onDeletePost && (
              <MenuItem 
                onClick={handleDelete}
                sx={{
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                    color: theme.palette.primary.main,
                  },
                }}
              >
                Delete Post
              </MenuItem>
            )}
          </Menu>
        </Box>
      </Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        {title}
      </Typography>
      {content && (
        <Typography variant="body1" sx={{ mb: 2 }}>
          {content}
        </Typography>
      )}
      {images && images.length > 0 && (
        <ImageList 
          sx={{
            width: '100%', 
            height: 'auto', 
            // Adjust columns based on screen size
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr)) !important',
            [theme.breakpoints.up('sm')]: {
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr)) !important',
            },
            [theme.breakpoints.up('md')]: {
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr)) !important',
            },
          }}
          cols={isMobile ? 2 : 5} 
          rowHeight={isMobile ? 100 : 150} 
          gap={8}
        >
          {images.map((item, index) => (
            <ImageListItem key={index}>
              <img
                srcSet={`${item}?w=164&h=164&fit=crop&auto=format 1x, ${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                src={`${item}?w=164&h=164&fit=crop&auto=format`}
                alt={`Post image ${index + 1}`}
                loading="lazy"
                style={{ borderRadius: 8, objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <IconButton onClick={handleLike} color={liked ? 'primary' : 'default'}>
          {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
          {likeCount}
        </Typography>
        <IconButton onClick={handleDislike} color={disliked ? 'error' : 'default'}>
          <ThumbDownAltIcon />
        </IconButton>
        <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
          {dislikeCount}
        </Typography>
      </Box>
    </Box>
  );
}

export default CommunityPost;
