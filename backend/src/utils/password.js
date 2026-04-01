let passwordLib;

try {
  const bcryptModule = await import("bcrypt");
  passwordLib = bcryptModule.default;
} catch (err) {
  console.warn("[auth] Native bcrypt unavailable, using bcryptjs fallback");
  const bcryptJsModule = await import("bcryptjs");
  passwordLib = bcryptJsModule.default;
}

export const hashPassword = async (password) => {
  return passwordLib.hash(password, 12);
};

export const comparePassword = async (password, hash) => {
  return passwordLib.compare(password, hash);
};
