import ImagePreview from "./ImagePreview";
import dragInfoStore from "../../../../data/dragInfoStore";
import { useState } from "react";

const DraggableImageArray = ({
  arrayName,
  images,
  product,
  onMoveImage,
  setMyProducts,
  disabled,
}) => {
  const [deletingImagePublicId, setDeletingImagePublicId] = useState(null);

  const onDragStart = (index) => {
    if (disabled) return;
    dragInfoStore.current = {
      fromArray: arrayName,
      fromIndex: index,
      image: images[index],
      productId: product._id,
    };
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (toIndex, e) => {
    e.preventDefault();
    e.stopPropagation();
    const { fromArray, fromIndex, image, productId } = dragInfoStore.current;
    if (!image || fromArray === null) return;

    if (String(productId) !== String(product._id)) {
      alert("Cannot move images between different products.");
      dragInfoStore.current = {
        fromArray: null,
        fromIndex: null,
        image: null,
        productId: null,
      };
      return;
    }

    if (fromArray === arrayName) {
      if (toIndex === images.length && fromIndex === images.length - 1) return;
      if (fromIndex === toIndex) return;

      const newImages = [...images];
      newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, image);

      onMoveImage?.(fromArray, arrayName, image.publicId, newImages);
    } else {
      if (images.length >= 10) {
        alert("This variant already has 10 images.");
        return;
      }
      onMoveImage?.(fromArray, arrayName, image.publicId);
    }
    dragInfoStore.current = {
      fromArray: null,
      fromIndex: null,
      image: null,
      productId: null,
    };
  };
  return (
    <div
      className={`image-array ${arrayName}`}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(images.length, e)}
    >
      <div className="image-list">
        {images.map((img, index) => (
          <div
            key={img.publicId}
            draggable
            onDragStart={() => onDragStart(index)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(index, e)}
            style={{ cursor: disabled ? "default" : "grab" }}
          >
            <ImagePreview
              key={img.publicId}
              img={img}
              product={product}
              setMyProducts={setMyProducts}
              arrayName={arrayName}
              isDeleting={deletingImagePublicId === img.publicId}
              isAnyDeleting={Boolean(deletingImagePublicId)}
              setDeletingImagePublicId={setDeletingImagePublicId}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DraggableImageArray;
