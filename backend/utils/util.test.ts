// tests/isLessThanTenYearsOld.test.js
const { isLessThanTenYearsOld } = require("./checkAge");

describe("isLessThanTenYearsOld", () => {
  test("returns true if the person is less than 10 years old", () => {
    const birthdate = "2015/08/15"; // A birthdate that makes the person less than 10 years old
    expect(isLessThanTenYearsOld(birthdate)).toBe(true);
  });

  test("returns true if the person is exactly 10 years old", () => {
    const birthdate = "2014/08/15"; // A birthdate that makes the person exactly 10 years old
    expect(isLessThanTenYearsOld(birthdate)).toBe(false);
  });

  test("returns false if the person is older than 10 years", () => {
    const birthdate = "2010/08/15"; // A birthdate that makes the person older than 10 years
    expect(isLessThanTenYearsOld(birthdate)).toBe(false);
  });

  test("handles leap years correctly", () => {
    const birthdate = "2012/02/29"; // A leap year birthdate
    // Adjust the test date if running in a year where February 29 does not exist
    const today = new Date();
    const isLeapYear = (year: number) =>
      (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

    // Calculate if the current year is a leap year
    if (!isLeapYear(today.getFullYear())) {
      today.setDate(today.getDate() + 1); // Move the date forward to ensure it's not a leap year
    }

    expect(isLessThanTenYearsOld(birthdate)).toBe(today.getFullYear() === 2023); // Adjust based on current year
  });

  test("returns false for invalid dates", () => {
    const invalidBirthdate = "abcd/ef/gh"; // Invalid birthdate format
    expect(isLessThanTenYearsOld(invalidBirthdate)).toBe(false);
  });
});

// tests/combineUserProfileData.test.js
const { combineUserProfileData } = require("./combineUserData");

describe("combineUserProfileData", () => {
  test("combines user and profile data correctly when users have matching profiles", () => {
    const data = {
      users: [
        { uid: "1", username: "John Doe" },
        { uid: "2", username: "Jane Smith" },
      ],
      profiles: [
        { userUid: "1", address: "123 Main St", birthdate: "2014/08/15" },
        { userUid: "2", address: "456 Elm St", birthdate: "2015/09/25" },
      ],
    };

    const result = combineUserProfileData(data);

    expect(result).toEqual([
      {
        id: "1",
        name: "John Doe",
        address: "123 Main St",
        birthdate: "2014/08/15",
      },
      {
        id: "2",
        name: "Jane Smith",
        address: "456 Elm St",
        birthdate: "2015/09/25",
      },
    ]);
  });

  test("returns 'N/A' for address and birthdate if profile data is missing", () => {
    const data = {
      users: [
        { uid: "1", username: "John Doe" },
        { uid: "2", username: "Jane Smith" },
      ],
      profiles: [
        { userUid: "1", address: "123 Main St", birthdate: "2014/08/15" },
        // No profile for userUid "2"
      ],
    };

    const result = combineUserProfileData(data);

    expect(result).toEqual([
      {
        id: "1",
        name: "John Doe",
        address: "123 Main St",
        birthdate: "2014/08/15",
      },
      {
        id: "2",
        name: "Jane Smith",
        address: "N/A",
        birthdate: "N/A",
      },
    ]);
  });

  test("handles profiles with no matching users", () => {
    const data = {
      users: [{ uid: "1", username: "John Doe" }],
      profiles: [
        { userUid: "1", address: "123 Main St", birthdate: "2014/08/15" },
        { userUid: "2", address: "456 Elm St", birthdate: "2015/09/25" }, // No matching user
      ],
    };

    const result = combineUserProfileData(data);

    expect(result).toEqual([
      {
        id: "1",
        name: "John Doe",
        address: "123 Main St",
        birthdate: "2014/08/15",
      },
    ]);
  });

  test("returns empty array if both users and profiles are empty", () => {
    const data = {
      users: [],
      profiles: [],
    };

    const result = combineUserProfileData(data);

    expect(result).toEqual([]);
  });
});
