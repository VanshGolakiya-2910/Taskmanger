import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { registerUser, loginUser } from "../services/auth.service.js";

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
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
    })
    .status(200)
    .json(new ApiResponse(200, { accessToken }, "Logged in"));
});
