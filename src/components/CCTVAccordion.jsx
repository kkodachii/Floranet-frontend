import React, { useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  Alert,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";
import apiService from "../services/api";
import config from "../config/env";

const CCTVAccordion = ({
  cctvRequest,
  onUpdateFollowups,
  onUpdateFootage,
  onDeleteFootage,
  loading = false,
}) => {
  const [newFollowup, setNewFollowup] = useState("");
  const [footageError, setFootageError] = useState("");
  const [uploadingFootage, setUploadingFootage] = useState(false);
  const [addingFollowup, setAddingFollowup] = useState(false);
  const [deletingFootage, setDeletingFootage] = useState(null);
  const [downloadingFootage, setDownloadingFootage] = useState(null);
  const [footageDescription, setFootageDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const theme = useTheme();

  // Helper function to format time
  const formatTime = (timeString) => {
    if (!timeString) return "";

    // If it's already a simple time format (HH:MM), return as is
    if (
      typeof timeString === "string" &&
      timeString.includes(":") &&
      !timeString.includes("T")
    ) {
      return timeString;
    }

    // If it's a timestamp, extract just the time part
    try {
      const date = new Date(timeString);
      if (isNaN(date.getTime())) {
        // If it's not a valid date, try to extract time from string
        const timeMatch = timeString.match(/(\d{1,2}):(\d{2})/);
        if (timeMatch) {
          const hours = parseInt(timeMatch[1]);
          const minutes = timeMatch[2];
          return `${hours}:${minutes}`;
        }
        return timeString; // Return original if we can't parse it
      }
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return timeString; // Return original if parsing fails
    }
  };

  const handleAddFollowup = async () => {
    if (!newFollowup.trim()) return;

    try {
      setAddingFollowup(true);

      // Get current followups
      const currentFollowups = cctvRequest.followups || [];

      // Create new followup object
      const newFollowupObj = {
        id: Date.now(), // Temporary ID
        content: newFollowup.trim(),
        created_at: new Date().toISOString(),
        admin_name: "Admin User", // This should come from user context
      };

      // Add new followup to the list
      const updatedFollowups = [...currentFollowups, newFollowupObj];

      // Call the API to update followups
      await onUpdateFollowups(cctvRequest.id, updatedFollowups);

      // Clear the input
      setNewFollowup("");
    } catch (error) {
      console.error("Error adding followup:", error);
      // You might want to show an error message here
    } finally {
      setAddingFollowup(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    console.log("Picked file:", file);
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "video/mp4",
      "video/avi",
      "video/mov",
      "video/wmv",
      "image/jpeg",
      "image/png",
      "image/gif",
    ];
    if (!allowedTypes.includes(file.type)) {
      setFootageError("Please select a valid video or image file");
      return;
    }

    // Validate file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      setFootageError("File size must be less than 100MB");
      return;
    }

    setFootageError("");
    setSelectedFile(file);
  };

  const handleUploadFootage = async () => {
    if (!selectedFile) return;

    try {
      setUploadingFootage(true);

      const footageData = {
        file: selectedFile,
        description: footageDescription.trim(),
      };

      await onUpdateFootage(cctvRequest.id, footageData);

      // Clear the form
      setSelectedFile(null);
      setFootageDescription("");
      const fileInput = document.getElementById("footage-upload");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Error uploading footage:", error);
      setFootageError(error.message || "Failed to upload footage");
    } finally {
      setUploadingFootage(false);
    }
  };

  const handleDeleteFootage = async (footageId) => {
    try {
      setDeletingFootage(footageId);
      await onDeleteFootage(cctvRequest.id, footageId);
    } catch (error) {
      console.error("Error deleting footage:", error);
      // You might want to show an error message here
    } finally {
      setDeletingFootage(null);
    }
  };

  const handleDownloadFootage = async (footageId) => {
    try {
      setDownloadingFootage(footageId);
      await apiService.downloadCCTVFootage(cctvRequest.id, footageId);
    } catch (error) {
      console.error("Error downloading footage:", error);
      // You might want to show an error message here
    } finally {
      setDownloadingFootage(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const isVideoFile = (filename) => {
    const videoExtensions = [".mp4", ".avi", ".mov", ".wmv", ".mkv"];
    return videoExtensions.some((ext) => filename.toLowerCase().endsWith(ext));
  };

  const isImageFile = (filename) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];
    return imageExtensions.some((ext) => filename.toLowerCase().endsWith(ext));
  };

  // Get footage array from the new structure
  const footageArray = cctvRequest.footage || [];

  return (
    <Box sx={{ width: "100%" }}>
      {/* CCTV Footage Accordion - FIRST */}
      <Accordion defaultExpanded sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            CCTV Footage ({footageArray.length})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            {/* Reason and Location Summary */}
            <Box
              sx={{
                p: 2,
                backgroundColor: theme.palette.primary.light,
                borderRadius: 1,
                color: theme.palette.primary.contrastText,
              }}
            >
              <Stack spacing={1}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, minWidth: "60px" }}
                  >
                    Reason:
                  </Typography>
                  <Typography variant="body2">{cctvRequest.reason}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, minWidth: "60px" }}
                  >
                    Location:
                  </Typography>
                  <Typography variant="body2">
                    {cctvRequest.location}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, minWidth: "60px" }}
                  >
                    Date & Time:
                  </Typography>
                  <Typography variant="body2">
                    {cctvRequest.date_of_incident
                      ? `${new Date(
                          cctvRequest.date_of_incident
                        ).toLocaleDateString()} ${
                          cctvRequest.time_of_incident
                            ? formatTime(cctvRequest.time_of_incident)
                            : ""
                        }`
                      : "N/A"}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Upload new footage */}
            <Box
              sx={{
                p: 2,
                border: `2px dashed ${theme.palette.divider}`,
                borderRadius: 1,
              }}
            >
              <Stack spacing={2} alignItems="center">
                <UploadIcon sx={{ fontSize: 40, color: "text.secondary" }} />
                <Typography variant="body1" color="text.secondary">
                  Upload CCTV footage or images
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  textAlign="center"
                >
                  Supported formats: MP4, AVI, MOV, WMV, JPG, PNG, GIF (Max:
                  100MB)
                </Typography>

                <input
                  id="footage-upload"
                  type="file"
                  accept="video/*,image/*"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />

                <Button
                  variant="outlined"
                  component="label"
                  htmlFor="footage-upload"
                  startIcon={<UploadIcon />}
                  disabled={loading || uploadingFootage}
                >
                  Select File
                </Button>

                {selectedFile && (
                  <Box sx={{ width: "100%", textAlign: "center" }}>
                    <Typography variant="body2" color="primary" sx={{ mb: 1 }}>
                      Selected: {selectedFile.name} (
                      {formatFileSize(selectedFile.size)})
                    </Typography>

                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Description (optional)"
                      value={footageDescription}
                      onChange={(e) => setFootageDescription(e.target.value)}
                      sx={{ mb: 1 }}
                    />

                    <Button
                      variant="contained"
                      onClick={handleUploadFootage}
                      startIcon={
                        uploadingFootage ? (
                          <CircularProgress size={16} />
                        ) : (
                          <UploadIcon />
                        )
                      }
                      disabled={uploadingFootage}
                    >
                      {uploadingFootage ? "Uploading..." : "Upload"}
                    </Button>
                  </Box>
                )}

                {footageError && (
                  <Alert severity="error" sx={{ width: "100%" }}>
                    {footageError}
                  </Alert>
                )}
              </Stack>
            </Box>

            {/* Existing footage */}
            {footageArray.length > 0 ? (
              <Stack spacing={2}>
                {footageArray.map((file, index) => (
                  <Box
                    key={file.id || index}
                    sx={{
                      p: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      backgroundColor: theme.palette.background.default,
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {isVideoFile(file.cctv_footage) ? (
                          <VideoFileIcon color="primary" />
                        ) : isImageFile(file.cctv_footage) ? (
                          <ImageIcon color="primary" />
                        ) : (
                          <VideoFileIcon color="action" />
                        )}
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {file.file_name ||
                            file.cctv_footage.split("/").pop() ||
                            "Footage File"}
                        </Typography>
                      </Box>

                      <Tooltip title="Delete Footage">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteFootage(file.id)}
                          disabled={deletingFootage === file.id}
                        >
                          {deletingFootage === file.id ? (
                            <CircularProgress size={16} />
                          ) : (
                            <DeleteIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Box>

                    {file.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        {file.description}
                      </Typography>
                    )}

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Uploaded:{" "}
                      {new Date(file.created_at || Date.now()).toLocaleString()}
                      {file.file_size && ` • ${formatFileSize(file.file_size)}`}
                    </Typography>

                    <Stack direction="row" spacing={1}>
                      {isVideoFile(file.cctv_footage) && (
                        <Tooltip title="Play Video">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() =>
                              window.open(
                                `${config.API_BASE_URL}/storage/${file.cctv_footage}`,
                                "_blank"
                              )
                            }
                          >
                            <PlayArrowIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Download">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleDownloadFootage(file.id)}
                          disabled={downloadingFootage === file.id}
                        >
                          {downloadingFootage === file.id ? (
                            <CircularProgress size={16} />
                          ) : (
                            <DownloadIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontStyle: "italic", textAlign: "center" }}
              >
                No footage uploaded yet. Use the upload area above to add CCTV
                footage.
              </Typography>
            )}
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Followups Accordion - SECOND */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Followups ({cctvRequest.followups?.length || 0})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            {/* Existing followups */}
            {cctvRequest.followups && cctvRequest.followups.length > 0 ? (
              <Stack spacing={1}>
                {cctvRequest.followups.map((followup, index) => (
                  <Box
                    key={followup.id || index}
                    sx={{
                      p: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      backgroundColor: theme.palette.background.default,
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {new Date(followup.created_at).toLocaleString()}
                      </Typography>
                    </Box>
                    <Typography variant="body1">{followup.content}</Typography>
                    {followup.admin_name && (
                      <Chip
                        label={`By: ${followup.admin_name}`}
                        color="primary"
                        variant="outlined"
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontStyle: "italic" }}
              >
                No followups yet. Add the first one below.
              </Typography>
            )}

            {/* Add new followup - moved to bottom */}
            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Add a new followup..."
                value={newFollowup}
                onChange={(e) => setNewFollowup(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddFollowup()}
                disabled={loading || addingFollowup}
              />
              <Button
                variant="contained"
                startIcon={
                  addingFollowup ? <CircularProgress size={16} /> : <AddIcon />
                }
                onClick={handleAddFollowup}
                disabled={!newFollowup.trim() || loading || addingFollowup}
                sx={{ minWidth: "auto", px: 2 }}
              >
                {addingFollowup ? "Adding..." : "Add"}
              </Button>
            </Box>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default CCTVAccordion;
