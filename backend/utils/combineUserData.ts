/**
 * Combines user and profile data into a single array with specified properties.
 *
 * @param data - The combined user and profile data.
 * @param data.users - Array of user objects.
 * @param data.profiles - Array of profile objects.
 * @returns Array of combined user objects with id, name, address, and birthdate.
 */
interface User {
  uid: string;
  username: string;
}

interface Profile {
  userUid: string;
  address: string;
  birthdate: string;
}

export interface CombinedData {
  users: User[];
  profiles: Profile[];
}

export interface CombinedUser {
  id: string;
  name: string;
  address: string;
  birthdate: string;
}

const combineUserProfileData = (data: CombinedData): CombinedUser[] => {
  const { users, profiles } = data;

  // Create a mapping of userUid to profile data for quick lookup
  const profileMap = profiles.reduce<Record<string, Profile>>(
    (acc, profile) => {
      acc[profile.userUid] = profile;
      return acc;
    },
    {}
  );

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

export { combineUserProfileData };
