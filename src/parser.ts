import { Command } from "./types";

/**
 * parseCommand interpreta una línea cruda ingresada por el usuario en la TUI.
 *
 * Reglas esperadas (ver tests/parser.test.ts):
 * - "bye" (sin importar mayúsculas/espacios extra) -> { kind: "exit" }
 * - "<productId> <cantidad>" con cantidad entera distinta de 0 ->
 *     { kind: "operation", productId, quantity }
 * - Cualquier otro formato -> { kind: "invalid", reason }
 */
export function parseCommand(rawInput: string): Command {
  const input = rawInput.trim();

  if (input.toLowerCase() === "bye") {
    return { kind: "exit" };
  }

  const tokens = input.split(/\s+/);
  if (tokens.length !== 2) {
    return invalid("Ingresa un id de producto y una cantidad.");
  }

  const [productId, rawQuantity] = tokens;
  if (!/^\d+$/.test(productId)) {
    return invalid("El id del producto debe contener solamente dígitos.");
  }

  if (!/^-?\d+$/.test(rawQuantity)) {
    return invalid("La cantidad debe ser un número entero.");
  }

  const quantity = Number(rawQuantity);
  if (!Number.isSafeInteger(quantity) || quantity === 0) {
    return invalid("La cantidad debe ser un entero distinto de cero.");
  }

  return { kind: "operation", productId, quantity };
}

function invalid(reason: string): Command {
  return { kind: "invalid", reason };
}
