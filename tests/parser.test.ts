import { describe, it, expect } from "vitest";
import { parseCommand } from "../src/parser";

describe("parseCommand", () => {
  describe("comandos de operación válidos", () => {
    it("parsea 'id cantidad' con cantidad positiva", () => {
      const result = parseCommand("12345 5");

      expect(result).toEqual({
        kind: "operation",
        productId: "12345",
        quantity: 5,
      });
    });

    it("parsea cantidades negativas", () => {
      const result = parseCommand("12345 -5");

      expect(result).toEqual({
        kind: "operation",
        productId: "12345",
        quantity: -5,
      });
    });

    it("ignora espacios extra al inicio, final y entre tokens", () => {
      const result = parseCommand("  456    29  ");

      expect(result).toEqual({
        kind: "operation",
        productId: "456",
        quantity: 29,
      });
    });
  });

  describe("comando de salida", () => {
    it("reconoce 'bye' como salida", () => {
      expect(parseCommand("bye")).toEqual({ kind: "exit" });
    });

    it("reconoce 'bye' sin importar mayúsculas/minúsculas", () => {
      expect(parseCommand("BYE")).toEqual({ kind: "exit" });
      expect(parseCommand("Bye")).toEqual({ kind: "exit" });
    });

    it("reconoce 'bye' con espacios alrededor", () => {
      expect(parseCommand("  bye  ")).toEqual({ kind: "exit" });
    });
  });

  describe("entradas inválidas", () => {
    it("marca como inválida una entrada sin cantidad", () => {
      const result = parseCommand("12345");
      expect(result.kind).toBe("invalid");
    });

    it("marca como inválida una entrada con demasiados tokens", () => {
      const result = parseCommand("12345 5 extra");
      expect(result.kind).toBe("invalid");
    });

    it("marca como inválida una cantidad no numérica", () => {
      const result = parseCommand("12345 abc");
      expect(result.kind).toBe("invalid");
    });

    it("marca como inválida una cantidad igual a cero", () => {
      const result = parseCommand("12345 0");
      expect(result.kind).toBe("invalid");
    });

    it("marca como inválida una entrada vacía", () => {
      const result = parseCommand("");
      expect(result.kind).toBe("invalid");
    });

    it("incluye una razón legible en las entradas inválidas", () => {
      const result = parseCommand("");
      if (result.kind === "invalid") {
        expect(result.reason.length).toBeGreaterThan(0);
      }
    });
  });
});
