export const deliveryOptions = [
  {
    id: "1",
    deliveryDays: 7,
    priceCents: 0,
  },
  {
    id: "2",
    deliveryDays: 3,
    priceCents: 499,
  },
  {
    id: "3",
    deliveryDays: 1,
    priceCents: 999,
  },
];

export const getTotalPrice = (cartItems) => {
  return cartItems.reduce(
    (sum, item) => sum + item.product.priceCents * item.quantity,
    0
  );
};

export const getTotalShipping = (cartItems) => {
  return cartItems.reduce((sum, item) => {
    const option = deliveryOptions.find((d) => d.id === item.deliveryOptionId);
    return sum + option.priceCents;
  }, 0);
};
