---
name: kysely-migration-generator
description: Consumes a Mermaid ERD diagram and translates it into a type-safe Kysely database migration file
---

# Kysely Migration Generator Skill

Translate a Mermaid ERD (`docs/architecture/schema.mmd`) into a Kysely TypeScript migration using `src/db/migrations/001_initial_schema.ts` as the standard baseline syntax.

## Translation Rules & Guardrails

1. **Entities -> Tables:** Map Mermaid entities to `snake_case` table names (e.g., `USERS` -> `users`, `BOOK_AUTHORS` -> `book_authors`). Note existing tables (such as `users`) should not be recreated.
2. **Keys & Columns:**
   * Convert `PK` attributes to auto-generating integer primary keys (`addColumn('id', 'serial', (col) => col.primaryKey())`).
   * Convert `FK` attributes to typed foreign keys with `.references('<table.column>').onDelete('cascade')`.
   * Convert `UK` attributes to `.unique()`.
3. **Cardinalities:**
   * Map `||--o{` (one-to-many) as standard foreign keys.
   * Map `||--o|` (one-to-one) with a `UNIQUE` constraint on the foreign key column.
4. **File Output:** Write the generated TypeScript migration to `src/db/migrations/<timestamp>_<migration_name>.ts` or `src/db/migrations/002_<migration_name>.ts`.
5. **Structure & Dependencies:**
   * Enforce exports for both `up(db: Kysely<any>): Promise<void>` and `down(db: Kysely<any>): Promise<void>`.
   * Create tables in order of dependencies in `up()`.
   * The `down()` function must drop tables in reverse dependency order.