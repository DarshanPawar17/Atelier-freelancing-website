import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";
import { loginUser, registerUser } from "../services/authService.js";

const maxAge = 3 * 24 * 60 * 60;

const generateToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await registerUser({ email, password });

    return res.status(200).json({
      user: { 
        id: user.id, 
        email: user.email,
        username: user.username,
        isProfileInfoSet: user.isProfileInfoSet
      },
      jwt: generateToken(email, user.id),
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser({ email, password });
    return res.status(200).json({
      user: { 
        id: user.id, 
        email: user.email,
        username: user.username,
        isProfileInfoSet: user.isProfileInfoSet,
        fullName: user.fullName,
        description: user.description,
        profileImage: user.profileImage
      },
      jwt: generateToken(email, user.id),
      message: "Login successful",
    });
  } catch (err) {
    next(err);
  }
};

export const getUserInfo = async (req, res, next) => {
  // console.log(req.userId);
  try {
    if (!req.userId) {
      return res.status(400).send("User id is required.");
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) {
      return res.status(404).send("User not found.");
    }

    delete user.password;
    return res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const setUserInfo = async (req, res, next) => {
  try {
    if (!req?.userId) {
      return res.status(400).send("User id is required.");
    }

    const { userName, fullName, description } = req.body;
    if (!userName || !fullName || !description) {
      return res
        .status(400)
        .send("Username, Full name and Description are required");
    }

    // Check if username is taken by another user
    const userNameValid = await prisma.user.findUnique({
      where: { username: userName },
    });
    if (userNameValid && userNameValid.id !== req.userId) {
      return res.status(200).json({ userNameError: true });
    }

    await prisma.user.update({
      where: { id: req.userId },
      data: {
        username: userName,
        fullName,
        description,
        isProfileInfoSet: true,
      },
    });
    return res.status(200).send("Profile info set successfully");
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res.status(200).json({ userNameError: true });
      }
    }
    console.error("setUserInfo error:", err);
    return res.status(500).send("Internal Server Error");
  }
};

export const setUserImage = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(400).send("User id is required.");
    }

    if (!req.file) {
      return res.status(400).send("Image is required");
    }

    // Cloudinary automatically handles the upload and provides the URL
    const imageUrl = req.file.path;
    await prisma.user.update({
      where: { id: req.userId },
      data: { profileImage: imageUrl },
    });
    return res.status(200).json({ img: imageUrl });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};
