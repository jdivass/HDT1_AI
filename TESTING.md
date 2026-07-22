# Testing (TDD) — Shop 502 TUI

Este proyecto sigue TDD (Red → Green → Refactor) para la lógica de negocio
del carrito. Los tests se escribieron primero para describir el comportamiento
esperado y las implementaciones actuales completan la fase Green/Refactor.

## Nota sobre cómo adaptamos TDD

El TDD "clásico" (Kent Beck) es un ciclo corto hecho por una sola persona:
escribir un test, verlo fallar, implementar lo mínimo para pasarlo,
refactorizar, repetir con el siguiente test — todo en cuestión de minutos.

En este equipo dividimos el trabajo por rol (testing / CI-CD /
implementación), así que ese ciclo persona-por-persona-assertion no aplica
tal cual. Lo que sí mantuvimos, y es lo que consideramos el principio
central de TDD, es que **los tests se escriben antes que el código que
prueban** y describen el comportamiento esperado por adelantado:

- Los tests de `Cart`, `parseCommand` y `formatCartLines` se commitearon
  contra stubs que fallan a propósito (fase Red), antes de que existiera
  la implementación real.
- La implementación (fase Green) se hace después, en PRs separados, contra
  el contrato que los tests ya definieron — sin cambiar los tests para que
  "pasen fácil".
- El refactor ocurre con los tests como red de seguridad: cualquier cambio
  posterior a la lógica del carrito debe seguir pasando la misma suite.

Es TDD adaptado a nivel de PR/feature en vez de TDD estricto a nivel de
assertion individual — una decisión consciente para encajar con la
división de roles del equipo, no un malentendido del concepto.

## Flujo de trabajo

1. **Red**: escribe un test que describa el nuevo comportamiento y confirma
   que falla por la razón esperada.
2. **Green**: implementa el método/función mínimo necesario en `src/` para
   que el siguiente test (o grupo de tests) pase. No implementes de más.
3. **Refactor**: con los tests en verde, limpia el código sin cambiar
   comportamiento. Vuelve a correr `npm test` para confirmar que sigue en
   verde.
4. Repite hasta que todos los archivos de `src/` estén implementados.

## Comandos

```bash
npm install
npm test              # corre todos los tests una vez
npm run test:watch    # modo watch, útil durante el ciclo TDD
npm run test:coverage # corre tests + reporte de cobertura (umbral 80%)
```

## Estructura de los tests

- `tests/cart.test.ts` — unitarios de `Cart`: altas, bajas y cambios de
  cantidad, casos de producto inexistente, inmutabilidad de `getItems()`.
- `tests/parser.test.ts` — unitarios de `parseCommand`: formato
  `"<id> <cantidad>"`, comando `bye`, entradas inválidas.
- `tests/formatter.test.ts` — unitarios de `formatCartLines`: formato de
  salida del carrito.
- `tests/integration.test.ts` — reproduce paso a paso la transcripción del
  mock de UX/PO, incluyendo la secuencia completa de principio a fin.
- `tests/index.test.ts` — valida el loop de la TUI, entradas inválidas y la
  conexión con streams reales de Node.

## Nota sobre el mock

El mock de UX muestra `> 12345 5` como entrada pero `- 1234 con 5
unidades` en la salida (falta un dígito). Los tests asumen que es un typo
y usan el id consistente (`12345`) en la salida. Si el PO confirma que es
intencional, hay que ajustar `formatter.ts` y `tests/formatter.test.ts`
en consecuencia.

## Cobertura

El umbral configurado en `vitest.config.ts` es 80% (líneas, funciones,
branches y statements) sobre `src/**/*.ts`. Con la lógica de `Cart`,
`parseCommand` y `formatCartLines` completamente implementada, los tests
actuales ya cubren el 100% de esos tres archivos — sobra margen para el
código de la TUI en sí (loop de lectura de stdin, mensajes, etc.), que
también debería tener sus propios tests si agrega lógica no trivial.
