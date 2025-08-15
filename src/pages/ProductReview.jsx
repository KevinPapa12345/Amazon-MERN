import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import API from "../services/api";
import { useUser } from "../context/UserContext";
import formatCurrency from "../utilities/Money";
import ProductRating from "../components/Product/ProductRating";
import "./productReview.css";
import { formatYear } from "../data/deliveryOptions";
import Error from "./Error";
import { useCart } from "../context/CartContext";
import AddedToCartNotice from "../components/Product/AddedToCartNotice";
import ThumbnailGrid from "../components/Product/ProductReview/ThumbnailGrid";
import {
  getCurrentImageArray,
  nextImage,
  prevImage,
} from "../utilities/ImageUtilities";

const ProductReview = () => {
  const { id } = useParams();
  const { user } = useUser();
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const timeoutIdRef = useRef(null);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [editingReview, setEditingReview] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [editedRating, setEditedRating] = useState(0);
  const [reloadProduct, setReloadProduct] = useState(false);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeImageArray, setActiveImageArray] = useState("images");
  const navigate = useNavigate();

  const startEditing = (review) => {
    setEditingReview(review._id);
    setEditedText(review.text);
    setEditedRating(review.rating);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
        setReviews(res.data.reviews || []);
        setActiveImageArray("images");
        setCurrentImageIndex(0);
      } catch (err) {
        console.error("Error loading product", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [reloadProduct]);

  const currentImageArray = getCurrentImageArray(product, activeImageArray);

  const nextImageHandler = () => {
    setCurrentImageIndex((prevIndex) =>
      nextImage(prevIndex, currentImageArray)
    );
  };

  const prevImageHandler = () => {
    setCurrentImageIndex((prevIndex) =>
      prevImage(prevIndex, currentImageArray)
    );
  };

  const handleThumbnailClick = (imageArrayName) => {
    setActiveImageArray(imageArrayName);
    setCurrentImageIndex(0);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/products/${id}/reviews`, {
        text: newReview,
        rating: newRating,
      });

      setNewReview("");
      setNewRating(5);
      setReloadProduct((prev) => !prev);
    } catch (err) {
      console.error("Failed to submit review", err);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await API.delete(`/products/reviews/${reviewId}`);

      setReloadProduct((prev) => !prev);
    } catch (err) {
      console.error("Failed to delete review", err);
    }
  };

  const handleEdit = async (reviewId) => {
    try {
      await API.put(`/products/reviews/${reviewId}`, {
        text: editedText,
        rating: editedRating,
      });
      setEditingReview(null);
      setReloadProduct((prev) => !prev);
    } catch (err) {
      console.error("Edit failed", err);
    }
  };

  const handleAddToCart = () => {
    if (!user.username) {
      navigate("/login_register");
      return;
    }
    addToCart(product._id);
    setIsAdded(true);

    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    timeoutIdRef.current = setTimeout(() => {
      setIsAdded(false);
      timeoutIdRef.current = null;
    }, 1000);
  };

  if (loading) return null;
  if (!product) return <Error />;

  return (
    <article className="product-review-page">
      <section className="product-details two-column">
        <div className="product-image-column">
          <div className="image-gallery">
            <div className="main-image-container">
              {currentImageArray.length > 1 && (
                <button
                  className="image-nav-btn prev-btn"
                  onClick={prevImageHandler}
                  aria-label="Previous image"
                >
                  ‹
                </button>
              )}
              {currentImageArray.length > 0 ? (
                <img
                  className="product-review-image main-image"
                  src={currentImageArray[currentImageIndex].url}
                  alt={`${product.name} ${activeImageArray} ${
                    currentImageIndex + 1
                  }`}
                />
              ) : (
                <img
                  className="product-review-image main-image"
                  src="/icons/no-image-icon.png"
                  alt="No product images"
                />
              )}

              {currentImageArray.length > 1 && (
                <button
                  className="image-nav-btn next-btn"
                  onClick={nextImageHandler}
                  aria-label="Next image"
                >
                  ›
                </button>
              )}
            </div>
            {currentImageArray.length > 1 && (
              <div className="image-counter">
                {currentImageIndex + 1} / {currentImageArray.length}
              </div>
            )}
            <ThumbnailGrid
              product={product}
              activeImageArray={activeImageArray}
              onThumbnailClick={handleThumbnailClick}
            />
          </div>
        </div>

        <div className="product-info-column">
          <h2>{product.name}</h2>
          <div className="product-seller-container">
            <small>
              Seller:
              <strong> {product.userId.username}</strong>
              <small>On Sale Since: {formatYear(product.createdAt)}</small>
            </small>
          </div>
          <ProductRating
            stars={product.rating.stars}
            count={product.rating.count}
            className="review-stars"
          />
          <p>
            Type: {product.type}
            <br />
            Brand: {product.brand}
          </p>
          <p>
            Price: ${formatCurrency(product.priceCents)}
            <br />
            <small>Stock-left: {product.stock}</small>
          </p>
          <p>{product.description}</p>
          {isAdded && <AddedToCartNotice />}
          <button
            className="add-to-cart-btn-review button-primary"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </section>

      <section className="reviews-section">
        <h3>Customer Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <>
            <label>Sort by Stars</label>
            <select
              className="review-sort-by-stars"
              value={selectedRatingFilter}
              onChange={(e) => setSelectedRatingFilter(e.target.value)}
            >
              <option value="">All Ratings</option>
              {Array.from({ length: 6 }, (_, i) => i)
                .reverse()
                .map((val) => (
                  <option key={val} value={val}>
                    {val} Stars
                  </option>
                ))}
            </select>
            {reviews
              .filter((review) =>
                selectedRatingFilter
                  ? review.rating === Number(selectedRatingFilter)
                  : true
              )
              .map((review, idx) => (
                <div key={idx} className="review">
                  <div className="review-header">
                    <div>
                      <p>
                        <small>{formatYear(review.createdAt)}</small>{" "}
                      </p>
                      <p>
                        <strong>{review.userId.username}</strong>{" "}
                      </p>
                    </div>
                    <div>
                      <ProductRating stars={review.rating} />
                      {user?.username === review.userId.username && (
                        <div className="review-buttons">
                          <button onClick={() => startEditing(review)}>
                            📝
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review._id)}
                          >
                            ❌
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {editingReview === review._id ? (
                    <div className="edit-review-form">
                      <textarea
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        maxLength={2000}
                        required
                      />
                      <select
                        value={editedRating}
                        onChange={(e) =>
                          setEditedRating(Number(e.target.value))
                        }
                        required
                      >
                        {Array.from({ length: 6 }, (_, i) => i)
                          .reverse()
                          .map((val) => (
                            <option key={val} value={val}>
                              {val}
                            </option>
                          ))}
                      </select>
                      <button onClick={() => handleEdit(review._id)}>
                        Save
                      </button>
                      <button onClick={() => setEditingReview(null)}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <p>{review.text}</p>
                  )}
                </div>
              ))}
          </>
        )}
      </section>

      {user.username && (
        <form onSubmit={handleReviewSubmit} className="review-form">
          <label>Star Rating</label>
          <select
            value={newRating}
            onChange={(e) => setNewRating(Number(e.target.value))}
            required
          >
            {Array.from({ length: 6 }, (_, i) => i)
              .reverse()
              .map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
          </select>
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Write your review..."
            maxLength={2000}
            required
          />
          <button type="submit">Submit Review</button>
        </form>
      )}
    </article>
  );
};

export default ProductReview;
