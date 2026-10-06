import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // 1. Borrowers (1:1 with existing users table)
  await db.schema
    .createTable('borrowers')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('user_id', 'integer', (col) =>
      col.references('users.id').onDelete('cascade').notNull().unique()
    )
    .addColumn('card_number', 'varchar(100)', (col) => col.notNull().unique())
    .addColumn('phone', 'varchar(50)')
    .addColumn('address', 'text')
    .addColumn('status', 'varchar(50)', (col) => col.notNull().defaultTo('active'))
    .addColumn('membership_expiry', 'date')
    .execute();

  // 2. Authors
  await db.schema
    .createTable('authors')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('bio', 'text')
    .execute();

  // 3. Genres
  await db.schema
    .createTable('genres')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(100)', (col) => col.notNull().unique())
    .addColumn('description', 'text')
    .execute();

  // 4. Books
  await db.schema
    .createTable('books')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('isbn', 'varchar(50)', (col) => col.notNull().unique())
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .addColumn('publication_year', 'integer')
    .addColumn('publisher', 'varchar(255)')
    .addColumn('summary', 'text')
    .execute();

  // 5. Book Authors (Junction table)
  await db.schema
    .createTable('book_authors')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('book_id', 'integer', (col) =>
      col.references('books.id').onDelete('cascade').notNull()
    )
    .addColumn('author_id', 'integer', (col) =>
      col.references('authors.id').onDelete('cascade').notNull()
    )
    .addColumn('role', 'varchar(100)')
    .execute();

  // 6. Book Genres (Junction table)
  await db.schema
    .createTable('book_genres')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('book_id', 'integer', (col) =>
      col.references('books.id').onDelete('cascade').notNull()
    )
    .addColumn('genre_id', 'integer', (col) =>
      col.references('genres.id').onDelete('cascade').notNull()
    )
    .execute();

  // 7. Book Copies (Physical Inventory)
  await db.schema
    .createTable('book_copies')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('book_id', 'integer', (col) =>
      col.references('books.id').onDelete('cascade').notNull()
    )
    .addColumn('barcode', 'varchar(100)', (col) => col.notNull().unique())
    .addColumn('status', 'varchar(50)', (col) => col.notNull().defaultTo('available'))
    .addColumn('condition', 'varchar(50)')
    .execute();

  // 8. Loans (Circulation transactions)
  await db.schema
    .createTable('loans')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('borrower_id', 'integer', (col) =>
      col.references('borrowers.id').onDelete('cascade').notNull()
    )
    .addColumn('copy_id', 'integer', (col) =>
      col.references('book_copies.id').onDelete('cascade').notNull()
    )
    .addColumn('loan_date', 'timestamp', (col) =>
      col.defaultTo(sql`NOW()`).notNull()
    )
    .addColumn('due_date', 'date', (col) => col.notNull())
    .addColumn('return_date', 'timestamp')
    .addColumn('status', 'varchar(50)', (col) => col.notNull().defaultTo('active'))
    .addColumn('fine_amount', 'numeric(10, 2)', (col) => col.defaultTo(0))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop tables in reverse dependency order
  await db.schema.dropTable('loans').execute();
  await db.schema.dropTable('book_copies').execute();
  await db.schema.dropTable('book_genres').execute();
  await db.schema.dropTable('book_authors').execute();
  await db.schema.dropTable('books').execute();
  await db.schema.dropTable('genres').execute();
  await db.schema.dropTable('authors').execute();
  await db.schema.dropTable('borrowers').execute();
}
