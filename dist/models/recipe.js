"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ingrSchema = new mongoose_1.default.Schema({
    id: String,
    name: String,
    quantity: Number,
    unit: String,
});
const recipeSchema = new mongoose_1.default.Schema({
    _id: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    img: { type: String, required: false },
    author: { type: String, required: true },
    ingr: [ingrSchema],
});
exports.default = mongoose_1.default.model("recipe", recipeSchema);
