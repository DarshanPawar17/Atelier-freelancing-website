import prisma from "../prisma/client.js";
import SearchService from "../services/SearchService.js";
import { cloudinary, CLOUDINARY_FOLDER } from "../config/cloudinary.config.js";
import { apiLog } from "../utils/logger.js";

const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);

export const addGig = async (req, res, next) => {
  try {
    if (req.files?.length > 0) {
      // Extract Cloudinary URLs from uploaded files
      const imageUrls = req.files.map((file) => file.path);

      // Support metadata from both body (standard) and query (legacy fallback)
      const inputData = { ...req.body, ...req.query };
      
      const {
        title,
        description,
        category,
        features,
        price,
        revisions,
        time,
        shortDesc,
      } = inputData;

      if (!title || !category || !price) {
        return res.status(400).send("Core architectural properties are missing.");
      }

      // Convert features to array if it's arriving as a string (legacy/params fallback)
      const processedFeatures = Array.isArray(features) ? features : 
                                 (typeof features === "string" ? [features] : []);

      await prisma.gig.create({
        data: {
          title,
          description,
          deliveryTime: parseInt(time),
          category,
          features: processedFeatures,
          price: parseInt(price),
          shortDesc,
          revisions: parseInt(revisions),
          createdBy: { connect: { id: req.userId } },
          images: imageUrls,
          isOrdered: false, // Explicitly initialize availability
        },
      });

      return res.status(201).send("Successfuly initialized the project.");
    }
    return res.status(400).send("Visual assets are required for portfolio initialization.");
  } catch (err) {
    console.error("Gig Creation Error:", err);
    return res.status(500).send("Internal Architectural Synchronization Error.");
  }
};

export const getAllUserGigs = async (req, res, next) => {
  try {
    if (req.userId) {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        include: { gigs: true },
      });
      return res.status(200).json({ gigs: user?.gigs ?? [] });
    }
    return res.status(400).send("UserId should be required.");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error.");
  }
};

export const getGigById = async (req, res, next) => {
  try {
    if (req.params.gigId) {
      if (!isValidObjectId(req.params.gigId)) {
        return res.status(400).send("Invalid GigId.");
      }

      const gig = await prisma.gig.findUnique({
        where: { id: req.params.gigId },
        include: {
          createdBy: true,
          reviews: {
            include: { reviewer: true },
          },
        },
      });

      if (!gig) {
        return res.status(404).send("Gig not found.");
      }

      if (!gig.createdBy?.id) {
        return res.status(404).send("Gig owner not found.");
      }

      const userWithGigs = await prisma.user.findUnique({
        where: { id: gig.createdBy.id },
        include: { gigs: { include: { reviews: true } } },
      });

      const gigs = userWithGigs?.gigs || [];
      const totalReviews = gigs.reduce(
        (acc, gig) => acc + (gig.reviews?.length || 0),
        0,
      );

      const averageRating =
        totalReviews > 0
          ? (
              gigs.reduce(
                (acc, gig) =>
                  acc +
                  gig.reviews.reduce((sum, review) => sum + review.rating, 0),
                0,
              ) / totalReviews
            ).toFixed(1)
          : "N/A";

      return res
        .status(200)
        .json({ gig: { ...gig, totalReviews, averageRating } });
    }
    return res.status(400).send("GigId is required.");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error.");
  }
};

export const updateGig = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.gigId)) {
      return res.status(400).send("Invalid GigId.");
    }

    if (req.files?.length > 0) {
      const imageUrls = req.files.map((file) => file.path);
      
      const inputData = { ...req.body, ...req.query };
      const {
        title,
        description,
        category,
        features,
        price,
        revisions,
        time,
        shortDesc,
      } = inputData;

      const oldData = await prisma.gig.findUnique({
        where: { id: req.params.gigId },
      });

      if (!oldData) {
        return res.status(404).send("Gig not found.");
      }

      if (oldData.userId !== req.userId) {
        return res.status(403).send("You can only edit your own gig.");
      }

      // Delete old images from Cloudinary
      if (oldData?.images?.length > 0) {
        for (const imageUrl of oldData.images) {
          const publicId = imageUrl.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(
            `${CLOUDINARY_FOLDER}/${publicId}`,
          );
        }
      }

      const processedFeatures = Array.isArray(features) ? features : 
                                 (typeof features === "string" ? [features] : []);

      await prisma.gig.update({
        where: { id: req.params.gigId },
        data: {
          title,
          description,
          deliveryTime: parseInt(time),
          category,
          features: processedFeatures,
          price: parseInt(price),
          shortDesc,
          revisions: parseInt(revisions),
          createdBy: { connect: { id: req.userId } },
          images: imageUrls,
        },
      });

      return res.status(200).send("Successfuly updated the gig.");
    }
    return res.status(400).send("Visual assets are required for portfolio update.");
  } catch (err) {
    console.error("Gig Update Error:", err);
    return res.status(500).send("Internal Architectural Synchronization Error.");
  }
};

export const searchGigs = async (req, res, next) => {
  try {
    if (req.query.searchTerm || req.query.category) {
      const searchTerm = req.query.searchTerm || "";
      const category = req.query.category || "";

      apiLog(`🔍 Search request: "${searchTerm}" | Category: "${category}"`);

      // Modify the SearchService filter results to only include isOrdered: false
      const allGigs = await SearchService.fuzzySearch(searchTerm, category);
      const availableGigs = allGigs.filter(gig => !gig.isOrdered);

      apiLog(`✅ Returning ${availableGigs.length} available results`);

      return res.status(200).json({ gigs: availableGigs });
    }
    return res.status(400).send("SearchTerm or Category is required.");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error.");
  }
};

const checkOrder = async (userId, gigId) => {
  try {
    const hasUserOrderedGig = await prisma.order.findFirst({
      where: {
        buyerId: userId,
        gigId: gigId,
        isCompleted: true,
      },
    });
    return hasUserOrderedGig;
  } catch (err) {
    console.log(err);
  }
};

export const checkGigOrder = async (req, res, next) => {
  try {
    if (req.userId && req.params.gigId) {
      if (!isValidObjectId(req.params.gigId)) {
        return res.status(400).send("Invalid GigId.");
      }

      const hasUserOrderedGig = await checkOrder(req.userId, req.params.gigId);
      return res
        .status(200)
        .json({ hasUserOrderedGig: hasUserOrderedGig ? true : false });
    }
    return res.status(400).send("userId and gigId is required.");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const addReview = async (req, res, next) => {
  try {
    if (req.userId && req.params.gigId) {
      if (!isValidObjectId(req.params.gigId)) {
        return res.status(400).send("Invalid GigId.");
      }

      const gig = await prisma.gig.findUnique({
        where: { id: req.params.gigId },
      });

      if (!gig) {
        return res.status(404).send("Gig not found.");
      }

      if (await checkOrder(req.userId, req.params.gigId)) {
        if (req.body.reviewText && req.body.rating) {
          const newReview = await prisma.reviews.create({
            data: {
              rating: parseInt(req.body.rating),
              comment: req.body.reviewText,
              reviewer: { connect: { id: req.userId } },
              gig: { connect: { id: req.params.gigId } },
            },
            include: {
              reviewer: true,
            },
          });

          return res.status(201).json({ newReview });
        }

        return res.status(400).send("ReviewText and Rating is required.");
      }
      return res.status(400).send("You have not ordered this gig.");
    }
    return res.status(400).send("UserId and GigId are required.");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};
