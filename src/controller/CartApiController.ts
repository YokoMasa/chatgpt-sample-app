import { Router } from "express";
import SessionCheckMiddleware from "../auth/SessionCheckMiddleware.js";
import { CartRepository } from "../domain/repository/CartRepository.js";
import { Cart } from "../domain/entity/Cart.js";
import { ProductRepository } from "../domain/repository/ProductRepository.js";

const controller = Router();

const cartRepository = CartRepository.getInstance();

controller.get("/", SessionCheckMiddleware, (req, res) => {
  const userId = req.session.userId;
  if (userId == null) {
    throw new Error("userId is null.");
  }

  let cart = cartRepository.findByUserId(userId);
  if (cart == null) {
    cart = new Cart(userId);
    cartRepository.save(cart);
  }

  const respBody = cart.listItems()
    .map(item => ({
      itemId: item.getId(),
      productId: item.getProduct().id,
      productName: item.getProduct().name,
      productImagePath: item.getProduct().imagePath,
      quantity: item.getQuantity()
    }))
    .toArray();
  res.setHeader("Content-Type", "application/json");
  res.status(200);
  res.send(respBody);
});

controller.delete("/item/:itemId", (req, res) => {
  const userId = req.session.userId;
  if (userId == null) {
    throw new Error("userId is null.");
  }

  const cart = cartRepository.findByUserId(userId);
  if (cart == null) {
    res.sendStatus(200);
    return;
  }

  cart.removeItem(req.params.itemId);
  cartRepository.save(cart);
  res.sendStatus(200);
  return;
});

export default controller;