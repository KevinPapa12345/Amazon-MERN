import cloudinary from "../config/cloudinary.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import VerificationCode from "../models/VerificationCode.js";
import { deleteCloudinaryFolder } from "../utility/cloudinaryUtils.js";
import { sendEmail } from "../config/sendEmail.js";
import { validateAccountSettings } from "../../src/utilities/ValidateInputs.js";
import mongoose from "mongoose";

export const uploadUserIcon = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No user icon uploaded" });
    }
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.user_icon?.publicId) {
      await cloudinary.uploader.destroy(user.user_icon.publicId);
    }

    const file = req.file;
    const newIcon = {
      url: file.path,
      publicId: file.filename,
      originalName: file.originalname,
      size: file.size,
    };

    user.user_icon = newIcon;

    await user.save();

    res.status(200).json({
      message: "User icon uploaded successfully",
      user_icon: user.user_icon,
    });
  } catch (error) {
    console.error("User icon upload error:", error);
    res.status(500).json({ message: "Server error uploading user icon" });
  }
};

export const getSalesForSeller = async (req, res) => {
  try {
    const sellerId = new mongoose.Types.ObjectId(req.user.id);
    const { page, limit, search, sort } = req.query;
    const skip = (page - 1) * limit;

    let sortStage = { createdAt: -1 };
    if (sort === "oldest") sortStage = { createdAt: 1 };
    else if (sort === "priceLow") sortStage = { "items.product.priceCents": 1 };
    else if (sort === "priceHigh")
      sortStage = { "items.product.priceCents": -1 };

    const matchStage = {
      $match: {
        "items.product.userId": sellerId,
      },
    };

    const projectStage = {
      $project: {
        items: 1,
        user: 1,
        createdAt: 1,
      },
    };

    const unwindStage = { $unwind: "$items" };

    const matchItemsStage = {
      $match: {
        "items.product.userId": sellerId,
        ...(search && {
          "items.product.name": { $regex: search, $options: "i" },
        }),
      },
    };

    const facetStage = {
      $facet: {
        paginatedResults: [
          { $sort: sortStage },
          { $skip: parseInt(skip) },
          { $limit: parseInt(limit) },
          {
            $project: {
              orderId: "$_id",
              buyerId: "$user",
              productId: "$items.product._id",
              productName: "$items.product.name",
              images: "$items.product.images",
              variant1Images: "$items.product.variant1Images",
              variant2Images: "$items.product.variant2Images",
              variant3Images: "$items.product.variant3Images",
              quantity: "$items.quantity",
              priceCents: "$items.product.priceCents",
              totalCents: {
                $multiply: ["$items.quantity", "$items.product.priceCents"],
              },
              deliveryDate: "$items.deliveryDate",
              createdAt: "$createdAt",
            },
          },
        ],
        totalCount: [{ $count: "count" }],
      },
    };

    const result = await Order.aggregate([
      matchStage,
      projectStage,
      unwindStage,
      matchItemsStage,
      facetStage,
    ]);

    const sales = result[0].paginatedResults;
    const totalSales = result[0].totalCount[0]?.count || 0;

    res.status(200).json({
      sales,
      page: parseInt(page),
      totalPages: Math.ceil(totalSales / limit),
      totalSales,
    });
  } catch (err) {
    console.error("Failed to get sales for seller:", err);
    res.status(500).json({ error: "Failed to get sales" });
  }
};

export const deleteUserAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.user_icon && user.user_icon.publicId) {
      const folderPath = `user_icons/${userId}`;
      await deleteCloudinaryFolder(folderPath);
    }

    const products = await Product.find({ userId }, "_id");

    const deleteProductFolders = products.map((product) =>
      deleteCloudinaryFolder(`products/${userId}/${product._id}`)
    );
    await Promise.all(deleteProductFolders);

    await deleteCloudinaryFolder(`products/${userId}`, {
      deleteResources: false,
    });

    await user.deleteOne();

    res.status(200).json({ message: "User account deleted successfully" });
  } catch (err) {
    console.error("Failed to delete user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("+password");
    if (!user) return res.status(404).json({ error: "User not found" });

    const { username, email, currentPassword } = req.body;

    if (!username || !email) {
      return res
        .status(400)
        .json({ error: "Username and email are required." });
    }

    const { valid, error } = validateAccountSettings({
      email,
      username,
    });
    if (!valid) {
      return res.status(400).json({ error });
    }

    if (username !== user.username) {
      const existingUsername = await User.findOne({ username });
      if (
        existingUsername &&
        existingUsername._id.toString() !== user._id.toString()
      ) {
        return res.status(400).json({ error: "Username is already taken." });
      }
      user.username = username;
    }

    if (email !== user.email) {
      if (!currentPassword) {
        return res
          .status(400)
          .json({ error: "Current password is required to change email." });
      }

      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ error: "Incorrect current password." });
      }

      const existingEmail = await User.findOne({ email });
      if (
        existingEmail &&
        existingEmail._id.toString() !== user._id.toString()
      ) {
        return res.status(400).json({ error: "Email is already in use." });
      }
      user.email = email;
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated",
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const sendVerificationCode = async (req, res) => {
  const email = req.body.email;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: "No user found with this email." });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  await VerificationCode.create({
    email,
    code,
    expiresAt: Date.now() + 3 * 60 * 1000,
  });

  await sendEmail(email, "Your verification code", `<h1>Code: ${code}</h1>`);

  res.json({ message: "Verification code sent to your email." });
};

export const updateUserPassword = async (req, res) => {
  const { verificationCode, newPassword } = req.body;

  if (!verificationCode || !newPassword) {
    return res.status(400).json({ error: "Missing fields." });
  }

  const { valid, error } = validateAccountSettings({ newPassword });
  if (!valid) {
    return res.status(400).json({ message: error });
  }

  const codeEntry = await VerificationCode.findOne({
    code: verificationCode,
    expiresAt: { $gt: Date.now() },
  });

  if (!codeEntry) {
    return res.status(400).json({ error: "Invalid or expired code." });
  }

  const email = codeEntry.email;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  user.password = newPassword;
  await user.save();

  await VerificationCode.deleteMany({ email });

  res.json({ message: "Password updated successfully." });
};
