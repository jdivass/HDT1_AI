import { describe, it, expect, beforeEach } from "vitest";
import { Cart } from "../src/cart";

describe("Cart", () => {
  let cart: Cart;

  beforeEach(() => {
    cart = new Cart();
  });

  describe("estado inicial", () => {
    it("empieza vacío", () => {
      expect(cart.isEmpty()).toBe(true);
      expect(cart.getItems()).toEqual([]);
    });
  });

  describe("altas (agregar producto)", () => {
    it("agrega un producto nuevo con la cantidad indicada", () => {
      const result = cart.applyOperation("12345", 5);

      expect(result.status).toBe("added");
      expect(result.cart).toEqual([{ productId: "12345", quantity: 5 }]);
      expect(cart.isEmpty()).toBe(false);
    });

    it("permite agregar múltiples productos distintos", () => {
      cart.applyOperation("12345", 5);
      const result = cart.applyOperation("456", 29);

      expect(result.status).toBe("added");
      expect(result.cart).toEqual([
        { productId: "12345", quantity: 5 },
        { productId: "456", quantity: 29 },
      ]);
    });

    it("suma unidades cuando el producto ya existe en el carrito", () => {
      cart.applyOperation("12345", 5);
      const result = cart.applyOperation("12345", 3);

      expect(result.status).toBe("updated");
      expect(result.cart).toEqual([{ productId: "12345", quantity: 8 }]);
    });
  });

  describe("cambios (incrementar/decrementar sin vaciar)", () => {
    it("resta unidades y conserva el producto si la cantidad resultante es positiva", () => {
      cart.applyOperation("12345", 10);
      const result = cart.applyOperation("12345", -4);

      expect(result.status).toBe("updated");
      expect(result.cart).toEqual([{ productId: "12345", quantity: 6 }]);
    });
  });

  describe("bajas (remover producto)", () => {
    it("elimina el producto cuando la resta llega exactamente a cero", () => {
      cart.applyOperation("12345", 5);
      const result = cart.applyOperation("12345", -5);

      expect(result.status).toBe("removed");
      expect(result.cart).toEqual([]);
      expect(cart.isEmpty()).toBe(true);
    });

    it("elimina el producto si la resta lo deja en negativo", () => {
      cart.applyOperation("12345", 3);
      const result = cart.applyOperation("12345", -10);

      expect(result.status).toBe("removed");
      expect(result.cart).toEqual([]);
    });

    it("elimina solo el producto afectado, dejando el resto intacto", () => {
      cart.applyOperation("12345", 5);
      cart.applyOperation("456", 29);
      const result = cart.applyOperation("12345", -5);

      expect(result.status).toBe("removed");
      expect(result.cart).toEqual([{ productId: "456", quantity: 29 }]);
    });

    it("responde not_found al intentar restar un producto que no está en el carrito", () => {
      const result = cart.applyOperation("12345", -5);

      expect(result.status).toBe("not_found");
      expect(result.cart).toEqual([]);
    });

    it("no modifica el carrito cuando la operación es not_found", () => {
      cart.applyOperation("456", 29);
      const result = cart.applyOperation("999", -1);

      expect(result.status).toBe("not_found");
      expect(result.cart).toEqual([{ productId: "456", quantity: 29 }]);
    });
  });

  describe("getItems", () => {
    it("devuelve una copia y no la referencia interna (inmutabilidad)", () => {
      cart.applyOperation("12345", 5);
      const items = cart.getItems();
      items.push({ productId: "999", quantity: 1 });

      expect(cart.getItems()).toEqual([{ productId: "12345", quantity: 5 }]);
    });
  });
});
