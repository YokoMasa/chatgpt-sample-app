import { Router } from "express";

const controller = Router();

controller.get("/", (req, res) => {
  res.render("mypage", { name: "Masato Yokota" });
});

export default controller;