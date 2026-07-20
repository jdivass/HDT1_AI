import { describe, it, expect, beforeEach } from "vitest";
import { Cart } from "../src/cart";
import { parseCommand } from "../src/parser";
import { formatCartLines } from "../src/formatter";

/**
 * Este test reproduce paso a paso la transcripción del mock que dio el
 * equipo de UX/PO, para asegurar que Cart + parser + formatter trabajan
 * juntos igual que se espera en la TUI real.
 */
describe("Flujo completo del carrito (transcript del mock)", () => {
  let cart: Cart;

  beforeEach(() => {
    cart = new Cart();
  });

  it("> 12345 5 -> agrega el producto con 5 unidades", () => {
    const command = parseCommand("12345 5");
    expect(command.kind).toBe("operation");
    if (command.kind !== "operation") return;

    const result = cart.applyOperation(command.productId, command.quantity);

    expect(result.status).toBe("added");
    expect(formatCartLines(result.cart)).toEqual(["  - 12345 con 5 unidades"]);
  });

  it("> 12345 -5 (después de tener 5) -> vacía el carrito", () => {
    cart.applyOperation("12345", 5);

    const command = parseCommand("12345 -5");
    if (command.kind !== "operation") throw new Error("parseo inesperado");
    const result = cart.applyOperation(command.productId, command.quantity);

    expect(result.status).toBe("removed");
    expect(cart.isEmpty()).toBe(true);
    expect(formatCartLines(result.cart)).toEqual([]);
  });

  it("> 12345 -5 otra vez (carrito ya vacío) -> not_found", () => {
    cart.applyOperation("12345", 5);
    cart.applyOperation("12345", -5);

    const command = parseCommand("12345 -5");
    if (command.kind !== "operation") throw new Error("parseo inesperado");
    const result = cart.applyOperation(command.productId, command.quantity);

    expect(result.status).toBe("not_found");
  });

  it("> 456 29 -> agrega el segundo producto", () => {
    cart.applyOperation("12345", 5);
    cart.applyOperation("12345", -5);

    const command = parseCommand("456 29");
    if (command.kind !== "operation") throw new Error("parseo inesperado");
    const result = cart.applyOperation(command.productId, command.quantity);

    expect(result.status).toBe("added");
    expect(formatCartLines(result.cart)).toEqual(["  - 456 con 29 unidades"]);
  });

  it("> bye -> termina la sesión", () => {
    const command = parseCommand("bye");
    expect(command).toEqual({ kind: "exit" });
  });

  it("reproduce la secuencia completa del mock de punta a punta", () => {
    const transcript: Array<{ input: string; expectedStatus?: string }> = [
      { input: "12345 5", expectedStatus: "added" },
      { input: "12345 -5", expectedStatus: "removed" },
      { input: "12345 -5", expectedStatus: "not_found" },
      { input: "456 29", expectedStatus: "added" },
    ];

    for (const step of transcript) {
      const command = parseCommand(step.input);
      if (command.kind !== "operation") throw new Error(`parseo inesperado: ${step.input}`);
      const result = cart.applyOperation(command.productId, command.quantity);
      expect(result.status).toBe(step.expectedStatus);
    }

    expect(cart.getItems()).toEqual([{ productId: "456", quantity: 29 }]);
    expect(parseCommand("bye")).toEqual({ kind: "exit" });
  });
});
