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
  applyOperation(_productId: string, _quantity: number): OperationResult {
    throw new Error("not implemented");
  }

  getItems(): CartItem[] {
    throw new Error("not implemented");
  }

  isEmpty(): boolean {
    throw new Error("not implemented");
  }
}
