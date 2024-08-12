/**
 * Checks if a person is exactly 10 years old based on their birthdate.
 *
 * @param {string} birthdate - The birthdate of the person in "YYYY/MM/DD" format.
 * @returns {boolean} Returns true if the person is exactly 10 years old today, otherwise false.
 */
function isLessThanTenYearsOld(birthdate) {
  const birthDateParts = birthdate.split("/");
  const birthYear = parseInt(birthDateParts[0], 10);
  const birthMonth = parseInt(birthDateParts[1], 10) - 1; // Months are zero-indexed
  const birthDay = parseInt(birthDateParts[2], 10);

  const today = new Date();
  const birthDate = new Date(birthYear, birthMonth, birthDay);

  let age = today.getFullYear() - birthDate.getFullYear();

  // Adjust the age if the birth date has not occurred yet this year
  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  // Return true if the child is less than 10 years old
  return age < 10;
}

module.exports = { isLessThanTenYearsOld };
