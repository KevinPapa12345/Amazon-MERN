import CartItem from "../models/CartItem.js";
import Product from "../models/Product.js";

export const getCart = async (req, res) => {
  try {
    const items = await CartItem.find({ user: req.user.id }).populate(
      "product"
    );

    const validItems = items.filter((item) => {
      const product = item.product;
      return product && product.stock >= item.quantity;
    });

    res.status(200).json(validItems);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

export const addToCart = async (req, res) => {
  const { productId, quantity, deliveryOptionId } = req.body;
  const userId = req.user.id;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product no longer exists" });
    }

    let item = await CartItem.findOne({ user: userId, product: productId });

    const currentQuantityInCart = item ? item.quantity : 0;
    const totalQuantityRequested = currentQuantityInCart + quantity;

    if (totalQuantityRequested > product.stock) {
      return res.status(400).json({
        message: `Only ${
          product.stock - currentQuantityInCart
        } more left in stock.`,
      });
    }

    if (item) {
      item.quantity = totalQuantityRequested;
    } else {
      item = new CartItem({
        user: userId,
        product: productId,
        quantity,
        deliveryOptionId: deliveryOptionId || "1",
      });
    }

    await item.save();
    await item.populate("product");

    res.status(200).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update cart" });
  }
};

export const updateQuantity = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (quantity <= 0) {
    await CartItem.findOneAndDelete({ user: req.user.id, product: productId });
    return res.status(200).json({ message: "Item removed from cart" });
  }

  try {
    const item = await CartItem.findOne({
      user: req.user.id,
      product: productId,
    });

    if (!item) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    item.quantity = quantity;
    await item.save();
    await item.populate("product");

    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: "Failed to update quantity" });
  }
};

export const updateDeliveryOption = async (req, res) => {
  const { productId } = req.params;
  const { deliveryOptionId } = req.body;

  try {
    const item = await CartItem.findOne({
      user: req.user.id,
      product: productId,
    });

    if (!item) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    item.deliveryOptionId = deliveryOptionId;
    await item.save();
    await item.populate("product");

    res.status(200).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update delivery option" });
  }
};

export const removeFromCart = async (req, res) => {
  const { productId } = req.params;

  try {
    await CartItem.findOneAndDelete({ user: req.user.id, product: productId });
    res.status(200).json({ message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove item" });
  }
};

export const clearCart = async (req, res) => {
  try {
    await CartItem.deleteMany({ user: req.user.id });
    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear cart" });
  }
};
