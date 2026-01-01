import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { registerUser, loginUser, refreshAccessToken } from "../services/auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken } = await registerUser(req.body);

  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
    })
    .status(201)
    .json(new ApiResponse(201, { accessToken }, "Registered"));
});

export const login = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken } = await loginUser(req.body);

  res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict", // use "lax" if frontend is on different port
      secure: false, // true in production (HTTPS)
      maxAge: 15 * 60 * 1000, // 15 minutes
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: false, // true in production (HTTPS)
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    // Return accessToken in body so SPA clients (like the current frontend) can store it for Authorization headers.
    .json(new ApiResponse(200, { accessToken }, "Logged in"));
});

export const refreshAccessTokenController = asyncHandler(async (req, res) => {
  const result = await refreshAccessToken(req);

  res
    .status(200)
    .cookie('accessToken', result.accessToken, result.cookieOptions)
    .json(new ApiResponse(200, { user: result.user }));
});