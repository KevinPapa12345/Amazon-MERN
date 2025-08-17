import { useRef, useState } from "react";
import API from "../../../services/api";
import MyProductCard from "./MyProductCard/MyProductCard";
import ImageUploader from "./ImageUploader";
import fetchMyProducts from "../../../services/fetchMyProducts";
import capitalize from "../../../utilities/Capitalize";
import SearchPaginationControls from "../../UI/SearchPaginationControls";

const ProductDashboard = ({ modalRef }) => {
  const [isCreating, setIsCreating] = useState(true);
  const [productId, setProductId] = useState(null);
  const [myProducts, setMyProducts] = useState([]);
  const totalProducts = useRef(0);
  const [formData, setFormData] = useState({
    name: "",
    priceCents: 0,
    stock: 0,
    description: "",
    type: "",
    brand: "",
    keywords: "",
  });

  const loadProducts = async (pageNum, searchQuery, sortBy) => {
    const data = await fetchMyProducts(pageNum, 12, searchQuery, sortBy);
    setMyProducts(data.products || []);
    totalProducts.current = data.totalProducts || 0;
    return {
      totalPages: data.totalPages || 1,
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const keywordsArray = formData.keywords
      .split(",")
      .map((kw) => capitalize(kw.trim()))
      .filter((kw) => kw.length > 0)
      .slice(0, 10);
    const type = formData.type.trim() ? capitalize(formData.type) : undefined;
    const brand = formData.brand.trim()
      ? capitalize(formData.brand)
      : undefined;
    const formattedData = {
      ...formData,
      name: capitalize(formData.name),
      type,
      brand,
      keywords: keywordsArray,
    };
    try {
      if (productId) {
        await API.put(`/products/${productId}`, formattedData);
        alert("Product updated!");
        handleCancelEdit();
      } else {
        const res = await API.post("/products", formattedData);
        setProductId(res.data.product._id);
        alert("Product created! Now upload images.");
        setIsCreating(false);
        setFormData({
          name: "",
          priceCents: 0,
          stock: 0,
          description: "",
          type: "",
          brand: "",
          keywords: "",
        });
      }
      await loadProducts();
    } catch (err) {
      console.error("Error creating product.", err);
    }
  };

  const handleCancelEdit = () => {
    setIsCreating(true);
    setProductId(null);
    setFormData({
      name: "",
      priceCents: 0,
      stock: 0,
      description: "",
      type: "",
      brand: "",
      keywords: "",
    });
  };

  return (
    <>
      <article className="dashboard">
        {isCreating && (
          <>
            <h2>{productId ? "Edit Product" : "Add New Product"}</h2>

            <form onSubmit={handleSubmit}>
              <input
                name="name"
                value={formData.name}
                placeholder="Name"
                onChange={handleChange}
                maxLength={100}
                required
              />
              <input
                name="priceCents"
                value={formData.priceCents}
                type="number"
                min={1}
                placeholder="Price (in cents)"
                onChange={handleChange}
                required
              />
              <input
                name="stock"
                value={formData.stock}
                type="number"
                min={1}
                placeholder="Product Stock"
                onChange={handleChange}
                required
              />
              <textarea
                name="description"
                value={formData.description}
                placeholder="Description"
                onChange={handleChange}
                maxLength={2000}
                required
              />
              <input
                name="type"
                value={formData.type}
                placeholder="Product Type"
                onChange={handleChange}
                maxLength={50}
              />
              <input
                name="brand"
                value={formData.brand}
                placeholder="Product Brand"
                onChange={handleChange}
                maxLength={50}
              />
              <input
                name="keywords"
                value={formData.keywords}
                placeholder="Keywords (comma separated)"
                onChange={handleChange}
                maxLength={200}
              />
              <div className="dashboard-submit">
                <button
                  type="submit"
                  className="submit-product-btn update-create-btn"
                >
                  {productId ? "Update Product" : "Create Product"}
                </button>
                {productId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="submit-product-btn cancel-edit-btn"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </>
        )}
        {productId && (
          <ImageUploader
            productId={productId}
            myProducts={myProducts}
            setIsCreating={setIsCreating}
            loadProducts={loadProducts}
          />
        )}
      </article>
      <h2 className="my-products-title">
        {totalProducts.current} Product Results
      </h2>
      <SearchPaginationControls
        onFetchData={loadProducts}
        searchPlaceholder="Search products by name..."
      />
      {myProducts.length === 0 && (
        <p className="no-products">No products yet.</p>
      )}
      <article className="my-products-grid">
        {myProducts.map((product) => (
          <MyProductCard
            key={product._id}
            product={product}
            setProductId={setProductId}
            setMyProducts={setMyProducts}
            setFormData={setFormData}
            handleCancelEdit={handleCancelEdit}
            loadProducts={loadProducts}
            modalRef={modalRef}
          />
        ))}
      </article>
    </>
  );
};

export default ProductDashboard;
