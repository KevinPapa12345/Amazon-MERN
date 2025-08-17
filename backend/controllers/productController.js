import Product from "../models/Product.js";
import Review from "../models/Review.js";
import { recalculateProductRating } from "../utility/recalculateRating.js";
import cloudinary from "../config/cloudinary.js";
import { deleteCloudinaryFolder } from "../utility/cloudinaryUtils.js";

export const getProducts = async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;
  const minPrice = Number(req.query.minPrice);
  const maxPrice = Number(req.query.maxPrice);

  const { type, brand, sort } = req.query;

  let sortOption = {};

  if (sort === "newest") sortOption = { createdAt: -1, _id: -1 };
  else if (sort === "oldest") sortOption = { createdAt: 1, _id: 1 };
  else if (sort === "ratingHighToLow")
    sortOption = { "rating.stars": -1, _id: -1 };
  else if (sort === "ratingLowToHigh")
    sortOption = { "rating.stars": 1, _id: 1 };

  const filter = {
    priceCents: { $gte: minPrice, $lte: maxPrice },
  };

  if (type) {
    filter.type = {
      $in: Array.isArray(type) ? type : [type],
    };
  }

  if (brand) {
    filter.brand = {
      $in: Array.isArray(brand) ? brand : [brand],
    };
  }

  try {
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sortOption);

    res.json({
      products,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { page, limit, includeReviews } = req.query;
    const skip = (page - 1) * limit;

    let query = Product.findById(req.params.id).populate({
      path: "userId",
      select: "username",
    });

    if (includeReviews === "true") {
      query = query.populate({
        path: "reviews",
        options: {
          skip: parseInt(skip),
          limit: parseInt(limit),
          sort: { createdAt: -1 },
        },
        populate: {
          path: "userId",
          select: "username",
        },
      });
    }

    const product = await query;

    if (!product) return res.status(404).json({ message: "Product not found" });

    let totalReviews = 0;
    if (includeReviews === "true") {
      totalReviews = await Review.countDocuments({ product: product._id });
    }

    res.json({
      product,
      ...(includeReviews === "true" && {
        reviewsPage: parseInt(page),
        reviewsTotalPages: Math.ceil(totalReviews / limit),
      }),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page, limit, search, sort } = req.query;
    const skip = (page - 1) * limit;

    const filter = { userId };
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    let sortStage = { createdAt: -1 };
    if (sort === "oldest") sortStage = { createdAt: 1 };
    else if (sort === "priceLow") sortStage = { priceCents: 1 };
    else if (sort === "priceHigh") sortStage = { priceCents: -1 };

    const products = await Product.find(filter)
      .sort(sortStage)
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const totalProducts = await Product.countDocuments(filter);

    res.status(200).json({
      products,
      page: parseInt(page),
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, priceCents, description, type, brand, keywords, stock } =
      req.body;

    if (!name || !priceCents) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newProduct = new Product({
      name,
      priceCents,
      stock,
      userId: req.user.id,
      description,
      type,
      brand,
      keywords,
      rating: { stars: 0, count: 0 },
      status: "pending",
    });

    await newProduct.save();
    res.status(201).json({ message: "Product created", product: newProduct });
  } catch (error) {
    console.error("Product creation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });

    if (product.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updates = req.body;
    if (!updates.type) updates.type = "Unspecified";
    if (!updates.brand) updates.brand = "Unspecified";

    Object.assign(product, updates);
    await product.save();

    res.status(200).json({ message: "Product updated", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const uploadProductImages = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    if (product.images.length + req.files.length > 10) {
      return res
        .status(400)
        .json({ message: "You can only upload up to 10 images per product" });
    }

    const newFiles = req.files;
    const uploadResults = newFiles.map((file) => ({
      url: file.path,
      publicId: file.filename,
      originalName: file.originalname,
      size: file.size,
    }));

    product.images.push(...uploadResults);
    product.status = "active";

    await product.save();
    res.status(200).json({
      message: `Images uploaded (added ${newFiles.length})`,
      images: product.images,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const moveImageBetweenArrays = async (req, res) => {
  try {
    const productId = req.params.id;
    const { fromArray, toArray, publicId } = req.body;

    if (!fromArray || !toArray || !publicId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product[toArray].length >= 10) {
      return res
        .status(400)
        .json({ message: `${toArray} can only have up to 10 images` });
    }

    const index = product[fromArray].findIndex(
      (img) => img.publicId === publicId
    );
    if (index === -1)
      return res
        .status(404)
        .json({ message: "Image not found in source array" });

    const [imageObj] = product[fromArray].splice(index, 1);
    product[toArray].push(imageObj);

    await product.save();

    res.status(200).json({
      message: `Image moved from ${fromArray} to ${toArray}`,
      product,
    });
  } catch (error) {
    console.error("Error moving image between arrays:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProductImageOrder = async (req, res) => {
  try {
    const productId = req.params.id;
    const { order, arrayName } = req.body;

    if (!arrayName || !order || !Array.isArray(order)) {
      return res
        .status(400)
        .json({ message: "Missing or invalid arrayName or order" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const originalArray = product[arrayName];
    const newOrderArray = [];

    order.forEach((publicId) => {
      const found = originalArray.find((img) => img.publicId === publicId);
      if (found) newOrderArray.push(found);
    });

    product[arrayName] = newOrderArray;
    await product.save();

    res.status(200).json({ message: "Image order updated", product });
  } catch (error) {
    console.error("Failed to update image order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const folderPath = `products/${userId}/${productId}`;

    await deleteCloudinaryFolder(folderPath);

    await product.deleteOne();
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteProductImage = async (req, res) => {
  try {
    const { id, arrayName, publicId } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Not found" });

    if (product.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await cloudinary.uploader.destroy(publicId);

    if (!product[arrayName]) {
      return res
        .status(400)
        .json({ message: `Image array ${arrayName} not found` });
    }

    product[arrayName] = product[arrayName].filter(
      (img) => img.publicId !== publicId
    );

    if (arrayName === "images" && product.images.length === 0) {
      const variantArrays = [
        { array: product.variant1Images, key: "variant1Images" },
        { array: product.variant2Images, key: "variant2Images" },
        { array: product.variant3Images, key: "variant3Images" },
      ];

      const variantWithImage = variantArrays.find((v) => v.array?.length > 0);

      if (variantWithImage) {
        const fallback = variantWithImage.array.shift();
        product.images.push(fallback);
      } else {
        product.status = "pending";
      }
    }

    await product.save();

    res.status(200).json({ message: "Image deleted", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const addProductReview = async (req, res) => {
  const { text, rating } = req.body;
  const { id } = req.params;

  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!text) {
    return res.status(400).json({ error: "Review text is required" });
  }

  try {
    const review = await Review.create({
      userId: req.user.id,
      text,
      rating,
      product: id,
    });

    await recalculateProductRating(id);

    res.status(201).json(review);
  } catch (err) {
    console.error("Failed to add review:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteReview = async (req, res) => {
  const { reviewId } = req.params;

  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  try {
    const review = await Review.findById(reviewId);

    if (!review) return res.status(404).json({ error: "Review not found" });

    if (review.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You can only delete your own reviews" });
    }

    await review.deleteOne();
    await recalculateProductRating(review.product);

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("Failed to delete review:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const editReview = async (req, res) => {
  const { text, rating } = req.body;
  const review = await Review.findById(req.params.reviewId);

  if (!review) return res.status(404).json({ message: "Review not found" });

  if (review.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  review.rating = rating;
  review.text = text;

  await review.save();
  await recalculateProductRating(review.product);

  res.json({ message: "Review updated", review });
};

export const searchProducts = async (req, res) => {
  const { query, type, brand, sort } = req.query;
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const minPrice = Number(req.query.minPrice);
  const maxPrice = Number(req.query.maxPrice);

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    let sortOption = {};

    if (sort === "newest") sortOption = { createdAt: -1, _id: -1 };
    else if (sort === "oldest") sortOption = { createdAt: 1, _id: 1 };
    else if (sort === "ratingHighToLow")
      sortOption = { "rating.stars": -1, _id: -1 };
    else if (sort === "ratingLowToHigh")
      sortOption = { "rating.stars": 1, _id: 1 };

    const searchFilter = {
      $and: [
        { priceCents: { $gte: minPrice, $lte: maxPrice } },
        {
          $or: [
            { name: { $regex: query, $options: "i" } },
            { keywords: { $elemMatch: { $regex: query, $options: "i" } } },
            { type: { $regex: query, $options: "i" } },
          ],
        },
      ],
    };

    if (type) {
      searchFilter.$and.push({
        type: {
          $in: Array.isArray(type) ? type : [type],
        },
      });
    }

    if (brand) {
      searchFilter.$and.push({
        brand: {
          $in: Array.isArray(brand) ? brand : [brand],
        },
      });
    }

    const skip = (page - 1) * limit;
    const total = await Product.countDocuments(searchFilter);
    const products = await Product.find(searchFilter)
      .skip(skip)
      .limit(limit)
      .sort(sortOption);

    res.status(200).json({
      products,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Search failed:", err);
    res.status(500).json({ error: "Search failed" });
  }
};
