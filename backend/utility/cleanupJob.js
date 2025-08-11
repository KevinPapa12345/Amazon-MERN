import Product from "../models/Product.js";
import { deleteCloudinaryFolder } from "./cloudinaryUtils.js";

export const deleteStaleProducts = async () => {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

  const staleProducts = await Product.find({
    status: "pending",
    createdAt: { $lt: tenMinutesAgo },
  });

  if (staleProducts.length === 0) return;

  const deleteFolderTasks = staleProducts.map((product) => {
    const folderPath = `products/${product.userId}/${product._id}`;
    return deleteCloudinaryFolder(folderPath, { deleteResources: false });
  });

  await Promise.all(deleteFolderTasks);

  const result = await Product.deleteMany({
    status: "pending",
    createdAt: { $lt: tenMinutesAgo },
  });
  if (result.deletedCount > 0) {
    console.log(`Cleaned up ${result.deletedCount} stale products`);
  }
};
