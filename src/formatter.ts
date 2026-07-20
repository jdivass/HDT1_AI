import { CartItem } from "./types";

/**
 * formatCartLines produce las líneas de texto que la TUI imprime para
 * mostrar el contenido del carrito, ej:
 *   ["  - 12345 con 5 unidades"]
 *
 * Si el carrito está vacío, debe devolver un arreglo vacío; quien llama
 * decide qué mensaje mostrar en ese caso (ver tests/formatter.test.ts).
 */
export function formatCartLines(_items: CartItem[]): string[] {
  throw new Error("not implemented");
}
