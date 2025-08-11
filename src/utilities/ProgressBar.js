import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

export function calculateProgressBar(orderTime, deliveryTime) {
  const today = dayjs();
  orderTime = dayjs(orderTime);
  deliveryTime = dayjs(deliveryTime);

  const progressBar = ((today - orderTime) / (deliveryTime - orderTime)) * 100;
  return progressBar;
}
