import { Router } from "express";

const controller = Router();

controller.get("/", (req, res) => {
  delete req.session.userId;
  res.redirect("/login");
});

export default controller;