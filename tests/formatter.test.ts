import { describe, it, expect } from "vitest";
import { formatCartLines } from "../src/formatter";

describe("formatCartLines", () => {
  it("devuelve un arreglo vacío para un carrito vacío", () => {
    expect(formatCartLines([])).toEqual([]);
  });

  it("formatea un solo producto como '- id con N unidades'", () => {
    const lines = formatCartLines([{ productId: "12345", quantity: 5 }]);
    expect(lines).toEqual(["  - 12345 con 5 unidades"]);
  });

  it("formatea múltiples productos, uno por línea, en el orden dado", () => {
    const lines = formatCartLines([
      { productId: "12345", quantity: 5 },
      { productId: "456", quantity: 29 },
    ]);

    expect(lines).toEqual([
      "  - 12345 con 5 unidades",
      "  - 456 con 29 unidades",
    ]);
  });
});
