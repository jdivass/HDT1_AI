# AGENTS.md — Shop 502 TUI

## Vistazo general
POC de una TUI (Text User Interface) para el carrito de compras de un
usuario anónimo en Shop 502. El usuario ingresa su nombre y comandos
`<id_producto> <cantidad>` para agregar/quitar unidades; `bye` termina la
sesión. Stack: TypeScript + Node.js, tests con Vitest.

Estructura:
- `src/types.ts` — tipos del dominio
- `src/cart.ts` — lógica de altas/bajas/cambios del carrito
- `src/parser.ts` — parseo de la entrada del usuario
- `src/formatter.ts` — formato de salida del carrito
- `src/index.ts` — loop de la TUI y adaptador de stdin/stdout
- `tests/` — suite Vitest (unit + integración)

## Comandos para testear y buildear
```bash
npm install
npm test                 # correr tests
npm run test:watch       # modo watch (TDD)
npm run test:coverage    # tests + cobertura (umbral 80%)
npx tsc --noEmit         # chequeo de tipos
```

## Guías de estilo de código
- TypeScript en modo `strict`; evitar `any` sin justificar.
- Un módulo = una responsabilidad (no mezclar parsing con lógica de carrito).
- Nombres de funciones/variables en inglés; mensajes de usuario y
  comentarios de dominio en español.
- Sin dependencias nuevas sin necesidad clara.

## Instrucciones para testear
- Metodología: TDD adaptado a nivel de PR (test-first, no ciclo estricto
  por assertion — detalle en `TESTING.md`).
- Los tests existentes describen el comportamiento esperado; no los
  edites para que "pasen fácil".
- Toda función o lógica nueva necesita test antes de mergear.
- Umbral de cobertura: 80% (branches, functions, lines, statements) sobre
  `src/`.
- No mergear a `main` sin PR aprobado por otro dev y sin `npm test` en verde.

## Estándares de seguridad
- Nunca commitear credenciales, tokens o archivos `.env`.
- Validar y sanitizar toda entrada de stdin antes de procesarla (id de
  producto, cantidad).
- No loguear ni persistir datos personales del usuario más allá del
  nombre en memoria de sesión.
- No exponer stack traces ni errores internos al usuario final de la TUI.
- Mantener dependencias sin vulnerabilidades conocidas (`npm audit`).
