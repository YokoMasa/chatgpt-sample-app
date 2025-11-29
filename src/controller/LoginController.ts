import { Router, urlencoded } from "express";

const controller = Router();
controller.use(urlencoded());

controller.get("/", (req, res) => {
  if (req.session.userId != null) {
    res.redirect("/");
  } else {
    res.render("login");
  }
});

controller.post("/", (req, res, next) => {
  const userId = req.body.user_id;
  const password = req.body.password;

  if (userId == null || password !== "password") {
    return next(new Error("Password is wrong"));
  }

  req.session.userId = userId;

  const backTo = req.query.backTo;
  if (backTo != null && typeof backTo === "string" && !backTo.startsWith("http")) {
    res.redirect(backTo);
  } else {
    res.redirect("/");
  }
});

export default controller;