import "./init.js";
import express, { type ErrorRequestHandler } from "express";
import session from "express-session";
import { handlebarsEngine } from "./view/HandlebarsEngine.js";
import MyPageController from "./controller/MyPageController.js";
import NotFoundController from "./controller/NotFoundController.js";
import LoginController from "./controller/LoginController.js";
import { LRUCacheSessionStore } from "./auth/LRUCacheSessionStore.js";
import LogoutController from "./controller/LogoutController.js";
import OAuthASController from "./controller/OAuthASController.js";
import MCPController from "./controller/MCPController.js";
import { ENV } from "./utils/Env.js";
import OAuthMetadataController from "./controller/OAuthMetadataController.js";
import CartApiController from "./controller/CartApiController.js";

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

const expressApp = express();

// view settings
expressApp.engine("html", handlebarsEngine);
expressApp.set("view engine", "html");
expressApp.set("views", "src/view/templates");

expressApp.set("trust proxy", 1);
expressApp.set("x-powered-by", false);
expressApp.use(express.json());
expressApp.use(session({
  secret: ENV.sessionSecret,
  resave: false,
  saveUninitialized: false,
  unset: "destroy",
  store: new LRUCacheSessionStore(100)
}));

// controllers
if (!ENV.isProd) {
  expressApp.use("/static", express.static("public"));
}
expressApp.use("/login", LoginController);
expressApp.use("/logout", LogoutController);
expressApp.use("/mypage", MyPageController);
expressApp.use(OAuthMetadataController);
expressApp.use(OAuthASController);
expressApp.use("/mcp", MCPController);
expressApp.use("/api/cart", CartApiController);
expressApp.use("/", MyPageController);

// Not Found Page
expressApp.all(/.*/, NotFoundController);

// Error Page
expressApp.use(((error, _, res, next) => {
  console.error(error);
  if (res.headersSent) {
    return next(error);
  }
  res.render("error", { message: error.message ?? "予期せぬエラーが発生しました。" });
}) as ErrorRequestHandler);

const port = parseInt(ENV.port);
expressApp.listen(port, ENV.host, () => {
  console.log(`Server running on http://${ENV.host}:${port}`);
}).on('error', error => {
  console.error('Server error:', error);
  process.exit(1);
});