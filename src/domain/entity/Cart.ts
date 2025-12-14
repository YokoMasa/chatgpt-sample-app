import { CartItem } from "./CartItem.js";

export class Cart {
  private userId: string;
  private items: CartItem[];

  constructor(userId: string) {
    this.userId = userId;
    this.items = [];
  }

  public getUserId() {
    return this.userId;
  }

  public listItems(): ArrayIterator<CartItem> {
    return this.items.values();
  }

  public addItem(item: CartItem) {
    this.items.push(item);
  }

  public removeItem(itemId: string) {
    this.items = this.items.filter(item => item.getId() !== itemId);
  }

  public clear() {
    this.items = [];
  }

}