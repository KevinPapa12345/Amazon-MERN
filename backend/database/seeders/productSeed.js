import Product from "../../models/Product.js";
import { seedProducts } from "../factories/productFactory.js";

const runProductSeeder = async () => {
  const action = process.argv[2];

  if (action === "add") {
    const products = await seedProducts(5);
    console.log(`Added ${products.length} new products`);
  } else if (action === "delete") {
    const result = await Product.deleteMany({ seeded: true });
    console.log(`Deleted ${result.deletedCount} seeded products`);
  } else {
    console.log("Please specify an action: 'add' or 'delete'");
  }
};

runProductSeeder();
