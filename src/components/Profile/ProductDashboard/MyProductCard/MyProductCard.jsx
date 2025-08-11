import { useState } from "react";
import formatCurrency from "../../../../utilities/Money";
import DraggableImageArray from "./DraggableImageArray";
import API from "../../../../services/api";

const MyProductCard = ({
  product,
  setProductId,
  setFormData,
  loadProducts,
  handleCancelEdit,
  modalRef,
  setMyProducts,
}) => {
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);
  const [isMovingImage, setIsMovingImage] = useState(false);
  const [showVariants, setShowVariants] = useState(false);

  const handleEdit = async () => {
    try {
      const res = await API.get(`/products/${product._id}`);
      const fullProduct = res.data;

      setFormData({
        name: fullProduct.name,
        priceCents: fullProduct.priceCents,
        stock: fullProduct.stock,
        description: fullProduct.description,
        type: fullProduct.type,
        brand: fullProduct.brand,
        keywords: fullProduct.keywords?.join(", ") || "",
      });

      setProductId(fullProduct._id);
      modalRef.current.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
        alert("This product no longer exists.");
      }
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    setIsDeletingProduct(true);

    try {
      await API.delete(`/products/${product._id}`);
      handleCancelEdit();
    } catch (err) {
      if (err.response?.status === 404) {
        alert("This product was already deleted.");
      } else {
        alert("Failed to delete product.");
        console.error("Failed to delete product", err);
      }
    }
    await loadProducts();
    setIsDeletingProduct(false);
  };

  const handleMoveImage = async (
    fromArray,
    toArray,
    publicId,
    reorderedArray = null
  ) => {
    if (isMovingImage) return;
    if (fromArray === toArray && !reorderedArray) return;

    setIsMovingImage(true);
    try {
      let updatedProduct;
      if (fromArray === toArray) {
        const res = await API.put(`/products/${product._id}/imagesOrder`, {
          arrayName: toArray,
          order: reorderedArray.map((img) => img.publicId),
        });
        updatedProduct = res.data.product;
      } else {
        const res = await API.post(`/products/${product._id}/move-image`, {
          fromArray,
          toArray,
          publicId,
        });
        updatedProduct = res.data.product;
      }
      if (!updatedProduct) {
        const res = await API.get(`/products/${product._id}`);
        updatedProduct = res.data;
      }
      setMyProducts((prev) =>
        prev.map((p) => (p._id === product._id ? updatedProduct : p))
      );
    } catch (err) {
      console.error("Failed to move/reorder image:", err);
    } finally {
      setIsMovingImage(false);
    }
  };

  return (
    <div className={`my-product-card ${isDeletingProduct ? "loading" : ""}`}>
      {isDeletingProduct ? (
        <div className="product-skeleton">Deleting...</div>
      ) : (
        <>
          <h3 className="my-product-name">{product.name}</h3>
          <DraggableImageArray
            arrayName="images"
            images={product.images || []}
            product={product}
            onMoveImage={handleMoveImage}
            setMyProducts={setMyProducts}
            disabled={isMovingImage}
          />

          <div className="variant-images-container">
            {showVariants && (
              <>
                <DraggableImageArray
                  arrayName="variant1Images"
                  images={product.variant1Images || []}
                  product={product}
                  onMoveImage={handleMoveImage}
                  setMyProducts={setMyProducts}
                  disabled={isMovingImage}
                />

                <DraggableImageArray
                  arrayName="variant2Images"
                  images={product.variant2Images || []}
                  product={product}
                  onMoveImage={handleMoveImage}
                  setMyProducts={setMyProducts}
                  disabled={isMovingImage}
                />

                <DraggableImageArray
                  arrayName="variant3Images"
                  images={product.variant3Images || []}
                  product={product}
                  onMoveImage={handleMoveImage}
                  setMyProducts={setMyProducts}
                  disabled={isMovingImage}
                />
              </>
            )}
          </div>
          <button
            onClick={() => setShowVariants((prev) => !prev)}
            className="toggle-variants-btn"
          >
            {showVariants ? "Hide Variant Images" : "Show Variant Images"}
          </button>
          <div className="my-product-info">
            <p className="my-product-price">
              ${Number(formatCurrency(product.priceCents))}
            </p>
            <p className="my-product-price">Stock: {product.stock}</p>
            <p className="my-product-type">Type: {product.type}</p>
            <p className="my-product-type">Brand: {product.brand}</p>
            <p className="my-product-desc">{product.description}</p>
            <p className="my-product-keywords">
              Keywords: {product.keywords?.join(", ")}
            </p>

            <div className="my-product-actions">
              <button onClick={() => handleEdit()} className="edit-btn">
                Edit
              </button>
              <button onClick={() => handleDelete()} className="delete-btn">
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyProductCard;
