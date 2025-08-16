import User from "../models/User.js";
import { NODE_ENV } from "../config/env.js";
import generateToken from "../utility/generateToken.js";
import { validateLoginInputs } from "../../src/utilities/ValidateInputs.js";

export const getUserInfo = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      username: user.username,
      email: user.email,
      user_icon: user.user_icon ? user.user_icon.url : null,
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const registerUser = async (req, res) => {
  const { email, password, username } = req.body;

  const { valid, error } = validateLoginInputs({
    email,
    password,
    username,
    action: "Sign up",
  });
  if (!valid) {
    return res.status(400).json({ message: error });
  }

  try {
    const userExists = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (userExists) {
      return res.status(400).json({
        message:
          userExists.email === email
            ? "Email already in use"
            : "Username already taken",
      });
    }

    const user = await User.create({ email, password, username });
    const token = generateToken(user._id);

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const { valid, error } = validateLoginInputs({
    email,
    password,
    action: "Login",
  });
  if (!valid) {
    return res.status(400).json({ message: error });
  }

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = generateToken(user._id);

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      user_icon: user.user_icon ? user.user_icon.url : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.status(200).json({ message: "Logged out" });
};
