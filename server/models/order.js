const Mongoose = require('mongoose');
const { Schema } = Mongoose;

// Order Schema
const OrderSchema = new Schema({
  cart: {
    type: Schema.Types.ObjectId,
    ref: "Cart",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  zipCode: {
    type: String,
  },
  lng: {
    type: Number,
  },
  lat: {
    type: Number,
  },
  total: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["Not processed", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Not processed",
  },
  locator: {
    type: Schema.Types.ObjectId,
    ref: "Locator",
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Mongoose.model('Order', OrderSchema);
