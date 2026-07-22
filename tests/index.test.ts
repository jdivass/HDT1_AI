import { describe, expect, it } from "vitest";
import { PassThrough, Writable } from "node:stream";
import { runConsoleTui, runTui, TuiIO } from "../src/index";

class ScriptedIO implements TuiIO {
  readonly prompts: string[] = [];
  readonly output: string[] = [];

  constructor(private readonly answers: Array<string | null>) {}

  async read(prompt: string): Promise<string | null> {
    this.prompts.push(prompt);
    return this.answers.shift() ?? null;
  }

  write(line: string): void {
    this.output.push(line);
  }
}

describe("runTui", () => {
  it("reproduce el flujo completo entregado por UX", async () => {
    const io = new ScriptedIO([
      "Rodrigo Custodio",
      "12345 5",
      "12345 -5",
      "12345 -5",
      "456 29",
      "bye",
    ]);

    await runTui(io);

    expect(io.prompts[0]).toContain("Por favor ingrese su nombre");
    expect(io.prompts[1]).toContain("Hola Rodrigo!");
    expect(io.prompts[2]).toContain("12345 con 5 unidades");
    expect(io.prompts[3]).toContain("carrito está vacío");
    expect(io.prompts[4]).toContain("no tienes el producto 12345");
    expect(io.prompts[5]).toContain("456 con 29 unidades");
    expect(io.output).toEqual(["| Adiós fue un gusto atenderte!"]);
  });

  it("explica una entrada inválida y permite intentarlo de nuevo", async () => {
    const io = new ScriptedIO(["Ana", "comando inválido", "bye"]);

    await runTui(io);

    expect(io.prompts[2]).toContain("Entrada inválida");
    expect(io.output).toEqual(["| Adiós fue un gusto atenderte!"]);
  });

  it("termina limpiamente si stdin se cierra", async () => {
    const io = new ScriptedIO([null]);

    await expect(runTui(io)).resolves.toBeUndefined();
    expect(io.output).toEqual([]);
  });

  it("solicita de nuevo un nombre vacío y sanitiza caracteres de control", async () => {
    const io = new ScriptedIO(["   ", "\u001bAna López", "bye"]);

    await runTui(io);

    expect(io.prompts[1]).toContain("nombre no puede estar vacío");
    expect(io.prompts[2]).toContain("Hola Ana!");
  });

  it("muestra el carrito tras actualizar una cantidad", async () => {
    const io = new ScriptedIO(["Luis", "123 5", "123 -2", "bye"]);

    await runTui(io);

    expect(io.prompts[3]).toContain("123 con 3 unidades");
  });

  it("conecta el flujo con streams reales de Node", async () => {
    const input = new PassThrough();
    let output = "";
    const destination = new Writable({
      write(chunk, _encoding, callback) {
        output += chunk.toString();
        callback();
      },
    });

    const session = runConsoleTui(input, destination);
    input.write("Ana\n");
    await new Promise((resolve) => setTimeout(resolve, 0));
    input.write("bye\n");
    await session;

    expect(output).toContain("Por favor ingrese su nombre");
    expect(output).toContain("Hola Ana!");
    expect(output).toContain("Adiós fue un gusto atenderte!");
  });
});
