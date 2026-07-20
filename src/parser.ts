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
export function parseCommand(_rawInput: string): Command {
  throw new Error("not implemented");
}
