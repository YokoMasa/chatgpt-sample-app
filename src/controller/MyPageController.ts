import { Router } from "express";
import SessionCheckMiddleware from "../auth/SessionCheckMiddleware.js";
import { CartRepository } from "../domain/repository/CartRepository.js";
import { Cart } from "../domain/entity/Cart.js";

const controller = Router();
controller.use(SessionCheckMiddleware);

controller.get("/", (req, res) => {
  const userId = req.session.userId!;
  const cart = getCartOfUser(userId);

  res.render(
    "mypage",
    {
      name: userId
    });
});

const cartRepository = CartRepository.getInstance();
function getCartOfUser(userId: string) {
  const cart = cartRepository.findByUserId(userId);
  if (cart != null) {
    return cart;
  }

  const newCart = new Cart(userId);
  cartRepository.save(newCart);
  return newCart;
}

export default controller;