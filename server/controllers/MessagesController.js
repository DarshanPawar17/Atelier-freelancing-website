import prisma from "../prisma/client.js";

const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);

export const addMessage = async (req, res, next) => {
  try {
    if (!req.body.receiverId || !req.body.message || !req.params.orderId) {
      return res
        .status(400)
        .send("userId, receiverId, orderId and message is required.");
    }

    if (!isValidObjectId(req.params.orderId)) {
      return res.status(400).send("Invalid OrderId.");
    }

    if (!isValidObjectId(req.body.receiverId)) {
      return res.status(400).send("Invalid receiverId.");
    }

    const order = await prisma.order.findUnique({
      where: { id: req.params.orderId },
      include: { gig: true },
    });

    if (!order) {
      return res.status(404).send("Order not found.");
    }

    const isParticipant =
      order.buyerId === req.userId || order.gig?.userId === req.userId;
    if (!isParticipant) {
      return res
        .status(403)
        .send("You are not allowed to message on this order.");
    }

    const message = await prisma.messages.create({
      data: {
        sender: {
          connect: { id: req.userId },
        },
        receiver: {
          connect: { id: req.body.receiverId },
        },
        order: {
          connect: { id: req.params.orderId },
        },
        text: req.body.message,
      },
    });

    return res.status(201).json({ message });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const addAttachment = async (req, res, next) => {
  try {
    if (!req.body.receiverId || !req.params.orderId) {
      return res.status(400).send("receiverId and orderId are required.");
    }
    if (!req.file) {
      return res.status(400).send("No file attached.");
    }
    if (!isValidObjectId(req.params.orderId) || !isValidObjectId(req.body.receiverId)) {
      return res.status(400).send("Invalid orderId or receiverId.");
    }

    const order = await prisma.order.findUnique({
      where: { id: req.params.orderId },
      include: { gig: true },
    });
    if (!order) return res.status(404).send("Order not found.");

    const isParticipant = order.buyerId === req.userId || order.gig?.userId === req.userId;
    if (!isParticipant) return res.status(403).send("Not allowed to message on this order.");

    const message = await prisma.messages.create({
      data: {
        sender: { connect: { id: req.userId } },
        receiver: { connect: { id: req.body.receiverId } },
        order: { connect: { id: req.params.orderId } },
        text: req.body.message || "Sent an attachment",
        fileUrl: req.file.path,
        fileName: req.file.originalname,
        fileSize: req.file.size,
      },
    });

    return res.status(201).json({ message });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const getMessages = async (req, res, next) => {
  try {
    if (!req.params.orderId || !req.userId) {
      return res.status(400).send("Order id is required.");
    }

    if (!isValidObjectId(req.params.orderId)) {
      return res.status(400).send("Invalid OrderId.");
    }

    const order = await prisma.order.findUnique({
      where: { id: req.params.orderId },
      include: { gig: true },
    });

    if (!order) {
      return res.status(404).send("Order not found.");
    }

    if (order.buyerId !== req.userId && order.gig?.userId !== req.userId) {
      return res
        .status(403)
        .send("You are not allowed to read these messages.");
    }

    const messages = await prisma.messages.findMany({
      where: {
        orderId: req.params.orderId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    await prisma.messages.updateMany({
      where: {
        orderId: req.params.orderId,
        receiverId: req.userId,
      },
      data: {
        isRead: true,
      },
    });

    const receiverId =
      order.buyerId === req.userId ? order.gig?.userId : order.buyerId;

    return res.status(200).json({ messages, receiverId, order });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const getUnreadMessages = async (req, res, next) => {
  try {
    if (req.userId) {
      const messages = await prisma.messages.findMany({
        where: {
          receiverId: req.userId,
          isRead: false,
        },
        include: {
          sender: true,
        },
      });
      return res.status(200).json({ messages });
    }
    return res.status(400).send("User id is required.");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    if (req.userId && req.params.messageId) {
      if (!isValidObjectId(req.params.messageId)) {
        return res.status(400).send("Invalid message Id.");
      }

      const { count } = await prisma.messages.updateMany({
        where: {
          id: req.params.messageId,
          receiverId: req.userId,
        },
        data: { isRead: true },
      });

      if (count === 0) {
        return res.status(404).send("Message not found.");
      }

      return res.status(200).send("Message mark as read.");
    }
    return res.status(400).send("User id and message Id is required.");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};
