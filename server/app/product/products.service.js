require("./product.model");
const Category = require("mongoose").model("Category");
const Product = require("mongoose").model("Product");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

exports.fetchProducts = async (req, res) => {
  console.log("products.service.fetchProducts called...");

  console.log("product.service.getProducts called...");
  const options = req.query.options;
  console.log("product.service.options", options);

  const productCountPipeline = [];

  const aggregatePipeline = buildAggregatePipeline(
    JSON.parse(options),
    productCountPipeline
  );

  try {
    const products = await Product.aggregate(aggregatePipeline);
    console.log("products", products);
    const productCount = await getProductCount(productCountPipeline);
    console.log("productCount", productCount);
    res.status(200).json({ products, productCount });
  } catch (error) {
    console.error(error);
    res.status(500).send("Problem getting products.");
  }
};

const buildAggregatePipeline = (options, productCountPipeline) => {
  let { categories, clearance, sizes, ratings, priceRanges, sortOption, color, pageNo, pageSize } =
    options;

  let aggregatePipeline = [];

  if (categories?.length) {
    let categoriesMatch = buildCategoriesMatch(categories);
    aggregatePipeline.push(categoriesMatch);
    productCountPipeline.push(categoriesMatch);
  }

  if (clearance) {
    let clearanceMatch = buildClearanceMatch(clearance);
    aggregatePipeline.push(clearanceMatch);
    productCountPipeline.push(clearanceMatch);
  }

  if (sortOption) {
    let sortMatch = buildSortMatch(sortOption);
    aggregatePipeline.push(sortMatch);
    productCountPipeline.push(sortMatch);
  }

  if (color) {
    let colorMatch = buildColorMatch(color);
    aggregatePipeline.push(colorMatch);
    productCountPipeline.push(colorMatch);
  }

  if (sizes.length) {
    let sizeMatch = buildSizeMatch(sizes);
    aggregatePipeline.push(sizeMatch);
    productCountPipeline.push(sizeMatch);
  }

  if (ratings.length) {
    let ratingMatch = buildratingMatch(ratings);
    aggregatePipeline.push(ratingMatch);
    productCountPipeline.push(ratingMatch);
  }

  if (priceRanges.length) {
    let priceRangeMatch = buildPriceRangeMatch(priceRanges);
    aggregatePipeline.push(priceRangeMatch);
    productCountPipeline.push(priceRangeMatch);
  }

  aggregatePipeline.push(buildPageNumberFilter(pageNo, pageSize));
  aggregatePipeline.push(buildPageSizeFilter(pageSize));

  // checkForEmptyAggregate(aggregatePipeline);
  // resolveReferences(aggregatePipeline);

  console.log("aggregatePipeline", JSON.stringify(aggregatePipeline));
  return aggregatePipeline;
};

const buildPriceRangeMatch = (priceRanges) => {
  if (priceRanges?.length) {
    let priceMatches = [];

    for (let priceRange of priceRanges) {
      priceMatches.push({
        $and: [
          { $gte: ["$price", priceRange.low] },
          { $lte: ["$price", priceRange.high] },
        ],
      });
    }

    return { $match: { $expr: { $or: priceMatches } } };
  }
};

const buildColorMatch = (color) => {
  return {
    $match: { color: color },
  };
};

const buildCategoriesMatch = (categories) => {
  let tmp = [];

  for (let category of categories) {
    tmp.push(mongoose.Types.ObjectId.createFromHexString(category));
  }

  categories = tmp;

  console.log("categories", categories);
  console.log("tmp", tmp);

  if (categories?.length) {
    return { $match: { category: { $in: categories } } };
  }
  return null;
};

const buildSizeMatch = (sizes) => {
  if (sizes?.length) {
    return { $match: { sizes: { $in: sizes } } };
  }
  return null;
};


const buildratingMatch = (ratings) => {
  if (ratings?.length) {
    return { $match: { rating: { $in: ratings } } };
  }
  return null;
};


const buildClearanceMatch = (clearance) => {
  return {
    $match: {
      clearance: clearance,
    },
  };
};

const buildPageSizeFilter = (pageSize) => {
  return { $limit: pageSize };
};

const buildPageNumberFilter = (pageNo, pageSize) => {
  let skip = (pageNo - 1) * pageSize;

  return { $skip: skip };
};

const getProductCount = async (productCountPipeline) => {
  let productCount;
  productCountPipeline.push({ $count: "productCount" });

  productCount = await Product.aggregate(productCountPipeline);

  if (productCount.length) {
    return productCount[0].productCount;
  }

  return 0;
};
