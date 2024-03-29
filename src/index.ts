import express from "express";

const app = express();

app.get("/", (req, res) => {
  return res.send("Live");
});

app.listen(3000, () => console.log("API Live"));
