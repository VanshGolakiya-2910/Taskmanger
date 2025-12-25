import { registerUser } from "../services/auth.service.js";
import { loginUser } from "../services/auth.service.js";
import { validateLogin } from "../validators/auth.validator.js";


export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["manager", "project_manager", "member"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const { accessToken, refreshToken } = await registerUser({
      email,
      password,
      role,
    });

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
      })
      .status(201)
      .json({
        message: "User registered successfully",
        accessToken,
      });
  } catch (err) {
    if (err.message === "EMAIL_EXISTS") {
      return res.status(409).json({ message: "Email already registered" });
    }

    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
};

export const login = async (req, res) => {
  try {
    validateLogin(req.body);

    const { accessToken, refreshToken } = await loginUser(req.body);

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
      })
      .status(200)
      .json({
        message: "Login successful",
        accessToken,
      });
  } catch (err) {
    if (err.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};
