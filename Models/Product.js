const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },  // keep as String since your data has string
  stock: { type: Number, required: false, min: 0, default: 0 },
  imgUrl: { type: String },                     // match your JSON
  colors: [{ type: String }],
  sizes: [{ type: String }],
  rating: { type: Number },
  reviews: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ProductModel = mongoose.models.Product || mongoose.model('Product', ProductSchema);
module.exports = ProductModel;
