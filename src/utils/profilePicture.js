import config from '../config/env';

/**
 * Constructs the full URL for a profile picture
 * @param {string|null|undefined} profilePicture - The profile picture path or URL
 * @returns {string|null} - The full URL or null if no profile picture
 */
export const getProfilePictureUrl = (profilePicture) => {
  if (!profilePicture) return null;
  
  // If it's already a full URL, return as is
  if (profilePicture.startsWith('http')) {
    return profilePicture;
  }
  
  // Otherwise, construct the full URL using the API base URL
  return `${config.API_BASE_URL}/storage/${profilePicture}`;
};
