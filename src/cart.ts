import { CartItem, OperationResult } from "./types";

/**
 * Cart maneja el estado del carrito de un usuario anónimo dentro de una
 * misma sesión de la TUI.
 *
 * NOTA PARA EL EQUIPO: esta clase es un stub intencional (fase RED de TDD).
 * Los tests en tests/cart.test.ts ya describen el comportamiento esperado.
 * Implementen los métodos hasta que todos los tests pasen (fase GREEN),
 * y luego refactoricen si hace falta (fase REFACTOR).
 */
export class Cart {
  private items: CartItem[] = [];

  applyOperation(productId: string, quantity: number): OperationResult {
    const itemIndex = this.items.findIndex((item) => item.productId === productId);

    if (itemIndex === -1) {
      if (quantity < 0) {
        return this.result("not_found");
      }

      this.items.push({ productId, quantity });
      return this.result("added");
    }

    const newQuantity = this.items[itemIndex].quantity + quantity;
    if (newQuantity <= 0) {
      this.items.splice(itemIndex, 1);
      return this.result("removed");
    }

    this.items[itemIndex] = { productId, quantity: newQuantity };
    return this.result("updated");
  }

  getItems(): CartItem[] {
    return this.items.map((item) => ({ ...item }));
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  private result(status: OperationResult["status"]): OperationResult {
    return { status, cart: this.getItems() };
  }
}
