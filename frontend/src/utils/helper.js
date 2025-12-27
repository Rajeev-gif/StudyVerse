export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getInitials = (title) => {
  if (!title) return "";

  const words = title.split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }

  return initials.toUpperCase();
};

export const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);

  // Check if the date is valid before formatting
  if (isNaN(date.getTime())) {
    console.error("Invalid date string provided:", dateString);
    return "Invalid Date";
  }

  return date.toLocaleDateString(undefined, options);
};

export const getFirstName = (name) => {
  if (!name) return "";
  return name.split(" ")[0];
};
