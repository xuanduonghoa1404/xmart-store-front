const express = require('express');
const router = express.Router();
const multer = require('multer');
const AWS = require('aws-sdk');
const Mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

// Bring in Models & Helpers
const Product = require('../../models/product');
const Marketing = require("../../models/marketing");
const Type = require("../../models/type");
const Cart = require("../../models/cart");
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

    if (!productDoc || (productDoc && productDoc?.type?.status === false)) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm",
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
      } else if (condition === "DATE") {
        item.remain.map((remain) => {
          if (remain.quantity > 0 && condition_value >= remain.dateRemain) {
            isValid = true;
          }
        });
      } else if (condition === "QTY_GREATER") {
        let totalQuantity = 0;
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
