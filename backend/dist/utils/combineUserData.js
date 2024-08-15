"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.combineUserProfileData = void 0;
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
exports.combineUserProfileData = combineUserProfileData;
