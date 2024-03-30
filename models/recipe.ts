import mongoose from "mongoose";

const ingrSchema = new mongoose.Schema({
  id: String,
  name: String,
  quantity: Number,
  unit: String,
});

const recipeSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  img: { type: String, required: false },
  author: { type: String, required: true },
  author_id: { type: String, required: true },
  ingr: [ingrSchema],
});

export default mongoose.model("recipe", recipeSchema);
