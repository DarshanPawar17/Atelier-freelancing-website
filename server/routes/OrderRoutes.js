import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import {
  acceptIndividualTask,
  confirmOrder,
  createOrder,
  getBuyerOrders,
  getSellerOrders,
  deliverOrder,
  completeOrder,
} from "../controllers/OrderController.js";

export const orderRoutes = Router();

orderRoutes.post("/create", verifyToken, createOrder);
orderRoutes.post("/accept-task", verifyToken, acceptIndividualTask);
orderRoutes.put("/success", verifyToken, confirmOrder);
orderRoutes.get("/get-buyer-orders", verifyToken, getBuyerOrders);
orderRoutes.get("/get-seller-orders", verifyToken, getSellerOrders);
orderRoutes.post("/deliver", verifyToken, deliverOrder);
orderRoutes.post("/complete", verifyToken, completeOrder);
