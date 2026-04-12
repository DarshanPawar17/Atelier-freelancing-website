import { Router } from "express";
import {
  addMessage,
  addAttachment,
  getMessages,
  getUnreadMessages,
  markAsRead,
} from "../controllers/MessagesController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { uploadDocument } from "../config/cloudinary.config.js";

export const messageRoutes = Router();

messageRoutes.post("/send-message/:orderId", verifyToken, addMessage);
messageRoutes.post("/add-attachment/:orderId", verifyToken, uploadDocument.single("attachment"), addAttachment);
messageRoutes.get("/get-messages/:orderId", verifyToken, getMessages);
messageRoutes.get("/unread-messages", verifyToken, getUnreadMessages);
messageRoutes.put("/mark-as-read/:messageId", verifyToken, markAsRead);
