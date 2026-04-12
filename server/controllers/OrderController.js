import prisma from "../prisma/client.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);

export const createOrder = async (req, res, next) => {
  try {
    if (!req.body.gigId) {
      return res.status(400).send("GigId is required.");
    }

    if (!isValidObjectId(req.body.gigId)) {
      return res.status(400).send("Invalid GigId.");
    }

    const { gigId } = req.body;
    const gig = await prisma.gig.findUnique({
      where: { id: gigId },
    });

    if (!gig) {
      return res.status(404).send("Gig not found.");
    }

    if (gig.isOrdered) {
      return res.status(400).send("This architectural task has already been claimed.");
    }

    const amount = Math.round(Number(gig.price) * 100);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).send("Invalid gig price.");
    }

    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    const COMMISSION_RATE = 0.1; // 10% Platform Commission
    const earnings = Math.round(Number(gig.price) * (1 - COMMISSION_RATE));

    await prisma.order.create({
      data: {
        paymentIntent: razorpayOrder.id, // We store order ID as paymentIntent
        price: Math.round(Number(gig.price)),
        earnings: earnings,
        buyer: { connect: { id: req.userId } },
        gig: { connect: { id: gigId } },
      },
    });

    return res.status(201).json({ 
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency
    });
  } catch (err) {
    console.error("Order Creation Error:", err);
    return res.status(500).send("Internal Architectural Synchronization Error.");
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      return res.status(400).json({ status: "failure", message: "Invalid signature" });
    }

    // Capture the order details before update to trigger notifications
    const order = await prisma.order.findUnique({
      where: { paymentIntent: razorpay_order_id },
      include: { 
        gig: { include: { createdBy: true } },
        buyer: true 
      }
    });

    if (!order) {
      return res.status(404).send("Architectural order not found.");
    }

    // Perform the State Lock
    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: { isCompleted: true },
      }),
      prisma.gig.update({
        where: { id: order.gigId },
        data: { isOrdered: true },
      }),
      // Create an automated "Task Claimed" notification message
      prisma.messages.create({
        data: {
          text: `SYSTEM ARCHITECT: Portfolio item "${order.gig.title}" has been officially claimed by ${order.buyer?.username || "a buyer"}. Commission is now active.`,
          sender: { connect: { id: order.buyerId } },
          receiver: { connect: { id: order.gig.userId } },
          order: { connect: { id: order.id } },
        }
      })
    ]);

    return res.status(200).json({ status: "success", message: "Order confirmed and project locked.", orderId: order.id });
  } catch (err) {
    console.error("Order Verification Error:", err);
    return res.status(500).send("Internal Architectural Synchronization Error.");
  }
};

export const confirmOrder = async (req, res, next) => {
  try {
    if (!req.body.paymentIntent) {
      return res.status(400).send("paymentIntent is required.");
    }

    // Capture the order details before update to trigger notifications
    const order = await prisma.order.findUnique({
      where: { paymentIntent: req.body.paymentIntent },
      include: { 
        gig: { include: { createdBy: true } },
        buyer: true 
      }
    });

    if (!order) {
      return res.status(404).send("Architectural order not found.");
    }

    // Perform the State Lock: Mark order completed AND mark gig as ordered (First-Come, First-Served)
    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: { isCompleted: true },
      }),
      prisma.gig.update({
        where: { id: order.gigId },
        data: { isOrdered: true },
      }),
      // Create an automated "Task Claimed" notification message
      prisma.messages.create({
        data: {
          text: `SYSTEM ARCHITECT: Portfolio item "${order.gig.title}" has been officially claimed by ${order.buyer?.username || "a buyer"}. Commission is now active.`,
          sender: { connect: { id: order.buyerId } },
          receiver: { connect: { id: order.gig.userId } },
          order: { connect: { id: order.id } },
        }
      })
    ]);

    return res.status(200).send("Order confirmed and project locked.");
  } catch (err) {
    console.error("Order Confirmation Error:", err);
    return res.status(500).send("Internal Architectural Synchronization Error.");
  }
};

export const getBuyerOrders = async (req, res, next) => {
  try {
    if (req.userId) {
      const orders = await prisma.order.findMany({
        where: { buyerId: req.userId, isCompleted: true },
        include: {
          gig: true,
          gig: {
            include: {
              createdBy: true,
            },
          },
        },
      });
      return res.status(200).json({ orders });
    }
    return res.status(400).send("UserId is required.");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error.");
  }
};

export const getSellerOrders = async (req, res, next) => {
  try {
    if (req.userId) {
      const orders = await prisma.order.findMany({
        where: {
          gig: {
            createdBy: {
              id: req.userId,
            },
          },
          isCompleted: true,
        },
        include: {
          gig: true,
          buyer: true,
        },
      });
      return res.status(200).json({ orders });
    }
    return res.status(400).send("UserId is required.");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error.");
  }
};

export const acceptIndividualTask = async (req, res, next) => {
  try {
    if (!req.body.gigId) {
      return res.status(400).send("GigId is required.");
    }
    const { gigId } = req.body;

    const gig = await prisma.gig.findUnique({
      where: { id: gigId },
    });

    if (!gig) {
      return res.status(404).send("Task not found.");
    }

    if (gig.isOrdered) {
      return res.status(400).send("This architectural task has already been claimed.");
    }

    const COMMISSION_RATE = 0.1; // 10% Platform Commission
    const earnings = Math.round(Number(gig.price) * (1 - COMMISSION_RATE));

    // Direct creation of a COMPLETED order (Bypassing Stripe for current testing)
    const order = await prisma.order.create({
      data: {
        paymentIntent: `direct_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        price: Math.round(Number(gig.price)),
        earnings: earnings,
        isCompleted: true,
        buyer: { connect: { id: req.userId } },
        gig: { connect: { id: gigId } },
      },
      include: { 
        buyer: true 
      }
    });

    // State Lock: Update gig availability
    await prisma.gig.update({
      where: { id: gigId },
      data: { isOrdered: true },
    });

    // Initial project kickoff message
    await prisma.messages.create({
      data: {
        text: `SYSTEM ARCHITECT: Portfolio item "${gig.title}" has been commissioned by ${order.buyer?.username || "a new client"}. Commission is now active.`,
        sender: { connect: { id: req.userId } },
        receiver: { connect: { id: gig.userId } },
        order: { connect: { id: order.id } },
      },
    });

    return res.status(201).json({ orderId: order.id });
  } catch (err) {
    console.error("Direct Accept Error:", err);
    return res.status(500).send("Internal Architectural Assignment Error.");
  }
};

export const deliverOrder = async (req, res, next) => {
  try {
    const { orderId, deliveryNote } = req.body;
    let updateData = {
      status: "DELIVERED",
      deliveryNote,
    };

    if (req.file) {
      updateData.deliveryFileUrl = req.file.path;
      updateData.deliveryFileName = req.file.originalname;
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });
    
    let noteText = `SYSTEM ARCHITECT: Specialist has delivered the final brief. Note: "${deliveryNote}"`;
    if (req.file) noteText += ` [Received Secure Package: ${req.file.originalname}]`;

    // System message notification
    await prisma.messages.create({
      data: {
        text: noteText,
        sender: { connect: { id: req.userId } },
        receiver: { connect: { id: order.buyerId } },
        order: { connect: { id: order.id } },
      }
    });

    return res.status(200).send("Project successfully delivered for review.");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Fulfillment Error.");
  }
};

export const completeOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const prevOrder = await prisma.order.findUnique({ where: { id: orderId } });
    if (!prevOrder) return res.status(404).send("Order not found.");

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: "COMPLETED", isCompleted: true, earnings: prevOrder.price },
    });

    // System message notification
    await prisma.messages.create({
      data: {
        text: `SYSTEM ARCHITECT: Client has approved the deliverables. Project officially closed.`,
        sender: { connect: { id: req.userId } },
        receiver: { connect: { id: (await prisma.order.findUnique({ where: { id: orderId }, include: { gig: true } })).gig.userId } },
        order: { connect: { id: order.id } },
      }
    });

    return res.status(200).send("Project officially closed and approved.");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Closure Error.");
  }
};

export const toggleFeature = async (req, res, next) => {
  try {
    const { orderId, feature } = req.body;
    
    if (!orderId || !feature) {
      return res.status(400).send("OrderId and feature are required.");
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { gig: true },
    });

    if (!order) return res.status(404).send("Order not found.");

    if (order.gig.userId !== req.userId) {
      return res.status(403).send("Only the specialist can toggle deliverables.");
    }

    let updatedFeatures = [...order.completedFeatures];
    if (updatedFeatures.includes(feature)) {
      updatedFeatures = updatedFeatures.filter(f => f !== feature);
    } else {
      updatedFeatures.push(feature);
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { completedFeatures: updatedFeatures },
      include: { gig: true }
    });

    return res.status(200).json({ order: updatedOrder });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Toggle feature error.");
  }
};

