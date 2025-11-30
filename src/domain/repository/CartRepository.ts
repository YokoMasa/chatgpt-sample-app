import type { Cart } from "../entity/Cart.js";

export class CartRepository {

  private static instance: CartRepository;

  public static getInstance(): CartRepository {
    if (this.instance == null) {
      this.instance = new CartRepository();
    }
    return this.instance;
  }

  private userIdCartIndex: Map<string, Cart>;

  constructor() {
    this.userIdCartIndex = new Map<string, Cart>();
  }

  public findByUserId(userId: string): Cart | null {
    return this.userIdCartIndex.get(userId) ?? null;
  }

  public save(cart: Cart) {
    this.userIdCartIndex.set(cart.getUserId(), cart);
  }
}