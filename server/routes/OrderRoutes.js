import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { uploadDocument } from "../config/cloudinary.config.js";
import {
  acceptIndividualTask,
  confirmOrder,
  createOrder,
  verifyPayment,
  getBuyerOrders,
  getSellerOrders,
  deliverOrder,
  completeOrder,
  toggleFeature,
} from "../controllers/OrderController.js";

export const orderRoutes = Router();

orderRoutes.post("/create", verifyToken, createOrder);
orderRoutes.post("/verify", verifyToken, verifyPayment);
orderRoutes.post("/accept-task", verifyToken, acceptIndividualTask);
orderRoutes.put("/success", verifyToken, confirmOrder);
orderRoutes.put("/toggle-feature", verifyToken, toggleFeature);
orderRoutes.get("/get-buyer-orders", verifyToken, getBuyerOrders);
orderRoutes.get("/get-seller-orders", verifyToken, getSellerOrders);
orderRoutes.post("/deliver", verifyToken, uploadDocument.single("deliveryFile"), deliverOrder);
orderRoutes.post("/complete", verifyToken, completeOrder);
