export const validateLogin = ({ email, password }) => {
  if (!email || !password) {
    throw new Error("INVALID_CREDENTIALS");
  }
};
