import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/user";
import Recipe from "../models/recipe";
const ObjectId = require("mongoose").Types.ObjectId;

const app = express();
dotenv.config();
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

mongoose
  .connect(process.env.DATABASE_URL ?? "")
  .catch((error) => console.error(error))
  .then(() => console.log("Db up and running")); // Connect to the Database

app.post("/sign-in", async (req, res) => {
  const body = req.body;
  const user = await User.findOne({ email: body.email });
  if (bcrypt.compareSync(body.password, user?.password ?? "")) {
    res.cookie("user_id", user?._id, { maxAge: 24 * 60 * 60 * 1000 });
    return res.json(user);
  } else {
    return res.status(401).send("Unauthorized");
  }
});

app.post("/sign-up", async (req, res) => {
  const body = req.body;
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(body.password, salt);

  await User.create({
    name: body.name,
    email: body.email,
    password: hash,
  });

  const user = await User.findOne({ email: body.email });

  res.cookie("user_id", user?._id, { maxAge: 24 * 60 * 60 * 1000 });
  return res.json(user);
});

app.post("/sign-out", (req, res) => {
  res.clearCookie("user_id");
  return res.send("Cookie deleted");
});

app.post("/create-recipe", async (req, res) => {
  try {
    const body = req.body;
    const cookie = req.cookies.user_id;
    if (!cookie) return res.status(401).send("Unauthorized");
    const recipe = await Recipe.create({
      _id: new ObjectId(),
      title: body.title,
      author: body.author,
      desc: body.desc,
      img: body.img,
      ingr: body.ingr,
    });

    return res.status(200).send(recipe);
  } catch (error) {
    return res.status(500).send("Error");
  }
});

app.patch("/edit-recipe/:id", async (req, res) => {
  const body = req.body;
  const recipeId = req.params.id;
  const cookie = req.cookies.user_id;
  if (!cookie) return res.status(401).send("Unauthorized");
  const recipe = await Recipe.updateOne(
    { _id: recipeId },
    {
      title: body.title,
      author: body.author,
      desc: body.desc,
      img: body.img,
      ingr: body.ingr,
    }
  );
  return res.status(200).json(recipe);
});

app.delete("/delete-recipe/:id", async (req, res) => {
  try {
    const recipeId = req.params.id;
    const cookie = req.cookies.user_id;
    if (!cookie) return res.status(401).send("Unauthorized");
    const recipe = await Recipe.deleteOne({ _id: recipeId });

    return res.status(200).send(recipe);
  } catch (error) {
    return res.status(500).send("Erorr");
  }
});

app.get("/recipes", async (req, res) => {
  try {
    const allRecipes = await Recipe.find();
    return res.json(allRecipes);
  } catch (error) {
    return res.status(500).send("Error");
  }
});

app.listen(process.env.PORT, () =>
  console.log(`API Live at ${process.env.PORT}`)
);
