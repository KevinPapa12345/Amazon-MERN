import dotenv from "dotenv";
dotenv.config();

export const {
  CLIENT_URL,
  NODE_ENV,
  PORT,
  MONGO_URI,
  JWT_SECRET,
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET,
  CLOUDINARY_NAME,
  CLOUDINARY_KEY,
  CLOUDINARY_SECRET,
  EMAIL_USER,
  EMAIL_PASS,
} = process.env;
