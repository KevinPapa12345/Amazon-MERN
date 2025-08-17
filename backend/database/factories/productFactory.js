import { faker } from "@faker-js/faker";
import User from "../../models/User.js";
import Product from "../../models/Product.js";
import Review from "../../models/Review.js";

export const createProduct = async () => {
  const username = "Amazon";
  const user = await User.findOne({ username });
  if (!user) throw new Error(`User with username '${username}' not found`);

  const product = new Product({
    name: faker.commerce.productName(),
    images: [
      {
        url: `https://picsum.photos/seed/${faker.string.uuid()}/250/250`,
        publicId: faker.string.uuid(),
        originalName: faker.system.fileName(),
        size: faker.number.int({ min: 5000, max: 5000000 }),
      },
    ],
    variant1Images: [],
    variant2Images: [],
    variant3Images: [],
    priceCents: faker.number.int({ min: 100, max: 50000 }),
    stock: faker.number.int({ min: 0, max: 1000 }),
    rating: { stars: 0, count: 0 },
    userId: user._id,
    description: faker.commerce.productDescription(),
    type: faker.commerce.department(),
    brand: faker.company.name(),
    keywords: faker.lorem.words(5).split(" "),
    status: "active",
    seeded: true,
  });

  const savedProduct = await product.save();

  const reviewCount = faker.number.int({ min: 0, max: 20 });
  const reviews = [];

  for (let i = 0; i < reviewCount; i++) {
    const [reviewer] = await User.aggregate([{ $sample: { size: 1 } }]);
    if (!reviewer) continue;

    const review = new Review({
      userId: reviewer._id,
      product: savedProduct._id,
      text: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
      rating: faker.helpers.arrayElement([0, 1, 2, 3, 4, 5]),
    });

    await review.save();
    reviews.push(review);
  }

  if (reviews.length > 0) {
    const totalStars = reviews.reduce((sum, r) => sum + r.rating, 0);
    savedProduct.rating.stars =
      Math.floor((totalStars / reviews.length) * 2) / 2;
    savedProduct.rating.count = reviews.length;
    await savedProduct.save();
  }

  return savedProduct;
};

export const seedProducts = async (count = 5) => {
  const products = [];
  for (let i = 0; i < count; i++) {
    products.push(await createProduct());
  }
  return products;
};
