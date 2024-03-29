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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
const prisma = new client_1.PrismaClient();
app.post("/sign-in", (req, res) => {
    const body = req.body;
    // DB stuff
    res.cookie("user_id", "id", { maxAge: 24 * 60 * 60 * 1000 });
    return res.send("Live");
});
app.post("/sign-up", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    let salt = bcryptjs_1.default.genSaltSync(10);
    let hash = bcryptjs_1.default.hashSync(body.password, salt);
    yield prisma.user.create({
        data: {
            name: body.name,
            email: body.email,
            password: hash,
        },
    });
    const user = yield prisma.user.findUnique({ where: { email: body.email } });
    res.cookie("user_id", user === null || user === void 0 ? void 0 : user.id, { maxAge: 24 * 60 * 60 * 1000 });
    return res.json(user);
}));
app.post("/create-recipe", (req, res) => {
    const body = req.body;
    const cookie = req.cookies.user_id;
    return res.send("Live");
});
app.patch("/edit-recipe/:id", (req, res) => {
    const body = req.body;
    const recipeId = req.params.id;
    const cookie = req.cookies.user_id;
    return res.send("Live");
});
app.delete("/delete-recipe/:id", (req, res) => {
    const recipeId = req.params.id;
    const cookie = req.cookies.user_id;
    return res.send("Live");
});
app.get("/recipes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allRecipes = yield prisma.recipe.findMany();
    return res.json(allRecipes);
}));
app.listen(process.env.PORT, () => console.log(`API Live at ${process.env.PORT}`));
