# Shop 502 TUI

Prueba de concepto de una interfaz de texto para manejar el carrito de un
usuario anónimo. El proyecto usa TypeScript, Node.js y Vitest.

## Desarrollo local

Se requiere Node.js 22 o superior.

```bash
npm ci
npm run typecheck
npm run test:coverage
npm run build
```

El build compilado se genera en `dist/`.

## Pipeline CI/CD

El workflow `.github/workflows/ci-cd.yml` se ejecuta en pull requests hacia
`main` y en cada push a `main`. La etapa de CI instala desde el lockfile,
comprueba tipos, exige los umbrales de cobertura configurados en Vitest y
genera el build.

Después de un push a `main` —incluido el merge de una pull request— la etapa
de CD solo se ejecuta si CI terminó correctamente. Publica `dist/` como un
GitHub Actions artifact llamado `shop502-tui-<commit SHA>`, con retención de
30 días.

Para cumplir GitHub Flow, en la configuración del repositorio se debe crear
una ruleset o regla de protección para `main` con estas opciones:

- requerir pull request antes de hacer merge;
- requerir al menos una aprobación;
- impedir que quien creó la PR apruebe sus propios cambios;
- requerir que el check `Tests, coverage and build` finalice correctamente;
- bloquear pushes directos y aplicar la regla también a administradores.

La protección de ramas es una configuración del repositorio en GitHub y no
puede imponerse desde un workflow versionado dentro del mismo repositorio.
