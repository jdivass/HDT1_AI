#!/usr/bin/env node

import { createInterface, Interface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { pathToFileURL } from "node:url";
import type { Readable, Writable } from "node:stream";
import { Cart } from "./cart.js";
import { formatCartLines } from "./formatter.js";
import { parseCommand } from "./parser.js";

export interface TuiIO {
  read(prompt: string): Promise<string | null>;
  write(line: string): void;
}

export async function runTui(io: TuiIO): Promise<void> {
  let namePrompt = "| Por favor ingrese su nombre.\n> ";
  let firstName: string | null = null;

  while (firstName === null) {
    const rawName = await io.read(namePrompt);
    if (rawName === null) return;

    firstName = sanitizeFirstName(rawName);
    namePrompt = "| El nombre no puede estar vacío.\n| Por favor ingrese su nombre.\n> ";
  }

  const cart = new Cart();
  let prompt = `| Hola ${firstName}! Que deseas modificar en tu carrito?\n> `;

  while (true) {
    const rawInput = await io.read(prompt);
    if (rawInput === null) return;

    const command = parseCommand(rawInput);
    if (command.kind === "exit") {
      io.write("| Adiós fue un gusto atenderte!");
      return;
    }

    if (command.kind === "invalid") {
      prompt = `| Entrada inválida: ${command.reason}\n| Intenta de nuevo.\n> `;
      continue;
    }

    const result = cart.applyOperation(command.productId, command.quantity);
    if (result.status === "not_found") {
      prompt =
        `| Oops parece que no tienes el producto ${command.productId} ` +
        "agregado a tu carrito. Que más deseas hacer?\n> ";
      continue;
    }

    if (result.cart.length === 0) {
      prompt = "| Tu carrito está vacío, que más deseas hacer?\n> ";
      continue;
    }

    const items = formatCartLines(result.cart)
      .map((line) => `| ${line}`)
      .join("\n");
    prompt = `| Tu carrito es:\n${items}\n| Que más deseas hacer?\n> `;
  }
}

function sanitizeFirstName(rawName: string): string | null {
  const sanitized = rawName
    .replace(/[\u0000-\u001f\u007f-\u009f]/g, " ")
    .trim()
    .replace(/\s+/g, " ");

  return sanitized === "" ? null : sanitized.split(" ")[0].slice(0, 80);
}

class ConsoleIO implements TuiIO {
  private readonly readline: Interface;

  constructor(
    input: Readable,
    private readonly output: Writable,
  ) {
    this.readline = createInterface({ input, output });
  }

  async read(prompt: string): Promise<string | null> {
    try {
      return await this.readline.question(prompt);
    } catch (error: unknown) {
      if (isReadlineClosedError(error)) return null;
      throw error;
    }
  }

  write(line: string): void {
    this.output.write(`${line}\n`);
  }

  close(): void {
    this.readline.close();
  }
}

function isReadlineClosedError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ERR_USE_AFTER_CLOSE"
  );
}

export async function runConsoleTui(
  input: Readable = stdin,
  output: Writable = stdout,
): Promise<void> {
  const io = new ConsoleIO(input, output);
  try {
    await runTui(io);
  } finally {
    io.close();
  }
}

const entryPoint = process.argv[1];
if (entryPoint && import.meta.url === pathToFileURL(entryPoint).href) {
  runConsoleTui().catch(() => {
    stdout.write("| Ocurrió un error inesperado. Intenta nuevamente.\n");
    process.exitCode = 1;
  });
}
