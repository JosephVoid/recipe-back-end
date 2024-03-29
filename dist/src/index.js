"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("../models/user"));
const recipe_1 = __importDefault(require("../models/recipe"));
const ObjectId = require("mongoose").Types.ObjectId;
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use((0, cors_1.default)({ credentials: true, origin: "http://localhost:3000" }));
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
mongoose_1.default
    .connect((_a = process.env.DATABASE_URL) !== null && _a !== void 0 ? _a : "")
    .catch((error) => console.error(error))
    .then(() => console.log("Db up and running")); // Connect to the Database
app.post("/sign-in", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const body = req.body;
    const user = yield user_1.default.findOne({ email: body.email });
    if (bcryptjs_1.default.compareSync(body.password, (_b = user === null || user === void 0 ? void 0 : user.password) !== null && _b !== void 0 ? _b : "")) {
        res.cookie("user_id", user === null || user === void 0 ? void 0 : user._id, { maxAge: 24 * 60 * 60 * 1000 });
        return res.json(user);
    }
    else {
        return res.status(401).send("Unauthorized");
    }
}));
app.post("/sign-up", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    let salt = bcryptjs_1.default.genSaltSync(10);
    let hash = bcryptjs_1.default.hashSync(body.password, salt);
    yield user_1.default.create({
        name: body.name,
        email: body.email,
        password: hash,
    });
    const user = yield user_1.default.findOne({ email: body.email });
    res.cookie("user_id", user === null || user === void 0 ? void 0 : user._id, { maxAge: 24 * 60 * 60 * 1000 });
    return res.json(user);
}));
app.post("/sign-out", (req, res) => {
    res.clearCookie("user_id");
    return res.status(200).send("Cookie deleted");
});
app.post("/create-recipe", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const cookie = req.cookies.user_id;
        // if (!cookie) return res.status(401).send("Unauthorized");
        const recipe = yield recipe_1.default.create({
            _id: new ObjectId(),
            title: body.title,
            author: body.author,
            desc: body.desc,
            img: body.img,
            ingr: body.ingr,
        });
        return res.status(200).send(recipe);
    }
    catch (error) {
        return res.status(500).send("Error");
    }
}));
app.patch("/edit-recipe/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const recipeId = req.params.id;
    const cookie = req.cookies.user_id;
    if (!cookie)
        return res.status(401).send("Unauthorized");
    const recipe = yield recipe_1.default.updateOne({ _id: recipeId }, {
        title: body.title,
        author: body.author,
        desc: body.desc,
        img: body.img,
        ingr: body.ingr,
    });
    return res.status(200).json(recipe);
}));
app.delete("/delete-recipe/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipeId = req.params.id;
        const cookie = req.cookies.user_id;
        if (!cookie)
            return res.status(401).send("Unauthorized");
        const recipe = yield recipe_1.default.deleteOne({ _id: recipeId });
        return res.status(200).send(recipe);
    }
    catch (error) {
        return res.status(500).send("Erorr");
    }
}));
app.get("/recipes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allRecipes = yield recipe_1.default.find();
        return res.json(allRecipes);
    }
    catch (error) {
        return res.status(500).send("Error");
    }
}));
app.listen(process.env.PORT, () => console.log(`API Live at ${process.env.PORT}`));
