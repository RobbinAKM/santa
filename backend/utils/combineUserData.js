/**
 * Combines user and profile data into a single array with specified properties.
 * @param {Object} data - The combined user and profile data.
 * @param {Array} data.users - Array of user objects.
 * @param {Array} data.profiles - Array of profile objects.
 * @returns {Array} - Array of combined user objects with id, name, address, and birthdate.
 */
const combineUserProfileData = (data) => {
  const { users, profiles } = data;

  // Create a mapping of userUid to profile data for quick lookup
  const profileMap = profiles.reduce((acc, profile) => {
    acc[profile.userUid] = profile;
    return acc;
  }, {});

  // Map users to the desired format
  return users.map((user) => {
    const profile = profileMap[user.uid];
    return {
      id: user.uid,
      name: user.username,
      address: profile ? profile.address : "N/A",
      birthdate: profile ? profile.birthdate : "N/A",
    };
  });
};

module.exports = { combineUserProfileData };
