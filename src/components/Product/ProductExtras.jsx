const ProductExtras = ({ keywords }) => {
  const normalizedKeywords = keywords.map((k) => k.toLowerCase());
  const isClothing = [
    "socks",
    "tshirts",
    "shirts",
    "pants",
    "apparel",
    "hoodies",
    "sweaters",
    "shoes",
    "running shoes",
    "footwear",
    "robe",
    "swimsuit",
    "shorts",
    "hats",
    "straw hats",
    "hooded",
    "beanies",
    "toques",
    "winter hats",
  ].some((keyword) => normalizedKeywords.includes(keyword));

  const isAppliance = [
    "appliances",
    "fridge",
    "oven",
    "microwave",
    "toaster",
    "water boiler",
    "coffeemakers",
    "food blenders",
    "Cookware",
  ].some((keyword) => normalizedKeywords.includes(keyword));

  return (
    <section>
      {isClothing && (
        <a
          href="/icons/clothing-size-chart.png"
          target="_blank"
          rel="noopener noreferrer"
        >
          Size chart
        </a>
      )}

      {isAppliance && (
        <div className="link-primary">
          <a
            href="/icons/appliance-instructions.png"
            target="_blank"
            rel="noopener noreferrer"
          >
            Appliance Manual
          </a>
          {" | "}
          <a
            href="/icons/appliance-warranty.png"
            target="_blank"
            rel="noopener noreferrer"
          >
            Warranty Info
          </a>
        </div>
      )}
    </section>
  );
};

export default ProductExtras;
