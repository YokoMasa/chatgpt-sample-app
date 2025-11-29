import type { RequestHandler } from "express";

const controller: RequestHandler = (req, res) => {
  res.render("404");
}

export default controller;