import { randomUUID } from "crypto";
import { DomainError } from "../DomainError.js";

export class CartItem {
  private id: string;
  private itemId: string;
  private quantity: number;

  constructor(
    itemId: string,
    quantity: number
  ) {
    if (quantity < 1) {
      throw new DomainError("quantity cannot be less than 1");
    }

    this.id = randomUUID();
    this.itemId = itemId;
    this.quantity = quantity;
  }

  public getId() {
    return this.id;
  }

  public getItemId() {
    return this.itemId;
  }

  public getQuantity() {
    return this.quantity;
  }

}