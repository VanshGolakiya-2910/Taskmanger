import assert from "assert";

const required = [
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
];

required.forEach((key) => {
  const value = process.env[key];
  assert(value && value.length >= 16, `${key} is required and should be at least 16 chars`);
});

if (!process.env.ALLOWED_ORIGINS) {
  console.warn("Warning: ALLOWED_ORIGINS is empty; CORS allowlist will block browser origins.");
}
