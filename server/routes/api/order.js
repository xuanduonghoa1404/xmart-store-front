const express = require('express');
const router = express.Router();
const Mongoose = require('mongoose');

// Bring in Models & Helpers
const Order = require('../../models/order');
const Cart = require('../../models/cart');
const Product = require('../../models/product');
const auth = require('../../middleware/auth');
const role = require("../../middleware/role");
const store = require("../../helpers/store");

router.post("/add", auth, async (req, res) => {
  try {
    const locatorIds = req.body.locatorIds;
    const cart = req.body.cartId;
    const total = req.body.total;
    const user = req.user._id;
    const name = req.body.shippingAddress.name;
    const address = req.body.shippingAddress.address;
    const phone = req.body.shippingAddress.phone;
    const city = req.body.shippingAddress.city;
    const state = req.body.shippingAddress.state;
    const country = req.body.shippingAddress.country;
    const zipCode = req.body.shippingAddress.zipCode;
    const lng = Number(req.body.shippingAddress.lng);
    const lat = Number(req.body.shippingAddress.lat);
    let locator = null;
    let products = await Product.find({ status: true });
    let carts = await Cart.findOne({ _id: cart });
    for (let index = 0; index < locatorIds.length; index++) {
      let check = await checkAvailableInventoryLocatorWithCart(
        locatorIds[index],
        cart
      );
      if (check) {
        locator = locatorIds[index];
        break;
      }
    }
    decreaseQuantity(carts.products, locator, products);
    if (locator) {
      let status = "Processing";
      const order = new Order({
        cart,
        user,
        total,
        name,
        address,
        city,
        phone,
        state,
        country,
        zipCode,
        lng,
        lat,
        locator,
        status,
      });

      const orderDoc = await order.save();
      res.status(200).json({
        success: true,
        message: `Đơn hàng đã được đặt thành công!`,
        order: { _id: orderDoc._id },
      });
    } else {
      const order = new Order({
        cart,
        user,
        total,
        name,
        address,
        city,
        phone,
        state,
        country,
        zipCode,
        lng,
        lat,
        locator,
      });

      const orderDoc = await order.save();
      res.status(200).json({
        success: true,
        message: `Đơn hàng đã được đặt thành công! Chưa tìm được chi nhánh cửa hàng phù hợp!`,
        order: { _id: orderDoc._id },
      });
    }
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

// search orders api
router.get("/search", auth, async (req, res) => {
  try {
    const { search } = req.query;

    if (!Mongoose.Types.ObjectId.isValid(search)) {
      return res.status(200).json({
        orders: [],
      });
    }

    let ordersDoc = null;

    if (req.user.role === role.ROLES.Admin) {
      ordersDoc = await Order.find({
        _id: Mongoose.Types.ObjectId(search),
      }).populate({
        path: "cart",
        populate: {
          path: "products.product",
          populate: {
            path: "brand",
          },
        },
      });
    } else {
      const user = req.user._id;
      ordersDoc = await Order.find({
        _id: Mongoose.Types.ObjectId(search),
        user,
      }).populate({
        path: "cart",
        populate: {
          path: "products.product",
          populate: {
            path: "brand",
          },
        },
      });
    }

    ordersDoc = ordersDoc.filter((order) => order.cart);

    if (ordersDoc.length > 0) {
      const newOrders = ordersDoc.map((o) => {
        return {
          _id: o._id,
          total: parseFloat(Number(o.total.toFixed(2))),
          created: o.created,
          products: o.cart?.products,
        };
      });

      let orders = newOrders.map((o) => store.caculateTaxAmount(o));
      orders.sort((a, b) => b.created - a.created);
      res.status(200).json({
        orders,
      });
    } else {
      res.status(200).json({
        orders: [],
      });
    }
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

// fetch orders api
router.get("/", auth, async (req, res) => {
  try {
    const user = req.user._id;

    let ordersDoc = await Order.find({ user }).populate({
      path: "cart",
      populate: {
        path: "products.product",
        populate: {
          path: "brand",
        },
      },
    });

    ordersDoc = ordersDoc.filter((order) => order.cart);

    if (ordersDoc.length > 0) {
      const newOrders = ordersDoc.map((o) => {
        return {
          _id: o._id,
          total: parseFloat(Number(o.total.toFixed(2))),
          created: o.created,
          products: o.cart?.products,
          status: o.status,
        };
      });

      let orders = newOrders.map((o) => store.caculateTaxAmount(o));
      orders.sort((a, b) => b.created - a.created);
      res.status(200).json({
        orders,
      });
    } else {
      res.status(200).json({
        orders: [],
      });
    }
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

// fetch order api
router.get("/:orderId", auth, async (req, res) => {
  try {
    const orderId = req.params.orderId;

    let orderDoc = null;

    if (req.user.role === role.ROLES.Admin) {
      orderDoc = await Order.findOne({ _id: orderId }).populate({
        path: "cart",
        populate: {
          path: "products.product",
          populate: {
            path: "brand",
          },
        },
      });
    } else {
      const user = req.user._id;
      orderDoc = await Order.findOne({ _id: orderId, user }).populate({
        path: "cart",
        populate: {
          path: "products.product",
          populate: {
            path: "brand",
          },
        },
      });
    }

    if (!orderDoc || !orderDoc.cart) {
      return res.status(404).json({
        message: `Cannot find order with the id: ${orderId}.`,
      });
    }

    let order = {
      _id: orderDoc._id,
      total: orderDoc.total,
      created: orderDoc.created,
      totalTax: 0,
      products: orderDoc?.cart?.products,
      cartId: orderDoc.cart._id,
      name: orderDoc.name,
      address: orderDoc.address,
      city: orderDoc.city,
      phone: orderDoc.phone,
      state: orderDoc.state,
      country: orderDoc.country,
      zipCode: orderDoc.zipCode,
      lng: orderDoc.lng,
      lat: orderDoc.lat,
      status: orderDoc.status,
    };

    order = store.caculateTaxAmount(order);

    res.status(200).json({
      order,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

router.delete("/cancel/:orderId", auth, async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const order = await Order.findOne({ _id: orderId });
    const foundCart = await Cart.findOne({ _id: order.cart });

    increaseQuantity(foundCart.products);

    await Order.deleteOne({ _id: orderId });
    await Cart.deleteOne({ _id: order.cart });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

router.put("/status/item/:itemId", auth, async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const orderId = req.body.orderId;
    const cartId = req.body.cartId;
    const status = req.body.status || "Cancelled";

    const foundCart = await Cart.findOne({ "products._id": itemId });
    const foundCartProduct = foundCart.products.find((p) => p._id == itemId);

    await Cart.updateOne(
      { "products._id": itemId },
      {
        "products.$.status": status,
      }
    );

    if (status === "Cancelled") {
      await Product.updateOne(
        { _id: foundCartProduct.product },
        { $inc: { quantity: foundCartProduct.quantity } }
      );

      const cart = await Cart.findOne({ _id: cartId });
      const items = cart.products.filter((item) => item.status === "Cancelled");

      // All items are cancelled => Cancel order
      if (cart.products.length === items.length) {
        await Order.deleteOne({ _id: orderId });
        await Cart.deleteOne({ _id: cartId });

        return res.status(200).json({
          success: true,
          orderCancelled: true,
          message: `${
            req.user.role === role.ROLES.Admin ? "Order" : "Your order"
          } has been cancelled successfully`,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Item has been cancelled successfully!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Item status has been updated successfully!",
    });
  } catch (error) {
    res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
});

const increaseQuantity = (products) => {
  let bulkOptions = products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: item.quantity } },
      },
    };
  });

  Product.bulkWrite(bulkOptions);
};

const decreaseQuantity = (products, locatorIds, listProducts) => {
  let bulkOptions = products.map((item) => {
    let product = listProducts.find(
      (p) => p._id.toString() === item.product.toString()
    );
    let quantityPurchase = item.quantity;
    let inventory = product.inventory;
    let newInventory = inventory.filter((imports) => {
      if (imports.locator.toString() === locatorIds.toString()) {
        let importList = imports.imports.sort(
          (a, b) => a.date_expiration - b.date_expiration
        );
        let newImport = importList.filter((imp) => {
          if (quantityPurchase > 0) {
            if (imp.quantity >= quantityPurchase) {
              imp.quantity = imp.quantity - quantityPurchase;
              quantityPurchase = 0;
            } else {
              imp.quantity = 0;
              quantityPurchase = quantityPurchase - imp.quantity;
            }
          }
        });
      }
    });
    return {
      updateOne: {
        filter: { _id: item.product },
        update: { $set: { inventory: inventory } },
      },
    };
  });

  Product.bulkWrite(bulkOptions);
};

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

async function checkAvailableInventoryLocatorWithCart(locatorId, cartId) {
  let checkAvailable = true;
  let cart = await Cart.findById(cartId).populate({
    path: "products.product",
  });
  console.log("cart", cart);
  for (let cartItem of cart.products) {
    let product = cartItem.product;
    let quantity = cartItem.quantity;
    console.log("cartItem.product", product);
    let quantityInventory = getProductInventoryWithLocator(
      product,
      locatorId
    ).quantity;
    console.log(
      "quantity",
      locatorId,
      quantity,
      quantityInventory,
      quantity > quantityInventory
    );
    if (quantity > quantityInventory) {
      checkAvailable = false;
      return false;
    }
  }
  return checkAvailable;
}

module.exports = router;
