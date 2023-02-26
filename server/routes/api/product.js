const express = require('express');
const router = express.Router();
const multer = require('multer');
const AWS = require('aws-sdk');
const Mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

// Bring in Models & Helpers
const Product = require('../../models/product');
const Marketing = require("../../models/Marketing");
const Brand = require("../../models/brand");
const Type = require("../../models/Type");
const Category = require("../../models/category");
const Wishlist = require("../../models/wishlist");
const auth = require("../../middleware/auth");
const role = require("../../middleware/role");
const checkAuth = require("../../helpers/auth");

const storage = multer.memoryStorage();
const upload = multer({ storage });

//Getting one
// router.get("/item/:id", getProductById, async (req, res) => {
//   console.log(req.product)
//   res.send(req.product);
// });
router.get("/item/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;

    const productDoc = await Product.findOne({ slug, status: true });
    // .populate(
    //   {
    //     path: 'brand',
    //     select: 'name isActive slug'
    //   }
    // );

    // if (!productDoc || (productDoc && productDoc?.brand?.isActive === false)) {
    if (!productDoc || (productDoc && productDoc?.type?.status === false)) {
      return res.status(404).json({
        message: "No product found.",
      });
    }

    const marketings = await Marketing.find({ status: true }).sort({
      createdAt: -1,
    });
    let productAfterDiscount = getProductAfterDiscount(productDoc, marketings);
    let product = getProductWithInventory(
      productAfterDiscount._doc
        ? productAfterDiscount._doc
        : productAfterDiscount
    );
    res.status(200).json({
      product: product,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});
// fetch product slug api
// router.get('/item/:slug', async (req, res) => {
//   try {
//     const slug = req.params.slug;

//     const productDoc = await Product.findOne({ slug, isActive: true }).populate(
//       {
//         path: 'brand',
//         select: 'name isActive slug'
//       }
//     );

//     if (!productDoc || (productDoc && productDoc?.brand?.isActive === false)) {
//       return res.status(404).json({
//         message: 'No product found.'
//       });
//     }

//     res.status(200).json({
//       product: productDoc
//     });
//   } catch (error) {
//     res.status(400).json({
//       error: 'Your request could not be processed. Please try again.'
//     });
//   }
// });

// fetch  product name search api
router.get("/list/search/:name", async (req, res) => {
  try {
    const name = req.params.name;

    const productDoc = await Product.find({
      name: { $regex: new RegExp(name), $options: "is" },
      status: true,
    });

    if (productDoc.length < 0) {
      return res.status(404).json({
        message: "No product found.",
      });
    }
    const marketings = await Marketing.find({ status: true }).sort({
      createdAt: -1,
    });
    let productList = [];
    for (let item of productDoc) {
      let productAfterDiscount = getProductAfterDiscount(item, marketings);
      productList.push(getProductWithInventory(productAfterDiscount));
    }

    let a = productList && productList.length ? productList : productDoc;
    res.status(200).json({
      products: a,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});
//edit hxd
router.post("/list", async (req, res) => {
  try {
    let {
      sortOrder,
      rating,
      max,
      min,
      category,
      pageNumber: page = 1,
    } = req.body;
    const pageSize = 8;
    const categoryFilter = category ? { category } : {};
    const categoryDoc = await Type.findOne({
      slug: categoryFilter.category,
      status: true,
    });
    const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
    const basicQuery = [
      // {
      //   $match: {
      //     'type.status': true
      //   }
      // },
      {
        $match: {
          status: true,
          // price: priceFilter.price
        },
      },
    ];
    if (categoryDoc && categoryFilter !== category) {
      basicQuery.push({
        $match: {
          status: true,
          // type: {
          //   // $in: Array.from(categoryDoc._id)
          //   $eq: categoryDoc._id
          // }
          type: categoryDoc._id,
        },
      });
    }
    // productsCount = await Product.aggregate(basicQuery);
    //   const paginateQuery = [
    //     { $sort: sortOrder },
    //     { $skip: pageSize * (productsCount.length > 8 ? page - 1 : 0) },
    //     { $limit: pageSize }
    //   ];
    const products = await Product.aggregate(basicQuery);

    const productsCount = products.length;
    const marketings = await Marketing.find({ status: true }).sort({
      createdAt: -1,
    });
    let productList = [];
    for (let item of products) {
      let productAfterDiscount = getProductAfterDiscount(item, marketings);
      productList.push(getProductWithInventory(productAfterDiscount));
    }
    let a = productList && productList.length ? productList : products;
    res.status(200).json({
      products: a,
      page,
      pages: productsCount.length > 0 ? Math.ceil(productsCount / pageSize) : 0,
      totalProducts: productsCount,
    });
    // res.status(200).json({
    //   products
    // });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again. edit hxd",
    });
  }
});
// fetch store products by advancedFilters api
router.post("/list", async (req, res) => {
  try {
    let {
      sortOrder,
      rating,
      max,
      min,
      category,
      pageNumber: page = 1,
    } = req.body;

    const pageSize = 8;
    const categoryFilter = category ? { category } : {};
    const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
    const ratingFilter = rating
      ? { rating: { $gte: rating } }
      : { rating: { $gte: rating } };

    const basicQuery = [
      // {
      //   $lookup: {
      //     from: 'brands',
      //     localField: 'brand',
      //     foreignField: '_id',
      //     as: 'brands'
      //   }
      // },
      // {
      //   $unwind: {
      //     path: '$brands',
      //     preserveNullAndEmptyArrays: true
      //   }
      // },
      // {
      //   $addFields: {
      //     'brand.name': '$brands.name',
      //     'brand._id': '$brands._id',
      //     'brand.isActive': '$brands.isActive'
      //   }
      // },
      // {
      //   $match: {
      //     'brand.isActive': true
      //   }
      // },
      // {
      //   $lookup: {
      //     from: 'reviews',
      //     localField: '_id',
      //     foreignField: 'product',
      //     as: 'reviews'
      //   }
      // },
      // {
      //   $addFields: {
      //     totalRatings: { $sum: '$reviews.rating' },
      //     totalReviews: { $size: '$reviews' }
      //   }
      // },
      // {
      //   $addFields: {
      //     averageRating: {
      //       $cond: [
      //         { $eq: ['$totalReviews', 0] },
      //         0,
      //         { $divide: ['$totalRatings', '$totalReviews'] }
      //       ]
      //     }
      //   }
      // },
      {
        $match: {
          isActive: true,
          price: priceFilter.price,
          // averageRating: ratingFilter.rating
        },
      },
      // {
      //   $project: {
      //     brands: 0,
      //     reviews: 0
      //   }
      // }
    ];

    const userDoc = await checkAuth(req);
    const categoryDoc = await Category.findOne(
      { slug: categoryFilter.category, isActive: true },
      "products -_id"
    );

    if (categoryDoc && categoryFilter !== category) {
      basicQuery.push({
        $match: {
          isActive: true,
          _id: {
            $in: Array.from(categoryDoc.products),
          },
        },
      });
    }

    let products = null;
    let productsCount = 0;

    const marketings = await Marketing.find({ status: true }).sort({
      createdAt: -1,
    });
    let productList = [];

    // if (productList.length > 0) {
    //   res.status(200).json(productList);
    // } else {
    //   res.json(product);
    // }

    if (userDoc) {
      productsCount = await Product.aggregate(
        [
          {
            $lookup: {
              from: "wishlists",
              let: { product: "$_id" },
              pipeline: [
                {
                  $match: {
                    $and: [
                      { $expr: { $eq: ["$$product", "$product"] } },
                      { user: new Mongoose.Types.ObjectId(userDoc.id) },
                    ],
                  },
                },
              ],
              as: "isLiked",
            },
          },
          {
            $addFields: {
              isLiked: { $arrayElemAt: ["$isLiked.isLiked", 0] },
            },
          },
        ].concat(basicQuery)
      );
      const paginateQuery = [
        { $sort: sortOrder },
        { $skip: pageSize * (productsCount.length > 8 ? page - 1 : 0) },
        { $limit: pageSize },
      ];
      products = await Product.aggregate(
        [
          {
            $lookup: {
              from: "wishlists",
              let: { product: "$_id" },
              pipeline: [
                {
                  $match: {
                    $and: [
                      { $expr: { $eq: ["$$product", "$product"] } },
                      { user: new Mongoose.Types.ObjectId(userDoc.id) },
                    ],
                  },
                },
              ],
              as: "isLiked",
            },
          },
          {
            $addFields: {
              isLiked: { $arrayElemAt: ["$isLiked.isLiked", 0] },
            },
          },
        ]
          .concat(basicQuery)
          .concat(paginateQuery)
      );
      // for (let item of products) {
      //   productList.push(getProductAfterDiscount(item, marketings));
      // }
    } else {
      productsCount = await Product.aggregate(basicQuery);
      const paginateQuery = [
        { $sort: sortOrder },
        { $skip: pageSize * (productsCount.length > 8 ? page - 1 : 0) },
        { $limit: pageSize },
      ];
      products = await Product.aggregate(basicQuery.concat(paginateQuery));

      // for (let item of products) {
      //   productList.push(getProductAfterDiscount(item, marketings));
      // }
    }
    // let list = productList && productList.length ? productList : products;
    res.status(200).json({
      products: products,
      page,
      pages:
        productsCount.length > 0
          ? Math.ceil(productsCount.length / pageSize)
          : 0,
      totalProducts: productsCount.length,
    });
  } catch (error) {
    res.status(400).json({
      error:
        "Your request could not be processed. Please try again. fetch store products by advancedFilters api",
    });
  }
});

// fetch store products by brand api
router.get("/list/brand/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;

    const brand = await Brand.findOne({ slug, isActive: true });

    if (!brand) {
      return res.status(404).json({
        message: `Cannot find brand with the slug: ${slug}.`,
      });
    }

    const userDoc = await checkAuth(req);

    if (userDoc) {
      const products = await Product.aggregate([
        {
          $match: {
            isActive: true,
            brand: brand._id,
          },
        },
        {
          $lookup: {
            from: "wishlists",
            let: { product: "$_id" },
            pipeline: [
              {
                $match: {
                  $and: [
                    { $expr: { $eq: ["$$product", "$product"] } },
                    { user: new Mongoose.Types.ObjectId(userDoc.id) },
                  ],
                },
              },
            ],
            as: "isLiked",
          },
        },
        {
          $lookup: {
            from: "brands",
            localField: "brand",
            foreignField: "_id",
            as: "brands",
          },
        },
        {
          $addFields: {
            isLiked: { $arrayElemAt: ["$isLiked.isLiked", 0] },
          },
        },
        {
          $unwind: "$brands",
        },
        {
          $addFields: {
            "brand.name": "$brands.name",
            "brand._id": "$brands._id",
            "brand.isActive": "$brands.isActive",
          },
        },
        { $project: { brands: 0 } },
      ]);

      res.status(200).json({
        products: products.reverse().slice(0, 8),
        page: 1,
        pages: products.length > 0 ? Math.ceil(products.length / 8) : 0,
        totalProducts: products.length,
      });
    } else {
      const products = await Product.find({
        brand: brand._id,
        isActive: true,
      }).populate("brand", "name");

      res.status(200).json({
        products: products.reverse().slice(0, 8),
        page: 1,
        pages: products.length > 0 ? Math.ceil(products.length / 8) : 0,
        totalProducts: products.length,
      });
    }
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

router.get("/list/select", async (req, res) => {
  try {
    const products = await Type.find();

    res.status(200).json({
      products,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

// add product api
router.post(
  "/add",
  auth,
  role.checkRole(role.ROLES.Admin, role.ROLES.Merchant),
  upload.single("image"),
  async (req, res) => {
    try {
      const sku = req.body.sku;
      const name = req.body.name;
      const description = req.body.description;
      const quantity = req.body.quantity;
      const price = req.body.price;
      const taxable = req.body.taxable;
      const isActive = req.body.isActive;
      const brand = req.body.brand;
      const image = req.file;

      if (!sku) {
        return res.status(400).json({ error: "You must enter sku." });
      }

      if (!description || !name) {
        return res
          .status(400)
          .json({ error: "You must enter description & name." });
      }

      if (!quantity) {
        return res.status(400).json({ error: "You must enter a quantity." });
      }

      if (!price) {
        return res.status(400).json({ error: "You must enter a price." });
      }

      const foundProduct = await Product.findOne({ sku });

      if (foundProduct) {
        return res.status(400).json({ error: "This sku is already in use." });
      }

      let imageUrl = "";
      let imageKey = "";

      if (image) {
        const s3bucket = new AWS.S3({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_REGION,
        });

        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: image.originalname,
          Body: image.buffer,
          ContentType: image.mimetype,
          ACL: "public-read",
        };

        const s3Upload = await s3bucket.upload(params).promise();

        imageUrl = s3Upload.Location;
        imageKey = s3Upload.key;
      }

      const product = new Product({
        sku,
        name,
        description,
        quantity,
        price,
        taxable,
        isActive,
        brand,
        imageUrl,
        imageKey,
      });

      const savedProduct = await product.save();

      res.status(200).json({
        success: true,
        message: `Product has been added successfully!`,
        product: savedProduct,
      });
    } catch (error) {
      return res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
  }
);

// fetch products api
router.get(
  "/",
  auth,
  role.checkRole(role.ROLES.Admin, role.ROLES.Merchant),
  async (req, res) => {
    try {
      let products = [];

      if (req.user.merchant) {
        const brands = await Brand.find({
          merchant: req.user.merchant,
        }).populate("merchant", "_id");

        const brandId = brands[0]["_id"];

        products = await Product.find({})
          .populate({
            path: "brand",
            populate: {
              path: "merchant",
              model: "Merchant",
            },
          })
          .where("brand", brandId);
      } else {
        products = await Product.find({}).populate({
          path: "brand",
          populate: {
            path: "merchant",
            model: "Merchant",
          },
        });
      }

      res.status(200).json({
        products,
      });
    } catch (error) {
      res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
  }
);

// fetch product api
router.get(
  "/:id",
  auth,
  role.checkRole(role.ROLES.Admin, role.ROLES.Merchant),
  async (req, res) => {
    try {
      const productId = req.params.id;

      let productDoc = null;

      if (req.user.merchant) {
        const brands = await Brand.find({
          merchant: req.user.merchant,
        }).populate("merchant", "_id");

        const brandId = brands[0]["_id"];

        productDoc = await Product.findOne({ _id: productId })
          .populate({
            path: "brand",
            select: "name",
          })
          .where("brand", brandId);
      } else {
        productDoc = await Product.findOne({ _id: productId }).populate({
          path: "brand",
          select: "name",
        });
      }

      if (!productDoc) {
        return res.status(404).json({
          message: "No product found.",
        });
      }

      res.status(200).json({
        product: productDoc,
      });
    } catch (error) {
      res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
  }
);

router.put(
  "/:id",
  auth,
  role.checkRole(role.ROLES.Admin, role.ROLES.Merchant),
  async (req, res) => {
    try {
      const productId = req.params.id;
      const update = req.body.product;
      const query = { _id: productId };

      await Product.findOneAndUpdate(query, update, {
        new: true,
      });

      res.status(200).json({
        success: true,
        message: "Product has been updated successfully!",
      });
    } catch (error) {
      res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
  }
);

router.put(
  "/:id/active",
  auth,
  role.checkRole(role.ROLES.Admin, role.ROLES.Merchant),
  async (req, res) => {
    try {
      const productId = req.params.id;
      const update = req.body.product;
      const query = { _id: productId };

      await Product.findOneAndUpdate(query, update, {
        new: true,
      });

      res.status(200).json({
        success: true,
        message: "Product has been updated successfully!",
      });
    } catch (error) {
      res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
  }
);

router.delete(
  "/delete/:id",
  auth,
  role.checkRole(role.ROLES.Admin, role.ROLES.Merchant),
  async (req, res) => {
    try {
      const product = await Product.deleteOne({ _id: req.params.id });

      res.status(200).json({
        success: true,
        message: `Product has been deleted successfully!`,
        product,
      });
    } catch (error) {
      res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
    }
  }
);
async function getProductById(req, res, next) {
  let product;
  try {
    product = await (
      await Product.findById(req.params.id)
    ).populate("type", "name");
    if (product == null) {
      return res.status(404).json({ message: "Can not find product" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  try {
    type = await (await Type.findById(product.type)).populate("type", "name");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  product.type = type;
  req.product = product;

  next();
}
function getProductWithInventory(item) {
  console.log("getProductWithInventory", item);
  let quantity = 0;
  if (!item.inventory.length) {
    quantity = 0;
  } else {
    item?.inventory?.forEach((i) => {
      i?.imports?.forEach((j) => {
        quantity += j.quantity;
      });
    });
  }
  return {
    ...item,
    quantity: quantity,
  };
}
// function return product after discount in marketing
function getProductAfterDiscount(item, marketings) {
  let today = new Date().getTime();
  if (marketings.length > 0) {
    let priceAfterDiscount = item.price;
    for (let marketing of marketings) {
      let isValid = false;
      item = getProductWithDateRemain(item, new Date());
      let condition = marketing.condition;
      let condition_value = marketing.condition_value;
      if (condition === "ALL") {
        let startDay = marketing.dateFrom
          ? new Date(marketing.dateFrom).getTime()
          : null;
        let endDay = marketing.dateTo
          ? new Date(marketing.dateTo).getTime()
          : null;
        isValid =
          startDay &&
          today > startDay &&
          (!endDay || (endDay && today < endDay));
        // if (!isValid) {
        //   return item;
        // }
      } else if (condition === "DATE") {
        item.remain.map((remain) => {
          if (remain.quantity > 0 && condition_value >= remain.dateRemain) {
            isValid = true;
          }
        });
      } else if (condition === "QTY_GREATER") {
        let totalQuantity = 0;
        console.log("QTY_GREATER item", item);
        item?.remain?.map((remain) => {
          if (remain.quantity > 0) {
            totalQuantity += remain.quantity;
          }
        });
        if (totalQuantity >= condition_value) {
          isValid = true;
        }
      } else if (condition === "QTY_LESS") {
        let totalQuantity = 0;
        item.remain.map((remain) => {
          if (remain.quantity > 0) {
            totalQuantity += remain.quantity;
          }
        });
        if (totalQuantity < condition_value) {
          isValid = true;
        }
      }
      if (!isValid) {
        return item;
      }
      if (marketing.apply === "ALL") {
        if (marketing.discount_type === "PERCENT") {
          priceAfterDiscount =
            item.price - (item.price * marketing.value) / 100;
        } else if (marketing.discount_type === "FIX_AMOUNT") {
          priceAfterDiscount = item.price - marketing.value;
        } else if (marketing.discount_type === "FLAT") {
          if (item.price > marketing.value) {
            priceAfterDiscount = marketing.value;
          }
        }
        item.date_from = marketing.dateFrom;
        item.date_to = marketing.dateTo;
        item.flash_sale = marketing.isFlashSale;
        item.final_price = priceAfterDiscount;
        return item;
      } else if (marketing.apply === "TYPE") {
        // check condition if
        if (
          marketing.apply_type.toString().indexOf(item.type._id.toString()) >= 0
        ) {
          if (marketing.discount_type === "PERCENT") {
            priceAfterDiscount =
              item.price - (item.price * marketing.value) / 100;
          } else if (marketing.discount_type === "FIX_AMOUNT") {
            priceAfterDiscount = item.price - marketing.value;
          } else if (marketing.discount_type === "FLAT") {
            if (item.price > marketing.value) {
              priceAfterDiscount = marketing.value;
            }
          }
          item.date_from = marketing.dateFrom;
          item.date_to = marketing.dateTo;
          item.flash_sale = marketing.isFlashSale;
          item.final_price = priceAfterDiscount;
          return item;
        }
      } else if (marketing.apply === "PRODUCT") {
        if (
          marketing.apply_product.toString().indexOf(item._id.toString()) >= 0
        ) {
          if (marketing.discount_type === "PERCENT") {
            priceAfterDiscount =
              item.price - (item.price * marketing.value) / 100;
          } else if (marketing.discount_type === "FIX_AMOUNT") {
            priceAfterDiscount = item.price - marketing.value;
          } else if (marketing.discount_type === "FLAT") {
            if (item.price > marketing.value) {
              priceAfterDiscount = marketing.value;
            }
          }
          item.date_from = marketing.dateFrom;
          item.date_to = marketing.dateTo;
          item.flash_sale = marketing.isFlashSale;
          item.final_price = priceAfterDiscount;
          return item;
        }
      }
    }
  }
  return item;
}

function getProductInventoryWithLocator(item, locatorId) {
  let quantity = 0;
  if (!item.inventory.length) {
    quantity = 0;
  } else {
    item?.inventory?.forEach((i) => {
      if (i.locator == locatorId) {
        i.imports?.forEach((j) => {
          quantity += j.quantity;
        });
      }
    });
  }
  return {
    ...item,
    quantity: quantity,
  };
}

function getProductWithDateRemain(item, date) {
  let remain = [];
  date = new Date(new Date(date).setHours(0, 0, 0));
  if (item.inventory.length) {
    item?.inventory?.forEach((i) => {
      i?.imports?.forEach((j) => {
        if (j.quantity > 0) {
          let date_expiration = new Date(
            new Date(j.date_expiration).setHours(0, 0, 0)
          );
          let dateRemain = Number.parseInt(
            (date_expiration.getTime() - date.getTime()) / (24 * 60 * 60 * 1000)
          );
          remain.push({
            date: j.date_expiration,
            dateRemain: dateRemain,
            quantity: j.quantity,
          });
        }
      });
    });
  }
  let i = item._doc ? item._doc : item;
  return {
    ...i,
    remain: remain,
  };
}

async function checkAvailableInventoryLocatorWithCart(locatorId, cartId) {
  let checkAvailable = true;
  let cart = await Cart.findById(cartId).populate({
    path: "products.product",
  });
  for (let cartItem of cart.products) {
    let product = cartItem.product;
    let quantity = cartItem.quantity;
    let quantityInventory = getProductInventoryWithLocator(
      product,
      locatorId
    ).quantity;
    if (quantity > quantityInventory) {
      checkAvailable = false;
      return false;
    }
  }
  return checkAvailable;
}
module.exports = router;
