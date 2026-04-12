# Cursor / contributor conventions

When adding or editing React code in this repo, follow the patterns already used under `src/components/`.

## Components and functions: arrow functions

- **React components** must be declared as `const` arrow functions, not `function` declarations.

  ```tsx
  const MyComponent = (props: MyComponentProps) => {
    return <div />
  }
  ```

- **Helpers and local utilities** in the same file should also use arrow functions unless you are matching an existing exception in that file.

- Prefer **explicit props typing** (`type` or `interface` for props) next to the component, consistent with neighboring files in the same folder.

## Mirror `src/components/` structure and naming

- **Folders**
  - `src/components/ui/` — low-level UI primitives (buttons, inputs, charts shell, etc.). Prefer extending these rather than duplicating styles.
  - `src/components/charts/` — chart compositions built on Recharts + shared chart UI.
  - `src/components/modals/` — dialog-based flows and reusable modal shells.
  - `src/components/` (root) — feature-level pieces that do not belong in the subfolders above.

- **File names** — kebab-case, matching the dominant style in each area (e.g. `status-details-modal.tsx`, `pie-charts.tsx`, `file-item.tsx`).

- **Component names** — PascalCase, aligned with the file purpose (e.g. `StatusDetailsModal` in `status-details-modal.tsx`).

- **Exports** — match the folder: many chart/page-style components use `export default`; shared building blocks often use named exports (`export { ReusableDialog }`). When in doubt, copy the pattern from the closest existing file in that directory.

## Imports

- Use the `@/` path alias (e.g. `@/components/ui/card`, `@/lib/utils`) instead of deep relative paths when importing across `src/`.
- For imports **within** the same feature subtree, relative imports like `../ui/card` are acceptable when that matches nearby files.

## Types

- Export shared prop/types from the component file when they are reused (`export type FooProps = …`).
- Keep domain types with interfaces/hooks where the project already places them (e.g. `@/interfaces/`).

---

Ask the agent or reviewer to treat this file as the source of truth for component shape and file placement when generating new UI.
