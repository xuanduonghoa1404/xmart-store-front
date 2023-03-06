const express = require('express');
const router = express.Router();

// Bring in Models & Helpers
const Cart = require('../../models/cart');
const Product = require('../../models/product');
const auth = require('../../middleware/auth');
const store = require('../../helpers/store');
const Marketing = require("../../models/marketing");

router.post("/add", auth, async (req, res) => {
  try {
    const user = req.user._id;
    const items = req.body.products;

    const products = store.caculateItemsSales(items);

    const cart = new Cart({
      user,
      products,
    });

    const cartDoc = await cart.save();

    // decreaseQuantity(products);

    res.status(200).json({
      success: true,
      cartId: cartDoc.id,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

router.post("/update", async (req, res) => {
  try {
    const cart = req.body.cart;
    const cartItems = cart.cartItems;
    const itemsInCart = cart.itemsInCart;
    const cartTotal = cart.cartTotal;
    let newCart = {
      cartItems: [],
      itemsInCart: [],
      cartTotal: 0,
      cartId: null,
    };
    let newCartTotal = 0;
    if (
      !cartItems ||
      !itemsInCart ||
      cartItems.length === 0 ||
      itemsInCart.length === 0
    ) {
      res.status(400).json({
        error: "Your request could not be processed. Please try again.",
      });
      return;
    }

    let products = await Product.find({ status: true });
    const marketings = await Marketing.find({ status: true }).sort({
      createdAt: -1,
    });
    let storeProducts = [];
    for (let item of products) {
      let productAfterDiscount = getProductAfterDiscount(item, marketings);
      storeProducts.push(productAfterDiscount);
    }
    cartItems.map((item, index) => {
      let id = item._id;
      let itemId = storeProducts.findIndex(
        (product) => product._id.toString() == id.toString()
      );

      if (itemId !== -1) {
        let price =
          storeProducts[itemId].final_price || storeProducts[itemId].price;
        let totalPrice = item.quantity * price;

        newCart.cartItems.push({
          ...item,
          final_price: price,
          totalPrice: totalPrice,
        });
        newCartTotal += totalPrice;
      }
    });

    itemsInCart.map((item, index) => {
      let id = item._id;
      let itemId = storeProducts.findIndex(
        (product) => product._id.toString() === id
      );
      if (itemId !== -1) {
        let price =
          storeProducts[itemId].final_price || storeProducts[itemId].price;
        let quantity = item.quantity;
        newCart.itemsInCart.push({
          ...item,
          final_price: price,
          totalPrice: price * quantity,
        });
      }
    });
    newCart.cartTotal = newCartTotal;

    res.status(200).json({
      success: true,
      cart: newCart,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

router.delete("/delete/:cartId", auth, async (req, res) => {
  try {
    await Cart.deleteOne({ _id: req.params.cartId });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

router.post("/add/:cartId", auth, async (req, res) => {
  try {
    const product = req.body.product;
    const query = { _id: req.params.cartId };

    await Cart.updateOne(query, { $push: { products: product } }).exec();

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

router.delete("/delete/:cartId/:productId", auth, async (req, res) => {
  try {
    const product = { product: req.params.productId };
    const query = { _id: req.params.cartId };

    await Cart.updateOne(query, { $pull: { products: product } }).exec();

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

const decreaseQuantity = (products) => {
  let bulkOptions = products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity } },
      },
    };
  });

  Product.bulkWrite(bulkOptions);
};
// function return product after discount in marketing
function getProductAfterDiscount(item, marketings) {
  let today = new Date().getTime();
  if (marketings.length > 0) {
    let priceAfterDiscount = item.price;
    for (let marketing of marketings) {
      let startDay = marketing.dateFrom
        ? new Date(marketing.dateFrom).getTime()
        : null;
      let endDay = marketing.dateTo
        ? new Date(marketing.dateTo).getTime()
        : null;
      let isValid =
        startDay && today > startDay && (!endDay || (endDay && today < endDay));
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
module.exports = router;
