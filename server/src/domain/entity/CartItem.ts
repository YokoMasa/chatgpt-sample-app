import { randomUUID } from "crypto";
import { DomainError } from "../DomainError.js";
import type { Product } from "./Product.js";

export class CartItem {
  private id: string;
  private product: Product;
  private quantity: number;

  constructor(
    product: Product,
    quantity: number
  ) {
    if (quantity < 1) {
      throw new DomainError("quantity cannot be less than 1");
    }

    this.id = randomUUID();
    this.product = product;
    this.quantity = quantity;
  }

  public getId() {
    return this.id;
  }

  public getProduct() {
    return this.product;
  }

  public getQuantity() {
    return this.quantity;
  }

}