import dayjs from "dayjs";

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

export function getDeliveryOption(deliveryOptionId) {
  let deliveryOption;

  deliveryOptions.forEach((option) => {
    if (option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });

  return deliveryOption || deliveryOptions[0];
}

function isWeekend(date) {
  const dayOfWeek = date.format("dddd");
  return dayOfWeek === "Saturday" || dayOfWeek === "Sunday";
}

export function calculateDeliveryDate(deliveryOption) {
  let today = dayjs();
  let daysToAdd = deliveryOption.deliveryDays;

  while (daysToAdd) {
    today = today.add(1, "day");

    if (!isWeekend(today)) {
      daysToAdd -= 1;
    }
  }

  const dateString = today.format("YYYY-MM-DD");

  return dateString;
}

export function formatDate(date) {
  let parsedDate = dayjs(date);

  const dateString = parsedDate.format("dddd, MMMM  D");

  return dateString;
}

export function formatMonth(date) {
  let parsedDate = dayjs(date);

  const dateString = parsedDate.format("MMMM  D");

  return dateString;
}

export function formatYear(date) {
  let parsedDate = dayjs(date);

  const dateString = parsedDate.format("dddd, MMMM  D, YYYY");

  return dateString;
}
