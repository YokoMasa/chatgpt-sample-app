import { Router, urlencoded } from "express";

const controller = Router();
controller.use(urlencoded());

controller.get("/", (_, res) => {
  res.render("login");
});

controller.post("/", (req, res) => {
  const userId = req.body.user_id;
  const password = req.body.password;
  res.render("login");
});

export default controller;