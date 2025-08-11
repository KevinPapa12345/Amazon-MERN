import {
  getThumbnailImage,
  IMAGE_ARRAYS,
} from "../../../utilities/ImageUtilities";

const ThumbnailGrid = ({ product, activeImageArray, onThumbnailClick }) => {
  return (
    <div className="thumbnail-grid">
      {IMAGE_ARRAYS.map((arrayName) => {
        const thumbnailImage = getThumbnailImage(product, arrayName);
        const isActive = activeImageArray === arrayName;
        const hasImages = thumbnailImage !== null;

        return (
          <div
            key={arrayName}
            className={`thumbnail ${isActive ? "active" : ""} ${
              !hasImages ? "placeholder" : ""
            }`}
            onClick={() => hasImages && onThumbnailClick(arrayName)}
          >
            {hasImages ? (
              <img
                src={thumbnailImage.url}
                alt={`${product.name} ${arrayName} thumbnail`}
              />
            ) : (
              <img src="/icons/no-image-icon.png" alt="No images available" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ThumbnailGrid;
