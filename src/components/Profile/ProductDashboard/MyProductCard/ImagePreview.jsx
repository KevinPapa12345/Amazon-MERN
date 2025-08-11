import API from "../../../../services/api";

const ImagePreview = ({
  img,
  product,
  setMyProducts,
  arrayName,
  isDeleting,
  isAnyDeleting,
  setDeletingImagePublicId,
}) => {
  const handleDeleteImage = async (productId, publicId) => {
    try {
      setDeletingImagePublicId(publicId);
      const res = await API.delete(
        `/products/${productId}/images/${arrayName}/${encodeURIComponent(
          publicId
        )}`
      );
      setMyProducts((prev) =>
        prev.map((p) => (p._id === productId ? res.data.product : p))
      );
    } catch (err) {
      if (err.response?.status === 404) {
        alert("This image or product no longer exists.");
      } else {
        console.error("Failed to delete image", err);
        alert("Failed to delete image.");
      }
    } finally {
      setDeletingImagePublicId(null);
    }
  };

  return (
    <div className="img-wrapper">
      <img
        src={img.url}
        alt={product.name}
        className={`my-product-img ${isDeleting ? "faded" : ""}`}
      />
      {isDeleting && <div className="img-spinner" />}
      <button
        className="delete-img-btn"
        onClick={() => handleDeleteImage(product._id, img.publicId)}
        disabled={isAnyDeleting}
      >
        ✕
      </button>
    </div>
  );
};

export default ImagePreview;
