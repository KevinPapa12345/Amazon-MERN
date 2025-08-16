export const validateLoginInputs = ({ email, password, username, action }) => {
  if (!email) {
    return { valid: false, error: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Please enter a valid email address" };
  }

  if (!password) {
    return { valid: false, error: "Password is required" };
  }

  if (password.length < 6) {
    return { valid: false, error: "Password must be at least 6 characters" };
  }

  if (action === "Sign up" && !username) {
    return { valid: false, error: "Name is required" };
  }

  if (username && username.length > 20) {
    return { valid: false, error: "Username must be 20 characters or fewer" };
  }

  return { valid: true };
};

export const validateAccountSettings = ({ email, username, password }) => {
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, error: "Please enter a valid email address" };
    }
  }

  if (username && username.length > 20) {
    return { valid: false, error: "Username must be 20 characters or fewer" };
  }

  if (password && password.length < 6) {
    return { valid: false, error: "Password must be at least 6 characters" };
  }

  return { valid: true };
};
