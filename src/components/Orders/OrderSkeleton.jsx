const OrderSkeleton = () => {
  return (
    <article className="order-skeleton">
      <div className="skeleton-header">
        <div className="skeleton-section">
          <div className="skeleton-label skeleton-box short"></div>
          <div className="skeleton-box medium"></div>
        </div>
        <div className="skeleton-section">
          <div className="skeleton-label skeleton-box short"></div>
          <div className="skeleton-box medium"></div>
        </div>
        <div className="skeleton-section order-id">
          <div className="skeleton-label skeleton-box short"></div>
          <div className="skeleton-box long"></div>
        </div>
      </div>

      <div className="skeleton-item">
        <div className="skeleton-image"></div>
        <div className="skeleton-details">
          <div className="skeleton-box long"></div>
          <div className="skeleton-box medium"></div>
          <div className="skeleton-box short"></div>
          <div className="skeleton-button"></div>
        </div>
      </div>

      <div className="skeleton-item">
        <div className="skeleton-image"></div>
        <div className="skeleton-details">
          <div className="skeleton-box long"></div>
          <div className="skeleton-box medium"></div>
          <div className="skeleton-box short"></div>
          <div className="skeleton-button"></div>
        </div>
      </div>
    </article>
  );
};

export default OrderSkeleton;
