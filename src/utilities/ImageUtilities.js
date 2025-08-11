export const IMAGE_ARRAYS = [
  "images",
  "variant1Images",
  "variant2Images",
  "variant3Images",
];

export function getCurrentImageArray(product, activeImageArray) {
  if (!product) return [];
  return product[activeImageArray] || [];
}

export function nextImage(currentIndex, imageArray) {
  if (!imageArray || imageArray.length <= 1) return currentIndex;
  return currentIndex === imageArray.length - 1 ? 0 : currentIndex + 1;
}

export function prevImage(currentIndex, imageArray) {
  if (!imageArray || imageArray.length <= 1) return currentIndex;
  return currentIndex === 0 ? imageArray.length - 1 : currentIndex - 1;
}

export const getThumbnailImage = (product, arrayName) => {
  if (!product || !product[arrayName] || product[arrayName].length === 0) {
    return null;
  }
  return product[arrayName][0];
};
