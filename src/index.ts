import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const app = express();
dotenv.config();
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

const prisma = new PrismaClient();

app.post("/sign-in", (req, res) => {
  const body = req.body;
  // DB stuff
  res.cookie("user_id", "id", { maxAge: 24 * 60 * 60 * 1000 });
  return res.send("Live");
});

app.post("/sign-up", async (req, res) => {
  const body = req.body;
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(body.password, salt);

  await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: hash,
    },
  });
  const user = await prisma.user.findUnique({ where: { email: body.email } });

  res.cookie("user_id", user?.id, { maxAge: 24 * 60 * 60 * 1000 });
  return res.json(user);
});

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

app.get("/recipes", async (req, res) => {
  const allRecipes = await prisma.recipe.findMany();
  return res.json(allRecipes);
});

app.listen(process.env.PORT, () =>
  console.log(`API Live at ${process.env.PORT}`)
);
