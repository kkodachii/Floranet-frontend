import * as React from "react";
import {
  Box,
  Typography,
  Avatar,
  ImageList,
  ImageListItem,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Chip,
  TextField,
  Divider,
  Tooltip,
  Modal,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import PublicIcon from "@mui/icons-material/Public";
import GroupIcon from "@mui/icons-material/Group";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useTheme, useMediaQuery } from "@mui/material";
import config from "../config/env";
import apiService from "../services/api";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

function CommunityPost({
  id,
  avatarSrc,
  userName,
  timestamp,
  title,
  images,
  content,
  category,
  visibility,
  likes_count = 0,
  comments_count = 0,
  is_liked = false,
  user_reaction = null,
  onBanUser,
  onVisitUser,
  onDeletePost,
  onEditPost,
  onLikePost,
  onAddComment,
  onCommentToggle,
  isCommentsOpen = false,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [liked, setLiked] = React.useState(is_liked);
  const [likeCount, setLikeCount] = React.useState(likes_count);
  const [commentCount, setCommentCount] = React.useState(comments_count);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showCommentInput, setShowCommentInput] = React.useState(false);
  const [commentText, setCommentText] = React.useState("");
  const [comments, setComments] = React.useState([]);
  const [loadingComments, setLoadingComments] = React.useState(false);
  const openMenu = Boolean(anchorEl);

  const [openImageModal, setOpenImageModal] = React.useState(false);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  // Update local state when props change
  React.useEffect(() => {
    setLiked(is_liked);
    setLikeCount(likes_count);
    setCommentCount(comments_count);
  }, [is_liked, likes_count, comments_count]);

  // Fetch comments when comment section is opened
  React.useEffect(() => {
    if (isCommentsOpen && comments.length === 0) {
      fetchComments();
    }
  }, [isCommentsOpen]);

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const response = await apiService.getComments(id);
      if (response.success) {
        setComments(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      // If there's an error, set empty array to show "no comments" message
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  // Smart time formatting
  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - postTime) / (1000 * 60));

    if (diffInMinutes < 1) {
      return "just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}d ago`;
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleBan = () => {
    if (onBanUser) onBanUser();
    handleMenuClose();
  };

  const handleVisit = () => {
    if (onVisitUser) onVisitUser();
    handleMenuClose();
  };

  const handleDelete = () => {
    if (onDeletePost) onDeletePost();
    handleMenuClose();
  };

  const handleEdit = () => {
    if (onEditPost) onEditPost();
    handleMenuClose();
  };

  const handleLike = async () => {
    if (onLikePost) {
      try {
        await onLikePost();
        // The parent component will update the state
      } catch (error) {
        console.error("Failed to like post:", error);
      }
    } else {
      // Fallback to local state if no API handler
      setLiked(!liked);
      setLikeCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
    }
  };

  const handleComment = () => {
    if (onCommentToggle) {
      onCommentToggle(id);
    } else {
      setShowCommentInput(!showCommentInput);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || !onAddComment) return;

    try {
      const response = await onAddComment(commentText.trim());
      setCommentText("");

      // If the comment was successfully added, refresh the comments
      if (response && response.success) {
        // Fetch fresh comments from the API
        await fetchComments();
        // Update comment count
        setCommentCount((prev) => prev + 1);
      }

      // Don't close the comment section - keep it open
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  // Get image URLs - handle both string URLs and File objects
  const getImageUrls = () => {
    if (!images || images.length === 0) return [];

    return images.map((image) => {
      if (typeof image === "string") {
        // If it's a URL string, construct the full URL
        if (image.startsWith("http")) {
          return image;
        } else {
          // Assume it's a relative path from the API
          const fullUrl = `${config.API_BASE_URL}/storage/${image}`;
          return fullUrl;
        }
      }
      // If it's a File object, create a temporary URL
      return URL.createObjectURL(image);
    });
  };

  const imageUrls = getImageUrls();

  // NEW: modal handlers
  const handleOpenImage = (index) => {
    setCurrentImageIndex(index);
    setOpenImageModal(true);
  };
  const handleCloseImage = () => setOpenImageModal(false);
  const handlePrevImage = () =>
    setCurrentImageIndex((prev) =>
      prev === 0 ? imageUrls.length - 1 : prev - 1
    );
  const handleNextImage = () =>
    setCurrentImageIndex((prev) =>
      prev === imageUrls.length - 1 ? 0 : prev + 1
    );

  // Get category color
  const getCategoryColor = (cat) => {
    switch (cat?.toLowerCase()) {
      case "announcement":
        return "#e74c3c"; // Red
      case "events":
        return "#3498db"; // Blue
      case "business":
        return "#f39c12"; // Orange
      case "project":
        return "#27ae60"; // Green
      default:
        return "#95a5a6"; // Light Gray
    }
  };

  // Get visibility icon and tooltip
  const getVisibilityInfo = (vis) => {
    switch (vis?.toLowerCase()) {
      case "residents_only":
        return {
          icon: <GroupIcon fontSize="small" />,
          tooltip: "Residents Only",
        };
      case "admin_only":
        return {
          icon: <AdminPanelSettingsIcon fontSize="small" />,
          tooltip: "Admin Only",
        };
      default:
        return { icon: <PublicIcon fontSize="small" />, tooltip: "Public" };
    }
  };

  const visibilityInfo = getVisibilityInfo(visibility);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: 1,
        border: `1px solid ${theme.palette.divider}`,
        mb: 2,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, pb: 1.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", flex: 1 }}>
            <Avatar
              src={avatarSrc}
              sx={{
                width: 40,
                height: 40,
                mr: 1.5,
                cursor: "pointer",
              }}
            >
              {!avatarSrc && userName?.charAt(0)?.toUpperCase()}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 0.5,
                  flexWrap: "wrap",
                }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight="600"
                  sx={{
                    color: theme.palette.text.primary,
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {userName}
                </Typography>

                {/* Category badge */}
                <Chip
                  label={category?.toUpperCase() || "GENERAL"}
                  size="small"
                  sx={{
                    backgroundColor: getCategoryColor(category),
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.65rem",
                    height: 18,
                    "& .MuiChip-label": {
                      px: 0.6,
                    },
                  }}
                />
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: "0.75rem" }}
                >
                  {formatTime(timestamp)}
                </Typography>

                {/* Visibility icon */}
                <Tooltip title={visibilityInfo.tooltip} arrow>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: theme.palette.text.secondary,
                      cursor: "help",
                    }}
                  >
                    {visibilityInfo.icon}
                  </Box>
                </Tooltip>
              </Box>
            </Box>
          </Box>

          <IconButton
            aria-label="more"
            onClick={handleMenuClick}
            size="small"
            sx={{
              mt: -0.5,
              "&:hover": { backgroundColor: theme.palette.action.hover },
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleMenuClose}
          PaperProps={{
            style: {
              maxHeight: 48 * 4.5,
              width: "20ch",
            },
          }}
        >
          {onBanUser && <MenuItem onClick={handleBan}>Ban User</MenuItem>}
          {onVisitUser && <MenuItem onClick={handleVisit}>Visit User</MenuItem>}
          {onEditPost && <MenuItem onClick={handleEdit}>Edit Post</MenuItem>}
          {onDeletePost && (
            <MenuItem onClick={handleDelete}>Delete Post</MenuItem>
          )}
        </Menu>
      </Box>
      {/* Content */}
      <Box sx={{ px: 2, pb: 1.5 }}>
        {title && (
          <Typography
            variant="h6"
            sx={{ mb: 1, fontWeight: 600, color: theme.palette.text.primary }}
          >
            {title}
          </Typography>
        )}

        {content && content.trim() !== "" && content !== "null" && (
          <Typography
            variant="body2"
            sx={{ mb: 1.5, lineHeight: 1.5, color: theme.palette.text.primary }}
          >
            {content}
          </Typography>
        )}
      </Box>

      {/* Images */}
      {imageUrls.length > 0 && (
        <Box sx={{ px: 2, pb: 1.5 }}>
          {(() => {
            const count = imageUrls.length;

            if (count === 1) {
              return (
                <Box
                  sx={{
                    backgroundColor: "black",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 400,
                    borderRadius: 2,
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                  onClick={() => handleOpenImage(0)}
                >
                  <img
                    src={imageUrls[0]}
                    alt="Post image"
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              );
            }

            if (count === 2) {
              return (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 1,
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  {imageUrls.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt=""
                      style={{
                        width: "100%",
                        height: 400,
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      onClick={() => handleOpenImage(idx)}
                    />
                  ))}
                </Box>
              );
            }

            if (count === 3) {
              return (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 1,
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  {imageUrls.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt=""
                      style={{
                        width: "100%",
                        height: 400,
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      onClick={() => handleOpenImage(idx)}
                    />
                  ))}
                </Box>
              );
            }

            if (count === 4) {
              return (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 1,
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  {imageUrls.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt=""
                      style={{
                        width: "100%",
                        height: 400,
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      onClick={() => handleOpenImage(idx)}
                    />
                  ))}
                </Box>
              );
            }

            if (count === 5) {
              return (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr",
                    gridTemplateRows: "1fr 1fr",
                    gap: 1,
                    borderRadius: 2,
                    overflow: "hidden",
                    height: 400,
                  }}
                >
                  <Box sx={{ gridRow: "1 / span 2" }}>
                    <img
                      src={imageUrls[0]}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      onClick={() => handleOpenImage(0)}
                    />
                  </Box>

                  {imageUrls.slice(1).map((src, i) => (
                    <Box key={i}>
                      <img
                        src={src}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                        onClick={() => handleOpenImage(i + 1)}
                      />
                    </Box>
                  ))}
                </Box>
              );
            }

            if (count >= 6) {
              return (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 1,
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  {imageUrls.slice(0, 5).map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt=""
                      style={{
                        width: "100%",
                        height: 200,
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      onClick={() => handleOpenImage(idx)}
                    />
                  ))}
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: 200,
                      overflow: "hidden",
                      cursor: "pointer",
                    }}
                    onClick={() => handleOpenImage(5)}
                  >
                    <img
                      src={imageUrls[5]}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter: "brightness(0.6)",
                      }}
                    />
                    <Typography
                      variant="h4"
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      +{count - 5}
                    </Typography>
                  </Box>
                </Box>
              );
            }

            return null;
          })()}
        </Box>
      )}
      <Modal open={openImageModal} onClose={handleCloseImage}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            bgcolor: "rgba(0,0,0,0.1)",
            position: "relative",
          }}
        >
          <IconButton
            onClick={handleCloseImage}
            sx={{ position: "absolute", top: 20, right: 20, color: "white" }}
          >
            <CloseIcon />
          </IconButton>
          {imageUrls.length > 1 && (
            <IconButton
              onClick={handlePrevImage}
              sx={{ position: "absolute", left: 20, color: "white" }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
          )}
          <img
            src={imageUrls[currentImageIndex]}
            alt="Preview"
            style={{
              maxHeight: "90%",
              maxWidth: "90%",
              objectFit: "contain",
              borderRadius: 8,
            }}
          />
          {imageUrls.length > 1 && (
            <IconButton
              onClick={handleNextImage}
              sx={{ position: "absolute", right: 20, color: "white" }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          )}
        </Box>
      </Modal>
      {/* Divider */}
      <Divider sx={{ mx: 2 }} />
      {/* Actions */}
      <Box sx={{ px: 2, py: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={handleLike}
            color={liked ? "primary" : "default"}
            size="small"
            sx={{
              "&:hover": { backgroundColor: theme.palette.action.hover },
              color: liked
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
            }}
          >
            {liked ? (
              <FavoriteIcon fontSize="small" />
            ) : (
              <FavoriteBorderIcon fontSize="small" />
            )}
          </IconButton>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: "0.875rem", mr: 2 }}
          >
            {likeCount}
          </Typography>

          <IconButton
            onClick={handleComment}
            color={isCommentsOpen ? "primary" : "default"}
            size="small"
            sx={{
              "&:hover": { backgroundColor: theme.palette.action.hover },
              color: isCommentsOpen
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
              backgroundColor: isCommentsOpen
                ? theme.palette.primary.light + "20"
                : "transparent",
            }}
          >
            <ChatBubbleOutlineIcon fontSize="small" />
          </IconButton>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: "0.875rem" }}
          >
            {commentCount}
          </Typography>
        </Box>
      </Box>
      {/* Comments Display */}
      {isCommentsOpen && (
        <>
          <Divider sx={{ mx: 2, my: 1 }} />
          <Box
            sx={{
              px: 2,
              pb: 1.5,
              animation: "slideDown 0.3s ease-out",
              "@keyframes slideDown": {
                "0%": {
                  opacity: 0,
                  transform: "translateY(-10px)",
                },
                "100%": {
                  opacity: 1,
                  transform: "translateY(0)",
                },
              },
            }}
          >
            {/* Existing Comments */}
            {commentCount > 0 ? (
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 1, fontWeight: 600 }}
                >
                  Comments ({commentCount})
                </Typography>
                <Box
                  sx={{
                    maxHeight: 300,
                    overflowY: "auto",
                    "&::-webkit-scrollbar": {
                      width: "6px",
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: theme.palette.background.default,
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: theme.palette.divider,
                      borderRadius: "3px",
                    },
                  }}
                >
                  {loadingComments ? (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ textAlign: "center", display: "block", py: 1.5 }}
                    >
                      Loading comments...
                    </Typography>
                  ) : comments.length === 0 ? (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ textAlign: "center", display: "block", py: 1.5 }}
                    >
                      No comments yet. Be the first to comment!
                    </Typography>
                  ) : (
                    comments.map((comment) => (
                      <Box
                        key={comment.id}
                        sx={{
                          display: "flex",
                          gap: 1.5,
                          mb: 1.5,
                          p: 1.5,
                          backgroundColor: theme.palette.background.default,
                          borderRadius: 1.5,
                          border: `1px solid ${theme.palette.divider}`,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            backgroundColor: theme.palette.action.hover,
                            borderColor: theme.palette.primary.light,
                          },
                        }}
                      >
                        <Avatar
                          src={comment.user.profile_picture}
                          sx={{
                            width: 32,
                            height: 32,
                            fontSize: "0.75rem",
                            backgroundColor: comment.user.profile_picture
                              ? "transparent"
                              : theme.palette.primary.main,
                            border: comment.user.profile_picture
                              ? "none"
                              : "2px solid",
                            borderColor: theme.palette.primary.light,
                          }}
                        >
                          {!comment.user.profile_picture &&
                            comment.user.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 0.5,
                            }}
                          >
                            <Typography
                              variant="caption"
                              fontWeight="600"
                              color="text.primary"
                            >
                              {comment.user.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {comment.time_ago}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{ lineHeight: 1.4 }}
                          >
                            {comment.content}
                          </Typography>
                        </Box>
                      </Box>
                    ))
                  )}
                  {commentCount > 5 && comments.length > 0 && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        textAlign: "center",
                        display: "block",
                        py: 1.5,
                        fontStyle: "italic",
                      }}
                    >
                      ... and {commentCount - comments.length} more comments
                    </Typography>
                  )}
                </Box>
              </Box>
            ) : (
              <Box sx={{ mb: 2, textAlign: "center", py: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontStyle: "italic" }}
                >
                  No comments yet. Be the first to comment!
                </Typography>
              </Box>
            )}

            {/* Comment Input */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                size="small"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                sx={{ flex: 1 }}
                onKeyPress={(e) => e.key === "Enter" && handleCommentSubmit()}
                variant="outlined"
                multiline
                maxRows={3}
              />
              <Button
                size="small"
                variant="contained"
                onClick={handleCommentSubmit}
                disabled={!commentText.trim()}
                sx={{
                  minWidth: 80,
                  height: 40,
                  alignSelf: "flex-end",
                }}
              >
                Comment
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}

export default CommunityPost;
