const SkeletonProduct = () => {
  return (
    <article className="product-container">
      <div className="skeleton skeleton-image" />
      <div className="skeleton skeleton-name" />
      <div className="skeleton skeleton-rating" />
      <div className="skeleton skeleton-price" />
      <section className="product-quantity-container">
        <div className="skeleton skeleton-quantity" />
      </section>
      <div className="skeleton skeleton-button" />
    </article>
  );
};

export default SkeletonProduct;
