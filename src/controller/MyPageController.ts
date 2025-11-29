import { Router } from "express";
import SessionCheckMiddleware from "../auth/SessionCheckMiddleware.js";

const controller = Router();
controller.use(SessionCheckMiddleware);

controller.get("/", (req, res) => {
  res.render("mypage", { name: "Masato Yokota", userId: req.session.userId });
});

export default controller;