import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { registerUser, loginUser, refreshAccessToken, logoutUser, forgotPasswordService, resetPasswordService } from "../services/auth.service.js";
import { validateForgotPassword, validateResetPassword } from "../validators/password.validator.js";
import { COOKIE_OPTIONS, ACCESS_TOKEN_COOKIE_MAX_AGE, REFRESH_TOKEN_COOKIE_MAX_AGE } from "../config/constants.js";

export const register = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken } = await registerUser(req.body);

  res
    .cookie("refreshToken", refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE,
    })
    .status(201)
    .json(new ApiResponse(201, { accessToken }, "Registered"));
});

export const login = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken } = await loginUser(req.body);

  res
    .cookie("accessToken", accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE,
    })
    .cookie("refreshToken", refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE,
    })
    .status(200)
    // Return accessToken in body so SPA clients (like the current frontend) can store it for Authorization headers.
    .json(new ApiResponse(200, { accessToken }, "Logged in"));
});

export const refreshAccessTokenController = asyncHandler(async (req, res) => {
  const result = await refreshAccessToken(req);

  res
    .status(200)
    .cookie('accessToken', result.accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE,
      ...result.cookieOptions,
    })
    .json(new ApiResponse(200, {
      accessToken: result.accessToken,
      user: result.user,
    }));
});

export const logout = asyncHandler(async (req, res) => {
  await logoutUser(req);

  res
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .status(200)
    .json(new ApiResponse(200, null, 'Logged out'));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  validateForgotPassword(req.body);
  
  const { email } = req.body;
  const result = await forgotPasswordService({ email });

  res
    .status(200)
    .json(new ApiResponse(200, result, result.message));
});

export const resetPassword = asyncHandler(async (req, res) => {
  validateResetPassword(req.body);
  
  const { token, newPassword } = req.body;
  const result = await resetPasswordService({ token, newPassword });

  res
    .status(200)
    .json(new ApiResponse(200, result, result.message));
});
