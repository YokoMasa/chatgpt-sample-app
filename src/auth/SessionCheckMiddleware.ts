import type { RequestHandler } from "express";

const middleware: RequestHandler = (req, res, next) => {
  if (req.session.userId == null) {
    const backTo = encodeURIComponent(req.originalUrl);
    res.redirect(`/login?backTo=${backTo}`);
  } else {
    next();
  }
}

export default middleware;